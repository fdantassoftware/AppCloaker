"use strict";

var list = require('../models/list');
var mongoose = require('mongoose');
var express = require('express');
var Layout = require('../models/layout');
var Card = require('../models/cards');
var List = require('../models/list');
var FalseList = require('../models/FalseList');
var App = require('../models/AppId');
var Rule = require('../models/Rule');
var ISP = require('../models/ISP');
var Country = require('../models/Country');
var moment = require('moment-timezone');
var CItems = require('../models/cItems');
var http = require("http");
var moment = require('moment-timezone');
var timediff = require('timediff');



var rulesArray = {};
var path = true;



var router = express.Router();
mongoose.connect('mongodb://fabiothimba:fabio1993@ds231559.mlab.com:31559/canvegas');
var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error', err);
});
db.once('open', function () {
    console.log('connected to database');
});

//Get querytag
function getByValue(arr, id) {

    var result = arr.filter(function (o) {
        return o.id == id;
    });

    return result ? result[0] : null; // or undefined


}

Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};


function showFalseList(appId, req, res) {


    FalseList.find({'appId': appId, 'category':req.body.platform}, function (err, data) {
        if (err) {
            console.log('Error while fetching data ' + err);

        } else {


            if (data != null) {
                res.json(data);
            }
        }
    })
}

function showTrueList(appId, req, res) {

    List.find({'appId': appId, 'category':req.body.platform}, function (err, data) {
        if (err) {
            res.send(err);

        } else {


            if (data != null) {

                res.json(data);
            }
        }
    })

}


router.getAllItems = function(req, res) {






}

router.getAllLists = function (req, res) {

    path = true;

    var data = req.body;
    // TODO change that to be req.ip when ready to production
    // var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // if (ip.substr(0, 7) == "::ffff:") {
    //   ip = ip.substr(7)
    // }
    var ip = req.body.ip;



    var isSimulator = req.body.isSimulator;

    if (isSimulator === 'true') {
        console.log("Showing false");
        showFalseList(req.body.appId, req, res);
    } else {
        fetchIpData(ip, function (data) {
            if (data != null) {


                checkRules(data, req.body.time, req.body.appId, function (result) {

                    getRulesFromAppId(req.body.appId, function(rules) {

                        if (rules != null) {

                            if(typeof rules[0] !== "undefined") {
                              if (rules[0].rules.length === 0) {
                                path = false;
                              } else {
                                for (var i = 0; i < rules[0].rules.length; i++) {
                                    if (rulesArray.hasOwnProperty(rules[0].rules[i])) {

                                        if (rulesArray[rules[0].rules[i]] === false) {
                                            path = false;

                                        }

                                    }

                                }
                              }

                            } else {
                                path = false;
                            }

                            if (path) {
                                console.log("Showing true");
                                showTrueList(req.body.appId, req, res)
                            } else {
                                console.log("Showing false");
                                showFalseList(req.body.appId, req, res)
                            }


                        } else {

                            showFalseList(req.body.appId, res)
                        }
                    })



                });



            } else {
                console.log("Problem getting data from IP");
            }
        });
    }


}


function fetchIpData(ip, callback) {

    var data = {};

    var options = {
        host: "pro.ip-api.com",
        path: "/json/" + ip + "?key=IiABfdCqBD4FB0e",
        port: 80
    };

    http.get(options, function (res) {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
            rawData += chunk;
        });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                var vis_countryCode = parsedData.countryCode;
                var vis_region = parsedData.regionName;
                var vis_city = parsedData.city;
                var vis_timezone = parsedData.timezone;
                var vis_isp = parsedData.isp;
                var vis_country = parsedData.country;

                // Get time from time zone
                var clientHour = moment().tz(vis_timezone).format('HH');
                var clientMinutes = moment().tz(vis_timezone).format('mm');

                // Object to hold ip Data
                data.countryCode = vis_countryCode;
                data.region = vis_region;
                data.city = vis_city;
                data.clientHours = clientHour;
                data.clientMinutes = clientMinutes;
                data.isp = vis_isp;
                data.country = vis_country;
                callback(data);

            } catch (e) {
                console.error(e + "http. get error");
                callback(null);
            }

        });

    }).on('error', function (e) {
        callback(null);
        console.log("Got error: " + e.message);
    });


}

