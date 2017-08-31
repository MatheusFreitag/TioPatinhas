const request = require('request');

module.exports = {
    rsc: function (text) {
            text = text.replace('á', 'a');
            text = text.replace('é', 'e');
            text = text.replace('í', 'i');
            text = text.replace('ó', 'o');
            text = text.replace('ú', 'u');
            text = text.replace('ô', 'o');
            text = text.replace('â', 'a');
            text = text.replace('ê', 'e');
            text = text.replace('õ', 'o');
            text = text.replace('ã', 'a');
            text = text.replace('ç', 'c');
            return text;
    },

    convertionHandler: function (speech, cotacoes) { 
        return new Promise((resolve, reject)=>{
            var moedaOrigem = speech.result.parameters.moeda;
            var moedaDestino = speech.result.parameters.moeda1;
            var valor = speech.result.parameters.number;
            var resultado;
            var multiplicador;

            switch(moedaOrigem){
                case "reais":
                     multiplicador = cotacoes.rates.USD;
                     resultado = Number(valor) * Number(multiplicador);
                     break;

                case "dolares":
                      multiplicador = cotacoes.rates.USD;
                      resultado = Number(valor) / Number(multiplicador);
                      break;
            }

            speech = speech.replace("YY", String(resultado));

            return resolve(speech);

        });
    },

    

};
    