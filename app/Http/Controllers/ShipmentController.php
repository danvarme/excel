<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ShipmentController extends Controller
{
    public function index(Request $request)
    {
    	return view('generarPedido');
	}
}
