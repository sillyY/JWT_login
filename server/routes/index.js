const router = require('koa-router')()
const util = require('../public/javascripts/util');

router.post('/auth', async (ctx, next) => {
  try {
    var response = await util.handleToken(ctx.request.body.token_s, ctx.request.body.token_l)
    ctx.body = {
      response
    }
  } catch (error) {
    ctx.body = {
      error
    }
  }
})

router.post('/login', async (ctx, next) => {
  try {
    let userInfo = await util.findUser(ctx.request.body.username, ctx.request.body.password);
    ctx.body = userInfo
  } catch (error) {
    ctx.response.error = {...error}
  }
})
module.exports = router
