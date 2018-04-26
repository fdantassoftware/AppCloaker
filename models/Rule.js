var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RuleSchema = new mongoose.Schema({

    rules: [String],

    isp:Boolean,
    time:Boolean,
    country:Boolean,
    appId:String,


    createdAt: {type: Date},
});

RuleSchema.pre('save', function(next){
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('rules', RuleSchema);

