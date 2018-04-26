var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CountrySchema = new mongoose.Schema({

    name:[String],
    appId:String,
    createdAt: {type: Date},
});

CountrySchema.pre('save', function(next){
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('country', CountrySchema);

