# Setup

How to get this repository onto a machine and confirm it is intact.

## Requirements

| Requirement | Notes |
|---|---|
| [Git](https://git-scm.com/) | Any recent version |
| A text editor | VS Code, Notepad++, Vim, etc. Most read `.editorconfig` natively or via a plugin |
| Node.js + npm | Only needed to run the learning site or the content tooling. Reading and editing the curriculum requires neither |

## Clone

```powershell
git clone <repository-url> "CS Roadmap"
cd "CS Roadmap"
```

If you already have the folder, just open a terminal in it.

## Verify the checkout

Confirm line endings were normalized on checkout (should print `0`):

```powershell
$b = [System.IO.File]::ReadAllBytes('README.md')
($b | Where-Object { $_ -eq 13 }).Count
```

Confirm the working tree is clean:

```powershell
git --no-pager status --short
```

List the tracked files:

```powershell
git --no-pager ls-files
```

## Editor configuration

`.editorconfig` sets UTF-8, LF, final newline, and trimming rules automatically. If your editor does not pick it up:

- **VS Code:** install the *EditorConfig for VS Code* extension.
- **Others:** most editors support EditorConfig out of the box or via a plugin.

## Where to start reading

1. [`../README.md`](../README.md) — project overview.
2. [`../career-roadmaps/README.md`](../career-roadmaps/README.md) — the study strategy.
3. [`../career-roadmaps/shared/anti-burnout-rules.md`](../career-roadmaps/shared/anti-burnout-rules.md) — how to pace yourself.