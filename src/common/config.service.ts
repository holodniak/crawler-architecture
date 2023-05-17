import { config } from 'dotenv';

const CRAWLER_CONTROLLER_QUEUE = 'CRAWLER_CONTROLLER_QUEUE';
const CRAWLER_COLLECTOR_EXCHANGE = 'CRAWLER_COLLECTOR_EXCHANGE';
const RABBIT_URL = 'RABBIT_URL';
const NODE_ENV = 'NODE_ENV';
const STORAGE_BUCKET_PREFIX = 'STORAGE_BUCKET_PREFIX';
const RABBIT_QUEUE = 'RABBIT_QUEUE';

export class ConfigService {
	constructor() {
		config();
	}

	private get(key: string): string {
		const value = process.env[key];

		if (!value) {
			throw new Error(`Environment variable "${key}" not found.`);
		}

		return value.trim();
	}

	public isDevelopmentEnv(): boolean {
		return this.get(NODE_ENV) === 'development';
	}

	public getCrawlerControllerQueue(): string {
		return this.get(CRAWLER_CONTROLLER_QUEUE);
	}

	public getCrawlerCollectorExchange(): string {
		return this.get(CRAWLER_COLLECTOR_EXCHANGE);
	}

	public getRabbitURL(): string {
		return this.get(RABBIT_URL);
	}

	public getRabbitQueue(): string {
		return this.get(RABBIT_QUEUE);
	}

}
