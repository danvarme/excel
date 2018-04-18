import React from 'react'
import { render } from 'react-dom'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import GenerarPedido from './GenerarPedido'
import Example from './Example'


render((
  <BrowserRouter>
    <div>
    	<Switch>
	     	<Route exact path='/' component={GenerarPedido}/>
	      	<Route path='/showTable' component={Example}/>
	    </Switch>
  	</div>
  </BrowserRouter>
), document.getElementById('root'));
