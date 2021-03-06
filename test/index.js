
/**
 * Dependencies.
 */

var Rainforest = require('../');
var assert = require('assert');

/**
 * Tests.
 */

describe('Rainforest()', function() {
  it('should be a function', function() {
    assert.equal(typeof Rainforest, 'function');
  });

  it('should be a constructor', function() {
    var rainforest = new Rainforest();
    assert(rainforest instanceof Rainforest);
  });

  it('should not require the new keyword', function() {
    var rainforest = Rainforest();
    assert(rainforest instanceof Rainforest);
  });

  it('should initialize a token', function() {
    var token = 'abc123';
    var rainforest = Rainforest(token);
    assert.equal(rainforest.token, token);
  });

  it('should initialize a base', function() {
    var base = 'http://example.com/';
    var rainforest = Rainforest(null, base);
    assert.equal(rainforest.base, base);
  });

  it('should initialize a base with default value', function() {
    var rainforest = Rainforest(null, null);
    assert.equal(rainforest.base, 'https://app.rainforestqa.com');
  });

  it('should initialize an array of tests', function() {
    var rainforest = Rainforest(null, null);
    assert.deepEqual(rainforest.tests, ['all']);
  });
});

describe('Rainforest#test()', function() {
  it('should add to the array of tests', function() {
    var rainforest = Rainforest(null, null);
    rainforest.test('foo');
    assert.deepEqual(rainforest.tests, ['all', 'foo']);
  });
});

