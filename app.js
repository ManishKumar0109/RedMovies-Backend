const express = require("express")
const dbConnection = require("./models/dbConnection")
const bcrypt = require("bcrypt")
const { userInfoModel, reviewsOfMediaModel } = require("./models/Model")
const jwt = require("jsonwebtoken")
const userAuth = require("./userAuth")
require("dotenv").config()
const Validation = require("./Validation")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cookieParser())

const corsConfig = {
  origin: [
    "https://redmovies-frontend.onrender.com",
    "https://red-movies-frontend.vercel.app/",
  ],
  credentials: true,
}
app.use(cors(corsConfig))

app.post("/logout", userAuth, async (req, res, next) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      maxAge: 0,
      sameSite: "none",
    })

    return res.status(200).json({ message: "Logged out successfully" }) // ✅ SEND RESPONSE
  } catch (err) {
    const error = new Error("Internal Server Error")
    error.statusCode = 500
    return next(error)
  }
})

app.post("/signup", async (req, res, next) => {
  const { emailId, password, name, avatar } = req.body
  const saltRounds = 10
  if (
    !emailId ||
    !password ||
    !name ||
    !avatar ||
    !Validation({ emailId, password, name, avatar })
  ) {
    const error = new Error("Invalid Credentials")
    error.statusCode = 400
    next(error)
  }

  const cleanName = name.trim().replace(/\s+/g, " ")

  try {
    const encryptedPassword = await bcrypt.hash(password, saltRounds)
    const check = await userInfoModel.findOne({ emailId: emailId })

    if (check) {
      return res
        .status(409)
        .json({ message: "User already exists. Please login." })
    }

    const data = new userInfoModel({
      emailId,
      password: encryptedPassword,
      name: cleanName,
      avatar,
    })

    await data.save()
    res.status(201).json({ message: "SignUp successfull" })
  } catch (e) {
    const error = new Error("Internal Server Error")
    error.statusCode = 500
    return next(error)
  }
})

app.post("/login", async (req, res, next) => {
  console.log("reach")
  try {
    const { emailId, password } = req.body
    if (!emailId || !password || !Validation({ emailId, password })) {
      const error = new Error("Invalid Credentials")
      error.statusCode = 400
      return next(error)
    }
    console.log("reach")
    const data = await userInfoModel.findOne({ emailId: emailId })
    if (!data) {
      const error = new Error("Wrong credentials")
      error.statusCode = 400
      return next(error)
    }
    console.log("reach")
    const check = await bcrypt.compare(password, data.password)
    if (!check) {
      const error = new Error("Wrong Credentials")
      error.statusCode = 400
      return next(error)
    }
    console.log("reach")
    const secretKey = process.env.SECRET_KEY
    const jwtToken = jwt.sign({ userId: data._id }, secretKey, {
      expiresIn: "7d",
    })
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true, // MUST be true for sameSite none
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none", // allows cross-site cookies
    })

    res.status(201).json({ message: "login successfully" })
  } catch (err) {
    console.log(err.message)
    const error = new Error("Internal Server Error")
    error.statusCode = 500
    return next(error)
  }
})

app.get("/getUser", userAuth, async (req, res, next) => {
  try {
    const userData = req.userData
    res.status(200).json({ result: userData })
  } catch (err) {
    const error = new Error("Internal Server Error")
    error.statusCode = 500
    return next(error)
  }
})

app.patch("/updateUser", userAuth, async (req, res, next) => {
  const { name, avatar, emailId } = req.body
  const { _id } = req.userData

  if (!emailId || !name || !avatar || !Validation({ emailId, name, avatar })) {
    const error = new Error("Invalid Credentials")
    error.statusCode = 400
    return next(error)
  }

  const cleanName = name.trim().replace(/\s+/g, " ")

  try {
    const user = await userInfoModel.updateOne(
      { _id: _id },
      { emailId, avatar, name: cleanName }
    )
    res.status(201).json({ message: "successfullly update the profile" })
  } catch (err) {
    const error = new Error("Internal Server Error")
    error.statusCode = 500
    return next(error)
  }
})

app.patch("/updatePassword", userAuth, async (req, res, next) => {
  const { oldPassword, newPassword } = req.body
  const { _id } = req.userData
  const saltRounds = 10
  if (
    !oldPassword ||
    !newPassword ||
    !Validation({ password: oldPassword }) ||
    !Validation({ password: newPassword })
  ) {
    const error = new Error("Invalid Credentials")
    error.statusCode = 400
    return next(error)
  }
  try {
    const user = await userInfoModel.findOne({ _id: _id })
    const check = await bcrypt.compare(oldPassword, user.password)
    if (!check) {
      const error = new Error("Invalid Password")
      error.statusCode = 400
      throw error
    }
    const encryptedPassword = await bcrypt.hash(newPassword, saltRounds)
    const userUpdated = await userInfoModel.updateOne(
      { _id: _id },
      { password: encryptedPassword }
    )
    res.status(201).json({ message: "successfullly update the password" })
  } catch (err) {
    const error = new Error("Internal Server Error")
    error.statusCode = 500
    return next(error)
  }
})

app.post("/addReview", userAuth, async (req, res, next) => {
  const { mediaId, text, mediaType, rating } = req.body

  if (
    !mediaId ||
    !text ||
    !mediaType ||
    rating === null ||
    rating < 0 ||
    rating > 10
  ) {
    return res.status(400).json({ message: "Missing required fields" })
  }
  try {
    const userId = req.userData._id
    let mediaReviewDoc = await reviewsOfMediaModel.findOne({
      mediaId,
      mediaType,
    })
    console.log(mediaReviewDoc)
    if (!mediaReviewDoc) {
      mediaReviewDoc = await new reviewsOfMediaModel({
        mediaId,
        mediaType,
        content: [],
      })
      mediaReviewDoc.content.push({
        userId: userId,
        reviews: [{ text, rating }],
      })
    } else {
      let reviewbyuser = mediaReviewDoc.content.find(
        (review) => review.userId.toString() === userId.toString()
      )

      if (reviewbyuser) {
        reviewbyuser.reviews.pop().push({ text, rating })
      } else {
        mediaReviewDoc.content.push({
          userId: userId,
          reviews: [{ text, rating }],
        })
      }
    }

    await mediaReviewDoc.save()
    res.status(201).json({ message: "successfully review added" })
  } catch (err) {
    const error = new Error("Something went wrong")
    error.statusCode = 500
    next(error)
  }
})
app.get("/getReviews", userAuth, async (req, res, next) => {
  try {
    const { mediaId, mediaType } = req.query

    const reviewOfMedia = await reviewsOfMediaModel
      .findOne({ mediaId, mediaType })
      .populate("content.userId", "name avatar _id") // <-- proper way to populate

    if (!reviewOfMedia || reviewOfMedia.content.length <= 0) {
      return res.status(200).json({ result: [] })
    }

    res.status(200).json({ result: reviewOfMedia.content })
  } catch (err) {
    const error = new Error("Something went wrong")
    error.statusCode = 500
    next(error)
  }
})

app.use((err, req, res, next) => {
  console.log(err.message)
  const statusCode = err.statusCode || 500
  const msg = err.message || "An unknown error occurred."
  res.status(statusCode).json({ message: statusCode })
})
const Port = process.env.PORT || 4000
dbConnection()
  .then(() => {
    app.listen(Port, () => {
      console.log("babe your app is listening ....")
    })
  })
  .catch((err) => {
    console.log("Could not connect to db")
  })
