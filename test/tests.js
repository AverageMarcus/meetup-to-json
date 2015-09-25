describe('request data', function(){

  it('gives correct request properties', function(){

    requestData('my-key', 'jsoxford')
      .should.match(/group_urlname=jsoxford/)
      .and.match(/key=my-key/)
      .and.match(/page=0/)
      .and.match(/offset=0/)

  })

  it('gives a request properties for page 50', function(){

    requestData('my-key', 'jsoxford', 50)
      .should.match(/group_urlname=jsoxford/)
      .and.match(/key=my-key/)
      .and.match(/page=200/)
      .and.match(/offset=50/)

  })

})

describe("request members", function(){
  var requests;
  before(function(){
    requests = requestMembers('my-key', 'jsoxford', 3)
  })

  it('gives 3 request objects', function(){
    requests.length.should.eql(3)
  })

})

describe('meetup', function(){

  var request;

  var server, request, callback;
  before(function (done) {

    callback = sinon.spy()

    reqwest({
      url:'fixture.json',
      type:'json'
    }).then(function(doc){

      var jsonstr = JSON.stringify(doc)

      server = sinon.fakeServer.create();
      server.respondWith([200, { "Content-Type": "application/json" }, jsonstr]);

      request = meetup(requestData('my-key', 'jsoxford'), callback)

      done();
    })

   });
  after(function () { server.restore(); });


  it('returns a promise', function(){
    request.should.have.properties('then', 'always')
  })

  it('makes a request to the server', function(){
    server.requests.length.should.eql(0)
  })

})

describe('extract tracks', function(){

  var members;

  before(function (done) {
    reqwest({
      url:'fixture.json',
      type:'json'
    }).then(function(doc){
      members = extractMembers(doc)
      done();
    })
  });

  it('got two members', function(){
    members.length.should.eql(10)
  })

  it('has correct first member', function(){
    members[0].should.have.properties({
      "country": "gb",
      "city": "Reading",
      "id": 80250542,
      "status": "active"
    })
  })

})

describe('extract meta', function(){

  var meta;

  before(function (done) {
    reqwest({
      url:'fixture.json',
      type:'json'
    }).then(function(doc){
      meta = extractMeta(doc)
      done();
    })
  });

  it('got 2 pages', function(){
    meta.page_count.should.eql(2)
  })

  it('got 300 total members', function(){
    meta.total_count.should.eql(300)
  })

})
