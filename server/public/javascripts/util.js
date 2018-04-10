const fs = require('fs');
const jwt = require('jwt-simple');
/**
 * 登陆处理函数，用于登陆
 * 
 * @param {string} username 
 * @param {string} password 
 * @returns 
 */
const findUser = async (username, password) => {

    var userInfo;
    try {
        userInfo = await _findUser(username, password);
        console.log(userInfo);
    } catch (error) {
        throw new Error(error);
    }

    //用户不存在
    if (userInfo === undefined) {
        return {
            status: 2001,
            message: "用户未注册!"
        }
    }
    //密码识别
    if (password !== userInfo.password) {
        return {
            status: 2001,
            message: "用户密码错误!"
        }
    }
    //存储用户数据，用于生成token
    var obj = {
        username,
        password,
    };
    //生成长token：token_l,短token:token_s
    var token_s = _createToken(obj, 2),
        token_l = _createToken(obj, 62);

    return {
        status: 2000,
        token: {
            token_s,
            token_l
        }
    }
}
exports.findUser = findUser;

//token编码解码密码
const secret = 'lyencode';

/**
 * 处理token函数，用于自动登陆
 * 
 * @param {string} token_s 
 * @param {string} token_l 
 * @returns 
 */
const handleToken = async (token_s, token_l) => {
    var decoded_s = jwt.decode(token_s, secret), //短token
        now = Date.now(), //当前时间
        decoded_l = jwt.decode(token_l, secret);//长token
    if (now <= decoded_s.deadline) {
        //短token在有效期内
        //通过token中的username和password查询信息
        try {
            let response = await _findUser(decoded_s.username, decoded_s.password);
            return {
                status: 2000,
                userInfo: {
                    username: response.username,
                    intro: response.intro
                }
            }
        } catch (error) {
            throw error;
        }
    }
    //短token过期，检验长token是否过期
    if (now <= decoded_l.deadline) {
        //长token在有效期内
        try {
            let obj = {
                username: decoded_l.username,
                password: decoded_l.password
            },
                token_s = _createToken(obj, 2);

            let response = await _findUser(decoded_l.username, decoded_l.password);
            return {
                status: 2000,
                userInfo: {
                    username: response.username,
                    intro: response.intro
                },
                token: {
                    token_s
                }
            }
        } catch (error) {
            throw error;
        }
    } else {
        //长token过期.
        return {
            status: 2002,
            error: "token过期，请重新登陆"
        }
    }
}
exports.handleToken = handleToken;
/**
 * 生成token
 * 
 * @param {object} payload 
 * @param {number} day 
 * @returns 
 */
const _createToken = (payload, day) => {
    //加入过期时间
    payload = {
        ...payload,
        deadline: Date.now() + day * 24 * 3600 * 1000
    }
    const token = jwt.encode(payload, secret);
    return token;
}
/**
 * 从文件中读取用户数据
 * 
 * @param {any} username 
 * @param {any} password 
 * @returns 
 */
const _findUser = (username, password) => {
    return new Promise((resolve, reject) => {
        //从文件中读取用户数据
        fs.readFile('../server/secret.json', function (err, data) {
            if (err) {
                reject({
                    status: 1001,
                    message: "获取用户信息错误!(PS:读取文件错误!)"
                })
            }
            data = JSON.parse(data.toString());
            //用户筛选，筛选出用户名存在的用户。
            data = data.filter(result => result.username === username);
            resolve(data[0]);
        })
    })
}