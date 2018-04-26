var casino = require('../models/casinos');
var mongoose = require('mongoose');
var express = require('express');
var Design = require('../models/design');
var Casino = require('../models/casinos');

var router = express.Router();














mongoose.connect('mongodb://cinekson:cinek"93@ds151004.mlab.com:51004/hunter');

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error', err);
});
db.once('open', function () {
    console.log('connected to database');
});


function getByValue(arr, id) {

  var result  = arr.filter(function(o){return o.id == id;} );

  return result ? result[0] : null; // or undefined


}


router.home = function(app, passport, req, res, next) {
  //route to handle all angular requests

  res.sendFile('../public/index.ejs'); // load our public/index.ejs file
}

router.findAll = function(req, res) {
  // Return a JSON representation of our list
    Casino.find(function(err, casinos) {
        if (err)
            res.send(err);

        res.json(casinos);
    });
}

router.findOne = function(req, res) {

    Casino.find({ "_id" : req.params.id },function(err, casino) {
        if (err)
            res.json({ message: 'Casino NOT Found!', errmsg : err } );
        else
            res.json(casino);
    });
}

router.findDesign = function(req,res) {
    Design.find(function(err,design){
        if (err)
            res.send(err);
        res.json(design);
    });
}
router.addDesign = function(req, res) {

   

    var design = new Design();
    design.siteLogo = req.body.siteLogo;
    design.siteTitle = req.body.siteTitle;
    design.bannerBackground = req.body.bannerBackground;
    design.bannerHeading = req.body.bannerHeading;
    design.backgroundImage = req.body.backgroundImage;
    design.backgroundColor = req.body.backgroundColor;
    design.content = req.body.content;
   

    
    console.log('Adding Design: ' + JSON.stringify(design));

    // Save the coffee and check for errors
    design.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'design Added!', data: design });
    });
    
}
router.addCasino = function(req, res) {

   

    var casino = new Casino();
    casino.casino = req.body.casino;
    casino.bonus = req.body.bonus;
    casino.rating = req.body.rating;
    casino.picture = req.body.picture;
    casino.color = req.body.color;
    casino.link = req.body.link;
    casino.review = req.body.review;

    
    console.log('Adding Casino: ' + JSON.stringify(casino));

    // Save the coffee and check for errors
    casino.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Casino Added!', data: casino });
    });
    
}

router.deleteCasino = function(req, res) {

    Casino.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.send(err);
        else
            res.json({ message: 'Casino Deleted!', data: casino});
    });
}


router.updateCasino = function(req, res) {
     console.log("Im in update casino 1 ");
    Casino.findById(req.params.id, function(err,casino) {
        if (err)
            res.send(err);
        else {
            console.log("Im in update casino 2");
             casino.casino = req.body.casino;
             casino.bonus = req.body.bonus;
             casino.rating = req.body.rating;
             casino.picture = req.body.picture;
             casino.color = req.body.color;
            casino.link = req.body.link
            casino.review = req.body.review
            var id = req.params.id;
            

            Casino.findOneAndUpdate({_id:id}, {$set : {"casinoName": casino.casino, "casinoBonus": casino.casinoBonus,"rating": casino.rating,"casinoPicture": casino.picture,"casinoColor": casino.color,"casinoLink": casino.link,"casinoReview": casino.review }}, {upsert: true}, function(err, casino){
                if(err)
                    res.send(err)
                else
                    res.send("successfully updated");


            });


        };
    });

}

module.exports = router;