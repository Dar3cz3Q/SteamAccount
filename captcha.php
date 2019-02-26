<?php
	$responseKey = $_GET['responseKey'];
	$secret_keys = require_once "keys.php";
	$ip = $_SERVER['REMOTE_ADDR'];
	$url = "https://www.google.com/recaptcha/api/siteverify?secret=$secret_keys[1]&response=$responseKey&remoteip=$ip";
	$check = file_get_contents($url);
	echo $check;
?>