router.AddApp = function (req, res) {

    var app = new App();
    app.name = req.body.name;
    app.countryCode = req.body.countryCode;
    app.countryName = req.body.countryName;

    app.save(function (err) {
        if (err)
            res.send(err);

        res.json({message: 'list Added!', data: app});
    });

}


router.findAllApps = function (req, res) {
    App.find(function (err, lists) {
        if (err) {
            res.send(err);
        } else {

            res.json(lists);
        }
    });
}


router.findOneApp = function (req, res) {


    App.find({"_id": req.params.id}, function (err, app) {
        if (err) {
            res.json({message: 'List NOT Found!', errmsg: err});
        } else {
            res.json(app);
        }

    });

}

router.updateApp = function (req, res) {

    App.find({'_id': req.body.id}, function (err, data) {
        if (err) {
          res.send(err);
        } else {
            var app = data[0];
            app.name = req.body.name;
            app.save(function (err, data) {
                if (err) {
                    res.send(err);
                } else {

                }
            })
        }

    });

}

// ISPS

router.findAllIsps = function (req, res) {


    ISP.find({"appId": req.body.appId}, function (err, isp) {
        if (err) {
            res.json({message: 'List NOT Found!', errmsg: err});
        } else {

            res.json(isp);
        }

    });
}

router.addIsps = function (req, res) {
    ISP.find({'appId': req.body.appId}, function (err, data) {
        if (err) {
            res.send(err);
        } else {

            if (data.length > 0) {

                var isp = data[0];
                isp.kws = req.body.ispstext.split('\n');
                isp.kws = isp.kws.unique();
                isp.save(function (err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({message: 'list Added!', data: isp});
                    }
                })


            } else {
                var isp = new ISP();
                isp.kws = req.body.ispstext.split('\n');
                isp.kws = isp.kws.unique();
                isp.appId = req.body.appId;
                isp.save(function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({message: 'list Added!', data: isp});
                    }


                });
            }

        }

    });


}


// Countries

router.addCountries = function (req, res) {

    Country.find({'appId': req.body.appId}, function (err, data) {
        if (err) {
            res.send(err);
        } else {

            if (data.length > 0) {

                var country = data[0];
                country.name = req.body.countryText.split('\n');
                country.name = country.name.unique();
                country.save(function (err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({message: 'list Added!', data: country});
                    }
                })


            } else {
                var country = new Country();
                country.name = req.body.countryText.split('\n');
                country.name = country.name.unique();
                country.appId = req.body.appId;
                country.save(function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({message: 'list Added!', data: country});
                    }


                });
            }

        }

    });


}

router.findAllCountries = function (req, res) {


    Country.find({"appId": req.body.appId}, function (err, country) {
        if (err) {
            res.json({message: 'List NOT Found!', errmsg: err});
        } else {
            res.json(country);
        }

    });

}


// Rules

router.addRule = function (req, res) {

    Rule.find({'appId': req.body.appId}, function (err, data) {
        if (err) {
          res.send(err);
        } else {

            if (data.length > 0) {

                var rule = data[0];
                rule.isp = req.body.ispCheck;
                rule.time = req.body.timeCheck;
                rule.country = req.body.countryCheck;

                if (req.body.timeCheck === true) {
                    rule.rules.push('time');
                } else {
                    rule.rules =  rule.rules.filter(e => e !== 'time');
                }

                if (req.body.countryCheck === true) {
                    rule.rules.push('country');
                } else {
                    rule.rules =  rule.rules.filter(e => e !== 'country');
                }


                if (req.body.ispCheck === true) {
                    rule.rules.push('isp');
                } else {
                    rule.rules =  rule.rules.filter(e => e !== 'isp');
                }

                rule.rules = rule.rules.unique();


                rule.save(function (err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({message: 'list Added!', data: rule});
                    }
                })


            } else {
                var rule = new Rule();
                rule.isp = req.body.ispCheck;
                rule.time = req.body.timeCheck;
                rule.country = req.body.countryCheck;
                rule.appId = req.body.appId;

                if (req.body.timeCheck === true) {
                    rule.rules.push('time');
                }

                if (req.body.countryCheck === true) {
                    rule.rules.push('country');
                }


                if (req.body.ispCheck === true) {
                    rule.rules.push('isp');
                }

                rule.rules = rule.rules.unique();


                rule.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json({message: 'list Added!', data: rule});
                });
            }

        }

    });


}

