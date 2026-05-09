import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
	ActionRow,
	Attachment,
	Attachments,
	Button,
	Checkbox,
	CheckboxGroup,
	Container,
	DefaultOptions,
	Embed,
	FileDisplay,
	FileUpload,
	ForwardedMessage,
	Label,
	Markdown,
	MediaGallery,
	MediaGalleryItem,
	Message,
	Messages,
	Modal,
	OptionsContext,
	Poll,
	PollAnswer,
	RadioGroup,
	RadioOption,
	Reaction,
	Reactions,
	ReplyPreview,
	Section,
	SelectMenu,
	Separator,
	Sticker,
	TextDisplay,
	TextInput,
	Thumbnail,
} from '../dist/index.js'

function html(element) {
	return renderToStaticMarkup(element)
}

test('renders all message embeds up to the Discord limit', () => {
	const output = html(
		React.createElement(Message, null,
			'body',
			React.createElement(Embed, { slot: 'embeds', title: 'one' }),
			React.createElement(Embed, { slot: 'embeds', title: 'two' }),
		),
	)

	assert.match(output, /one/)
	assert.match(output, /two/)
})

test('does not render unsafe link and media urls', () => {
	const output = html(
		React.createElement(Embed, {
			authorImage: 'javascript:alert(1)',
			image: 'javascript:alert(1)',
			thumbnail: 'javascript:alert(1)',
			title: 'unsafe',
			url: 'javascript:alert(1)',
		}, 'copy'),
	)

	assert.doesNotMatch(output, /href="javascript:/)
	assert.doesNotMatch(output, /src="javascript:/)
	assert.match(output, /unsafe/)
})

test('renders Discord timestamp styles', () => {
	const originalNow = Date.now
	Date.now = () => new Date('2026-05-09T18:00:00Z').valueOf()

	try {
		for (const timestampFormat of ['t', 'T', 'd', 'D', 'f', 'F', 's', 'S', 'R']) {
			const output = html(
				React.createElement(Message, {
					locale: 'en-US',
					timeZone: 'UTC',
					timestamp: '2026-05-08T18:00:00Z',
					timestampFormat,
				}, 'x'),
			)

			assert.match(output, /dmk-message-timestamp/)
			assert.doesNotMatch(output, /class="dmk-message-timestamp"><\/span>/)
		}
	} finally {
		Date.now = originalNow
	}
})

test('renders Discord markdown through React nodes', () => {
	const options = {
		...DefaultOptions,
		entities: {
			channels: {
				'103735883630395392': { name: 'general' },
			},
			roles: {
				'165511591545143296': { color: '#b58cff', name: 'Reviewers' },
			},
			users: {
				'80351110224678912': { name: 'Alice' },
			},
		},
	}
	const content = '**bold** `code` ||hide|| <@80351110224678912> <#103735883630395392> <@&165511591545143296> <t:1618953630:d>'
	const output = html(
		React.createElement(OptionsContext.Provider, { value: options },
			React.createElement(Markdown, { locale: 'en-US', timeZone: 'UTC' }, content),
		),
	)

	assert.match(output, /<strong>bold<\/strong>/)
	assert.match(output, /dmk-inline-code/)
	assert.match(output, /dmk-spoiler/)
	assert.match(output, /@Alice/)
	assert.match(output, /#general/)
	assert.match(output, /@Reviewers/)
	assert.match(output, /4\/20\/21/)
	assert.doesNotMatch(output, /dangerouslySetInnerHTML/)
})

test('renders message extras', () => {
	const output = html(
		React.createElement(Message, null,
			React.createElement(ReplyPreview, { author: 'Atlas' }, 'original message'),
			React.createElement(Attachments, null,
				React.createElement(Attachment, { fileName: 'report.png', image: 'https://example.com/report.png', fileSize: '12 KB' }),
			),
			React.createElement(Poll, { question: 'Ship it?', totalVotes: 3 },
				React.createElement(PollAnswer, { percentage: 66, votes: 2, meVoted: true }, 'Yes'),
				React.createElement(PollAnswer, { percentage: 34, votes: 1 }, 'No'),
			),
			React.createElement(Reactions, null,
				React.createElement(Reaction, { count: 4, me: true }, 'OK'),
			),
			React.createElement(Sticker, { name: 'Wave', image: 'https://example.com/sticker.webp' }),
			React.createElement(ForwardedMessage, null, 'forwarded copy'),
		),
	)

	assert.match(output, /dmk-reply-preview/)
	assert.match(output, /dmk-attachment/)
	assert.match(output, /dmk-poll/)
	assert.match(output, /dmk-reaction/)
	assert.match(output, /dmk-sticker/)
	assert.match(output, /dmk-forwarded-message/)
})

test('renders Discord component previews and modal controls', () => {
	const output = html(
		React.createElement(Container, { accentColor: '#5865f2' },
			React.createElement(TextDisplay, null, '# Deploy ready'),
			React.createElement(Section, {
				accessory: React.createElement(Thumbnail, { media: 'https://example.com/thumb.png' }),
			}, React.createElement(TextDisplay, null, 'Release notes')),
			React.createElement(MediaGallery, null,
				React.createElement(MediaGalleryItem, { media: 'https://example.com/a.png', description: 'A' }),
			),
			React.createElement(FileDisplay, { fileName: 'manual.pdf', url: 'attachment://manual.pdf' }),
			React.createElement(Separator, { spacing: 'large' }),
			React.createElement(ActionRow, null,
				React.createElement(Button, { variant: 'primary' }, 'Approve'),
				React.createElement(SelectMenu, { placeholder: 'Pick' }, 'Selected'),
			),
			React.createElement(Modal, { title: 'Feedback' },
				React.createElement(Label, { label: 'Name' }, React.createElement(TextInput, { value: 'Casey' })),
				React.createElement(FileUpload, null, 'Optional'),
				React.createElement(RadioGroup, null, React.createElement(RadioOption, { checked: true }, 'One')),
				React.createElement(CheckboxGroup, null, React.createElement(Checkbox, { checked: true }, 'Done')),
			),
		),
	)

	for (const className of [
		'dmk-container',
		'dmk-section',
		'dmk-media-gallery',
		'dmk-file-display',
		'dmk-action-row',
		'dmk-modal',
		'dmk-radio-group',
		'dmk-checkbox-group',
	]) {
		assert.match(output, new RegExp(className))
	}
})

test('applies disableFont option to the root messages element', () => {
	const options = {
		...DefaultOptions,
		disableFont: true,
	}
	const output = html(
		React.createElement(OptionsContext.Provider, { value: options },
			React.createElement(Messages, null, React.createElement(Message, null, 'x')),
		),
	)

	assert.match(output, /dmk-disable-font/)
})
