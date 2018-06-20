const express = require('express');
const parser = require('body-parser');
const app = express();

app.use(parser.json());
app.use(parser.urlencoded({extended: true}));


const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

MongoClient.connect("mongodb://localhost:27017", function(err, client){
  if (err) {
    console.log(err);
    return;
  }

  const db = client.db("shopping_list");
  console.log("Connected to database");

  // CREATE

  app.post("/api/shopping-list", function(req, res, next){
    const itemsCollection = db.collection("items");
    const itemsToSave = req.body;
    itemsCollection.save(itemsToSave, function(err, result){
      if (err) next(err);
      res.status(201);
      res.json(result.ops[0]);
    })
  })

  // INDEX
app.get("/api/shopping-list", function(req, res, next){
  const itemsCollection = db.collection("items");
  itemsCollection.find().toArray(function(err, shoppingList){
    if (err) next(err)
    res.json(shoppingList)
  })
})

// DELETE
app.delete("/api/shopping-list", function(req, res, next){
  const itemsCollection = db.collection("items");
  itemsCollection.remove({}, function(err, result){
    if (err) next(err);
    res.status(200).send();
  })
})


// UPDATE
app.post("/api/shopping-list/:id", function(req, res, next){
  const itemsCollection = db.collection("items");
  const objectID = ObjectID(req.params.id);
  itemsCollection.update({_id: objectID}, req.body, function(err, result ){
    if (err) next(err)
    res.status(201).send();
    // res.json(result.ops[0]);
  })
})



  app.listen(3000, function(){
    console.log("Listening on port 3000");
  });

});