router.getAllRules = function(req, res) {



    Rule.find({'appId':req.body.appId}, function (err, rules) {
        if (err) {
            res.send(err);
        } else {



            res.json(rules);
        }
    });

}


// App


router.deleteApp = function (req, res) {
    App.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            res.send(err);
        else

            res.json({message: 'App Deleted!', data: App});
    });
}

// False List

router.AddFalseList = function (req, res) {



    var falseList = new FalseList();
    falseList.name = req.body.name;
    falseList.category = req.body.category;
    falseList.description = req.body.description;
    falseList.icon = req.body.icon;
    falseList.cardIds = '';
    falseList.appId = req.body.appId;
    falseList.carouselItem = {
        cname: req.body.nameOfCarouselItem,
        imageUrl: req.body.carouselImageUrl
    };

    falseList.save(function (err) {
        if (err)
            res.send(err);

        res.json({message: 'list Added!', data: list});
    });
}

router.deleteFalseList = function(req, res) {
    FalseList.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            res.send(err);
        else

            res.json({message: 'App Deleted!', data: App});
    });
}


router.findOneFalseList = function(req, res) {

    FalseList.find({"_id": req.params.id}, function (err, list) {
        if (err)
            res.json({message: 'List NOT Found!', errmsg: err});
        else
            res.json(list);
    });

}

router.findAllLFalseLists = function (req, res) {

    FalseList.find(function (err, lists) {
        if (err) {
            res.send(err);
        } else {

            res.json(lists);
        }
    });
}

router.updateFalseList = function(req, res) {

    FalseList.findById(req.params.id, function (err, list) {
        if (err)
            res.send(err);
        else {

            list.name = req.body.name;
            list.category = req.body.category;
            list.icon = req.body.icon;
            list.description = req.body.description;
            list.cardIds = req.body.cardIds;


            var id = req.params.id;



            FalseList.findByIdAndUpdate(id, {
                $set: {
                    "name": list.name,
                    "category": list.category,
                    "description": list.description,
                    "icon": list.icon,
                    "cardIds": list.cardIds
                }
            }, {upsert: false}, function (err, list) {
                if (err)
                    res.send(err)
                else
                    res.send("successfully updated " + list);


            });


        }
        ;
    });

}

router.updateFalseListId = function(req, res) {


    FalseList.find({"_id": req.body.id}, function (err, list) {

        if (err) {
            res.json({message: 'List NOT Found!', errmsg: err});
        } else {




            for (var i = 0; i < list[0].cardIds.length; i++) {

                if (list[0].cardIds[i] === req.body.casinoId) {
                    list[0].cardIds.splice(i, 1);
                }

                list[0].save(function (err) {

                    if (err) {
                        res.send(err);
                    } else {
                        console.log("List Ids updated");
                    }
                });

            }

            res.json(list);

        }


    });

}

router.updateListId = function(req, res) {

    List.find({"_id": req.body.id}, function (err, list) {

        if (err) {
            res.json({message: 'List NOT Found!', errmsg: err});
        } else {

            if(typeof list[0] !== 'undefined') {


                for (var i = 0; i < list[0].cardIds.length; i++) {

                    if (list[0].cardIds[i] === req.body.casinoId) {
                        list[0].cardIds.splice(i, 1);
                    }

                    list[0].save(function (err) {

                        if (err) {
                            res.send(err);
                        } else {
                            console.log("List Ids updated");
                        }
                    });


                }

            }



            res.json(list);

        }


    });

}

