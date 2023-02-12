require("dotenv").config()
const S3 = require("aws-sdk/clients/s3")
const { bufferToStream } = require("./converters.helper")
const { AWS_BUCKET_REGION, AWS_ACCESS_ID, AWS_ACCESS_KEY, AWS_BUCKET } =
  process.env
const s3 = new S3({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_ID,
    secretAccessKey: AWS_ACCESS_KEY,
  },
})

class S3Helper {
  /**
   * Generic promise execution
   * @param {Promise} promise
   * @param {Function} resolve
   * @param {Function} reject
   */
  static #execute(promise, resolve, reject) {
    promise
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.error(err)
        reject(err)
      })
  }

  /**
   * Upload a file's contents to s3
   * @param {File} file
   * @param {String} name
   * @returns Promise
   */
  static upload(file, name) {
    const uploadConf = {
      Bucket: AWS_BUCKET,
      Body: bufferToStream(file.buffer),
      Key: name,
    }

    return new Promise((resolve, reject) => {
      this.#execute(s3.upload(uploadConf).promise(), resolve, reject)
    })
  }

  /**
   * Delete a file from s3
   * @param {String} name
   * @returns Promise
   */
  static delete(name) {
    const deleteConf = {
      Bucket: AWS_BUCKET,
      Key: name,
    }

    return new Promise((resolve, reject) => {
      this.#execute(s3.deleteObject(deleteConf).promise(), resolve, reject)
    })
  }

  /**
   * Download a file from s3
   * @param {String} name
   * @returns
   */
  static download(name) {
    const downConf = {
      Bucket: AWS_BUCKET,
      Key: name,
    }

    return new Promise((resolve, reject) => {
      this.#execute(s3.getObject(downConf).promise(), resolve, reject)
    })
  }
}

module.exports = S3Helper
