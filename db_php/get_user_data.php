<?php include "./execute_query.php" ?>
<?php include "./wrap_data.php" ?>
<?php
	$uid = intval($_POST["uid"]);
	$password = $_POST["password"];
	$key = $_POST["key"];

	$uid_var = [
		"name" => "uid",
		"type" => "int",
		"value" => intval($uid)
	];
	$password_var = [
		"name" => "password",
		"type" => "string",
		"value" => $password
	];

	$result = execute_query("SELECT :key FROM users WHERE uid=:uid and password=':password'", [
		$uid_var, 
		$password, 
		[
			"name" => "key",
			"type" => "string", 
			"value" => $key
		]
	]);
	echo_wrapped(data: $result);
?>
