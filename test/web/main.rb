require 'rubygems'
require 'json'
require 'safariwatir'
require 'test/unit'

class MainTest < Test::Unit::TestCase
    def setup
        confStr = ''
        File.open('app.conf', 'r').readlines.each do |line|
            confStr += line + ' '
        end
        conf = JSON.parse(confStr)
        @url = 'http://localhost:' + conf['app']['port']
        @b = Watir::Safari.new
    end
    def teardown
        @b.close
    end
    def test_live
        # check brochure
        @b.goto(@url + '/')
        assert(@b.contains_text('Why FeedTouch?'))
        
    end
end