<?php
// Routes

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$app->get('/booking', function ($request, $response, $args) {

	require_once('database_connection.php');

	$query = 'SELECT * FROM bookings';

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

$app->get('/booking/daterange/', function ($request, $response, $args) {

	require_once('database_connection.php');

	$sqlQueryParams = '';
	$counter = 0;

	foreach($request->getQueryParams() as $key => $value) {

		$counter ++;

		if($key === 'start_date') {

			$operator = ' >= ';
		}
		else if($key === 'end_date') {

			$operator = ' <= ';
		}
		else {

			$operator = ' = ';
		}

		if($counter === count($request->getQueryParams())) {

			$sqlQueryParams .= $key . $operator . json_encode($value);
		}
		else {

			$sqlQueryParams .= $key . $operator . json_encode($value) . ' AND ';
		}
	}

	$query = 'SELECT * FROM bookings WHERE '.$sqlQueryParams.'';
// echo $query;
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

$app->post('/booking', function($request, $response, $args) {

	require_once('database_connection.php');

	$data = $request->getParsedBody();

	$title = json_encode($data["title"]);
	$notes = json_encode($data["notes"]);
	$start_date = json_encode($data["start_date"]);
	$end_date = json_encode($data["end_date"]);
	$project = json_encode($data["project_name"]);
	$resource = json_encode($data["resource_name"]);

	$query = "INSERT INTO bookings VALUES (NULL, $title, $notes, $start_date, $end_date, NULL, $project, $resource)";

	if($dbconn->query($query)) {

		return $response->getBody()->write('Booking saved successfully.');
	}
	else {

		return $response->getBody()->write('Error! '. $dbconn->error);
	}

	$dbconn->close();
});

$app->put('/booking/update/{id}', function($request, $response, $args) {

	require_once('database_connection.php');

	foreach($request->getQueryParams() as $key => $value) {

		$id = $args['id'];
		$insertValue = json_encode($value);

		$query = "UPDATE bookings SET $key = $insertValue WHERE id = $id";

		if($dbconn->query($query)) {

			$response->getBody()->write('Booking '. $key . ' successfully updated.');
		}
		else {

			$response->getBody()->write('Error! '. $dbconn->error);
		}
	}

	$dbconn->close();
});

$app->post('/booking/update/{id}', function($request, $response, $args) {

	require_once('database_connection.php');
	$data = $request->getParsedBody();
	$id = $args['id'];

	$title = json_encode($data["title"]);
	$notes = json_encode($data["notes"]);
	$project = json_encode($data["project_name"]);
	$resource = json_encode($data["resource_name"]);

	$query = "UPDATE bookings SET title = $title, notes = $notes, project_name = $project, resource_name = $resource WHERE id = $id";

	if($dbconn->query($query)) {

		$response->getBody()->write('Booking successfully details updated.');
	}
	else {

		$response->getBody()->write('Error! '. $dbconn->error);
	}

	$dbconn->close();
});

$app->delete('/booking/{id}', function($request, $response, $args) {

	require_once('database_connection.php');

	$id = $args['id'];

	$query = "DELETE FROM bookings WHERE id = $id";

	if($dbconn->query($query)) {

		$response->getBody()->write('Booking successfully deleted.');
	}
	else {

		$response->getBody()->write('Error! '. $dbconn->error);
	}

	$dbconn->close();
});
