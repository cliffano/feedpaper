App.populator('feed', function (page, data) {
  $(page).find('.app-title').text(data.title);
  $.getJSON('/data/feed/' + data.id + '/articles', function (articles) {
    articles.forEach(function (article) {
      var li = $('<li class="app-button">' + article.title + '</li>');
      li.on('click', function () {
        App.load('article', article);
      });
      $(page).find('.app-list').append(li);
    });
  });
});

App.populator('article', function (page, data) {
  $(page).find('.app-title').text(data.title.substring(0, 30));
  $.getJSON('/data/article/' + data.url, function (article) {
    var content =
    '<p><strong>' + article.title + '</strong><br/>' +
    '<a href="' + article.url + '">' + article.url + '</a></p>' +
    article.content;
    $(page).find('.app-content').html(content);
  });
});