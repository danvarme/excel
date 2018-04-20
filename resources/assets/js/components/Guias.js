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
    }

    componentDidMount() {
    	console.log("GUIAS", this.props.location.state.purchaseId);
    	let purchaseId = this.props.location.state.purchaseId;
    	while(this.state.loading){
    		setInterval(this.getPurchase(purchaseId), 30000);
    	}
    }


    getPurchase(purchaseId){
        self = this;
        var label = true;
        $.ajax({
            "async": true,
            "crossDomain": true,
            "method": 'GET',
            "url": "https://app.mienvio.mx/api/purchases/"+ purchaseId,
            "headers": {
                "content-type": "application/json",
                "authorization": "Bearer " + this.props.location.state.token
            },
            success: function (data){
            	data.purchase.shipments.forEach(function(shipment, index){
            		if(!shipment.label) label = false;
		        });
		        if(label){
		        	self.setState({
		        		loading: false,
		        		purchase: data.purchase
		        	});
		        }
            },
            error: function (xhr, status, error) {
            	console.lof("obtener compra", error);
            }
        });
    }

	render(){
		if(!this.state.purchase){
			return <div></div>;
		}
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
							{(this.state.purchase.shipments).map((row, index) =>
								<tr key={row.object_id}>
									<td> { row.label.tracking_number }</td>
									<td> { row.address_from.zipcode } </td>
									<td> { row.address_to.street } </td>
									<td> { row.address_to.zipcode } </td>
									<td> { row.description } </td>
									<td> { row.weight } </td>
									<td> { row.length } </td>
									<td> { row.height } </td>
									<td> { row.width } </td>
									<td> { row.rate.servicelevel } </td>
									<td> { row.rate.provider } </td>
									<td> { row.rate.amount } </td>
								</tr>
							)}
						</tbody>
					</Table>
				
				</div>
				<Grid className="pull-right">
					<Row className="show-grid">
					    <Col xs={4} xsOffset={8}>
					    	<Row className="show-grid">
					    		<Col md={3} mdOffset={4} className="text-right">
							     	<strong> Total </strong>
							    </Col>
							    <Col md={5} className="text-right">
							    	<strong> $ { this.state.purchase.amount } </strong>
							    </Col>
						  </Row>
					    </Col>
				  	</Row>
				  	<Row className="show-grid">
					    <Col xs={4} xsOffset={8}>
					    	<Row className="show-grid">
							    <Col md={3} mdOffset={4} className="text-right">
							    	<strong> No. guías </strong>
							    </Col>
							    <Col md={5} className="text-right">
							    	<strong> { this.state.purchase.shipments.length } </strong>
							    </Col>
						  </Row>
					    </Col>
				  	</Row>
				</Grid>
			</div>
		)
	}
}