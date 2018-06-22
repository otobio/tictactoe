<?php

$settings = require __DIR__ . '/settings.php';

$app = new \Slim\App($settings);

require __DIR__ . '/middlewares.php';
require __DIR__ . '/routes.php';

$app->run();
