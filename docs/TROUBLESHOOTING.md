# Troubleshooting

Recovery procedures for the problems this repository has actually hit. Keep this file findable — the first time you need it, you will need it badly.

## Working tree is empty

**Symptom:** `git status` reports "nothing to commit", `git log` shows the last commit, but `career-roadmaps/` and other tracked files are gone from disk.

**Cause:** Usually a chained destructive command (`git rm --cached -r .` followed by `git reset --hard`) run before the current state was committed. The index is cleared and the working tree is reset to HEAD, but files that were never committed disappear.

**Recovery:**

1. Confirm the blobs still exist:

   ```powershell
   git --no-pager fsck --dangling
   ```

   You should see a list of `dangling blob <hash>` lines — one per file that was staged at some point.

2. For each blob, preview its first lines to identify which file it is:

   ```powershell
   git cat-file -p <hash> | Select-Object -First 5
   ```

3. Restore the file:

   ```powershell
   cmd.exe /c "git cat-file blob <hash> > path\to\file.md"
   ```

   The `cmd.exe` redirect preserves bytes. Prefer it over a PowerShell redirect for binary-exact restoration.

4. Verify the hash round-trips:

   ```powershell
   git hash-object --no-filters -- path\to\file.md
   ```

   The output must equal the original blob hash. If it does, the file is byte-exact.

**Prevention:** Never chain destructive Git commands in one shell line. Commit before any bulk file transformation.

## Encoding corruption — literal `?` in text

**Symptom:** Text contains `?` where an em-dash, en-dash, curly quote, or box-drawing character should be. Example: `3?6 months` instead of `3–6 months`.

**Cause:** A lossy UTF-8 → ASCII or UTF-8 → CP1252 conversion replaced non-ASCII bytes with `?`. The original bytes are not recoverable from the corrupted file alone — the surrounding context tells you which character was lost.

**Fix patterns:**

| Pattern | Likely original | Example |
|---|---|---|
| `digit?digit` | en-dash `–` (U+2013) | `3?6` → `3–6` |
| `word ? word` (spaces both sides) | em-dash `—` (U+2014) | `Goal A ? IT` → `Goal A — IT` |
| ` ?word` or `word? ` inside prose | curly quote `“` or `”` | `?no internet,?` → `“no internet,”` |
| `???` at line start in a tree | `├──` / `└──` | `??? README.md` → `├── README.md` |

**Fix procedure** (PowerShell, safe patterns only):

```powershell
$en = [string][char]0x2013   # en-dash
$em = [string][char]0x2014   # em-dash
$files = Get-ChildItem -Recurse -File -Filter *.md
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $c = $c -replace '(?<=\d)\?(?=\d)', $en
    $c = $c -replace ' \? ', (' ' + $em + ' ')
    [System.IO.File]::WriteAllText($f.FullName, $c, (New-Object System.Text.UTF8Encoding($false)))
}
```

Curly quotes and box-drawing characters need manual review, because a `?` can also be a legitimate question mark. Do not apply a blanket replace.

**Prevention:** `.editorconfig` and `.gitattributes` prevent re-introduction on save and commit. Before committing content, search for stray `?`:

```powershell
Get-ChildItem -Recurse -File -Filter *.md | ForEach-Object {
    Select-String -Path $_.FullName -Pattern '\?'
}
```

Expect only legitimate question marks. If a result looks suspicious, check it against the pattern table above.

## Line endings — CRLF snuck back in

**Symptom:** A file on disk contains CR bytes (`\r\n`) despite `.gitattributes`. Diffs show whole-file changes.

**Fix:** Re-materialize the file from Git:

```powershell
Remove-Item -Force path\to\file.md
git checkout -- path\to\file.md
```

**Audit** a file's raw bytes:

```powershell
$b = [System.IO.File]::ReadAllBytes('path\to\file.md')
($b | Where-Object { $_ -eq 13 }).Count   # CR count; 0 for text files
```

## Common Git errors

### `fatal: Unable to create '.../.git/index.lock': File exists`

Another Git process is running, or a previous one was killed. Confirm no Git process is active, then remove the lock:

```powershell
Remove-Item .git\index.lock
```

### `fatal: your current branch 'main' does not have any commits yet`

The repository was initialized but nothing was committed. Stage a file and commit; the error resolves.

### `fatal: --local can only be used inside a git repository`

You ran `git config --local ...` before `git init`, or from outside the repo. `cd` into the repository root first.

### Whole-file diff after a small edit

Almost always a line-ending change. Run `git diff --stat` — if insertions and deletions are equal and match the file's line count, the file's endings flipped. Fix per the section above.

## Race conditions in automation

**Symptom:** A file appears empty or missing during verification, then shows up correctly on a second look. Or a commit that "should have" happened did not.

**Cause:** Two commands running in parallel against the same file — typically a write and a read, or a `git checkout` and a `git add`.

**Fix:** Run dependent operations sequentially in one command. Do not split a write-then-verify pair across two shell invocations.

## Verifying integrity after a fix

Run these checks after any recovery:

```powershell
# 1. Line endings — expect 0 CR bytes per text file
Get-ChildItem -Recurse -File -Filter *.md | ForEach-Object {
    $b = [System.IO.File]::ReadAllBytes($_.FullName)
    $cr = ($b | Where-Object { $_ -eq 13 }).Count
    if ($cr -gt 0) { Write-Output ($_.Name + ' CR=' + $cr) }
}

# 2. UTF-8 validity
Get-ChildItem -Recurse -File -Filter *.md | ForEach-Object {
    $b = [System.IO.File]::ReadAllBytes($_.FullName)
    try { (New-Object System.Text.UTF8Encoding($false,$true)).GetString($b) | Out-Null }
    catch { Write-Output ($_.Name + ' INVALID UTF-8') }
}

# 3. BOM check — expect False for every file
Get-ChildItem -Recurse -File -Filter *.md | ForEach-Object {
    $b = [System.IO.File]::ReadAllBytes($_.FullName)
    $bom = ($b.Length -ge 3 -and $b[0] -eq 0xEF -and $b[1] -eq 0xBB -and $b[2] -eq 0xBF)
    if ($bom) { Write-Output ($_.Name + ' HAS BOM') }
}

# 4. Git state
git --no-pager log --oneline -n 5
git --no-pager status --short
```