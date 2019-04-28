#XHB file read/write for NodeJS
This package provides ability to read and modify xhb files created by HomeBank
in a sane manner.

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

## API

As the original code is using GLib types, following aliases are used to map to javascript types

```
export type gShort = number
export type gUShort = number
export type gInt = number
export type gUInt32 = number
export type gCharP = string
export type gDouble = string // For airthmetic consider using decimal.js instead of floats
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

For more information, please see type definitions for respective entities

### FAQ

Question: Dates are in weird format, how do I convert them to js Dates?
```
Answer: The dates are in GLib specific julian day format (which is not "real" julian day count). 
Consider using package [`gdate-julian`](/hertzg/node-gdate-julian) package.
```

Question: All the amounts are parsed as `strings` not `numbers`. Why?
```
Answer: All amounts are using handled as gdoubles in C, here are a few reasons:
* There is no double in javascript
* Using floats would loose precision
* I want to provide flexibility on how you choose to deal with that.

Solution/Workaround/Recomendation: Consider using decimal.js package to work with gdoubles 
It will save you quite a lot of headache.
```

Question: Tags is always empty, even thou I've added tags to operations. Whats up with that?
```
Answer: This package reads and write the XHB file as it is, and HomeBank (as of writing) does not create tag objects
for each tag, Hence the empty array.
```

Question: The XML produced is not "correct" xml and why do you use `sprintf` to create xml tags? That's stupid!
```
Answer: This is the way Homebank deals with XML files. Don't believe me? Check the source code on launchpad.
The goal of this project is to be able to read and write files acceptable by that application so unfortunately
we had to deal with it.

Example: https://bazaar.launchpad.net/~mdoyen/homebank/5.2.x/view/head:/src/hb-xml.c#L1214
```
