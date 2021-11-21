<?php include "./execute_query.php" ?>
<?php include "./wrap_data.php" ?>
<?php
	$uid = intval($_POST["uid"]);
	$password = $_POST["password"];
	$chat_id = $_POST["cid"];
	$key = $_POST["key"];

	$uid_var = [
		"name" => "uid",
		"type" => "int",
		"value" => $uid
	];
	$password_var = [
		"name" => "password",
		"type" => "string",
		"value" => $password
	];

	# Verify that there is a user under that UID and password
	$user = execute_query("SELECT username FROM users WHERE uid=:uid and password=':password'", [
		$uid_var,
		$password_var
	]);
	if ($user == null) {
		# Error for invalid auth
	}
	# If user isn't in chat error for invalid auth
	
	

	$result = execute_query("SELECT key FROM chats WHERE id=:id'", [
		$uid_var,
		$password_var,
		[
			"name" => "cid",
			"type" => "string", 
			"value" => $password
		],
		[
			"name" => "key",
			"type" => "string",
			"value" => $key
		]
	]);
	echo_wrapped(data: $result);
?>
