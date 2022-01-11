const jwt = require("njwt");
module.exports = function () {

    this.giveBackDateString = function () {
        const today = new Date();
        const creationDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
            + '--' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return creationDate;
    }

    this.createToken =  function (name) {
        const claims = {username: name};
        const token = jwt.create(claims, 'top-secret');
        const jwtTokenString = token.compact();
        return jwtTokenString;
    }
}


