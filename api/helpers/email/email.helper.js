require("dotenv").config()
const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASSWORD } = process.env
var nodemailer = require("nodemailer")

class Emailer {
  #transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  })

  constructor() {}
  /**
   * Sends an email to the intended recipient.
   * @param {String | Array<String>} to - The recipient or recipient array for the email
   * @param {String} sub - The subject of the email
   * @param {String} body - The body of the email
   */
  sendMail(to, sub, body) {
    let mailOptions = {
      to: to,
      from: EMAIL_USER,
      subject: sub,
      text: body,
    }
    this.#transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error)
        throw error
      } else {
        console.log("Email sent: " + info.response)
      }
    })
  }
}

module.exports = new Emailer()
