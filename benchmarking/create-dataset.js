var axios = require("axios");
var fs = require("fs");

const APIKey = "AIzaSyB9IlHKmfrSTjiI25qggJL1eB7hl7N9v0E";

const playListId = "PL4QNnZJr8sRNwtUsvnU7QH5WJ_iamWwTE"

var url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playListId}&key=${APIKey}`;

async function create()
{
    let dataset = []
    let response = await axios.get(url);
    
    for (let res of response.data.items)
    {
        dataset.push({
            VIDEO_ID: res.snippet.resourceId.videoId,
            SONGS: res.snippet.title
        })
    }
    console.log(dataset);
    fs.writeFileSync("./new-dataset.json", JSON.stringify(dataset, null, 4));
        
}


create();