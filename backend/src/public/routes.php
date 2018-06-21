<?php

use \Psr\Http\Message\ResponseInterface as Response;
use \Psr\Http\Message\ServerRequestInterface as Request;

# No security
/**
 * /game - POST inits a game and returns an id
 * /game/{id} - PUT (save) DELETE (delete) GET (retrieve all data)
 * /game/{id}/play - GET - Asks the computer to make a play
 *
 */

$app->group('/api', function () {

    $this->post('/game', function (Request $request, Response $response) {

    });

    $this->post('/game/{id}', function (Request $request, Response $response, $args) {

    });

    $this->put('/game/{id}', function (Request $request, Response $response, $args) {

    });

    $this->get('/game/{id}', function (Request $request, Response $response, $args) {

    });

    $this->delete('/game/{id}', function (Request $request, Response $response, $args) {

    });

    $this->get('/game/{id}/play', function (Request $request, Response $response, $args) {

    });
});
