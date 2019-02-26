<?php
	$userid = $_GET['user'];
	$secret_keys = require_once "secrets/keys.php";
	$url = "https://api.steampowered.com/IPlayerService/GetBadges/v1/?key=$secret_keys[0]&steamid=$userid";

	$ch = curl_init($url);
	$object = json_decode(curl_exec($ch));
	curl_close($ch);
	return $object;
?>