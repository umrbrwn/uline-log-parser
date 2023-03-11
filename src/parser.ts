import fs from 'fs';
import { pipeline, Transform } from 'stream';

// node:readline package can be used, however the fs readstream has
// default chunk size of 65536 bytes that interrupts the line completeness
// split2 handles line the line completeness automatically.
// with readline https://gist.github.com/andreruffert/f4d0dd7385e2735eca93
import split from 'split2';

import { IOptions } from './IOptions';
import transformLog from './transform';

const parseLogs = (opts: IOptions) => {
  if (!opts.input || !opts.output) {
    console.error('Input and output file paths are required to parse logs');
    return;
  }

  const readStream = fs.createReadStream(opts.input);
  const writeStream = fs.createWriteStream(opts.output);

  writeStream.write('[');
  writeStream.on('finish', async () => {
    const { stat, truncate, writeFile } = fs.promises;
    const { size } = await stat(opts.output);
    if (size > 1) {
      await truncate(opts.output, size - 1)
    }
    await writeFile(opts.output, ']', { flag: 'a' });
  });
  const delimiter = ',';

  const transformer = new Transform({
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      const line = chunk.toString();
      const transformed = transformLog(line, opts.logLevel);
      callback(null, transformed ? `${JSON.stringify(transformed)}${delimiter}` : null);
    }
  });

  pipeline(readStream, split(), transformer, writeStream, (err) => {
    err
      ? console.error('An error occured while transforming logs', err)
      : console.log('Logs transformed successfully');
  });
}

export default parseLogs;
