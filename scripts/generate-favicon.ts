import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// SVG definition
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="crimson" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3b5c"/>
      <stop offset="100%" stop-color="#d12c4b"/>
    </linearGradient>
    <linearGradient id="shieldFill" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#18161f"/>
      <stop offset="100%" stop-color="#0e0d12"/>
    </linearGradient>
    <linearGradient id="tileBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#141318"/>
      <stop offset="100%" stop-color="#0b0b0e"/>
    </linearGradient>
  </defs>

  <!-- Base Obsidian Rounded Tile -->
  <rect x="1.5" y="1.5" width="61" height="61" rx="14" fill="url(#tileBg)" stroke="#d12c4b" stroke-width="1.5" stroke-opacity="0.35"/>

  <!-- Cyber Defense Shield (Red Accent Silhouette) -->
  <path d="M32 9.5 L50 17 V32 C50 44.5 32 54.5 32 54.5 C32 54.5 14 44.5 14 32 V17 Z" 
        fill="url(#shieldFill)" 
        stroke="url(#crimson)" 
        stroke-width="3" 
        stroke-linejoin="round"/>

  <!-- Terminal Command Chevron (High-contrast cyber white) -->
  <path d="M26 23 L35.5 31.5 L26 40" 
        fill="none" 
        stroke="#f2eeea" 
        stroke-width="3.5" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>

  <!-- Red Team Terminal Pulse / Cursor Bar -->
  <line x1="39" y1="39" x2="43.5" y2="39" 
        stroke="url(#crimson)" 
        stroke-width="3.5" 
        stroke-linecap="round"/>
</svg>`;

// Function to construct a multi-size ICO from PNG buffers
function createIco(pngBuffers: Buffer[]): Buffer {
  // ICO header: 6 bytes
  // 2 bytes: reserved (0)
  // 2 bytes: image type (1 = icon)
  // 2 bytes: number of images
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngBuffers.length, 4);

  // Directory entries: 16 bytes per image
  const entries: Buffer[] = [];
  let offset = 6 + pngBuffers.length * 16;

  for (const png of pngBuffers) {
    // Read PNG width & height (IHDR chunk is at byte 12-24)
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);

    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // color palette (0 = no palette)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8); // image data size
    entry.writeUInt32LE(offset, 12); // image data offset

    entries.push(entry);
    offset += png.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function main() {
  const publicDir = path.join(process.cwd(), 'public');
  const appDir = path.join(process.cwd(), 'app');

  // Save SVG
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent.trim());
  fs.writeFileSync(path.join(appDir, 'icon.svg'), svgContent.trim());
  console.log('Saved SVG icon to public/icon.svg and app/icon.svg');

  const svgBuffer = Buffer.from(svgContent);

  // Generate PNGs
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();

  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
  console.log('Saved apple-touch-icon.png, icon-192.png, icon-512.png');

  // Create multi-res ICO (16x16, 32x32, 48x48)
  const icoBuffer = createIco([png16, png32, png48]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  console.log('Saved multi-resolution favicon.ico to public/ and app/');
}

main().catch(console.error);
