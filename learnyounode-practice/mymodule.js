const fs = require('fs')
const path = require('path')

module.exports = function (dir, filterStr, callback) {
  fs.readdir(dir, function (err, list) {
    if (err) {
      return callback(err)
    }

    const filteredList = list.filter(function (file) {
      return path.extname(file) === '.' + filterStr
    })

    callback(null, filteredList)
  })
}