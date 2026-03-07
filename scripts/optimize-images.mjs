import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../public/', import.meta.url));

const FOLDERS = [
  { src: 'img/work',  size: 600, quality: 80 },
  { src: 'img/pye',   size: 800, quality: 80 },
  { src: 'img/us',    size: 600, quality: 80 },
];

async function processFolder({ src, size, quality }) {
  const srcDir = join(ROOT, src);
  const outDir = join(ROOT, src.replace('img/', 'img-opt/'));

  await mkdir(outDir, { recursive: true });

  let files;
  try {
    files = await readdir(srcDir);
  } catch {
    console.log(`  Skipped ${src} (not found)`);
    return { processed: 0, skipped: 0 };
  }

  const images = files.filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  let processed = 0;
  let skipped = 0;

  for (const file of images) {
    const { name } = parse(file);
    const outPath = join(outDir, `${name}.webp`);

    try {
      const outStat = await stat(outPath);
      const srcStat = await stat(join(srcDir, file));
      if (outStat.mtimeMs >= srcStat.mtimeMs) {
        skipped++;
        continue;
      }
    } catch {
      // output doesn't exist yet
    }

    await sharp(join(srcDir, file))
      .resize(size, size, { fit: 'cover', withoutEnlargement: true })
      .webp({ quality })
      .toFile(outPath);

    processed++;
  }

  return { processed, skipped };
}

console.log('Optimizing images...\n');

let totalProcessed = 0;
let totalSkipped = 0;

for (const folder of FOLDERS) {
  const { processed, skipped } = await processFolder(folder);
  totalProcessed += processed;
  totalSkipped += skipped;
  console.log(`  ${folder.src}: ${processed} optimized, ${skipped} cached`);
}

console.log(`\nDone — ${totalProcessed} images optimized, ${totalSkipped} cached.\n`);
