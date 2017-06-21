<?php
// Routes

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use GuzzleHttp\Client;

$app->get('/project', function($request, $response, $args) {

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

$app->post('/project', function($request, $response, $args) {

	require_once('database_connection.php');

	$data = $request->getParsedBody();

	$name = json_encode($data["name"]);
	$color = json_encode($data["color"]);
	$notes = json_encode($data["notes"]);

	$query = "INSERT INTO projects VALUES (NULL, $name, NULL, $color, $notes)";

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

	$query = "SELECT name FROM projects WHERE id = $id";

	$result = $dbconn->query($query);

	if($result->num_rows > 0) {

	    while($row = $result->fetch_assoc()) {

	       $projectName = json_encode($row["name"]);
	    }

       $query2 = "DELETE FROM bookings WHERE project_name = $projectName";   
	}
	else {

		$query2 = "";
	}

	$query3 = "DELETE FROM projects WHERE id = $id";

	if($dbconn->query($query2) && $dbconn->query($query3)) {

		return $response->getBody()->write('Project and associated bookings deleted successfully.');
	}
	else {

		return $response->getBody()->write('Error! '. $dbconn->error);
	}

	$dbconn->close();
});

$app->post('/project/update/{id}', function($request, $response, $args) {

	require_once('database_connection.php');

	$data = $request->getParsedBody();
	$id = $args['id'];

	$name = json_encode($data["name"]);
	$color = json_encode($data["color"]);
	$notes = json_encode($data["notes"]);

	$query = "SELECT name FROM projects WHERE id = $id";

	$result = $dbconn->query($query);

	if($result->num_rows > 0) {

	    while($row = $result->fetch_assoc()) {

	       $projectName = json_encode($row["name"]);
	    }

       $query2 = "UPDATE bookings SET project_name = $name WHERE project_name = $projectName";   
	}
	else {

		$query2 = "";
	}

	$query3 = "UPDATE projects SET name = $name, colour_code = $color, notes = $notes WHERE id = $id";

	if($dbconn->query($query2) && $dbconn->query($query3)) {

		$response->getBody()->write('Project details successfully updated.');
	}
	else {

		$response->getBody()->write('Error! '. $dbconn->error);
	}

	$dbconn->close();
});

$app->get('/harProject', function($request, $response, $args) {

	require_once('harvest_client.php');
	require_once('database_connection.php');

	$data = json_decode($harvestClient->request('GET', 'projects')->getBody());

	// $activeProjectsArray = [];

	$query1 = "SELECT * FROM projects";

	$result = $dbconn->query($query1);

	while($row = $result->fetch_assoc()) {

		foreach($data as $key => $project) {
 
	    if($row['name'] === $project ->  project -> name) {

	    	unset($data[$key]);
	    }
	  } 
	} 

	foreach($data as $key => $projectObj) {
		
		if(isset($projectObj -> project -> active) && $projectObj -> project -> active === true) {

			// array_push($activeProjectsArray, $projectObj -> project);

			$name = json_encode($projectObj -> project -> name);
			$color = json_encode('#' . str_pad(dechex(mt_rand(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT));
			$notes = json_encode($projectObj -> project -> notes);

			$query = "INSERT INTO projects VALUES (NULL, $name, NULL, $color, $notes)";

			$dbconn->query($query);
		}
	}

	$dbconn->close();
	return $response->getBody()->write('Projects database table updated.');
});