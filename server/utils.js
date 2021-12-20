const jwt = require("njwt");
const userSchema = require("./models/userSchema");

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

    this.giveBackDateString = function () {
        const today = new Date();
        const creationDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
            + '--' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return creationDate;
    }

    this.checkInDB = function (schema, part) {
        let lst;
        schema.find(part, (err, l) => {
            if (err) {
                lst = [];
            } else {
                lst = l;
            }
        });
        return lst;
    }

    this.findUpdateSingleValueDB = function (schema, partFind, partUpdate) {
        schema.findOneAndUpdate(partFind, partUpdate, (err) => {
            if (err) {
                return false;
            } else {
                return true;
            }
        });
    }
}


