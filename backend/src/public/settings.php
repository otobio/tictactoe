<?php

require dirname(__DIR__) . '/vendor/autoload.php';
define('LAZER_DATA_PATH', dirname(dirname(__DIR__)) . '/data/'); //Path to folder with tables

require '../classes/dao/gamedao.php';

use \Lazer\Classes\Database as Lazer;
use \Dao\GameDao as GameService;

return [
    'settings' => [
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header,
        'displayErrorDetails' => true,
        'cors' => '*',
        'displayErrorDetails' => true,
    ],
    'gameService' => function () {
        return new GameService(Lazer::table('games'));
    },
];
