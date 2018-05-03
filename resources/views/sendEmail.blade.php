<!doctype html>

<html lang="{{ app()->getLocale() }}">

    <head>

        <style>
            th, td{
                border: 1px solid black;
                padding: 10px;
                color: black;
            }
            .moveRight{
                padding-left: 65%;
                padding-top: 1px;
                color: black;
            }
        </style>
    </head>

    <body>

        <div>
            <div class="content">
                <div class="col-md-12">
                    <h2>Guías generadas</h2>
                        <table id="tablaEnvios">
                            <thead>
                                <tr>
                                    <th>No.guía</th>
                                    <th>Origen</th>
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
                                @foreach ($shipments as $guia)
                                <tr>
                                    <td>{{ $guia['label']['tracking_number'] }}</td>
                                    <td>{{ $guia['address_from']['zipcode'] }}</td>
                                    <td>{{ $guia['address_to']['city'] }}</td>
                                    <td>{{ $guia['address_to']['zipcode'] }}</td>
                                    <td>
                                        @if(isset($guia['description']))
                                            {{ $guia['description'] }}
                                        @else
                                            -
                                        @endif
                                    </td>
                                    <td>{{ $guia['weight'] }}</td>
                                    <td>{{ $guia['length'] }}</td>
                                    <td>{{ $guia['height'] }}</td>
                                    <td>{{ $guia['width'] }}</td>
                                    <td>{{ $guia['rate']['servicelevel'] }}</td>
                                    <td>{{ $guia['rate']['provider'] }}</td>
                                    <td>{{ number_format($guia['rate']['amount'], 2) }}</td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>

                        <div class="row">
                            <div class="moveRight" >
                                <div class="row">
                                    <div class="col col-md-4 col-md-offset-3 text-right">
                                        <h3> Total  $ {{ $amount }} </h3>
                                    </div>
                              </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="moveRight">
                                <div class="row">
                                    <div class="col col-md-4 col-md-offset-3 text-right">
                                        <h3> No. de guías  {{ $size }}</h3>
                                    </div>
                              </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </body>
</html>
