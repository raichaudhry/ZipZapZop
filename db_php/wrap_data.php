<?
	function wrap_data(?string $data = null, ?array $error = null): string {
		if ($data != null) {
			# Return JSON w/ data set to $data
			$type = gettype($data);
			if ($type == "string" || $type == "resource" || $type == "unknown type") {
				# Return data in quotes if it can't be handeled in another way. 
				return "{'data': '$data'}";
			} else {
				# Otherwise return as is (to preserve types like integers)
				return "{'data': $data}";
			}
		} elseif ($error != null) {
			# Return JSON w/ error set to $error
			# $error = {name: string, info: string}
			return "{'error': $error}";
		} else {
			# At least one has to be defined, so there is a problem. 
			return "{'error': {'name': 'WRAP_DATA_FUNC_ERROR', 'info': '\$data or \$error were not defined.'}";
		}
	}
	function echo_wrapped(?string $data = null, ?array $error = null) {
		echo wrap_data(data: $data, error: $error);
	}
?>
