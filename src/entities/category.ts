import { Node } from 'xml-parser'
import { atoi, parseGCharP, parseGDouble } from './_parse'
import {
  dtostr,
  hb_xml_attr_int,
  hb_xml_attr_txt,
  hb_xml_tag,
} from './_serialize'
import { sprintf } from 'printj'
import { gCharP, gDouble, gUInt32, gUShort } from './_g_types'

export interface Category {
  key: gUInt32
  parent: gUInt32
  flags: gUShort
  name: gCharP
  budgets: gDouble[]
}

export enum CategoryFlag {
  SUB = (1 << 0) as gUShort,
  INCOME = (1 << 1) as gUShort,
  CUSTOM = (1 << 2) as gUShort,
  BUDGET = (1 << 3) as gUShort,
  FORCED = (1 << 4) as gUShort,
}

export function parse({ attributes }: Node): Category {
  const budgets: gDouble[] = new Array(12)
  for (let i = 0, ln = 12; i <= ln; i++) {
    const bAttr = `b${i}`
    if (bAttr in attributes) {
      budgets[i] = parseGDouble(attributes[bAttr])
    }
  }

  return {
    key: atoi(attributes.key),
    parent: atoi(attributes.parent),
    flags: atoi(attributes.flags),
    name: parseGCharP(attributes.name),
    budgets,
  }
}

const hb_xml_attrs_budgets = (budget) =>
  Array.isArray(budget)
    ? budget
        .filter((b) => b !== null || b !== undefined)
        .map((v, i) => sprintf('b%d="%s"', i, dtostr(v)))
        .join(' ')
    : ''
export const serialize = (category: Category): string =>
  hb_xml_tag(
    '<cat',
    hb_xml_attr_int('key', category.key),
    hb_xml_attr_int('parent', category.parent),
    hb_xml_attr_int('flags', category.flags),
    hb_xml_attr_txt('name', category.name),
    hb_xml_attrs_budgets(category.budgets),
  )
