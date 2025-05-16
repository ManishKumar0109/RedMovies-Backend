const dbConnection = async () => {
  const mongoose = require("mongoose")
  require("dotenv").config()
  const uri = process.env.MONGOOSE_URI
  try {
    await mongoose.connect(uri)
  } catch (err) {}
}
module.exports = dbConnection
