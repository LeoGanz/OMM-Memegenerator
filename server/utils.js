const jwt = require("njwt");

module.exports = function () {
    this.checkForToken = function (token) {
        let isThere = false;
        jwt.verify(token, "top-secret", (err, verifiedJwt) => {
            console.log(verifiedJwt);
            console.log(token);
            if (err) {
                console.log(err);
            } else {
                isThere = true;
                console.log(verifiedJwt);
            }
        });
        return isThere;
    };
}


