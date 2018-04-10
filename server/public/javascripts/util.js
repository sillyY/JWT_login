const fs = require('fs');
const jwt = require('jwt-simple');

const findUser = (username, password) => {
    return new Promise((resolve, reject) => {
        fs.readFile('../server/secret.json', function (err, data) {
            if (err) {
                reject({
                    status: 1001,
                    message: "获取用户信息错误!(PS:读取文件错误!)"
                })
            }

            //用户筛选
            var dataArr = JSON.parse(data.toString()),
            userArr = dataArr.filter( data => data.username === username );

            //用户不存在
            if (userArr.length === 0) {
                resolve({
                    status: 2001,
                    message: "用户未注册!"
                })
            }else{
                var data = userArr[0];
                //密码识别
                if (password !== data.password) {
                    resolve({
                        status: 2001,
                        message: "用户密码错误!"
                    })
                }
    
                let obj = {
                    username,
                    password,
                }
                //生成长token：token_l,短token:token_s
                var token_s = _createToken(obj, 2),
                    token_l = _createToken(obj, 62);
    
                resolve({
                    status: 2000,
                    token:{
                        token_s,
                        token_l
                    }
                })
            }
        })
    })
}
exports.findUser = findUser;

//token编码解码密码
const secret = 'lyencode';

//处理token
const handleToken = async (token_s, token_l) => {
        var decoded_s = jwt.decode(token_s, secret),
            deadline_s = Date.now() 
            decoded_l = jwt.decode(token_l, secret),
            deadline_l = Date.now() 
        if (deadline_s <= decoded_s.deadline) {
            //短token在有效期内
            //通过token中的username和password查询信息
            try {
                let response = await _findUser(decoded_s.username, decoded_s.password);
                return {
                    status:2000,
                    userInfo:{
                        username:response.username,
                        intro:response.intro
                    }
                }
            } catch (error) {
                throw error;
            }
        }
        //短token过期，检验长token是否过期
        if(deadline_l <= decoded_l.deadline){
            //长token在有效期内
            try {
                let obj={
                    username:decoded_l.username,
                    password:decoded_l.password
                },
                token_s=_createToken(obj,2);

               let response = await _findUser(decoded_l.username,decoded_l.password);
               return {
                   status:2000,
                   userInfo:{
                       username:response.username,
                       intro:response.intro
                   },
                   token:{
                       token_s
                   }
                }
            } catch (error) {
                throw error;
            }
        }else{
            //长token过期.
            return {
                status:2002,
                error:"token过期，请重新登陆"
            }
        }
        
    

}
exports.handleToken = handleToken;

const _createToken = (payload, day) => {
    //加入过期时间
    payload = {
        ...payload,
        deadline: Date.now() + day   * 1000
    }
    const token = jwt.encode(payload, secret);
    return token;
}
const _findUser = (username, password) => {
    return new Promise((resolve,reject) => {
        fs.readFile('../server/secret.json', function(err, data){
            if(err){
                reject({
                    status: 1001,
                    message: "获取用户信息错误!(PS:读取文件错误!)"
                })
            }
            data=JSON.parse(data.toString());
            data=data.filter(result=>result.username===username);
            resolve(data[0]);
        })
    })
}