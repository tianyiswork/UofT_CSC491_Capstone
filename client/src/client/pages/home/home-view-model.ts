import { PageViewModel, route, template } from "@nivinjoseph/n-app";
import * as Routes from "./../routes";
import axios from "axios";

import "./home-view.scss";


@template(require("./home-view.html"))
@route(Routes.home)
export class HomeViewModel extends PageViewModel
{
    private _gotVideo: boolean;
    private _embededLink: string;
    private _videoLink: string;
    private _extractedLyrics: string;
    private _loading: boolean;
    
    public get gotVideo(): boolean { return this._gotVideo; }
    
    public get videoLink(): string { return this._videoLink; }
    public set videoLink(value: string) { this._videoLink = value; }
    public get embededLink(): string { return this._embededLink; } 
    public get extractedLyrics(): string { return this._extractedLyrics; }
    public get loading(): boolean { return this._loading; }
    
    public constructor()
    {
        super();
        
        this._gotVideo = false;
        this._videoLink = null;
        this._embededLink = null;
        this._loading = false;
        this._extractedLyrics = null;
    }
    
    public async onSearch(): Promise<void>
    {
        console.log("pressed");
        console.log(this._videoLink);
        if (!this._videoLink.contains("v="))
            return;    
        
        let video_id = this._videoLink.split('v=')[1];
        let ampersandPosition = video_id.indexOf('&');
        if (ampersandPosition != -1)
        {
            video_id = video_id.substring(0, ampersandPosition);
        }
        console.log("bruh")
        this._gotVideo = true;
        this._embededLink = `http://www.youtube.com/embed/${video_id}?rel=0`;
        console.log(video_id);
        this._loading = true;
        let response = await axios.get<string>(`http://localhost:3000/intellitune/${video_id}`);
        this._extractedLyrics = response.data;
        console.log(this._extractedLyrics); 
    }
}