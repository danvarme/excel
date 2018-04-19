import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import axios from 'axios';
import { Table, 
         Checkbox, Button, Row, Col,
         ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap'
import OptionModal from './OptionModal'
import TableRow from './TableRow'
import { Route, Router } from 'react-router-dom'
import { Redirect } from 'react-router'
import { validAddress, validShipment} from '../validators.js'

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

export default class Example extends Component {

    constructor(props) {
        super(props);

        //Variables
        this.state = {
            errors: {}, 
            success: [],
            selectedProvider: [],
            selectedRate: [],
            selectedServiceLevel: [],
            defaultValues: [],
            allServices: {},
            selectedElements: {},
            generalServiceLevel: '',
            generalProvider: '',
            modalOpen: false,
            redirect: false,
            subTotal: {}
        };


        //Methods
        this.getAddressTo = this.getAddressTo.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.getRate = this.getRate.bind(this);
        this.joinRates = this.joinRates.bind(this);
        this.callCreateShipment = this.callCreateShipment.bind(this);
        this.handleProvider = this.handleProvider.bind(this);
        this.handleServiceLevel = this.handleServiceLevel.bind(this);
        this.handleMultipleSelect = this.handleMultipleSelect.bind(this);
        this.handleGeneralServiceLevel = this.handleGeneralServiceLevel.bind(this);
        this.handleGeneralProvider = this.handleGeneralProvider.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        
    }

    componentDidMount() {
        //console.log(this.props.location.state.newAddressId);
        //console.log(this.props.location.state.token);
        this.fetchData(this.props.location.state.data);
        //this.getPrimaryAddressFrom(this.props.location.state.data);
    }


    fetchData(shipments){
        let self = this;

        //Iterate over each shipment 
        shipments.forEach(function(item, index){
            self.getAddressTo(item, index + 1);
            //self.joinRates(item, testObject[index], 1, testRates[index].results, index);
        });
    }
    
    getAddressTo(item, index){

        let self = this;

        //Validate if address is valid 
        var valid = validAddress(item, index);

        if(valid[0]){
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
                    "authorization": "Bearer " + this.props.location.state.token
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

    
    callCreateShipment(item, addressToId, index){

        let self = this;

        var valid = validShipment(item.package, index);

        if(valid[0])
        {
            var shipmentData = {
                "object_purpose" : "QUOTE",
                "address_from" : this.props.location.state.newAddressId,
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
                    "authorization": "Bearer " + this.props.location.state.token
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

        let self = this;

        $.ajax({
            "async": true,
            "crossDomain": true,
            "method": 'GET',
            "url": "https://app.mienvio.mx/api/shipments/"+ shipmentId +"/rates",
            "headers": {
                "content-type": "application/json",
                "authorization": "Bearer " + this.props.location.state.token
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
        let allServices = {...this.state.allServices};
        rates.forEach(function(rate){
            if((rate.servicelevel).toLowerCase() == (item.service).toLowerCase() && (rate.provider).toLowerCase() == (item.provider).toLowerCase()){
                selectedRate = rate;
            } 
            if(rate.servicelevel in allServices){
                if(allServices[rate.servicelevel].indexOf(rate.provider) == -1){
                    allServices[rate.servicelevel].push(rate.provider);
              }
            }else{
                allServices[rate.servicelevel] = [rate.provider];
            }
            if(rate.servicelevel in serviceOptions){
              serviceOptions[rate.servicelevel].push(rate);
            }else{
              serviceOptions[rate.servicelevel] = [rate];
            }
        });
        this.setState(prevState => ({
            success: [...prevState.success, {object: shipmentObject, options: serviceOptions, selectedRate: selectedRate}],
            defaultValues: [...prevState.defaultValues, selectedRate],
        }));
        this.setState({
            allServices
        });
    }

    updateShipment(shipmentId, rateId){

        let self = this;

        var rateInformation = {
            "object_purpose" : "PURCHASE",
            "rate": rateId
        };

        $.ajax({
            "async": true,
            "crossDomain": true,
            "method": 'PUT',
            "url": "https://app.mienvio.mx/api/shipments/" + shipmentId,
            "headers": {
                "content-type": "application/json",
                "authorization": "Bearer " + this.props.location.state.token
            },
            "processData": false,
            "data": JSON.stringify(rateInformation),
            success: function (data)
            {
                console.log(data);
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
        let success = this.state.success;
        selectedServiceLevel[index] = e;
        selectedProvider[index] = null;
        selectedRate[index] = null;
        defaultValues[index] = null;
        success[index].selectedRate = null;
        this.setState({
            selectedServiceLevel,
            selectedProvider,
            selectedRate,
            defaultValues,
            success
        });
    }

    handleGeneralServiceLevel(service, e){
        this.setState({ 
            generalServiceLevel: service,
            generalProvider: null
        });
    }

    handleGeneralProvider(provider, e){
        let errors = this.state.errors;
        let defaultValues = this.state.defaultValues;
        let success = this.state.success;
        let generalServiceLevel = this.state.generalServiceLevel;
        let selectedElements = this.state.selectedElements;
        var found = false;
        for(var key in selectedElements){
            found = false;
            var options = selectedElements[key].rates;
            if(this.state.generalServiceLevel in options){
                (options[this.state.generalServiceLevel]).map( function(item) {
                    if(item.provider === provider){
                        success[key].selectedRate = item;
                        defaultValues[key] = item;      
                        found = true;
                    }
                })
                if(!found){
                    errors[0] = ["No todos los elementos seleccionados cuentan con la paquetería"];
                }
            }
        }
        this.setState({
            generalProvider: provider,
            defaultValues,
            success,
            errors
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
        let self = this;
        let selectedElements = {...self.state.selectedElements};
        if(e){
            selectedElements[values.index] = {object: values.object, rates: values.options};
        }else{
            if(values.index in selectedElements){
                delete selectedElements[values.index];
            }
        }
        this.setState({
            selectedElements
        });
    }

    toggleModal(){
        let self = this;
        let success = this.state.success;
        let subTotal = this.state.subTotal;
        var total = 0.0;
        success.forEach(function(item, index){
            total += item['selectedRate'].amount;
            self.updateShipment(item['object'].object_id, item['selectedRate'].object_id);
        });
        console.log(total);
        subTotal['subTotal'] = total;
        subTotal['count'] = success.length;
        this.setState({
            redirect: true,
            subTotal
        });
        //console.log("toggle", this.state.success);
        /*this.setState({
            modalOpen: !this.state.modalOpen
        });*/
    }
    
    render() {
        if (this.state.redirect) {
            return <Redirect to={{ pathname: '/guias', state: {success: this.state.success, subTotal: this.state.subTotal}}}/>;
        }
        return (
            <div className = "container" style={{marginTop: 20}}>
                {Object.keys(this.state.errors).length > 0 &&
                    <div className="alert alert-danger alert-dismissible" role="alert" >
                        <button className = "close" data-dismiss = "alert" aria-hidden = "true">&times;</button>
                        {Object.keys(this.state.errors).map((row, value) => <ErrorElement 
                            key = {row} index = {row} errors = {this.state.errors[row]}/>)}
                    </div>
                }
                
                <div className="row">
                    <Col xs={12} md={8}>
                      <h3>Subir CSV</h3>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button bsStyle="primary" onClick={(e) => this.toggleModal(e)} className="pull-right">Siguiente</Button>                            
                    </Col>
                </div>
                {Object.keys(this.state.selectedElements).length > 1 &&
                    <div className="row" >
                        <h5><strong>Servicio</strong></h5>
                        <ButtonToolbar style={{margin:5}}>
                            <DropdownButton
                            bsStyle="default"
                            title={this.state.generalServiceLevel ? ( this.state.generalServiceLevel)  : ("Seleccionar")}
                            noCaret
                            id="dropdown-no-caret">
                            { Object.keys(this.state.allServices).map((service) => <MenuItem key = {service} eventKey = {service} 
                                onSelect={(e) => this.handleGeneralServiceLevel(service, e)}> { service } </MenuItem>)}
                            </DropdownButton>
                        </ButtonToolbar>
                        <h5><strong>Paquetería</strong></h5>
                        <ButtonToolbar style={{margin:5}}>
                            <DropdownButton
                            bsStyle="default"
                            title={this.state.generalProvider ? ( this.state.generalProvider ) : ("Seleccionar")}
                            noCaret
                            id="dropdown-no-caret">
                            { this.state.allServices[this.state.generalServiceLevel] && 
                                (this.state.allServices[this.state.generalServiceLevel]).map((provider) =>
                                <MenuItem key = { provider } eventKey = { provider } 
                                onSelect = {(e) => this.handleGeneralProvider(provider, e)}> { provider } </MenuItem>
                            )}
                            </DropdownButton>
                        </ButtonToolbar>
                    </div>
                }
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
                  {this.state.success.length > 1 &&
                    (this.state.success).map((row, index) => 
                    <TableRow key = { index } index = { index } row = { row } selectedProvider = { this.state.selectedProvider} 
                       selectedServiceLevel = { this.state.selectedServiceLevel } defaultValues = { this.state.defaultValues }
                       selectedElements = { this.state.selectedElements }
                       selectedRate = { this.state.selectedRate } handleProvider = { this.handleProvider }
                       handleServiceLevel = { this.handleServiceLevel } handleMultipleSelect = { this.handleMultipleSelect }/>
                   )}
                  </tbody>
                </Table>
                </Row>
                <OptionModal modalOpen = { this.state.modalOpen} toggleModal = { this.toggleModal }/>
            </div>
        );
    }
}

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
