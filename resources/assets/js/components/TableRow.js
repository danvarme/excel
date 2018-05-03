import React from 'react';
import { Table, 
         Checkbox, Button, Row, Col,
         ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap'

const TableRow = (props) => {

  return(
    <Table responsive>
    <thead>
      <tr>
        <th></th>
        <th>CP Origen</th>
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
    {props.success.length > 0 &&
      (props.success).map((row, index) =>
        <tr key = { row['object'].object_id }>
        <td><Checkbox onClick={e => props.handleMultipleSelect({index: index, object: row['object'], options: row['options']}, e.target.checked)} /></td>
        <td> { row['object'].address_from.zipcode } </td>
        <td> { row['object'].address_to.street } </td>
        <td> { row['object'].address_to.zipcode } </td>
        <td> { row['object'].description } </td>
        <td> { row['object'].weight } </td>
        <td> { row['object'].length } </td>
        <td> { row['object'].height } </td>
        <td> { row['object'].width } </td>
        <td>
          <ButtonToolbar>
            <DropdownButton
            bsStyle="default"
            title={row['selectedRate'] ? (
                    row['selectedRate'].servicelevel
                  ) : (
                    props.selectedServiceLevel[index] ? (
                        props.selectedServiceLevel[index]
                        ): (
                            "Seleccionar"
                        )
                  )}
            noCaret
            id="dropdown-no-caret">
            { Object.keys(row['options']).map((service) => <MenuItem key = {service}
            eventKey = {service} onSelect={(e) => props.handleServiceLevel(index, e)}> 
            { service } </MenuItem>)}
            </DropdownButton>
          </ButtonToolbar>
        </td>
        <td>
          <ButtonToolbar>
            <DropdownButton
            bsStyle="default"
            title={ row['selectedRate'] ? (
                    row['selectedRate'].provider
                  ) : ( "Seleccionar" )}
            noCaret
            id="dropdown-no-caret">
            { props.selectedServiceLevel[index] && 
                (row['options'][props.selectedServiceLevel[index]]).map((value) =>
                <MenuItem key = {value.provider} eventKey = {value.provider} 
                          onSelect={(e) => props.handleProvider({index: index, amount: value}, e)}> 
                    { value.provider } 
                </MenuItem>
            )}
              </DropdownButton>
            </ButtonToolbar>
        </td>
        <td>
           $ { row['selectedRate'] ? ( row['selectedRate'].amount ) : ( "0.0" )}
        </td>
    </tr> 
    )}
    </tbody>
  </Table>
  );
};

export default TableRow;
