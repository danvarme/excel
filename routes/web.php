<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::post('/getInfo', 'ExcelController@getInfo');
Route::post('/exportExcel', 'ExcelController@exportExcel');
Route::post('/sendEmail', 'ExcelController@sendEmail');

// Route::get('/showTable', function(){
// 	return '<div></div>';
// });

Route::get('/shipments', 'TableController@table');
