<?php
	$userid = $_GET['user'];
	$secret_keys = require_once "secrets/keys.php";
	$url = "http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=$secret_keys[0]&steamids=$userid";

	$ch = curl_init($url);
	$object = json_decode(curl_exec($ch));
	curl_close($ch);
	return $object;
?>