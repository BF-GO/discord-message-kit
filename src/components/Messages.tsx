import { Children, cloneElement, isValidElement, useContext, type ReactElement } from 'react'
import DefaultOptions from '../context/DefaultOptions.js'
import OptionsContext from '../context/OptionsContext.js'
import type { MessageProps, MessagesProps } from '../types.js'
import { classNames } from '../util.js'

export default function Messages({ children, compactMode, lightTheme }: MessagesProps) {
	const options = useContext(OptionsContext) || DefaultOptions
	const resolvedLightTheme = lightTheme === true || (options.defaultTheme === 'light' && lightTheme !== false)
	const resolvedCompactMode = compactMode === true || (options.defaultMode === 'compact' && compactMode !== false)

	const messages = Children.map(children, element => {
		if (!isValidElement(element)) return element
		return cloneElement(element as ReactElement<MessageProps>, { compactMode: resolvedCompactMode })
	})

	return (
		<div className={classNames(
			'dmk-messages',
			resolvedLightTheme && 'dmk-light-theme',
			resolvedCompactMode && 'dmk-compact-mode',
		)}>
			{messages}
		</div>
	)
}
