import { useContext } from 'react'
import DefaultOptions from '../context/DefaultOptions.js'
import OptionsContext from '../context/OptionsContext.js'
import type { MentionProps, MentionType, StyleWithVariables } from '../types.js'
import { colorToAlpha } from '../util.js'

const fallbackLabels: Record<MentionType, string> = {
	channel: 'channel',
	role: 'Role',
	user: 'User',
}

export default function Mention({
	children,
	color,
	profile,
	type = 'user',
}: MentionProps) {
	const options = useContext(OptionsContext) || DefaultOptions
	const linkedProfile = profile ? options.profiles[profile] : undefined
	const roleColor = linkedProfile?.roleColor || color
	const prefix = type === 'channel' ? '#' : '@'
	const label = children || (type === 'user' && linkedProfile?.author) || fallbackLabels[type]
	const roleStyle: StyleWithVariables | undefined = roleColor && type === 'role'
		? {
			'--dmk-mention-color': roleColor,
			'--dmk-mention-fill': colorToAlpha(roleColor, 0.14),
			'--dmk-mention-fill-hover': colorToAlpha(roleColor, 0.32),
		}
		: undefined

	return (
		<span style={roleStyle} className="dmk-mention">
			{prefix}{label}
		</span>
	)
}
