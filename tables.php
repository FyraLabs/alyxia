<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

/** @var Builder $Schema */

if (!$Schema->hasTable('posts')) {
    $Schema->create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->string('content');
        $table->timestamps();
    });
}