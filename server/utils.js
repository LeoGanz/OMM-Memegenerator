const jwt = require("njwt");
const userSchema = require("./models/userSchema");

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
     * This function adds on usage to a template
     */
    this.addOneUsage = function (schema, base, res) {
        schema.find({status: 0}, (err, lst) => {
            if (err) {
                console.log("503: Connection to db pictures failed; error: " + err);
                res.status(503).send("Connection to db pictures failed");
            } else {
                if (lst.length === 0) {
                    console.log("400: No template does exist");
                    res.status(400).send("No template does exist");
                }
                const foundTemplates = lst.filter((elem) => {
                    return elem.img.base64 === base;
                });
                if (foundTemplates.length === 0) {
                    console.log("400: This template does not exist");
                    res.status(400).send("This template does not exist");
                }
                let template = foundTemplates[0];
                template.usage = template.usage + 1;
            }
        });
    }

    /**
     * This method checks if the given meme-array from the API is well-formed
     * @param memeOfCreateAPI the meme-array
     * @returns {boolean} true if well-formed and false if not
     */
    this.checkForAppropriateForm = function (memeOfCreateAPI) {
        let result = true;
        const name = memeOfCreateAPI[0];
        const desc = memeOfCreateAPI[1];
        const data = memeOfCreateAPI.slice(2);
        if (typeof name !== "string" || typeof desc !== "string" || !this.checkForEqualLength(data)) {
            result = false;
        }
        for (let text in data[0]) {
            if (typeof text !== "string") {
                result = false;
            }
        }
        for (let elem in data.slice(1)) {
            for (let subelement in elem) {
                if (typeof subelement !== "number") {
                    result = false;
                }
            }
        }
        return result;
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

    this.checkForMemeInPictures = function (schema, metadata, res) {
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
     * This method creates the userSchema for the API
     */
    this.userAPI = function () {
        userSchema.find({username: "API"}, (err, lst) => {
            if (err) {
                console.log("500: Some problem with the database occurred");
            } else if (lst.length === 0) {
                const API = new userSchema({
                    username: "API",
                    fullName: "The API taking in requests from the outside",
                    password: "22012022",
                    currentToken: "",
                    email: "",
                    dateOfCreation: "2022-01-22--14:01:10",
                    lastEdited: [],
                    lastComments: [],
                });
                userSchema.create(API).then(_ => {
                    console.log("Creation of API succeeded");
                }).catch(_ => {
                    console.log("Creation of API failed");
                });
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


