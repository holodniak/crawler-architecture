import * as winston from 'winston';
import { MessageBrokerService } from './messageBroker.service';
import { Frame, launch, Browser, Page, BrowserLaunchArgumentOptions } from 'puppeteer';
import { ConfigService } from './config.service';
import { sleep } from './sleep.helper';
import { config } from 'dotenv/types';


export interface TimeoutOptions {
	timeoutWaitForElement: number;
	timeoutWaitForNavigation: number;
}

export class CrawlerBase {
	private readonly browserOptions: BrowserLaunchArgumentOptions;
	protected readonly timeoutOptions: TimeoutOptions;
	protected executionType: string;
	protected msg: any;
	protected browser: Browser;
	protected page: Page;
	protected context: Frame;

	constructor(
		protected readonly brokerService: MessageBrokerService,
		protected readonly configService: ConfigService,
		protected readonly logger: winston.Logger,
	) {
		this.timeoutOptions = {
			timeoutWaitForElement: 15000,
			timeoutWaitForNavigation: 30000,
		};

		if (configService.isDevelopmentEnv()) {
			this.browserOptions = {
				headless: false,
				args: ['--lang=pt', '--start-maximized'],
			};
		} else {
			this.browserOptions = {
				args: ['--lang=pt', '--no-sandbox'],
			};
		}

	}

	async sendToBroker(data: any) {
		const exchange = this.configService.getCrawlerCollectorExchange();

		await this.brokerService.publish(exchange, 'return-json', data);

		this.logger.info(`Message sent to broker,  ${data}.`);
	}

	async start(url: string) {
		this.browser = await launch(this.browserOptions);
		this.browser.on('disconnected', () => {
			throw new Error(`Browser disconected.`);
		});

		this.page = await this.browser.newPage();
		await this.page.authenticate({ username: 'ponziano', password: 'GHdMxWAS' });

		await this.page.goto(url, {
			timeout: this.timeoutOptions.timeoutWaitForNavigation,
			waitUntil: 'networkidle0',
		});

		this.page.waitForNavigation({
			timeout: this.timeoutOptions.timeoutWaitForNavigation,
		});

		this.context = this.page.mainFrame();
	}

	async end() {
		this.logger.info('Browser is closing...');
		this.browser.removeAllListeners('disconnected');
		await this.browser.close();
	}
}