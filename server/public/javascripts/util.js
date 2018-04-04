const fs = require('fs');
const jwt = require('jwt-simple');

const findUser = (username, password) => {
    return new Promise((resolve, reject) => {
        fs.readFile('../server/secret.json', function (err, data) {
            if (err) {
                reject({
                    status: -1,
                    error: "获取用户信息错误!(PS:读取文件错误!)"
                })
            }
            data = JSON.parse(data.toString())
            if (username !== data.username) {
                reject({
                    status: 0,
                    error: "用户未注册!"
                })
            }
            if (password !== data.password) {
                reject({
                    status: 0,
                    error: "用户密码错误!"
                })
            }
            let obj = {
                username,
                password,
            }
            var token_s = _createToken(obj, 2),
                token_l = _createToken(obj, 62);
            resolve({
                status: 1,
                username,
                intro: data.intro,
                token_s,
                token_l
            })

        })
    })
}
exports.findUser = findUser;

//token编码解码密码
const secret = 'lyencode';
const handleToken = async (token_s, token_l) => {
        var decoded_s = jwt.decode(token_s, secret),
            deadline_s = Date.now() + 2 * 24 * 3600 * 1000,
            decoded_l = jwt.decode(token_l, secret),
            deadline_l = Date.now() + 62 * 24 * 3600 * 1000;
        if (deadline_s >= decoded_s.deadline) {
            //短token在有效期内
            //通过token中的username和password查询信息
            try {
                let response = await _findUser(decoded_s.username, decoded_s.password);
                return response;
            } catch (error) {
                throw error;
            }
        }
        //短token过期，检验长token是否过期
        if(deadline_l >= decoded_l.deadline){
            //长token在有效期内
            try {
                let obj={
                    username:decoded_l.username,
                    password:decoded_l.password
                },
                token_s=_createToken(obj,2);
               let response = _findUser(decoded_l.username,decoded_l.password);
               return response
            } catch (error) {
                throw error;
            }
        }else{
            //长token过期.
            throw {
                status:0,
                error:"token过期，请重新登陆"
            }
        }
        
    

}
exports.handleToken = handleToken;

const _createToken = (payload, day) => {
    //加入过期时间
    payload = {
        ...payload,
        deadline: Date.now() + day * 24 * 3600 * 1000
    }
    const token = jwt.encode(payload, secret);
    return token;
}
const _findUser = (username, password) => {
    return new Promise((resolve,reject) => {
        fs.readFile('../server/secret.json', function(err, data){
            if(err){
                reject({
                    status: -1,
                    error: "获取用户信息错误!(PS:读取文件错误!)"
                })
            }
            resolve(JSON.parse(data.toString()))
        })
    })
}