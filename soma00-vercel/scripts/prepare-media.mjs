import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, open, readFile, rename, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const partsDirectory = new URL('../assets/media/simulation/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('manifest.json', partsDirectory), 'utf8'));
const destination = new URL(`../public/media/${manifest.file}`, import.meta.url);

async function checksum(path) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest('hex');
}

let existingChecksum;
try {
  existingChecksum = await checksum(destination);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

if (existingChecksum === manifest.sha256) {
  console.log('Original simulation video verified.');
} else {
  await mkdir(new URL('../public/media/', import.meta.url), { recursive: true });
  const temporary = `${fileURLToPath(destination)}.assembly-${process.pid}`;
  try {
    const output = await open(temporary, 'wx');
    const hash = createHash('sha256');
    let bytes = 0;
    try {
      for (const part of manifest.parts) {
        for await (const chunk of createReadStream(new URL(part, partsDirectory))) {
          hash.update(chunk);
          bytes += chunk.length;
          await output.writeFile(chunk);
        }
      }
    } finally {
      await output.close();
    }
    if (bytes !== manifest.bytes || hash.digest('hex') !== manifest.sha256) {
      throw new Error('Simulation video integrity check failed. Restore the media parts before building.');
    }
    await rename(temporary, destination);
    console.log(`Original simulation video assembled and verified (${bytes} bytes).`);
  } finally {
    await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; });
  }
}
