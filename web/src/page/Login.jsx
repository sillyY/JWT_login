import React, {Component} from 'react';
import {withRouter} from "react-router-dom";

import * as axios from 'axios';
class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
    this.handleChange = this
      .handleChange
      .bind(this);
    this.handleClick = this
      .handleClick
      .bind(this);
  }
  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value});
  }
  async handleClick() {
    //测试使用:情况localstorage window.localStorage.clear();

    var username = this.state.username,
      password = this.state.password;

    //请求登陆接口
    try {
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

    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="block">
          <label>用户名</label>
          <input
            name="username"
            type="text"
            value={this.state.username}
            placeholder="请输入用户名"
            onChange={this.handleChange}/>
        </div>
        <div className="block">
          <label>密码</label>
          <input
            name="password"
            type="password"
            value={this.state.password}
            placeholder="请输入密码"
            onChange={this.handleChange}/>
        </div>
        <div className="block center">
          <button type="submit" onClick={this.handleClick}>注册</button>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);