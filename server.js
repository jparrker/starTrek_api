//required dependencies

const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8000
require('dotenv').config()

//Declared db variables
let db,
     dbConnectionStr = process.env.DB_STRING,
     dbName = 'startrek-facts'
//connected to mongodb
MongoClient.connect(dbConnectionStr)
  .then(client => {
    console.log(`connected to ${dbName}`)
    db = client.db(dbName)
  })

//set middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())


//CRUD, routes
app.get("/", (request, response) => {
   db.collection('aliens').find().toArray()
    .then(data => {
      let nameList = data.map(item => item.speciesName)
      console.log(nameList)
      response.render('index.ejs', {info: nameList})
    })
    .catch(error => console.log(error))


})

app.post("/api", (request, response) => {
  console.log('Post heard')
  db.collection('aliens').insertOne(
    request.body
  )
  .then(result => {
    console.log(result)
    response.redirect("/")
  })
  .catch(error => console.error(error))

})

app.put("/updateEntry", (request, response) => {
  console.log(request.body)
  Object.keys(request.body).forEach(key => {
    if(request.body[key] === null || request.body[key] === undefined || request.body[key] === ""){
      delete request.body[key]
    } 
  })
  console.log(request.body)
  db.collection("aliens").findOneAndUpdate(
    {name: request.body.name},
    {
        $set: request.body
    }
  )
  .then(result => {
    console.log(result)
    response.json('Success')
  })
  .catch(error => console.error(error))
})


app.delete("/deleteEntry", (request, response) => {
  db.collection('aliens').deleteOne(
    {name: request.body.name}

  )
  .then(result => {
    console.log('entry deleted')
    response.json("Entry deleted")
  })
  .catch(error => console.error(error))
})

app.listen(process.env.PORT || PORT, () => {
  console.log(`The server is running on port ${PORT}`)
})




