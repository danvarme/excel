import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import axios from 'axios';
import styledProps from 'styled-props';
import styled, {css} from 'styled-components';
import {Form, FormControl, FormGroup, ControlLabel, Col, Button} from 'react-bootstrap';
import UploadModal from './UploadModal';

class GenerarPedido extends Component {

    constructor(props) {
        super(props);

        //Variables
        this.state = {
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
            errors: {'email': null, 'name':  null, 'street': null, 'street2': null, 'zipcode': null, 
            'phone': null, 'city':null}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getUserToken = this.getUserToken.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.getValidation = this.getValidation.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    toggleModal() {
        this.setState({
          modal: !this.state.modal
        });
    }

    getValidation(name){
        let errors = {...this.state.errors};
        switch(name) {
            case 'email':
                const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/g
                errors['email'] = this.state.email === null ? 'error' : (regex.test(this.state.email) ? null : 'error');
                break;
            case 'name':
                let nameValid = this.state.name.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/g);
                errors['email'] = this.state.name === null ? 'error' : (nameValid ? null : 'error');
                break;
            case 'street':
                errors['street'] = this.state.street  === null ? 'error' : (this.state.street.length < 36 ? null : 'error');
                break;
            case 'street2':
                errors['street'] = this.state.street2  === null ? 'error' : (this.state.street2.length < 36 ? null : 'error');
                break;
            case 'zipcode':
                errors['zipcode'] = (this.state.zipcode.length == 4) ? null : 'error';
                break;
            case 'phone':
                errors['phone'] = (this.state.phone) ? null : 'error';
                break;
            default:
                break;
            }
            this.setState({
                errors
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
        self.getValidation(name);
    }

    handleSubmit(){
        console.log("aqui todo bien ");
        // if(this.state.name != '' && this.state.name != '' && this.state.street != '' && this.state.street2 != ''
        //     && this.state.phone != '' && this.state.zipcode != '') return true;
        // else return false;
        return true;
    }

    getUserToken(){

        this.toggleModal();
        // let email = this.state.email;
        // console.log("https://app.mienvio.mx/api/users/"+email+"/api_token");

        // $.ajax({
        //     "async": true,
        //     "crossDomain": true,
        //     "method": 'GET',
        //     "url": "https://app.mienvio.mx/api/users/"+ email +"/api_token",
        //     "headers": {
        //         "content-type": "application/json",
        //         "authorization": "Bearer epN1HWx0FVqCyN7wPEDofVLKg7X0WZ7FRqqAFidTvJdKfJIE4jmQ9JfuDr46"
        //     },
        //     success: function (data)
        //     {
        //         self.state.api_token = data.api_token;
        //         self.setState(self.state);
        //     },
        //     error: function (xhr, status, error) 
        //     {
        //         console.log(xhr);
        //         console.log(status);
        //         console.log(error);
        //     }
        // });
    }

    createTempAddress(){



        // self = this;

        // var address = {
        //     "object_type": "PURCHASE",
        //     "name": this.state.name,
        //     "street": this.state.street,
        //     "street2": this.state.street2,
        //     "zipcode": this.state.zipcode,
        //     "email": this.state.email,
        //     "phone": this.state.phone,
        //     "reference": this.state.reference
        // };

        // $.ajax({
        //     "async": true,
        //     "crossDomain": true,
        //     "method": 'POST',
        //     "url": "https://sandbox.mienvio.mx/api/addresses",
        //     "headers": {
        //         "content-type": "application/json",
        //         "authorization": "Bearer " + self.state.api_token
        //     },
        //     "processData": false,
        //     "data": JSON.stringify(address),
        //     success: function (data)
        //     {
        //        console.log(data);
        //     },
        //     error: function (xhr, status, error) 
        //     {
        //         console.log(xhr);
        //         console.log(status);
        //         console.log(error);
        //     }
        // });
    }

    uploadFile(event){
        //Set errors and success to empty. 
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
                    console.log(data.error);
                }else{
                    console.log(data);
                }
            } 
        });
        this.setState({
          modal: !this.state.modal
        });
    }


    render() {
        return (
            <div className="container">

                <div className="row">

                <div className="col-xs-12 col-md-6 col-md-offset-3">
                    <h4 style={{marginTop: "5%"}}> 
                        Para comenzar, ingrea el correo electrónico del usuario para quien se generarán las guías</h4>
                    <hr/>

                    <Form horizontal>
                        <FormGroup validationState={this.state.errors.email}>
                            <Col componentClass={ControlLabel} sm={4}>Correo electrónico</Col>
                            <Col sm={8}>
                              <FormControl type="email" placeholder="cliente@gmail.com" 
                                value={this.state.email}
                                onChange = {(e) => this.handleChange("email", e)}
                                required />
                            </Col>
                        </FormGroup>

                        <FormGroup validationState={this.state.errors.name}>
                            <Col componentClass={ControlLabel} sm={4}>Nombre</Col>
                            <Col sm={8}>
                              <FormControl placeholder="María López" 
                                type="text"
                                value={this.state.name}
                                onChange = {(e) => this.handleChange("name", e)}
                                required
                                maxLength="80"/>
                            </Col>
                        </FormGroup>

                        <FormGroup validationState={this.state.errors.phone}>
                            <Col componentClass={ControlLabel} sm={4}>Teléfono</Col>
                            <Col sm={8}>
                              <FormControl type="text" placeholder="(442) 123 4567" 
                                required
                                className="square-border telefono form-control"
                                id="phone"
                                maxLength="10"
                                value={this.state.phone}
                                onChange = {(e) => this.handleChange("phone", e)} />
                            </Col>
                        </FormGroup>

                        <FormGroup validationState={this.state.errors.street}>
                            <Col componentClass={ControlLabel} sm={4}>Calle y número</Col>
                            <Col sm={8}>
                              <FormControl type="text" placeholder="Av.Miguel Hidalgo, 876 int.29"
                                value={this.state.street}
                                onChange = {(e) => this.handleChange("street", e)}
                                required 
                                maxLength="35" />
                            </Col>
                        </FormGroup>

                        <FormGroup validationState={this.state.errors.street2}>
                            <Col componentClass={ControlLabel} sm={4}>Colonia</Col>
                            <Col sm={8}>
                              <FormControl type="text" placeholder="Independencia"
                                maxLength="35"
                                value={this.state.street2}
                                onChange = {(e) => this.handleChange("street2", e)}
                                required />
                            </Col>
                        </FormGroup>

                        <FormGroup >
                            <Col componentClass={ControlLabel} sm={4}>Referencia</Col>
                            <Col sm={8}>
                              <FormControl type="text" placeholder="Casa blanca con portón negro" 
                                value={this.state.reference}
                                onChange = {(e) => this.handleChange("reference", e)}
                                maxLength="255"/>
                            </Col>
                        </FormGroup>

                        <FormGroup validationState={this.state.errors.zipcode}>
                            <Col componentClass={ControlLabel} sm={4}>Código Postal</Col>
                            <Col sm={8}>
                              <FormControl type="text" placeholder="76120" 
                                value={this.state.zipcode}
                                onChange = {(e) => this.handleChange("zipcode", e)}
                                required
                                maxLength="5"/>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>Ciudad y Estado</Col>
                            <Col sm={8}>
                              <FormControl type="text" placeholder="Querétaro, Querétaro" 
                              value={this.state.city}
                              onChange = {(e) => this.handleChange("city", e)} />
                            </Col>
                        </FormGroup>

                        <Button className="btn-primary pull-right" onClick={this.getUserToken}>Siguiente</Button>
                    </Form>;

                    </div>
                </div>
                <UploadModal 
                    modalIsOpen = {this.state.modal} 
                    onRequestClose = {() => this.toggleModal()}
                    uploadFile = {() => this.uploadFile()} />
            </div>
        );
    }
}

if (document.getElementById('generarPedido')) {
    ReactDOM.render(<GenerarPedido />, document.getElementById('generarPedido'));

}
