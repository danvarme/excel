import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'


const emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const phoneRegex = /^[0-9:]{10}/g;

function SuccessElement(props){
    return(
        <dl>
            <dt>{props.message}</dt>
        </dl>
    );
}


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

    //First step
    getPrimaryAddressFrom(shipments){

        self = this;

        var xmlRequest = $.ajax({
            "async": true,
            "crossDomain": true,
            "url": "https://app.mienvio.mx/api/addresses",
            "method": "GET",
            "headers": {
                "authorization": "Bearer epN1HWx0FVqCyN7wPEDofVLKg7X0WZ7FRqqAFidTvJdKfJIE4jmQ9JfuDr46"
            }
        });

        xmlRequest.done(function (response) {
            //Set addressIdFrom as global
            var found = false;
            if(response.results.length == 0){
                self.state.errors[0] = ["No se encontro la dirección primaria"];
                self.setState(self.state);
            }else{
                var addresses = response.results;
                addresses.forEach(function(address){
                    //Found primary address
                    if(address.object_type == "PRIMARY"){
                        found = true;
                        self.state.addressIdFrom = address.object_id;
                        //Call fetchData function and send shipment object
                        self.fetchData(shipments);
                    }
                });
            }

            //If primary address does not exist
            if(!found){
                self.state.errors[0] = ["No se encontro la dirección primaria"];
                self.setState(self.state);
            }
        });

        //Handle errors
        xmlRequest.fail(function( response, textStatus ) {
            self.state.errors[0] = ["Ocurrió un error. Intentar nuevamente"];
            self.setState(self.state);
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
        //Set all params for API call
        self = this;
        var valid = this.validAddress(item, index);
        if(valid[0]){
            var address = {
                "object_type": "PURCHASE",
                "name": item.name,
                "street": item.street,
                "street2": item.street2,
                "reference": item.reference,
                "zipcode": item.zipcode,
                "email": item.email,
                "phone": item.phone
            };

            //API call
            var xmlRequest = $.ajax({
                "async": true,
                "crossDomain": true,
                "url": "https://app.mienvio.mx/api/addresses",
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "authorization": "Bearer epN1HWx0FVqCyN7wPEDofVLKg7X0WZ7FRqqAFidTvJdKfJIE4jmQ9JfuDr46"
                },
                "processData": false,
                "data": JSON.stringify(address)
            });

            //Handle success
            xmlRequest.done(function (response) {
                var addressToId = response.address.object_id;
                //Obtuvo la dirección a enviar
                return self.callCreateShipment(item, addressToId, index);
            });

            //Handle errors
            xmlRequest.fail(function( response, textStatus ) {
                //var params = response.responseJSON.error.params;
                if(response.responseJSON){
                    self.state.errors[valid[1].row] = [response.responseJSON.error.message];
                }else{
                    self.state.errors[valid[1].row] = ["Unauthorized access"];
                }
                self.setState(self.state);
                return false;

            });
        }else{
            self.state.errors[valid[1].row] = valid[1].errorMessage;
            self.setState(self.state);
            return false;
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
        if(valid[0]){
            var data = {
                "object_purpose" : "QUOTE",
                "address_from" : this.state.addressIdFrom,
                "address_to" : addressToId,
                "weight" : item.package.weight,
                "length" : item.package.length,
                "height" : item.package.height,
                "width" : item.package.width,
                "description" : item.description
            };

            var xmlRequest = $.ajax({
                "async": true,
                "crossDomain": true,
                "url": "https://app.mienvio.mx/api/shipments",
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "authorization": "Bearer epN1HWx0FVqCyN7wPEDofVLKg7X0WZ7FRqqAFidTvJdKfJIE4jmQ9JfuDr46"
                },
                "data": JSON.stringify(data)
            });

            //Handle success
            xmlRequest.done(function (response) {
                var shipmentId = response.shipment.object_id;
                return self.getRate(item, shipmentId, index);
            });

            //Handle errors
            xmlRequest.fail(function( response, textStatus ) {
                if(response.responseJSON){
                    self.state.errors[valid[1].row] = [response.responseJSON.error.message];
                }else{
                    self.state.errors[valid[1].row] = ["Unauthorized access"];
                }
                self.setState(self.state);
                return false;

            });
        }else{
            self.state.errors[valid[1].row] = valid[1].errorMessage;
            self.setState(self.state);
            return false;
        }
    }

    getRate(item, shipmentId, index){
        self = this;

        var xmlRequest = $.ajax({
            "async": true,
            "crossDomain": true,
            "url": "https://app.mienvio.mx/api/shipments/"+ shipmentId +"/rates",
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "authorization": "Bearer epN1HWx0FVqCyN7wPEDofVLKg7X0WZ7FRqqAFidTvJdKfJIE4jmQ9JfuDr46"
            }
        });

        //Handle success
        xmlRequest.done(function (response) {
            return self.checkRates(item, shipmentId, response.results, index);
        });

        //Handle errors
        xmlRequest.fail(function( response, textStatus ) {
            if(response.responseJSON){
                self.state.errors[index] = [response.responseJSON.error.message];
            }else{
                self.state.errors[index] = ["Unauthorized access"];
            }
            self.setState(self.state);
            return false;
        });
    }

    checkRates(item, shipmentId, rates, index){
        self = this;
        var bool = 0;
        rates.forEach(function(price){
            if(((item.provider).trim()).toLowerCase() == ((price.provider).trim()).toLowerCase() 
                && ((item.service).trim()).toLowerCase() == ((price.servicelevel).trim()).toLowerCase()){
                bool = 1;
                return self.updateShipment(item, shipmentId, price.object_id, index);
            }
        });
        if(bool == 0){
            //¿¿¿¿BORRAR EL SHIPMENT???????
            self.state.errors[index] = ["No se encontro una tarifa que cumpla con la paquetería y tipo de sevicio seleccioando."];
            self.setState(self.state);
            return false;
        }
    }

    updateShipment(item, shipmentId, rateId, index){
        self = this;

        var data = {
            "object_purpose" : "PURCHASE",
            "rate": 159
        };

        var xmlRequest = $.ajax({
            "async": true,
            "crossDomain": true,
            "url": "https://app.mienvio.mx/api/shipments/" + shipmentId,
            "method": "PUT",
            "headers": {
                "content-type": "application/json",
                "authorization": "Bearer epN1HWx0FVqCyN7wPEDofVLKg7X0WZ7FRqqAFidTvJdKfJIE4jmQ9JfuDr46"
            },
            "processData": false,
            "data": JSON.stringify(data)
        });

        //Handle success
        xmlRequest.done(function (response) {
            self.state.success.push("La fila no. " + index + " se registro exitosamente");
            self.setState(self.state);
            return true;
            console.log(self.state.success);
            console.log(self.state.errors);
            console.log("Row " + index + " " + response);
        });

        //Handle errors
        xmlRequest.fail(function( response, textStatus ) {

            if(response.responseJSON){
                self.state.errors[index] = [response.responseJSON.error.message];
            }else{
                self.state.errors[index] = ["Unauthorized access"];
            }
            self.setState(self.state);
            return false;
        });
    }

    fetchData(shipments){
        var self = this;
        //Iterate over each shipment 
        shipments.forEach(function(item, index){
            if(!self.getAddressTo(item, index+1)){
                shipments.splice(index, 1);
            }
        });
        console.log(shipments);
    }

    uploadFile(event){
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
                    //Set as global Fiscal Address From id.
                    self.getPrimaryAddressFrom(data);
                }
            } 
        });
        event.preventDefault()
    }
    

    render() {
        return (
            <div>
                <form action="getInfo" method="post" id="center" encType="multipart/form-data" >
                    <label>Upload file: </label>
                    <input type="file" name="file" />
                    <input type="hidden" value="{{ csrf_token() }}" name="_token" />
                    <input type="submit" value="Upload" /> 
                </form> 
                {Object.keys(this.state.errors).length > 0 &&
                    <div className="container">
                        <div className="alert alert-danger" role="alert" >
                            {Object.keys(this.state.errors).map((row, value) => <ErrorElement 
                                key = {row} index = {row} errors = {this.state.errors[row]}/>)}
                        </div>
                    </div>
                }
                {this.state.success.length > 0 &&
                    <div className="container">
                        <div className="alert alert-success" role="alert" >
                            {this.state.success.map((success, i) => <SuccessElement key = {i} 
                                message = {success} />)}
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
