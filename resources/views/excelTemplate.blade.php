<!doctype html>

<html lang="{{ app()->getLocale() }}">

    <body>

        <div>
            <div class="content">
                <div class="col-md-12">
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
                                     <td>@if(isset($guia['address_from']['zipcode'])) 
                                            {{ $guia['address_from']['zipcode'] }}
                                        @endif 
                                    </td>
                                    <td>@if(isset($guia['address_to']['city'])) 
                                            {{ $guia['address_to']['city'] }}
                                        @endif 
                                    </td>
                                    <td>@if(isset($guia['address_to']['zipcode'])) 
                                            {{ $guia['address_to']['zipcode'] }}
                                        @endif
                                    </td>
                                    <td>
                                        @if(isset($guia['description']))
                                            {{ $guia['description'] }}
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
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Total </td>
                                    <td>{{ $amount }}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>No. de guías</td>
                                    <td>{{ $size }}</td>
                                </tr>
                            </tbody>
                        </table>
                </div>
            </div>
        </div>
    </body>
</html>
