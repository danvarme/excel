import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'

class Example extends Component {

    constructor(props) {
        super(props);

        //Variables
        this.state = {addressIdFrom: 0, errors: [], success: [], information: []};


        //Methods
        this.uploadFile = this.uploadFile.bind(this);
        this.getAddressTo = this.getAddressTo.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.getRate = this.getRate.bind(this);
        this.checkRates = this.checkRates.bind(this);
        this.callCreateShipment = this.callCreateShipment.bind(this);
        this.getFiscalAddressFrom = this.getFiscalAddressFrom.bind(this);

    }

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
            self.state.addressIdFrom = response.user.fiscal_address.object_id;
            console.log(self.state.addressIdFrom);
            self.fetchData(shipments);
        });

        //Handle errors
        xmlRequest.fail(function( response, textStatus ) {
            console.log(response);
            console.log(textStatus);
        });
    }

    getAddressTo(item){
        //Set all params for API call
        self = this;

        var address = {
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
            "data": JSON.stringify(address)
        });

        //Handle success
        xmlRequest.done(function (response) {
            var addressToId = response.address.object_id;
            self.callCreateShipment(item, addressToId);
        });

        //Handle errors
        xmlRequest.fail(function( response, textStatus ) {

            var params = response.responseJSON.error.params;

            for(var errorMessage in params){
                console.log(errorMessage + ': ' + params[errorMessage]);
            }

        });
    }

    callCreateShipment(item, addressToId){
        self = this;

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
            self.getRate(item, shipmentId);
        });

        //Handle errors
        xmlRequest.fail(function( response, textStatus ) {

            var params = response.responseJSON.error.params;

            for(var errorMessage in params){
                console.log(errorMessage + ': ' + params[errorMessage]);
            }

        });
    }

    getRate(item, shipmentId){
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
            self.checkRates(item, shipmentId, response.results);
        });

        //Handle errors
        xmlRequest.fail(function( response, textStatus ) {

            var params = response.responseJSON.error.params;

            for(var errorMessage in params){
                console.log(errorMessage + ': ' + params[errorMessage]);
            }

        });
    }

    checkRates(item, shipmentId, rates){
        self = this;
        var bool = 0;
        rates.forEach(function(price){
            if(((item.provider).trim()).toLowerCase() == ((price.provider).trim()).toLowerCase() 
                && ((item.service).trim()).toLowerCase() == ((price.servicelevel).trim()).toLowerCase()){
                self.updateShipment(item, shipmentId, price.object_id);
                bool = 1;
            }
        });
        if(bool == 0) console.log("Service not found");
    }

    updateShipment(item, shipmentId, rateId){

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
            self.state.success.push(shipmentId);
            self.setState(self.state);
            
            console.log(self.state.success);
            console.log(self.state.errors);
        });

        //Handle errors
        xmlRequest.fail(function( response, textStatus ) {

            var params = response.responseJSON.error.params;

            for(var errorMessage in params){
                console.log(errorMessage + ': ' + params[errorMessage]);
            }

        });
    }

    fetchData(shipments){
        var self = this;

        shipments.forEach(function(item){
            self.getAddressTo(item);
        });
    }

    uploadFile(event){
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
                    self.state.errors.push(data.error);
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
        const errorFound = this.state.errors.map((error, i) =>
            <li key={i}>{error}</li>
        );
        const successShipment = this.state.success.map((success, i) =>
            <li key={i}>{success}</li>
        );
        return (
            <div>
                <form ref="uploadForm" className="uploader" encType="multipart/form-data" >
                   <input ref="file" type="file" name="file" className="upload-file"/>
                   <input type="hidden" value="{{ csrf_token() }}" name="_token"/>
                   <input type="button" ref="button" value="Upload" onClick={this.uploadFile.bind(this)} />
                </form> 

                {this.state.errors.length > 0 &&
                    <div className="container">
                        <div className="alert alert-danger" role="alert" >
                            <ul>{errorFound}</ul>
                        </div>
                    </div>
                }
                


                {this.state.success.length > 0 &&<div className="container">
                    <div className="alert alert-success" role="alert" >
                        <ul>{successShipment}</ul>
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
