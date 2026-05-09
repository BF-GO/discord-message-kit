import Markdown from './Markdown.js'
import type {
	ActionRowProps,
	ButtonProps,
	CheckboxGroupProps,
	CheckboxProps,
	ContainerProps,
	FileDisplayProps,
	FileUploadProps,
	LabelProps,
	MediaGalleryItemProps,
	MediaGalleryProps,
	ModalProps,
	RadioGroupProps,
	RadioOptionProps,
	SectionProps,
	SelectMenuProps,
	SeparatorProps,
	StyleWithVariables,
	TextDisplayProps,
	TextInputProps,
	ThumbnailProps,
} from '../types.js'
import { classNames, normalizeMarkdownMode, safeAttachmentUrl, safeLinkUrl, safeMediaUrl, splitSlots } from '../util.js'

export function ActionRow({ children }: ActionRowProps) {
	return <div className="dmk-action-row">{children}</div>
}

export function Button({
	children,
	disabled,
	emoji,
	url,
	variant = 'secondary',
}: ButtonProps) {
	const className = classNames('dmk-component-button', `dmk-button-${variant}`, disabled && 'dmk-component-disabled')
	const content = (
		<>
			{emoji ? <span className="dmk-button-emoji">{emoji}</span> : null}
			<span>{children}</span>
		</>
	)
	const href = variant === 'link' ? safeLinkUrl(url) : undefined

	return href ? (
		<a className={className} href={href} target="_blank" rel="noopener noreferrer">{content}</a>
	) : (
		<button className={className} disabled={disabled} type="button">{content}</button>
	)
}

export function SelectMenu({ children, disabled, placeholder = 'Select an option' }: SelectMenuProps) {
	return (
		<div className={classNames('dmk-select-menu', disabled && 'dmk-component-disabled')}>
			<span>{placeholder}</span>
			<span className="dmk-select-value">{children}</span>
			<span className="dmk-select-arrow">v</span>
		</div>
	)
}

export function TextInput({ children, disabled, label, placeholder, value }: TextInputProps) {
	return (
		<label className={classNames('dmk-text-input', disabled && 'dmk-component-disabled')}>
			{label ? <span className="dmk-input-label">{label}</span> : null}
			<span className="dmk-input-box">{value || placeholder || children}</span>
		</label>
	)
}

export function Section({ accessory, children }: SectionProps) {
	const { body, slots } = splitSlots(children, ['accessory'] as const)
	const resolvedAccessory = accessory || slots.accessory[0]

	return (
		<div className="dmk-section">
			<div className="dmk-section-content">{body}</div>
			{resolvedAccessory ? <div className="dmk-section-accessory">{resolvedAccessory}</div> : null}
		</div>
	)
}

export function TextDisplay({ children, markdown = true }: TextDisplayProps) {
	const markdownMode = normalizeMarkdownMode(markdown)

	return (
		<div className="dmk-text-display">
			{markdownMode ? <Markdown mode={markdownMode}>{children}</Markdown> : children}
		</div>
	)
}

export function Thumbnail({ alt, description, media, spoiler }: ThumbnailProps) {
	const source = safeMediaUrl(media)

	return (
		<div className={classNames('dmk-thumbnail', spoiler && 'dmk-spoilered-media')}>
			{source ? <img src={source} alt={alt || (typeof description === 'string' ? description : '')} /> : null}
			{description ? <span className="dmk-thumbnail-description">{description}</span> : null}
		</div>
	)
}

export function MediaGallery({ children }: MediaGalleryProps) {
	return <div className="dmk-media-gallery">{children}</div>
}

export function MediaGalleryItem({ alt, description, media, spoiler }: MediaGalleryItemProps) {
	const source = safeMediaUrl(media)

	return (
		<figure className={classNames('dmk-media-gallery-item', spoiler && 'dmk-spoilered-media')}>
			{source ? <img src={source} alt={alt || (typeof description === 'string' ? description : '')} /> : null}
			{description ? <figcaption>{description}</figcaption> : null}
		</figure>
	)
}

export function FileDisplay({ children, fileName, fileSize, url }: FileDisplayProps) {
	const href = safeAttachmentUrl(url)
	const content = (
		<>
			<span className="dmk-file-icon">FILE</span>
			<span className="dmk-file-copy">
				<span className="dmk-file-name">{fileName}</span>
				{fileSize ? <span className="dmk-file-size">{fileSize}</span> : null}
				{children ? <span className="dmk-file-description">{children}</span> : null}
			</span>
		</>
	)

	return href && !href.startsWith('attachment://') ? (
		<a href={href} target="_blank" rel="noopener noreferrer" className="dmk-file-display">{content}</a>
	) : (
		<div className="dmk-file-display">{content}</div>
	)
}

export function Separator({ divider = true, spacing = 'small' }: SeparatorProps) {
	return <div className={classNames('dmk-separator', `dmk-separator-${spacing}`, divider && 'dmk-separator-divider')} />
}

export function Container({ accentColor, children, spoiler }: ContainerProps) {
	const style = accentColor ? { '--dmk-container-accent': accentColor } as StyleWithVariables : undefined

	return (
		<div style={style} className={classNames('dmk-container', spoiler && 'dmk-spoilered-media')}>
			{children}
		</div>
	)
}

export function Label({ children, description, label }: LabelProps) {
	return (
		<label className="dmk-label">
			<span className="dmk-label-title">{label}</span>
			{description ? <span className="dmk-label-description">{description}</span> : null}
			<span className="dmk-label-control">{children}</span>
		</label>
	)
}

export function FileUpload({ children, disabled, label = 'Upload a file' }: FileUploadProps) {
	return (
		<div className={classNames('dmk-file-upload', disabled && 'dmk-component-disabled')}>
			<span className="dmk-file-upload-icon">+</span>
			<span>{label}</span>
			{children ? <span className="dmk-file-upload-description">{children}</span> : null}
		</div>
	)
}

export function RadioGroup({ children }: RadioGroupProps) {
	return <div className="dmk-radio-group">{children}</div>
}

export function RadioOption({ checked, children, description }: RadioOptionProps) {
	return (
		<div className={classNames('dmk-radio-option', checked && 'dmk-radio-option-checked')}>
			<span className="dmk-radio-control" />
			<span className="dmk-choice-copy">
				<span>{children}</span>
				{description ? <span className="dmk-choice-description">{description}</span> : null}
			</span>
		</div>
	)
}

export function CheckboxGroup({ children }: CheckboxGroupProps) {
	return <div className="dmk-checkbox-group">{children}</div>
}

export function Checkbox({ checked, children, description }: CheckboxProps) {
	return (
		<div className={classNames('dmk-checkbox', checked && 'dmk-checkbox-checked')}>
			<span className="dmk-checkbox-control" />
			<span className="dmk-choice-copy">
				<span>{children}</span>
				{description ? <span className="dmk-choice-description">{description}</span> : null}
			</span>
		</div>
	)
}

export function Modal({ children, title }: ModalProps) {
	return (
		<div className="dmk-modal">
			{title ? <div className="dmk-modal-title">{title}</div> : null}
			<div className="dmk-modal-body">{children}</div>
		</div>
	)
}
