import { MessageBrokerService } from './common/messageBroker.service';
import { ConfigService } from './common/config.service';
import { logger } from './common/logger.config';
import { CrawlerBase } from "./common/crawler.base";
import { sleep } from './common/sleep.helper';
import axios, { AxiosResponse } from 'axios';

const configService = new ConfigService();
const brokerService = new MessageBrokerService(configService, logger);

// {"key": "TGLS76BX"}
// {"key": "16QDIAUI"}
// {"key": "NDFGXQHS"}
// {"key": "87UHNNME"}
export default class predConnectSUS extends CrawlerBase {
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
		
		// await this.start('https://validacertidao.saude.gov.br/');
		
		await sleep(5000);
		try {
			const config = {
				headers: { 
					'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"', 
					'Accept': 'application/json, text/plain, */*', 
					'Referer': 'https://validacertidao.saude.gov.br/', 
					'Authorization': 'Basic cmVwbzppVXVXZ2ZleGx1SGg=', 
					'sec-ch-ua-mobile': '?0', 
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36', 
					'Content-Type': 'application/json'
				}
			};

			this.logger.debug('Starting request to get data')

			const requestData = await axios.get(`https://ehr-services-bff.saude.gov.br/api/vacinacao/certificado/validar/${msg.key}`,config)
				.then(function (response) {
				return response.data
			})
			.catch(function (error) {
				console.log(error);
			});	
			delete requestData.record.certificado.pdfAsBase64

			await this.sendToBroker(JSON.stringify(requestData));

		} catch (error) {
			console.log(error)
			this.logger.error('Error crawler');
		}
		this.logger.info('Message finalized and sent to rabbit');
	}
}

// new predConnectSUS(brokerService,configService,logger).Run().then(() => logger.debug("End"));