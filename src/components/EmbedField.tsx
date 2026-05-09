import type { EmbedFieldProps } from '../types.js'
import { classNames } from '../util.js'

export default function EmbedField({ children, fieldTitle, inline }: EmbedFieldProps) {
	return (
		<div className={classNames('dmk-embed-field', inline && 'dmk-inline-field')}>
			<div className="dmk-field-title">{fieldTitle}</div>
			{children}
		</div>
	)
}
