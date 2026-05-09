import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'
import type { Timestamp } from './types.js'

interface SlotProps {
	slot?: string
}

export function classNames(...classes: Array<false | null | string | undefined>) {
	return classes.filter(Boolean).join(' ')
}

export function splitSlots<TSlot extends string>(children: ReactNode, names: readonly TSlot[]) {
	const acceptedSlots = new Set<string>(names)
	const body: ReactNode[] = []
	const slots = {} as Partial<Record<TSlot, ReactElement>>

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

		slots[slot] ??= child
	})

	return { body, slots }
}

export function parseTimestamp(timestamp: Timestamp = new Date()) {
	const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
	if (Number.isNaN(date.valueOf())) return ''

	return new Intl.DateTimeFormat('en-US', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).format(date)
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
