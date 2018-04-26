var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardsSchema = new mongoose.Schema({
	
	logo:String,
	bonus: String,
	name: String,
    rank: String,
    ratings: { type: Array, default: void 0 },
    reviewContent: String,
    path: String,
    appId: String,
	// review: String,
	// banner: String,
	// tp: {type: Boolean,default: false},
	createdAt: {type: Date},
});

CardsSchema.pre('save', function(next){
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('cards', CardsSchema);

