<!doctype html>

<html lang="{{ app()->getLocale() }}">

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel</title>

        <!-- Fonts -->
        <!--<link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">-->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css" integrity="sha384-XdYbMnZ/QjLh6iI4ogqCTaIjrFk87ip+ekIjefZch0Y+PvJ8CDYtEs1ipDmPorQ+" crossorigin="anonymous">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:100,300,400,700">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <link rel="stylesheet" type="text/css" href="/css/app.css">
    </head>

    <body>

        <div>
            <div class="content">
                <div class="col-md-12">
                    <h2>Guías Generadas</h2>
                        <table id="tablaEnvios" class="tabla-sortable">
                            <thead>
                                <tr>
                                    <th>No.guía</th>
                                    <th>Destino</th>
                                    <th>CP</th>
                                    <th>Contenido</th>
                                    <th>Peso(kg)</th>
                                    <th>Largo(cm)</th>
                                    <th>Alto(cm)</th>
                                    <th>Ancho(cm)</th>
                                    <th>Servicio</th>
                                    <th>Paquetería</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($data as $guia)
                                <tr>
                                    <td class="text-center">1234</td>
                                    <td class="text-center">{{ $guia['city'] }}</td>
                                    <td class="text-center">{{ $guia['zipcode'] }}</td>
                                    <td>
                                        @if(isset($guia['description']))
                                            {{ $guia['description'] }}
                                        @else
                                            -
                                        @endif
                                    </td>
                                    <td>{{ $guia['package']['weight'] }}</td>
                                    <td>{{ $guia['package']['length'] }}</td>
                                    <td>{{ $guia['package']['height'] }}</td>
                                    <td>{{ $guia['package']['width'] }}</td>
                                    <td class="text-center">{{ $guia['service'] }}</td>
                                    <td class="text-center">{{ $guia['provider'] }}</td>
                                    <td class="text-center">$1234</td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
            </div>
        </div>

        <script type="text/javascript" src="/js/app.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js" integrity="sha384-I6F5OKECLVtK/BL+8iSLDEHowSAfUo76ZL9+kGAgTRdiByINKJaqTPH/QVNS1VDb" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
    </body>
</html>
