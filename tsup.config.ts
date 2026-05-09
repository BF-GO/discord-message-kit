import { defineConfig } from 'tsup'

export default defineConfig({
	clean: true,
	dts: true,
	entry: ['src/index.ts'],
	external: ['react', 'react-dom'],
	format: ['esm', 'cjs'],
	outExtension({ format }) {
		return {
			js: format === 'cjs' ? '.cjs' : '.js',
		}
	},
	sourcemap: true,
	splitting: false,
	target: 'es2020',
	treeshake: true,
})
