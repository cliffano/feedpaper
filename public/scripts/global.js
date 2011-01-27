var FeedTouch = function () {
};
FeedTouch.prototype.loadHome = function (url, maxDisplay, numElems) {
	var serviceUrl = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&num=' + maxDisplay + '&q=' + encodeURIComponent(url),
	    feed, entry, i, ln;
	for (i = 0; i < numElems; i++) {
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
		    for (i = 0; i < ln; i++) {
	 		    entry = feed.entries[i];
	 		    if (entry.link && entry.title) {
			        $('li#' + i + ' a').text(entry.title);
			        $('li#' + i + ' a').attr('href', '/a?url=' + entry.link.replace(/#/, '%23').replace(/\?/, '%3F') + '&title=' + encodeURIComponent(entry.title));
		        } else {
		            $('li#' + i + ' a').text('Invalid feed entry');
		        }
			    $('li#' + i).show();
		    }
		} else {
			$('li#indicator').text('Discovering feed...');
			$('li#indicator').show();
			$.getJSON('/s/' + url, function (data) {
				if (data && data.length > 0) {
					var title = url.replace(/https?:\/\//, '') + ' feeds';
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