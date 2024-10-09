const bcrypt = require("bcryptjs")
const ObjectId = require("mongodb").ObjectId
const users = [
      {
    name: 'sony',
    lastName: 'palla',
    email: 'sony@gmail.com',
    password: bcrypt.hashSync('sony@gmail.com', 10),
    isAdmin: true,
  },
  {
    _id:new ObjectId("66db3d0216e057704631430a"),
    name: 'sharvani ',
    lastName: 'reddy',
    email: 'sharvani@gmail.com',
    password: bcrypt.hashSync('sharvani@gmail.com', 10),
  },
]

module.exports = users
