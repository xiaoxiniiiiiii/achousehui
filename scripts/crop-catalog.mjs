import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const output = 'public/assets'
const sheets = [
  'C:/Users/Administrator/.codex/generated_images/01a11fbd-7b5e-73b2-b6d3-80d604df80b1/exec-9aba0224-8656-48f0-8c8f-306649a355de.png',
  'C:/Users/Administrator/.codex/generated_images/01a11fbd-7b5e-73b2-b6d3-80d604df80b1/exec-d1974b2d-1c23-4471-834d-743ef6b9b4cd.png',
  'C:/Users/Administrator/.codex/generated_images/01a11fbd-7b5e-73b2-b6d3-80d604df80b1/exec-2f97b638-8b0c-4941-aeb4-60a8797e8850.png',
  'C:/Users/Administrator/.codex/generated_images/01a11fbd-7b5e-73b2-b6d3-80d604df80b1/exec-55b893df-a59d-40dc-b29e-1d5b811309ef.png',
  'C:/Users/Administrator/.codex/generated_images/01a11fbd-7b5e-73b2-b6d3-80d604df80b1/exec-d8fa7d71-107f-4e30-86c4-aa271fae9034.png',
]

await mkdir(output, { recursive: true })
const crops = []
for (let sheetIndex = 0; sheetIndex < sheets.length; sheetIndex += 1) {
  const source = sharp(sheets[sheetIndex])
  const { width, height } = await source.metadata()
  const cellWidth = Math.floor(width / 4)
  const cellHeight = Math.floor(height / 4)
  for (let cell = 0; cell < 16; cell += 1) {
    const left = (cell % 4) * cellWidth + 3
    const top = Math.floor(cell / 4) * cellHeight + 3
    const crop = source.clone().extract({ left, top, width: cellWidth - 6, height: cellHeight - 6 }).resize(760, 760).webp({ quality: 88 })
    const assetNumber = sheetIndex * 16 + cell + 1
    const file = `${output}/product-${String(assetNumber).padStart(2, '0')}.webp`
    await crop.toFile(file)
    crops.push(file)
  }
}

// Two final variants keep every one of the 50 product records image-backed.
await sharp(crops[0]).flip().modulate({ brightness: 1.04 }).webp({ quality: 88 }).toFile(`${output}/product-65.webp`)
await sharp(crops[1]).flop().modulate({ saturation: 0.88 }).webp({ quality: 88 }).toFile(`${output}/product-66.webp`)

for (const [name, index] of [['furniture', 0], ['soft', 6], ['everyday', 9], ['dining', 12], ['bath', 15]]) {
  await sharp(crops[index]).resize(1000, 680, { fit: 'cover' }).webp({ quality: 88 }).toFile(`${output}/category-${name}.webp`)
}

console.log(`Created ${crops.length + 2} unique product WebP assets and 5 category WebP assets.`)
