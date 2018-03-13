import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import XLSX from 'xlsx';


export default class Example extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.callCreateAddressTo = this.callCreateAddressTo.bind(this);
        this.callObtainFiscalAddress = this.callObtainFiscalAddress.bind(this);
        this.callCreateShipment = this.callCreateShipment.bind(this);

    }

    handleSubmit(event) {
        event.preventDefault();
        var files = this.fileInput.files[0].name;
        var shipments = [{"name":"Jose Perez","street":"Av 5 de Febrero No. 2125","street2":"Colonia Jurica","reference":"Edificio verde","city":"Queretaro","state":"Queretaro","zipcode":76100,"phone":4422185000,"service":"estandar","provider":"dhl","package":{"weight":1,"length":12,"height":12,"width":12},"description":null,"email":"fervargas@gmail.com"}];
        this.fetchData(shipments);
        //TODO check if shipment is not empty ,then process it
    }

    callObtainFiscalAddress(){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://sandbox.mienvio.mx/api/profile",
            "method": "GET",
            "headers": {
            "authorization": "Bearer epN1HWx0FVqCyN7wPEDofVLKg7X0WZ7FRqqAFidTvJdKfJIE4jmQ9JfuDr46"
            }
        }

        $.ajax(settings).done(function (response) {
            console.log(response);
        });  
    }

    callCreateAddressTo(item){

        //Set all params for API call
        var direction = {
            "object_type": "PURCHASE",
            "name": item.name,
            "street": item.street,
            "street2": item.street2,
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
            "data": JSON.stringify(direction)
        });

        //Handle success
        xmlRequest.done(function (response) {
            var directionID = response.address.object_id;
        });

        //Handle errors
        xmlRequest.fail(function( response, textStatus ) {

            var params = response.responseJSON.error.params;

            for(var errorMessage in params){
                console.log(errorMessage + ': ' + params[errorMessage]);
            }

        });
    }

    callCreateShipment(item){
        console.log(item);
        var data = {
            "object_purpose" : "PURCHASE",
            "address_from" : 5,
            "address_to" : 10,
            "weight" : item.package.weight,
            "length" : item.package.length,
            "height" : item.package.height,
            "width" : item.package.width,
            "description" : item.description,
            "rate" : 0
        };

        /*var xmlRequest = $.ajax({
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
            console.log(response);
        });

        //Handle errors
        xmlRequest.fail(function( response, textStatus ) {

            var params = response.responseJSON.error.params;

            for(var errorMessage in params){
                console.log(errorMessage + ': ' + params[errorMessage]);
            }

        });*/
    }

    fetchData(shipments){
        var self = this;

        /*var addressFromId = */
        shipments.forEach(function(item){
            self.callObtainFiscalAddress(item);
        });
    }

    

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="hidden" value="{{ csrf_token() }}" name="_token"/>
                <input type="file" ref={input => { this.fileInput = input;}}/>
                <br />
                <button type="submit">Submit</button>
            </form>
        );
    }
}

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
