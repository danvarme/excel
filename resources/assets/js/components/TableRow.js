import React from 'react';
import { Table, 
         Checkbox, Button, Row, Col,
         ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap'

const TableRow = (props) => {

  const row = props.row;
  const index = props.index;
  //console.log(row);
  return(
    <tr key = { row }>
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
                  ) : (
                    props.selectedProvider[index] ? (
                        props.selectedProvider[index]
                        ): (
                            "Seleccionar"
                        )
                  )}
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
           $ { row['selectedRate'] ? ( row['selectedRate'].amount ) : 
                ( props.selectedRate[index] ? ( props.selectedRate[index] ): 
                        ("0.0")
                )}
        </td>
    </tr>
  );
};

export default TableRow;
