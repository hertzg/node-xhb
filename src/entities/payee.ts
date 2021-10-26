import { Node } from 'xml-parser'
import { atoi, parseGCharP } from './_parse'
import { hb_xml_attr_int, hb_xml_attr_txt, hb_xml_tag } from './_serialize'
import type { gCharP, gUInt32, gUShort } from './_g_types'

export interface Payee {
  key: gUInt32
  name: gCharP
  payMode: gUShort
  category: gUInt32
}

export function parsePayee({ attributes }: Node): Payee {
  return {
    key: atoi(attributes.key),
    name: parseGCharP(attributes.name),
    payMode: atoi(attributes.paymode),
    category: atoi(attributes.category),
  }
}

export const serializePayee = (payee: Payee): string =>
  hb_xml_tag(
    '<pay',
    hb_xml_attr_int('key', payee.key),
    hb_xml_attr_txt('name', payee.name),
    hb_xml_attr_int('category', payee.category),
    hb_xml_attr_int('paymode', payee.payMode),
  )
