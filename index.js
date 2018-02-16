const TeleBot = require('telebot');
const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'test'
});


const bot = new TeleBot({
    token: '209376928:AAG9Ohui0myFbuvgZpDparxDQgkBEreScpE', // Required. Telegram Bot API token.
    polling: { // Optional. Use polling.
        proxy: 'http://10.20.0.109:3128' // Optional. An HTTP proxy to be used.
    }
});


function fetchdata(callback,msg){
	var res;
	con.query("SELECT * FROM test_tbl", function (err, result, fields) {
		if (err) throw err;
		res = result[0].name
		//console.log(res);
		callback(null,res,msg);
	});
}


bot.on(['/start', '/hello'], (msg) => msg.reply.text('Welcome!'));

bot.on('edit', (msg) => {
    return msg.reply.text('I saw it! You edited message!', { asReply: true });
});

//bot.on('text', (msg) => {
//	
//	function extract(err,result,msg){
//		msg.reply.text(result)
//	}
//
//	fetchdata(extract,msg);
//
//	});

bot.start();