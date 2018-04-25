import React, { Component } from 'react'
import { Table, 
		 Row, Col, Grid,
		 ButtonToolbar, Button } from 'react-bootstrap'

export default class Guias extends Component{

	constructor(props) {
        super(props);

        this.state = {
        	loading: true,
        	purchase: null
        };

        this.getPurchase = this.getPurchase.bind(this);
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
						    <Button bsStyle="primary">
						      Descargar guías
						    </Button>
						    <Button bsStyle="primary">
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
					    <Col xs={4} xsOffset={8}>
					    	<Row className="show-grid">
					    		<Col md={4} mdOffset={3} className="text-right">
							     	<strong> Total </strong>
							    </Col>
							    <Col md={5} className="text-right">
							    	<strong> $ { purchaseObject.amount } </strong>
							    </Col>
						  </Row>
					    </Col>
				  	</Row>
				  	<Row className="show-grid">
					    <Col xs={4} xsOffset={8}>
					    	<Row className="show-grid">
							    <Col md={4} mdOffset={3} className="text-right">
							    	<strong> No. de guías </strong>
							    </Col>
							    <Col md={5} className="text-right">
							    	<strong> { purchaseObject.shipments.length } </strong>
							    </Col>
						  </Row>
					    </Col>
				  	</Row>
				</Grid>
			</div>
		)
	}
}