const router = require("express").Router()
const UserRouter = require("./modules/users/routes/hub.routes")

router.user("/user", UserRouter)

module.exports = router
