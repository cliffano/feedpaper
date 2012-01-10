function FeedTouch() {

  // encode URI component with special characters handling
  function _encode(component) {
    return encodeURIComponent(component)
      .replace(/#/, '%23')
      .replace(/\?/, '%3F')
      .replace(/'/, '%E2%80%99');  
  }

  // sanitise feed URL, ensure it has protocol and host
  function _sanitise(page, feed) {

    var sanitised = feed;
    if (!sanitised.match(/^https?:\/\//)) {

      if (!feed.match(/^\//)) {
        sanitised = '/' + sanitised;
      }

      if (!page.match(/^https?:\/\//)) {
        page = 'http://' + page;
      }

      sanitised = page + sanitised;
    }

    return _encode(sanitised);
  }

  function home(url, max) {
    
    $('li#indicator').text('Loading feed...');
    $('li#indicator').show();

    var service = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&num=' + max + '&q=' + encodeURIComponent(url);
    $.getJSON(service, function (data) {

      // it is a feed, display feed entries
      if (data.responseStatus === 200) {

        var feed = data.responseData.feed;
        document.title = feed.title + ' - FeedTouch';
        
        $('li#indicator').hide();
        $('h1#title').text(feed.title);
        
        feed.entries.forEach(function (entry) {
          $('li#indicator').before('<li><a href="' + '/a/' + _encode(entry.link) + '?title=' + _encode(entry.title) + '">' + entry.title + '</a></li>');
        });
        $('ul#items').listview('refresh');

      // not a feed, attempt to discover feeds
      } else {

        $('li#indicator').text('Discovering feed...');
        $('li#indicator').show();

        $.getJSON('/s/' + url, function (data) {

          // feed discovered
          if (data && data.length > 0) {

            $('li#indicator').text('Discovered ' + data.length + ' feed' + ((data.length > 1) ? 's' : ''));

            if (data.length === 1) {
              window.location = '/' + _sanitise(url, data[0].url);
            } else {

              var title = url.replace(/https?:\/\//, '') + ' feeds';
              document.title = title + ' - FeedTouch';
              
              $('li#indicator').hide();
              $('h1#title').text(title);
              
              data.forEach(function (feed) {
                if (feed.title) {
                  $('li#indicator').before('<li><a href="/' + _sanitise(url, feed.url) + '">' + feed.title + '</a></li>');
                }
              });
              $('ul#items').listview('refresh');
            }

          // no feed
          } else {

            $('li#indicator').text(url.replace(/https?:\/\//, '') + ' does not have any feed');
            $('li#indicator').show();
            $('li#indicator').after('<li><a href="">View the page anyway?</a>');
            $('ul#items').listview('refresh');
          }
        });
      }
    });
  }

  // load article, title will be displayed on the page prior to content retrieval
  function article(url, title) {
    $('div#content').html('Loading article...');

    var service = 'http://viewtext.org/api/text?url=' + encodeURIComponent(url) + '&callback=?';
    $.getJSON(service, function (data) {

      var heading = '<p><strong>' + title + '</strong><br/><a href="' + url + '">' + url + '</a></p>';
      if (data.content) {
    
        document.title = title + ' - FeedTouch';
        data.content = data.content.replace(/^\s*/, '').replace(/\s*$/, '');
        $('div#content').html(heading + data.content);
      
      } else {

        document.title = 'Error - FeedTouch';
        $('div#content').html(heading + 'Error unable to load article - ' + JSON.stringify(data));

      }
    });
  }

  return {
    home: home,
    article: article
  };
}