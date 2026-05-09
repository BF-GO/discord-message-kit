import type { AuthorInfoProps } from '../types.js'

export default function AuthorInfo({ author, bot, roleColor }: AuthorInfoProps) {
	return (
		<span className="dmk-author-info">
			<span style={{ color: roleColor }} className="dmk-author-username">
				{author}
			</span>
			{bot ? <span className="dmk-bot-tag">Bot</span> : null}
		</span>
	)
}
