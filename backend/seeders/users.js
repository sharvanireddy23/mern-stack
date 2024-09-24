const bcrypt = require("bcryptjs")
const ObjectId = require("mongodb").ObjectId
const users = [
      {
    name: 'raju',
    lastName: 'bhai',
    email: 'raju@bhai.com',
    password: bcrypt.hashSync('raju@bhai.com', 10),
    isAdmin: true,
  },
  {
    _id:new ObjectId("66db3d0216e057704631430a"),
    name: 'venky',
    lastName: 'maicherla',
    email: 'venky@maicherla.com',
    password: bcrypt.hashSync('venky@maicherla.com', 10),
  },
]

module.exports = users
