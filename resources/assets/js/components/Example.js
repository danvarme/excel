import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import axios from 'axios';

const emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const phoneRegex = /^[0-9:]{10}/g;

function ErrorElement(props){
    return(
     <dl>
        {props.index > 0 && 
            <dt>Errores de la fila #{props.index}</dt>
        }
        {props.errors.map((error, id) => 
            <dd key={id+error}>{error}</dd>
        )}
    </dl>
  );
}

class Example extends Component {

    constructor(props) {
        super(props);

        //Variables
        this.state = {addressIdFrom: 0, errors: {}, success: []};

        //Methods
        this.uploadFile = this.uploadFile.bind(this);
        this.getAddressTo = this.getAddressTo.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.getRate = this.getRate.bind(this);
        this.checkRates = this.checkRates.bind(this);
        this.callCreateShipment = this.callCreateShipment.bind(this);
        this.getPrimaryAddressFrom = this.getPrimaryAddressFrom.bind(this);
        //Validate data
        this.validAddress = this.validAddress.bind(this);
        this.validShipment = this.validShipment.bind(this);
    }


    uploadFile(event){
        //Set errors and success to empty. 
        this.state.errors = {};
        this.state.success = [];
        this.setState(this.state);

        var self = this;
        
        var fd = new FormData();    
        fd.append('file', $('input[type=file]')[0].files[0]);

        $.ajax({
            url: '/getInfo',
            headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: fd,
            dataType: 'json',
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(data){
                if(data.error){
                    self.state.errors[0] = [data.error];
                    self.setState(self.state);
                }else{
                    self.getPrimaryAddressFrom(data);
                }
            } 
        });
        event.preventDefault()
    }

    getPrimaryAddressFrom(shipments){

        var self = this;

        $.ajax({
            "async": true,
            "crossDomain": true,
            "method": 'GET',
            "url": 'https://app.mienvio.mx/api/addresses',
            "headers": {
                "Authorization": "Bearer epN1HWx0FVqCyN7wPEDofVLKg7X0WZ7FRqqAFidTvJdKfJIE4jmQ9JfuDr46"
            },
            //No es util ahorita, pero en otros lo será. 
            // complete: function (data)
            // {   
            //     // console.log("COMPLETE");
            //     // console.log(data);
            // },
            success: function (data) 
            {
                var found = false;
                //If no results were found
                if(data.results.length == 0){
                    self.state.errors[0] = ["No se encontro la dirección primaria"];
                    self.setState(self.state);
                }else{
                    var addresses = data.results;
                    addresses.forEach(function(address){
                        //Found primary address
                        if(address.object_type == "PRIMARY"){
                            found = true;
                            self.state.addressIdFrom = address.object_id;
                            self.setState(self.state);
                            //Call fetchData function and send shipment object
                            self.fetchData(shipments);
                        }
                    });
                }
                //If not primary address is found send error
                if(!found){
                    self.state.errors[0] = ["No se encontro la dirección primaria"];
                    self.setState(self.state);
                }

            },
            error: function (xhr, status, error) 
            {
                self.state.errors[0] = [error];
                self.setState(self.state);
                //Es todo el response 
                console.log(xhr);
                //Solo dice error
                console.log(status);
                //Da el error como tal
                console.log(error);
            }
        });
    }

    fetchData(shipments){
        var self = this;

        //Iterate over each shipment 
        shipments.forEach(function(item, index){
            self.getAddressTo(item, index+1);
        });
    }

    validAddress(item, index){
        var valid = true;
        var errors = [];
        if(!item.name || item.name.length > 80){
            valid = false;
            errors.push("Nombre inválido. Debe tener 80 caracteres como máximo");
        }
        if(!item.street || item.street.length > 35){
            valid = false;
            errors.push("Dirección inválida. Debe tener 35 caracteres como máximo");
        }
        if(!item.street2 || item.street2.length > 35){
            valid = false;
            errors.push("Dirección 2 inválida. Debe tener 35 caracteres como máximo");
        }
        if(!item.zipcode || item.zipcode.length > 5){
            valid = false;
            errors.push("Código postal inválido. Debe tener 5 caracteres como máximo");
        }
        if(item.reference && item.reference.length > 255){
            valid = false;
            errors.push("Referencia inválida. Debe tener 255 caracteres como máximo");
        }
        if(!item.email || item.email.length > 255 || !emailRegex.test(item.email)){
            valid = false;
            errors.push("Email inválido. Debe tener 35 caracteres como máximo");
        }
        if(!item.phone || item.phone.length > 20 || !phoneRegex.test(item.phone)){
            valid = false;
            errors.push("Telefono inválido. Debe tener 35 caracteres como máximo");
        }
        return [valid, {row: index, errorMessage: errors}];
    }

    getAddressTo(item, index){

        self = this;

        //Validate if address is valid 
        var valid = this.validAddress(item, index);

        if(valid[0])
        {
            var address = 
            {
                "object_type": "PURCHASE",
                "name": item.name,
                "street": item.street,
                "street2": item.street2,
                "reference": item.reference,
                "zipcode": item.zipcode,
                "email": item.email,
                "phone": item.phone
            };

            $.ajax({
                "async": true,
                "crossDomain": true,
                "method": 'POST',
                "url": 'https://app.mienvio.mx/api/addresses',
                "headers": {
                    "content-type": "application/json",
                    "authorization": "Bearer epN1HWx0FVqCyN7wPEDofVLKg7X0WZ7FRqqAFidTvJdKfJIE4jmQ9JfuDr46"
                },
                "processData": false,
                "data": JSON.stringify(address),
                success: function (data)
                {
                    var addressToId = data.address.object_id;
                    //Crear dirección para enviar 
                    self.callCreateShipment(item, addressToId, index);
                },
                error: function (xhr, status, error) 
                {
                    self.state.errors[0] = [error];
                    self.setState(self.state);
                }
            });
        }
        else
        {
            self.state.errors[valid[1].row] = valid[1].errorMessage;
            self.setState(self.state);
        }
    }

