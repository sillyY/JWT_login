const router = require('koa-router')()
const util = require('../public/javascripts/util');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.post('/auth', async (ctx, next) => {
  try {
    var token_s = await util.handelToken(ctx.request.body.token_s)
    
  } catch (error) {
    
  }
})

router.post('/login', async (ctx, next) => {
  try {
    let userInfo = await util.findUser(ctx.request.body.username, ctx.request.body.password);
    ctx.body = userInfo
  } catch (error) {
    ctx.body = error
  }
})
module.exports = router
