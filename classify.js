var name = "sample",
    stringValues = [ ["foo", "qux"] ],
    numValues = [ ["quux", new Double(1)] ],
    datum = [stringValues, numValues],
    data = [datum];

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