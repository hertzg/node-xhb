import Path from 'path'
import FS from 'fs'
import { parse, serialize } from '../index'

const SAVES_DIR = Path.join(__dirname, './fixtures/saves')
const SAVES = FS.readdirSync(SAVES_DIR)
  .filter((name) => name.endsWith('.xhb'))
  .map((name) => ({
    name,
    path: Path.join(SAVES_DIR, name),
  }))

describe('Can parse and serialize supported versions', () => {
  SAVES.forEach(({ name, path }) => {
    it(`produces identical output when saving unmodified parsed object for ${name}`, () => {
      const contents = FS.readFileSync(path, { encoding: 'utf8' })
      const serialized = serialize(parse(contents))
      expect(serialized).toEqual(contents)
    })
  })
})
