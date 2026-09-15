// Throwaway: byte-level encoding check for edited files.
import fs from 'node:fs';

const files = process.argv.slice(2);
const HEX = (b) => [...b].map((x) => x.toString(16).padStart(2, '0')).join(' ');
// CP1252 mis-decode fingerprints of a UTF-8 em-dash (E2 80 94) / en-dash (E2 80 93)
// / curly quotes (E2 80 98/99/9C/9D): these appear as C3 A2 C2 80 ... (double-encoded).
const MOJIBAKE = [
  [0xc3, 0xa2, 0xc2, 0x80], // "â€" family
  [0xef, 0xbf, 0xbd], // U+FFFD replacement char
];

for (const f of files) {
  const buf = fs.readFileSync(f);
  const bom = buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf;
  const cr = [...buf].filter((b) => b === 0x0d).length;
  let moji = 0;
  for (let i = 0; i + 4 <= buf.length; i++) {
    for (const pat of MOJIBAKE) {
      if (pat.every((b, k) => buf[i + k] === b)) moji++;
    }
  }
  // Decode and confirm the real typographic chars are present and well-formed.
  const text = buf.toString('utf8');
  const hasReplacement = text.includes('\uFFFD');
  const roundTrip = Buffer.from(text, 'utf8').equals(buf);
  console.log(
    `${f}\n  BOM=${bom ? 'PRESENT (BAD)' : 'none'}  CR_bytes=${cr}  ` +
      `mojibake_hits=${moji}  U+FFFD=${hasReplacement}  utf8_roundtrip=${roundTrip}  ` +
      `em=${(text.match(/\u2014/g) || []).length} en=${(text.match(/\u2013/g) || []).length} ` +
      `curly=${(text.match(/[\u2018\u2019\u201C\u201D]/g) || []).length}`
  );
  if (bom || cr || moji || hasReplacement || !roundTrip) console.log(`  !! ${f} FAILED`);
}