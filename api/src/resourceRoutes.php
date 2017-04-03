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