var assert = require('chai').assert

describe('async_module', function() {
  it('should be successful', function(done) {
    // Async asserts
    setTimeout(function() {
      assert.equal((1+1), '2')
      assert.strictEqual(2+4,6)
      done()
    },1000)
  })
})
