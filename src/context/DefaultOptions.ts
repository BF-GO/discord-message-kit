import type { Options } from '../types.js'

const avatarThemes = {
	blue: ['#5865f2', '#9aa4ff'],
	gray: ['#6d7787', '#b6beca'],
	green: ['#2eaa72', '#83e0b0'],
	orange: ['#df8b2f', '#ffc177'],
	red: ['#d94b5d', '#ff8c9a'],
} as const

function avatarDataUri([base, shine]: readonly [string, string]) {
	const svg = [
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">',
		`<rect width="80" height="80" rx="40" fill="${base}"/>`,
		`<circle cx="28" cy="28" r="18" fill="${shine}" opacity=".9"/>`,
		'<path d="M18 61c7-12 17-18 30-18 8 0 15 3 21 9v9z" fill="#151820" opacity=".28"/>',
		'<circle cx="31" cy="35" r="5" fill="#ffffff" opacity=".88"/>',
		'<circle cx="52" cy="35" r="5" fill="#ffffff" opacity=".88"/>',
		'</svg>',
	].join('')

	return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export const defaultAvatars = Object.fromEntries(
	Object.entries(avatarThemes).map(([name, colors]) => [name, avatarDataUri(colors)]),
) as Record<keyof typeof avatarThemes, string>

const DefaultOptions: Options = {
	avatars: {
		...defaultAvatars,
		default: defaultAvatars.blue,
	},
	defaultMode: 'comfy',
	defaultTheme: 'dark',
	disableFont: true,
	profiles: {},
}

export default DefaultOptions
