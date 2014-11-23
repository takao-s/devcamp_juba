var util = require('util'),
    twitter = require('twitter'),
    _ = require('underscore'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    TIMEOUT_MINUTES = 20;

     mongoose.connect('mongodb://localhost/Twitter');

var twit = new twitter({
    consumer_key: 'jHUTqGXxdZqIo2pdYdXwC40K3',
    consumer_secret: 'q87S4QRTnz0CDitEeOMqWRANJA4thvojB6BZYVLbxmrcSs4U4Y',
    access_token_key: '17828002-I35X5CwLorlCLFq5gyAWgCj9AwgpYAVxqRIMBcWjs',
    access_token_secret: '7WDQaK5CLrZvxiajB50j1JjXVVUimB81yfxV8wkTpUVdg'
});


var cities = {
    Tokyo:      [ "139.30", "35.55", "139.85", "35.81" ],
    Yokohama:   [ "139.35", "35.12", "139.80", "35.54" ],
    Nagoya:     [ "136.74", "35.00", "137.10", "35.32" ],
    Osaka:      [ "135.41", "34.54", "135.66", "34.86" ],
    Fukuoka:    [ "130.31", "33.53", "130.50", "33.65" ],
    Sendai:     [ "140.85", "38.24", "140.89", "38.28" ],
    Sapporo:    [ "141.26", "42.99", "141.46", "43.15" ],
    Kagoshima:  [ "130.44", "31.51", "130.62", "31.62" ],
    Dummy:      [ "135.00", "31.00", "135.20", "31.10" ]
};

var track = [
    "scandal",
    "scandal_band",
    "scandal_rina",
    "scandal_tomomi",
    "scandal_mami",
    "scandal_haruna",
    "thebawdies",
    "roythebawdies",
    "taxthebawdies",
    "jimthebawdies",
    "marcythebawdies"
];

var locations = [];
_.each(cities, function(loc){
    locations = locations.concat(loc);
});

var TweetSchema, Tweet;

var typeMap = {
    number   : Number,
    string   : String,
    boolean  : Boolean,
    object   : Object,
    function : Function
};

function makeSchema(data) {
    var schema = {};
    for (var x in data) {
        var type = typeof data[x];
        if (data[x] === null) {
            schema[x] = Object;
        } else if (type === 'object') {
            schema[x] = makeSchema(data[x]) ;
        } else {
            schema[x] = typeMap[type];
        }
    }
    return schema;
}

var params = {lang: "ja"};
if (!_.isEmpty(track)) { params.track = track; }
if (!_.isEmpty(locations)) { params.locations = locations.join(','); }

console.log(util.inspect(params));

twit.stream('filter', params, function(stream) {
    stream.on('data', function(data) {
        if (data.coordinates) {

            if (!TweetSchema) {
                 TweetSchema = new Schema( makeSchema(data, '') );
                 Tweet = mongoose .model('Tweet', TweetSchema);
            }

            var tweet = new Tweet(data);
            // console.log(util.inspect(data.text));
            // console.log('-------------');
            tweet.save( function(err) {
                if (err) console.error(err);
            });
        }
    })
    .on('end', function(){
        console.log("stream end");
        process.exit();
    })
    .on('error', function(){
        stream.destroy();
        console.log("stream error!");
        process.exit(1);
    });
    setTimeout(stream.destroy, TIMEOUT_MINUTES * 60000);
});

process.on('uncaughtException', function (err) {
    console.log('uncaughtException => ' + err);
});


return;
