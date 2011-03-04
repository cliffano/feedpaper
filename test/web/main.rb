require 'rubygems'
require 'json'
require 'safariwatir'
require 'test/unit'

class MainTest < Test::Unit::TestCase
    def setup
        confStr = ''
        File.open('package.json', 'r').readlines.each do |line|
            confStr += line + ' '
        end
        conf = JSON.parse(confStr)
        @url = 'http://localhost:' + conf['port']
        @b = Watir::Safari.new
    end
    def teardown
        @b.close
    end
    def test_live
        # check brochure
        @b.goto(@url + '/')
        assert(@b.contains_text('Why FeedTouch?'))
        
        # check feed discovery of a site having a single feed
        @b.goto(@url + '/wired.com')
        assert(@b.contains_text('App by Studio Cliffano'))
        assert_equal('FeedTouch', @b.title)
        # check first article
        articleLink = @b.li(:id, '0').link(:class, 'ui-link-inherit')
        articleTitle = articleLink.title
        articleLink.click
        assert(@b.contains_text(articleTitle))

        # check feed discovery of a site having multiple feeds
        @b.goto(@url + '/ma.tt')
        assert_equal('FeedTouch', @b.title)
        # check first feed
        feedLink = @b.li(:id, '0').link(:class, 'ui-link-inherit')
        feedTitle = feedLink.title
        feedLink.click
        assert(@b.contains_text(feedTitle))
        # check first article
        articleLink = @b.li(:id, '0').link(:class, 'ui-link-inherit')
        articleTitle = articleLink.title
        articleLink.click
        assert(@b.contains_text(articleTitle))

        # check direct feed url
        @b.goto(@url + '/news.ycombinator.com/rss')
        # check first article
        articleLink = @b.li(:id, '0').link(:class, 'ui-link-inherit')
        articleTitle = articleLink.title
        articleLink.click
        assert(@b.contains_text(articleTitle))
        
        # check feed via url query string
        @b.goto(@url + '/?url=http://news.ycombinator.com/rss')
        # check first article
        articleLink = @b.li(:id, '0').link(:class, 'ui-link-inherit')
        articleTitle = articleLink.title
        articleLink.click
        assert(@b.contains_text(articleTitle))
    end
end