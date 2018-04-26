var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LayoutSchema = new mongoose.Schema({
	

	imageUrl:String,
	bonusText: String,
	bonusTextLower: String,
	outLink: String,
	// tp: {type: Boolean,default: false},
	createdAt: {type: Date},

});

LayoutSchema.pre('save', function(next){
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('layout', LayoutSchema);

