const TeleBot = require('telebot');

// var mysql = require('mysql');

const bot = new TeleBot({
    token: '209376928:AAG9Ohui0myFbuvgZpDparxDQgkBEreScpE', // Required. Telegram Bot API token.
    polling: {
        proxy: 'http://10.20.0.109:3128' // Optional. An HTTP proxy to be used.
    },
});

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "123456",
//   database: "test"
// });

bot.on('text', (msg) => {
var res = 1;
	if(!con) con.connect();
	
	function extract(callback){	
		con.query("SELECT * FROM test_tbl", function (err, result, fields) {
                        if (err) throw err;
                        console.log(result[0].name);
			res = result[0].name;                       
                	callback(null,res);        
		});
	}
//if (!con)
		/*con.connect(function(err) {
 			if (err) throw err;
  			console.log("Connected!");
			con.query("SELECT * FROM test_tbl", function (err, result, fields) {
   			if (err) throw err;
    			res = result[0].name;
			//console.log(result);
  			});
		});*/
//con.destroy();
	console.log(res);
	
	function hand(err,result){
		msg.reply.text(result);
	};
	extract(hand);
	//msg.reply.text(hand);
});

//con.end();
//console.log("Disconnected1!");

bot.start();
