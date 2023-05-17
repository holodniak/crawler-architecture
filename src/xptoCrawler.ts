import { MessageBrokerService } from './common/messageBroker.service';
import { ConfigService } from './common/config.service';
import { logger } from './common/logger.config';
import { CrawlerBase } from "./common/crawler.base";
import { sleep } from './common/sleep.helper';


export default class xptoCrawler extends CrawlerBase {
	constructor(
		protected readonly brokerService: MessageBrokerService,
		protected readonly configService: ConfigService,
		protected readonly logger: any,
	) {
		super(brokerService, configService, logger);

		this.timeoutOptions.timeoutWaitForElement = 90000;
		this.timeoutOptions.timeoutWaitForNavigation = 90000;
	}

	async Run(msg){
		this.logger.info('Starting project')
		this.logger.info(`message received ${msg.key}`)
		
		
		await sleep(5000);
		try {
		
			// CODE FROM COLLECT 

		} catch (error) {
			console.log(error)
			this.logger.error('Error crawler');
		}
		this.logger.info('Message finalized and sent to rabbit');
	}
}
