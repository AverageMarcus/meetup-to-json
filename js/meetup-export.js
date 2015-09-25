var page_size = 200;

// make a request to lastFM
function meetup(data, callback){
  return reqwest({
    url:"https://api.meetup.com/2/members?" + data,
    type: 'jsonp',
    success: function(data){
      if(callback && data){
        callback(false, data);
      }
    },
    error: function(err){
      if(callback){
        callback(err);
      }
    }
  })
}

// generate data for a request
function requestData(api_key, group, page){
  var size = 0;
  if(page != undefined) size = 200;
  return "&photo-host=public&group_urlname=" + group + "&page=" + size + "&offset=" + (page || 0) + "&key=" + api_key;
}

// generate a list of request data objects
function requestMembers(api_key, group, page_count){
  var requests = [];
  for(var page = 0; page < page_count; page++){
    requests.push(requestData(api_key, group, page));
  }
  return requests
}

function extractMembers(doc){
  var arr = [];

  if(doc && doc.results){
    arr = doc.results;
  }

  return arr;
}

function extractMeta(doc){
  var pages = doc.meta.total_count / page_size;
  return {
    page_count: Math.ceil(pages),
    total_count: doc.meta.total_count
  };
}