<?php

use Ramsey\Uuid\Uuid;
use \Psr\Http\Message\ResponseInterface as Response;
use \Psr\Http\Message\ServerRequestInterface as Request;

# NOTE: No security
/**
 * /game - POST inits a game and returns an id
 * /game/{id} - PUT (save) DELETE (delete) GET (retrieve all data)
 * /game/{id}/play - GET - Asks the computer to make a play
 *
 */

$app->group('/api', function () {

    $this->map(['GET', 'POST'], '/game', function (Request $request, Response $response) {
        $uuidv4 = Uuid::uuid4();
        return $response->withJson(['success' => true, 'gameId' => $uuidv4->toString()]);
    });

    $this->map(['PUT', 'POST'], '/game/{id}', function (Request $request, Response $response, $args) {
        # Validate request content type is application/json
        $data = json_decode($request->getBody(), true);
        $this->gameService->save($args['id'], $data['playersAndCharacters'], $data['gameplay']);
        return $response->withJson(['success' => true]);
    });

    $this->get('/game/{id}', function (Request $request, Response $response, $args) {
        $contents = $this->gameService->get($args['id']);
        if (!empty($contents)) {
            return $response->withJson(array('success' => true, 'data' => $contents));
        }
    });

    $this->delete('/game/{id}', function (Request $request, Response $response, $args) {
        $this->gameService->remove($args['id']);
    });

    $this->get('/game/{id}/play/{char}', function (Request $request, Response $response, $args) {
        $id = $args['id'];
        $char = $args['char'];

        $game = $this->gameService->get($id);
        if (isset($game)) {

            $boards = array_values(json_decode($game->gameplay, true));
            $tttbot = new \Bots\TTTCompuBot(array_pop($boards), $char);

            return $response->withJson(['success' => true, 'place' => $tttbot->getPlay() + 1]);
        }

        return $response->withJson(['success' => false]);
    });
});
