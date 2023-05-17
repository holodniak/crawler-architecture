import winston, { createLogger } from 'winston';
// import WinstonLogStash from 'winston3-logstash-transport';

export const loggerOptions: winston.LoggerOptions = {
	transports: [
		new winston.transports.Console({ level: 'debug' }),
	],
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.colorize(),
		winston.format.printf(info => {
			const metadata = info.meta ? ` - ${JSON.stringify(info.meta)}` : '';
			return `${info.timestamp} ${info.level}: ${info.message} ${metadata}`;
		}),
	),
};

export const logger: winston.Logger = winston.createLogger(loggerOptions);