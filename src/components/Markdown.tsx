import { Children, Fragment, isValidElement, useContext, type ReactNode } from 'react'
import { parse } from 'discord-markdown-parser'
import Mention from './Mention.js'
import DefaultOptions from '../context/DefaultOptions.js'
import OptionsContext from '../context/OptionsContext.js'
import type { Entities, Entity, MarkdownProps, TimestampFormat, TimestampOptions } from '../types.js'
import {
	classNames,
	parseDiscordTimestamp,
	resolveTimestampOptions,
	safeLinkUrl,
	safeMediaUrl,
} from '../util.js'

type MarkdownNode = Record<string, unknown> & {
	content?: unknown
	id?: string
	type?: string
}

function text(value: unknown) {
	return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

function childNodes(value: unknown) {
	return Array.isArray(value) ? value as MarkdownNode[] : []
}

function entityName(entity: Entity | undefined, fallback: string) {
	return entity?.name || fallback
}

function renderChildren(nodes: unknown, options: RenderOptions, parentKey: string) {
	if (!Array.isArray(nodes)) return text(nodes)
	return nodes.map((node, index) => renderNode(node as MarkdownNode, options, `${parentKey}-${index}`))
}

interface RenderOptions {
	entities?: Entities
	timestamp: TimestampOptions
}

function renderMention(type: 'channel' | 'role' | 'user', id: string, options: RenderOptions, key: string) {
	const entities = options.entities || {}
	const entity = type === 'channel'
		? entities.channels?.[id]
		: type === 'role'
			? entities.roles?.[id]
			: entities.users?.[id]
	const fallback = type === 'channel' ? id : id

	return (
		<Mention key={key} type={type} color={entity?.color}>
			{entityName(entity, fallback)}
		</Mention>
	)
}

function renderNode(node: MarkdownNode, options: RenderOptions, key: string): ReactNode {
	const content = node.content
	const rendered = () => renderChildren(content, options, key)

	switch (node.type) {
		case 'text':
			return text(content)
		case 'br':
		case 'newline':
			return <br key={key} />
		case 'strong':
			return <strong key={key}>{rendered()}</strong>
		case 'em':
			return <em key={key}>{rendered()}</em>
		case 'underline':
			return <u key={key}>{rendered()}</u>
		case 'strikethrough':
			return <s key={key}>{rendered()}</s>
		case 'inlineCode':
			return <code key={key} className="dmk-inline-code">{text(content)}</code>
		case 'codeBlock':
			return (
				<pre key={key} className="dmk-code-block">
					<code>{text(content)}</code>
				</pre>
			)
		case 'spoiler':
			return <span key={key} className="dmk-spoiler">{rendered()}</span>
		case 'blockQuote':
			return <blockquote key={key} className="dmk-blockquote">{rendered()}</blockquote>
		case 'heading': {
			const level = Number(node.level) === 1 ? 1 : 2
			return <span key={key} className={`dmk-heading dmk-heading-${level}`}>{rendered()}</span>
		}
		case 'subtext':
			return <span key={key} className="dmk-subtext">{rendered()}</span>
		case 'url':
		case 'autolink':
		case 'link': {
			const href = safeLinkUrl(text(node.target || content))
			const label = Array.isArray(content) ? rendered() : text(content || node.target)
			return href
				? <a key={key} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
				: <Fragment key={key}>{label}</Fragment>
		}
		case 'user':
			return renderMention('user', text(node.id), options, key)
		case 'channel':
			return renderMention('channel', text(node.id), options, key)
		case 'role':
			return renderMention('role', text(node.id), options, key)
		case 'everyone':
			return <span key={key} className="dmk-mention">@everyone</span>
		case 'here':
			return <span key={key} className="dmk-mention">@here</span>
		case 'emoji': {
			const id = text(node.id)
			const name = text(node.name)
			const entity = options.entities?.emojis?.[id]
			const source = safeMediaUrl(entity?.image || entity?.url)
			return source
				? <img key={key} src={source} alt={`:${entityName(entity, name)}:`} className="dmk-custom-emoji" />
				: <span key={key}>:{entityName(entity, name)}:</span>
		}
		case 'timestamp': {
			const format = text(node.format) as TimestampFormat
			const timestamp = parseDiscordTimestamp(text(node.timestamp), {
				...options.timestamp,
				timestampFormat: format || options.timestamp.timestampFormat,
			})
			return <time key={key} className="dmk-markdown-timestamp">{timestamp}</time>
		}
		case 'slashCommand': {
			const id = text(node.id)
			const entity = options.entities?.commands?.[id]
			const name = entityName(entity, text(node.fullName || node.name || id))
			return <span key={key} className="dmk-mention">/{name}</span>
		}
		case 'guildNavigation':
			return <span key={key} className="dmk-mention">{text(node.content || node.target || 'server guide')}</span>
		default:
			if (childNodes(content).length > 0) return <Fragment key={key}>{rendered()}</Fragment>
			return text(content)
	}
}

export default function Markdown({
	children,
	content,
	locale,
	mode = 'normal',
	timeZone,
	timestampFormat,
}: MarkdownProps) {
	const options = useContext(OptionsContext) || DefaultOptions
	const timestamp = resolveTimestampOptions(options, { locale, timeZone, timestampFormat })
	const renderOptions: RenderOptions = {
		entities: options.entities,
		timestamp,
	}

	const renderValue = (value: ReactNode, index: number): ReactNode => {
		if (typeof value === 'string' || typeof value === 'number') {
			return parse(String(value), mode).map((node, nodeIndex) => (
				renderNode(node as MarkdownNode, renderOptions, `${index}-${nodeIndex}`)
			))
		}

		if (isValidElement(value)) return value
		return value
	}

	return (
		<span className={classNames('dmk-markdown', mode === 'extended' && 'dmk-markdown-extended')}>
			{Children.toArray(content ?? children).map(renderValue)}
		</span>
	)
}
