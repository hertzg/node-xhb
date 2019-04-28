import { Node } from 'xml-parser'
import { atoi, parseGCharP, parseGDouble } from './_parse'
import {
  hb_xml_attr_amt,
  hb_xml_attr_int,
  hb_xml_attr_txt,
  hb_xml_attr_txt_crlf,
  hb_xml_tag,
} from './_serialize'
import { gCharP, gDouble, gUInt32, gUShort } from './_g_types'

export interface Account {
  key: gUInt32
  flags: gUShort
  displayPosition: gUInt32
  type: AccountType
  currency: gUInt32
  name: gCharP
  bankNumber: gCharP
  bankName: gCharP
  startingBalance: gDouble
  overdraftLimit: gDouble
  chequeBookNumber1: gUInt32
  chequeBookNumber2: gUInt32
  notes: gCharP
  defaultTemplate: gUInt32
}

export enum AccountFlag {
  CLOSED = (1 << 1) as gUShort,
  ADDED = (1 << 2) as gUShort,
  CHANGED = (1 << 3) as gUShort,
  NOSUMMAR = (1 << 4) as gUShort,
  NOBUDGET = (1 << 5) as gUShort,
  NOREPORT = (1 << 6) as gUShort,
  OLDBUDGE = (1 << 0) as gUShort,
}

export enum AccountType {
  TYPE_NONE = 0 as gUShort,
  TYPE_BANK = 1 as gUShort, // Banque
  TYPE_CASH = 2 as gUShort, // Espèce
  TYPE_ASSET = 3 as gUShort, // Actif (avoir)
  TYPE_CREDITCARD = 4 as gUShort, // Carte crédit
  TYPE_LIABILITY = 5 as gUShort, // Passif (dettes)
  //TYPE_STOCK      = 6 as gushort,  // Actions
  //TYPE_MUTUALFUND = 7 as gushort,  // Fond de placement
  //TYPE_INCOME     = 8 as gushort,  // Revenus
  //TYPE_EXPENSE    = 9 as gushort,  // Dépenses
  //TYPE_EQUITY     = 10 as gushort, // Capitaux propres
}

export function parse({ attributes }: Node): Account {
  return {
    key: atoi(attributes.key),
    flags: atoi(attributes.flags),
    displayPosition: atoi(attributes.pos),
    type: atoi(attributes.type),
    currency: atoi(attributes.curr),
    name: parseGCharP(attributes.name),
    bankNumber: parseGCharP(attributes.number),
    bankName: parseGCharP(attributes.bankname),
    startingBalance: parseGDouble(attributes.initial),
    overdraftLimit: parseGDouble(attributes.minimum),
    chequeBookNumber1: atoi(attributes.cheque1),
    chequeBookNumber2: atoi(attributes.cheque2),
    notes: parseGCharP(attributes.notes),
    defaultTemplate: atoi(attributes.tpl),
  }
}

export const serialize = (account: Account): string =>
  hb_xml_tag(
    '<account',
    hb_xml_attr_int('key', account.key),
    hb_xml_attr_int('flags', account.flags),
    hb_xml_attr_int('pos', account.displayPosition),
    hb_xml_attr_int('type', account.type),
    hb_xml_attr_int('curr', account.currency),
    hb_xml_attr_txt('name', account.name),
    hb_xml_attr_txt('number', account.bankNumber),
    hb_xml_attr_txt('bankname', account.bankName),
    hb_xml_attr_amt('initial', account.startingBalance),
    hb_xml_attr_amt('minimum', account.overdraftLimit),
    hb_xml_attr_int('cheque1', account.chequeBookNumber1),
    hb_xml_attr_int('cheque2', account.chequeBookNumber2),
    hb_xml_attr_txt_crlf('notes', account.notes),
    hb_xml_attr_int('tpl', account.defaultTemplate),
  )
