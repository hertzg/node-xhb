import { Node } from 'xml-parser'
import { atoi, parseGCharP } from './_parse'
import {
  hb_xml_attr_int,
  hb_xml_attr_int0,
  hb_xml_attr_txt,
  hb_xml_tag,
} from './_serialize'
import { gCharP, gUInt32, gUShort } from './_g_types'

export interface Properties {
  owner: gCharP
  baseCurrency: gUInt32
  vehicleCategory: gUInt32
  vehicleScheduledTransactionMode: gUShort
  vehicleScheduledTransactionWeekDay: gUShort
  vehicleScheduledTransactionNumberOfDays: gUShort
}

export enum VehicleScheduledTransactionMode {
  WEEKDAY = 0 as gUShort,
  NUMBER_OF_DAYS = 1 as gUShort,
}

export function parse({ attributes }: Node): Properties {
  return {
    owner: parseGCharP(attributes.title),
    baseCurrency: atoi(attributes.curr),
    vehicleCategory: atoi(attributes.car_category),
    vehicleScheduledTransactionMode: atoi(attributes.auto_smode),
    vehicleScheduledTransactionWeekDay: atoi(attributes.auto_weekday),
    vehicleScheduledTransactionNumberOfDays: atoi(attributes.auto_nbdays),
  }
}

export const serialize = (properties: Properties): string =>
  hb_xml_tag(
    '<properties',
    hb_xml_attr_txt('title', properties.owner),
    hb_xml_attr_int('curr', properties.baseCurrency),
    hb_xml_attr_int('car_category', properties.vehicleCategory),
    hb_xml_attr_int0('auto_smode', properties.vehicleScheduledTransactionMode),
    hb_xml_attr_int(
      'auto_weekday',
      properties.vehicleScheduledTransactionWeekDay,
    ),
    hb_xml_attr_int(
      'auto_nbdays',
      properties.vehicleScheduledTransactionNumberOfDays,
    ),
  )
