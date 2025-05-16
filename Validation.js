const validator = require("validator")

const AvatarOptionsSrc = [
  "boy1.avif",
  "boy2.avif",
  "boy3.avif",
  "boy4.avif",
  "boy5.avif",
  "boy6.avif",
  "boy7.avif",
  "boy8.avif",
  "boy9.avif",
  "boy10.avif",
  "girl1.avif",
  "girl2.avif",
  "girl3.avif",
  "girl4.avif",
  "girl5.avif",
  "girl6.avif",
  "girl7.avif",
  "girl8.avif",
  "girl9.avif",
]
const Validation = (el) => {
  const { emailId, password, name, avatar } = el

  if (emailId && !validator.isEmail(emailId)) {
    return false
  }

  if (password && !validator.isStrongPassword(password)) {
    return false
  }

  if (name && !/^[a-zA-Z-]+( [a-zA-Z-]+)*$/.test(name)) {
    return false
  }

  if (avatar && !AvatarOptionsSrc.includes(avatar)) {
    return false
  }

  return true
}

module.exports = Validation
