var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AppSchema = new mongoose.Schema({

    name:String,
    countryCode:String,
    countryName:String,
    createdAt: {type: Date},
});

AppSchema.pre('save', function(next){
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('app', AppSchema);

