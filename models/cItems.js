var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarouselItems = new mongoose.Schema({
	
	link:String,
	category: String,
	image: String,
	offerTitle: String,
	offerDesc: String,
	

	createdAt: {type: Date},
});

CarouselItems.pre('save', function(next){
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('cItems', CarouselItems);

