const express        = require('express');
const bodyParser     = require('body-parser');
const http           = require('http');
const request        = require('request');
const helpers        = require('./helpers.js');
const token = "EAABngOQ8JQUBAPQsX3Tadyj6DgfB0am7lMdVUNymZBYJt8U7IyfH5u4UDEwRywCddKnGme3ZBX16KmzKeoSyRaA5ZBsqkCmuKEPl8fUgVefSUeiiO2HIJoMWL68mksuYpib3DjsaBb0vOfi6hV6rmJn5ludHCOOcfeYqXQCeQZDZD";


var app = express();

app.use(bodyParser.json({}));

app.speechHandler = function(text, id, cb) {

    if(text && (typeof text === 'string' )){
        text = helpers.rsc(text);
    }
    else{
        text = "Error Emoji"
    }
    

    var reqObj = {
      url: 'https://api.api.ai/v1/query?v=20150910',
      headers: {
        "Content-Type":"application/json",
        "Authorization":"Bearer d690f1cc9c714f218ea43d1d60d4e15c"
      },
      method: 'POST',
      json: {
        "query":text,
        "lang":"pt-br",
        "sessionId":id
      }
    };

    //console.log("\n\n\n\n\n" + reqObj.json.query + "\n\n\n\n\n");



    request(reqObj, function(error, response, body) {
      if (error) {
        console.log('Error sending message: ', JSON.stringify(error));
        cb(false)
      } 
      else {
          //Seria aqui que euprecisaria recuperar as moedas e fazer calculos
        var speech = body.result.fulfillment.speech;
        cb(speech.replace("/n", "\r\n\r\n"));
      }

    });
}


app.messageHandler = function(text, id, cb) {
    var data = {
      "recipient":{
          "id":id
      },
      "message":{
          "text":text
      }
    };

    var reqObj = {
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: data
    };

    //console.log("--------Aqui: " + JSON.stringify(reqObj) + "\n\n");

    request(reqObj, function(error, response, body) {
      if (error) {
        console.log('Error sending message: ', JSON.stringify(error));
        cb(false)
      } 
      else if (response.body.error) {
        console.log("API Error: " + JSON.stringify(response.body.error));
        cb(false)
      } 
      else{
        cb(true)
      }
    });
}


app.post('/fb', function(req, res){
    var id = req.body.entry[0].messaging[0].sender.id;
    var text = req.body.entry[0].messaging[0].message.text;

    app.speechHandler(text, id, function(speech){
      app.messageHandler(speech, id, function(result){
      });
    });

    res.send(req.body);
});


app.get('/fb', function(req, res) {
  if (req.query['hub.verify_token'] === "botTioPatinhas") {
     res.send(req.query['hub.challenge']);
   } else {
     res.send('Error, wrong validation token');
   }
});

// create a health check endpoint
app.get('/health', function(req, res) {
  res.send('okay');
});

// set port
app.set('port', process.env.PORT || 8080);
// start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

