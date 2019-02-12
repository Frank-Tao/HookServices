// A simple microservice
// Service will respond to HTTP requests with a string
module['exports'] = function method (hook) {
  // hook.req is a Node.js http.IncomingMessage
  // hook.res is a Node.js httpServer.ServerResponse
  var jsdom = require('jsdom');

  jsdom.env("http://sachess.org.au/ratings/player?id="+hook.params.id, [
    'http://code.jquery.com/jquery-1.5.min.js'
  ],
  function(errors, window) {
    var acfid,state,fideid,value, rating;

    var title=window.$("title").text().trim();
    var index=title.indexOf("Information for");
    var name= title.substring(index+15,title.length).trim();

    window.$('[id="stats-box-data-value"]:lt(3)').each(function(index) {
      value= window.$(this).text().trim();
      switch(index) {
       	case 0:
            acfid=value;
            break;
          case 1:
            state=value;
            break;
          case 2:
            fideid=value;
            break;
      }
    });

    window.$('[id="stats-box-data-col"]').slice(3,4).each(function() {
      	rating= window.$(this).text().trim();
    });

    hook.res.json({acfid: acfid, name: name, state: state, rating: rating, fideid: fideid});
  });  
};
