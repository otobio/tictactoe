<?php

require dirname(__DIR__) . '/vendor/autoload.php';
define('LAZER_DATA_PATH', dirname(dirname(__DIR__)) . '/data/'); //Path to folder with tables

// Use Composer autoload
require '../c/dao/GameDao.php';
require '../c/bots/TTTCompuBot.php';

use \Dao\GameDao as GameService;
use \Lazer\Classes\Database as Lazer;

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
