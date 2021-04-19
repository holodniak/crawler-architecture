import winston from 'winston';
import { Connection, Message, log } from 'amqp-ts';
import { ConfigService } from './config.service';

log.transports.console.level = 'info';

export class MessageBrokerService {
	private conn: Connection;

	constructor(
		private readonly configService: ConfigService,
		private readonly logger: winston.Logger,
	) {}

	private async connection() {
		if (!this.conn) {
			const rabbitUrl = this.configService.getRabbitURL();
			this.conn = new Connection(rabbitUrl);

			this.logger.info('RabbitMQ new connection created.');

			await this.conn.completeConfiguration();
		}

		return this.conn;
	}

	public async subscribe(queueName: string, callbackFunc: Function) {
		const connection = await this.connection();
		try {
			var queue = connection.declareQueue(queueName);

			queue.prefetch(1);

			queue.activateConsumer(
				(message: Message) => {
					try {
						const { content, fields, properties } = message;
						const jsonObject = JSON.parse(content.toString('utf8'));
						callbackFunc(
							jsonObject,
							ok => {
								try {
									if (ok) {
										message.ack();
									} else {
										message.reject(true);
									}
								} catch (e) {
									this.logger.info('RabbitMQ ack/reject error:', e.message);
								}
							},
							{ fields, properties },
						);
					} catch (e) {
						this.logger.info('RabbitMQ consumer error:', { meta: e.stack} );
					}
				},
				{ noAck: false },
			);
		} catch (e) {
			this.logger.info('RabbitMQ subscribe error:', e.message);
		}
	}

	public async publish(exchangeName: string, route: string, content: any) {
		const conn = await this.connection();
		try {
			const exchange = conn.declareExchange(exchangeName);
			const message = new Message(content, { durable: true });

			exchange.send(message, route);

			this.logger.info('Enqueued:', route);
		} catch (e) {
			this.logger.info('RabbitMQ publish error:', e.message);
		}
	}

	public disconnect(){
		this.conn.removeAllListeners().close();
	}
}
