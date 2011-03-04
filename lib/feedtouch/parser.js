var Parser = function () {
};
Parser.prototype.getTags = function (text, tagName, hint) {
    return (text)
        ? text.match(new RegExp('<\\s*' + tagName + '[^<]*' + (hint || '') + '[^<]*>', 'g')) || []
        : [];
};
Parser.prototype.getAttribute = function (text, attrName) {
    return (text && attrName && text.match(new RegExp(attrName + '=')))
        ? text.replace(new RegExp('[\\s\\S]*' + attrName + '=[\'"]'), '').replace(/['"][\s\S]*/, '')
        : null;
};

exports.Parser = Parser;