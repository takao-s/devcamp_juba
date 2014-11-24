var util = require('util'),
    jubatus = require("jubatus"),
    classifier = new jubatus.classifier.client.Classifier(9199, "localhost"),
    text;

process.argv.forEach(function (val, index, array) {
    if (index === 2) {
        text = val;
    }
});

if (!text) {
    console.log("param not exits");
    process.exit();
}

var name = "sample";
var data = [[[["text", text]]]];

classifier.classify(name, data, function (error, result) {
    if (error) {
        throw error;
    }

    result.forEach(function (estimateResults) {
        var mostLikely = estimateResults
                .map(function (estimateResult) {
                    return { label: estimateResult[0], score: estimateResult[1] };
                })
                .reduce(function (previous, current) {
                    return previous.score > current.score ? previous : current;
                }, { label: null, score: NaN });
        console.log("estimate = %j", mostLikely);
    });
});