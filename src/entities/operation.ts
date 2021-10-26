import { Node } from 'xml-parser'
import { atoi, parseGCharP, parseGDouble, parseGUInt32 } from './_parse'
import { ArchiveFlag } from './archive'
import {
  AttrSplit,
  hb_xml_attr_amt,
  hb_xml_attr_int,
  hb_xml_attr_txt,
  hb_xml_attrs_splits,
  hb_xml_tag,
  tags_toStr,
} from './_serialize'
import type { gCharP, gDouble, gUInt32, gUShort } from './_g_types'

export interface Operation {
  date: gUInt32
  amount: gDouble
  account: gUInt32
  destinationAccount: gUInt32
  payMode: gUShort
  status: gUShort
  flags: gUShort
  payee: gUInt32
  category: gUInt32
  memo: gCharP // wording
  info: gCharP // wording
  tags: gCharP[]
  kxfer: gUInt32 //kxfer
  splits: OperationSplit[]
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

export interface OperationSplit {
  category: gUInt32
  memo: gCharP
  amount: gDouble
}

export enum OperationFlag {
  OLDVALID = (1 << 0) as gUShort, //deprecated since 5.x
  INCOME = (1 << 1) as gUShort,
  AUTO = (1 << 2) as gUShort, //scheduled
  ADDED = (1 << 3) as gUShort, //tmp flag
  CHANGED = (1 << 4) as gUShort, //tmp flag
  OLDREMIND = (1 << 5) as gUShort, //deprecated since 5.x
  CHEQ2 = (1 << 6) as gUShort,
  LIMIT = (1 << 7) as gUShort, //scheduled
  SPLIT = (1 << 8) as gUShort,
}

export function parseOperation({ attributes }: Node): Operation {
  const tags: gCharP[] = attributes.tags
    ? parseGCharP(attributes.tags).split(' ')
    : []
  const splits: OperationSplit[] = []

  const hasSplits = attributes.scat || attributes.samt || attributes.smem
  if (hasSplits) {
    const cats = parseGCharP(attributes.scat).split('||'),
      amts = parseGCharP(attributes.samt).split('||'),
      mems = parseGCharP(attributes.smem).split('||')

    for (let i = 0, ln = cats.length; i < ln; i++) {
      splits.push({
        category: parseGUInt32(cats[i]),
        amount: parseGDouble(amts[i]),
        memo: parseGCharP(mems[i]),
      })
    }
  }

  const operation: Operation = {
    date: atoi(attributes.date),
    amount: parseGDouble(attributes.amount),
    account: atoi(attributes.account),
    destinationAccount: atoi(attributes.dst_account),
    payMode: atoi(attributes.paymode),
    status: atoi(attributes.st),
    flags: atoi(attributes.flags),
    payee: atoi(attributes.payee),
    category: atoi(attributes.category),
    memo: parseGCharP(attributes.wording), // wording
    info: parseGCharP(attributes.info),
    tags,
    kxfer: atoi(attributes.kxfer),
    splits,
  }

  if (hasSplits) {
    operation.flags |= ArchiveFlag.SPLIT
  }

  return operation
}

const operationSplitsToSplits = (aSplits: OperationSplit[]): AttrSplit[] =>
  aSplits.map<AttrSplit>((aSplit) => ({
    cat: aSplit.category,
    amt: aSplit.amount,
    mem: aSplit.memo,
  }))

export const serializeOperation = (operation: Operation): string => {
  const tags = tags_toStr(operation.tags)
  const splits = operationSplitsToSplits(operation.splits)
  return hb_xml_tag(
    '<ope',
    hb_xml_attr_int('date', operation.date),
    hb_xml_attr_amt('amount', operation.amount),
    hb_xml_attr_int('account', operation.account),
    hb_xml_attr_int('dst_account', operation.destinationAccount),
    hb_xml_attr_int('paymode', operation.payMode),
    hb_xml_attr_int('st', operation.status),
    hb_xml_attr_int('flags', operation.flags),
    hb_xml_attr_int('payee', operation.payee),
    hb_xml_attr_int('category', operation.category),
    hb_xml_attr_txt('wording', operation.memo),
    hb_xml_attr_txt('info', operation.info),
    tags && hb_xml_attr_txt('tags', tags),
    hb_xml_attr_int('kxfer', operation.kxfer),
    splits && hb_xml_attrs_splits(splits),
  )
}
