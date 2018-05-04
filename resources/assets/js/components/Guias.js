import React, { Component } from 'react'
import { Table, 
		 Row, Col, Grid,
		 ButtonToolbar, Button, Modal} from 'react-bootstrap'

import logo from '../../../../public/media/loader.gif'

export default class Guias extends Component{

	constructor(props) {
        super(props);

        this.state = {
        	loading: true,
        	emailSent: '',
        	purchase: null
        };

        this.getPurchase = this.getPurchase.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.exportExcel = this.exportExcel.bind(this);
        this.toggleEmailModal = this.toggleEmailModal.bind(this);
    }

    componentDidMount() {
    	console.log("GUIAS", this.props.location.state.purchaseId);
    	let purchaseId = this.props.location.state.purchaseId;
    	//this.getPurchase(purchaseId);
    	this.timerID = setInterval( () => this.getPurchase(purchaseId), 3000 );
    }

    componentWillUnmount() {
	    clearInterval(this.timerID);
	}


    getPurchase(purchaseId){
    	self = this;
    	var label = true;
		console.log("getPurchase");
    	$.ajax({
            "async": true,
            "crossDomain": true,
            "method": 'GET',
            "url": "https://app.mienvio.mx/api/purchases/" + purchaseId,
            "headers": {
                "content-type": "application/json",
                "authorization": "Bearer " + this.props.location.state.token
            },
            success: function (data){
            	data.purchase.shipments.forEach(function(shipment, index){
            		if(!shipment.label) label = false;
		        });
		        if(label){
		        	console.log("todos label", data.purchase);
		        	self.setState({
		        		loading: false,
		        		purchase: data.purchase
		        	});
		        	clearInterval(self.timerID);
		        }else console.log("alguno sin label");
            },
            error: function (xhr, status, error) {
            	console.log("obtener compra", error);
            }
        });
    }

    exportExcel(event){
        //Set errors and success to empty. 
        self = this;
        event.preventDefault();

        $.ajax({
            url: '/exportExcel',
            headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: JSON.stringify(this.state.purchase),
            contentType: 'application/json',
            type: 'POST',
            success: function(data){
                if(data.error){
                    console.log(error);
                }else{
                    var a = document.createElement("a");
                    a.href = data.file;
                    a.download = data.name;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
            } 
        });  
    }

    sendEmail(event){
        
        self = this;
        event.preventDefault();

        var object = {
            "purchase": this.state.purchase,
            "email": this.props.location.state.email
        }

        $.ajax({
            url: '/sendEmail',
            headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: JSON.stringify(object),
            contentType: 'application/json',
            type: 'POST',
            success: function(data){
                if(data.error){
                    self.setState({
                        emailSent: 'Hubo un error al enviar el correo,intente nuevamente'
                    });
                }else{
                    self.setState({
                        emailSent: 'Las guías se han eviado exitosamente al correo del cliente'
                    });
                }
            } 
        });  
    }

    toggleEmailModal(){
        this.setState({
            emailSent: ''
        });
    }

	render(){
		if(!this.state.purchase){
			let helpStyle = { display: "block", marginLeft: "auto", marginRight: "auto", width: "30%", paddingTop: "10%"}
            return (
                <div  >
                    <img style={helpStyle} src={logo} />
                    <h1 style={{textAlign: "center", marginTop: "-5%"}}>Loading....</h1>
                </div>);
		}
		const purchaseObject = this.state.purchase;
		return (
			<div className="container" style={{marginTop: 20}}>
				<div className="row">
					<Col xs={6} md={6}>
						<h3>Subir CSV</h3>
					</Col>
					<Col xs={6} md={6}>
						<ButtonToolbar className="pull-right">
						    <Button bsStyle="primary" onClick={this.exportExcel}>
						      Descargar guías
						    </Button>
						    <Button bsStyle="primary" onClick={this.sendEmail}>
						      Enviar por correo
						    </Button>
						</ButtonToolbar>
					</Col>
				</div>
				
				<div className="row">
					<Table>
						<thead>
							<tr>
								<th>No. guía</th>
								<th>Origen</th>
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
							{(purchaseObject.shipments).map((shipment, index) =>
								<tr key={ shipment.object_id } >
									<td> { shipment.label.tracking_number }</td>
									<td> { shipment.address_from.zipcode } </td>
									<td> { shipment.address_to.street } </td>
									<td> { shipment.address_to.zipcode } </td>
									<td> { shipment.description } </td>
									<td> { shipment.weight } </td>
									<td> { shipment.length } </td>
									<td> { shipment.height } </td>
									<td> { shipment.width } </td>
									<td> { shipment.rate.servicelevel } </td>
									<td> { shipment.rate.provider } </td>
									<td> { shipment.rate.amount } </td>
								</tr>
							)}
						</tbody>
					</Table>
				
				</div>
				<Grid className="pull-right">
					<Row className="show-grid">
					    <Col md={9} xsOffset={3}>
					    	<Row className="show-grid">
					    		<Col md={10}  className="text-right">
							     	<strong> Total </strong>
							    </Col>
							    <Col md={2} className="text-right">
							    	<strong> $ { purchaseObject.amount } </strong>
							    </Col>
						  </Row>
					    </Col>
				  	</Row>
				  	<Row className="show-grid">
					    <Col md={9} xsOffset={3} >
					    	<Row className="show-grid">
							    <Col md={10}  className="text-right">
							    	<strong> No. de guías </strong>
							    </Col>
							    <Col md={2} className="text-right">
							    	<strong> { purchaseObject.shipments.length } </strong>
							    </Col>
						  </Row>
					    </Col>
				  	</Row>
				</Grid>
				{this.state.emailSent && 
                    <div className="static-modal"> 
                        <Modal.Dialog style={{position: 'absolute', top: '20%', left: '0%', transform: 'translate(-20%, -0%) !important'}}>
                            <Modal.Header>
                                <Modal.Title className="font-weight-bold">Guías</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h4 style={{textAlign: 'center', }}>{this.state.emailSent}</h4><br/>
                                <Button bsStyle="primary" bsSize="small" block onClick={this.toggleEmailModal}>OK</Button>
                            </Modal.Body>
                        </Modal.Dialog>
                    </div>}
			</div>
		)
	}
}