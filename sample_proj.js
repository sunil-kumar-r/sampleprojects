var express  = require('express')
var app = module.exports = express()
var cors = require('cors');
var bodyParser = require('body-parser');
var config = require('./config')
var db = require('./db')

app.use(express.static(__dirname));
app.use(bodyParser.json({limit: '500mb'})); 
app.use(bodyParser.urlencoded({limit: '500mb', extended: true, parameterLimit: 1000000}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors({origin: '*'}));

//CLIENT APIS
app.use('/sample_proj/api/generateRandomData' , require('./controllers/sample_controller/generateRandomData'))

app.use((req,res,next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
})

app.use((error,req,res,next) => {
  res.status(error.status || 500)
  console.log(error.stack);
  res.json({error:{message:error.message}})
})
// app.use("/api",router);

db.connect('mongodb://localhost:27017/' , function(err) {
  if (err) {
    console.log('unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(config.port, function() {
      console.log(`Starting Client Server on port ${config.port} ...`)
      console.log(`Connected to ${config.databaseName} ...`)
    })
  }
})
