var XLSX = require("xlsx");
var fs = require("fs");
var axios = require("axios");
// axios = axios.create({
//     baseUrl: "http://52.176.61.183:3000/",
//     timeout: 10000000
// })

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
        for(let example of this.excelJson)
        {
            console.log(example);
            if (example["Songs"] !== ""  || example["Songs"].toLowerCase().indexOf("none") !== -1)
            {
                try
                {
                    let songIdOutput =  await axios.get(songIdURL + example['VIDEO_ID'], {timeout: 100000});
                    // console.log(songIdOutput);
                    let result = {
                        "url": example["URL"],
                        "original_songs": example["Songs"].split(","),
                        "predicted": songIdOutput.data
                    }
                    console.log(example['VIDEO_ID'])
                    let first = result["predicted"].length >= 1 ? result["predicted"][0] : "Can't predict";
                    console.log(first);                
                    this.results.push(result);   
                }
                catch (error)
                {
                    console.log("++++++ERROR++++++"); 
                    console.log(example['VIDEO_ID'])
                    console.log(error);
                    console.error(error.status);
                    console.error(error.statusText);
                    
                }
            }
            
        }
        
        console.log(this.result)
    }
    
    readXlsx()
    {
        let buffer = fs.readFileSync("uoftTestSet.xlsx");
        let wb = XLSX.read(buffer, {type: "buffer"});
        this.excelJson  =  XLSX.utils.sheet_to_json(wb.Sheets["Sheet1"]);
    }
    
    // makeRequest()
    // {
    //     if (this.excelJson[this.index]["Songs"] !== ""  || this.excelJson[this.index]["Songs"].toLowerCase().indexOf("none") !== -1)
    //     {
    //         return axios.get("/song-id/" + example['VIDEO_ID']).then((response) => {
    //             this.index ++;
    //             if (this.index >= this.excelJson.length) {
    //                 return 'done'
    //             }
    //             return request();    
    //         });
    //     }
        
    //     this.makeRequest();
    // }
    
    
}


let bm = new Benchmark();

bm.start(); 