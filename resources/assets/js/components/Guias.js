import React, { Component } from 'react'
import { Table, 
		 Row, Col, Grid,
		 ButtonToolbar, Button } from 'react-bootstrap'

export default class Guias extends Component{

    componentDidMount() {
        console.log("GUIAS", this.props.location.state.success);
    }

	render(){
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
				
				{ this.props.location.state.success  &&
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
							{(this.props.location.state.success).map((row, index) =>
								<tr key={row['object'].object_id}>
									<td> { row['object'].object_id }</td>
									<td> { row['object'].address_from.zipcode } </td>
									<td> { row['object'].address_to.street } </td>
									<td> { row['object'].address_to.zipcode } </td>
									<td> { row['object'].description } </td>
									<td> { row['object'].weight } </td>
									<td> { row['object'].length } </td>
									<td> { row['object'].height } </td>
									<td> { row['object'].width } </td>
									<td> { row['selectedRate'].servicelevel } </td>
									<td> { row['selectedRate'].provider } </td>
									<td> { row['selectedRate'].amount } </td>
								</tr>
							)}
						</tbody>
					</Table>
				
				</div>
				}
				<Grid className="pull-right">
					<Row className="show-grid">
					    <Col xs={4} xsOffset={8}>
					    	<Row className="show-grid">
					    		<Col md={3} mdOffset={4} className="text-right">
							     	<strong> Total </strong>
							    </Col>
							    <Col md={5} className="text-right">
							    	<strong> $ { this.props.location.state.subTotal.subTotal } </strong>
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
							    	<strong> { this.props.location.state.subTotal.count} </strong>
							    </Col>
						  </Row>
					    </Col>
				  	</Row>
				</Grid>
			</div>
		)
	}
}