import Util from 'util'
import Path from 'path'
import FS from 'fs'
import { parse, serialize } from '../index'

const readFile = Util.promisify(FS.readFile)

describe('File saved by HomeBank v5.3.1', () => {
  let originalFileContents
  beforeAll(async () => {
    originalFileContents = await readFile(
      Path.join(__dirname, './fixtures/example-v5.3.1.xhb'),
      { encoding: 'utf8' },
    )
  })

  it('produces identical output when saving unmodified parsed object', async () => {
    const serialized = serialize(parse(originalFileContents))
    expect(serialized).toEqual(originalFileContents)
  })
})
