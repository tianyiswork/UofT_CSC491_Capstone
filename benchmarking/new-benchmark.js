var XLSX = require("xlsx");
var fs = require("fs");
var axios = require("axios");

const songIdURL = "http://52.176.61.183:3000/song-id/"; 

class Benchmark
{  
    constructor()
    {
        this.testSet = [];
        this.results = [];
        this.readtestSet();   
        this.index = 0; 
        this.matched = 0;
    }
    
    async start()
    {
        for(let example of this.testSet)
        {
            if (example["Songs"] !== ""  && example["Songs"].toLowerCase().indexOf("none") === -1)
            {
                try
                {
                    console.log(example['VIDEO_ID'])
                    let songIdOutput =  await axios.get(songIdURL + example['VIDEO_ID'], {timeout: 1000000});
                    let result = {
                        // "url": example["URL"],
                        "VIDEO_ID": example['VIDEO_ID'],
                        "original_songs": example["Songs"],
                        "predicted": songIdOutput.data
                    }
                    let first = result["predicted"].length >= 1 ? result["predicted"][0] : "Can't predict";
                    // console.log(songIdOutput.data);  
                    this.compare(result);              
                    this.writeToJson(result);
                }
                catch (error)
                {
                    if(error.response && error.response.status === 404)
                    {
                        let result = {
                            "VIDEO_ID": example['VIDEO_ID'],
                            "original_songs": example["Songs"],
                            "predicted": []
                        };
                        this.writeToJson(result);  
                        continue;
                    }
                    else
                    {
                        console.log(error);
                        break;   
                    }                
                }
            }
            await this.sleep();
            console.log("done sleeping")
            
        }
        console.log("done.");
    }
    
    writeToJson(result)
    {
        const file = "./result-new.json";
        let buffer = [];
        if (fs.existsSync(file))
        {
            buffer = JSON.parse(fs.readFileSync(file));
        }
        buffer.push(result);
        fs.writeFileSync(file, JSON.stringify(buffer, null, 4));
    }
    
    readtestSet()
    {
        let buffer = fs.readFileSync("./new-dataset.json");
        this.testSet = JSON.parse(buffer);
    }
    
    sleep()
    {
        return new Promise(resolve => setTimeout(resolve, 10000););
    }    
    
    compare(result)
    {
        let original = result["original_songs"].toLowerCase().trim();
        let predicted = result["predicted"];
        for(let song in predicted)
        {
            if (song.toLowerCase().trim().indexOf(original) !== -1 )
                this.matched += 1;
        }
        console.log("MATCHED AS OF NOW: ");
        console.log(this.matched);
    }
}


let bm = new Benchmark();

bm.start(); 
