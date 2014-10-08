function slug(text) {
  return text.toLowerCase().replace(/\s/g, '-').replace(/[^a-zA-Z\-]/g, '');
}

exports.slug = slug;