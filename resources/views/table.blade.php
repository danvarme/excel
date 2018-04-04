<!DOCTYPE html>
    <head>
        <meta charset="UTF-8" />
        <meta name="csrf-token" content="{{ csrf_token()}}" />
        <title>Laravel</title>
        <!-- Fonts -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css" integrity="sha384-XdYbMnZ/QjLh6iI4ogqCTaIjrFk87ip+ekIjefZch0Y+PvJ8CDYtEs1ipDmPorQ+" crossorigin="anonymous">
        <!-- Bootstrap -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:100,300,400,700">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    </head>
    <body>
        <section>
        <div class="container">
            <div class="alert alert-danger alert-dismissable">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                <p>Hubo algunos problemas:</p>
            </div>
        </div>
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
            		<th scope="col">Size</th>
            		<!--<th scope="col">Length</th>
            		<th scope="col">Height</th>-->
            		<th scope="col">Weight</th>
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
                        <td> {{ $envio['package']['width'].'x'.$envio['package']['length'].'x'.$envio['package']['height']}} </td>
                        <!--<td> @isset($envio['package']['length']) {{ $envio['package']['length'].'cm' }} @endisset </td>
                        <td> @isset($envio['package']['height']) {{ $envio['package']['height'].'cm' }} @endisset </td>-->
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
        </section>
        <!-- JavaScripts -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js" integrity="sha384-I6F5OKECLVtK/BL+8iSLDEHowSAfUo76ZL9+kGAgTRdiByINKJaqTPH/QVNS1VDb" crossorigin="anonymous"></script>
        <!-- Bootastrap -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
        <script type="text/javascript" src="/js/app.js"></script>
    </body>
</html>
