var mongoose = require('mongoose');

var CoffeeSchema = new mongoose.Schema({
	favorite: {type: Boolean,default: false},
	rating:{type: Number,default: 0},
	coffeName:String,
	coffeeShop:String,
	coffePrice:Number
});

module.exports = mongoose.model('Coffee', CoffeeSchema);

