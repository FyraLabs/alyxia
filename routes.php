<?php

use App\Models\{Post,Setting};
use App\Settings\SettingManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Logto\Sdk\{LogtoClient,LogtoConfig};

$client = new LogtoClient(
    new LogtoConfig(
        endpoint: "https://auth.fyralabs.com",
        appId: "57lcee92bwg727ezooxdj",
        appSecret: env('LOGTO_APP_SECRET'),
    )
);

// TODO: Investigate setting the namespace globally
Route::group(['namespace' => 'App\Controllers'], function () use ($client) {
    Route::get('/', function () {
        $posts = DB::select('select * from posts');
        return view('index', ['posts' => $posts]);
    });
    Route::get('/posts/{id}', function (Request $request, int $id) {
        $post = Post::where('id', $id);
        if ($post->exists()) {
            return view('post', ['post' => $post->first()]);
        }
        return view('_errors/404');
    });

    Route::get('/cms', function () use ($client) {
        if (!$client->isAuthenticated()) {
            header('Location: /sign-in');
        }
        echo file_get_contents("views/cms.html");
    });

    Route::get('/sign-in', function () use ($client) {
        header("Location: {$client->signIn("https://{$_SERVER["HTTP_HOST"]}/callback")}");
    });

    Route::get('/callback', function () use ($client) {
        // required because Logto thinks it's a good idea to check for things like
        // PATH_INFO that may not even exist
        $_SERVER['PATH_INFO'] = '/callback';
        // Don't ask. Logto blows.
        $_SERVER['SERVER_NAME'] = $_SERVER['HTTP_HOST'];
        $client->handleSignInCallback();

        $user = $client->fetchUserInfo();
        error_log("PASS!");
        if ($user->sub === "igd4qm8vr5kc") {
            header('Location: /cms');
        } else {
            header('Location: /');
        }
    });

    Route::get('/api/posts', function () {
        $posts = Post::all()->toArray();
        echo json_encode([
            'posts' => $posts
        ]);
    });
    Route::patch('/api/posts/{id}', 'PostController@handlePost');

    Route::get('/api/settings', function () {
        return Setting::all();
    });
    Route::patch('/api/settings', function (Request $request) {
        $data = $request->all();
        array_walk($data, function ($value, $key) {
            SettingManager::set($key, json_encode($value));
        });
    });

    Route::get('/api/browse', function () {
        $dir = './' . str_replace('..', '', $_GET['dir']);
        if ($dir[strlen($dir) - 1] != '/') {
            $dir .= '/';
        }

        $find = '*.*';
        switch ($_GET['type']) {
            case 'markdown':
                $find = '*.md';
                break;
            case 'images':
                $find = '*.{png,gif,jpg,jpeg}';
                break;
        }

        $dirs = glob($dir . '*', GLOB_ONLYDIR);
        if ($dirs === false) $dirs = [];

        $files = glob($dir . $find, GLOB_BRACE);
        if ($files === false) $files = [];

        $fileRootLength = strlen('./');
        foreach ($files as $i => $f) {
            $files[$i] = substr($f, $fileRootLength);
        }
        foreach ($dirs as $i => $d) {
            $dirs[$i] = substr($d, $fileRootLength);
        }

        $parent = substr($_GET['dir'], 0, strrpos($_GET['dir'], '/'));
        echo json_encode([
            'parent' => (empty($_GET['dir']) ? false : $parent),
            'dirs' => $dirs,
            'files' => $files
        ]);
    });
});
