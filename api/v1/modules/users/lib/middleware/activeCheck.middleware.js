const JWTHelper = require('../../../../../helpers/jwt/jwt.helper')

/**
 * Verify the active state of an account
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const activeCheck = async (req, res, next) => {
  let decoded = JWTHelper.getToken(req, res, "jwt_auth")
  let result
  switch (decoded.type) {
    case 1:
      result = await userModel.findById(decoded.self)
      if (!result.active) {
        JSONResponse.error(req, res, 401, "Email unverified")
        return
      } else next()
      break
    default:
      next()
  }
}

module.exports = activeCheck
