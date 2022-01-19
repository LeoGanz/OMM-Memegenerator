const jwt = require("njwt");
module.exports = function () {


    /**
     * Gives back a date string that gives date and time back
     * @returns {string} date concatenated with times
     */
    this.giveBackDateString = function () {
        const today = new Date();
        return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
            + '--' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    }


    /**
     * Creates a new token from given claims
     * @param email the email of the user
     * @returns {string} the created token string
     */
    this.createToken = function (email) {
        const claims = {email: email};
        const token = jwt.create(claims, 'top-secret');
        return token.compact();
    }

    /**
     * This method adjusts the token to an empty string if it does not exist to avoid
     * error-messages in the verification
     * @param request the given request of the client
     * @returns {string} the empty token if it is undefined or the actual token
     */
    this.adjustToken = function (request) {
        let token = request.query.token
        if(token === undefined){
            token = ""
        }
        return token;
    }
}