// Checks device Country

// Params on body post are:
// Country = Code

router.getAllListsByCountry = function (req, res) {
    const country = req.body.country
    List.find({"country": country}, function (err, list) {
        if (err)
            res.send(err);
        else if (list.length > 0) {
            res.json(list);

        } else {
            List.find({"country": "Def"}, function (error, defaultList) {
                if (error) {
                    res.send(err);
                } else {
                    res.json(defaultList);
                }

            });
        }
    });

}

//Defaults look up
router.home = function (app, passport, req, res, next) {
    //route to handle all angular requests

    res.sendFile('../public/index.ejs'); // load our public/index.ejs file
}

//Finding all items

router.findAll = function (req, res) {


    Card.find( function (err, cards) {
        if (err) {
            res.send(err);
        } else {

            res.json(cards);
        }
    });

}
router.findAllList = function (req, res) {

    List.find(function (err, lists) {
        if (err) {
            res.send(err);
        } else {

            res.json(lists);
        }
    });

}

function CallWebAPI(ip, tm, resglobal, ov, callback) {

    if (ov) {
        Casino.find(function (err, casinos) {
            if (err) {
                resglobal.send(err);
            } else {
                resglobal.json(casinos);
            }
        });
    }
    else {
        var options = {
            host: "pro.ip-api.com",
            path: "/json/" + ip + "?key=IiABfdCqBD4FB0e",
            port: 80
        };

        http.get(options, function (res) {
            //console.dir(res);
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    var vis_countryCode = parsedData.countryCode;
                    var vis_region = parsedData.regionName;
                    var vis_city = parsedData.city;
                    var vis_timezone = parsedData.timezone;
                    var vis_isp = parsedData.isp;
                    var vis_country = parsedData.countryCode;
                    var c = moment.tz(1403454068850, vis_timezone);
                    c.format();

                    var format = 'YYYY/MM/DD HH:mm:ss ZZ';
                    var time = new Date();
                    visitorTime = moment().tz(vis_timezone).format();
                    var properT = moment(tm).format(format);


                    // console.log(moment(time, format).tz(vis_timezone).format(format)+ "in last moment clonsole log");
                    var t = moment(time, format).tz(vis_timezone).format(format);
                    var tHours = moment().tz(vis_timezone).format('hh');



                    var theStringMinusOne = tm.slice(0, -5);

                    var dateObj = new Date(Date.parse(theStringMinusOne));

                    var apiHour = moment(dateObj).format('hh');


                    var diff = tHours - apiHour;



                    if (diff > 1 || diff < -1) {
                        console.log("time rule false");
                    }
                    else {
                        console.log("Time rule true");
                        ruleTime = true;
                    }

                    var isps = ["Shaw CommunicationsTelus", "CommunicationsRogers",
                        "CableBell", "CanadaBell", "MobilityCogeco", "CableEastLinkSaskTelBell",
                        "AliantMTS", "AllstreamVideotron", "LteeGlobalive", "Wireless Management Corp", "Virgin Media Ireland"
                    ];
                    for (var i = isps.length - 1; i >= 0; i--) {

                        if (isps[i] === vis_isp) {


                            ruleISP = true;

                        }
                    }
                    var countryList = ["se2", "ie2", "ca2", "nz2", "ch2", "at2", "de2", "fi2", "au2"];


                    for (var i = countryList.length - 1; i >= 0; i--) {
                        if (countryList[i] == vis_country.toLowerCase()) {

                            ruleCountry = true;
                        }
                    }


                    if (ruleISP && ruleTime && ruleCountry) {

                        path = true;
                    }

                    callback(resglobal);


                } catch (e) {
                    console.error(e.message + "http.get eror");
                }

            });

        }).on('error', function (e) {
            console.log("Got error: " + e.message);
        });
    }


}

