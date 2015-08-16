var path = require('path');
var glob = require('glob');
 
module.exports = {
    entry: (function () {
        var entry = {};
        glob.sync('./js/src/**/main.js').forEach(function (name) {
            console.log(name);

            var key = name.replace('/src/', '/dist/');
            entry[key] = name;
        });
 
        console.log(entry);
        return entry;
    }()),
    output: {
        path: __dirname,
        filename: "[name]"
    },
};