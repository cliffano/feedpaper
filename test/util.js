var buster  = require('buster-node');
var referee = require('referee');
var util    = require('../lib/util');
var assert  = referee.assert;

buster.testCase('repoman - slug', {
  'should replace uppercase chars with lowercase chars': function () {
    assert.equals(util.slug('HELLOWORLD'), 'helloworld');
  },
  'should strip non-alphanumeric chars': function () {
    assert.equals(util.slug('$hello*&#@($&#@*(world'), 'helloworld');
  },
  'should keep numeric chars as-is': function () {
    assert.equals(util.slug('1234567890'), '1234567890');
  },
  'should replace whitespaces with dashes': function () {
    assert.equals(util.slug('HELLO world  12345   xyz'), 'hello-world--12345---xyz');
  }
});
