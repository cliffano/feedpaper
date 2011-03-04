var Url = function () {
};
Url.prototype.sanitise = function (url) {
    if (!url.match(/^https?:\/\//)) {
        url = 'http://' + url;
    }
    return url;
};

exports.Url = Url;