    validShipment(item, index){
        var valid = true;
        var errors = [];
        if(typeof(item.weight) != "number"){
            valid = false;
            errors.push("El peso del paquete es inválido");
        }
        if(typeof(item.length) != "number"){
            valid = false;
            errors.push("El largo del paquete es inválido");
        }
        if(typeof(item.height) != "number"){
            valid = false;
            errors.push("El alto del paquete es inválido");
        }
        if(typeof(item.width) != "number"){ 
            valid = false;
            errors.push("El ancho del paquete es inválido");
        }
        return [valid, {row: index, errorMessage: errors}];
    }

    callCreateShipment(item, addressToId, index){

        self = this;

        var valid = this.validShipment(item.package, index);

        if(valid[0])
        {
            var shipmentData = {
                "object_purpose" : "QUOTE",
                "address_from" : this.state.addressIdFrom,
                "address_to" : addressToId,
                "weight" : item.package.weight,
                "length" : item.package.length,
                "height" : item.package.height,
                "width" : item.package.width,
                "description" : item.description
            };

            $.ajax({
                "async": true,
                "crossDomain": true,
                "method": 'POST',
                "url": 'https://app.mienvio.mx/api/shipments',
                "headers": {
                    "content-type": "application/json",
                    "authorization": "Bearer epN1HWx0FVqCyN7wPEDofVLKg7X0WZ7FRqqAFidTvJdKfJIE4jmQ9JfuDr46"
                },
                "data": JSON.stringify(shipmentData),
                success: function (data)
                {
                    var shipmentId = data.shipment.object_id;
                    self.getRate(item, shipmentId, index);
                },
                error: function (xhr, status, error) 
                {
                    self.state.errors[0] = [error];
                    self.setState(self.state);
                }
            });
        }
        else
        {
            self.state.errors[valid[1].row] = valid[1].errorMessage;
            self.setState(self.state);
        }
    }

    getRate(item, shipmentId, index){

        self = this;

        $.ajax({
            "async": true,
            "crossDomain": true,
            "method": 'GET',
            "url": "https://app.mienvio.mx/api/shipments/"+ shipmentId +"/rates",
            "headers": {
                "content-type": "application/json",
                "authorization": "Bearer epN1HWx0FVqCyN7wPEDofVLKg7X0WZ7FRqqAFidTvJdKfJIE4jmQ9JfuDr46"
            },
            success: function (data)
            {
                self.checkRates(item, shipmentId, data.results, index);
            },
            error: function (xhr, status, error) 
            {
                self.state.errors[0] = [error];
                self.setState(self.state);
            }
        });
    }

    checkRates(item, shipmentId, rates, index){

        self = this;
        var bool = false;
        
        rates.forEach(function(price){
            if(((item.provider).trim()).toLowerCase() == ((price.provider).trim()).toLowerCase() 
                && ((item.service).trim()).toLowerCase() == ((price.servicelevel).trim()).toLowerCase()){
                self.updateShipment(item, shipmentId, price.object_id, index);
                bool = true;
            }
        });
        if(!bool){
            //¿¿¿¿BORRAR EL SHIPMENT???????
            self.state.errors[index] = ["No se encontro una tarifa que cumpla con la paquetería y tipo de sevicio seleccioando."];
            self.setState(self.state);
        }
    }

    updateShipment(item, shipmentId, rateId, index){

        self = this;

        var rateInformation = {
            "object_purpose" : "PURCHASE",
            "rate": 159
        };

        $.ajax({
            "async": true,
            "crossDomain": true,
            "method": 'PUT',
            "url": "https://app.mienvio.mx/api/shipments/" + shipmentId,
            "headers": {
                "content-type": "application/json",
                "authorization": "Bearer epN1HWx0FVqCyN7wPEDofVLKg7X0WZ7FRqqAFidTvJdKfJIE4jmQ9JfuDr46"
            },
            "processData": false,
            "data": JSON.stringify(rateInformation),
            success: function (data)
            {
                self.state.success.push(data);
                self.setState(self.state);
            },
            error: function (xhr, status, error) 
            {
                self.state.errors[0] = [error];
                self.setState(self.state);
            }
        });
    }

    
    render() {
        return (
            <div>
                <form id="center" ref="uploadForm" className="uploader" encType="multipart/form-data" >
                    <div className="form-group">
                        <input ref="file" type="file" name="file" className="upload-file"/>
                        <input type="hidden" value="{{ csrf_token() }}" name="_token"/>
                        <input type="button" ref="button" value="Upload" onClick={this.uploadFile.bind(this)} />
                    </div>
                </form> 
                {Object.keys(this.state.errors).length > 0 &&
                    <div className="container">
                        <div className="alert alert-danger" role="alert" >
                            {Object.keys(this.state.errors).map((row, value) => <ErrorElement 
                                key = {row} index = {row} errors = {this.state.errors[row]}/>)}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));

}
