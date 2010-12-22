require 'rubygems'
require 'json'
require 'safariwatir'
require 'test/unit'

class MainTest < Test::Unit::TestCase
    def setup
        confStr = ''
        File.open('conf/conf.json', 'r').readlines.each do |line|
            confStr += line + ' '
        end
        conf = JSON.parse(confStr)
        @url = 'http://localhost:' + conf['appPort']
        @b = Watir::Safari.new
    end
    def teardown
        @b.close
    end
    def test_live
        # check feed
        @b.goto(@url + '/http://news.ycombinator.com/rss')
        assert(@b.contains_text('App by Studio Cliffano'))
        assert_equal('Hacker News - FeedTouch', @b.title)
        # check article
        articleLink = @b.li(:id, '0').link(:class, 'ui-link-inherit')
        articleTitle = articleLink.title
        articleLink.click
        assert(@b.contains_text(articleTitle))
        
        # check feed via url param
        @b.goto(@url + '/?url=http://news.ycombinator.com/rss')
        assert_equal('Hacker News - FeedTouch', @b.title)
    end
end