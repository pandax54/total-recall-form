// now we're gonna create a file just with the route (paths)

const express = require('express')
const fs = require("fs")
const data = require('./data.json')
//const form = require('./form') // requiring the function(req,res) {...}

// var for the routes
const routes = express.Router()


routes.get("/", function(req, res) {

    return res.render("index")
})

routes.get("/subscribe", function(req,res) {
    return res.render("form/subscribe")
})

routes.get("/update", function(req,res) {
    return res.render("form/update")
})

routes.get("/edit", function(req,res) {
    return res.render("form/user-form")
})

routes.get("/complete", function(req,res) {
    return res.render("form/form-complete")
})

routes.get('/:id', function(req, res) {
    const {id} = req.params 
    
    const foundUser = data.recall.find(user => {
      return id == user.id
      // return true or false
    })
    if (!foundUser) return res.send("Not Found")

    const userInfo = {
        ... foundUser,
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundUser.created_at)
      }
    
    //return res.send("Found!!") // test
    return res.render("form/foundUser", { userInfo })
  })

  routes.get("/:id/edit", function(req, res) {

    //get the id object
    const {id} = req.params 
    
    const foundUser = data.recall.find(user => {
      return id == user.id
      // return true or false
    })
    if (!foundUser) return res.send("Not Found")

      return res.render("form/edit", { foundUser })
  })



routes.get("/notfound", function(req,res) {
    return res.render("form/notFound")
})

// POST REQUEST - when you submit your form
routes.post('/subscribe', function(req, res) {

   const keys = Object.keys(req.body)

   for (key of keys) {
       if (req.body[key] == "") {
           return res.send("Please, fill all fields. We need this information to complete the memory you've request")
       }
    }

    
       // destructuring req.body
       const {name, gender, alienStuff, destination, sexualOrientation, rolePlaying} = req.body
       // let because I'm gonna alter the id variable
       //data.recall.push(req.body) 
       
       const id = Number(data.recall.length + 1)
       const created_at = Date.now()

       data.recall.push({
        id,
        created_at,
        name, 
        gender, 
        alienStuff, 
        destination, 
        sexualOrientation, 
        rolePlaying
       })

       fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("ERROR")

       //return res.render("form/form-complete")
        return res.redirect('/complete')
       })
   

  })

  routes.put('/subscribe', function(req, res) {
	const {id} = req.body
  const foundUser = data.recall.find(user => {
      return id == user.id
      // return true or false
    })
    if (!foundUser) return res.send("Not Found")
	
  	const userInfo = {
    	... foundUser,
      ...req.body //the new info must come after to rewritten the info
  	}
    
    // to find the position in the array rememeber to substract 1, we need this so the new info will overwritten the old one and not create another user
    data.recall[id-1] = userInfo
  // use the function to write into the file
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send("Write error!!!")
    // now redirect to the form complete
    return res.redirect(`/${id}`)
  })
  
})


module.exports = routes 