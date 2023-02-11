// Organize Dependencies
const express = require("express")
const cors = require("cors")

// Parse Configuration
require("dotenv").config()
const {
  APP_NAME,
  DESCRIPTION,
  CONTACT,
  ACTIVE_VERSION_LIST,
  CORS,
  DOMAIN,
  PORT,
  SERVER_MODE,
} = process.env

// Initialize App and API Versions
const app = express()
app.all("", (req, res) => {
  res.render("landing", {
    Title: APP_NAME,
    Description: DESCRIPTION,
    Contact: CONTACT,
    Versions: ACTIVE_VERSION_LIST,
  })
})

// View Engine
app.set("views", "templates")
app.set("view engine", "ejs")

JSON.parse(ACTIVE_VERSION_LIST).forEach((version) => {
  app.use(`/api/${version}`, require(`./api/${version}/hub.routes.js`))
})

// CORS Middleware
const WHITELIST = JSON.parse(CORS)
app.use({
  origin: function (origin, callback) {
    if (WHITELIST.indexOf(origin) !== -1 || WHITELIST.indexOf("*") !== -1) {
      console.log(
        "CORS bypassed with wildcard! Please remember not to use this behavior in production."
      )
      callback(null, true)
    } else {
      callback(new Error("Unauthorized Access!"))
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
})

// Body Parsing Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Start express app
switch (SERVER_MODE) {
  case "production":
    const _app = app.listen(PORT, require("os").hostname(), () => {
      console.log(
        `\n\t${APP_NAME} listening on https://${_app.address().address}:${
          _app.address().port
        }\n`
      )
    })
    break

  case "distmode":
    app.get("*.*", express.static("dist/", { maxAge: "1y" }))
    app.get("/*", (req, res) => {
      res.status(200).sendFile(`/`, { root: "dist/" })
    })
    break

  default:
    app.listen(PORT, () => {
      console.log(`\n\tServer listening on ${DOMAIN}:${PORT}\n`)
    })
    break
}
