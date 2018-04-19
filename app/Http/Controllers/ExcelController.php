<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Excel;

class ExcelController extends Controller
{
	

    public function getInfo(Request $request)
    {
    	if ($request->hasFile('file')) {
    		
		    if($request->file('file')) {

		    	//Save file
		    	$file = $request->file('file');
		    	$path = $file->getClientOriginalExtension();

		    	if(strcmp($path, 'xlsx') == 0 || strcmp($path, 'xls') == 0){

			    	$file_name = $file->getClientOriginalName();
			    	$only_file_name = pathinfo($file_name, PATHINFO_FILENAME);
			    	$uniqueID = uniqid();
			    	$fullname = $only_file_name.$uniqueID.'.'.$path;
	    			$file->move('files', $fullname);

	    			//Get package properties
	    			$box = Excel::selectSheetsByIndex(1)->load('files/'.$fullname, function($reader){
			    		$reader->all();
			    	})->get();

			        $box_Arr = [];
			        if(!empty($box)){
			        	foreach ($box as $key => $value) {
			        		$box_Arr[$value->name] = array('weight' => $value->weight, 'length' => $value->length, 'height' => $value->height, 'width' => $value->width);
			        	}
			        }

			        //Get envios
			        $envios = Excel::selectSheetsByIndex(0)->load('files/'.$fullname, function($reader){
			    		$reader->all();
			    	})->get();

			        $type = TRUE;
			        $envios_arr = [];
			        if(!empty($envios)){
			        	foreach ($envios as $key => $value) {
			        		if(array_key_exists($value->package, $box_Arr)){
			        			$add_element = ['name' => $value->name, 'street' => $value->street, 'street2' => $value->street2, 'reference' => $value->reference, 'city' => $value->city, 'state' => $value->state, 'zipcode' => $value->zipcode, 'phone' => $value->phone, 'service' => $value->service, 'provider' => $value->provider, 'package' => $box_Arr[$value->package], 'description' => $value->description, 'email' => $value->email];
			        			array_push($envios_arr, $add_element);
			        		}
			        	}
			        }
			        $path = 'files/'.$fullname;
			        unlink($path); 
			        return json_encode($envios_arr);
			    }
			    return json_encode(['error' => "Archivo inválido."]);
		    }
		}

	    return json_encode(['error' => "Archivo requerido. Favor de adjunta archivo."]);

	}

	public function showTable(Request $request)
    {
    	$success = $request->get('success');
    	$errors = $request->get('errors');
    	$request->session()->put('key', 'value');
    	return redirect('/shipments');
    	//return view('table', ['envios' => $success, 'errors' => $errors])->render();
    }
}
