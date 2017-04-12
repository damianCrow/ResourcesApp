<?php
// Routes

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$app->get('/resource', function ($request, $response, $args) {

	require_once('database_connection.php');

	$query = 'SELECT * FROM resource';

	$result = $dbconn->query($query);

	if($result) {

		$resultsArray = [];

		while($row = $result->fetch_assoc()) {

			array_push($resultsArray, $row);
		}

		return $response->getBody()->write(json_encode($resultsArray));
	}
	else {

		return $response->getBody()->write('Error! '. $dbconn->error);
	}

	$dbconn->close();
});

$app->post('/resource', function($request, $response, $args) {

	require_once('database_connection.php');

	$data = $request->getParsedBody();

	$email = json_encode($data["email"]);
	$password = json_encode(md5($data["password"]));

	$query = "SELECT * FROM resource WHERE email = $email AND password = $password";

	$result = $dbconn->query($query);

	if($result->num_rows > 0) {

		$user = json_encode($result->fetch_assoc());  
		$response->getBody()->write($user);
	}
	else {

		$user = 'user not found!';
		$response->getBody()->write($user);
	}

	if(!$result) {

		$response->getBody()->write('Error! '. $dbconn->error);
	}

	$dbconn->close();
});

$app->post('/resource/signup', function($request, $response, $args) {

	require_once('database_connection.php');
	
	$data = $request->getParsedBody();

	$firstName = json_encode($data["first_name"]);
	$lastName = json_encode($data["last_name"]);
	$email = json_encode($data["email"]);
	$resourceType = json_encode($data["resource_type"]);
	$pass = json_encode(md5($data["password"]));
	$admin = json_encode($data["admin"]);
	$bookable = json_encode($data["bookable"]);

	$query = "INSERT INTO resource VALUES (NULL, $firstName, $lastName, $resourceType, $pass, $email, $admin, $bookable)";

	if($dbconn->query($query)) {

		return $response->getBody()->write('Resource saved successfully.');
	}
	else {

		return $response->getBody()->write('Error! '. $dbconn->error);
	}

	$dbconn->close();
});