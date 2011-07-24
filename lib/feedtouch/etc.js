exports.sanitiseUrl = function (url) {
    return (!url.match(/^https?:\/\//)) ? 'http://' + url : url;
};
exports.getTags = function (text, tagName, hint) {
    return (text) ?
        text.match(new RegExp('<\\s*' + tagName + '[^<]*' + (hint || '') + '[^<]*>', 'g')) || [] :
        [];
};
exports.getAttribute = function (text, attrName) {
    return (text && attrName && text.match(new RegExp(attrName + '='))) ?
        text.replace(new RegExp('[\\s\\S]*' + attrName + '=[\'"]'), '').replace(/['"][\s\S]*/, '') :
        null;
};