import { sprintf } from 'printj'
import type { gCharP, gDouble, gUInt32 } from './_g_types'

export const hb_xml_attr_txt = (attrName: string, value: gCharP) =>
  value === null || value === undefined
    ? ''
    : sprintf('%s="%s"', attrName, value)

export const hb_escape_text = (str: gCharP): string => {
  let newStr = ''
  for (let i = 0, ln = str.length; i < ln; i++) {
    switch (str[i]) {
      case '&':
        newStr += '&amp;'
        break

      case '<':
        newStr += '&lt;'
        break

      case '>':
        newStr += '&gt;'
        break

      case "'":
        newStr += '&apos;'
        break

      case '"':
        newStr += '&quot;'
        break

      default:
        const c = str.charCodeAt(i)
        if (
          (0x1 <= c && c <= 0x8) ||
          (0xa <= c && c <= 0xd) || //changed here from b<->c to a<->d
          (0xe <= c && c <= 0x1f) ||
          (0x7f <= c && c <= 0x84) ||
          (0x86 <= c && c <= 0x9f)
        ) {
          newStr += sprintf('&#x%x;', c)
        } else {
          newStr += str[i]
        }
    }
  }

  return newStr
}

export const hb_xml_attr_txt_crlf = (attrName: string, value: gCharP): string =>
  value === null || value === undefined
    ? ''
    : hb_xml_attr_txt(attrName, hb_escape_text(value))

export const hb_xml_attr_int0 = (attrName: string, value: number): string =>
  value === null || value === undefined
    ? ''
    : sprintf('%s="%d"', attrName, value)

export const hb_xml_attr_int = (attrName, value): string =>
  value === 0 ? '' : hb_xml_attr_int0(attrName, value)

export const dtostr = (d: gDouble): string => d /*.toString()*/

export const hb_xml_tag = (prefix: string, ..._attrs: string[]): string => {
  const attrs = _attrs.filter((v) => v && v.length)
  return `${prefix}${attrs.length ? ' ' : ''}${attrs.join(' ')}/>`
}

export const hb_xml_attr_amt = (attrName: string, amt: gDouble): string =>
  amt === null || amt === undefined
    ? ''
    : sprintf('%s="%s"', attrName, dtostr(amt))

export const tags_toStr = (tags) =>
  tags && Array.isArray(tags) ? tags.join(' ') : ''

export interface AttrSplit {
  cat: gUInt32
  amt: gDouble
  mem: gCharP
}

export const hb_xml_attrs_splits = (splits: AttrSplit[]): string =>
  splits && splits.length
    ? [
        hb_xml_attr_txt('scat', splits.map((v) => v.cat).join('||')),
        hb_xml_attr_txt('samt', splits.map((v) => dtostr(v.amt)).join('||')),
        hb_xml_attr_txt(
          'smem',
          splits
            .map((v) =>
              (v.mem === null || v.mem === undefined ? '' : v.mem).replace(
                '|',
                '',
              ),
            )
            .join('||'),
        ),
      ].join(' ')
    : ''
