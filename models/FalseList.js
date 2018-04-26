var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FalseSchema = new mongoose.Schema({

    name:String,
    category: String,
    icon: String,
    description: String,
    appId: String,
    cardIds: { type: Array, default: void 0 },

    carouselItem: {
        cname: String,
        imageUrl: String
    },


    createdAt: {type: Date},
});

FalseSchema.pre('save', function(next){
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('falselist', FalseSchema);

