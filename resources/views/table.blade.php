<section>
@isset ($errors)
<div class="container">
    <div class="alert alert-danger alert-dismissable">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        <p>Hubo algunos problemas:</p>
        <dl>
        @foreach($errors as $row => $error)
            <dt>Error en la fila {{ $row }}</dt>
            @foreach($error as $er)
                <dd> {{ $er }} </dd>
            @endforeach
        @endforeach
        </dl>
    </div>
</div>
@endisset 

@if ($message = Session::get('key'))
<div class="alert alert-success alert-dismissable margin5">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    <strong>Success:</strong> {{ $message }}
</div>
@endif

@isset ($envios)
<div class="container">
<div class="table-responsive">
    <table class="table table-bordered table-sm">
        <thead class="thead-light">
    	<tr>
    		<th scope="col">Name</th>
    		<th scope="col">Street</th>
    		<th scope="col">Street 2</th>
    		<th scope="col">Reference</th>
    		<th scope="col">City</th>
    		<th scope="col">State</th>
    		<th scope="col">ZipCode</th>
    		<th scope="col">Phone</th>
            <th scope="col">Provider</th>
    		<th scope="col">Service</th>
            <th scope="col">Rate</th>
    		<th scope="col">Width (cm)</th>
    		<th scope="col">Length (cm)</th>
    		<th scope="col">Height (cm)</th>
    		<th scope="col">Weight (kg)</th>
    		<th scope="col">Description</th>
    		<th scope="col">Email</th>
    	</tr>
        </thead>
        <tbody>
        @foreach($envios as $envio)
            <tr>
                <td> @isset($envio['name']) {{ $envio['name'] }} @endisset </td>
                <td> @isset($envio['street']) {{ $envio['street'] }} @endisset </td>
                <td> @isset($envio['street2']) {{ $envio['street2'] }} @endisset </td>
                <!-- Optional -->
                <td> @isset($envio['reference']) {{ $envio['reference'] }} @endisset</td>
                <td> @isset($envio['city']) {{ $envio['city'] }} @endisset </td>
                <td> @isset($envio['state']) {{ $envio['state'] }} @endisset </td>
                <td> @isset($envio['zipcode']) {{ $envio['zipcode'] }} @endisset </td>
                <td> @isset($envio['phone']) {{ $envio['phone'] }} @endisset </td>
                <td> @isset($envio['provider']) {{ $envio['provider'] }} @endisset </td>
                <td> @isset($envio['service']) {{ $envio['service'] }} @endisset</td>
                <td> Tarifa </td>
                <td> @isset($envio['package']['width']) {{ $envio['package']['width'].'cm' }} @endisset </td>
                <td> @isset($envio['package']['length']) {{ $envio['package']['length'].'cm' }} @endisset </td>
                <td> @isset($envio['package']['height']) {{ $envio['package']['height'].'cm' }} @endisset </td>
                <td> @isset($envio['package']['weight']) {{ $envio['package']['weight'].'kg' }} @endisset </td>
                <!-- Optional -->
                <td> @isset($envio['description']) {{ $envio['description'] }} @endisset </td>
                <td> @isset($envio['email']) {{ $envio['email'] }} @endisset</td>
            </tr>
        @endforeach
        </tbody>
    </table>
</div>
</div>
@endisset 

</section>
