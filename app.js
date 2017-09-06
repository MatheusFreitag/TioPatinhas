'use strict'

const express        = require('express');
const bodyParser     = require('body-parser');
const http           = require('http');
const request        = require('request');
const helpers        = require('./helpers.js');
const emoji          = require('node-emoji')
const token = "EAABngOQ8JQUBAPQsX3Tadyj6DgfB0am7lMdVUNymZBYJt8U7IyfH5u4UDEwRywCddKnGme3ZBX16KmzKeoSyRaA5ZBsqkCmuKEPl8fUgVefSUeiiO2HIJoMWL68mksuYpib3DjsaBb0vOfi6hV6rmJn5ludHCOOcfeYqXQCeQZDZD";


var app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }))


var callAPIAI = function(id,text){

    console.log(text)
    text = helpers.rsc(text);

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
    }

    request(reqObj, function(error, response, body){
        if (error) {
            console.log('Error sending message: ', JSON.stringify(error));
            cb(false)
        } 
        else {

            var acao = body.result.action
            console.log(acao)

            switch(acao){
                
                case "Oi":
                    sendText(id,body.result.fulfillment.speech)
                    break
                case "Cotacao":
                    callFixerIO(id, "COTACAO", body)
                    break
                case "Converter":
                    var resposta = body.result.fulfillment.speech
                    callFixerIO(id, resposta, body)
                    break
                default:
                    sendText(id,body.result.fulfillment.speech)
                    break

            }
           
        }       
    });    
}

var callFixerIO = function(id,resposta, apiai){
    request("http://api.fixer.io/latest?base=BRL",function(error, response, body){
        var fixer = JSON.parse(body);
        if (error) {
            console.log('Error sending message: ', JSON.stringify(error));
            return false;
        } 
        else if (resposta === "COTACAO"){
          sendText(id,`
            🇧🇷 R$ 1,00 vale:\n
            🇦🇺  ${fixer.rates.AUD.toFixed(2)} Dólares Australianos \n
            🇧🇬  ${fixer.rates.BGN.toFixed(2)} Lev Búlgaros \n
            🇨🇦  ${fixer.rates.CAD.toFixed(2)} Dólares Canadenses \n
            🇨🇭  ${fixer.rates.CHF.toFixed(2)} Francos Suiço\n
            🇨🇳  ${fixer.rates.CNY.toFixed(2)} Yuan Renminbi Chinês\n
            🇨🇿  ${fixer.rates.CZK.toFixed(2)} Coroas Checas\n
            🇩🇰  ${fixer.rates.DKK.toFixed(2)} Coroas Dinamarquesas\n
            🇬🇧  ${fixer.rates.GBP.toFixed(2)} Libras esterlinas\n
            🇭🇰  ${fixer.rates.HKD.toFixed(2)} Dólares de Hong Kong\n
            🇭🇷  ${fixer.rates.HRK.toFixed(2)} Kunas Croatas\n
            🇭🇺  ${fixer.rates.HUF.toFixed(2)} Florim Húngaros\n
            🇮🇩  ${fixer.rates.IDR.toFixed(2)} Rupias Indonesia\n
            🇮🇱  ${fixer.rates.ILS.toFixed(2)} Shekel Israelenses\n
            🇮🇳  ${fixer.rates.INR.toFixed(2)} Rupias Indianas\n
            🇯🇵  ${fixer.rates.JPY.toFixed(2)} Ienes Japoneses\n
            `)
            sendText(id,`
            🇧🇷 R$ 1,00 vale:\n
            🇰🇷  ${fixer.rates.KRW.toFixed(2)} Won sul-coreano\n
            🇲🇽  ${fixer.rates.MXN.toFixed(2)} Pesos Mexicanos\n
            🇲🇾  ${fixer.rates.MYR.toFixed(2)} Ringgit Malaios\n
            🇳🇴  ${fixer.rates.NOK.toFixed(2)} Coroas Norueguesas\n
            🇳🇿  ${fixer.rates.NZD.toFixed(2)} Dólares Neozelandês\n
            🇵🇭  ${fixer.rates.PHP.toFixed(2)} Pesos Philipino\n
            🇵🇱  ${fixer.rates.PLN.toFixed(2)} Złoty Polonêses\n
            🇷🇴  ${fixer.rates.RON.toFixed(2)} Leu Romenos\n
            🇷🇺  ${fixer.rates.RUB.toFixed(2)} Rublo Russos\n
            🇸🇪  ${fixer.rates.SEK.toFixed(2)} Coroas Suecas\n
            🇸🇬  ${fixer.rates.SGD.toFixed(2)} Dólares de Singapura\n
            🇹🇭  ${fixer.rates.THB.toFixed(2)} Baht Thailandês\n
            🇹🇷  ${fixer.rates.TRY.toFixed(2)} Liras Turcas\n
            🇺🇸  ${fixer.rates.USD.toFixed(2)} Dólares Americanos\n
            🇿🇦  ${fixer.rates.ZAR.toFixed(2)} Rand SulAfricanos\n\n`)
        }
        else {
            convertionHandler(resposta, id, apiai, fixer.rates);
        }       
    });
}

