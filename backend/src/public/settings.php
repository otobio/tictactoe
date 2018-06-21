<?php

return [
    'addContentLengthHeader' => false, // Allow the web server to send the content-length header
    'cors' => getenv('CORS_ALLOWED_ORIGINS') !== null ? getenv('CORS_ALLOWED_ORIGINS') : '*',
];
