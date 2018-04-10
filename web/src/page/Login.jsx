import React, {Component} from 'react';
import {withRouter} from "react-router-dom";

import * as axios from 'axios';
import '../assets/css/login.css';
class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      username_prompt: "",
      password: '',
      password_prompt: ""
    }
    this.handleChange = this
      .handleChange
      .bind(this);
    this.handleClick = this
      .handleClick
      .bind(this);
  }

  handleChange(event) {
    const target = event.target,
      value = target.value,
      name = target.name;
    //username 输入提示 字母或数字，4到40位。
    if (name === "username") {
      if (this.checkUsername(value)) {
        this.setState({username_prompt: ""})
      } else {
        this.setState({username_prompt: "字母或数字，4到40位!"})
      }
    }
    //password 输入提示 6到40位。
    if (name === "password") {
      if (this.checkPassword(value)) {
        this.setState({password_prompt: ""})
      } else {
        this.setState({password_prompt: "6到40位!"})
      }
    }
    this.setState({[name]: value});
  }
  checkUsername(value) {
    var match = /^[A-Za-z0-9]{4,40}$/g;
    if (match.test(value) ) {
      return true;
    }
    return false;
  }
  checkPassword(value) {
    if ((value.length >= 6 && value.length <= 40) ) {
      return true;
    }
    return false;
  }
  async handleClick() {
    //测试使用:情况localstorage window.localStorage.clear();
    var username = this.state.username,
      password = this.state.password;

    //请求登陆接口
    try {
      if(this.checkUsername(this.state.username)&&this.checkPassword(this.state.password)){
        let response = await axios.post('http://localhost:8080/login', {username, password})
        //localStorage存储token
        switch (response.data.status) {
          case 2000:
            //存储token
            window
              .localStorage
              .setItem('token_s', response.data.token.token_s);
            window
              .localStorage
              .setItem('token_l', response.data.token.token_l);
  
            //跳转路由，并将用户数据传到首页.
            this
              .props
              .history
              .push('/');
            break;
          case 2001:
            alert('用户账号不存在或密码错误');
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    return (
      <div className="login">
        <div className="container">
          <div className="block title">
            用户登陆
          </div>
          <div className="block">
            <label>用户名</label>
            <input
              name="username"
              type="text"
              value={this.state.username}
              placeholder="请输入用户名"
              onChange={this.handleChange}/>
            <p>{this.state.username_prompt}</p>
          </div>
          <div className="block">
            <label>密码</label>
            <input
              name="password"
              type="password"
              value={this.state.password}
              placeholder="请输入密码"
              onChange={this.handleChange}/>
            <p>{this.state.password_prompt}</p>
          </div>
          <div className="block">
            <button className="blue" type="submit" onClick={this.handleClick}>登陆</button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);