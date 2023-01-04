import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export function getLogFileOption(level = 'app') {
  const levelList = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];

  return {
    filename: `${level}-%DATE%.log`,
    level: levelList.includes(level) ? level : null,
    dirname: 'logs',
    maxFiles: '7d',
  };
}

export function getFormat(isColors = false) {
  return winston.format.combine(
    winston.format.ms(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    nestWinstonModuleUtilities.format.nestLike('MyApp', {
      prettyPrint: true,
      colors: isColors,
    }),
  );
}
