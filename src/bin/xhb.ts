import Yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { parse, serialize } from '../'

const _collect = async (stream: NodeJS.ReadStream): Promise<Buffer> => {
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

const parseAction = async () => {
  const xhb = (await _collect(process.stdin)).toString('utf8')
  const object = parse(xhb)
  process.stdout.end(JSON.stringify(object))
}

const serializeAction = async () => {
  const json = (await _collect(process.stdin)).toString('utf8')
  const xhb = serialize(JSON.parse(json))
  process.stdout.end(xhb)
}

const bootstrap = () => {
  return Yargs(hideBin(process.argv), process.cwd())
    .scriptName('xhb')
    .version()
    .command(
      'parse',
      'read xhb from stdin and write json to stdout',
      parseAction,
    )
    .command(
      'serialize',
      'read json from stdin and write xhb to stdout',
      serializeAction,
    )
    .help()
    .wrap(Yargs.terminalWidth() !== null ? Yargs.terminalWidth() : 80)
    .demandCommand()
    .recommendCommands()
    .strict()
}

const main = async () => {
  const program = bootstrap()
  await program.parseAsync()
}

main()