router.findAllLayout = function (req, res) {


    Layout.find(function (err, layouts) {
        if (err)
            res.send(err);

        res.json(layouts);
    });


}
//Finding One Item
router.findOne = function (req, res) {

    Card.find({"_id": req.params.id}, function (err, card) {
        if (err)
            res.json({message: 'Card NOT Found!', errmsg: err});
        else
            res.json(card);
    });
}
router.findOneList = function (req, res) {

    List.find({"_id": req.params.id}, function (err, list) {
        if (err)
            res.json({message: 'List NOT Found!', errmsg: err});
        else
            res.json(list);
    });
}
router.findOneLayout = function (req, res) {

    Layout.find({"_id": req.params.id}, function (err, layout) {
        if (err)
            res.json({message: 'Layout NOT Found!', errmsg: err});
        else
            res.json(layout);
    });
}
//Adding section
router.addList = function (req, res) {


    var list = new List();
    list.name = req.body.name;
    list.category = req.body.category;
    list.description = req.body.description;
    list.icon = req.body.icon;
    list.cardIds = '';
    list.appId = req.body.appId;
    list.carouselItem = {
        cname: req.body.nameOfCarouselItem,
        imageUrl: req.body.carouselImageUrl
    };




    // Save the list and check for errors
    list.save(function (err) {
        if (err)
            res.send(err);

        res.json({message: 'list Added!', data: list});
    });

}


router.getOneList = function(req, res) {
  List.find({'_id':req.body.id}, function(error, data) {
    if (error) {
      res.send(error);
    } else {
      res.json(data);
    }
  })
}

router.getOneFalseList = function(req, res) {
  FalseList.find({'_id':req.body.id}, function(error, data) {
    if (error) {
      res.send(error);
    } else {
      res.json(data);
    }
  })
}




router.editlist = function(req, res) {

  List.find({'_id':req.body.id}, function(error, data) {
    if (error) {
      res.send(error);
    } else {
      var list = data[0];
      list.name = req.body.name;
      list.description = req.body.description;
      list.nameOfCarouselItem = req.body.nameOfCarouselItem;
      list.appId = req.body.appId;
      list.category = req.body.category;
      if (req.body.icon != '') {
        list.icon = req.body.icon;
      }
      if (req.body.carouselImageUrl != '') {
        list.carouselItem.imageUrl = req.body.carouselImageUrl;
      }


      list.save(function(error, data) {
        if (error) {
          res.send(error);
        } else {
          res.send(data);
        }
      })
    }

  })






}


router.editFalseList = function(req, res) {

  FalseList.find({'_id':req.body.id}, function(error, data) {
    if (error) {
      res.send(error);
    } else {
      var list = data[0];
      list.name = req.body.name;
      list.description = req.body.description;
      list.nameOfCarouselItem = req.body.nameOfCarouselItem;
      list.appId = req.body.appId;
      list.category = req.body.category;
      if (req.body.icon != '') {
        list.icon = req.body.icon;
      }
      if (req.body.carouselImageUrl != '') {
        list.carouselItem.imageUrl = req.body.carouselImageUrl;
      }


      list.save(function(error, data) {
        if (error) {
          res.send(error);
        } else {
          res.send(data);
        }
      })
    }

  })






}
router.addLayout = function (req, res) {


    var layout = new Layout();
    layout.imageUrl = req.body.imageUrl;
    layout.bonusText = req.body.bonusText;
    layout.bonusTextLower = req.body.bonusTextLower;
    layout.outLink = req.body.outLink;



    // Save the layout and check for errors
    layout.save(function (err) {
        if (err)
            res.send(err);

        res.json({message: 'layout Added!', data: layout});
    });

}
router.addCard = function (req, res) {


    var card = new Card();
    card.logo = req.body.logo;
    card.bonus = req.body.bonus;
    card.name = req.body.name;
    card.rank = req.body.rank;
    card.reviewContent = req.body.reviewContent;
    card.ratings = [];
    card.ratings.push({"name": "Customer Service", "rate": req.body.customerRating});
    card.ratings.push({"name": "Reputation", "rate": req.body.reputationRating});
    card.ratings.push({"name": "Coverage", "rate": req.body.coverageRating});
    card.ratings.push({"name": "Ease of use", "rate": req.body.easeRating});
    card.path = req.body.path;
    card.appId = req.body.appId;




    // Save the card and check for errors
    card.save(function (err) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(card));
    });

}
//Delete Section

