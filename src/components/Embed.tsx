import type { ReactNode } from 'react'
import type { EmbedProps } from '../types.js'
import { parseTimestamp, splitSlots } from '../util.js'

function linkedText(content: ReactNode, url?: string) {
	if (!content) return null
	return url ? <a href={url} target="_blank" rel="noopener noreferrer">{content}</a> : <span>{content}</span>
}

export default function Embed({
	authorImage,
	authorName,
	authorUrl,
	children,
	color,
	embedTitle,
	footerImage,
	image,
	thumbnail,
	timestamp,
	title,
	url,
}: EmbedProps) {
	const { body, slots } = splitSlots(children, ['fields', 'footer'] as const)
	const resolvedTitle = title || embedTitle
	const displayedAt = timestamp ? parseTimestamp(timestamp) : ''
	const hasFooter = Boolean(slots.footer || displayedAt)

	return (
		<div className="dmk-embed">
			<div style={color ? { backgroundColor: color } : undefined} className="dmk-left-border" />
			<div className="dmk-embed-container">
				<div className="dmk-embed-main">
					<div className="dmk-embed-copy">
						{authorName ? (
							<div className="dmk-embed-author">
								{authorImage ? <img src={authorImage} alt="" className="dmk-author-image" /> : null}
								{linkedText(authorName, authorUrl)}
							</div>
						) : null}
						{resolvedTitle ? (
							<div className="dmk-embed-title">
								{linkedText(resolvedTitle, url)}
							</div>
						) : null}
						<div className="dmk-embed-description">{body}</div>
						{slots.fields}
						{image ? <img src={image} alt="" className="dmk-embed-image" /> : null}
					</div>
					{thumbnail ? <img src={thumbnail} alt="" className="dmk-embed-thumbnail" /> : null}
				</div>
				{hasFooter ? (
					<div className="dmk-embed-footer">
						{slots.footer && footerImage ? <img src={footerImage} alt="" className="dmk-footer-image" /> : null}
						<span>
							{slots.footer}
							{slots.footer && displayedAt ? <span className="dmk-footer-separator">&bull;</span> : null}
							{displayedAt ? <span>{displayedAt}</span> : null}
						</span>
					</div>
				) : null}
			</div>
		</div>
	)
}
