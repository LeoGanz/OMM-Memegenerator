const {Canvas, Image} = require("canvas");
const renderSchema = require("./models/renderSchema");
const memeSchema = require("./models/memeSchema");

function renderMeme(meme) {
    const image = new Image();
    const canvas = new Canvas(meme.format.width, meme.format.height)
    const ctx = canvas.getContext('2d');
    image.onload = () => {

        // Black background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, meme.format.width, meme.format.height);

        // draw image in the middle of the specified area
        ctx.drawImage(image,
            (meme.format.width - image.width) / 2,
            (meme.format.height - image.height) / 2);

        // Draw text components
        for (const textComponent of meme.texts) {
            // specifications like in HTML 5 Canvas API
            ctx.font = (textComponent.fontSize ?? 30) + 'px Impact';
            ctx.fillStyle = textComponent.color ?? "white";

            ctx.fillText(textComponent.text, textComponent.xCoordinate, textComponent.yCoordinate);
        }
    };
    image.src = "data:;base64," + meme.img.base64; // mime type omitted


    return canvas.toDataURL('image/jpeg', 0.8); // data url with base64 encoding
}

function renderAndStoreMeme(meme) {
    renderSchema.create(new renderSchema({
        memeId: meme.memeId,
        dataUrl: renderMeme(meme)
    })).then(_ => {
        console.log("Rendered Meme " + meme.memeId);
    }).catch(err => console.log("Could not render Meme " + meme.memeId + " Reason: " + err));
}

function getOrRenderMemeInternal(memeId, onSuccess, onNoMemeFound, onError, retry = true) {
    renderSchema
        .findOne({memeId: memeId})
        .exec((err, render) => {
            if ((err || !render) && retry) {
                memeSchema
                    .findOne({memeId: memeId})
                    .populate('texts')
                    .exec((err, meme) => {
                        if (err) {
                            onError(err);
                        } else {
                            if (meme) {
                                renderAndStoreMeme(meme);
                                return getOrRenderMeme(memeId, onSuccess, onError, onNoMemeFound, false);
                            } else {
                                onNoMemeFound();
                            }
                        }
                    });
            } else if (render) {
                onSuccess(render.dataUrl)
            } else {
                onError("Could not load rendered meme or rerender it.")
            }
        });
}

function getOrRenderMeme(memeId, onSuccess, onNoMemeFound, onError) {
    return getOrRenderMemeInternal(memeId, onSuccess, onNoMemeFound, onError);
}

function getOrRenderMemesRec(memeIdArray, onSuccess, onError, result = []) {
    if (memeIdArray.length <= 0) {
        onSuccess(result);
    } else {
        const memeId = memeIdArray.shift();
        getOrRenderMeme(memeId, dataUrl => {
                result.push(dataUrl);
                getOrRenderMemesRec(memeIdArray, onSuccess, onError, result);
            }, _ => undefined,
            onError);
    }
}
function getOrRenderMemes(memeIdArray, onSuccess, onError) {
    return getOrRenderMemesRec(memeIdArray, onSuccess, onError);
}

module.exports = {renderMeme, renderAndStoreMeme, getOrRenderMeme, getOrRenderMemes}