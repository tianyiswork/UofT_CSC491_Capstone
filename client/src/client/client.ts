import { ClientApp } from "@nivinjoseph/n-app";
import { pages } from "./pages/pages";
import { components } from "./components/components";
import * as Routes from "./pages/routes";
import "normalize.css";
import "./static/styles/main.scss";


const client = new ClientApp("#app")
    .useAccentColor("#93C5FC")
    .registerPages(...pages)
    .registerComponents(...components)
    .useAsUnknownRoute(Routes.home)
    .useHistoryModeRouting();


client.bootstrap();