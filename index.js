const request = require('request');
const prompt = require('prompt');
var currencies = {};
var moedaBase;
var moedaDestino;


prompt.start();

    //Requisito a quantidade em moeda Base do Usuário
prompt.get('moedaBase', function (err, result) {
    if (err){
        return console.log('error:', err); // Print the error if one occurred 
    } 

    moedaBase = result.moedaBase;

    //Depois de fornecido o valor, posso requisitar as cotações para a API
    request({
            url: 'https://api.fixer.io/latest?base=BRL',
            json: true
        },
        function (error, response, body) {
        if (error){
            return console.log('error:', error); // Print the error if one occurred 
        }

        currencies = body.rates;
        
        console.log(currencies);
        /*
        //Calculo o valor da Moeda Destino
        var moedaDestino = moedaBase * body.rates.BRL;
        
        //Deixo o valor com apenas duas casas decimais
        moedaDestino = moedaDestino.toFixed(2);

        //Printo o valor calculado
        if(moedaBase == 1){
            console.log(`${moedaBase} Dólar americano vale R$${moedaDestino}`);        
        }
        else{
            console.log(`${moedaBase} Dólares americanos valem R$${moedaDestino}`);                
        }*/
    });
});



/*

1 - Dólar americano
2 - Franco Suiço
3 - Coroa Norueguesa
4 - Peso Mexicano

Dólar Australiano (AUD)
Lev Bulgado (BGN)
Real Brasileiro (BRL)
Dólar Canadense (CAD)
Franco Suiço (CHF)
Yuan Renminbi Chinês (CNY)
Coroa Checa (CZK)
Coroa Dinamarquesa (DKK)
Libra esterlina (GBP)
Dólar de Hong Kong (HKD)
Kuna Croata (HRK)
Florim Húngaro (HUF)
Rupia Indonesia (IDR)
Shekel Israelense (ILS)
Rupia Indiana (INR)
Iene Japonês (JPY)
Won sul-coreano (KRW)
Peso Mexicano (MXN)
Ringgit Malaio (MYR)
Coroa Norueguesa (NOK)
Dólar Neozelandês (NZD)
Peso Philipino (PHP)
Złoty Polonês (PLN)
Leu Romeno (RON)
Rublo Russo (RUB)
Coroa Sueca (SEK)
Dólar de Singapura (SGD)
Baht Thailandês (THB)
Lira Turca (TRY)
Dólar Americano (USD)
Rand SulAfricano (ZAR)
*/