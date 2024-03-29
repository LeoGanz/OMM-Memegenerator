const textSchema = require("./models/textSchema");
const memeSchema = require("./models/memeSchema");
const {renderAndStoreMeme} = require("./renderManager");
const {
    checkForEqualLength,
    respond,
    getCurrentDateString,
    calcMemeIdFor,
    dbConnectionFailureHandler, getDomain
} = require("./utils");

/**
 * This method checks if the given meme-array from the API is well-formed
 * @param memeJson the meme-array
 * @param res http response object
 * @returns {boolean} true if well-formed and false if not
 */
function checkForAppropriateForm(memeJson, res) {
    const name = memeJson.name;
    const desc = memeJson.desc;
    const texts = memeJson.texts ?? [];
    const xCoordinates = memeJson.xCoordinates ?? [];
    const yCoordinates = memeJson.yCoordinates ?? [];
    const fontSizes = memeJson.fontSizes ?? [];
    const colors = memeJson.colors ?? [];
    const alphabeticData = [texts, colors]
    const numericData = [xCoordinates, yCoordinates, fontSizes];
    const required = [texts, xCoordinates, yCoordinates];
    if (typeof name !== "string" || typeof desc !== "string") {
        respond(res, 400, "Name or Description is no string");
        return false;
    }
    if (!checkForEqualLength(required)) {
        respond(res, 400, "Please provide lists of equal length " +
            "for texts, xCoordinates and yCoordinates")
    }
    for (const subarray in alphabeticData) {
        for (const elem in subarray) {
            if (typeof elem !== "string") {
                respond(res, 400, "texts or colors are no strings");
                return false;
            }
        }
    }
    for (const subarray of numericData) {
        for (const elem of subarray) {
            if (typeof elem !== "number") {
                respond(res, 400, "coordinates or fontSizes are no number");
                return false;
            }
        }
    }
    //TODO check more properties
    return true;
}

function canNewMemeBeStoredInDb(memeId, onConnectionFailure, onAlreadyExists, onNotInDb) {
    memeSchema.find({memeId: memeId}, (err, lst) => {
        if (err) {
            onConnectionFailure(err);
        } else {
            if (lst.length !== 0) {
                onAlreadyExists();
            } else {
                onNotInDb();
            }
        }
    })
}

function processTextsInBody(memeJson, res, onSuccess) {
    // Format check for whole memeJson is done by processMemeCreation Method
    let newTexts = [];
    const texts = memeJson.texts ?? [];
    const xCoordinates = memeJson.xCoordinates ?? [];
    const yCoordinates = memeJson.yCoordinates ?? [];
    const fontSizes = memeJson.fontSizes ?? [];
    const colors = memeJson.colors ?? [];
    let failureOccurred = false;
    if (texts.length === 0) {
        onSuccess([]);
    } else {
        for (let i = 0; i < texts.length && !failureOccurred; i++) {
            const text = texts[i];
            const xCoordinate = xCoordinates[i];
            const yCoordinate = yCoordinates[i];
            const fontSize = fontSizes[i];
            const color = colors[i];

            const textSch = new textSchema({
                text: text,
                xCoordinate: xCoordinate,
                yCoordinate: yCoordinate,
                fontSize: fontSize,
                color: color,
            });
            textSchema.create(textSch).then(_ => {
                newTexts.push(textSch);
                if (i === texts.length - 1 && !failureOccurred) {
                    onSuccess(newTexts);
                }
            }).catch(reason => {
                failureOccurred = true;
                respond(res, 503, "Error occurred during initialization of texts", reason);
            });
        }
    }
}

function processSingleMemeCreation(memeJson, creator, res, optionalTemplate) {
    return processMemeCreation([memeJson], creator, res, optionalTemplate)

}

function processMultipleMemeCreations(memeJsonArray, creator, res, optionalTemplate) {
    return processMemeCreation(memeJsonArray, creator, res, optionalTemplate,
        "Your created memes can be found under the following URLs:\n")

}

// When creating a meme from a template the background image and its format will be taken from the template.
// All texts have to be provided by the user of this api.
// (Texts in the template will only be a guide for the user but not be brought directly to the new meme)
function processMemeCreation(memeJsonArray, creator, res, optionalTemplate, optionalResults) {
    if (optionalResults !== undefined && memeJsonArray.length === 0) {
        // results being present indicates use of results list
        // empty meme array is end of recursion
        respond(res, 200, "Memes successfully created; result: " + optionalResults);
        return;
    }
    let memeJson = memeJsonArray.shift(); // take first elem from array
    if (checkForAppropriateForm(memeJson, res)) {
        processTextsInBody(memeJson, res, newTexts => {

            let useTemplate = optionalTemplate !== undefined;
            const newStatus = memeJson.status ?? 2;
            let newFormat = useTemplate ? optionalTemplate.format :
                {
                    width: parseFloat(memeJson.width),
                    height: parseFloat(memeJson.height),
                    pixels: parseFloat(memeJson.pixels)
                };
            let newBackgroundImg = useTemplate ? optionalTemplate.img.base64 : memeJson.image;
            const meme = new memeSchema({
                name: memeJson.name,
                desc: memeJson.desc,
                img: {
                    base64: newBackgroundImg
                },
                creator: creator,
                dateOfCreation: getCurrentDateString(),
                upVoters: [],
                downVoters: [],
                comments: [],
                // memeId will be added afterwards
                status: newStatus, // 0 for a template, 1 for saved but
                // not published, 2 for published
                format: newFormat,
                texts: newTexts,
                usages: 0,
            });
            meme.memeId = calcMemeIdFor(meme)

            canNewMemeBeStoredInDb(meme.memeId, err => {
                dbConnectionFailureHandler(res, err)
            }, () => {
                respond(res, 400, "This meme does already exist");
            }, () => {
                renderAndStoreMeme(meme); // TODO run async
                memeSchema.create(meme).then(_ => {
                    console.log("img saved, status: " + String(newStatus));
                    // Not using utils#addOneUsage with the background image,
                    // because using the same image does not count as using a template
                    // if the image is provided through the request instead of actually using the template.
                    // Old method did not handle multiple entries with the same backgroundImg anyway.
                    if (useTemplate) {
                        optionalTemplate.usages += 1;
                        optionalTemplate.save();
                    }
                    let memeRelativeUrl = getDomain() + "/details/" + meme.memeId
                    if (optionalResults === undefined) {
                        // Process single meme directly
                        respond(res, 200, "Saving complete for meme " + meme.memeId + "\n" + memeRelativeUrl);
                    } else {
                        // Process Memes as list
                        optionalResults += memeRelativeUrl + "\n";
                        processMemeCreation(memeJsonArray, creator, res, optionalTemplate, optionalResults);
                    }
                    creator.lastEdited.push(meme);
                    creator.save();
                }).catch(err => {
                    respond(res, 503, "Meme creation went wrong", err);
                });
            });
        });
    }
}

module.exports = {processSingleMemeCreation, processMultipleMemeCreations}