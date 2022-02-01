const jwt = require("njwt");
const md5 = require('md5');
const userSchema = require("./models/userSchema");
const memeSchema = require("./models/memeSchema");

module.exports = function () {

    this.getDomain = function () {
        return "localhost:3000"
    };

    /**
     * Gives back a date string that gives date and time back
     * @returns {string} date concatenated with times
     */
    this.getCurrentDateString = function () {
        const today = new Date();
        return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
            + '--' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    }

    /**
     * This method sends a response to the client containing the specified http code and message if the response is
     * still open. Responses are logged to console.
     *
     * @param res the http response object
     * @param code the http status code
     * @param message the message to send
     * @param additionalInfo optional additional info for errors. This will only be logged to console but not sent to
     * the client
     */
    this.respond = function (res, code, message, additionalInfo) {
        let logEntry = code + ": " + message;
        if (additionalInfo !== undefined) {
            logEntry += "; Additional info: " + additionalInfo;
        }
        if (!res.headersSent) {
            console.log(logEntry);
            res.status(code).send(message);
        } else {
            console.log("Tried to respond, but response was already sent. Message was:\n" + logEntry)
        }
    }

    /**
     * Same functionality as respond but without logging.
     */
    this.respondSilently = function (res, code, message) {
        if (!res.headersSent) {
            res.status(code).send(message);
        }
    }
    this.dbConnectionFailureHandler = (res, err) => this.respond(res, 503, "Connection to db failed", err);
    this.noMemeFoundHandler = (res) => this.respond(res, 400, "No meme found");

    /**
     * This method checks if every array in an array of arrays has the same length
     * @param arrayOfArrays the array of arrays to check
     * @returns {boolean} true if all elements are arrays and have the same length, false otherwise
     */
    this.checkForEqualLength = function (arrayOfArrays) {
        if (!Array.isArray(arrayOfArrays)) {
            return false;
        }
        if (arrayOfArrays.length === 0) {
            return true;
        }
        let length = arrayOfArrays[0].length;
        for (const subarray of arrayOfArrays) {
            if (!Array.isArray(subarray) || subarray.length !== length) {
                return false;
            }
        }
        return true;
    }

    this.calcMemeIdFor = function (memeSchema) {
        const keyData =
            memeSchema.name
            + memeSchema.desc
            + memeSchema.img.base64
            + memeSchema.creator._id
            // For users the id can be used as a user with updated data (e.g. after marriage)
            // shall still be seen as the same person.
            // For texts the text data is used because an update to the text results in a different meme.
            + memeSchema.texts.map(text =>
                text.text + text.xCoordinate + text.yCoordinate + text.xSize + text.ySize).join("")
            // + memeSchema.upVoters.map(usr => usr._id).join("")
            // + memeSchema.downVoters.map(usr => usr._id).join("")
            // + memeSchema.comments.map(cmt => cmt._id).join("")
            + memeSchema.status
            + memeSchema.format.width
            + memeSchema.format.height
            + memeSchema.format.pixels
            // + memeSchema.usages;
        return md5(keyData);
    }

    this.collectMetadata = function (memeId, onSuccess, onError, onNoMemeAvailable) {
        memeSchema
            .findOne({memeId: memeId})
            .populate('creator', 'username')
            .populate('texts')
            .exec((err, meme) => {
                if (err) {
                    onError(err);
                } else if (!meme) {
                    onNoMemeAvailable();
                } else {
                    const metadata = {
                        name: meme.name,
                        desc: meme.desc,
                        creator: meme.creator.username,
                        dateOfCreation: meme.dateOfCreation,
                        format: meme.format,
                        texts: meme.texts.map(({text, xCoordinate, yCoordinate}) => ({text, xCoordinate, yCoordinate})),
                        status: meme.status,
                        usages: meme.usages,
                        upVotes: meme.upVoters.length,
                        downVotes: meme.downVoters.length,
                        comments: meme.comments.length,
                    }
                    onSuccess(metadata);
                }
            });

    };


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


