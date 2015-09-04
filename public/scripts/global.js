App.populator('feed', function (page, data) {

  function successCb(data, status, xhr) {
    $(page).find('.app-list').children().remove();
    data.forEach(function (article) {
      var li = $('<li class="app-button" data-back="true" data-autotitle>' + article.title + '</li>');
      li.on('click', function () {
        App.load('article', article);
      });
      $(page).find('.app-list').append(li);
    });
  }

  function errorCb(xhr, errType, err) {
    $(page).find('.app-list').children().remove();
    var li = $('<li class="app-button" data-back="true" data-autotitle>' + err + ' - ' + xhr.responseText + '</li>');
    $(page).find('.app-list').append(li);
  }

  document.title = data.title + ' | Feedpaper';
  localStorage.breadCrumb = JSON.stringify({ category: data.categoryTitle, feed: data.title });
  $(page).find('.app-title-hook').text(data.title);

  $.ajax({
    type    : 'GET',
    url     : '/data/feed/' + data.id + '/articles',
    dataType: 'json',
    success : successCb,
    error   : errorCb
  });

  if (typeof ga !== 'undefined') {
    ga('send', 'pageview', '/data/feed/' + data.id + '/articles');
  }

});

function _populateArticle(page, data) {

  function successCb(data, status, xhr) {
    var content =
      '<h2>' + data.title + '</h2>' +
      '<p class="features"><a href="' + data.url + '">source</a> | ' +
      '<a href="/a/' + data.url + '">permalink</a></p>' +
      data.content;
    document.title = data.title + ' | Feedpaper';

    if (localStorage.breadCrumb) {
      var breadCrumb = JSON.parse(localStorage.breadCrumb);
      $(page).find('.app-title-hook').html(breadCrumb.category + ' | ' + breadCrumb.feed);
    } else {
      $(page).find('.app-title-hook').html('Feedpaper');
    }

    $(page).find('#article').html(content);
  }

  function errorCb(xhr, errType, err) {
    document.title = 'Error | Feedpaper';
    $(page).find('.app-title-hook').text('Error');
    $(page).find('#article').html(err + ' - ' + xhr.responseText);
  }

  $.ajax({
    type    : 'GET',
    url     : '/data/article/' + data.url,
    dataType: 'json',
    success : successCb,
    error   : errorCb
  });

  if (typeof ga !== 'undefined') {
    ga('send', 'pageview', '/data/article/' + data.url);
  }
}

App.populator('article', function (page, data) {
  _populateArticle(page, data);
});
App.populator('feedpaper-article', function (page, data) {
  delete localStorage.breadCrumb;
  _populateArticle(page, data);
});
