var util = require('util'),
    jubatus = require("jubatus"),
    classifier = new jubatus.classifier.client.Classifier(9199, "localhost"),
    _ = require('underscore'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var Double = jubatus.msgpack.type.Double;

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

mongoose.connect('mongodb://localhost/Twitter');

var TweetSchema, Tweet;
TweetSchema = new Schema({});
Tweet = mongoose.model('Tweet', TweetSchema);


function removeHashtag(text, hashtags) {
    var _text = '', indices = {}, pos = 0;
    _.each(hashtags, function(hashtag){
        indices[hashtag.indices[0]] = hashtag.indices[1];
    });
    _.each(indices, function(next, begin){
        _text += text.substring(pos, begin);
        pos = next;
    });
    _text += text.substring(pos);
    return _text;
}

function getLabel(coordinates) {
    var _coordinates = coordinates.coordinates,
        _label;
    // console.log(_coordinates);
    _.each(cities, function(city, label){
        if (parseFloat(city[0]) <= _coordinates[0] &&
            _coordinates[0] <= parseFloat(city[2]) &&
            parseFloat(city[1]) <= _coordinates[1] &&
            _coordinates[1] <= parseFloat(city[3])) {
            _label = label;
        }
    });
    return _label;
}


Tweet.find({}, function(err, docs) {
    _.each(docs, function(doc){
        var tweet = doc._doc;
        if (!tweet.coordinates) { return; }
        var hashtags = tweet.entities.hashtags;
        var text = removeHashtag(tweet.text, hashtags);
        var label = getLabel(tweet.coordinates);
        if (!label) {return;}
        console.log(label);
        var str = [[["text", text]]];
        var datum = [label, str];
        var data = [ datum ];
        classifier.train('sample', data, function (error, result) {
            if (error) {
                throw error;
            }
        });
    });
    // process.exit();
});
