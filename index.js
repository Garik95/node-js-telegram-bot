// const

const TeleBot = require('telebot');
const mysql = require('mysql');
const emoji = require('node-emoji')

//create connection

const con = mysql.createPool({
  connectionLimit : 10,
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'admin_nova'
});

//create new Telebot reference

const bot = new TeleBot({
    token: '209376928:AAG9Ohui0myFbuvgZpDparxDQgkBEreScpE', // Required. Telegram Bot API token.
    polling: { // Optional. Use polling.
        proxy: 'http://10.20.0.109:3128' // Optional. An HTTP proxy to be used.
    }
});

//functions list

function fetchdata(callback,msg){
	var res;
	con.query("SELECT * FROM test_tbl", function (err, result, fields) {
		if (err) throw err;
		res = result[0].name
		callback(null,res,msg);
	});
}


function isNewUser(msg)
{
	let sql = "Select userid from sp_users where userid = " + msg.from.id;
	con.query(sql, function (err, result, fields) {

		if (result.length > 0) {
			console.log(result[0].userid);
		}
		else {
			let sql = "INSERT INTO sp_users (userid,first_name, last_name, language_code,username,status) VALUES ?";
			var vals =[[msg.from.id,msg.from.first_name,msg.from.last_name,msg.from.language_code,msg.from.username,1]];
			con.query(sql, [vals], function (err, result) {
				if (err) throw err;
				console.log("Number of records inserted: " + result.affectedRows);
			});
		}
	});

}




// bot main functionality

bot.on('/new',(msg) => {
	isNewUser(msg);
});


bot.on('edit', (msg) => {
    return msg.reply.text('I saw it! You edited message!', { asReply: true });
});

// an example how to fetch and display data from DB!
//bot.on('text', (msg) => {
//	
//	function extract(err,result,msg){
//		msg.reply.text(result)
//	}
//
//	fetchdata(extract,msg);
//
//	});



bot.on([/^\/start$/, /^\/back$/], msg => {

	var txt = "Привет " + msg.from.first_name + JSON.stringify('\ud83d\udc4b') + "! Добро пожаловать в мир здоровой еды и питания от Novatio. Я бот компаньон, я помогу тебе дать подробную информацию о продукции Novatio.";
	
	var sql = "update sp_users set cat=NULL,sub_cat=NULL where userid="+msg.from.id;
	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log(result.affectedRows + " record(s) updated");
	});

	function fetchMenuButtons(callback){
	      var sql  = 'SELECT * FROM ymd_categories where id>0 and parent_id = 0 and indx = 0';
	var menu = [];
	con.query(sql, function (err, result, fields) {
		if (err) throw err;
			for(var i = 0,len = result.length;i<len;i++)
				{ 
					menu_row = [emoji.get(result[i].emoji) + result[i].name];
					menu.push(menu_row);
				}
				callback(menu);
	});
	}
	function buildReplyMarkup(menu)
	{
		let replyMarkup = bot.keyboard(menu, {resize: true})
		return bot.sendMessage(msg.from.id, txt, {replyMarkup});
	}
	replyMarkup = fetchMenuButtons(buildReplyMarkup);

});

//bot.on('text', (msg) => 
//	{
//		
//		
//	});


/*
// Buttons
bot.on('/buttons', msg => {

    let replyMarkup = bot.keyboard([
        [bot.button('contact', 'Your contact'), bot.button('location', 'Your location')],
        ['/back', '/hide']
    ], {resize: true});

    return bot.sendMessage(msg.from.id, 'Button example.', {replyMarkup});

});

// Hide keyboard
bot.on('/hide', msg => {
    return bot.sendMessage(
        msg.from.id, 'Hide keyboard example. Type /back to show.', {replyMarkup: 'hide'}
    );
});

// On location on contact message
bot.on(['location', 'contact'], (msg, self) => {
    return bot.sendMessage(msg.from.id, `Thank you for ${ self.type }.`);
});

// Inline buttons
bot.on('/inlineKeyboard', msg => {

    let replyMarkup = bot.inlineKeyboard([
        [
            bot.inlineButton('callback', {callback: 'this_is_data'}),
            bot.inlineButton('inline', {inline: 'some query'})
        ], [
            bot.inlineButton('url', {url: 'https://telegram.org'})
        ]
    ]);

    return bot.sendMessage(msg.from.id, 'Inline keyboard example.', {replyMarkup});

});

// Inline button callback
bot.on('callbackQuery', msg => {
    // User message alert
    return bot.answerCallbackQuery(msg.id, `Inline button callback: ${ msg.data }`, true);
});

// Inline query
bot.on('inlineQuery', msg => {

    const query = msg.query;
    const answers = bot.answerList(msg.id);

    answers.addArticle({
        id: 'query',
        title: 'Inline Query',
        description: `Your query: ${ query }`,
        message_text: 'Click!'
    });

    return bot.answerQuery(answers);

});*/

bot.start();