router.deleteCard = function (req, res) {

    Card.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            res.send(err);
        else
        // USE CAPITAL C TO LINK WITH THE MODEL
            res.json({message: 'Card Deleted!', data: Card});
    });
}
router.deleteList = function (req, res) {

    List.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            res.send(err);
        else
            res.json({message: 'List Deleted!', data: list});
    });
}
router.deleteLayout = function (req, res) {
    Layout.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            res.send(err);
        else
            res.json({message: 'Layout Deleted!', data: card});
    });

}
//Update section
router.updateLayout = function (req, res) {

    Layout.findById(req.params.id, function (err, layout) {
        if (err) {
          res.send(err);
        } else {

            layout.imageUrl = req.body.imageUrl;
            layout.bonusText = req.body.bonusText;
            layout.outLink = req.body.outLink;


            var id = req.params.id;


            Layout.findOneAndUpdate({_id: id}, {
                $set: {
                    "imageUrl": layout.imageUrl,
                    "bonusText": layout.bonusText, "outLink": layout.outLink,
                }
            }, {upsert: true}, function (err, layout) {
                if (err)
                    res.send(err)
                else
                    res.send("successfully updated");


            });


        }

    });

}
router.updateList = function (req, res) {

    List.findById(req.params.id, function (err, list) {
        if (err)
            res.send(err);
        else {

            list.name = req.body.name;
            list.category = req.body.category;
            list.icon = req.body.icon;
            list.description = req.body.description;
            list.cardIds = req.body.cardIds;


            var id = req.params.id;



            List.findByIdAndUpdate(id, {
                $set: {
                    "name": list.name,
                    "category": list.category,
                    "description": list.description,
                    "icon": list.icon,
                    "cardIds": list.cardIds
                }
            }, {upsert: false}, function (err, list) {
                if (err)
                    res.send(err)
                else
                    res.send("successfully updated " + list);


            });


        }
        ;
    });

}

router.updateCard = function (req, res) {

    var card =  req.body.casino;
    Card.find({'_id':card._id}, function(error, data) {
        if (error) {
            res.send(error)
        } else {
            data[0].logo = card.logo;
            data[0].bonus = req.body.form.bonus;
            data[0].name = req.body.form.name;
            data[0].rank = req.body.form.rank;
            data[0].reviewContent = req.body.form.reviewContent;
            data[0].ratings = [];
            data[0].ratings.push({"name": "Customer Service", "rate": req.body.form.customerRating});
            data[0].ratings.push({"name": "Reputation", "rate": req.body.form.reputationRating});
            data[0].ratings.push({"name": "Coverage", "rate": req.body.form.coverageRating});
            data[0].ratings.push({"name": "Ease of use", "rate": req.body.form.easeRating});
            data[0].path = req.body.form.path;
            data[0].appId = req.body.form.appId;
            data[0].save(function(error, data) {
                if (error) {
                    res.send(error);
                } else {
                    res.send(data);
                }
            })

        }
    })


}

router.getCard = function (req, res) {

    Card.find({'_id':req.body.id}, function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.json(data[0]);
        }
    })
}


router.findOneCItem = function (req, res) {

    CItems.find({"_id": req.params.id}, function (err, cItem) {
        if (err)
            res.json({message: 'CItem NOT Found!', errmsg: err});
        else
            res.json(cItem);
    });
}

router.findAllCItems = function (req, res) {

    CItems.find(function (err, CItems) {
        if (err) {
            res.send(err);
        } else {
            res.json(CItems);
        }
    });

}
router.addCItem = function (req, res) {


    var cItem = new CItems();
    cItem.link = req.body.link;
    cItem.category = req.body.category;
    cItem.image = req.body.image;
    cItem.offerTitle = req.body.offerTitle;
    cItem.offerDesc = req.body.offerDesc;




    // Save the card and check for errors
    cItem.save(function (err) {
        if (err)
            res.send(err + "from router");

        res.json({message: 'cItem Added!', data: cItem});
    });

}


