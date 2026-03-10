import sharp from 'sharp';
import { readdir, mkdir, stat, copyFile, unlink } from 'node:fs/promises';
import { join, parse, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../public/', import.meta.url));

// ── 1. Thumbnail generation (source → img-opt/ as webp) ────────────────
const THUMBNAIL_FOLDERS = [
  { src: 'img/work',  size: 600, quality: 80 },
  { src: 'img/pye',   size: 800, quality: 80 },
  { src: 'img/us',    size: 600, quality: 80 },
];

async function generateThumbnails({ src, size, quality }) {
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
    } catch { /* output doesn't exist yet */ }

    await sharp(join(srcDir, file))
      .resize(size, size, { fit: 'cover', withoutEnlargement: true })
      .webp({ quality })
      .toFile(outPath);

    processed++;
  }

  return { processed, skipped };
}

// ── 2. In-place optimization for directly-used images ───────────────────
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const JPEG_QUALITY = 85;
const PNG_QUALITY = 80;
const SIZE_THRESHOLD = 500 * 1024; // 500 KB

const OPTIMIZE_FOLDERS = [
  'img/prod-gene',
  'img/banksy',
  'img/btl',
  'img/carnavalito',
  'img/creatividad',
  'img/editoriales',
  'img/ghost-producers',
  'img/libreria-nacional',
  'img/nicolas-jaar',
  'img/nicolas-jaar/carousel',
  'img/produccion-tecnica',
  'img/rito-primavera',
  'img/work/saturnalia',
  'img/work/cnc',
  'img/work/fast',
  'img/work/parking',
  'social',
  'social/logos',
];

async function optimizeInPlace(folder) {
  const dir = join(ROOT, folder);

  let files;
  try {
    files = await readdir(dir);
  } catch {
    console.log(`  Skipped ${folder} (not found)`);
    return { processed: 0, skipped: 0, savedMB: 0 };
  }

  const images = files.filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  let processed = 0;
  let skipped = 0;
  let savedBytes = 0;

  for (const file of images) {
    const filePath = join(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.size < SIZE_THRESHOLD) {
      skipped++;
      continue;
    }

    const ext = extname(file).toLowerCase();
    const image = sharp(filePath);
    const meta = await image.metadata();

    const needsResize = (meta.width > MAX_WIDTH) || (meta.height > MAX_HEIGHT);

    let pipeline = sharp(filePath);

    if (needsResize) {
      pipeline = pipeline.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    const tmpPath = filePath + '.tmp' + ext;
    try {
      if (ext === '.png') {
        await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toFile(tmpPath);
      } else {
        await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(tmpPath);
      }

      const tmpStat = await stat(tmpPath);
      if (tmpStat.size < fileStat.size) {
        await copyFile(tmpPath, filePath);
        await unlink(tmpPath);
        savedBytes += fileStat.size - tmpStat.size;
        processed++;
      } else {
        await unlink(tmpPath);
        skipped++;
      }
    } catch (err) {
      try { await unlink(tmpPath); } catch { /* ignore */ }
      console.log(`   Warning: could not optimize ${file}: ${err.message}`);
      skipped++;
    }
  }

  return { processed, skipped, savedMB: (savedBytes / 1024 / 1024).toFixed(2) };
}

// ── 3. Also optimize root-level images ──────────────────────────────────
async function optimizeRootImages() {
  const dir = join(ROOT, 'img');
  let files;
  try {
    files = await readdir(dir);
  } catch { return { processed: 0, skipped: 0, savedMB: '0' }; }

  const images = files.filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  let processed = 0;
  let skipped = 0;
  let savedBytes = 0;

  for (const file of images) {
    const filePath = join(dir, file);
    const fileStat = await stat(filePath);
    if (fileStat.size < SIZE_THRESHOLD) { skipped++; continue; }

    const ext = extname(file).toLowerCase();
    let pipeline = sharp(filePath).resize(MAX_WIDTH, MAX_HEIGHT, {
      fit: 'inside',
      withoutEnlargement: true,
    });

    const tmpPath = filePath + '.tmp' + ext;
    try {
      if (ext === '.png') {
        await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toFile(tmpPath);
      } else {
        await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(tmpPath);
      }

      const tmpStat = await stat(tmpPath);
      if (tmpStat.size < fileStat.size) {
        await copyFile(tmpPath, filePath);
        await unlink(tmpPath);
        savedBytes += fileStat.size - tmpStat.size;
        processed++;
      } else {
        await unlink(tmpPath);
        skipped++;
      }
    } catch (err) {
      try { await unlink(tmpPath); } catch { /* ignore */ }
      console.log(`   Warning: could not optimize ${file}: ${err.message}`);
      skipped++;
    }
  }
  return { processed, skipped, savedMB: (savedBytes / 1024 / 1024).toFixed(2) };
}

// ── Run ─────────────────────────────────────────────────────────────────
console.log('=== Image optimization ===\n');

console.log('1) Generating thumbnails (WebP)...');
let thumbProcessed = 0;
let thumbSkipped = 0;
for (const folder of THUMBNAIL_FOLDERS) {
  const { processed, skipped } = await generateThumbnails(folder);
  thumbProcessed += processed;
  thumbSkipped += skipped;
  console.log(`   ${folder.src}: ${processed} optimized, ${skipped} cached`);
}
console.log(`   Thumbnails: ${thumbProcessed} new, ${thumbSkipped} cached\n`);

console.log('2) Optimizing in-place (large images)...');
let totalOptimized = 0;
let totalSavedMB = 0;
for (const folder of OPTIMIZE_FOLDERS) {
  const { processed, skipped, savedMB } = await optimizeInPlace(folder);
  if (processed > 0) {
    console.log(`   ${folder}: ${processed} optimized (saved ${savedMB} MB)`);
  }
  totalOptimized += processed;
  totalSavedMB += parseFloat(savedMB);
}

const rootResult = await optimizeRootImages();
if (rootResult.processed > 0) {
  console.log(`   img/ (root): ${rootResult.processed} optimized (saved ${rootResult.savedMB} MB)`);
}
totalOptimized += rootResult.processed;
totalSavedMB += parseFloat(rootResult.savedMB);

console.log(`   Total: ${totalOptimized} images optimized, saved ${totalSavedMB.toFixed(2)} MB\n`);

console.log('Done!\n');
