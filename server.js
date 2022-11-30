require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require("morgan")
const methodOverride = require('method-override')
const PORT = process.env.PORT
const app = express() 
app.use("/static", express.static("public")) 

const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

  mongoose.connect(DATABASE_URL, CONFIG)

  mongoose.connection
  .on("open", () => console.log("Connected to Mongoose"))
  .on("close", () => console.log("Disconnected from Mongoose"))
  .on("error", (error) => console.log(error))

  const {Schema, model} = mongoose

  // make fruits schema
  const animalSchema = new Schema({
      name: String,
      species: String,
      extinct: Boolean,
      location: String,
      lifeExpectancy: Number
  })
  
  // make fruit model
  const Animal = model("Animal", animalSchema)


app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))
app.use(express.static("static"))



app.get('/animals/seed', (req, res) => {

    const startAnimals = [
        {name: 'Kangaroo', species: 'Marsupial', extinct: false, location: 'Australia', lifeExpectancy: 40},
        {name: 'Lion', species: 'Feline', extinct: false, location: 'Africa', lifeExpectancy: 25},
        {name: 'Tyrannosaurus', species: 'Dinosaur', extinct: true, location: 'In The Dirt', lifeExpectancy: 30},
        {name: 'Cobra', species: 'Reptile', extinct: false, location: 'Asia', lifeExpectancy: 15},


    ]

    Animal.deleteMany({}, (err, data) => {

        Animal.create(startAnimals, (err, fruits) => {

            res.json(fruits);
        })
    })
})

//index
app.get('/animals', (req, res) => {
    Animal.find({})
    .then((data) => {
        console.log(data)
        res.render('index.ejs',{data});
    })
})

//new
app.get('/animals/new', (req, res) => {
    res.render('new.ejs')
})

//create
app.post('/animals', (req, res) => {
    req.body.extinct = req.body.extinct === 'on' ? true : false
    Animal.create(req.body,(err, animal) => {
        console.log(animal)
        res.redirect('/animals')
    })
})
//edit page
app.get('/animals/:id/edit', (req, res) => {
    Animal.findById(req.params.id, (err, foundAnimal) => {
        res.render('edit.ejs', 
        {animal: foundAnimal})
    })
})

//edit post
app.put('/animals/:id', (req, res) => {

    req.body.extinct = req.body.extinct === 'on'?true : false

    Animal.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, data) =>{
        console.log(err)
        res.redirect(`/animals/${req.params.id}`)
    })
})


//show
app.get('/animals/:id', (req, res) => {
    Animal.findById(req.params.id)
    .then((animal) => {
        res.render('show.ejs', {animal})
    })
    
})

app.delete('/animals/:id',(req, res) => {
    Animal.findByIdAndDelete(req.params.id, (err, data) => {
        res.redirect('/animals')
    })
})





app.listen(PORT, (req, res) => {console.log(`Good on ${PORT}`)})