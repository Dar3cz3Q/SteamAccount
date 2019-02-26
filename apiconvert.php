<?php
	$customurl = $_GET['customurl'];
	$secret_keys = require_once "keys.php";
	$url = "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=$secret_keys[0]&vanityurl=$customurl";

	$ch = curl_init($url);
	$object = json_decode(curl_exec($ch));
	curl_close($ch);
	return $object;
?>