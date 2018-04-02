var XLSX = require("xlsx");
var fs = require("fs");
var axios = require("axios");

const songIdURL = "http://52.176.61.183:3000/song-id/"; 

class Benchmark
{  
    constructor()
    {
        this.excelJson = [];
        this.results = [];
        this.readXlsx();   
        this.index = 0; 
    }
    
    async start()
    {
        let cntr = 0;
        for(let example of this.excelJson)
        {
            cntr++;
            if (cntr > 16 && example["Songs"] !== ""  && example["Songs"].toLowerCase().indexOf("none") === -1)
            {
                try
                {
                    console.log(example['VIDEO_ID'])
                    let songIdOutput =  await axios.get(songIdURL + example['VIDEO_ID'], {timeout: 1000000});
                    let result = {
                        "url": example["URL"],
                        "original_songs": example["Songs"].split(","),
                        "predicted": songIdOutput.data
                    }
                    let first = result["predicted"].length >= 1 ? result["predicted"][0] : "Can't predict";
                    // console.log(songIdOutput.data);                
                    this.writeToJson(result);
                }
                catch (error)
                {
                    if(error.response && error.response.status === 404)
                    {
                        let result = {
                            "url": example["URL"],
                            "original_songs": example["Songs"].split(","),
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
            
        }
        console.log("done.");
    }
    
    writeToJson(result)
    {
        const file = "./result.json";
        let buffer = [];
        if (fs.existsSync(file))
        {
            buffer = JSON.parse(fs.readFileSync(file));
        }
        buffer.push(result);
        fs.writeFileSync(file, JSON.stringify(buffer, null, 4));
    }
    
    readXlsx()
    {
        let buffer = fs.readFileSync("uoftTestSet.xlsx");
        let wb = XLSX.read(buffer, {type: "buffer"});
        this.excelJson  =  XLSX.utils.sheet_to_json(wb.Sheets["Sheet1"]);
    }    
}


let bm = new Benchmark();

bm.start(); 
