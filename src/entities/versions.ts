import { Node } from 'xml-parser'
import { parseGDouble, parseGInt } from './_parse'
import { sprintf } from 'printj'
import { gDouble, gInt } from './_g_types'

export interface Versions {
  file: gDouble
  data: gInt
}

export function parse({ attributes }: Node): Versions {
  return {
    file: parseGDouble(attributes.v),
    data: parseGInt(attributes.d),
  }
}

export const serialize = (versions: Versions) =>
  sprintf('<homebank v="%s" d="%06d">', versions.file, versions.data)
