const JWTHelper = require("../../../../../helpers/jwt/jwt.helper")

/**
 * Verify the admin state of an account
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const adminCheck = async (req, res, next) => {
  let decoded = JWTHelper.getToken(req, res, "jwt_auth")
  let result
  switch (decoded.type) {
    case 1:
      result = await userModel.findById(decoded.self)
      if (!result.admin) {
        JSONResponse.error(req, res, 401, "This account lacks authorization")
        return
      } else next()
      break
    default:
      next()
  }
}

module.exports = adminCheck
