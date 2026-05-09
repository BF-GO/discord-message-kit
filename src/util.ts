import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'
import type { Options, Timestamp, TimestampFormat, TimestampOptions } from './types.js'

interface SlotProps {
	slot?: string
}

export function classNames(...classes: Array<false | null | string | undefined>) {
	return classes.filter(Boolean).join(' ')
}

export function splitSlots<TSlot extends string>(children: ReactNode, names: readonly TSlot[]) {
	const acceptedSlots = new Set<string>(names)
	const body: ReactNode[] = []
	const slots = Object.fromEntries(names.map(name => [name, []])) as unknown as Record<TSlot, ReactElement[]>

	Children.forEach(children, child => {
		if (!isValidElement<SlotProps>(child) || !child.props.slot) {
			body.push(child)
			return
		}

		const slot = child.props.slot as TSlot
		if (!acceptedSlots.has(slot)) {
			body.push(child)
			return
		}

		slots[slot].push(child)
	})

	return { body, slots }
}

function formatAbsoluteTimestamp(date: Date, format: TimestampFormat, options: TimestampOptions = {}) {
	const dateStyle: Intl.DateTimeFormatOptions['dateStyle'] =
		format === 'D' || format === 'f' || format === 'F' ? 'long' : 'short'
	const timeStyle: Intl.DateTimeFormatOptions['timeStyle'] =
		format === 'T' || format === 'S' ? 'medium' : 'short'
	const timeZone = options.timeZone

	if (format === 't' || format === 'T') {
		return new Intl.DateTimeFormat(options.locale, { timeStyle, timeZone }).format(date)
	}

	if (format === 'd' || format === 'D') {
		return new Intl.DateTimeFormat(options.locale, { dateStyle, timeZone }).format(date)
	}

	if (format === 'F') {
		return new Intl.DateTimeFormat(options.locale, {
			dateStyle: 'full',
			timeStyle: 'short',
			timeZone,
		}).format(date)
	}

	return new Intl.DateTimeFormat(options.locale, { dateStyle, timeStyle, timeZone }).format(date)
}

function formatRelativeTimestamp(date: Date, options: TimestampOptions = {}) {
	const diffInSeconds = Math.round((date.valueOf() - Date.now()) / 1000)
	const abs = Math.abs(diffInSeconds)
	const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
		['year', 31536000],
		['month', 2592000],
		['week', 604800],
		['day', 86400],
		['hour', 3600],
		['minute', 60],
		['second', 1],
	]
	const [unit, seconds] = units.find(([, value]) => abs >= value) || units[units.length - 1]
	const value = Math.round(diffInSeconds / seconds)

	return new Intl.RelativeTimeFormat(options.locale, { numeric: 'auto' }).format(value, unit)
}

export function parseTimestamp(timestamp: Timestamp = new Date(), options: TimestampOptions = {}) {
	const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
	if (Number.isNaN(date.valueOf())) return ''

	const format = options.timestampFormat || 'd'
	return format === 'R'
		? formatRelativeTimestamp(date, options)
		: formatAbsoluteTimestamp(date, format, options)
}

export function parseDiscordTimestamp(timestamp: string | number, options: TimestampOptions = {}) {
	const seconds = typeof timestamp === 'number' ? timestamp : Number.parseInt(timestamp, 10)
	if (!Number.isFinite(seconds)) return ''
	return parseTimestamp(new Date(seconds * 1000), options)
}

export function isHttpUrl(url: string | undefined) {
	if (!url) return false

	try {
		const parsed = new URL(url)
		return parsed.protocol === 'http:' || parsed.protocol === 'https:'
	} catch {
		return false
	}
}

export function safeLinkUrl(url: string | undefined) {
	return isHttpUrl(url) ? url : undefined
}

export function safeMediaUrl(url: string | undefined) {
	if (!url) return undefined
	if (isHttpUrl(url)) return url
	if (url.startsWith('blob:')) return url
	if (/^data:image\//i.test(url)) return url
	return undefined
}

export function safeAttachmentUrl(url: string | undefined) {
	if (!url) return undefined
	if (isHttpUrl(url)) return url
	if (url.startsWith('attachment://')) return url
	return undefined
}

export function normalizeMarkdownMode(markdown: boolean | 'normal' | 'extended' | undefined) {
	if (!markdown) return undefined
	return markdown === 'extended' ? 'extended' : 'normal'
}

export function resolveTimestampOptions(options: Options, overrides: TimestampOptions = {}) {
	return {
		locale: overrides.locale || options.locale,
		timeZone: overrides.timeZone || options.timeZone,
		timestampFormat: overrides.timestampFormat || options.defaultTimestampFormat,
	} satisfies TimestampOptions
}

export function colorToAlpha(color: string, alpha: number) {
	const shortHex = /^#([a-f\d])([a-f\d])([a-f\d])$/i
	const fullHex = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
	const hex = color.replace(shortHex, '#$1$1$2$2$3$3')
	const channels = fullHex.exec(hex)

	if (!channels) {
		return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`
	}

	const [, red, green, blue] = channels
	return `rgba(${Number.parseInt(red, 16)}, ${Number.parseInt(green, 16)}, ${Number.parseInt(blue, 16)}, ${alpha})`
}
