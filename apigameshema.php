<?php
	$appid = $_GET['appid'];
	$secret_keys = require_once "keys.php";
	$url = "https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=$secret_keys[0]&appid=$appid";

	$ch = curl_init($url);
	$object = json_decode(curl_exec($ch));
	curl_close($ch);
	return $object;
?>