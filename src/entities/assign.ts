import { Node } from 'xml-parser'
import { PayMode } from './payee'
import { atoi, parseGCharP } from './_parse'
import { VolatileXHB } from '../index'
import { hb_xml_attr_int, hb_xml_attr_txt, hb_xml_tag } from './_serialize'
import { gCharP, gUInt32, gUShort } from './_g_types'

export interface Assign {
  key: gUInt32
  flags: gUShort
  field: gUShort
  name: gCharP
  payee: gUInt32
  category: gUInt32
  payMode: PayMode
}

export enum AssignField {
  MEMO = 0 as gUShort,
  PAYEE = 1 as gUShort,
}

export enum AssignFlag {
  EXACT = (1 << 0) as gUShort,
  DOPAY = (1 << 1) as gUShort,
  DOCAT = (1 << 2) as gUShort,
  DOMOD = (1 << 3) as gUShort,
  REGEX = (1 << 8) as gUShort,
  OVWPAY = (1 << 9) as gUShort,
  OVWCAT = (1 << 10) as gUShort,
  OVWMOD = (1 << 11) as gUShort,
}

export function parse({ attributes }: Node, xhb: VolatileXHB): Assign {
  const entry: Assign = {
    key: atoi(attributes.key),
    flags: atoi(attributes.flags),
    field: atoi(attributes.field),
    name: parseGCharP(attributes.name),
    payee: atoi(attributes.payee),
    category: atoi(attributes.category),
    payMode: atoi(attributes.paymode),
  }

  /* in v08 exact moved to flag */
  if (parseFloat(xhb.versions.file) <= 0.7) {
    entry.flags = AssignFlag.DOCAT | AssignFlag.DOPAY
    if (typeof attributes.exact !== 'undefined' && atoi(attributes.exact) > 0) {
      entry.flags |= AssignFlag.EXACT
    }
  }

  return entry
}

export const serialize = (assign: Assign): string =>
  hb_xml_tag(
    '<asg',
    hb_xml_attr_int('key', assign.key),
    hb_xml_attr_int('flags', assign.flags),
    hb_xml_attr_int('field', assign.field),
    hb_xml_attr_txt('name', assign.name),
    hb_xml_attr_int('payee', assign.payee),
    hb_xml_attr_int('category', assign.category),
    hb_xml_attr_int('paymode', assign.payMode),
  )
