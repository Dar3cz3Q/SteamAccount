<?php
	$userid = $_GET['user'];
	$secret_keys = require_once "secrets/keys.php";
	$url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=$secret_keys[0]&steamids=$userid&format=json";

	$ch = curl_init($url);
	$object = json_decode(curl_exec($ch));
	curl_close($ch);
	return $object;
?>