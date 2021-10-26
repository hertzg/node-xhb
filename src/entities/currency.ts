import { Node } from 'xml-parser'
import { atoi, parseGCharP, parseGDouble } from './_parse'
import { sprintf } from 'printj'
import { dtostr } from './_serialize'
import type { gBoolean, gCharP, gDouble, gShort, gUInt32, gUShort } from './_g_types'

export interface Currency {
  key: gUInt32
  flags: gUShort
  name: gCharP
  isoCode: gCharP
  symbol: gCharP
  symbolIsPrefixed: gBoolean
  decimalCharacter: gCharP
  groupingCharacter: gCharP
  fractionDigits: gShort
  exchangeRate: gDouble
  lastUpdatedDate: gUInt32
}

export enum CurrencyFlag {
  // 0 is free
  CUSTOM = (1 << 1) as gUShort,
}

export function parseCurrency({ attributes }: Node): Currency {
  return {
    key: atoi(attributes.key),
    flags: atoi(attributes.flags),
    name: parseGCharP(attributes.name),
    isoCode: parseGCharP(attributes.iso),
    symbol: parseGCharP(attributes.symb),
    symbolIsPrefixed: atoi(attributes.syprf),
    decimalCharacter: parseGCharP(attributes.dchar),
    groupingCharacter: parseGCharP(attributes.gchar),
    fractionDigits: atoi(attributes.frac),
    exchangeRate: parseGDouble(attributes.rate),
    lastUpdatedDate: atoi(attributes.mdate),
  }
}

export const serializeCurrency = (currency: Currency): string =>
  sprintf(
    '<cur key="%d" flags="%d" iso="%s" name="%s" symb="%s" syprf="%d" dchar="%s" gchar="%s" frac="%d" rate="%s" mdate="%d"/>',
    currency.key,
    currency.flags,
    currency.isoCode,
    currency.name,
    currency.symbol,
    currency.symbolIsPrefixed,
    currency.decimalCharacter,
    currency.groupingCharacter,
    currency.fractionDigits,
    dtostr(currency.exchangeRate),
    currency.lastUpdatedDate,
  )
