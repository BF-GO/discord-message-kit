# Discord Message Kit

React and Next.js visual preview components for Discord-like messages, markdown, mentions, embeds, attachments, polls, reactions, stickers, and message components.

This package is not affiliated with, endorsed by, or sponsored by Discord. It is a visual preview kit, not an official Discord client, API SDK, or pixel-perfect clone.

## Install

```sh
yarn add @bf-go/discord-message-kit
# or
npm install @bf-go/discord-message-kit
```

Import the package stylesheet once from your app-level CSS entry.

```tsx
import '@bf-go/discord-message-kit/style.css'
```

## Basic Usage

```tsx
import {
	Embed,
	Mention,
	Message,
	Messages,
} from '@bf-go/discord-message-kit'

export default function Preview() {
	return (
		<Messages>
			<Message author="Atlas" avatar="blue" roleColor="#7aa2ff">
				Release notes are ready in <Mention type="channel">updates</Mention>.
			</Message>
			<Message author="Build Bot" avatar="orange" bot edited>
				Preview build finished.
				<Embed slot="embeds" color="#f0b232" title="Deploy summary">
					Cache warm-up completed.
				</Embed>
				<Embed slot="embeds" color="#69d391" title="Health checks">
					All regions are green.
				</Embed>
			</Message>
		</Messages>
	)
}
```

## Markdown

Use `markdown` on message/embed/text components, or render markdown directly with `Markdown`.

```tsx
<Message author="Nova" markdown timestamp="2026-05-09T18:00:00Z" timestampFormat="f">
	{'**Ready** for review in <#103735883630395392>. ||Internal note||'}
</Message>
```

Entity names for parsed mentions, emojis, and slash commands come from `OptionsContext`.

```tsx
const options = {
	...DefaultOptions,
	entities: {
		channels: {
			'103735883630395392': { name: 'updates' },
		},
		roles: {
			'165511591545143296': { name: 'Editors', color: '#69d391' },
		},
		users: {
			'80351110224678912': { name: 'Atlas' },
		},
	},
}
```

Supported timestamp styles are `t`, `T`, `d`, `D`, `f`, `F`, `s`, `S`, and `R`. Component props use JavaScript timestamps when numbers are provided. Markdown `<t:...>` timestamps use Discord-style Unix seconds.

## Message Extras

```tsx
import {
	Attachment,
	Attachments,
	Poll,
	PollAnswer,
	Reaction,
	Reactions,
	ReplyPreview,
	Sticker,
} from '@bf-go/discord-message-kit'

<Message author="Atlas">
	<ReplyPreview author="Nova">Can you check the report?</ReplyPreview>
	<Attachments>
		<Attachment
			fileName="report.png"
			fileSize="128 KB"
			image="https://example.com/report.png"
			url="https://example.com/report.png"
		/>
	</Attachments>
	<Poll question="Ship the release?" totalVotes={12}>
		<PollAnswer percentage={75} votes={9} meVoted>Ship it</PollAnswer>
		<PollAnswer percentage={25} votes={3}>Wait</PollAnswer>
	</Poll>
	<Reactions>
		<Reaction count={4} me>OK</Reaction>
	</Reactions>
	<Sticker name="Wave" image="https://example.com/sticker.webp" />
</Message>
```

## Components V2 Preview

The component preview APIs are visual only. They do not send Discord interactions.

```tsx
import {
	ActionRow,
	Button,
	Container,
	MediaGallery,
	MediaGalleryItem,
	Section,
	SelectMenu,
	TextDisplay,
	Thumbnail,
} from '@bf-go/discord-message-kit'

<Container accentColor="#5865f2">
	<TextDisplay># Release v7.3</TextDisplay>
	<Section accessory={<Thumbnail media="https://example.com/thumb.png" />}>
		<TextDisplay>Patch notes are ready for review.</TextDisplay>
	</Section>
	<MediaGallery>
		<MediaGalleryItem media="https://example.com/screen.png" description="Preview" />
	</MediaGallery>
	<ActionRow>
		<Button variant="primary">Approve</Button>
		<SelectMenu placeholder="Choose an environment">Production</SelectMenu>
	</ActionRow>
</Container>
```

Modal-only visual components are also available: `Modal`, `Label`, `TextInput`, `FileUpload`, `RadioGroup`, `RadioOption`, `CheckboxGroup`, and `Checkbox`.

## Options

Use `OptionsContext.Provider` to configure theme defaults, density, avatars, profiles, timestamp defaults, entity names, and font behavior.

```tsx
import {
	DefaultOptions,
	Messages,
	OptionsContext,
	type Options,
} from '@bf-go/discord-message-kit'

const options: Options = {
	...DefaultOptions,
	defaultMode: 'comfy',
	defaultTheme: 'dark',
	defaultTimestampFormat: 'f',
	disableFont: false,
	avatars: {
		...DefaultOptions.avatars,
		reviewer: DefaultOptions.avatars.green,
	},
	profiles: {
		reviewer: {
			author: 'Reviewer',
			avatar: 'green',
			roleColor: '#5ed49c',
		},
	},
}

export function ChatPreview({ children }: { children: React.ReactNode }) {
	return (
		<OptionsContext.Provider value={options}>
			<Messages>{children}</Messages>
		</OptionsContext.Provider>
	)
}
```

Set `disableFont: true` to inherit the surrounding app font instead of applying the Discord-like font stack.

## URL Safety

Links render as anchors only for `http:` and `https:` URLs. Media props render only safe image sources such as `http:`, `https:`, `blob:`, and `data:image/*`. Invalid URLs are rendered as plain text or omitted.

## Development

```sh
yarn install
yarn typecheck
yarn test
yarn build
```
