import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class GetShipments extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading : true,
            contacts : []
        }
    }

    //Fires immediately after the initial render
    componentDidMount() {
        console.log("APARAZCO ");
        this.fetchData();
    }

    fetchData(){
        /*var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://sandbox.mienvio.mx/api/shipments",
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "authorization": "Bearer epN1HWx0FVqCyN7wPEDofVLKg7X0WZ7FRqqAFidTvJdKfJIE4jmQ9JfuDr46"
        }
        }

        $.ajax(settings).done(function (response) {
          console.log(response);
        });*/
    }

    render() {
        return (
            <h1>CONSOLINGGGGG</h1>
        );
    }
}

if (document.getElementById('getShipments')) {
    ReactDOM.render(<GetShipments />, document.getElementById('getShipments'));
}
