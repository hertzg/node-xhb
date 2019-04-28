import { gCharP, gDouble, gInt, gUInt32 } from './_g_types'

const parseAsInt = <T extends number>(s: string): T => parseInt(s, 10) as T
const parseAsString = <T extends string>(s: string) => s && (String(s) as T)
const parseAsDecimal = <T extends string>(s: string) => s //new DecimalJS(s) as T

export const atoi = <T extends number>(s: string): T | 0 =>
  typeof s === 'undefined' || s === null ? 0 : parseAsInt<T>(s)

export const parseGInt = (s: string): gInt => parseAsInt<gInt>(s)
export const parseGUInt32 = (s: string): gUInt32 => parseAsInt<gUInt32>(s)
export const parseGCharP = (s: string): gCharP => parseAsString<gCharP>(s)
export const parseGDouble = (s: string): gDouble => parseAsDecimal<gDouble>(s)
