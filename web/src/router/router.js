import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import Index from '../page/Index';
import Login from '../page/Login';

class RouterConfig extends Component{
    render(){
        return(
            <Router>
            <Switch>
                <Route exact  path="/" component={ Index }></Route>
                <Route  path="/login" component={ Login }></Route>
            </Switch>
            </Router>
        )
    }
}
export default RouterConfig;