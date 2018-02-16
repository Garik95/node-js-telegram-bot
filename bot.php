  <?php
include("src/Autoloader.php");
  $token = '426046945:AAGKx_kmBbLzpGfB8xdqoz3CIi1-Z2yBuqE';
  $bot = new Telegram\Bot($token, "test_GN_bot", "test_bot_GN");
  $tg = new Telegram\Receiver($bot);
  $content = file_get_contents("php://input");
  $update = json_decode($content, true);
  $con = mysqli_connect('83.69.138.176', 'admin_novatio', '9UAeIFiJtf', 'admin_nova');
  mysqli_set_charset($con,"utf8");
	function remove_emoji($text){
		  return preg_replace('/([0-9|#][\x{20E3}])|[\x{00ae}|\x{00a9}|\x{203C}|\x{2047}|\x{2048}|\x{2049}|\x{3030}|\x{303D}|\x{2139}|\x{2122}|\x{3297}|\x{3299}|\x{200D}][\x{FE00}-\x{FEFF}]?|[\x{2190}-\x{21FF}][\x{FE00}-\x{FEFF}]?|[\x{2300}-\x{23FF}][\x{FE00}-\x{FEFF}]?|[\x{2460}-\x{24FF}][\x{FE00}-\x{FEFF}]?|[\x{25A0}-\x{25FF}][\x{FE00}-\x{FEFF}]?|[\x{2600}-\x{27BF}][\x{FE00}-\x{FEFF}]?|[\x{2900}-\x{297F}][\x{FE00}-\x{FEFF}]?|[\x{2B00}-\x{2BF0}][\x{FE00}-\x{FEFF}]?|[\x{1F000}-\x{1F6FF}][\x{FE00}-\x{FEFF}]?/u', '', $text);
	}
	function check_progress($con,$tg,$token)
	{
		$sql = "SELECT `userid`,`cat`,`sub_cat` FROM `sp_users` where `userid` = ".$tg->user->id;
		$query = mysqli_query($con,$sql);
		return mysqli_fetch_object($query);
	}
	function start_menu($con,$tg,$token)
	{
	$sql  = 'SELECT * FROM ymd_categories where id>0 and parent_id = 0 and indx = 0';

          $query  = mysqli_query($con, $sql);
          $user_id = $tg->user->id;
                      $text_reply = "Выберите категорию...";
                        unset($key);
                        while ($row = mysqli_fetch_array($query))
                        {
                          $key[] = array(json_decode($row['emoji']).$row['name']);
                        }
                        $key[] = array(json_decode('"\ud83d\uded2"').'Корзинка');
                        $sql  = 'SELECT * FROM ymd_categories where id>0 and parent_id=0 and indx = 1';
                        $query  = mysqli_query($con, $sql);
                        $in = 0;
                        while ($row = mysqli_fetch_array($query))
                        {
                            if($in === 2) {
                              $key[] = array($item['0'],$item['1']);
                              $in=0;
                            }
                            $item[$in] = $row['name'];
                            $in++;
                        }
                        $replyMarkup = array(
                            'keyboard' => $key,
                            'resize_keyboard' => true,
                            'one_time_keyboard' => true
                          );
                        $encodedMarkup = json_encode($replyMarkup);
          $url = 'https://api.telegram.org/bot'.$token.'/sendMessage?chat_id='.$user_id;
          $url .= '&text=' .$text_reply. '&reply_markup='.$encodedMarkup;
		$res = file_get_contents($url);
	}
	function get_category($con,$tg,$token,$is_back)
	{
			if($is_back != NULL)
			{
				$menu = check_progress($con,$tg,$token);
				$menu = $menu->cat;
			}
			else $menu = (string)remove_emoji($tg->text());
		
		    if($menu === "Акции"){
				$sql = 'select * from action where status = 1';
				$query  = mysqli_query($con, $sql);
           		$user_id = $tg->user->id;
				//unset($key);
				$key[] = array(json_decode('"\u23ea"')."Назад",json_decode('"\ud83d\uded2"')."Корзинка");
				while ($row = mysqli_fetch_array($query))
                    {
						$key[] = array($row['name']);
                    }
                    
                    $replyMarkup = array(
                        'keyboard' => $key,
                        'resize_keyboard' => true,
                      );

                    $encodedMarkup = json_encode($replyMarkup);
				$url = 'https://api.telegram.org/bot'.$token.'/sendMessage?chat_id='.$user_id;
                    $url .= '&text=123&reply_markup='.$encodedMarkup;
                    $res = file_get_contents($url);
			}
			else{
		   $sql = 'select distinct(name) as name,id,emoji from sp_menu where category= "'.$menu.'" ORDER by sort_id';
		   $query  = mysqli_query($con, $sql);
           $user_id = $tg->user->id;
					unset($key);
				    $key[] = array(json_decode('"\u23ea"')."Назад",json_decode('"\ud83d\uded2"')."Корзинка");
					while ($row = mysqli_fetch_array($query))
                    {
						$key[] = array(json_decode($row['emoji']).$row['name']);
                    }
                    
                    $replyMarkup = array(
                        'keyboard' => $key,
                        'resize_keyboard' => true,
                      );

                    $encodedMarkup = json_encode($replyMarkup);
                    $sql = 'select description from ymd_categories where name= "'. $menu.'"';
                    $query  = mysqli_query($con, $sql);
                    $text_reply = mysqli_fetch_object($query);
                    $url = 'https://api.telegram.org/bot'.$token.'/sendMessage?chat_id='.$user_id;
                    $url .= '&text=' .$text_reply->description. '&parse_mode=HTML&reply_markup='.$encodedMarkup;
                    $res = file_get_contents($url);
		}
			$sql = "update sp_users set cat='".$menu."' where userid=".$tg->user->id;
			$con->query($sql);
	}



  $menu = (string)remove_emoji($tg->text());

          // $sss = $tg->text();
          //$question = substr((string)$sss,1,3);
          //$tg->send->text($menu)->send();
          //$tg->send->text($tg->text())->send();
          //$tg->send->text(json_encode($menu))->send();



  $sql  = 'SELECT * FROM staff';
  $query  = mysqli_query($con, $sql);
  $usr = 0;
                      while ($row = mysqli_fetch_array($query))
                      {
                        if($tg->user->id == $row['staff_id'])
              {$usr = 1;}
                      }
  if($usr == 1)
  {
  $msg_id = intval($update['message']['reply_to_message']['message_id']);
  $sql  = 'SELECT * FROM sp_questions where message_id='.($msg_id-1);
  $query  = mysqli_query($con, $sql); 
  $row = mysqli_fetch_array($query);
    
  $url = "https://api.telegram.org/bot426046945:AAGKx_kmBbLzpGfB8xdqoz3CIi1-Z2yBuqE/sendmessage?chat_id=".$row['user_id']."&text=".$tg->text()."&reply_to_message_id=".($msg_id-1);
  $res = file_get_contents($url);
  }
  if($usr == 0){
  if($tg->callback)
  {
    
    $sql  = 'SELECT * FROM sp_product `p` left outer join `sp_price` `pr` on `p`.`product_id` = `pr`.`product_id`';

      $query  = mysqli_query($con, $sql);

                    while ($row = mysqli_fetch_array($query))
                    {
              $res[] = $row['product_id'];
            }
    foreach($res as $r=>$val)
    {
      if($tg->callback == (string)$val)
      {
        
        $encodedMarkup = '{"inline_keyboard": [[{"text": "➖","callback_data": "'.$val.'M"},{"text": "➕","callback_data": "'.$val.'P"},{"text": "🔙 Назад","callback_data": "'.$val.'back"}],[{"text": "🛒 Корзина","callback_data": "Bin"}]]}';
        $url = 'https://api.telegram.org/bot'.$token.'/editMessageReplyMarkup?chat_id='.$tg->chat->id.'&message_id='.$tg->message;
          $url .= '&reply_markup='.$encodedMarkup;
          $res = file_get_contents($url);
        $tg->answer_if_callback("Выберите количество");
      }elseif($tg->callback == (string)$val."d")
      {
         $tg->answer_if_callback(""); // Stop loading button.
         // $con = @mysqli_connect('localhost', 'somon_bot', 'Qxjg041*', 'somonitrading_bot');
           $sql  = 'select * from sp_product where product_id ='.$val;
           $query  = mysqli_query($con, $sql);
                      while ($row = mysqli_fetch_array($query))
                      {
                        $key = $row['product_Description'];
                      }
		  $encodedMarkup = '{"inline_keyboard": [[{"text": "➖","callback_data": "'.$val.'M"},{"text": "➕","callback_data": "'.$val.'P"},{"text": "🔙 Назад","callback_data": "'.$val.'back"}],[{"text": "🛒 Корзина","callback_data": "Bin"}]]}';
        $url = 'https://api.telegram.org/bot'.$token.'/editMessageText?chat_id='.$tg->chat->id.'&message_id='.$tg->message;
          $url .= '&text='.(string)$key.'&parse_mode=HTML&reply_markup='.$encodedMarkup;
          $res = file_get_contents($url);
          /*$tg->send
          ->message(TRUE)
          ->chat(TRUE)
          ->text((string)$url)
          ->send();*/
      }elseif($tg->callback == (string)$val."P")
      {
        // $con = @mysqli_connect('localhost', 'somon_bot', 'Qxjg041*', 'somonitrading_bot');
        
        $check = 'select transaction_id,quantity from sp_transactions where client_id = '.$tg->user->id.' and state_id = 1 and product_id = '.$val;
        
        $ck  = mysqli_query($con, $check);
        
        $nr = mysqli_num_rows($ck);

        $prc = 'select Price from sp_price where product_id='.$val;
        $prc = mysqli_query($con, $prc);
        $obj = mysqli_fetch_object($prc);
        if($nr === 0){
          $qty = 1;
        $sql  = 'insert into sp_transactions (`client_id`,`product_id`,`price_id`,`quantity`) values ('.$tg->user->id.','.$val.','.$obj->Price.','.$qty.')';
        }else {
          $obj_qty = mysqli_fetch_object($ck);
          $qty = (int)$obj_qty->quantity+1;
          $sql = 'update sp_transactions set `quantity`='.$qty.' where `client_id`='.$tg->user->id.' and `product_id`='.$val;
        }
        if($con->query($sql) === TRUE){
          $tg->answer_if_callback($qty." штук(а) в корзине");
          }else{
          $tg->answer_if_callback("Ошибка в добавлении продукта в корзину. Повторите попытку позже 🙁");
          }
      }elseif($tg->callback == (string)$val."M")
      {
        // $con = @mysqli_connect('localhost', 'somon_bot', 'Qxjg041*', 'somonitrading_bot');
        
        $check = 'select transaction_id,quantity from sp_transactions where client_id = '.$tg->user->id.' and state_id = 1 and product_id = '.$val;
        
        $ck  = mysqli_query($con, $check);
        
        $nr = mysqli_num_rows($ck);

        $prc = 'select Price from sp_price where product_id='.$val;
        $prc = mysqli_query($con, $prc);
        $obj = mysqli_fetch_object($prc);
        $obj_qty = mysqli_fetch_object($ck);
        if((int)$obj_qty->quantity == 0){
          $tg->answer_if_callback("Выбранного продукта нету в корзине");
        }else {
          $qty = (int)$obj_qty->quantity-1;
          if($qty === 0)
          {
            $sql = 'delete from sp_transactions where `client_id`='.$tg->user->id.' and `product_id`='.$val;
          }else
          $sql = 'update sp_transactions set `quantity`='.$qty.' where `client_id`='.$tg->user->id.' and `product_id`='.$val;
        }
        if($con->query($sql) === TRUE){
          $tg->answer_if_callback($qty." штук(а) в корзине");
          }else{
          $tg->answer_if_callback("Ошибка в добавлении продукта в корзину. Повторите попытку позже 🙁");
          }
      }elseif($tg->callback == (string)$val."back")
      {
		  $sql  = 'SELECT * FROM sp_product `p` left outer join `sp_price` `pr` on `p`.`product_id` = `pr`.`product_id` where `p`.`product_id`='.$val;
            $query  = mysqli_query($con, $sql);
              $row = mysqli_fetch_object($query);
        $encodedMarkup = '{"inline_keyboard": [[{"text": "💲 Купить!","callback_data": "'.$val.'"},{"text": "🔍 Подробно...","callback_data": "'.$val.'d"}],[{"text": "🛒 Корзина","callback_data": "Bin"}]]}';
        $url = 'https://api.telegram.org/bot'.$token.'/editMessageText?chat_id='.$tg->chat->id.'&message_id='.$tg->message;
          $url .= '&text='.$row->product_name." - Цена: ".$row->Price." Сум".'&reply_markup='.$encodedMarkup;
          $res = file_get_contents($url);
		  
		          /*$sql  = 'SELECT * FROM sp_product `p` left outer join `sp_price` `pr` on `p`.`product_id` = `pr`.`product_id` where product_name ="'.$tg->text().'"';
            $query  = mysqli_query($con, $sql);
              $row = mysqli_fetch_object($query);
              $url ='https://api.telegram.org/bot'.$token.'/sendPhoto?chat_id='.$tg->user->id.'&photo='.$row->product_Photo;
              $res = file_get_contents($url);
		  $url ='https://api.telegram.org/bot'.$token.'/sendMessage?chat_id='.$tg->user->id.'&text='.$row->product_name." - Цена: ".$row->Price." Сум".'&reply_markup={"inline_keyboard": [[{"text": "💲 Купить!","callback_data": "'.$row->product_id.'"},{"text": "🔍 Подробно...","callback_data": "'.$row->product_id.'d"}],[{"text": "🛒 Корзина","callback_data": "Bin"}]]}';
              $res = file_get_contents($url);*/
		  
		  
      }
    }
    if($tg->callback == "Bin")
    {
      $tg->answer_if_callback("");
        $sql = 'SELECT quantity,price_id,product_id,(select product_name from sp_product p where p.product_id=t.product_id) as product FROM `sp_transactions` t WHERE state_id = 1 and client_id ='. $tg->user->id;
        $query  = mysqli_query($con, $sql);
                    while ($row = mysqli_fetch_array($query))
                    {
                      $cart[] = array($row['product'],$row['quantity'],$row['price_id']);
                    }
        $sql = 'SELECT sum(price_id*quantity) as sum FROM `sp_transactions` WHERE state_id = 1 and client_id ='.$tg->user->id;
        $query  = mysqli_query($con, $sql);
        $s = mysqli_fetch_object($query);
        $str = "<b>Список продуктов в корзинке:</b>\n";
        $i = 1;
        foreach($cart as $c)
        {
          $str = $str ."<i>".$i.") ". $c[0] ."\n". $c[1] ."x".$c[2]."=".$c[1]*$c[2]." Сум</i>\n";
          $i++;
        }
        $str = $str ."Общая сумма: ". (int)$s->sum . " Сум\n";
        if((int)$s->sum != 0)
        {
          $tg->send->text($str,"html")->inline_keyboard()
          ->row()
            ->button("Оформить заказ","offer")
          ->end_row()
          ->show()->send();
        }else{$tg->send->text("Ваша корзина пуста \xF0\x9F\x98\x9E")->send();}
    }
    if($tg->callback == "offer")
    {
      $tg->answer_if_callback("");
      
        $sql = 'SELECT quantity,price_id,product_id,(select product_name from sp_product p where p.product_id=t.product_id) as product FROM `sp_transactions` t WHERE state_id = 1 and client_id ='. $tg->user->id;
        $query  = mysqli_query($con, $sql);
                    while ($row = mysqli_fetch_array($query))
                    {
                      $cart[] = array($row['product'],$row['quantity'],$row['price_id']);
                    }
        $sql = 'SELECT sum(price_id*quantity) as sum FROM `sp_transactions` WHERE state_id = 1 and client_id ='.$tg->user->id;
        $query  = mysqli_query($con, $sql);
        $s = mysqli_fetch_object($query);
        $str = "";
        foreach($cart as $c)
        {
          $str = $str . $c[0] ."\n". $c[1] ."x".$c[2]."=".$c[1]*$c[2]." Сум\n";
        }   
        $sum = (int)$s->sum;
        $sum = $sum * 100;
      if($sum != 0){
      $chat_id = $tg->chat->id;
      $title = "Оформление заказа";
      $description = urlencode($str);
      $provider_token = '398062629:TEST:999999999_F91D8F69C042267444B74CC0B3C747757EB0E065';
      $start_parameter = 'start_parameter';
      $url = 'https://api.telegram.org/bot'.$token.'/sendInvoice?chat_id='.$chat_id.'&title='.$title.'&description='.$description.'&payload=payload&provider_token='.$provider_token.'&start_parameter='.$start_parameter.'&currency=UZS&prices=[{"label":"Общая сумма","amount":'.$sum.'},{"label":"Скидка","amount":0}]&photo_url=https://somonitrading.com/tg/logo.png&photo_width=100&photo_height=100&need_phone_number=true&need_name=true&reply_markup={"inline_keyboard":[[{"text":"Оплатить через Click","pay":"true"}],[{"text":"Оплатить наличними","callback_data":"cash"}]]}';
        $res = file_get_contents($url);
      }else{$tg->send->text("Извините у вас нет активных счетов \xF0\x9F\x98\x9E")->send();}
    }
    if($tg->callback == 'cash')
    {
      $tg->answer_if_callback("");
      $sql = "select count(*) as qty from sp_transactions where state_id = 1 and client_id =". $tg->user->id;
      $query = mysqli_query($con,$sql);
      $q = mysqli_fetch_object($query);
      if((int)$q->qty > 0){
          $text_reply = "Укажите ваш тедефон";
          $key[] = array(array('text'=>'Мой номер','request_contact'=>true));
                          $replyMarkup = array(
                            'keyboard' => $key,
                            'resize_keyboard' => true,
                            'one_time_keyboard' => true
                          );
                        $encodedMarkup = json_encode($replyMarkup);
          $url = 'https://api.telegram.org/bot'.$token.'/sendMessage?chat_id='.$tg->user->id;
          $url .= '&text=' .$text_reply. '&reply_markup='.$encodedMarkup;
          $res = file_get_contents($url);
        }else{
          $tg->send->text("Ваша корзина пуста")->send();
        }
    }
    
  }

  if(array_key_exists('pre_checkout_query',$update))
  {
    $url = 'https://api.telegram.org/bot'.$token.'/answerPreCheckoutQuery?pre_checkout_query_id='.$update["pre_checkout_query"]["id"].'&ok=true';
    $res = file_get_contents($url);

    $tran_id = md5(date("Y-m-d H:i:s")."_".$tg->user->id);
    $uid = $update['pre_checkout_query']['from']['id'];

    $sql = 'select * from sp_transactions where state_id = 1 and client_id='.$uid;
    $query = mysqli_query($con,$sql);
    while($row = mysqli_fetch_array($query))
    {
      $sql = "Insert into receipt_id(id,transaction_id) values ('".$tran_id."',".$row['transaction_id'].")";
      mysqli_query($con,$sql);
    }

    $name = (string)$update['pre_checkout_query']['order_info']['name'];
    $sql = "Insert into billing_info(contact_name,contact_phone,receipt_id,txt,payment_method) values ('".$name."','".(string)$update['pre_checkout_query']['order_info']['phone_number']."','".$tran_id."','".$uid."',1)";
    mysqli_query($con,$sql);

    $sql = 'update sp_transactions set state_id = 3 where state_id = 1 and client_id='.$uid;
    mysqli_query($con,$sql);
  }elseif(!is_null($update['message']['contact'])){
    $tran_id = md5(date("Y-m-d H:i:s")."_".$tg->user->id);

    $sql = 'select * from sp_transactions where state_id = 1 and client_id='.$tg->user->id;
    $query = mysqli_query($con,$sql);
    while($row = mysqli_fetch_array($query))
    {
      $sql = "Insert into receipt_id(id,transaction_id) values ('".$tran_id."',".$row['transaction_id'].")";
      mysqli_query($con,$sql);
    }

    $name = (string)$update['message']['contact']['first_name'];
    $sql = "Insert into billing_info(contact_name,contact_phone,receipt_id,txt,payment_method) values ('".$name."','".(string)$update['message']['contact']['phone_number']."','".$tran_id."','".$tg->user->id."',2)";
    mysqli_query($con,$sql);

        $sql = 'update `sp_transactions` set state_id = 2 where state_id = 1 and `client_id`='.$tg->user->id;
        mysqli_query($con, $sql);

        $tg->answer_if_callback("Ваш заказ оформлен!");
        $tg->send->text("В течении пару минут наши люди вам позвонят для подтверждения заказа")->send();
  }elseif(!is_null($update['message']['photo']))
  {
    $tg->send->text((string)$update['message']['photo']['2']['file_id'])->send();
  }

  if($tg->text()){
      // $con = @mysqli_connect('localhost', 'somon_bot', 'Qxjg041*', 'somonitrading_bot');
          /*$sss = $tg->text();
          $question = substr((string)$sss,0,10);
          $tg->send->text($question)->send();*/


      $chusr = "Select userid from sp_users where userid = ". $tg->user->id;

      $query_chusr  = mysqli_query($con, $chusr);
            if(mysqli_num_rows($query_chusr) === 0){
              $sql = "INSERT INTO sp_users (userid,first_name, last_name, language_code,username,status) VALUES ('".$tg->user->id."', '".$tg->user->first_name."', '".$tg->user->last_name."','".$tg->user->language_code."','".$tg->user->username."',1)";
              $con->query($sql);
            }   

      $sql  = 'SELECT distinct(name) as name,category,product_name FROM sp_menu where name IS NOT NULL UNION SELECT distinct(command) as command ,category,product_name FROM sp_menu where command IS NOT NULL';

      $query  = mysqli_query($con, $sql);
    
                      $text_reply = "Выберите категорию...";
                    while ($row = mysqli_fetch_array($query))
                    {
                      $key[] = array($row['name'],$row['category'],$row['product_name']);
                    }
    foreach($key as $k=>$val)
    { 
      if($val[0] == $menu)
      {
		  //$tg->send->text($tg->text()." 111")->send();
        if($tg->text() === "/start")
        {
			$txt = "Привет ".$tg->user->first_name." ".json_decode('"\ud83d\udc4b"')."! Добро пожаловать в мир здоровой еды и питания от Novatio. Я бот компаньон, я помогу тебе дать подробную информацию о продукции Novatio.";
			$tg->send->text((string)$txt)->send();
			$sql = "update sp_users set cat=NULL,sub_cat=NULL where userid=".$tg->user->id;
			$con->query($sql);
			start_menu($con,$tg,$token);
        }elseif($menu === "Назад")
		{
			$obj = check_progress($con,$tg,$token);
			if($obj->cat != NULL && $obj->sub_cat == NULL)
			{
				start_menu($con,$tg,$token);
			}
			elseif($obj->cat != NULL && $obj->sub_cat != NULL)
			{
				$sql = "update sp_users set sub_cat=NULL where userid=".$tg->user->id;
				$con->query($sql);
				get_category($con,$tg,$token,1);
			}
		}elseif($menu === "Корзинка")
        {
          $sql = 'SELECT quantity,price_id,product_id,(select product_name from sp_product p where p.product_id=t.product_id) as product FROM `sp_transactions` t WHERE state_id = 1 and client_id ='. $tg->user->id;
          $query  = mysqli_query($con, $sql);
                      while ($row = mysqli_fetch_array($query))
                      {
                        $cart[] = array($row['product'],$row['quantity'],$row['price_id']);
                      }
          $sql = 'SELECT sum(price_id*quantity) as sum FROM `sp_transactions` WHERE state_id = 1 and client_id ='.$tg->user->id;
          $query  = mysqli_query($con, $sql);
          $s = mysqli_fetch_object($query);
          $str = "<b>Список продуктов в корзинке:</b>\n";
          $i = 1;
          foreach($cart as $c)
          {
            $str = $str ."<i>".$i.") ". $c[0] ."\n". $c[1] ."x".$c[2]."=".$c[1]*$c[2]." Сум</i>\n";
            $i++;
          }
          $str = $str ."Общая сумма: ". (int)$s->sum . " Сум\n";
          if((int)$s->sum != 0)
          {
            $tg->send->text($str,"html")->inline_keyboard()
            ->row()
              ->button("Оформить заказ","offer")
            ->end_row()
            ->show()->send();
          }else{$tg->send->text("Ваша корзина пуста \xF0\x9F\x98\x9E")->send();}
        }
		/*elseif($tg->text() === "Акции")
        {
			$sql = "select * from action where status = 1";
			$query  = mysqli_query($con, $sql);
			while ($row = mysqli_fetch_array($query))
                    {
                      $key[] = array(json_decode($row['emoji']).$row['name']);
                    }
           $tg->send->text("Хахахаха!")->send();
        }*/
        elseif($val[1] === 'Команды')
        {
			get_category($con,$tg,$token,NULL);
           /*$sql = 'select distinct(name) as name,emoji from sp_menu where category= "'.$menu.'" ORDER by sort_id';
		   $query  = mysqli_query($con, $sql);
           $user_id = $tg->user->id;
           unset($key);
           $key[] = array(json_decode('"\ud83d\udeaa"')."Назад","Корзинка");
                    while ($row = mysqli_fetch_array($query))
                    {
                      $key[] = array(json_decode($row['emoji']).$row['name']);
                    }
                    
                    $replyMarkup = array(
                        'keyboard' => $key,
                        'resize_keyboard' => true,
                      );

                    $encodedMarkup = json_encode($replyMarkup);
                    $sql = 'select description from ymd_categories where name= "'. $menu.'"';
                    $query  = mysqli_query($con, $sql);
                    $text_reply = mysqli_fetch_object($query);
                    $url = 'https://api.telegram.org/bot'.$token.'/sendMessage?chat_id='.$user_id;
                    $url .= '&text=' .$text_reply->description. '&parse_mode=HTML&reply_markup='.$encodedMarkup;
                    $res = file_get_contents($url);
			$sql = "update sp_users set cat='".$menu."' where userid=".$tg->user->id;
			$con->query($sql);*/
        }
        elseif($tg->text() === "Вопрос к Диетологу")
        {
           $tg->send->text("Напишите ваш вопрос ниже (Начните вопрос с #diet. Пример вопроса #diet Кто такой Диетолог?):")->send();
        }
          //----------------to get list of products--------------------
        else
        {
          $sql = 'SELECT (SELECT NAME FROM ymd_categories where id = y.parent_id) AS pr,y.name FROM `ymd_categories` y WHERE name = "'.$menu.'"';
          $query  = mysqli_query($con, $sql);
          $parent = mysqli_fetch_object($query);
		if($parent->pr==="Акции")
			{
				$sql  = 'select * from action where name="'.$menu.'"';
            	$query  = mysqli_query($con, $sql);
				$row = mysqli_fetch_object($query);
				$url = 'https://api.telegram.org/bot'.$token.'/sendPhoto?chat_id='.$tg->user->id;
                $url .= '&caption=' .$row->description. '&photo='.$row->url;
                $res = file_get_contents($url);
			}
			else
			{
          $sql  = 'SELECT * FROM sp_product `p` left outer join `sp_price` `pr` on `p`.`product_id` = `pr`.`product_id` where sp_category_id = (select id from ymd_categories where name ="'.$menu.'")';
            $query  = mysqli_query($con, $sql);
            if(mysqli_num_rows($query) === 0) {
              $tg->send->text('Пока этот меню пуст...')->send();
            }else{
              unset($key);
                  $key[] = array(json_decode('"\u23ea"')."Назад","Спросить Вживую ☎️");
                  while ($row = mysqli_fetch_array($query))
                  {
           	         $key[] = array($row['product_name']);
                  } 
	                $replyMarkup = array(
                        'keyboard' => $key,
                        'resize_keyboard' => true,
                      );

                    $encodedMarkup = json_encode($replyMarkup);
                    $text_reply = "Выберите продукт:";
                    $url = 'https://api.telegram.org/bot'.$token.'/sendMessage?chat_id='.$tg->user->id;
                    $url .= '&text=' .$text_reply. '&reply_markup='.$encodedMarkup;
                    $res = file_get_contents($url);
			}
					$sql = "update sp_users set cat='".$parent->pr."' , sub_cat='".$menu."' where userid=".$tg->user->id;
					$con->query($sql);
					$sql = 'select description from ymd_categories where name= "'. $menu.'"';
                    $query  = mysqli_query($con, $sql);
                    $txt = mysqli_fetch_object($query);
					if($txt->description != "")
					$tg->send->text("Выберите из <a href='".strip_tags($txt->description)."'>меню</a> понравившейся вам продукт и нажмите на кнопку","HTML")->send();
                  }   
        } break;
      }
      elseif($val[2] === $tg->text())
      {
        $sql  = 'SELECT * FROM sp_product `p` left outer join `sp_price` `pr` on `p`.`product_id` = `pr`.`product_id` where product_name ="'.$tg->text().'"';
            $query  = mysqli_query($con, $sql);
              $row = mysqli_fetch_object($query);
              $url ='https://api.telegram.org/bot'.$token.'/sendPhoto?chat_id='.$tg->user->id.'&photo='.$row->product_Photo;
              $res = file_get_contents($url);
		  $url ='https://api.telegram.org/bot'.$token.'/sendMessage?chat_id='.$tg->user->id.'&text='.$row->product_name." - Цена: ".$row->Price." Сум".'&reply_markup={"inline_keyboard": [[{"text": "💲 Купить!","callback_data": "'.$row->product_id.'"},{"text": "🔍 Подробно...","callback_data": "'.$row->product_id.'d"}],[{"text": "🛒 Корзина","callback_data": "Bin"}]]}';
              $res = file_get_contents($url);
                  }
     elseif($tg->text_has("#diet"))
        {
           $question = substr($tg->text(), 6);
           $sql = "INSERT INTO sp_questions (user_id,message_id,target_message_id,category,question) VALUES ('".$tg->user->id."',".$tg->message.",'".json_encode($tg)."',0, '".$question."')";
              $con->query($sql);
              $token_1 = '447080939:AAFVn76zbat7ngw08UOdhYNIjMIF6EI4fyk';
              $bot_1 = new Telegram\Bot($token_1, "novatio_diet_bot", "bot");
              $tg_1 = new Telegram\Receiver($bot_1);
              $content1 = file_get_contents("php://input");
              $update1 = json_decode($content1, true);
           $sql = "select * from staff";
           $query  = mysqli_query($con, $sql);
           // $query = mysqli_fetch_array($query);

           $sql1 = "select max(id) as maxid from sp_questions where user_id=".$tg->user->id;
           $query1  = mysqli_query($con, $sql1);
           $query1 = mysqli_fetch_array($query1);
           $str = "#".$tg->user->id."-".$tg->message."\n <b>".$tg->user->first_name." ".$tg->user->last_name."</b> \n".$question;
           // $q = 1;
           while($q = mysqli_fetch_array($query))
            {    
              $tg->send
                          ->text($str,"html")
                          ->chat((string)$q['staff_id'])
                          ->inline_keyboard()
                        ->row()
                           ->button("Закрыть",(string)$query1['maxid']."cls")
                        ->end_row()
                      ->show()->send();
            }
              $tg->send->text($tg->user->first_name.", Я ваш вопрос отправил Диетологу))))")->send();
                break;
        }
    
    }
  }
  }


  /*  
  if($tg->text_has("123")){

          //$text = "123";
    
    $con = @mysqli_connect('localhost', 'somon_bot', 'Qxjg041*', 'somonitrading_bot');
    
      $sql  = 'SELECT * FROM sp_category';

      $query  = mysqli_query($con, $sql);
    
                      $text_reply = "Please select a category...";
                    while ($row = mysqli_fetch_array($query))
                    {
                      $key[] = $row['name'];
                    }
    foreach($key as $k)
    {
      if($k == "Сэты")
      $tg->send->text((string)$k)->send();
      /*switch($text)
        case $k[0]: $tg->send->text($text)->send(); break;
      default: break;
    }
  }
  */
  /*if($tg->text_has("ph")){
    //for($i=1;i<=3;i++){
    $i=1;
    while($i<3){
      $tg->send->inline_keyboard()
        ->row()
          ->button((string)$i, "but 1")
          ->button("Blue", "but 2")
        ->end_row()
      ->show()->file("photo","AgADAgADOqgxG70RAUl4K2z14n970B4wSw0ABIKVDAcPeBvjKnQOAAEC"); $i++;}
  }
  */

  /*if($tg->text_has("cat"))
  {
  $con = @mysqli_connect('localhost', 'somon_bot', 'Qxjg041*', 'somonitrading_bot');

      if (!$con) {
        $tg->send->text("failed")->send();
    }
    else $tg->send->text("success")->send();
    
        $sql  = 'SELECT * FROM sp_category';

      $query  = mysqli_query($con, $sql);
    
    $text_reply = "Please select a category...";

    $user_id = $tg->user->id;
                    while ($row = mysqli_fetch_array($query))
                    {
                      $key[] = array($row['name']);
                    }
                    $replyMarkup = array(
                        'keyboard' => $key,
                        'resize_keyboard' => true,
                        'one_time_keyboard' => true
                      );
                    $encodedMarkup = json_encode($replyMarkup);
      //$tg->send->text("Please select a category...")->send();
      //$tg->send->text()->send();

    $url = 'https://api.telegram.org/bot'.$token.'/sendMessage?chat_id='.$user_id;
    $url .= '&text=' .$text_reply. '&reply_markup='.$encodedMarkup;
    $res = file_get_contents($url);

  }*/

  ?>
