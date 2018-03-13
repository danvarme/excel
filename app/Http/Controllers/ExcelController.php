<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Excel;

class ExcelController extends Controller
{
    public function upload()
    {
    	return view('upload');
    }

    public function getInfo(Request $request)
    {
    	if ($request->hasFile('file')) {
    		
		    if($request->file('file')) {

		    	//Save file
		    	$file = $request->file('file');
		    	$path = $file->getClientOriginalExtension();

		    	if(strcmp($path, 'xlsx') == 0 || strcmp($path, 'xls') == 0){

			    	$file_name = $file->getClientOriginalName();
	    			$file->move('files', $file_name);

	    			

	    			//Get package properties
	    			$box = Excel::selectSheetsByIndex(1)->load('files/'.$file_name, function($reader){
			    		$reader->all();
			    	})->get();

			        $box_Arr = [];
			        if(!empty($box)){
			        	foreach ($box as $key => $value) {
			        		$box_Arr[$value->name] = array('weight' => $value->weight, 'length' => $value->length, 'height' => $value->height, 'width' => $value->width);
			        	}
			        }

			        //Get envios
			        $envios = Excel::selectSheetsByIndex(0)->load('files/'.$file_name, function($reader){
			    		$reader->all();
			    	})->get();

			        $type = TRUE;
			        $envios_arr = [];
			        if(!empty($envios)){
			        	foreach ($envios as $key => $value) {
			        		if(array_key_exists($value->package, $box_Arr)){
			        			$add_element = array('name' => $value->name, 'street' => $value->street, 'street2' => $value->street2, 'reference' => $value->reference, 'city' => $value->city, 'state' => $value->state, 'zipcode' => $value->zipcode, 'phone' => $value->phone, 'service' => $value->service, 'provider' => $value->provider, 'package' => $box_Arr[$value->package], 'description' => $value->description, 'email' => $value->email);
			        			array_push($envios_arr, $add_element);
			        		}
			        	}
			        }

			        return response(['envios' => json_encode($envios_arr)], 200);
			    }
			    return response(['result' => 'Wrong extension'], 200);
		    }
		}

		return response(['result' => 'No File'], 200);
	}

	

    public function ImportClients(Request $request)
    {
    	$file = request()->file('file');
    	$file_name = $file->getClientOriginalName();
    	$file->move('files', $file_name);

    	$path = $file->getRealPath();

    	// Get box properties
    	$box = Excel::selectSheetsByIndex(1)->load($path, function($reader){
    		$reader->all();
    	})->get();

    	$boxArr = [];
    	if(!empty($box)){
    		foreach($box as $key => $value){
    			$boxArr[$value->nombre] = array($value->peso, $value->largo, $value->alto, $value->ancho);
    		}
    	}

    	// Get shipment properties
		$results = Excel::selectSheetsByIndex(0)->load('files/'.$file_name, function($reader)
    	{
    		$reader->all();
    	})->get();

		/*$shipments = [];
    	if(!empty($results)){
    		foreach($results as $key => $value){
    			array_push($shipments, array($value->nombre, $value->direccion1, $value->direccion2, $value->referencia, $value->ciudad, $value ->estado, $value->cp,))
    		}
    	}*/
    	
    	return view('pedido', ['clients' => $results, 'box' => json_encode($boxArr)]);
    }
}
