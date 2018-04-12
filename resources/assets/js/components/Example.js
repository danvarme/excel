import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import axios from 'axios';
import { Table, 
         Checkbox, Button, Row, Col,
         ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap'

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

function TableRow(props){
    const row = props.row;
    const index = props.index;
    return(
    <tr key = { row }>
        <td><Checkbox onChange={() => props.handleMultipleSelect({index: index, object: row['object']}, e)}></Checkbox></td>
        <td> { row['object'].address_from.zipcode } </td>
        <td> { row['object'].address_to.street } </td>
        <td> { row['object'].address_to.zipcode } </td>
        <td> { row['object'].description } </td>
        <td> { row['object'].weight } </td>
        <td> { row['object'].length } </td>
        <td> { row['object'].height } </td>
        <td> { row['object'].width } </td>
        <td>
            <ButtonToolbar>
                <DropdownButton
                bsStyle="default"
                title={props.defaultValues[index] ? (
                        props.defaultValues[index].servicelevel
                      ) : (
                        props.selectedServiceLevel[index] ? (
                            props.selectedServiceLevel[index]
                            ): (
                                "Seleccionar"
                            )
                      )}
                noCaret
                id="dropdown-no-caret">
                { Object.keys(row['options']).map((service) => <MenuItem key = {service}
                eventKey = {service} onSelect={(e) => props.handleServiceLevel(index, e)}> 
                { service } </MenuItem>)}
                </DropdownButton>
            </ButtonToolbar>
        </td>
        <td>
            <ButtonToolbar>
                <DropdownButton
                bsStyle="default"
                title={props.defaultValues[index] ? (
                        props.defaultValues[index].provider
                      ) : (
                        props.selectedProvider[index] ? (
                            props.selectedProvider[index]
                            ): (
                                "Seleccionar"
                            )
                      )}
                noCaret
                id="dropdown-no-caret">
                { props.selectedServiceLevel[index] && 
                    (row['options'][props.selectedServiceLevel[index]]).map((value) =>
                    <MenuItem key = {value.provider} eventKey = {value.provider} 
                              onSelect={(e) => props.handleProvider({index: index, amount: value.amount}, e)}> 
                        { value.provider } 
                    </MenuItem>
                )}
                </DropdownButton>
            </ButtonToolbar>
        </td>
        <td>
           $ {props.defaultValues[index] ? ( props.defaultValues[index].amount ) : 
                ( props.selectedRate[index] ? ( props.selectedRate[index] ): 
                        ("0.0")
                )}
        </td>
    </tr>
    );
}

class Example extends Component {

    constructor(props) {
        super(props);

        //Variables
        this.state = {
            addressIdFrom: 0, 
            errors: {}, 
            success: [],
            selectedProvider: [],
            selectedRate: [],
            selectedServiceLevel: [],
            defaultValues: []
        };

        //Methods
        this.uploadFile = this.uploadFile.bind(this);
        this.getAddressTo = this.getAddressTo.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.getRate = this.getRate.bind(this);
        this.checkRates = this.checkRates.bind(this);
        this.joinRates = this.joinRates.bind(this);
        this.callCreateShipment = this.callCreateShipment.bind(this);
        this.getPrimaryAddressFrom = this.getPrimaryAddressFrom.bind(this);
        //Validate data
        this.validAddress = this.validAddress.bind(this);
        this.validShipment = this.validShipment.bind(this);
        this.handleProvider = this.handleProvider.bind(this);
        this.handleServiceLevel = this.handleServiceLevel.bind(this);
    }


    uploadFile(event){

        event.preventDefault();

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
            dataType: "json",
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(data){
                if(data.error){
                    self.state.errors[0] = [data.error];
                    self.setState(self.state);
                }else{
                    self.getPrimaryAddressFrom(data);
                    //self.fetchData(data);
                }
            },
            error: function (xhr, status, error) 
            {
                console.log(xhr);
                console.log(status);
                console.log(error);
            }
        });
        
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

        /*var testObject = [{ "object_purpose": "PURCHASE", "object_id": 118, "owner_id": 1, "address_from": { "object_type": "PURCHASE",
          "object_id": 57, "name": "Robert Leannon", "street": "64710 Leannon Cliff Apt. 140", "street2": "Port Joshuahview", "zipcode": "07800", 
          "email": "dev@mienvio.mx", "phone": "+0864219858661","bookmark": false, "alias": "", "owner_id": 1 },"address_to": {
          "object_type": "PURCHASE", "object_id": 58, "name": "Robert Leannon", "street": "64710 Leannon Cliff Apt. 140", "street2": "Port Joshuahview",
          "zipcode": "07800", "email": "dev@mienvio.mx", "phone": "+0864219858661", "bookmark": false,
          "alias": "", "owner_id": 1 }, "weight": 5, "height": 5, "length": 3.1, "width": 3.1,
          "description": "pruebaaakfsdjflkfasdfadfasdfsfasdfsdfsasjdfkajdklfajsdkfadsjk", "rate": { "object_id": 4, "amount": 130, "servicelevel": "estandar",
          "duration_terms": "2 a 5 días", "days": 5, "trackable": true, "collect_home": true,
          "provider": "Fedex", "provider_img": "media/providers/fedex.png"}, "label": null },
          { "object_purpose": "PURCHASE", "object_id": 32, "owner_id": 1, "address_from": { "object_type": "PURCHASE",
          "object_id": 57, "name": "12312 Leannon", "street": "64710 Leannon Cliff Apt. 140", "street2": "Port Joshuahview", "zipcode": "07800", 
          "email": "daniela@mienvio.mx", "phone": "+0864219858661","bookmark": false, "alias": "", "owner_id": 1 },"address_to": {
          "object_type": "PURCHASE", "object_id": 58, "name": "Robert Leannon", "street": "64710 Leannon Cliff Apt. 140", "street2": "Port Joshuahview",
          "zipcode": "07800", "email": "dev@mienvio.mx", "phone": "+0864219858661", "bookmark": false,
          "alias": "", "owner_id": 1 }, "weight": 3, "height": 44, "length": 32, "width": 31,
          "description": "pruebaaakfsdjflkfasdfadfasdfsfasdfsdfsasjdfkajdklfajsdkfadsjk", "rate": { "object_id": 4, "amount": 130, "servicelevel": "estandar",
          "duration_terms": "2 a 5 días", "days": 5, "trackable": true, "collect_home": true,
          "provider": "Fedex", "provider_img": "media/providers/fedex.png"}, "label": null }];

        var testRates = [{ "total_count": 3, "total_pages": 2,
          "current_page": 1, "next_page_url": "https://app.mienvio.mx/api/shipments/112/rates?page=2",
          "prev_page_url": null, "results": [{ "object_id": 4, "amount": 130, "servicelevel": "estandar",
          "duration_terms": "2 a 5 días", "days": 5, "trackable": true, "collect_home": true, "provider": "Fedex",
          "provider_img": "media/providers/fedex.png" }, { "object_id": 99,"amount": 150, "servicelevel": "express",
          "duration_terms": "1 a 2 días", "days": 2, "trackable": true, "collect_home": true, "provider": "Fedex", 
          "provider_img": "media/providers/fedex.png" }, { "object_id": 929,"amount": 120, "servicelevel": "express",
          "duration_terms": "1 a 2 días", "days": 2, "trackable": true, "collect_home": true, "provider": "Redpack", 
          "provider_img": "media/providers/redpack.png" }]},
          { "total_count": 3, "total_pages": 2,
          "current_page": 1, "next_page_url": "https://app.mienvio.mx/api/shipments/112/rates?page=2",
          "prev_page_url": null, "results": [{ "object_id": 4, "amount": 130, "servicelevel": "express",
          "duration_terms": "2 a 5 días", "days": 5, "trackable": true, "collect_home": true, "provider": "Estafeta",
          "provider_img": "media/providers/fedex.png" }, { "object_id": 99,"amount": 150, "servicelevel": "express",
          "duration_terms": "1 a 2 días", "days": 2, "trackable": true, "collect_home": true, "provider": "Fedex", 
          "provider_img": "media/providers/fedex.png" }, { "object_id": 929,"amount": 120, "servicelevel": "estandar",
          "duration_terms": "1 a 2 días", "days": 2, "trackable": true, "collect_home": true, "provider": "Estafeta", 
          "provider_img": "media/providers/redpack.png" }]}];*/

        //Iterate over each shipment 
        shipments.forEach(function(item, index){
            self.getAddressTo(item, index + 1);
            //self.joinRates(item, testObject[index], 1, testRates[index].results, index);
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
            errors.push("Telefono inválido. Debe tener 20 caracteres como máximo");
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
                    self.getRate(item, data.shipment, shipmentId, index);
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

    getRate(item, shipmentObject, shipmentId, index){

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
                //self.checkRates(item, shipmentId, data.results, index);
                self.joinRates(item, shipmentObject, shipmentId, data.results, index);
            },
            error: function (xhr, status, error) 
            {
                self.state.errors[0] = [error];
                self.setState(self.state);
            }
        });
    }

    joinRates(item, shipmentObject, shipmentId, rates, index){
        var serviceOptions = {};
        var selectedRate = null;
        rates.forEach(function(rate){
            if((rate.servicelevel).toLowerCase() == (item.service).toLowerCase() && (rate.provider).toLowerCase() == (item.provider).toLowerCase()){
                selectedRate = rate;
            } 
            if(rate.servicelevel in serviceOptions){
              serviceOptions[rate.servicelevel].push({provider: rate.provider, amount: rate.amount});
            }else{
              serviceOptions[rate.servicelevel] = [{provider: rate.provider, amount: rate.amount}];
            }
        });
        this.setState(prevState => ({
            success: [...prevState.success, {object: shipmentObject, options: serviceOptions, selectedRate: selectedRate}],
            defaultValues: [...prevState.defaultValues, selectedRate]
        }));
        console.log(this.state.success);
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

    handleServiceLevel(index, e) {
        let selectedServiceLevel = {...this.state.selectedServiceLevel};
        let selectedProvider = {...this.state.selectedProvider};
        let selectedRate = {...this.state.selectedRate};
        let defaultValues = {...this.state.defaultValues};
        selectedServiceLevel[index] = e;
        selectedProvider[index] = null;
        selectedRate[index] = null;
        defaultValues[index] = null;
        this.setState({
            selectedServiceLevel,
            selectedProvider,
            selectedRate,
            defaultValues
        });
    }

    handleProvider(values, e) {
        let selectedProvider = {...this.state.selectedProvider};
        let selectedRate = {...this.state.selectedRate};
        selectedProvider[values.index] = e;
        selectedRate[values.index] = values.amount;
        this.setState({
            selectedProvider,
            selectedRate
        });
    }

    handleMultipleSelect(values, e){
        let selectedElements = {...this.state.selectedElements};
        if (selectedElements[values.index]) selectedElements[values.index] = null;
        else selectedElements[values.index] = values.object;
        this.setState({
            selectedElements
        });
    }
    
    render() {
        return (
            <div className = "container" style={{marginTop: 20}}>
                <div className="row">
                    <Col xs={12} md={8}>
                      <h3>Subir CSV</h3>
                    </Col>
                    <Col xs={6} md={4}>
                        <button className="btn btn-primary pull-right">Siguiente</button>      
                    </Col>
                </div>
                
                <Row>
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th></th>
                      <th>CP Origen</th>
                      <th>Destino</th>
                      <th>CP</th>
                      <th>Contenido</th>
                      <th>Peso (kg)</th>
                      <th>Largo (cm)</th>
                      <th>Alto (cm)</th>
                      <th>Ancho (cm)</th>
                      <th>Servicio</th>
                      <th>Paquetería</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                  {(this.state.success).map((row, index) => 
                    <TableRow key = { index } index = { index } row = { row } selectedProvider = { this.state.selectedProvider} 
                       selectedServiceLevel = { this.state.selectedServiceLevel } defaultValues = { this.state.defaultValues }
                       selectedRate = { this.state.selectedRate } handleProvider = { this.handleProvider }
                       handleServiceLevel = { this.handleServiceLevel } handleMultipleSelect = { this.handleMultipleSelect }/>
                   )}
                  </tbody>
                </Table>
                </Row>

                <form id="center" ref="uploadForm" className="uploader" encType="multipart/form-data" >
                    <div className="form-group">
                        <input ref="file" type="file" name="file" className="upload-file"/>
                        <input type="hidden" value="{{ csrf_token() }}" name="_token"/>
                        <input type="button" ref="button" value="Upload" onClick={this.uploadFile.bind(this)} />
                    </div>
                </form> 
                <div id="tableShipment">
                </div>
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
