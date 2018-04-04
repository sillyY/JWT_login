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
                intro:data.intro,
                token_s,
                token_l
            })

        })
    })
}

const _createToken = (payload, day) => {
    //加入过期时间
    payload = {
        ...payload,
        deadline: Date.now() + day * 24 * 3600 * 1000
    }
    const secret = 'lyencode',
        token = jwt.encode(payload, secret);
    return token;
}
exports.findUser = findUser;