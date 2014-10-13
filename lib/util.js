function slug(text) {
  return text.toLowerCase().replace(/\s/g, '-').replace(/[^0-9a-zA-Z\-]/g, '');
}

exports.slug = slug;