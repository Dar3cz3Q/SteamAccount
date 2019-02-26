<?php
$to      = 'dho1@tlen.pl';
$name    = $_GET['name'];
$email   = $_GET['mail'];
$message = $_GET['message'];
$subject = 'Nowy e-mail od ' . $name . ' (' . $email . ')';
$headers = 'From: ' . $name . ' (' . $email . ')';
$headers .= 'Content-Type: text/html; charset=utf-8';
mail($to, $subject, $message, $headers);
?>