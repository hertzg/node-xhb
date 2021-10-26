import { Node } from 'xml-parser'
import { atoi, parseGCharP, parseGDouble, parseGUInt32 } from './_parse'
import {
  AttrSplit,
  hb_xml_attr_amt,
  hb_xml_attr_int,
  hb_xml_attr_txt,
  hb_xml_attrs_splits,
  hb_xml_tag,
  tags_toStr,
} from './_serialize'
import { gCharP, gDouble, gUInt32, gUShort } from './_g_types'

export interface Archive {
  key: gUInt32
  amount: gDouble
  account: gUInt32
  destinationAccount: gUInt32
  payMode: gUShort
  status: gUShort
  flags: gUShort
  payee: gUInt32
  category: gUInt32
  memo: gCharP // wording
  tags: gCharP[]
  scheduledNextDate: gUInt32 //nextdate
  scheduledEveryNumber: gUShort //every
  scheduledEveryUnit: gUShort //unit
  scheduledStopAfter: gUShort //limit
  scheduledWeekend: gUShort //weekend
  scheduledGap: gUShort //gap
  splits: ArchiveSplit[]
}

export interface ArchiveSplit {
  category: gUInt32
  memo: gCharP
  amount: gDouble
}

export enum ArchiveFlag {
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

export enum ArchiveStatus {
  NONE,
  CLEARED,
  RECONCILED,
  REMIND,
  //VOID
}

export enum ScheduledEveryUnit {
  DAY = 0 as gUShort,
  WEEK = 1 as gUShort,
  MONTH = 2 as gUShort,
  //QUARTER,
  YEAR = 3 as gUShort,
}

export enum ScheduledWeekendPolicy {
  POSSIBLE = 0 as gUShort,
  BEFORE = 1 as gUShort,
  AFTER = 2 as gUShort,
}

export function parseArchive({ attributes }: Node): Archive {
  const tags: gCharP[] = attributes.tags
    ? parseGCharP(attributes.tags).split(' ')
    : []
  const splits: ArchiveSplit[] = []

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

  const archive: Archive = {
    key: atoi(attributes.key),
    amount: parseGDouble(attributes.amount),
    account: atoi(attributes.account),
    destinationAccount: atoi(attributes.dst_account),
    payMode: atoi(attributes.paymode),
    status: atoi(attributes.st),
    flags: atoi(attributes.flags),
    payee: atoi(attributes.payee),
    category: atoi(attributes.category),
    memo: parseGCharP(attributes.wording), // wording
    tags,
    scheduledNextDate: atoi(attributes.nextdate), //nextdate
    scheduledEveryNumber: atoi(attributes.every), //every
    scheduledEveryUnit: atoi(attributes.unit), //unit
    scheduledStopAfter: atoi(attributes.limit), //limit
    scheduledWeekend: atoi(attributes.weekend), //weekend
    scheduledGap: atoi(attributes.gap), //gap
    splits,
  }

  if (hasSplits) {
    archive.flags |= ArchiveFlag.SPLIT
  }

  return archive
}

const archiveSplitsToSplits = (aSplits: ArchiveSplit[]): AttrSplit[] =>
  aSplits.map<AttrSplit>((aSplit) => ({
    cat: aSplit.category,
    amt: aSplit.amount,
    mem: aSplit.memo,
  }))

export const serializeArchive = (archive: Archive): string => {
  const tags = tags_toStr(archive.tags)
  const splits = archiveSplitsToSplits(archive.splits)
  return hb_xml_tag(
    '<fav',
    hb_xml_attr_int('key', archive.key),
    hb_xml_attr_amt('amount', archive.amount),
    hb_xml_attr_int('account', archive.account),
    hb_xml_attr_int('dst_account', archive.destinationAccount),
    hb_xml_attr_int('paymode', archive.payMode),
    hb_xml_attr_int('st', archive.status),
    hb_xml_attr_int('flags', archive.flags),
    hb_xml_attr_int('payee', archive.payee),
    hb_xml_attr_int('category', archive.category),
    hb_xml_attr_txt('wording', archive.memo),
    tags && hb_xml_attr_txt('tags', tags),
    hb_xml_attr_int('nextdate', archive.scheduledNextDate),
    hb_xml_attr_int('every', archive.scheduledEveryNumber),
    hb_xml_attr_int('unit', archive.scheduledEveryUnit),
    hb_xml_attr_int('limit', archive.scheduledStopAfter),
    hb_xml_attr_int('weekend', archive.scheduledWeekend),
    hb_xml_attr_int('gap', archive.scheduledGap),
    splits && hb_xml_attrs_splits(splits),
  )
}
