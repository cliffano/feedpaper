/*global $ document window*/
var FeedTouch = function () {
};
FeedTouch.prototype.loadHome = function (url, maxDisplay, numElems) {
    var serviceUrl = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&num=' + maxDisplay + '&q=' + encodeURIComponent(url),
        feed, entry, i, ln, title;
    for (i = 0; i < numElems; i += 1) {
        $('li#' + i).hide();
    }
    $('li#indicator').text('Loading feed...');
    $('li#indicator').show();
    $.getJSON(serviceUrl, function (data) {
        if (data.responseStatus === 200) {
            feed = data.responseData.feed;
            document.title = feed.title + ' - FeedTouch';
            $('li#indicator').hide();
            $('h1#title').text(feed.title);
            ln = (feed.entries.length > maxDisplay) ? maxDisplay : feed.entries.length;
            for (i = 0; i < ln; i += 1) {
                entry = feed.entries[i];
                if (entry.link && entry.title) {
                    $('li#' + i + ' a').text(entry.title);
                    $('li#' + i + ' a').attr('href', '/a/' + entry.link.replace(/#/, '%23').replace(/\?/, '%3F') + '?title=' + encodeURIComponent(entry.title));
                } else {
                    $('li#' + i + ' a').text('Invalid feed entry');
                }
                $('li#' + i).show();
            }
        } else {
            $('li#indicator').text('Discovering feed...');
            $('li#indicator').show();
            $.getJSON('/s/' + url, function (data) {
                var sanitiseUrl = function (_url) {
                    var sanitisedUrl = _url;
                    if (!_url.match(/^https?:\/\//)) {
                        if (_url.match(/^\//)) {
                            sanitisedUrl = url.match(/https?:\/\/[^\/]+/) + _url;
                        } else {
                            sanitisedUrl = url + '/' + _url;
                        }
                    }
                    return sanitisedUrl.replace(/#/, '%23').replace(/\?/, '%3F');
                };
                if (data && data.length > 0) {
                    ln = (data.length > maxDisplay) ? maxDisplay : data.length;
                    $('li#indicator').text('Discovered ' + ln + ' feed' + ((ln > 1) ? 's' : ''));
                    if (ln === 1) {
                        window.location = '/' + sanitiseUrl(data[0].url);
                    } else {
                        title = url.replace(/https?:\/\//, '') + ' feeds';
                        document.title = title + ' - FeedTouch';
                        $('li#indicator').hide();
                        $('h1#title').text(title);
                        for (i = 0; i < ln; i += 1) {
                            $('li#' + i + ' a').html(data[i].title || 'Untitled Feed').text();
                            $('li#' + i + ' a').attr('href', '/' + sanitiseUrl(data[i].url));
                            $('li#' + i).show();
                        }
                    }
                } else {
                    $('li#indicator').text(url.replace(/https?:\/\//, '') + ' does not have any feed');
                    $('li#indicator').show();
                    $('li#0 a').html('View the page anyway?').text();
                    $('li#0 a').attr('href', '/a/' + url.replace(/#/, '%23').replace(/\?/, '%3F') + '&title=' + encodeURIComponent(url.replace(/https?:\/\//, '')));
                    $('li#0').show();
                }
            });
        }
    });
};
FeedTouch.prototype.loadArticle = function (url, title) {
    var serviceUrl = 'http://viewtext.org/api/text?url=' + encodeURIComponent(url) + '&callback=?';
    $('div#content').html('Loading article...');
    $.getJSON(serviceUrl, function (data) {
        var heading = '<p><strong>' + title + '</strong><br/><a href="' + url + '">' + url + '</a></p>';
        if (data.content) {
            document.title = title + ' - FeedTouch';
            data.content = data.content.replace(/^\s*/, '').replace(/\s*$/, '');
            $('div#content').html(heading + data.content);
        } else {
            $('div#content').html(heading + 'Error - unable to load article');
        }
    });
};

// must be loaded after jquery and before jquerymobile
$(document).bind('mobileinit', function () {
    $.mobile.ajaxEnabled = false;
});