router.deleteCItem = function (req, res) {
    CItems.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            res.send(err);
        else
            res.json({message: 'cItem Deleted!', data: CItems});
    });
}

router.updateCItem = function (req, res) {
    CItems.findById(req.params.id, function (err, cItem) {
        if (err)
            res.send(err);
        else {

            cItem.link = req.body.link;
            cItem.category = req.body.category;
            cItem.image = req.body.image;
            cItem.offerTitle = req.body.offerTitle;
            cItem.offerDesc = req.body.offerDesc;
            var id = req.params.id;


            Card.findByIdAndUpdate(id, {
                $set: {
                    "link": cItem.link,
                    "category": cItem.category,
                    "image": cItem.image,
                    "offerTitle": cItem.offerTitle,
                    "offerDesc": cItem.offerDesc
                }
            }, {upsert: true}, function (err, cItem) {
                if (err)
                    res.send(err)
                else
                    res.send("successfully updated " + CItems);
            });

        }
        ;
    });

}



function checkRules(ipData, deviceTime, appId, callback) {


    rulesArray = {};


    checkTime(ipData, deviceTime, function(timeResult) {

        rulesArray.time = timeResult;

        checkCountry(ipData, appId, function(countryResult) {


            rulesArray.country = countryResult;


            checkIsp(ipData, appId, function(ispResult) {
                rulesArray.isp = ispResult;

                callback();

            })

        })


    })




}

function checkTime(ipData, deviceTime, callback) {

    var deviceTime = deviceTime.split(":");

    var deviceHours = deviceTime[0];
    var deviceMinutes = deviceTime[1];

    console.log(ipData.clientHours);
    console.log(deviceHours);

    if (parseInt(ipData.clientHours) == parseInt(deviceHours)) {


        var result = parseInt(ipData.clientMinutes) - parseInt(deviceMinutes)

        // Give a 5 minutes discrepancy in case the difference is very small which means the rule should pass

        if (result >= -5 && result <= 5) {
            console.log("Time passed");
            callback(true);
        } else {
            console.log("Time Failed");
            callback(false);
        }
    } else {
        console.log("Time Failed");
        callback(false);
    }


}

function checkCountry(ipData, appId, callback) {

    getCountryFromAppID(appId, function(country) {

        if (country != null) {

            getAllCountriesFromAppId(appId, function (countries) {
                if (countries != null) {

                    if(typeof countries[0] !== "undefined") {
                        if (countries[0].name.includes(ipData.country)) {
                            callback(true);
                        } else {
                            callback(false);
                        }

                    } else {
                        callback(false);
                    }


                } else {
                    callback(false);
                }

            })

        } else {
            callback(false);
        }

    })

}

function checkIsp(ipData, appId, callback) {

    getAllIspsFromAppId(appId, function (isps) {

        if (isps != null) {

            if(typeof isps[0] !== "undefined") {
                if (isps[0].kws.includes(ipData.isp)) {
                    callback(true);

                } else {
                    callback(false);
                }
            } else {
                callback(false);
            }



        } else {
            callback(false);
        }


    })



}

function getCountryFromAppID(appId, callback) {

    App.find({"name": appId}, function (err, app) {
        if (err) {
            res.send(err);
            callback(null);
        } else {

            callback(app[0].countryName);
        }

    });

}

function getAllCountriesFromAppId(appId, callback) {
    Country.find({"appId": appId}, function (err, countries) {
        if (err) {
            res.send(err);
            callback(null)
        } else {
            callback(countries);
        }

    });
}


function getAllIspsFromAppId(appId, callback) {
    ISP.find({"appId": appId}, function (err, isps) {
        if (err) {
            res.send(err);
            callback(null)
        } else {
            callback(isps);
        }

    });
}

function getRulesFromAppId(appId, callback) {
    Rule.find({"appId": appId}, function (err, rules) {
        if (err) {
            res.send(err);
            callback(null);
        } else {
            callback(rules);
        }

    });
}


module.exports = router;
