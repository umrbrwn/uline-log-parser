export interface IErrorLog {
  timestamp: number;
  loglevel: string;
  transactionId: string;
  err: string;
}

const transformLog = (log: string, logLevel: string): IErrorLog | null => {
  const [datetime, level, msg = '{}'] = log.split(' - ');

  if (level !== logLevel) {
    return null;
  }

  const obj = JSON.parse(msg);
  return {
    timestamp: new Date(datetime).getTime(),
    loglevel: level,
    transactionId: obj?.transactionId,
    err: obj?.err || ''
  };
}

export default transformLog;
