const  express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const router = express.Router()
//创建本地数据库
mongoose.connect('mongodb://localhost:27017',{ useNewUrlParser: true });
router.use(bodyParser.urlencoded({extended:false}))
router.use(bodyParser.json())
//创建保存用户信息的集合
const userInfo = new mongoose.Schema({
    username: String,
    password: String,
})
const User = mongoose.model('/index', userInfo)

module.exports = router
