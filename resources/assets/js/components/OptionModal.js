import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, ButtonToolbar, Button } from 'react-bootstrap'

export default class OptionMondal extends Component{

	constructor(props){
		super(props);
	}

	render(){
		if(this.props.modalOpen){
			return <div className="static-modal">
			  <Modal.Dialog>
			    <Modal.Header>
			      <Modal.Title className="font-weight-bold">Elige la opción deseada</Modal.Title>
			    </Modal.Header>

			    <Modal.Body>
			    	<ButtonToolbar style={{justifyContent:'center'}}>
						<Button className="pull-left" bsStyle="primary" onClick={(e) => this.props.createLabel(e) }>Generar guías</Button>
				    	<Button className="pull-right" bsStyle="primary" onClick={(e) => this.props.sendDashboard(e) }>Enviar al dashboard del cliente</Button>
					</ButtonToolbar>
			    </Modal.Body>

			    <Modal.Footer>
			      <Button onClick={(e) => this.props.toggleModal(e)}>Close</Button>
			    </Modal.Footer>
			  </Modal.Dialog>
			</div>;
		}
		return <div></div>;
	}
}