class UsersController {
  /**
   * Create a new user
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static create(req, res) {}

  /**
   * Checks for an active user session
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static session(req, res) {}

  /**
   * Fetches from the entire user collection with options
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static getAny(req, res) {}

  /**
   * Updates the user attached to the current session
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static patch(req, res) {}

  /**
   * Updates any user
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static patchAny(req, res) {}

  /**
   * Deletes the user attached to the current session
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static delete(req, res) {}

  /**
   * Deletes any user
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static deleteAny(req, res) {}

  /**
   * Destroys the current session
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static disconnect(req, res) {}
}

module.exports = UsersController
