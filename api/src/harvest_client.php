<?php

	$harvestToken = 'Basic ZGFtaWFuLndAaW50ZXJzdGF0ZXRlYW0uY29tOkdha28yMjYx';

	$harvestClient = new GuzzleHttp\Client([
		'base_uri' => 'https://interstateteam.harvestapp.com/',
		'headers' => ['Authorization' => $harvestToken, 'Accept' => 'application/json', 'Content-Type' => 'application/json']
	]);

?>