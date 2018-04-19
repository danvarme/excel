import React, { Component } from 'react'
import { Table, Row, Col, Grid } from 'react-bootstrap'

export default class Guias extends Component{

    componentDidMount() {
        console.log("GUIAS", this.props.location.state.success);
    }

	render(){
		const subTotal = this.props.location.state.subTotal;
		return (
			<div className="container">
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
			  	<div className="pull-right">
				  	<div className="row ">
				  		<Col md={4} mdPush={4} className="text-right">
					      <strong> $ { subTotal.subTotal } </strong>
					    </Col>
					    <Col md={8} mdPull={8}>
					      <strong> Total </strong>
					    </Col>
				  	</div>
				  	<div className="row ">
				  		<Col md={4} mdPush={4} className="text-right">
					      <strong> { subTotal.count} </strong>
					    </Col>
					    <Col md={8} mdPull={8} >
					      <strong> No. guías </strong>
					    </Col>
				  	</div>
			  	</div>

			</div>
		)
	}
}