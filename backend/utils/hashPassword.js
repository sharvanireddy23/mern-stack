const bcrypt = require("bcryptjs")
const salt = bcrypt.genSaltSync(10)

const hashPassword = password =>bcrypt.hashSync(password,salt)
const comparePasswords = (inputPassoword,hashedPassword)=>bcrypt.compareSync(inputPassoword,hashedPassword)
module.exports = {hashPassword, comparePasswords}
