const textSchema = require("./models/textSchema");
const pictureSchema = require("./models/pictureSchema");
const utils = require("./utils");
const {renderAndStoreMeme} = require("./renderManager");
const ut = new utils();

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
    const numericData = [xCoordinates, yCoordinates]
    if (typeof name !== "string" || typeof desc !== "string") {
        ut.respond(res, 400, "Name or Description is no string");
        return false;
    }
    if (!ut.checkForEqualLength([texts, ...numericData])) {
        ut.respond(res, 400, "Please provide lists of equal length " +
            "for texts, xCoordinates and yCoordinates")
    }
    for (let text in texts) {
        if (typeof text !== "string") {
            ut.respond(res, 400, "texts are no strings");
            return false;
        }
    }
    for (const subarray of numericData) {
        for (const elem of subarray) {
            if (typeof elem !== "number") {
                ut.respond(res, 400, "coordinates or sizes are no number");
                return false;
            }
        }
    }
    //TODO check more properties
    return true;
}

function canNewMemeBeStoredInDb(metadata, onConnectionFailure, onAlreadyExists, onNotInDb) {
    pictureSchema.find({metadata: metadata}, (err, lst) => {
        if (err) {
            onConnectionFailure();
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
    let failureOccurred = false;
    for (let i = 0; i < texts.length && !failureOccurred; i++) {
        const text = texts[i];
        const xCoordinate = xCoordinates[i];
        const yCoordinate = yCoordinates[i];

        const textSch = new textSchema({
            text: text,
            xCoordinate: xCoordinate,
            yCoordinate: yCoordinate,
        });
        textSchema.create(textSch).then(_ => {
            newTexts.push(textSch);
            if (i === texts.length - 1 && !failureOccurred) {
                onSuccess(newTexts);
            }
        }).catch(_ => {
            failureOccurred = true;
            ut.respond(res, 503, "Error occurred during initialization of texts");
        });
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
        ut.respond(res, 200, "Memes successfully created; result: " + optionalResults);
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
            const picture = new pictureSchema({
                name: memeJson.name,
                desc: memeJson.desc,
                img: {
                    base64: newBackgroundImg
                },
                creator: creator,
                dateOfCreation: ut.getCurrentDateString(),
                upVoters: [],
                downVoters: [],
                comments: [],
                // metadata will be added afterwards
                status: newStatus, // 0 for a template, 1 for saved but
                // not published, 2 for published
                format: newFormat,
                texts: newTexts,
                usage: 0,
            });
            picture.metadata = ut.calcMetadataForMeme(picture)

            canNewMemeBeStoredInDb(picture.metadata, () => {
                ut.respond(res, 503, "Connection to db failed");
            }, () => {
                ut.respond(res, 400, "This meme does already exist");
            }, () => {
                renderAndStoreMeme(picture); // TODO run async
                pictureSchema.create(picture).then(_ => {
                    console.log("img saved, status: " + String(newStatus));
                    // Not using utils#addOneUsage with the background image,
                    // because using the same image does not count as using a template
                    // if the image is provided through the request instead of actually using the template.
                    // Old method did not handle multiple entries with the same backgroundImg anyway.
                    if (useTemplate) {
                        pictureSchema.findOneAndUpdate({metadata: optionalTemplate.metadata},
                            {usage: optionalTemplate.usage + 1});
                    }
                    let memeRelativeUrl = "/image?metadata=" + picture.metadata
                    if (optionalResults === undefined) {
                        // Process single meme directly
                        if (newStatus === 2) {
                            res.redirect(memeRelativeUrl);
                        } else {
                            ut.respond(res, 200, "Saving complete for meme " + picture.metadata);
                        }
                    } else {
                        // Process Memes as list
                        optionalResults += ut.getDomain() + memeRelativeUrl + "\n";
                        processMemeCreation(memeJsonArray, creator, res, optionalTemplate, optionalResults);
                    }
                    creator.lastEdited.push(picture);
                }).catch(err => {
                    ut.respond(res, 503, "Meme creation went wrong", err);
                });
            });
        });
    }
}

module.exports = {processSingleMemeCreation, processMultipleMemeCreations}