const UserRouter = require("express").Router()

UserRouter.route("/auth").post().get()

UserRouter.route("/collection").post().get().patch().delete()

UserRouter.route("/:id").get().patch().delete()

module.exports = UserRouter
