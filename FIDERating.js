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
    var index = content.indexOf('std.');
    var string=content.substring(index,index+8).replace('std.','');

    var index1 = content.indexOf('rapid');
    var string1=content.substring(index1,index1+9).replace('rapid','');

    var index2 = content.indexOf('blitz');
    var string2=content.substring(index2,index2+9).replace('blitz','');

    hook.res.json({id:hook.params.id, name: name, std: string, rapid: string1, blitz: string2});    
  })
};
