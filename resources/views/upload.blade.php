<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Upload</title>
</head>
<body>
	<form action="ImportClients"  method="post" enctype="multipart/form-data">
		<label>Upload</label>
		<input type="file" name="file">
		<input type="hidden" value="{{ csrf_token() }}" name="_token">
		<input type="submit" value="Upload">
	</form>
</body>
</html>
