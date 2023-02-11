const adminCheck = require("../../lib/middleware/adminCheck.middleware")
const UsersController = require("./controller")

const UserRouter = require("express").Router()

UserRouter.route("/auth")
  .post(UsersController.create)
  .get(UsersController.session)
  .patch(UsersController.patch)
  .delete(UsersController.disconnect)

UserRouter.use(adminCheck)

UserRouter.route("/collection").get(UsersController.getAny)

UserRouter.route("/:id")
  .get(UsersController.getAny)
  .patch(UsersController.patchAny)
  .delete(UsersController.deleteAny)

module.exports = UserRouter
