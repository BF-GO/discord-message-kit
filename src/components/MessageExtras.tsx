import { useContext } from 'react'
import DefaultOptions from '../context/DefaultOptions.js'
import OptionsContext from '../context/OptionsContext.js'
import type {
	AttachmentProps,
	AttachmentsProps,
	ForwardedMessageProps,
	PollAnswerProps,
	PollProps,
	ReactionProps,
	ReactionsProps,
	ReplyPreviewProps,
	StickerProps,
	StyleWithVariables,
} from '../types.js'
import {
	classNames,
	parseTimestamp,
	resolveTimestampOptions,
	safeLinkUrl,
	safeMediaUrl,
} from '../util.js'

function clampPercent(value: number | undefined) {
	if (!Number.isFinite(value)) return 0
	return Math.max(0, Math.min(100, Number(value)))
}

export function Attachments({ children }: AttachmentsProps) {
	return <div className="dmk-attachments">{children}</div>
}

export function Attachment({
	description,
	fileName,
	fileSize,
	image,
	spoiler,
	title,
	url,
}: AttachmentProps) {
	const imageSource = safeMediaUrl(image)
	const href = safeLinkUrl(url)
	const label = title || fileName
	const content = (
		<>
			{imageSource ? (
				<img src={imageSource} alt={typeof label === 'string' ? label : ''} className="dmk-attachment-image" />
			) : (
				<span className="dmk-attachment-icon">FILE</span>
			)}
			<span className="dmk-attachment-copy">
				<span className="dmk-attachment-title">{label}</span>
				{description ? <span className="dmk-attachment-description">{description}</span> : null}
				{fileSize ? <span className="dmk-attachment-size">{fileSize}</span> : null}
			</span>
		</>
	)

	return href ? (
		<a href={href} target="_blank" rel="noopener noreferrer" className={classNames('dmk-attachment', spoiler && 'dmk-spoilered-media')}>
			{content}
		</a>
	) : (
		<div className={classNames('dmk-attachment', spoiler && 'dmk-spoilered-media')}>{content}</div>
	)
}

export function Poll({
	allowMultiselect,
	children,
	ended,
	expiresAt,
	locale,
	question,
	timeZone,
	timestampFormat,
	totalVotes,
}: PollProps) {
	const options = useContext(OptionsContext) || DefaultOptions
	const expiry = expiresAt
		? parseTimestamp(expiresAt, resolveTimestampOptions(options, {
			locale,
			timeZone,
			timestampFormat: timestampFormat || 'R',
		}))
		: ''

	return (
		<div className={classNames('dmk-poll', ended && 'dmk-poll-ended')}>
			<div className="dmk-poll-question">{question}</div>
			<div className="dmk-poll-answers">{children}</div>
			<div className="dmk-poll-meta">
				{typeof totalVotes === 'number' ? <span>{totalVotes} votes</span> : null}
				{allowMultiselect ? <span>Multiple choice</span> : null}
				{expiry ? <span>{ended ? 'Ended' : 'Ends'} {expiry}</span> : null}
			</div>
		</div>
	)
}

export function PollAnswer({ children, emoji, meVoted, percentage, votes }: PollAnswerProps) {
	const percent = clampPercent(percentage)
	const style = { '--dmk-poll-percent': `${percent}%` } as StyleWithVariables

	return (
		<div style={style} className={classNames('dmk-poll-answer', meVoted && 'dmk-poll-answer-selected')}>
			<span className="dmk-poll-answer-fill" />
			<span className="dmk-poll-answer-content">
				{emoji ? <span className="dmk-poll-answer-emoji">{emoji}</span> : null}
				<span>{children}</span>
			</span>
			<span className="dmk-poll-answer-count">
				{typeof votes === 'number' ? `${votes} votes` : `${percent}%`}
			</span>
		</div>
	)
}

export function Reactions({ children }: ReactionsProps) {
	return <div className="dmk-reactions">{children}</div>
}

export function Reaction({ burst, children, count = 1, me }: ReactionProps) {
	return (
		<span className={classNames('dmk-reaction', me && 'dmk-reaction-me', burst && 'dmk-reaction-burst')}>
			<span>{children}</span>
			<span className="dmk-reaction-count">{count}</span>
		</span>
	)
}

export function Sticker({ alt, children, image, name }: StickerProps) {
	const source = safeMediaUrl(image)

	return (
		<div className="dmk-sticker">
			{source ? <img src={source} alt={alt || (typeof name === 'string' ? name : '')} /> : null}
			{name ? <span className="dmk-sticker-name">{name}</span> : children}
		</div>
	)
}

export function ReplyPreview({ author, children }: ReplyPreviewProps) {
	return (
		<div className="dmk-reply-preview">
			<span className="dmk-reply-line" />
			<span className="dmk-reply-author">{author}</span>
			<span className="dmk-reply-content">{children}</span>
		</div>
	)
}

export function ForwardedMessage({ children, label = 'Forwarded' }: ForwardedMessageProps) {
	return (
		<div className="dmk-forwarded-message">
			<div className="dmk-forwarded-label">{label}</div>
			<div className="dmk-forwarded-body">{children}</div>
		</div>
	)
}
