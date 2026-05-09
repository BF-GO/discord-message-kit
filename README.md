# Discord Message Kit

React and Next.js components for rendering Discord style chat previews, mentions, and embeds.

## Install

```sh
yarn add @bf-go/discord-message-kit
# or
npm install @bf-go/discord-message-kit
```

Import the package stylesheet once from your app-level CSS entry.

```tsx
// Next.js App Router: app/layout.tsx
import '@bf-go/discord-message-kit/style.css'
```

For Vite, CRA, or a client-only React app, import the same stylesheet from your app entry.

```tsx
import '@bf-go/discord-message-kit/style.css'
```

## Usage

```tsx
import {
	Mention,
	Message,
	Messages,
} from '@bf-go/discord-message-kit'

export default function Preview() {
	return (
		<Messages>
			<Message author="Atlas" avatar="blue" roleColor="#7aa2ff">
				Release notes are ready for review in <Mention type="channel">updates</Mention>.
			</Message>
			<Message author="Nova" avatar="green">
				Looks good. Please tag <Mention type="role" color="#69d391">Editors</Mention> after the final pass.
			</Message>
			<Message author="Build Bot" avatar="orange" bot edited>
				Preview build finished successfully.
			</Message>
		</Messages>
	)
}
```

## Next.js

The package entry includes a client boundary, so components can be imported from Next client components. If you provide custom options, keep the provider in a client component.

```tsx
'use client'

import {
	DefaultOptions,
	Message,
	Messages,
	OptionsContext,
	type Options,
} from '@bf-go/discord-message-kit'

const options: Options = {
	...DefaultOptions,
	defaultTheme: 'dark',
	profiles: {
		ops: {
			author: 'Ops Lead',
			avatar: 'red',
			roleColor: '#ff7b8a',
		},
	},
}

export function ChatPreview() {
	return (
		<OptionsContext.Provider value={options}>
			<Messages>
				<Message profile="ops">Deployment window starts at 18:00 UTC.</Message>
			</Messages>
		</OptionsContext.Provider>
	)
}
```

## Components

### Messages

Wraps a group of `Message` children and applies the selected theme and density.

```tsx
<Messages compactMode lightTheme>
	<Message author="Casey" avatar="gray">Compact light preview.</Message>
</Messages>
```

### Message

Renders a chat message. Supports `author`, `avatar`, `bot`, `edited`, `profile`, `roleColor`, and `timestamp`.

```tsx
<Message author="Morgan" avatar="green" roleColor="#5ed49c" timestamp="2026-05-09">
	Hand-off is complete.
</Message>
```

### Mention

Renders user, role, or channel mentions.

```tsx
<Mention />
<Mention type="channel">triage</Mention>
<Mention type="role" color="#b58cff">Reviewers</Mention>
```

### Embed

Renders rich embed content. Use `slot="embeds"` when an embed should appear below message text.

```tsx
<Message author="Status" avatar="orange" bot>
	Incident summary updated.
	<Embed slot="embeds" color="#f0b232" title="Latency spike resolved">
		Average response time returned to baseline after the cache warm-up completed.
	</Embed>
</Message>
```

Use `EmbedFields` with `slot="fields"` for grouped fields.

```tsx
<Embed color="#7aa2ff" title="Deploy checklist">
	Production release is waiting on final approval.
	<EmbedFields slot="fields">
		<EmbedField fieldTitle="Owner">Platform</EmbedField>
		<EmbedField fieldTitle="Status" inline>Ready</EmbedField>
		<EmbedField fieldTitle="Risk" inline>Low</EmbedField>
	</EmbedFields>
	<span slot="footer">Updated by automation</span>
</Embed>
```

## Options

Use `OptionsContext.Provider` to configure default theme, message density, avatar shortcuts, and profile shortcuts.

```tsx
import {
	DefaultOptions,
	OptionsContext,
	type Options,
} from '@bf-go/discord-message-kit'

const options: Options = {
	...DefaultOptions,
	defaultMode: 'comfy',
	defaultTheme: 'light',
	avatars: {
		...DefaultOptions.avatars,
		default: DefaultOptions.avatars.gray,
		reviewer: DefaultOptions.avatars.green,
	},
	profiles: {
		reviewer: {
			author: 'Reviewer',
			avatar: 'green',
			bot: false,
			roleColor: '#5ed49c',
		},
	},
}
```

## Styling

The package does not load remote fonts. Override the CSS variable if your app has a preferred UI font.

```css
.dmk-messages {
	--dmk-message-font: "Inter", system-ui, sans-serif;
}
```

## Development

```sh
yarn install
yarn typecheck
yarn build
```
