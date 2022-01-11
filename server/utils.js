const jwt = require("njwt");
module.exports = function () {

    this.giveBackDateString = function () {
        const today = new Date();
        return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
            + '--' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    }

    this.createToken = function (name) {
        const claims = {username: name};
        const token = jwt.create(claims, 'top-secret');
        return token.compact();
    }

    this.adjustToken = function (request) {
        let token = request.query.token
        if(token === undefined){
            token = ""
        }
        return token;
    }
}


