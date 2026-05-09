import type { ReactNode } from 'react'
import { useContext } from 'react'
import Markdown from './Markdown.js'
import DefaultOptions from '../context/DefaultOptions.js'
import OptionsContext from '../context/OptionsContext.js'
import type { EmbedProps } from '../types.js'
import {
	normalizeMarkdownMode,
	parseTimestamp,
	resolveTimestampOptions,
	safeLinkUrl,
	safeMediaUrl,
	splitSlots,
} from '../util.js'

function linkedText(content: ReactNode, url?: string) {
	if (!content) return null
	const href = safeLinkUrl(url)
	return href ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : <span>{content}</span>
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
	locale,
	markdown,
	thumbnail,
	timestamp,
	timeZone,
	title,
	timestampFormat,
	url,
}: EmbedProps) {
	const options = useContext(OptionsContext) || DefaultOptions
	const { body, slots } = splitSlots(children, ['fields', 'footer'] as const)
	const resolvedTitle = title || embedTitle
	const displayedAt = timestamp ? parseTimestamp(timestamp, resolveTimestampOptions(options, { locale, timeZone, timestampFormat })) : ''
	const footer = slots.footer[0]
	const hasFooter = Boolean(footer || displayedAt)
	const markdownMode = normalizeMarkdownMode(markdown)
	const description = markdownMode ? (
		<Markdown mode={markdownMode} locale={locale} timeZone={timeZone} timestampFormat={timestampFormat}>
			{body}
		</Markdown>
	) : body
	const authorImageSource = safeMediaUrl(authorImage)
	const footerImageSource = safeMediaUrl(footerImage)
	const imageSource = safeMediaUrl(image)
	const thumbnailSource = safeMediaUrl(thumbnail)

	return (
		<div className="dmk-embed">
			<div style={color ? { backgroundColor: color } : undefined} className="dmk-left-border" />
			<div className="dmk-embed-container">
				<div className="dmk-embed-main">
					<div className="dmk-embed-copy">
						{authorName ? (
							<div className="dmk-embed-author">
								{authorImageSource ? <img src={authorImageSource} alt="" className="dmk-author-image" /> : null}
								{linkedText(authorName, authorUrl)}
							</div>
						) : null}
						{resolvedTitle ? (
							<div className="dmk-embed-title">
								{linkedText(resolvedTitle, url)}
							</div>
						) : null}
						<div className="dmk-embed-description">{description}</div>
						{slots.fields}
						{imageSource ? <img src={imageSource} alt="" className="dmk-embed-image" /> : null}
					</div>
					{thumbnailSource ? <img src={thumbnailSource} alt="" className="dmk-embed-thumbnail" /> : null}
				</div>
				{hasFooter ? (
					<div className="dmk-embed-footer">
						{footer && footerImageSource ? <img src={footerImageSource} alt="" className="dmk-footer-image" /> : null}
						<span>
							{footer}
							{footer && displayedAt ? <span className="dmk-footer-separator">&bull;</span> : null}
							{displayedAt ? <span>{displayedAt}</span> : null}
						</span>
					</div>
				) : null}
			</div>
		</div>
	)
}
