import type { CSSProperties, ReactNode } from 'react'

export type Mode = 'comfy' | 'compact'
export type Theme = 'dark' | 'light'
export type MentionType = 'user' | 'channel' | 'role'
export type Timestamp = Date | number | string

export interface Profile {
	author?: string
	avatar?: string
	bot?: boolean
	roleColor?: string
}

export interface Options {
	avatars: Record<string, string>
	defaultMode: Mode
	defaultTheme: Theme
	disableFont?: boolean
	profiles: Record<string, Profile>
}

export interface SlottableProps {
	slot?: string
}

export type StyleWithVariables = CSSProperties & Record<`--${string}`, string | number | undefined>

export interface AuthorInfoProps {
	author?: string
	bot?: boolean
	roleColor?: string
}

export interface MessagesProps {
	children?: ReactNode
	compactMode?: boolean
	lightTheme?: boolean
}

export interface MessageProps extends SlottableProps {
	author?: string
	avatar?: string
	bot?: boolean
	children?: ReactNode
	compactMode?: boolean
	edited?: boolean
	profile?: string
	roleColor?: string
	timestamp?: Timestamp
}

export interface MentionProps {
	children?: ReactNode
	color?: string
	highlight?: boolean
	profile?: string
	type?: MentionType
}

export interface EmbedProps extends SlottableProps {
	authorImage?: string
	authorName?: ReactNode
	authorUrl?: string
	children?: ReactNode
	color?: string
	embedTitle?: ReactNode
	footerImage?: string
	image?: string
	thumbnail?: string
	timestamp?: Timestamp
	title?: ReactNode
	url?: string
}

export interface EmbedFieldsProps extends SlottableProps {
	children?: ReactNode
}

export interface EmbedFieldProps {
	children?: ReactNode
	fieldTitle: ReactNode
	inline?: boolean
}
