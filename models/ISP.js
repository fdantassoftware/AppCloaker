var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ISPSchema = new mongoose.Schema({

    kws:[String],
    appId:String,
    createdAt: {type: Date},
});

ISPSchema.pre('save', function(next){
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('isp', ISPSchema);

