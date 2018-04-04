import React, { Component } from 'react';

import * as axios from 'axios';
class Index extends Component{
    // constructor(props){
    //     super(props);
    // }
    componentDidMount(){
        
    }
    async autoLogin(){
        var token_s = window.localStorage.token_s,
        token_l = window.localStorage.token_l;
      if (token_l && token_s) {
        try {
          let response = await axios.post('http://localhost:8080/auth', {
            token_s,
            token_l
          })
          if(response.data.token_s){
            //短token过期，重新保存短token
            window.localStorage.setItem('token_s', response.data.token_s);
          }
        } catch (error) {
            alert(error);
        }
      }
    }
    render(){
        return(
            <div className="index">
                hello !                
            </div>
        )
    }
}
export default Index;