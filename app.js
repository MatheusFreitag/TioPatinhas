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


    if (text != undefined){
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
                        sendText(id,"Olá! Eu sou o bot Tio Patinhas :D\n" +  "Eu posso converter moedas, então me pergunte coisas como\n\n" +
                        "Quanto é 1 bitcoin em reais?\n" + "Quanto são 50 reais em dólares?\n"+ "30 euros em pesos uruguaios\n\n"+ 
                        "Para saber mais sobre mim, visite https://matheusfreitag.github.io/TioPatinhas/ \n\n"+
                        "Como posso te ajudar hoje?");
                        
                        break
                    case "Cotacao":
                        callFixerIO(id, "COTACAO", body)
                        break
                    case "Converter":
                        var resposta = body.result.fulfillment.speech
                        callFixerIO(id, resposta, body)
                        break
                    case "selfie":
                        sendSelfie(id);
                        break;
                        
                    case "listar":
                        sendLista(id);
                        break;    
                    default:
                        sendText(id,body.result.fulfillment.speech)
                        break

                }
            
            }       
        }); 
    }
    else{
        sendText(id,"Esse tipo de mensagem ainda não é interpretável por mim :(");
    }   
}

var callFixerIO = function(id,resposta, apiai){
    var moedaOrigem = apiai.result.parameters.moeda[0];
    var moedaDestino = apiai.result.parameters.moeda1[0];
    var valor = apiai.result.parameters.number;
    var resultado;
    var multiplicador;

    //Setar Parametro de Destino
    if(moedaDestino == undefined){
        moedaDestino = "BRL";
        valor = "X";
        resposta = `Na última cotação que tive acesso, 1 ${moedaOrigem} valia YY reais`;
    } 
    if(moedaDestino === "reais")                moedaDestino = "BRL";
    if(moedaDestino === "dólares australianos") moedaDestino = "AUD";
    if(moedaDestino === "pesos mexicanos")      moedaDestino = "MXN";
    if(moedaDestino === "dólares")              moedaDestino = "USD";
    if(moedaDestino === "lev búlgaros")         moedaDestino = "BGN";
    if(moedaDestino === "dólares canadenses")   moedaDestino = "CAD";
    if(moedaDestino === "francos suiços")       moedaDestino = "CHF";
    if(moedaDestino === "Yuan Renminbi Chinês") moedaDestino = "CNY";
    if(moedaDestino === "Coroas Checas")        moedaDestino = "CZK";
    if(moedaDestino === "Coroas Dinamarquesas") moedaDestino = "DKK";
    if(moedaDestino === "Libras esterlina")    moedaDestino = "GBP";
    if(moedaDestino === "Dólares de Hong Kong") moedaDestino = "HKD";
    if(moedaDestino === "Kunas Croatas")        moedaDestino = "HRK";
    if(moedaDestino === "Florim Húngaros")      moedaDestino = "HRK";
    if(moedaDestino === "Rupias Indonesias")    moedaDestino = "IDR";
    if(moedaDestino === "Shekel Israelenses")   moedaDestino = "ILS";
    if(moedaDestino === "Rupias Indianas")      moedaDestino = "INR";
    if(moedaDestino === "Ienes Japoneses")      moedaDestino = "JPY";
    if(moedaDestino === "Won sul-coreano")      moedaDestino = "KRW";
    if(moedaDestino === "Pesos Mexicanos")      moedaDestino = "MXN";
    if(moedaDestino === "Ringgit Malaios")      moedaDestino = "MYR";
    if(moedaDestino === "Coroas Norueguesas")   moedaDestino = "NOK";
    if(moedaDestino === "Dólares Neozelandês")  moedaDestino = "NZD";
    if(moedaDestino === "Pesos Philipino")      moedaDestino = "PHP";
    if(moedaDestino === "Leu Romenos")          moedaDestino = "RON";
    if(moedaDestino === "Złoty Polonêses")      moedaDestino = "PLN";
    if(moedaDestino === "Rublo Russos")         moedaDestino = "RUB";
    if(moedaDestino === "Coroas Suecas")        moedaDestino = "SEK";
    if(moedaDestino === "Dólares de Singapura") moedaDestino = "SGD";
    if(moedaDestino === "Baht Thailandês")      moedaDestino = "THB";
    if(moedaDestino === "Liras Turcas")         moedaDestino = "TRY";
    if(moedaDestino === "Rand SulAfricanos")    moedaDestino = "ZAR";
    if(moedaDestino === "Euros")                moedaDestino = "EUR";
    if(moedaDestino == "Pesos Uruguaios")       moedaDestino = "UYU";
    if(moedaDestino == "Pesos Argentinos")      moedaDestino = "ARS";
    if(moedaDestino == "Pesos Chilenos")        moedaDestino = "CLP";
    if(moedaDestino == "Bolivians Bolivianos")  moedaDestino = "BOB";
    if(moedaDestino == "Pesos Peruanos")        moedaDestino = "PEN";
    if(moedaDestino == "Guaranis Paraguaios")   moedaDestino = "PYG";
    if(moedaDestino == "Peso Colombiano")       moedaDestino = "COP";
    if(moedaDestino == "Bitcoin")               moedaDestino = "BTC";
    if(moedaDestino == "Litecoin")              moedaDestino = "LTC";
    if(moedaDestino == "Ethereum")              moedaDestino = "ETH";
    if(moedaDestino == "Zcash")                 moedaDestino = "ZEC";
    if(moedaDestino == "Ripple")                moedaDestino = "XRP";
    if(moedaDestino == "Monero")                moedaDestino = "XMR";
    if(moedaDestino == "IOTA")                  moedaDestino = "IOTA";
    if(moedaDestino == "Bitcoin Gold")          moedaDestino = "BTG";

    

    //Setar Parametro de Origem
    if(moedaOrigem === "reais")                moedaOrigem = "BRL";
    if(moedaOrigem === "dólares australianos") moedaOrigem = "AUD";
    if(moedaOrigem === "pesos mexicanos")      moedaOrigem = "MXN";
    if(moedaOrigem === "dólares")              moedaOrigem = "USD";
    if(moedaOrigem === "lev búlgaros")         moedaOrigem = "BGN";
    if(moedaOrigem === "dólares canadenses")   moedaOrigem = "CAD";
    if(moedaOrigem === "francos suiços")       moedaOrigem = "CHF";
    if(moedaOrigem === "Yuan Renminbi Chinês") moedaOrigem = "CNY";
    if(moedaOrigem === "Coroas Checas")        moedaOrigem = "CZK";
    if(moedaOrigem === "Coroas Dinamarquesas") moedaOrigem = "DKK";
    if(moedaOrigem === "Libras esterlina")    moedaOrigem = "GBP";
    if(moedaOrigem === "Dólares de Hong Kong") moedaOrigem = "HKD";
    if(moedaOrigem === "Kunas Croatas")        moedaOrigem = "HRK";
    if(moedaOrigem === "Florim Húngaros")      moedaOrigem = "HRK";
    if(moedaOrigem === "Rupias Indonesias")    moedaOrigem = "IDR";
    if(moedaOrigem === "Shekel Israelenses")   moedaOrigem = "ILS";
    if(moedaOrigem === "Rupias Indianas")      moedaOrigem = "INR";
    if(moedaOrigem === "Ienes Japoneses")      moedaOrigem = "JPY";
    if(moedaOrigem === "Won sul-coreano")      moedaOrigem = "KRW";
    if(moedaOrigem === "Pesos Mexicanos")      moedaOrigem = "MXN";
    if(moedaOrigem === "Ringgit Malaios")      moedaOrigem = "MYR";
    if(moedaOrigem === "Coroas Norueguesas")   moedaOrigem = "NOK";
    if(moedaOrigem === "Dólares Neozelandês")  moedaOrigem = "NZD";
    if(moedaOrigem === "Pesos Philipino")      moedaOrigem = "PHP";
    if(moedaOrigem === "Leu Romenos")          moedaOrigem = "RON";
    if(moedaOrigem === "Złoty Polonêses")      moedaOrigem = "PLN";
    if(moedaOrigem === "Rublo Russos")         moedaOrigem = "RUB";
    if(moedaOrigem === "Coroas Suecas")        moedaOrigem = "SEK";
    if(moedaOrigem === "Dólares de Singapura") moedaOrigem = "SGD";
    if(moedaOrigem === "Baht Thailandês")      moedaOrigem = "THB";
    if(moedaOrigem === "Liras Turcas")         moedaOrigem = "TRY";
    if(moedaOrigem === "Rand SulAfricanos")    moedaOrigem = "ZAR";
    if(moedaOrigem === "Euros")                moedaOrigem = "EUR";
    if(moedaOrigem == "Pesos Uruguaios")       moedaOrigem = "UYU";
    if(moedaOrigem == "Pesos Argentinos")      moedaOrigem = "ARS";
    if(moedaOrigem == "Pesos Chilenos")        moedaOrigem = "CLP";
    if(moedaOrigem == "Bolivians Bolivianos")  moedaOrigem = "BOB";
    if(moedaOrigem == "Pesos Peruanos")        moedaOrigem = "PEN";
    if(moedaOrigem == "Guaranis Paraguaios")   moedaOrigem = "PYG";
    if(moedaOrigem == "Peso Colombiano")       moedaOrigem = "COP";
    if(moedaOrigem == "Bitcoin")               moedaOrigem = "BTC";
    if(moedaOrigem == "Litecoin")              moedaOrigem = "LTC";
    if(moedaOrigem == "Ethereum")              moedaOrigem = "ETH";
    if(moedaOrigem == "Zcash")                 moedaOrigem = "ZEC";
    if(moedaOrigem == "Ripple")                moedaOrigem = "XRP";
    if(moedaOrigem == "Monero")                moedaOrigem = "XMR";
    if(moedaOrigem == "IOTA")                  moedaOrigem = "IOTA";
    if(moedaOrigem == "Bitcoin Gold")          moedaOrigem = "BTG";


    //https://min-api.cryptocompare.com/data/price?fsym=BRL&tsyms=UYU

    if (valor == "X"){
        request(`https://min-api.cryptocompare.com/data/price?fsym=${moedaOrigem}&tsyms=BRL`,function(error, response, body){
            var fixer = JSON.parse(body);

            if (error) {
                console.log('Error sending message: ', JSON.stringify(error));
                return false;
            } 
            else if (resposta === "COTACAO"){
            sendText(id,`Eu trabalho com MUITAS moedas então prefiro que você me pergunte por valores e moedas específicos, por favor :P`)
            }
            else {
                console.log(moedaOrigem)
                console.log(moedaDestino);
                valor = 1.0 * Number(fixer["BRL"]);
                resposta = resposta.replace("YY", String(valor.toFixed(2)));
                resposta = emoji.emojify(resposta, (t)=>{ return t })
                // console.log('Saida: '+ resposta);
                sendText(id, resposta);
            }       
        });
    }
    else{
        request(`https://min-api.cryptocompare.com/data/price?fsym=${moedaOrigem}&tsyms=${moedaDestino}`,function(error, response, body){
            var fixer = JSON.parse(body);

            if (error) {
                console.log('Error sending message: ', JSON.stringify(error));
                return false;
            } 
            else if (resposta === "COTACAO"){
            sendText(id,`Eu trabalho com MUITAS moedas então prefiro que você me pergunte por valores e moedas específicos, por favor :P`)
            }
            else {
                console.log(moedaOrigem)
                console.log(moedaDestino);
                valor = valor * Number(fixer[moedaDestino]);
                console.log(valor);
                resposta = resposta.replace("YY", String(valor.toFixed(2)));
                resposta = emoji.emojify(resposta, (t)=>{ return t })
                // console.log('Saida: '+ resposta);
                sendText(id, resposta);
            }       
        });
    }


    
}



