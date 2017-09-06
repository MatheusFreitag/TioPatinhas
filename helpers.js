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
    }

};
    