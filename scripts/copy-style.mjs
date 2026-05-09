import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

await mkdir(resolve(root, 'dist'), { recursive: true })
await copyFile(resolve(root, 'src/style.css'), resolve(root, 'dist/style.css'))

for (const file of ['index.js', 'index.cjs']) {
	const path = resolve(root, 'dist', file)
	const contents = await readFile(path, 'utf8')

	if (!contents.startsWith('"use client";')) {
		await writeFile(path, `"use client";\n${contents}`)
	}
}
