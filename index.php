<?php
require __DIR__ . "/vendor/autoload.php";

use App\Application;
use App\Models\Post;
use Dotenv\Dotenv;
use Illuminate\Database\Connectors\ConnectionFactory;
use Illuminate\Database\DatabaseManager;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\DB;

// Load the config file, note that if no environment variables OR .env file is
// present, the database connection will fail.
(Dotenv::createImmutable(__DIR__))->safeLoad();

// Initial variables we're working with
$app = new Application(__DIR__);
$request = Request::capture();

// Some useful bindings (move to Application#__construct?)
$app->instance('Illuminate\Http\Request', $request);
$app->singleton('Illuminate\Routing\Contracts\CallableDispatcher', function () use ($app) {
    return new Illuminate\Routing\CallableDispatcher($app);
});
$app->singleton('db.factory', function ($app) {
    return new ConnectionFactory($app);
});
$app->singleton('db', function ($app) {
    return new DatabaseManager($app, $app['db.factory']);
});

$Schema = DB::getSchemaBuilder();
require_once 'tables.php';

// This works!
// var_dump(DB::select('select * from posts'));
// var_dump(Post::all());

// Router stuff
// TODO: MOVE TO Application OR A BOOTSTRAPPER SO WE CAN USE THE FACADE!
$router = new Router($app['dispatcher'], $app);
require_once 'routes.php';
$response = $router->dispatch($request);
$response->send();
