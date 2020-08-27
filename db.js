var MongoClient = require('mongodb').MongoClient
var config = require('./config')

var state = {
  db: null,
}

exports.connect = function(url, done) {
  if(state.db) return done()
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err,database){
    // state.db = database.db('mythri')
    if(database){
        state.db = database.db(config.databaseName)
        done()
    }else{
    console.log('database not defined');
    }
  })
}

exports.get = function() {
  return state.db
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err,result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}
