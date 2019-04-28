import { Node } from 'xml-parser'
import { atoi, parseGCharP } from './_parse'
import { hb_xml_attr_int, hb_xml_attr_txt, hb_xml_tag } from './_serialize'
import { gCharP, gUInt32, gUShort } from './_g_types'

export interface Payee {
  key: gUInt32
  name: gCharP
  payMode: gUShort
  category: gUInt32
}

export enum PayMode {
  NONE = 0 as gUShort,
  CCARD = 1 as gUShort,
  CHECK = 2 as gUShort,
  CASH = 3 as gUShort,
  XFER = 4 as gUShort,
  INTXFER = 5 as gUShort,
  DCARD = 6 as gUShort,
  REPEATPMT = 7 as gUShort,
  EPAYMENT = 8 as gUShort,
  DEPOSIT = 9 as gUShort,
  FEE = 10 as gUShort,
  DIRECTDEBIT = 11 as gUShort,
  NUM_PAYMODE_MAX = 12 as gUShort,
}

export function parse({ attributes }: Node): Payee {
  return {
    key: atoi(attributes.key),
    name: parseGCharP(attributes.name),
    payMode: atoi(attributes.paymode),
    category: atoi(attributes.category),
  }
}

export const serialize = (payee: Payee): string =>
  hb_xml_tag(
    '<pay',
    hb_xml_attr_int('key', payee.key),
    hb_xml_attr_txt('name', payee.name),
    hb_xml_attr_int('category', payee.category),
    hb_xml_attr_int('paymode', payee.payMode),
  )
