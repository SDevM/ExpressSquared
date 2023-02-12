const { default: mongoose } = require("mongoose")
const S3Helper = require("../../../helpers/aws/s3.helper")
const JSONResponse = require("../../../helpers/json/json.helper")
const JWTHelper = require("../../../helpers/jwt/jwt.helper")
const userModel = require("../../lib/database/schemas/user.schema")

class UsersController {
  /**
   * Create a new user
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async create(req, res) {
    const body = req.body
    const now = Date.now().toString(16)
    const manageupload = await S3Helper.upload(req.file, now + "_av").catch(
      (err) => {
        JSONResponse.error(res, 500, "Failed to upload profile image", err)
      }
    )
    if (!manageupload) return
    body.profile_pic = { key: now + "_av", link: manageupload.Location }
    const new_user = new userModel(body)
    let valid = true
    await new_user.validate().catch((err) => {
      valid = false
      JSONResponse.error(
        req,
        res,
        400,
        err.errors[Object.keys(err.errors)[Object.keys(err.errors).length - 1]]
          .properties.message,
        err.errors[Object.keys(err.errors)[Object.keys(err.errors).length - 1]]
      )
    })
    if (valid) {
      const saved_user = await new_user.save().catch((err) => {
        JSONResponse.error(req, res, 400, err.message, err)
      })
      if (saved_user)
        JSONResponse.success(req, res, 201, "Registration successful")
    }
  }

  /**
   * Checks for an active user session
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async session(req, res) {
    const decoded = JWTHelper.getToken(req, res, "jwt_auth")
    if (decoded) {
      const user = await userModel.findById(decoded.self).catch((err) => {
        JSONResponse.error(req, res, 500, "Failure handling user model", err)
      })
      if (user) JSONResponse.success(req, res, 200, "Session resumed", user)
      else JSONResponse.error(req, res, 404, "Account does not exist")
    } else JSONResponse.error(req, res, 401, "No session")
  }

  /**
   * Fetches a single user by ID
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async getById(req, res) {
    const validID = mongoose.Types.ObjectId.isValid(req.params.id)
    if (validID) {
      const user = await userModel.findById(req.params.id).catch((err) => {
        JSONResponse.error(
          req,
          res,
          500,
          "Fatal error handling user model",
          err
        )
      })
      if (user)
        JSONResponse.success(req, res, 200, "Collected matching user", user)
      else JSONResponse.error(req, res, 404, "Account does not exist")
    } else JSONResponse.error(res, 401, "Invalid ObjectID")
  }

  /**
   * Fetches from the entire user collection given an optional starting point and limit
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async getLimit(req, res) {
    let { limit, startId, filterFields, filterValues, sort, sortval } =
      req.query
    let sorter = {}
    let filter = {}

    if (startId && limit) {
      if (
        Object.keys(userModel.schema.paths).includes(sort) &&
        (sortval == -1 || sortval == 1)
      )
        sorter[sort] = parseInt(sortval)
      else sorter = null

      if (
        filterFields.every((el) =>
          Object.keys(userModel.schema.paths).includes(el)
        ) &&
        filterValues.length == filterFields.length
      )
        filterFields.forEach((el, i) => {
          filter[el] = filterValues[i]
        })
      else filter = null

      filter.$gt = mongoose.Types.ObjectId(startId)
      const users = await userModel
        .find(filter)
        .sort(sorter || {})
        .limit(limit)
        .catch((err) => {
          JSONResponse.error(res, 500, "Failure handling user model", err)
        })
      if (users) JSONResponse.success(res, 200, "Users collected", users)
      else JSONResponse.error(res, 404, "No users found")
    }
  }

  /**
   * Updates the user attached to the current session
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async patch(req, res) {}

  /**
   * Updates any user
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async patchAny(req, res) {}

  /**
   * Deletes the user attached to the current session
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async delete(req, res) {}

  /**
   * Deletes any user
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async deleteAny(req, res) {}

  /**
   * Destroys the current session
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async disconnect(req, res) {}
}

module.exports = UsersController
