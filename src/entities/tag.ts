import { Node } from 'xml-parser'
import { atoi, parseGCharP } from './_parse'
import { sprintf } from 'printj'
import { gCharP, gUInt32 } from './_g_types'

export interface Tag {
  key: gUInt32
  name: gCharP
}

export function parse({ attributes }: Node): Tag {
  return {
    key: atoi(attributes.key),
    name: parseGCharP(attributes.name),
  }
}

export const serialize = (tag: Tag): string =>
  sprintf('<tag key="%d" name="%s"/>', tag.key, tag.name)
