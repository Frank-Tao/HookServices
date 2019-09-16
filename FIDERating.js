// A simple microservice
// Service will respond to HTTP requests with a string
module['exports'] = function method (hook) {
  // hook.req is a Node.js http.IncomingMessage
  // hook.res is a Node.js httpServer.ServerResponse

  var jsdom = require('jsdom');
  var request = require('request');
  request.get('https://ratings.fide.com/card.phtml?event='+hook.params.id, function(err, res, body){
    if (err) {
      return hook.res.end(err.messsage);
    }

    var document = jsdom.jsdom(body);
    var title=document.querySelector("title").textContent;
    var i=title.indexOf('FIDE');
    var name= title.substring(0, i-1).trim();

    var content=document.querySelector("table.contentpaneopen").textContent;
    var std_idx = content.indexOf('std.');
    var std_rating=content.substring(std_idx,std_idx+8).replace('std.','');

    var rpd_idx = content.indexOf('rapid');
    var rpd_rating=content.substring(rpd_idx,rpd_idx+9).replace('rapid','');

    var blz_idx = content.indexOf('blitz');
    var blz_rating=content.substring(blz_idx,blz_idx+9).replace('blitz','');

    hook.res.json({id:hook.params.id, name: name, std: std_rating, rapid: rpd_rating, blitz: blz_rating});    
  })
};