var convertionHandler = function (text, id, apiai, cotacoes) { 
    var moedaOrigem = apiai.result.parameters.moeda[0];
    var moedaDestino = apiai.result.parameters.moeda1[0];
    var valor = apiai.result.parameters.number;
    var resultado;
    var multiplicador;

    switch(moedaOrigem){
        case "reais":
                multiplicador = cotacoes.USD;
                resultado = Number(valor) * Number(multiplicador);
                break;

        case "dólares":
                multiplicador = cotacoes.USD;
                resultado = Number(valor) / Number(multiplicador);
                break;
    }

    text = text.replace("YY", String(resultado.toFixed(2)));
    text = emoji.emojify(text, (t)=>{
        return t
    })
    
    sendText(id, text);
}



var sendText = function(id,text){
    console.log(text)
    let message = {text: text}
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs : {access_token: token},
        method: "POST",
        json: {
			recipient: {id: id},
			message : message,
        }, 
        function(error, response,body) {
            if (error) {
                console.log("sending error")
            } 
            else if (response.body.error) {
                console.log("response body error")
            }
        }
    })

    //return true
}


app.post('/fb', function(req, res){

    if(req.body.entry){
        var id = req.body.entry[0].messaging[0].sender.id;
        var text = req.body.entry[0].messaging[0].message.text;
    
        callAPIAI(id, text);
        res.sendStatus(200);
    }
    
    
});


app.get('/fb', function(req, res) {
  if (req.query['hub.verify_token'] === "botTioPatinhas") {
     res.send(req.query['hub.challenge']);
   } 
   else {
     res.send('Error, wrong validation token');
   }
});


// set port
app.set('port', process.env.PORT || 8080);
// start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/* 🇨🇳  ${fixer.rates.CNY.toFixed(2)} Yuan Renminbi Chinês\n
🇨🇿  ${fixer.rates.CZK.toFixed(2)} Coroas Checas\n
🇩🇰  ${fixer.rates.DKK.toFixed(2)} Coroas Dinamarquesas\n
🇬🇧  ${fixer.rates.GBP.toFixed(2)} Libras esterlinas\n
🇭🇰  ${fixer.rates.HKD.toFixed(2)} Dólares de Hong Kong\n
🇭🇷  ${fixer.rates.HRK.toFixed(2)} Kunas Croatas\n
🇭🇺  ${fixer.rates.HUF.toFixed(2)} Florim Húngaros\n
🇮🇩  ${fixer.rates.IDR.toFixed(2)} Rupias Indonesia\n
🇮🇱  ${fixer.rates.ILS.toFixed(2)} Shekel Israelenses\n
🇮🇳  ${fixer.rates.INR.toFixed(2)} Rupias Indianas\n
🇯🇵  ${fixer.rates.JPY.toFixed(2)} Ienes Japoneses\n
🇰🇷  ${fixer.rates.KRW.toFixed(2)} Won sul-coreano\n
🇲🇽  ${fixer.rates.MXN.toFixed(2)} Pesos Mexicanos\n
🇲🇾  ${fixer.rates.MYR.toFixed(2)} Ringgit Malaios\n
🇳🇴  ${fixer.rates.NOK.toFixed(2)} Coroas Norueguesas\n
🇳🇿  ${fixer.rates.NZD.toFixed(2)} Dólares Neozelandês\n
🇵🇭  ${fixer.rates.PHP.toFixed(2)} Pesos Philipino\n
🇵🇱  ${fixer.rates.PLN.toFixed(2)} Złoty Polonêses\n
🇷🇴  ${fixer.rates.RON.toFixed(2)} Leu Romenos\n
🇷🇺  ${fixer.rates.RUB.toFixed(2)} Rublo Russos\n
🇸🇪  ${fixer.rates.SEK.toFixed(2)} Coroas Suecas\n
🇸🇬  ${fixer.rates.SGD.toFixed(2)} Dólares de Singapura\n
🇹🇭  ${fixer.rates.THB.toFixed(2)} Baht Thailandês\n
🇹🇷  ${fixer.rates.TRY.toFixed(2)} Liras Turcas\n
🇺🇸  ${fixer.rates.USD.toFixed(2)} Dólares Americanos\n
🇿🇦  ${fixer.rates.ZAR.toFixed(2)} Rand SulAfricanos\n\n*/