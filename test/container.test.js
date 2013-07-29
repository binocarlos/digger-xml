var XML = require('../src');
var data = require('./fixtures/data');
var Client = require('digger-client');
var Container = Client.Container;

describe('container', function(){

  it('should run selectors on local data', function() {

    var test = Container(XML.parse(data.citiesxml));

    test.find('city.south').count().should.equal(3);
    test.find('country[name^=U] > city.south area.poor').count().should.equal(3);

  })
  
  it('should apply limit and first and last modifiers', function() {
    var test = Container(XML.parse(data.citiesxml));
    test.find('city.south').count().should.equal(3);    
    test.find('city.south:first').count().should.equal(1);
    test.find('city.south:last').count().should.equal(1);
    test.find('city.south:limit(2)').count().should.equal(2);
  })

  it('should produce the correct XML string', function() {

    var container = Container('box', {
      name:'apples'
    })

    var st = XML.stringify(container.toJSON());

    st.indexOf('<box name="apples" />').should.equal(0);
    
  })

})
