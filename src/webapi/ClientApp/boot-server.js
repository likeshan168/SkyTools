module.exports = function (params) {
    return new Promise(function (resolve, reject) {
        var result = '<h1>Hello world!</h1>'
            + '<p>Is gold user: ' + params.data.isGoldUser + '</p>'
            + '<p>Number of cookies: ' + params.data.cookies.length + '</p>';

        resolve({ html: result });
    });
};