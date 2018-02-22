// constants

const TeleBot = require('telebot');
const mysql = require('mysql');
const emoji = require('node-emoji');
const emojiStrip = require('emoji-strip');
var strsim = require('string-similarity');
var sleep = require('system-sleep');
var HTML = require('html-parse-stringify');
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
			var v = mysql.escape(emojiStrip(msg.text));
			let sql  = "SELECT * FROM command_list WHERE product_name IS NULL and category = 'Команды' and name = " + v;
			console.log(sql);
			con.query(sql, function (err, result, fields) {
				var len0 = result.length;
				if(len0 > 0)	{	callback(result[0],v,msg);	}
				else if(len0 == 0 )	{
					let sql = "SELECT * FROM sp_product `p` left outer join `sp_price` `pr` on `p`.`product_id` = `pr`.`product_id` where product_name =" + v;
					console.log(sql);
					con.query(sql, function (err, result, fields) {
						if(result.length == 0)
						{
							getProducts(msg);
						}else if(result.length > 0)
						{
							getProduct(msg,result);
						}
					});
					}
				else {	bot.sendMessage(msg.from.id, "AWWWWW! Can not recognize your command!");	}
			});
}


// Main function
function Main(result,v,msg)
{
	if(v == "'/start'") {onStart(msg);}
	else if(v == "'Назад'") {onBack(msg);}
	else if(v == "'Корзинка'") {getCart(msg,false);}
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
// end of "getProducts" function
// function "getProduct" get all information about product
function getProduct(msg,res)
{
	var prd = res[0].product_name + " - Цена:" + res[0].Price + " Сум";
	bot.sendPhoto(msg.from.id,res[0].product_Photo);
	sleep(100);
	let replyMarkup = bot.inlineKeyboard([
        [
            bot.inlineButton(emoji.get('heavy_dollar_sign') + 'Купить!', {callback: res[0].product_id}),
            bot.inlineButton(emoji.get('eyeglasses') + ' Подробно...', {callback: res[0].product_id + 'D'})
        ], [
            bot.inlineButton(emoji.get('inbox_tray') + 'Корзина', {callback: 'Bin'})
        ]
    ]);

    return bot.sendMessage(msg.from.id, prd, {replyMarkup});
}
// end of function "getProduct"
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

bot.on('edit', (msg) => {
    return msg.reply.text('I saw it! You edited message!', { asReply: true });
});


bot.on('callbackQuery', msg => {
	checkId(msg);
});

function checkId(msg)
{
	if(msg.data === "Offer")
	{
		checkout(msg);
	}
	else if(msg.data === "Bin")
	{
		getCart(msg,true);
	}
	else 
	{
		var sql = "select * from (select product_id,concat(product_id,'M') as idm,concat(product_id,'P') as idp,concat(product_id,'Back') as idback,concat(product_id,'D') as iddesc from sp_product) a where a.product_id = '"+msg.data+"' or a.idm = '"+msg.data+"' or a.idp = '"+msg.data+"' or a.idback = '"+msg.data+ "' or a.iddesc = '"+msg.data+"'";
		con.query(sql, function (err, result) {
			if(result.length > 0){
				if(result[0].product_id == msg.data) {	editMsgKeyboard(msg,false);	}
				if(result[0].iddesc == msg.data) {	getProductDesc(msg);	}
				if(result[0].idm == msg.data) {	removeFromCart(msg);	}
				if(result[0].idp == msg.data) { addToCart(msg);		}
				if(result[0].idback == msg.data) {	editMsgKeyboard(msg,true);	}
			} 
		});
	}
}

// needs development 
function checkout(msg)
{
	var str = "";
	var sql = "SELECT quantity,price_id,product_id,(select product_name from sp_product p where p.product_id=t.product_id) as product FROM `sp_transactions` t WHERE state_id = 1 and client_id =" + msg.from.id;
	con.query(sql, function (err, result) {
		for(var i=0;i<result.length;i++)
		{
			str = str  + (i+1) + ") " + result[i].product + "\n" + result[i].quantity + "x" + result[i].price_id + "=" + result[i].quantity*result[i].price_id + " Сум\n";
		}
	});
	var sql = "SELECT sum(price_id*quantity) as sum FROM `sp_transactions` WHERE state_id = 1 and client_id =" + msg.from.id;
	con.query(sql, function (err, result) {
		str = str + "Общая сумма: " + result[0].sum + " Сум\n";
		if(result[0].sum !== null)
		{
			var sum = result[0].sum;
			sum = sum * 100;
			var list = [{"label":"Общая сумма","amount":sum},{"label":"Скидка","amount":-100000}];
			var [url,width,height] = ["https://somonitrading.com/tg/logo.png",100,100];
			//var photo = [{"url":"https://somonitrading.com/tg/logo.png","width":100,"height":100}];
			var photo = {url,width,height};
			var [name,phoneNumber] = [true,true];
			var needs = {name,phoneNumber};
			replyMarkup = bot.inlineKeyboard([
			[
				bot.inlineButton('Оплатить через Click', {pay: true}),
				bot.inlineButton('Оплатить наличними', {callback: "cash"}),

			]
			]);
			var [title,description,payload, providerToken, startParameter, currency, prices,photo,need,replyMarkup] = ["Оформление заказа",str,"payload","398062629:TEST:999999999_F91D8F69C042267444B74CC0B3C747757EB0E065","start_parameter",'UZS',list,photo,needs,replyMarkup];
			var invoice = bot.sendInvoice(msg.from.id,{title,description,payload, providerToken, startParameter, currency, prices,photo,need,replyMarkup});
		}
		else
		{
			bot.sendMessage(msg.from.id,"Извините у вас нет активных счетов " + emoji.get('disappointed'));
		}
	});
	return bot.answerCallbackQuery(msg.id);
}


function getCart(msg,is_callback)
{
	var str = "<b>Список продуктов в корзинке:</b>\n";
	var sql = "SELECT quantity,price_id,product_id,(select product_name from sp_product p where p.product_id=t.product_id) as product FROM `sp_transactions` t WHERE state_id = 1 and client_id =" + msg.from.id;
	con.query(sql, function (err, result) {
		for(var i=0;i<result.length;i++)
		{
			str = str + "<i>" + (i+1) + ") " + result[i].product + "\n" + result[i].quantity + "x" + result[i].price_id + "=" + result[i].quantity*result[i].price_id + " Сум</i>\n";
		}
	});
	var sql = "SELECT sum(price_id*quantity) as sum FROM `sp_transactions` WHERE state_id = 1 and client_id =" + msg.from.id;
	con.query(sql, function (err, result) {
		str = str + "Общая сумма: " + result[0].sum + " Сум\n";
		if(result[0].sum !== null)
		{
			replyMarkup = bot.inlineKeyboard([
			[
				bot.inlineButton(emoji.get('sunglasses') + 'Оформить', {callback: 'Offer'})
			]
			]);			
			var [parseMode,replyMarkup] = ['HTML',replyMarkup];
			bot.sendMessage(msg.from.id,str,{parseMode,replyMarkup});
		}
		else
		{
			bot.sendMessage(msg.from.id,"Ваша корзина пуста" + emoji.get('disappointed'));
		}
	});
	if(is_callback == true) {	return bot.answerCallbackQuery(msg.id); }

}

function removeFromCart(msg)
{
	id = msg.data.match(/\d/g);
	id = id.join("");
	var sql = "select transaction_id,quantity from sp_transactions where client_id = '" + msg.from.id +"' and state_id = 1 and product_id = " + id + ";select Price from sp_price where product_id=" + id;
	console.log(sql);
	con.query(sql, function (err, result, fields) {
		if (err) throw err;
		console.log(result[1][0].Price);
		if(result[0].length > 0)
		{
			console.log(">0");
			var qty = result[0][0].quantity - 1;
			if(qty > 0)
			{
				var sql1 = "update sp_transactions set `quantity`="+qty+" where `client_id`="+msg.from.id+" and `product_id`=" + id;
			}
			if(qty == 0)
			{
				var sql1 = "delete from sp_transactions where `client_id`=" + msg.from.id + " and `product_id`=" + id;
			}
			con.query(sql1, function (err, result, fields) {
				var [text,showAlert] = [qty + " штук(а) в корзине",false];
				return bot.answerCallbackQuery(msg.id,{text,showAlert});
			});
		}
		if(result[0].length == 0)
		{
			var [text,showAlert] = ["Выбранного продукта нету в корзине",true];
			return bot.answerCallbackQuery(msg.id,{text,showAlert});

		}
	});
}

function addToCart(msg)
{
	id = msg.data.match(/\d/g);
	id = id.join("");
	var sql = "select transaction_id,quantity from sp_transactions where client_id = '" + msg.from.id +"' and state_id = 1 and product_id = " + id + ";select Price from sp_price where product_id=" + id;
	console.log(sql);
	con.query(sql, function (err, result, fields) {
		if (err) throw err;
		console.log(result[1][0].Price);
		if(result[0].length > 0)
		{
			console.log(">0");
			var qty = result[0][0].quantity + 1;
			var sql1 = "update sp_transactions set `quantity`="+qty+" where `client_id`="+msg.from.id+" and `product_id`=" + id;
			console.log(sql1);
			con.query(sql1, function (err, result, fields) {
				var [text,showAlert] = [qty + " штук(а) в корзине",false];
				return bot.answerCallbackQuery(msg.id,{text,showAlert});
			});
		}
		if(result[0].length == 0)
		{
			console.log("=0");
			var qty = 1;
			var sql1 = "insert into sp_transactions (`client_id`,`product_id`,`price_id`,`quantity`) values ("+msg.from.id+","+id+","+result[1][0].Price+","+qty+")";
			console.log(sql1);
			con.query(sql1, function (err, result, fields) {
				var [text,showAlert] = [qty + " штук(а) в корзине",false];
				return bot.answerCallbackQuery(msg.id,{text,showAlert});
			});
		}
	});
}

function getProductDesc(msg)
{
	id = msg.data.match(/\d/g);
	id = id.join("");
	//console.log(id);
	var [chatId, messageId] = [msg.from.id, msg.message.message_id];
	var replyMarkup;
	var sql = "select product_Description as pd from sp_product where product_id =" + id;
	con.query(sql, function (err, result) {
		if (err) throw err;
		replyMarkup = bot.inlineKeyboard([
			[
				bot.inlineButton(emoji.get('heavy_minus_sign'), {callback: id + 'M'}),
				bot.inlineButton(emoji.get('heavy_plus_sign'), {callback: id + 'P'}),
				bot.inlineButton(emoji.get('back') + 'Назад', {callback: id + 'Back'})
			],
			[
				bot.inlineButton(emoji.get('inbox_tray') + 'Корзина', {callback: 'Bin'})
			]
		]);
		bot.editMessageText({chatId, messageId},result[0].pd, {replyMarkup});
		return bot.answerCallbackQuery(msg.id);
	});
}


function editMsgKeyboard(msg,is_back)
{
	var [chatId, messageId] = [msg.from.id, msg.message.message_id];
	var replyMarkup;
	if(is_back == false) 
	{
		replyMarkup = bot.inlineKeyboard([
        [
            bot.inlineButton(emoji.get('heavy_minus_sign'), {callback: msg.data + 'M'}),
			bot.inlineButton(emoji.get('heavy_plus_sign'), {callback: msg.data + 'P'}),
            bot.inlineButton(emoji.get('back') + 'Назад', {callback: msg.data + 'Back'})
        ],
		[
            bot.inlineButton(emoji.get('inbox_tray') + 'Корзина', {callback: 'Bin'})
        ]
    ]);
	}
	if(is_back == true) 
	{
		var id = msg.data.match(/\d/g);
		id = id.join("");
		console.log(id);
		replyMarkup = bot.inlineKeyboard([
        [
            bot.inlineButton(emoji.get('heavy_dollar_sign') + 'Купить!', {callback: id}),
            bot.inlineButton(emoji.get('eyeglasses') + ' Подробно...', {callback: id + 'D'})
        ], 
		[
            bot.inlineButton(emoji.get('inbox_tray') + 'Корзина', {callback: 'Bin'})
        ]
    ]);
	}
	bot.answerCallbackQuery(msg.id);
    return bot.editMessageReplyMarkup({chatId, messageId}, {replyMarkup});
}




bot.start();