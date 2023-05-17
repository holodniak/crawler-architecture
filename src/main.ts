import { MessageBrokerService } from './common/messageBroker.service';
import { ConfigService } from './common/config.service';
import { logger } from './common/logger.config';
import xptoCrawler from './xptoCrawler';

const configService = new ConfigService();
const brokerService = new MessageBrokerService(configService, logger);


const collectorQueue = configService.getCrawlerControllerQueue();
brokerService.subscribe(collectorQueue, async (msg, done) => {
    try {
        await (new xptoCrawler(brokerService,configService,logger).Run(msg));
        done(true)
    } catch (error) {
        console.log(error);
        done(false)
    }
})