let request = require('request');
let htmlparser = require("htmlparser2");
let header = {
    //url: 'http://www.kma.gov.tw/Main/MoreArrival.aspx',   // 即時到站
    url: 'http://www.kma.gov.tw/Main/MoreDeparture.aspx', // 即時離站
    method: 'GET',
    proxy: 'http://localhost:53128'
};

let list = [], 
    rowIndex = -1,
    cellIndex = -1,    
    attr = '',
    attrs = ['date', 'airLines', 'flight', 'from', 'schedule_departure_time', 'real_departure_time', 'schedule_arrival_time', 'real_arrival_time', 'remark'];
    
var parser = new htmlparser.Parser({
    onopentag: function(tagname, attribs){
        if(tagname === "tr") {
            if( rowIndex > -1 ) {
                list.push({
                    date: '',
                    airLines: '',
                    flight: '',
                    from: '',
                    schedule_departure_time: '',
                    real_departure_time: '',
                    schedule_arrival_time: '',
                    real_arrival_time: '',
                    remark: ''
                });
            }
        }

        if( tagname === 'td' && rowIndex > -1) {
            cellIndex++;
        }
    },
    ontext: function(text){
        if( rowIndex > -1 && cellIndex > -1) {
            list[rowIndex][attrs[cellIndex]] = text;    
        }
    },
    onclosetag: function(tagname){
        if(tagname === "tr" && rowIndex > -1) {
            cellIndex = -1;
        }

        if(tagname === "tr") {
            rowIndex ++;
        }
    }

}, {decodeEntities: true});

request(header, (error, response, body) => {
    if (!error && response.statusCode == 200) {
        parser.write(body);
        parser.end();
        console.log(list);
    } else {
        console.log(error);
    }
});