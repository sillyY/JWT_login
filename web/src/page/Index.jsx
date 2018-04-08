import React, {Component} from 'react';
import {withRouter} from "react-router-dom";

import * as axios from 'axios';
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                username: '',
                intro: ''
            }
        }
    }
    componentDidMount() {
        this.autoLogin();
    }
    async autoLogin() {
        var token_s = window.localStorage.token_s,
            token_l = window.localStorage.token_l;
        if (token_l && token_s) {
            try {
                let response = await axios.post('http://localhost:8080/auth', {token_s, token_l})
                if (response.data.response.token_s) {
                    //短token过期，长token,重新保存短token 保存短token
                    window
                        .localStorage
                        .setItem('token_s', response.data.response.token_s);

                    //修改state
                    this.setState({
                        user: {
                            username: response.data.response.userInfo.username,
                            intro: response.data.response.userInfo.intro
                        }
                    });
                } else {
                    //token未过期 修改state
                    this.setState({
                        user: {
                            username: response.data.response.userInfo.username,
                            intro: response.data.response.userInfo.intro
                        }
                    });
                }
            } catch (error) {
                //短token和长token都过期
                switch (error.stutas) {
                    case 1001:
                        alert('服务器故障,请稍后重试！');
                        break;
                    case 1003:
                        this
                            .props
                            .history
                            .push('/login');
                        break;
                    default:
                        break;
                }
            }
        } else {
            //不存在token，跳转到登陆输入页面
            this
                .props
                .history
                .push('/login');
        }
    }
    render() {
        return (
            <div className="index">
                <p>hello {this.state.user.username}!</p>
                <p>{this.state.user.intro}</p>
            </div>
        )
    }
}
export default withRouter(Index);