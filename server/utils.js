const jwt = require("njwt");
const userSchema = require("./models/userSchema");
const md5 = require('md5');
const textSchema = require("./models/textSchema");

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
    this.addOneUsage = function (schema, base, res, onSuccess) {
        schema.find({status: 0}, (err, lst) => {
            if (err) {
                console.log("503: Connection to db pictures failed; error: " + err);
                this.sendIfNotAlready(res, 503, "Connection to db pictures failed");
            } else {
                if (lst.length === 0) {
                    console.log("400: No template does exist");
                    this.sendIfNotAlready(res, 400, "No template does exist");
                }
                const foundTemplates = lst.filter((elem) => {
                    return elem.img.base64 === base;
                });
                if (foundTemplates.length === 0) {
                    console.log("400: This template does not exist");
                    this.sendIfNotAlready(res, 400, "This template does not exist");
                } else {
                    let template = foundTemplates[0];
                    template.usage = template.usage + 1;
                    onSuccess();
                }
            }
        });
    }

    /**
     * Diese Methode schickt ein result mit einem code und einer Message, wenn noch nichts im
     * selben Zug gesendet wurde
     * @param res das result
     * @param code der statuscode
     * @param message die zu schickende Nachricht
     */
    this.sendIfNotAlready = function (res, code, message) {
        if (!res.headersSent) {
            res.status(code).send(message);
        }
    }

    /**
     * This method checks if the given meme-array from the API is well-formed
     * @param memeOfCreateAPI the meme-array
     * @returns {boolean} true if well-formed and false if not
     */
    this.checkForAppropriateForm = function (memeOfCreateAPI) {
        let result = true;
        // console.log(memeOfCreateAPI);
        const name = memeOfCreateAPI.name;
        const desc = memeOfCreateAPI.desc;
        const texts = memeOfCreateAPI.texts;
        const {xCoordinates} = memeOfCreateAPI;
        const {xSizes} = memeOfCreateAPI;
        const {yCoordinates} = memeOfCreateAPI;
        const {ySizes} = memeOfCreateAPI;
        const data = [xCoordinates, yCoordinates, xSizes, ySizes]
        // console.log(data);
        const equalLength = this.checkForEqualLength(texts, data);
        // console.log(equalLength);
        if (typeof name !== "string" || typeof desc !== "string" || !equalLength) {
            console.log("name or description not a string or not equal length");
            result = false;
        }
        for (let text in texts) {
            if (typeof text !== "string") {
                console.log("texts not a string");
                result = false;
            }
        }
        for (let i = 0; i < data.length; i++) {
            const elem = data[i];
            // console.log(elem);
            for (let j = 0; j < elem.length; j++) {
                const subelement = elem[j];
                // console.log(subelement)
                if (typeof subelement !== "number") {
                    console.log("coordinates or sizes no number");
                    result = false;
                }
            }
        }
        return result;
    }

    /**
     * This method checks if every array in an array of arrays has the same length as the one of
     * the text array
     * @param texts a text array which should also have equal length
     * @param arrayOfArrays the given array of arrays
     * @returns {boolean} true if it is the case and false if not
     */
    this.checkForEqualLength = function (texts, arrayOfArrays) {
        // console.log(texts, arrayOfArrays);
        // console.log(texts.length);
        if (arrayOfArrays.length !== 0) {
            let length = texts.length;
            let result = true;
            for (let i = 0; i < arrayOfArrays.length; i++) {
                const elem = arrayOfArrays[i];
                // console.log(elem)
                if (elem.length !== length) {
                    // console.log(elem.length);
                    result = false;
                }
            }
            return result;
        } else {
            return true;
        }
    }

    this.canNewMemeBeStoredInDb = function (schema, metadata, onConnectionFailure, onFoundFailure, onSuccess) {
        schema.find({metadata: metadata}, (err, lst) => {
            if (err) {
                onConnectionFailure();
            } else {
                if (lst.length !== 0) {
                    onFoundFailure();
                } else {
                    onSuccess();
                }
            }
        })
    }

    this.calcMetadataForMeme = function (pictureSchema) {
        const keyData =
            pictureSchema.name
            + pictureSchema.desc
            + pictureSchema.img.base64
            + pictureSchema.creator._id
            // For users the id can be used as a user with updated data (e.g. after marriage)
            // shall still be seen as the same person.
            // For texts the text data is used because an update to the text results in a different meme.
            + pictureSchema.texts.map(text =>
                text.text + text.xCoordinate + text.yCoordinate + text.xSize + text.ySize).join("")
            + pictureSchema.upVoters.map(usr => usr._id).join("")
            + pictureSchema.downVoters.map(usr => usr._id).join("")
            + pictureSchema.comments.map(cmt => cmt._id).join("")
            + pictureSchema.status
            + pictureSchema.format.width
            + pictureSchema.format.height
            + pictureSchema.format.pixels
            + pictureSchema.usage;
        return md5(keyData);
    }


    this.processTextsInBody = function (memeJson, res, onSuccess) {
        let newTexts = [];
        const texts = memeJson.texts ?? [];
        const xCoordinates = memeJson.xCoordinates ?? [];
        const yCoordinates = memeJson.yCoordinates ?? [];
        const xSizes = memeJson.xSizes ?? [];
        const ySizes = memeJson.ySizes ?? [];
        if (texts.length !== xCoordinates.length ||
            texts.length !== yCoordinates.length ||
            texts.length !== xSizes.length ||
            texts.length !== ySizes.length) {
            console.log("400: Please provide lists of equal length " +
                "for texts, xCoordinates, yCoordinates, xSizes and ySizes");
            this.sendIfNotAlready(res, 400, "Please provide lists of equal length " +
                "for texts, xCoordinates, yCoordinates, xSizes and ySizes");
        } else {
            let failureOccurred = false;
            for (let i = 0; i < texts.length && !failureOccurred; i++) {
                const text = texts[i];
                const xCoordinate = xCoordinates[i];
                const yCoordinate = yCoordinates[i];
                const xSize = xSizes[i];
                const ySize = ySizes[i];

                const textSch = new textSchema({
                    text: text,
                    xCoordinate: xCoordinate,
                    yCoordinate: yCoordinate,
                    xSize: xSize,
                    ySize: ySize
                });
                textSchema.create(textSch).then(_ => {
                    newTexts.push(textSch);
                }).catch(_ => {
                    failureOccurred = true;
                    console.log("503: Error occurred during initialization of texts");
                    this.sendIfNotAlready(res, 503, "Error occurred during initialization of texts");
                });
            }
            if (!failureOccurred) {
                onSuccess(newTexts);
            }
        }
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


