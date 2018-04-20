import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import axios from 'axios';
import {Form, FormControl, FormGroup, ControlLabel, Col, Button, HelpBlock} from 'react-bootstrap';
import UploadModal from './UploadModal';
import { Route, Router } from 'react-router-dom'
import { Redirect } from 'react-router'
import Example from './Example'

function ErrorElement(props){
    return(
        <div className="alert alert-danger alert-dismissible">
            <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
            <strong>¡Error!</strong> {props.message}
        </div>
    );
}

export default class GenerarPedido extends Component {

    constructor(props) {
        super(props);

        //Variables
        this.state = {
            redirect: false,
            excelData: null,
            email: '',
            name: '',
            street: '',
            street2: '',
            zipcode: '',
            phone: '',
            reference: '',
            city: '',
            api_token: '',
            modal: false,
            tokenError: '',
            uploadError: '',
            newAddressId: null,
            errors: {'email': null, 'name':  null, 'street': null, 'street2': null, 'zipcode': null, 
            'phone': null, 'city':null}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getUserToken = this.getUserToken.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.validateInformation = this.validateInformation.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    toggleModal() {
        this.setState({
          modal: !this.state.modal
        });
    }

    handleChange(name,e) {

        self = this;
        var change = {
          name: this.state.name,
          email: this.state.email,
          street: this.state.street,
          street2: this.state.street2,
          zipcode: this.state.zipcode,
          phone: this.state.phone,
          reference: this.state.reference,
          city: this.state.city,
        };
        change[name] = e.target.value;
        if (name === 'phone') {
          change[name] = e.target.value.replace(/-/g, '')
        }
        self.setState(change);

        //Handle errors
        let errors = {...this.state.errors};
        switch(name) {
            case 'email':
                const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/g
                errors['email'] = e.target.value === '' ? 'error' : (regex.test(e.target.value) ? null : 'error');
                break;
            case 'name':
                let nameValid = e.target.value.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/g);
                errors['name'] = e.target.value === '' ? 'error' : (nameValid ? null : 'error');
                break;
            case 'street':
                errors['street'] = e.target.value  === '' ? 'error' : (e.target.value > 35 ? 'error' : null);
                break;
            case 'street2':
                errors['street2'] = e.target.value  === '' ? 'error' : (e.target.value > 35 ? 'error' : null);
                break;
            case 'zipcode':
                errors['zipcode'] = (e.target.value.length == 5) ? null : 'error';
                break;
            case 'phone':
                errors['phone'] = (e.target.value) ? null : 'error';
                break;
            default:
                break;
        }
        this.setState({
            errors
        });    
    }

    validateInformation(){

        self = this;
        let error = this.state.errors;
        let success = true;
        Object.keys(error).forEach(function(key) {
            if(error[key] != null || self.state[key] == '') success = false;
        });
        return success;
    }

    handleSubmit(){
        // if(this.validateInformation()){
        //     this.getUserToken();
        //     // this.toggleModal();
        // }else{
        //     let errors = {...this.state.errors};
        //     Object.keys(errors).forEach(function(key) {
        //         if(self.state[key] == '') errors[key] = 'error';
        //     });

        //     this.setState({
        //       errors
        //     });
        // }
        this.toggleModal();
    }


    getUserToken(){
        let email = this.state.email;
        self = this;

        $.ajax({
            "async": true,
            "crossDomain": true,
            "method": 'GET',
            "url": "https://app.mienvio.mx/api/users/"+ email +"/api_token",
            "headers": {
                "content-type": "application/json",
                "authorization": "Bearer epN1HWx0FVqCyN7wPEDofVLKg7X0WZ7FRqqAFidTvJdKfJIE4jmQ9JfuDr46"
            },
            success: function (data)
            {
                self.setState({
                    api_token: data.api_token
                });
                self.createTempAddress();
            },
            error: function (xhr, status, error) 
            {
                console.log(error);
                self.setState({
                    tokenError: 'No se pudo obtener los datos del usuario.'
                });
                console.log(self.state.tokenError);
            }
        });
    }

    createTempAddress(){
        self = this;

        var address = {
            "object_type": "PURCHASE",
            "name": this.state.name,
            "street": this.state.street,
            "street2": this.state.street2,
            "zipcode": this.state.zipcode,
            "email": this.state.email,
            "phone": this.state.phone,
            "reference": this.state.reference
        };
        $.ajax({
            "async": true,
            "crossDomain": true,
            "method": 'POST',
            "url": 'https://app.mienvio.mx/api/addresses',
            "headers": {
                "content-type": "application/json",
                "authorization": "Bearer " + self.state.api_token
            },
            "processData": false,
            "data": JSON.stringify(address),
            success: function (data)
            {
                self.setState({
                    newAddressId: data.address.object_id
                });

                self.toggleModal();
            },
            error: function (xhr, status, error) 
            {
                self.setState({
                    tokenError: error
                });
                console.log(error);
            }
        });
    }

    uploadFile(event){
        //Set errors and success to empty. 
        self = this;
        
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
                    self.setState({
                        uploadError: data.error
                    });
                }else{
                    self.setState({ 
                        redirect: true,
                        excelData: data,
                        modal: !self.state.modal
                    });
                }
            } 
        });
        
    }


    render() {
        if (this.state.redirect) {
            return <Redirect to={{ pathname: '/showTable', state: {data: this.state.excelData, token: this.state.api_token, newAddressId: this.state.newAddressId}}}/>;
        }
        let helpStyle = {top:0, margin: 0}
        return (
            <div className="container">

                <div className="row">

                <div className="col col-xs-12 col-md-9 col-md-offset-2">
                    <h4 style={{marginTop: "3%"}}> 
                        Para comenzar, ingrea el correo electrónico del usuario para quien se generarán las guías</h4>
                    <hr/>

                    {this.state.tokenError && <ErrorElement message={this.state.tokenError} />}

                    <Form horizontal>
                        <FormGroup validationState={this.state.errors.email}>
                            <Col componentClass={ControlLabel} sm={2}>Correo electrónico</Col>
                            <Col sm={9}>
                              <FormControl type="email" placeholder="cliente@gmail.com" 
                                value={this.state.email}
                                onChange = {(e) => this.handleChange("email", e)}
                                required />
                                {this.state.errors.email && <HelpBlock style={helpStyle}>Correo electrónico inválido</HelpBlock> }
                            </Col>
                        </FormGroup>

                        <FormGroup validationState={this.state.errors.name}>
                            <Col componentClass={ControlLabel} sm={2}>Nombre</Col>
                            <Col sm={9}>
                              <FormControl placeholder="María López" 
                                type="text"
                                value={this.state.name}
                                onChange = {(e) => this.handleChange("name", e)}
                                required
                                maxLength="80"/>
                                {this.state.errors.name && <HelpBlock style={helpStyle}>Nombre inválido. Máximo 80 caracteres</HelpBlock> }
                            </Col>
                        </FormGroup>

                        <FormGroup validationState={this.state.errors.phone}>
                            <Col componentClass={ControlLabel} sm={2}>Teléfono</Col>
                            <Col sm={9}>
                              <FormControl type="text" placeholder="(442) 123 4567" 
                                required
                                className="square-border telefono form-control"
                                id="phone"
                                maxLength="10"
                                value={this.state.phone}
                                onChange = {(e) => this.handleChange("phone", e)} />
                                {this.state.errors.phone && <HelpBlock style={helpStyle}>Teléfono inválido</HelpBlock> }
                            </Col>
                        </FormGroup>

                        <FormGroup validationState={this.state.errors.street}>
                            <Col componentClass={ControlLabel} sm={2}>Calle y número</Col>
                            <Col sm={9}>
                              <FormControl type="text" placeholder="Av.Miguel Hidalgo, 876 int.29"
                                value={this.state.street}
                                onChange = {(e) => this.handleChange("street", e)}
                                required 
                                maxLength="35" />
                                {this.state.errors.street && <HelpBlock style={helpStyle}>Calle y número inválido. Máximo 35 caracteres</HelpBlock> }
                            </Col>
                        </FormGroup>

                        <FormGroup validationState={this.state.errors.street2}>
                            <Col componentClass={ControlLabel} sm={2}>Colonia</Col>
                            <Col sm={9}>
                              <FormControl type="text" placeholder="Independencia"
                                maxLength="35"
                                value={this.state.street2}
                                onChange = {(e) => this.handleChange("street2", e)}
                                required />                                
                                {this.state.errors.street2 && <HelpBlock style={helpStyle}>Colonia inválida. Máximo 35 caracteres</HelpBlock> }

                            </Col>
                        </FormGroup>

                        <FormGroup >
                            <Col componentClass={ControlLabel} sm={2}>Referencia</Col>
                            <Col sm={9}>
                              <FormControl type="text" placeholder="Casa blanca con portón negro" 
                                value={this.state.reference}
                                onChange = {(e) => this.handleChange("reference", e)}
                                maxLength="255"/>
                            </Col>
                        </FormGroup>

                        <FormGroup validationState={this.state.errors.zipcode}>
                            <Col componentClass={ControlLabel} sm={2}>Código Postal</Col>
                            <Col sm={9}>
                              <FormControl type="text" placeholder="76120" 
                                value={this.state.zipcode}
                                onChange = {(e) => this.handleChange("zipcode", e)}
                                required
                                maxLength="5"/>
                                {this.state.errors.zipcode && <HelpBlock style={helpStyle}>Código postal inválido.</HelpBlock> }
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>Ciudad y Estado</Col>
                            <Col sm={9}>
                              <FormControl type="text" placeholder="Querétaro, Querétaro" 
                              value={this.state.city}
                              onChange = {(e) => this.handleChange("city", e)} />
                            </Col>
                        </FormGroup>

                        <Button className="btn-primary pull-right" onClick={this.handleSubmit}>Siguiente</Button>
                    </Form>

                    </div>
                </div>
                <UploadModal 
                    modalIsOpen = {this.state.modal} 
                    message = {this.state.uploadError}
                    onRequestClose = {() => this.toggleModal()}
                    uploadFile = {() => this.uploadFile()} />
            </div>
        );
    }
}

if (document.getElementById('generarPedido')) {
    ReactDOM.render(<GenerarPedido />, document.getElementById('generarPedido'));

}
