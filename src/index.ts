import XMLParser, { Node } from 'xml-parser'
import {
  parseProperties,
  Properties,
  serializeProperties,
} from './entities/properties'
import { Category, parseCategory, serializeCategory } from './entities/category'
import { parsePayee, Payee, serializePayee } from './entities/payee'
import { Assign, parseAssign, serializeAssign } from './entities/assign'
import { Account, parseAccount, serializeAccount } from './entities/account'
import { parseVersions, serializeVersions, Versions } from './entities/versions'
import { Currency, parseCurrency, serializeCurrency } from './entities/currency'
import { parseTag, serializeTag, Tag } from './entities/tag'
import { Archive, parseArchive, serializeArchive } from './entities/archive'
import {
  Operation,
  parseOperation,
  serializeOperation,
} from './entities/operation'

export interface XHB {
  versions: Versions
  properties?: Properties
  accounts: Account[]
  archives: Archive[]
  assigns: Assign[]
  categories: Category[]
  currencies: Currency[]
  operations: Operation[]
  payees: Payee[]
  tags: Tag[]
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type VolatileXHB = Pick<XHB, 'versions'> & Partial<Omit<XHB, 'versions'>>

export enum NodeName {
  ACCOUNT = 'account',
  ARCHIVE = 'fav',
  ASSIGN = 'asg',
  PAYEE = 'pay',
  PROPERTIES = 'properties',
  CATEGORY = 'cat',
  CURRENCY = 'cur',
  TAG = 'tag',
  OPERATION = 'ope',
}

export interface ParseOptions {
  onEntity?: <T>(entity: T, node: Node) => T
  onUnknownNode?: (node: Node) => void
}

const defaultParseOnEntity = <T>(entity: T): T | any => entity
const defaultParseOnUnknownNode = (): void => undefined

export function parse(xml: string, options: ParseOptions = {}): XHB {
  const doc = XMLParser(xml),
    opts: Required<ParseOptions> = {
      onEntity: options.onEntity || defaultParseOnEntity,
      onUnknownNode: options.onUnknownNode || defaultParseOnUnknownNode,
    }

  const xhb: XHB = {
    versions: parseVersions(doc.root),
    properties: undefined,
    accounts: [],
    archives: [],
    assigns: [],
    categories: [],
    currencies: [],
    operations: [],
    payees: [],
    tags: [],
  }

  doc.root.children.forEach((node) => {
    switch (node.name) {
      case NodeName.ACCOUNT:
        xhb.accounts.push(opts.onEntity(parseAccount(node), node))
        break
      case NodeName.ARCHIVE:
        xhb.archives.push(opts.onEntity(parseArchive(node), node))
        break
      case NodeName.ASSIGN:
        xhb.assigns.push(opts.onEntity(parseAssign(node, xhb), node))
        break
      case NodeName.PAYEE:
        xhb.payees.push(opts.onEntity(parsePayee(node), node))
        break
      case NodeName.PROPERTIES:
        xhb.properties = opts.onEntity(parseProperties(node), node)
        break
      case NodeName.CATEGORY:
        xhb.categories.push(opts.onEntity(parseCategory(node), node))
        break
      case NodeName.CURRENCY:
        xhb.currencies.push(opts.onEntity(parseCurrency(node), node))
        break
      case NodeName.TAG:
        xhb.tags.push(opts.onEntity(parseTag(node), node))
        break
      case NodeName.OPERATION:
        xhb.operations.push(opts.onEntity(parseOperation(node), node))
        break
      default:
        opts.onUnknownNode(node)
    }
  })

  return xhb
}

export interface SerializeOptions {
  onEntity?: <T>(entity: T | any, serialized: string) => string
}

const defaultSerializeOnEntity = (entity: any, serialized: string) => serialized

export const serialize = (xhb: XHB, options: SerializeOptions = {}): string => {
  const opts: Required<SerializeOptions> = {
    onEntity: options.onEntity || defaultSerializeOnEntity,
  }

  const mapAndConcat = <T>(
    array: T[],
    mapFn: (entry: T, ...args: any[]) => string,
    glue = '\n',
  ) =>
    array && Array.isArray(array)
      ? array
          .map((entry, ...args) => opts.onEntity(entry, mapFn(entry, ...args)))
          .join(glue)
      : ''

  return [
    '<?xml version="1.0"?>',
    opts.onEntity(xhb.versions, serializeVersions(xhb.versions)),
    opts.onEntity(
      xhb.properties,
      xhb.properties !== undefined ? serializeProperties(xhb.properties) : '',
    ),
    mapAndConcat(xhb.currencies, serializeCurrency),
    mapAndConcat(xhb.accounts, serializeAccount),
    mapAndConcat(xhb.payees, serializePayee),
    mapAndConcat(xhb.categories, serializeCategory),
    mapAndConcat(xhb.tags, serializeTag),
    mapAndConcat(xhb.assigns, serializeAssign),
    mapAndConcat(xhb.archives, serializeArchive),
    mapAndConcat(xhb.operations, serializeOperation),
    '</homebank>\n',
  ]
    .filter((line) => line && line.length)
    .join('\n')
}

export * from './entities/_g_types'
export * from './entities/_parse'
export * from './entities/_serialize'
export * from './entities/account'
export * from './entities/archive'
export * from './entities/assign'
export * from './entities/category'
export * from './entities/currency'
export * from './entities/operation'
export * from './entities/payee'
export * from './entities/properties'
export * from './entities/tag'
export * from './entities/versions'
