import type { CSSProperties, ReactNode } from 'react'

export type Mode = 'comfy' | 'compact'
export type Theme = 'dark' | 'light'
export type MentionType = 'user' | 'channel' | 'role'
export type MarkdownMode = boolean | 'normal' | 'extended'
export type Timestamp = Date | number | string
export type TimestampFormat = 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 's' | 'S' | 'R'

export interface TimestampOptions {
	locale?: string
	timeZone?: string
	timestampFormat?: TimestampFormat
}

export interface Entity {
	animated?: boolean
	avatar?: string
	color?: string
	image?: string
	name?: string
	url?: string
}

export interface Entities {
	channels?: Record<string, Entity>
	commands?: Record<string, Entity>
	emojis?: Record<string, Entity>
	roles?: Record<string, Entity>
	users?: Record<string, Entity>
}

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
	defaultTimestampFormat?: TimestampFormat
	disableFont?: boolean
	entities?: Entities
	locale?: string
	profiles: Record<string, Profile>
	timeZone?: string
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

export interface MarkdownProps extends TimestampOptions {
	children?: ReactNode
	content?: string
	mode?: 'normal' | 'extended'
}

export interface MessageProps extends SlottableProps, TimestampOptions {
	author?: string
	avatar?: string
	bot?: boolean
	children?: ReactNode
	compactMode?: boolean
	edited?: boolean
	markdown?: MarkdownMode
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

export interface EmbedProps extends SlottableProps, TimestampOptions {
	authorImage?: string
	authorName?: ReactNode
	authorUrl?: string
	children?: ReactNode
	color?: string
	embedTitle?: ReactNode
	footerImage?: string
	image?: string
	markdown?: MarkdownMode
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
	markdown?: MarkdownMode
}

export interface AttachmentsProps extends SlottableProps {
	children?: ReactNode
}

export interface AttachmentProps extends SlottableProps {
	description?: ReactNode
	fileName: ReactNode
	fileSize?: ReactNode
	image?: string
	spoiler?: boolean
	title?: ReactNode
	url?: string
}

export interface PollProps extends SlottableProps, TimestampOptions {
	allowMultiselect?: boolean
	children?: ReactNode
	ended?: boolean
	expiresAt?: Timestamp
	question: ReactNode
	totalVotes?: number
}

export interface PollAnswerProps {
	children?: ReactNode
	emoji?: ReactNode
	meVoted?: boolean
	percentage?: number
	votes?: number
}

export interface ReactionsProps extends SlottableProps {
	children?: ReactNode
}

export interface ReactionProps {
	burst?: boolean
	children?: ReactNode
	count?: number
	me?: boolean
}

export interface StickerProps extends SlottableProps {
	alt?: string
	children?: ReactNode
	image?: string
	name?: ReactNode
}

export interface ReplyPreviewProps extends SlottableProps {
	author?: ReactNode
	children?: ReactNode
}

export interface ForwardedMessageProps extends SlottableProps {
	children?: ReactNode
	label?: ReactNode
}

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'link'

export interface ActionRowProps extends SlottableProps {
	children?: ReactNode
}

export interface ButtonProps extends SlottableProps {
	children?: ReactNode
	disabled?: boolean
	emoji?: ReactNode
	url?: string
	variant?: ButtonVariant
}

export interface SelectMenuProps extends SlottableProps {
	children?: ReactNode
	disabled?: boolean
	placeholder?: ReactNode
}

export interface TextInputProps extends SlottableProps {
	children?: ReactNode
	disabled?: boolean
	label?: ReactNode
	placeholder?: string
	value?: string
}

export interface SectionProps extends SlottableProps {
	accessory?: ReactNode
	children?: ReactNode
}

export interface TextDisplayProps extends SlottableProps {
	children?: ReactNode
	markdown?: MarkdownMode
}

export interface ThumbnailProps extends SlottableProps {
	alt?: string
	description?: ReactNode
	media?: string
	spoiler?: boolean
}

export interface MediaGalleryProps extends SlottableProps {
	children?: ReactNode
}

export interface MediaGalleryItemProps {
	alt?: string
	description?: ReactNode
	media: string
	spoiler?: boolean
}

export interface FileDisplayProps extends SlottableProps {
	children?: ReactNode
	fileName: ReactNode
	fileSize?: ReactNode
	url?: string
}

export interface SeparatorProps extends SlottableProps {
	divider?: boolean
	spacing?: 'small' | 'large'
}

export interface ContainerProps extends SlottableProps {
	accentColor?: string
	children?: ReactNode
	spoiler?: boolean
}

export interface LabelProps extends SlottableProps {
	children?: ReactNode
	description?: ReactNode
	label: ReactNode
}

export interface FileUploadProps extends SlottableProps {
	children?: ReactNode
	disabled?: boolean
	label?: ReactNode
}

export interface RadioGroupProps extends SlottableProps {
	children?: ReactNode
}

export interface RadioOptionProps {
	checked?: boolean
	children?: ReactNode
	description?: ReactNode
}

export interface CheckboxGroupProps extends SlottableProps {
	children?: ReactNode
}

export interface CheckboxProps {
	checked?: boolean
	children?: ReactNode
	description?: ReactNode
}

export interface ModalProps extends SlottableProps {
	children?: ReactNode
	title?: ReactNode
}
