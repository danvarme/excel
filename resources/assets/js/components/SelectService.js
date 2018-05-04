import React from 'react';
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap'

const SelectService = (props) => {
  return(
    <div className="row" >
      <h5><strong>Servicio</strong></h5>
      <ButtonToolbar style={{ margin:5 }}>
          <DropdownButton
          bsStyle="default"
          title={props.generalServiceLevel ? ( props.generalServiceLevel)  : ("Seleccionar")}
          noCaret
          id="dropdown-no-caret">
          { Object.keys(props.allServices).map((service) => <MenuItem key = {service} eventKey = {service} 
              onSelect={(e) => props.handleGeneralServiceLevel(service, e)}> { service } </MenuItem>)}
          </DropdownButton>
      </ButtonToolbar>
      <h5><strong>Paquetería</strong></h5>
      <ButtonToolbar style={{margin:5}}>
          <DropdownButton
          bsStyle="default"
          title={props.generalProvider ? ( props.generalProvider ) : ("Seleccionar")}
          noCaret
          id="dropdown-no-caret">
          { props.allServices[props.generalServiceLevel] && 
              (props.allServices[props.generalServiceLevel]).map((provider) =>
              <MenuItem key = { provider } eventKey = { provider } 
              onSelect = {(e) => props.handleGeneralProvider(provider, e)}> { provider } </MenuItem>
          )}
          </DropdownButton>
      </ButtonToolbar>
  </div>
  );
};

export default SelectService;
