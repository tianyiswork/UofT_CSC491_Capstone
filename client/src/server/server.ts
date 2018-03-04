import { WebApp } from "@nivinjoseph/n-web";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import { IndexController } from "./controllers/app/index/index-controller";


const server = new WebApp(ConfigurationManager.getConfig<number>("PORT"))
    .enableWebPackDevMiddleware(true)
    .registerStaticFilePaths("src/client/dist")
    .registerControllers(IndexController);

server.bootstrap();