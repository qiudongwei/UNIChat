const fs = require('fs')

const USER_FILE = `${process.cwd()}/data/user.json`

function getUserInfo (id) {
  let userInfo = null
  const info = fs.readFileSync(USER_FILE, {encoding: 'utf-8'})
  const data = JSON.parse(info)
  const users = Object.keys(data)
  const ids = users.map(each => data[each])
  const index = ids.findIndex(each => each === id)

  if(index !== -1) {
    userInfo = {
        username: users[index]
    }
  }
  return userInfo
}

function getFriendList () {
  const info = fs.readFileSync(USER_FILE, {encoding: 'utf-8'})
  const data = JSON.parse(info)
  return data
}

module.exports = {
  getUserInfo,
  getFriendList
}