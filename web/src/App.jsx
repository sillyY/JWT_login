import React, { Component } from 'react';

import './App.css';
import * as axios from 'axios';
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  async handleClick() {
    //测试使用:情况localstorage
    // window.localStorage.clear();

    var username = this.state.username,
      password = this.state.password;
    //1.取出localstorage中的token
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

      }
    }else{
      //2.请求
      try {
        let response = await axios.post('http://localhost:8080/login', {
          username,
          password
        })
        //localStorage存储token
        window.localStorage.setItem('token_s', response.data.token_s);
        window.localStorage.setItem('token_l', response.data.token_l);
      } catch (error) {
        console.log(error);
      }
    }
  }
  render() {
    return (
      <div className="App">
        <div className="block">
          <label>用户名</label>
          <input name="username" type="text" value={this.state.username} placeholder="请输入用户名" onChange={this.handleChange} />
        </div>
        <div className="block">
          <label>密码</label>
          <input name="password" type="password" value={this.state.password} placeholder="请输入密码" onChange={this.handleChange} />
        </div>
        <div className="block center">
          <button type="submit" onClick={this.handleClick}>注册</button>
        </div>
      </div>
    );
  }
}

export default App;
