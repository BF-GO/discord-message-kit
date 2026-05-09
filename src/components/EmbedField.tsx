import type { EmbedFieldProps } from '../types.js'
import { classNames, normalizeMarkdownMode } from '../util.js'
import Markdown from './Markdown.js'

export default function EmbedField({ children, fieldTitle, inline, markdown }: EmbedFieldProps) {
	const markdownMode = normalizeMarkdownMode(markdown)

	return (
		<div className={classNames('dmk-embed-field', inline && 'dmk-inline-field')}>
			<div className="dmk-field-title">{fieldTitle}</div>
			{markdownMode ? <Markdown mode={markdownMode}>{children}</Markdown> : children}
		</div>
	)
}
