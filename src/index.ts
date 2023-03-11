import { Command } from 'commander';
import { IOptions } from './IOptions';
import parseLogs from './parser';
import { VERSION } from './version';

const program = new Command();

program
  .version(VERSION)
  .description('CLI app to parses the input log file into standard JSONL output file.')
  .option('-i, --input  <path>', 'Input log file path')
  .option('-o, --output  <path>', 'Output log file path')
  .parse(process.argv);

const options: IOptions = program.opts();

parseLogs({ ...options, logLevel: 'error' });
