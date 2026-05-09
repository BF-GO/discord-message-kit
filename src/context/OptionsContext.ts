import { createContext } from 'react'
import DefaultOptions from './DefaultOptions.js'
import type { Options } from '../types.js'

const OptionsContext = createContext<Options>(DefaultOptions)

export default OptionsContext