var sendLista = function(id){
    let americas = `
            \nAméricas\n 	
            🇧🇷 Real Brasileiro\n
            🇺🇾 Pesos Uruguaios\n
            🇦🇷 Pesos Argentinos\n
            🇨🇱 Pesos Chilenos\n
            🇧🇴 Bolivians Bolivianos\n
            🇵🇪 Pesos Peruanos\n
            🇵🇾 Guaranis Paraguaios\n
            🇨🇴 Peso Colombiano\n
            🇲🇽 Pesos Mexicanos\n
            🇺🇸 Dólares Americano\n
            🇨🇦 Dólares Canadenses\n`;

    let europaafrica = `
            \nEuropa/África\n
            🇧🇬 Lev Búlgaros\n
            🇨🇿 Coroas Checas\n
            🇩🇰 Coroas Dinamarquesas\n
            🇬🇧 Libras Esterlinas\n
            🇭🇺 Florim Húngaros\n
            🇪🇺 Euros\n
            🇨🇭 Francos Suiço\n
            🇳🇴 Coroas Norueguesas\n
            🇷🇺 Rublo Russos\n
            🇸🇪 Coroas Suecas\n
            🇭🇷 Kunas Croatas\n
            🇵🇱 Złoty Polonêses\n
            🇷🇴 Leu Romenos\n
            🇹🇷 Liras Turcas\n
            🇿🇦 Rand SulAfricanos\n`;

    let asiaorientemediooceania = `
        \nÁsia / Oriente Médio / Oceania\n
        🇦🇺 Dólares Australianos\n
        🇳🇿 Dólares Neozelandês\n
        🇨🇳 Yuan Renminbi Chinês\n
        🇭🇰 Dólares de Hong Kong\n
        🇮🇩 Rupias Indonesia\n
        🇮🇱 Shekel Israelenses\n
        🇮🇳 Rupias Indianas\n
        🇯🇵 Ienes Japoneses\n
        🇰🇷 Won sul-coreano\n
        🇲🇾 Ringgit Malaios\n
        🇹🇷 Liras Turcas\n
        🇷🇺 Rublo Russos\n
        🇵🇭 Pesos Philipino\n
        🇸🇬 Dólares de Singapura\n
        🇹🇭 Baht Thailandês\n` 	

    let criptomoedas = `
        \n Criptomoedas\n
        BTC - Bitcoin\n
        LTC - Litecoin\n
        ETH - Ethereum\n
        ZEC - Zcash\n
        XRP - Ripple\n
        XMR - Monero\n
        IOTA - IOTA\n
        BTG - Bitcoin Gold\n`

    sendText(id, americas);
    sendText(id, europaafrica);
    sendText(id, asiaorientemediooceania);
    sendText(id, criptomoedas);
}

var sendSelfie = function(id){
    let message = {
        attachment:{
        type: "image", 
        payload:{
            url:"https://i.imgur.com/eV1b5Jo.jpg", 
            is_reusable:true
        }
        }
    }
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

var sendText = function(id,text){
    // console.log("Texto " + text);
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
    
        // console.log("Texto do usuário: " + text);
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
