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
     * This method checks if every array in an array of arrays has the same length
     * @param arrayOfArrays the given array of arrays
     * @returns {boolean} true if it is the case and false if not
     */
    this.checkForEqualLength = function (arrayOfArrays) {
        if (arrayOfArrays.length !== 0) {
            let length = arrayOfArrays[0].length;
            let result = true;
            for (let elem in arrayOfArrays) {
                if (elem.length !== length) {
                    result = false;
                }
            }
            return result;
        } else {
            return true;
        }
    }

    this.checkForMemeInPictures = function (schema, metadata, res){
        schema.find({metadata: metadata}, (err, lst) => {
            if (err) {
                console.log("503: Connection to db failed; error: " + err);
                res.status(503).send("Connection to db failed");
            } else {
                if (lst.length !== 0) {
                    console.log("400: This meme does already exist");
                    res.status(400).send("This meme does already exist");
                }
            }
        });
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
        let token = request.query.token;
        if (token === undefined) {
            console.log("token undefined");
            token = ""
        }
        return token;
    }
}


