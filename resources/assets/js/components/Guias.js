import React, { Component } from 'react'
import { Table, 
		 Row, Col, Grid,
		 ButtonToolbar, Button, Modal} from 'react-bootstrap'

export default class Guias extends Component{

	constructor(props) {
        super(props);

        this.state = {
        	//loading: true,
        	loading: false,
        	emailSent: '',
        	purchase: {"object_status":"MONTHLY_PAYMENT_PENDING","object_id":62469,"owner_id":3880,"invoice_id":null,"invoice_url":null,"invoiced_at":null,"payment_provider":"mienvio_credit","payment_id":"mienvio_credit_1524590040_3880","amount":627.07000000000005,"created_at":"2018-04-24 12:14:00","shipments":[{"object_purpose":"LABEL_CREATED","status":"LABEL_CREATED","created_at":"2018-04-24 12:12:56","updated_at":"2018-04-24 12:14:05","object_id":179927,"owner_id":3880,"address_from":{"object_type":"PURCHASE","object_id":358421,"name":"Mar\u00eda Fernanda Vargas","street":"Av. Miguel Hidalgo 876 Int 29","street2":"Independencia","reference":"Casa blanca con port\u00f3n negro","zipcode":"76120","city":"Quer?taro","state":"Quer\u00e9taro","email":"fernanda@mienvio.mx","phone":"4427893348","bookmark":false,"alias":"","owner_id":3880},"address_to":{"object_type":"PURCHASE","object_id":358425,"name":"Fernanda Vargas","street":"Epigmenio Gonzales","street2":"ITESM","reference":"Cerca del tec","zipcode":"76120","city":"Quer?taro","state":"Quer\u00e9taro","email":"fer@mienvio.mx","phone":"4426976668","bookmark":false,"alias":"","owner_id":3880},"weight":6,"height":4,"length":5,"width":3,"description":"prueba","rate":{"object_id":700,"amount":391.68000000000001,"servicelevel":"express","duration_terms":"1 a 3 d\u00edas","days":2,"trackable":true,"collect_home":true,"provider":"Redpack","provider_img":"\/media\/providers\/redpack.png","extended_zone":false},"label":{"tracking_number":"783849941036","tracking_url":"https:\/\/extranet.redpack.com.mx\/extranet\/RastreoEnvios","label_url":"http:\/\/dummyimage.com\/300\/09f.png","pickup":null},"insurance":null,"order":null,"coupon_code":""},{"object_purpose":"LABEL_CREATED","status":"LABEL_CREATED","created_at":"2018-04-24 12:12:56","updated_at":"2018-04-24 12:14:05","object_id":179926,"owner_id":3880,"address_from":{"object_type":"PURCHASE","object_id":358421,"name":"Mar\u00eda Fernanda Vargas","street":"Av. Miguel Hidalgo 876 Int 29","street2":"Independencia","reference":"Casa blanca con port\u00f3n negro","zipcode":"76120","city":"Quer?taro","state":"Quer\u00e9taro","email":"fernanda@mienvio.mx","phone":"4427893348","bookmark":false,"alias":"","owner_id":3880},"address_to":{"object_type":"PURCHASE","object_id":358424,"name":"Mar\u00eda Herrera","street":"Jesus Rivera","street2":"Parque 2000","reference":"ITESM","zipcode":"76090","city":"Quer?taro","state":"Quer\u00e9taro","email":"maria@mienvio.mx","phone":"4424789998","bookmark":false,"alias":"","owner_id":3880},"weight":3,"height":5,"length":4,"width":6,"description":"prueba","rate":{"object_id":697,"amount":235.38999999999999,"servicelevel":"express","duration_terms":"1 a 3 d\u00edas","days":2,"trackable":true,"collect_home":true,"provider":"Redpack","provider_img":"\/media\/providers\/redpack.png","extended_zone":false},"label":{"tracking_number":"783849941036","tracking_url":"https:\/\/extranet.redpack.com.mx\/extranet\/RastreoEnvios","label_url":"http:\/\/dummyimage.com\/300\/09f.png","pickup":null},"insurance":null,"order":null,"coupon_code":""}]}
        	
        };

        this.getPurchase = this.getPurchase.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.exportExcel = this.exportExcel.bind(this);
        this.toggleEmailModal = this.toggleEmailModal.bind(this);
    }

 //    componentDidMount() {
 //    	console.log("GUIAS", this.props.location.state.purchaseId);
 //    	let purchaseId = this.props.location.state.purchaseId;
 //    	//this.getPurchase(purchaseId);
 //    	this.timerID = setInterval( () => this.getPurchase(purchaseId), 3000 );
 //    }

 //    componentWillUnmount() {
	//     clearInterval(this.timerID);
	// }


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

        $.ajax({
            url: '/sendEmail',
            headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: JSON.stringify(this.state.purchase),
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
			return <div></div>;
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
					<Table striped bordered>
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
					    <Col xs={5} xsOffset={7}>
					    	<Row className="show-grid">
					    		<Col md={6}  className="text-right">
							     	<strong> Total </strong>
							    </Col>
							    <Col md={6} className="text-right">
							    	<strong> $ { purchaseObject.amount } </strong>
							    </Col>
						  </Row>
					    </Col>
				  	</Row>
				  	<Row className="show-grid">
					    <Col xs={5} xsOffset={7} >
					    	<Row className="show-grid">
							    <Col md={6}  className="text-right">
							    	<strong> No. de guías </strong>
							    </Col>
							    <Col md={6} className="text-right">
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