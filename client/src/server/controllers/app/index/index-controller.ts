import { Controller, route, httpGet, view } from "@nivinjoseph/n-web";


@route("/*")
@httpGet
@view("~/src/client/dist/index.html")
export class IndexController extends Controller
{
    public execute(): Promise<any>
    {
        return Promise.resolve();
    }
}