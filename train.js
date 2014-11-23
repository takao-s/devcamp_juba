var util = require('util'),
    jubatus = require("jubatus"),
    // classifier = new jubatus.classifier.client.Classifier(9199, "localhost"),
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

Tweet.find({}, function(err, docs) {
    _.each(docs, function(doc){
        var tweet = doc._doc;
        // if (!tweet.coordinates) { return; }
        var hashtags = tweet.entities.hashtags;
        var text = removeHashtag(tweet.text, hashtags);
        if (hashtags.length) {
            console.log(hashtags);
            console.log(text);
        }
    });
    process.exit();
});

/*
var name = "sample",
    stringValues = [ ["foo", "bar"] ],
    numValues = [ ["quux", 0.1] ],
    datum = [stringValues, numValues],
    label = "baz",
    data = [ [label, datum] ];

classifier.train(name, data, function (error, result) {
    if (error) {
        throw error;
    }
});

*/