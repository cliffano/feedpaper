// ensure url has protocol, if none exist then default http will be added
function sanitise(url) {
  return (!url.match(/^https?:\/\//)) ? 'http://' + url : url;
}

// extract all tags with specified name, within a piece of text
function tags(text, name, hint) {
  return (text) ?
    text.match(new RegExp('<\\s*' + name + '[^<]*' + (hint || '') + '[^<]*>', 'gi')) || [] :
    [];
}

// extract attribute with specified name, within a piece of text
function attribute(text, name) {
  return (text && name && text.match(new RegExp(name + '='))) ?
    text.replace(new RegExp('[\\s\\S]*' + name + '=[\'"]'), '').replace(/['"][\s\S]*/, '') :
    null;
}

exports.sanitise = sanitise;
exports.tags = tags;
exports.attribute = attribute;