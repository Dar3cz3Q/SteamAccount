<?php
	$userid = $_GET['user'];
	$secret_keys = require_once "keys.php";
	$url = 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='.$secret_keys[0].'&input_json={"steamid":'.$userid.',"include_appinfo":true}';

	$ch = curl_init($url);
	$object = json_decode(curl_exec($ch));
	curl_close($ch);
	return $object;
?>