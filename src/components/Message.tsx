import { Children, Fragment, isValidElement, useContext, type ReactNode } from 'react'
import AuthorInfo from './AuthorInfo.js'
import Markdown from './Markdown.js'
import DefaultOptions from '../context/DefaultOptions.js'
import OptionsContext from '../context/OptionsContext.js'
import type { MessageProps, Profile } from '../types.js'
import { classNames, normalizeMarkdownMode, parseTimestamp, resolveTimestampOptions, splitSlots } from '../util.js'

function isHighlightedMention(child: ReactNode) {
	if (!isValidElement(child)) return false

	const props = child.props as { highlight?: boolean, type?: string }
	return props.highlight === true && props.type !== 'channel'
}

function resolveProfile(
	base: Profile,
	profileKey: string | undefined,
	profiles: Record<string, Profile>,
) {
	return profileKey ? { ...base, ...profiles[profileKey] } : base
}

export default function Message({
	author = 'User',
	avatar,
	bot,
	children,
	compactMode,
	edited,
	locale,
	markdown,
	profile: profileKey,
	roleColor,
	timestamp,
	timeZone,
	timestampFormat,
}: MessageProps) {
	const options = useContext(OptionsContext) || DefaultOptions
	const profile = resolveProfile({ author, avatar, bot, roleColor }, profileKey, options.profiles)
	const avatarSource = profile.avatar || avatar
	const resolvedAvatar = avatarSource
		? options.avatars[avatarSource] || avatarSource
		: options.avatars.default
	const displayedAt = parseTimestamp(timestamp, resolveTimestampOptions(options, { locale, timeZone, timestampFormat }))
	const { body, slots } = splitSlots(children, ['embeds'] as const)
	const highlighted = Children.toArray(body).some(isHighlightedMention)
	const markdownMode = normalizeMarkdownMode(markdown)
	const bodyContent = markdownMode ? (
		<Markdown mode={markdownMode} locale={locale} timeZone={timeZone} timestampFormat={timestampFormat}>
			{body}
		</Markdown>
	) : body

	const authorBlock = compactMode ? (
		<Fragment>
			<span className="dmk-message-timestamp">{displayedAt}</span>
			<AuthorInfo author={profile.author} bot={profile.bot} roleColor={profile.roleColor} />
		</Fragment>
	) : (
		<div className="dmk-message-header">
			<AuthorInfo author={profile.author} bot={profile.bot} roleColor={profile.roleColor} />
			<span className="dmk-message-timestamp">{displayedAt}</span>
		</div>
	)

	return (
		<div className={classNames('dmk-message', highlighted && 'dmk-highlight-mention')}>
			<div className="dmk-author-avatar">
				<img src={resolvedAvatar} alt={profile.author || author} />
			</div>
			<div className="dmk-message-content">
				{compactMode ? null : authorBlock}
				<div className="dmk-message-body">
					{compactMode ? authorBlock : null}
					{bodyContent}
					{edited ? <span className="dmk-message-edited">(edited)</span> : null}
				</div>
				{slots.embeds.slice(0, 10)}
			</div>
		</div>
	)
}
