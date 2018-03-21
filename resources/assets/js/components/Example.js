import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'

function SuccessElement(props){
    return(
        <dl>
            <dt>{props.success}</dt>
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
        this.getFiscalAddressFrom = this.getFiscalAddressFrom.bind(this);
        //Validate data
        this.validAddress = this.validAddress.bind(this);
        this.validShipment = this.validShipment.bind(this);
    }

    //First step
    getFiscalAddressFrom(shipments){

        self = this;

        var xmlRequest = $.ajax({
            "async": true,
            "crossDomain": true,
            "url": "https://sandbox.mienvio.mx/api/profile",
            "method": "GET",
            "headers": {
                "authorization": "Bearer epN1HWx0FVqCyN7wPEDofVLKg7X0WZ7FRqqAFidTvJdKfJIE4jmQ9JfuDr46"
            }
        });

        xmlRequest.done(function (response) {
            //Set addressIdFrom as global
            self.state.addressIdFrom = response.user.fiscal_address.object_id;
            //Call fetchData function and send shipment object
            self.fetchData(shipments);
        });

        //Handle errors
        xmlRequest.fail(function( response, textStatus ) {
            self.state.errors[0] = {errorMessage: ["No se encontro la dirección fiscal"]};
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
        var emailRegex = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
        if(!item.email || item.email.length > 255 || !emailRegex.test(item.email)){
            valid = false;
            errors.push("Email inválido. Debe tener 35 caracteres como máximo");
        }
        if(!item.phone || item.phone.length > 20){
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
                "url": "https://sandbox.mienvio.mx/api/addresses",
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
                self.callCreateShipment(item, addressToId, index);
            });

            //Handle errors
            xmlRequest.fail(function( response, textStatus ) {

                //var params = response.responseJSON.error.params;

                self.state.errors[valid[1].row] = response.responseJSON.error.params;
                self.setState(self.state);

            });
        }else{
            self.state.errors[valid[1].row] = valid[1].errorMessage;
            self.setState(self.state);
        }
    }


    validShipment(item, index){
        var valid = true;
        var errors = [];
        if(!/\D/.test(item.weight)){
            valid = false;
            errors.push("El peso del paquete es inválido");
        }
        if(!/\D/.test(item.length)){
            valid = false;
            errors.push("El largo del paquete es inválido");
        }
        if(!/\D/.test(item.height)){
            valid = false;
            errors.push("El alto del paquete es inválido");
        }
        if(!/\D/.test(item.width)){
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
                "url": "https://sandbox.mienvio.mx/api/shipments",
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
                self.getRate(item, shipmentId, index);
            });

            //Handle errors
            xmlRequest.fail(function( response, textStatus ) {

                //var params = response.responseJSON.error.params;

                self.state.errors[valid[1].row] = response.responseJSON.error.params;
                self.setState(self.state);

            });
        }else{
            self.state.errors[valid[1].row] = valid[1].errorMessage;
            self.setState(self.state);
        }
    }

    getRate(item, shipmentId, index){
        self = this;

        var xmlRequest = $.ajax({
            "async": true,
            "crossDomain": true,
            "url": "https://sandbox.mienvio.mx/api/shipments/"+ shipmentId +"/rates",
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "authorization": "Bearer epN1HWx0FVqCyN7wPEDofVLKg7X0WZ7FRqqAFidTvJdKfJIE4jmQ9JfuDr46"
            }
        });

        //Handle success
        xmlRequest.done(function (response) {
            self.checkRates(item, shipmentId, response.results, index);
        });

        //Handle errors
        xmlRequest.fail(function( response, textStatus ) {

            //var params = response.responseJSON.error.params;

            self.state.errors[valid[1].row] = response.responseJSON.error.params;
            self.setState(self.state);

        });
    }

    checkRates(item, shipmentId, rates, index){
        self = this;
        var bool = 0;
        rates.forEach(function(price){
            if(((item.provider).trim()).toLowerCase() == ((price.provider).trim()).toLowerCase() 
                && ((item.service).trim()).toLowerCase() == ((price.servicelevel).trim()).toLowerCase()){
                self.updateShipment(item, shipmentId, price.object_id, index);
                bool = 1;
            }
        });
        if(bool == 0){
            //¿¿¿¿BORRAR EL SHIPMENT???????
            self.state.errors[index] = ["No se encontro una tarifa que cumpla con la paquetería y tipo de sevicio seleccioando."];
            self.setState(self.state);
        }
    }

    updateShipment(item, shipmentId, rateId, index){
        self = this;

        var data = {
            "object_purpose" : "PURCHASE",
            "rate": rateId
        };

        var xmlRequest = $.ajax({
            "async": true,
            "crossDomain": true,
            "url": "https://sandbox.mienvio.mx/api/shipments/" + shipmentId,
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
            
            console.log(self.state.success);
            console.log(self.state.errors);
            console.log("Row " + index + " " + response);
        });

        //Handle errors
        xmlRequest.fail(function( response, textStatus ) {

            //var params = response.responseJSON.error.params;
            self.state.errors[index] = response.responseJSON.error.params;
            self.setState(self.state);
        });
    }

    fetchData(shipments){
        var self = this;
        //Iterate over each shipment 
        shipments.forEach(function(item, index){
            self.getAddressTo(item, index+1);
        });
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
                    self.getFiscalAddressFrom(data);
                }
            } 
        });
        event.preventDefault()
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
