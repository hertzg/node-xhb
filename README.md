# XHB file read/write for NodeJS
This package provides ability to read and modify xhb files created by HomeBank
in somewhat sane manner.

[HomeBank](http://homebank.free.fr/) is a personal finance and money management software application built and maintained by Maxime Doyen.

## Installation and Usage

```
$ npm install xhb --save
```

```
import FS from 'fs'
import {parse, serialize} from 'xhb'


const contents = FS.readFileSync('./homebank.xhb', {encoding:'utf8'})
const xhb = parse(contents)

// modify / copy / clone the xhb object, whatever you need to do with it.

const modified = serialize(xhb);
FS.writeFileSync('./homebank-modified.xhb', modified, {encoding: 'utf8'})
```

## API overview

As the original code is using GLib types, following aliases are used to map to javascript types

```
export type gShort = number
export type gUShort = number
export type gInt = number
export type gUInt32 = number
export type gCharP = string
export type gDouble = string // For airthmetic operations, consider using decimal.js
export type gBoolean = number // https://developer.gnome.org/glib/stable/glib-Basic-Types.html#gboolean
```

### XHB File structure

```
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
```

For more information, please see type definitions for respective entities from source code.

### FAQ
Here are some questions that come up or most likely will come up.

##### Dates are in weird format, how do I convert them to js Dates?

The dates are in GLib specific julian day format (which is not "real" julian day count).
Consider using package [`gdate-julian`](https://github.com/hertzg/node-gdate-julian) package.

---

##### All the amounts are parsed as `strings` not `numbers`. Why?

All amounts in HomBank are handled as `gdoubles` in C, here are a few reasons why I went with strings in javascript:

- There is no double type in javascript
- It's out of the scope of this project
- Using `floats` (`number`) would not be able to fit all values
- The values in XML are strings so you can parse them as you see fit.

Recommendation:
Consider using decimal.js package to work with `gdoubles` It will save you quite a lot of headache.

---

##### Tags is always empty, even thou I've added tags to operations. Whats up with that?

HomeBank does not create them separately in XML. This package reads and write the XHB file as it is.

---

##### The XML produced is not "correct" xml and why do you use `sprintf` to create xml tags? That's stupid!

This is the way HomeBank deals with XML files. Don't believe me? Check the source code on launchpad.
The goal of this project is to be able to read and write files acceptable by that application so I mimic the way it
deals with the file format.

See: [https://bazaar.launchpad.net/~mdoyen/homebank/5.2.x/view/head:/src/hb-xml.c#L1214](https://bazaar.launchpad.net/~mdoyen/homebank/5.2.x/view/head:/src/hb-xml.c#L1214)

---
