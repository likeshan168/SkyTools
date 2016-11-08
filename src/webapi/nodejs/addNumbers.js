module.exports = function (callback, first, second) {
    var result = first + second;
    callback(null, result);
}