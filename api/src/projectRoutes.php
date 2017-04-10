<?php
// Routes

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$app->get('/project', function ($request, $response, $args) {

	require_once('database_connection.php');

	$query = 'SELECT * FROM projects';

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

$app->post('/project', function ($request, $response, $args) {

	require_once('database_connection.php');

	$data = $request->getParsedBody();

	$name = json_encode($data["name"]);
	$color = json_encode($data["color"]);
	

	$query = "INSERT INTO projects VALUES (NULL, $name, NULL, $color)";

	if($dbconn->query($query)) {

		return $response->getBody()->write('Project saved successfully.');
	}
	else {

		return $response->getBody()->write('Error! '. $dbconn->error);
	}

	$dbconn->close();
});

$app->delete('/project/{id}', function($request, $response, $args) {

	require_once('database_connection.php');

	$id = $args['id'];

	$query = "DELETE FROM projects WHERE id = $id";

	if($dbconn->query($query)) {

		$response->getBody()->write('Project successfully deleted.');
	}
	else {

		$response->getBody()->write('Error! '. $dbconn->error);
	}

	$dbconn->close();
});
