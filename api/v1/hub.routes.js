const UserRouter = require("./modules/users/hub.routes")
const router = require("express").Router()

/**
 * Generates the API Docs from the list of routes in the system and attaches descriptions to them
 * from the descriptions array, when you add routes, it will change on the next load to reflect new routes
 * automatically. They appear in the same order as they are written in the code, match the array descriptions
 * to this order.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
router.all("", (req, res) => {
  let concat = []
  for (let layer of router.stack) {
    concat.push({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods),
    })
  }
  const descriptions = [`API DOCS`]
  let body = {
    name: "Express² v1",
    version: "1.0.0",
    routes: concat,
    description: descriptions,
  }
  res.render("docs", body)
})

router.use("/user", UserRouter)

module.exports = router
