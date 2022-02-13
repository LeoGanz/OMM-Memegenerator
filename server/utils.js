const jwt = require("njwt");
const md5 = require('md5');
const userSchema = require("./models/userSchema");
const memeSchema = require("./models/memeSchema");


function getDomain() {
    return "http://localhost:8888"
}

/**
 * Gives back a date string that gives date and time back
 * @returns {string} date concatenated with times
 */
function getCurrentDateString() {
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
function respond(res, code, message, additionalInfo) {
    let logEntry = code + ": " + message;
    if (additionalInfo !== undefined) {
        logEntry += "; Additional info: " + additionalInfo;
    }
    if (!res.headersSent) {
        console.log(logEntry);
        res.set('Access-Control-Allow-Origin', '*');
        res.status(code).send(message);
    } else {
        console.log("Tried to respond, but response was already sent. Message was:\n" + logEntry)
    }
}

/**
 * Verification of a token with callbacks for success and failure.
 */
function jwtVerify(request, onSuccess, onFailure) {
    const adjustedToken = adjustToken(request);
    jwt.verify(adjustedToken, 'top-secret', (err) => {
        if (!err) {
            onSuccess();
        } else {
            onFailure();
        }
    })
}

/**
 * Same functionality as respond but without logging.
 */
function respondSilently(res, code, message) {
    if (!res.headersSent) {
        res.set('Access-Control-Allow-Origin', '*');
        res.status(code).send(message);
    }
}

/**
 * Utility handler for connection problems with the database.
 */
function dbConnectionFailureHandler(res, err) {
    return respond(res, 503, "Database access failed", err);
}

/**
 * Utility handler for instances where no meme is found.
 */
function noMemeFoundHandler(res, err) {
    return respond(res, 400, "No meme found", err);
}

/**
 * This method checks if every array in an array of arrays has the same length
 * @param arrayOfArrays the array of arrays to check
 * @returns {boolean} true if all elements are arrays and have the same length, false otherwise
 */
function checkForEqualLength(arrayOfArrays) {
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

/**
 * Calculate an unique identifier for a meme using MD5 hashes.
 */
function calcMemeIdFor(memeSchema) {
    const keyData =
        memeSchema.name
        + memeSchema.desc
        + memeSchema.img.base64
        + memeSchema.creator._id
        // For users the id can be used as a user with updated data (e.g. after marriage)
        // shall still be seen as the same person.
        // For texts the text data is used because an update to the text results in a different meme.
        + memeSchema.texts.map(text =>
            text.text + text.xCoordinate + text.yCoordinate + text.fontSize + text.color).join("")
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

/**
 * Extract the metadata from a meme.
 */
function parseMetadata(meme) {
    return {
        memeId: meme.memeId,
        name: meme.name,
        desc: meme.desc,
        creator: meme.creator.username,
        dateOfCreation: meme.dateOfCreation,
        format: meme.format,
        texts: meme.texts.map(cleanTextComponent),
        status: meme.status,
        usages: meme.usages,
        upVotes: meme.upVoters.length,
        downVotes: meme.downVoters.length,
        comments: meme.comments.map(cleanCommentComponent),
    }
}

/**
 * Try to retrieve a meme from the database and then parse its metadata.
 *
 * @param memeId identifier of the meme
 * @param onSuccess callback that processes metadata
 * @param onError callback that processes errors
 * @param onNoMemeAvailable callback for when no meme with the specified ID can be found
 */
function collectMetadata(memeId, onSuccess, onError, onNoMemeAvailable) {
    memeSchema
        .findOne({memeId: memeId})
        .populate('creator')
        .populate('comments')
        .populate({
            path: 'comments',
            populate: [{path: 'dateOfCreation'}, {path: 'text'}, {path: 'creator', select: 'username'}]
        })
        .populate('texts')
        .exec((err, meme) => {
            if (err) {
                onError(err);
            } else if (!meme) {
                onNoMemeAvailable();
            } else {
                onSuccess(parseMetadata(meme));
            }
        });
}

/**
 * Strip sensitive user information from a comment component.
 */
function cleanCommentComponent({dateOfCreation, creator, text}) {
    const username = creator.username;
    return ({dateOfCreation, username, text})
}

/**
 * Select important elements of text components. By default, all that are specified in the schema.
 */
function cleanTextComponent({text, xCoordinate, yCoordinate, fontSize, color}) {
    return ({text, xCoordinate, yCoordinate, fontSize, color});
}

/**
 * Strip sensitive user information from a meme and clean up data.
 */
function cleanMeme(meme) {
    const {
        name,
        desc,
        img,
        creator = {username: "N/A"},
        texts = [],
        dateOfCreation,
        upVoters = [],
        downVoters = [],
        comments = [],
        memeId,
        status,
        format,
        usages
    } = meme;

    return {
        name,
        desc,
        image: img.base64,
        creator: creator.username,
        texts: texts.map(cleanTextComponent),
        dateOfCreation,
        upVoters: upVoters.map(usr => usr.username),
        downVoters: downVoters.map(usr => usr.username),
        comments: comments.map(({dateOfCreation, text, creator = {username: "N/A"}}) => ({
            dateOfCreation,
            text,
            creator: creator.username
        })),
        memeId,
        status,
        format,
        usages
    };
}


/**
 * This method creates the userSchema for the API
 */
function userAPI() {
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
function createToken(email) {
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
function adjustToken(request) {
    let token = request.query.token;
    if (token === undefined) {
        token = ""
    }
    return token;
}

module.exports = {
    calcMemeIdFor,
    checkForEqualLength,
    cleanMeme,
    cleanTextComponent,
    parseMetadata,
    collectMetadata,
    createToken,
    dbConnectionFailureHandler,
    noMemeFoundHandler,
    getCurrentDateString,
    getDomain,
    jwtVerify,
    respond,
    respondSilently,
    userAPI
}
