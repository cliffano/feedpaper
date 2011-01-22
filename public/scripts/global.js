var FeedTouch = function () {
};
FeedTouch.prototype.loadFeed = function (feedUrl, maxDisplay, numElems) {
	var url = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&num=' + maxDisplay + '&q=' + encodeURIComponent(feedUrl),
	    feed, entry, i, ln;
	for (i = 0; i < numElems; i++) {
	    $('li#' + i).hide();
	}
    $('li#indicator').text('Loading feed...');
	$('li#indicator').show();
	$.getJSON(url, function (data) {
		if (data.responseStatus === 200) {
			feed = data.responseData.feed;
			document.title = feed.title + ' - FeedTouch';
		    $('li#indicator').hide();
		    $('h1#title').text(feed.title);
		    ln = (feed.entries.length > maxDisplay) ? maxDisplay : feed.entries.length;
		    for (i = 0; i < ln; i++) {
	 		    entry = feed.entries[i];
	 		    if (entry.link && entry.title) {
			        $('li#' + i + ' a').text(entry.title);
			        $('li#' + i + ' a').attr('href', '/article?url=' + entry.link.replace(/#/, '%23').replace(/\?/, '%3F') + '&title=' + encodeURIComponent(entry.title));
		        } else {
		            $('li#' + i + ' a').text('Invalid feed entry');
		        }
			    $('li#' + i).show();
		    }
		} else {
			$('li#indicator').text('Discovering feed...');
			$('li#indicator').show();
			$.getJSON('/s/' + feedUrl, function (data) {
				if (data && data.length > 0) {
					var title = 'Feeds from ' + feedUrl.replace(/https?:\/\//, '');
					document.title = title + ' - FeedTouch';
					$('li#indicator').hide();
					$('h1#title').text(title);
					ln = (data.length > maxDisplay) ? maxDisplay : data.length;
				    for (i = 0; i < ln; i++) {
						$('li#' + i + ' a').html(data[i].title || 'Untitled Feed').text();
						$('li#' + i + ' a').attr('href', '/' + data[i].url);
						$('li#' + i).show();
					}
				} else {
					$('li#indicator').text('Error - Unable to load feed');
					$('li#indicator').show();					
				}
			});
		}
	});
};
FeedTouch.prototype.loadArticle = function (articleUrl, articleTitle) {
    var url = 'http://viewtext.org/api/text?url=' + encodeURIComponent(articleUrl) + '&callback=?';
    $('div#content').html('Loading article...');
    $.getJSON(url, function (data) {
        var heading = '<p><strong>' + articleTitle + '</strong><br/><a href="' + articleUrl + '">' + articleUrl + '</a></p>';
        if (data.content) {
            document.title = articleTitle + ' - FeedTouch';
            data.content = data.content.replace(/^\s*/, '').replace(/\s*$/, '');
            $('div#content').html(heading + data.content);
        } else {
		    $('div#content').html(heading + 'Error - unable to load article');
		}
    });
};