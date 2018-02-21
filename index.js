// constants

const TeleBot = require('telebot');
const mysql = require('mysql');
const emoji = require('node-emoji');
const emojiStrip = require('emoji-strip');
var strsim = require('string-similarity');
//const regex = emojiStrip();

//create connection

const con = mysql.createPool({
	connectionLimit : 10,
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'admin_nova',
	multipleStatements: true
});

//create new Telebot reference

const bot = new TeleBot({
    token: '209376928:AAG9Ohui0myFbuvgZpDparxDQgkBEreScpE', // Required. Telegram Bot API token.
    polling: { // Optional. Use polling.
        proxy: 'http://10.20.0.109:3128' // Optional. An HTTP proxy to be used.
    }
});

//functions list

//  test function 
//	|||||||
//  vvvvvvv
function fetchdata(callback,msg){
	var res;
	con.query("SELECT * FROM test_tbl", function (err, result, fields) {
		if (err) throw err;
		res = result[0].name
		callback(null,res,msg);
	});
}
//end of test fucntion


// function "isNewUser" identifies new user
// if is new user adds to record to database
function isNewUser(msg)
{
	let sql = "Select userid from sp_users where userid = " + msg.from.id;
	con.query(sql, function (err, result, fields) {
		if (!result.length > 0) {
			let sql = "INSERT INTO sp_users (userid,first_name, last_name, language_code,username,status) VALUES ?";
			var vals =[[msg.from.id,msg.from.first_name,msg.from.last_name,msg.from.language_code,msg.from.username,1]];
			con.query(sql, [vals], function (err, result) {
				if (err) throw err;
				console.log("Number of records inserted: " + result.affectedRows);
			});
		}
	});
}

// end of "isNewUser" function

// function "checkCommand" checks user user command
function checkCommand(callback,msg)
{
			let v = mysql.escape(emojiStrip(msg.text));
			console.log(v);
			let sql  = "SELECT * FROM command_list WHERE product_name IS NULL and category = 'Команды' and name = " + v;
			console.log(sql);
			con.query(sql, function (err, result, fields) {
				//console.log(result[0]);
				//console.log(result[1]);
				var len0 = result.length;
				if(len0 > 0)	{	callback(result[0],v,msg);	}
				else if(len0 == 0 )	{	getProducts(msg);	}
				else {bot.sendMessage(msg.from.id, "AWWWWW! Can not recognize your command!");}
			});
}


// Main function
function Main(result,v,msg)
{
	if(v == "'/start'") {onStart(msg);}
	else if(v == "'Назад'") {onBack(msg);}
	else { getSubMenu(msg.text,msg.from.id); }
	
}

bot.on('text',(msg) => {
	checkCommand(Main,msg);
});

// function "getProducts" gets list of available products according to given parameter
function getProducts(msg)
{
	function getProductList(callback){
		var menu = [[emoji.get('back') + "Назад" , emoji.get('telephone') + "Спросить Вживую"]];
		var sql = "SELECT * FROM sp_product `p` left outer join `sp_price` `pr` on `p`.`product_id` = `pr`.`product_id` where sp_category_id = (select id from ymd_categories where name = '" + msg.text +"' );  update sp_users set cat=(select distinct(category) from sp_menu where name = '"+msg.text+"') , sub_cat = '"+msg.text+"' where userid=" + msg.from.id;
		console.log(sql);
		con.query(sql, function (err, result, fields) {
			var len = result[0].length;
			for(var i=0;i<len;i++)
			{
				menu_row = [result[0][i].product_name];
				menu.push(menu_row);
			}
			callback(menu);
		});
	}
	function buildProductReplyMarkup(menu){
		let replyMarkup = bot.keyboard(menu, {resize: true});
		return bot.sendMessage(msg.from.id, "Выберите продукт:", {replyMarkup});
	}
	getProductList(buildProductReplyMarkup);
}

// function "getSubMenu" builds sub menu according to given paramater (e.g. "Едим Здорово")
function getSubMenu(text,userid)
{
	function getSubMenuButtons(callback){
		let v = mysql.escape(emojiStrip(text));
		var sql = 'select distinct(name) as name,id,emoji from sp_menu where category= ' + v + ' ORDER by sort_id;select description from ymd_categories where name= ' + v + '; update sp_users set cat='+ v +',sub_cat = NULL where userid=' + userid;
		console.log(sql);
		var menu = [[emoji.get('back') + "Назад" ,emoji.get('inbox_tray') + "Корзинка"]];
		con.query(sql, function (err, result, fields) {
					let len = result[0].length;
					for(var i=0;i<len;i++)
					{
						menu_row = [emoji.get(result[0][i].emoji) + result[0][i].name];
						menu.push(menu_row);
					}
					callback(menu,result[1][0].description);
				});
	}

	function buildSubMenuReplyMarkup(menu,description){
		let replyMarkup = bot.keyboard(menu, {resize: true})
		return bot.sendMessage(userid, description, {replyMarkup});
	}

	getSubMenuButtons(buildSubMenuReplyMarkup);
}
// end of function "getSubMenu"

//function "onStart"
function onStart(msg)
{
	var sql = "update sp_users set cat=NULL,sub_cat=NULL where userid="+msg.from.id;
	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log(result.affectedRows + " record(s) updated");
	});
	var txt = "Привет " + msg.from.first_name + JSON.stringify('\ud83d\udc4b') + "! Добро пожаловать в мир здоровой еды и питания от Novatio. Я бот компаньон, я помогу тебе дать подробную информацию о продукции Novatio.";
	bot.sendMessage(msg.from.id, txt);
	getMainMenu(msg.from.id);
}
// end of "onStart" function

function getMainMenu(userid)
{

	function fetchMenuButtons(callback){
	      var sql  = 'SELECT * FROM ymd_categories where id>0 and parent_id = 0 and indx = 0; update sp_users set cat = NULL, sub_cat=NULL where userid =' + userid;
	var menu = [];
	con.query(sql, function (err, result, fields) {
		if (err) throw err;
			var len = result[0].length;
			for(var i = 0;i<len;i++)
			{
				menu_row = [emoji.get(result[0][i].emoji) + result[0][i].name];
				menu.push(menu_row);
			}
			menu.push([emoji.get('inbox_tray') + "Корзинка"]);
			callback(menu);
		});
	}
	function buildReplyMarkup(menu)
	{
		let replyMarkup = bot.keyboard(menu, {resize: true})	
		return bot.sendMessage(userid, "Выберите категорию...", {replyMarkup});
	}
	fetchMenuButtons(buildReplyMarkup);
}

// function "onBack" sends user back to previous menu
function onBack(msg)
{
	var userid = msg.from.id;
	function getBack(result)
	{
		if(result[0].cat !== null && result[0].sub_cat == null)
		{
			getMainMenu(userid);
		}
		if(result[0].cat !== null && result[0].sub_cat !== null)
		{
			getSubMenu(result[0].cat,userid);
		}
		//console.log(result);
	}

	getMenuLoc(getBack,userid);
}
// end of "onBack" function gets user's current location

// function "getMenuLoc"  performs a query for checking current user location
function getMenuLoc(callback,userid)
{
	var sql = "SELECT `userid`,`cat`,`sub_cat` FROM `sp_users` where `userid` = " + userid;
	con.query(sql, function (err, result) {
		if (err) throw err;
		callback(result);
	});
}
// end of function "getMenuLoc"



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



//bot.on([/^\/start$/, /^\/back$/], msg => {
//	onStart(msg);
//});

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