describe('Rainforest#()', function() {
  var rainforest;
  this.timeout(8000);

  beforeEach(function() {
    rainforest = Rainforest('1a32ff6d44b9957f069648a34b8a2c52', 'https://app.rnfrst.com/');
  });

  describe('#getTests()', function() {
    it('should get all the tests', function(done) {
      rainforest.getTests(function(err, res) {
        if (err) return done(err);
        assert(res.text);
        done();
      });
    });
  });

  describe('#getTest()', function() {
    it('should get the test', function(done) {
      rainforest.getTests(function(err, res) {
        if (err) return done(err);
        var response = JSON.parse(res.text);
        rainforest.getTest(response[0].id, function(err, res) {
          if (err) return done(err);
          var testResponse = JSON.parse(res.text);
          assert(testResponse.id);
          assert.equal(res.status, 200);
          done();
        });
      });
    });
  });

  describe('#createTest()', function() {
    it('should create the test', function(done) {
      var data = {
        start_uri: '/login',
        title: 'Login',
        elements: [],
        site_id: 9
      };

      rainforest.createTest(data, function(err, res) {
        if (err) return done(err);
        assert.equal(res.status, 201);
        var response = JSON.parse(res.text);
        var id = response.id;
        assert(id);
        rainforest.removeTests([response.id], function(err, res) {
          if (err) return done(err);
          done();
        });
      });
    });
  });

  describe('#updateTest()', function() {
    it('should update the test', function(done) {
      var data = {
        start_uri: '/login',
        title: 'Login',
        elements: [],
        site_id: 9
      };
      
      rainforest.createTest(data, function(err, res) {
        if (err) return done(err);
        var response = JSON.parse(res.text);
        rainforest.updateTest(response.id, data, function(err, res) {
          if (err) return done(err);
          assert.equal(res.status, 200);
          assert(res.text);
          rainforest.removeTests([response.id], function(err, res) {
            if (err) return done(err);
            done();
          });
        });
      });
    });
  });

  describe('#removeTests()', function() {
    it('should remove the test', function(done) {
      var data = {
        start_uri: '/login',
        title: 'Login',
        elements: [],
        site_id: 9
      };
      
      rainforest.createTest(data, function(err, res) {
        if (err) return done(err);
        var createResponse = JSON.parse(res.text);
        rainforest.updateTest(createResponse.id, data, function(err, res) {
          if (err) return done(err);
          rainforest.removeTests([createResponse.id], function(err, res) {
            if (err) return done(err);
            assert.equal(res.status, 200);
            var removeResponse = JSON.parse(res.text);
            assert.deepEqual(removeResponse, { "ok": true, "count": 0 });
            done();
          });
        });
      });
    });
  });

  describe('#getGenerators()', function() {
    it('should get all the generators', function(done) {
      rainforest.getGenerators(function(err, res) {
        if (err) return done(err);
        assert(res.text);
        done();
      });
    });
  });

  describe('#createGenerator()', function() {
    it('should create the generator', function(done) {
      var data = {
        name: 'test_create_generator',
        generator_type: 'tabular',
        description: 'testing creating a generator',
        columns: [ { name: 'foo' }, { name: 'bar' } ]
      };
    
      rainforest.createGenerator(data, function(err, res) {
        if (err) return done(err);
        assert.equal(res.status, 201);
        var response = JSON.parse(res.text);
        assert(response);
        assert(response.id);
        rainforest.removeGenerator(response.id, function(err, res) {
          if (err) return done(err);
          done();
        });
      });
    });
  });

  describe('#updateGenerator()', function() {
    it('should update the generator', function(done) {
      var data = {
        name: 'test_updates_generator',
        generator_type: 'tabular',
        description: 'testing updating a generator',
        columns: [ { name: 'foo' }, { name: 'bar' } ]
      };

      rainforest.createGenerator(data, function(err, res) {
        if (err) return done(err);
        var response = JSON.parse(res.text);
        rainforest.updateGenerator(response.id, data, function(err, res) {
          if (err) return done(err);
          assert.equal(res.status, 200);
          assert(res.text);
          rainforest.removeGenerator(response.id, function(err, res) {
            if (err) return done(err);
            done();
          });
        });
      });
    });
  });

  describe('#removeGenerator()', function() {
    it('should remove the generator', function(done) {
      var data = {
        name: 'test_remove_generator',
        generator_type: 'tabular',
        description: 'testing removing a generator',
        columns: [ { name: 'foo' }, { name: 'bar' } ]
      };

      rainforest
        .createGenerator(data, function(err, res) {
          if (err) return done(err);
          var response = JSON.parse(res.text);
          rainforest.removeGenerator(response.id, function(err, res) {
            if (err) return done(err);
            assert.equal(res.status, 200);
            done();
          });
        });
    });
  });

  describe('#getGeneratorRows()', function() {
    it('should get the generator rows', function(done) {
      var data = {
        name: 'etthegenerator_Rows',
        generator_type: 'tabular',
        description: 'testing getting a generator\'s rows',
        columns: [ { name: 'foo' }, { name: 'bar' } ]
      };

      rainforest.createGenerator(data, function(err, res) {
        if (err) return done(err);
        var response = JSON.parse(res.text);
        var generatorId = response.id;
        var columns = response.columns;
        rainforest.createGeneratorRow(generatorId, ['hello', 'hello2'], columns, function(err, res) {
          if (err) return done(err);
          rainforest.getGeneratorRows(generatorId, function(err, res) {
            if (err) return done(err);
            assert.equal(res.status, 200);
            var rowResponse = JSON.parse(res.text);
            var rowId = rowResponse[0].id;
            assert(rowId);
            rainforest.removeGeneratorRow(generatorId, rowId, function(err, res) {
              if (err) return done(err);
              rainforest.removeGenerator(generatorId, function(err, res) {
                if (err) return done(err);
                done();
              });
            });
          });
        });
      });
    });
  });

  describe('#createGeneratorRow()', function() {
    it('should create the generator row', function(done) {
      var data = {
        name: 'test_create_the_generator_row',
        generator_type: 'tabular',
        description: 'testing creating a generator\'s rows',
        columns: [ { name: 'foo' }, { name: 'bar' } ]
      };

      rainforest.createGenerator(data, function(err, res) {
        if (err) return done(err);
        var response = JSON.parse(res.text);
        var generatorId = response.id;
        var columns = response.columns;
        rainforest.createGeneratorRow(generatorId, ['hello', 'hello2'], columns, function(err, res) {
          if (err) return done(err);
          assert.equal(res.status, 201);
          var rowResponse = JSON.parse(res.text);
          var rowId = rowResponse.id;
          assert(rowId);
          rainforest.removeGeneratorRow(generatorId, rowId, function(err, res) {
            if (err) return done(err);
            rainforest.removeGenerator(generatorId, function(err, res) {
              if (err) return done(err);
              done();
            });
          });
        });
      });
    });
  });

  describe('#updateGeneratorRow()', function() {
    it('should update the generator row', function(done) {
      var data = {
        name: 'test_update_the_generator_row',
        generator_type: 'tabular',
        description: 'testing updating a generator\'s rows',
        columns: [ { name: 'foo' }, { name: 'bar' } ]
      };

      rainforest.createGenerator(data, function(err, res) {
        if (err) return done(err);
        var response = JSON.parse(res.text);
        var generatorId = response.id;
        var columns = response.columns;
        rainforest.createGeneratorRow(generatorId, ['hello', 'hello2'], columns, function(err, res) {
          if (err) return done(err);
          var rowResponse = JSON.parse(res.text);
          var rowId = rowResponse.id;
          rainforest.updateGeneratorRow(generatorId, rowId, ['hello', 'hello2'], columns, function(err, res) {
            if (err) return done(err);
            assert.equal(res.status, 200);
            rainforest.removeGeneratorRow(generatorId, rowId, function(err, res) {
              if (err) return done(err);
              rainforest.removeGenerator(generatorId, function(err, res) {
                if (err) return done(err);
                done();
              });
            });
          });
        });
      });
    });
  });

  describe('#removeGeneratorRow()', function() {
    it('should remove the generator row', function(done) {
      var data = {
        name: 'test_remove_the_generator_row',
        generator_type: 'tabular',
        description: 'testing removing a generator\'s rows',
        columns: [ { name: 'foo' }, { name: 'bar' } ]
      };

      rainforest.createGenerator(data, function(err, res) {
        if (err) return done(err);
        var response = JSON.parse(res.text);
        var generatorId = response.id;
        var columns = response.columns;
        rainforest.createGeneratorRow(generatorId, ['hello', 'hello2'], columns, function(err, res) {
          if (err) return done(err);
          var rowResponse = JSON.parse(res.text);
          var rowId = rowResponse.id;
          rainforest.removeGeneratorRow(generatorId, rowId, function(err, res) {
            if (err) return done(err);
            assert.equal(res.status, 200);
            rainforest.removeGenerator(generatorId, function(err, res) {
              if (err) return done(err);
              done();
            });
          });
        });
      });
    });
  });
});
