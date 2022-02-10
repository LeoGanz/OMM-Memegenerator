const {Canvas, Image} = require("canvas");
const renderSchema = require("./models/renderSchema");
const memeSchema = require("./models/memeSchema");

function renderMeme(meme, quality = 0.8) {
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
    const prefix = meme.img.base64.startsWith("data:") ? "" : "data:;base64,"; // mime type omitted
    image.src = prefix + meme.img.base64;

    return canvas.toDataURL('image/jpeg', quality); // data url with base64 encoding
}

function renderMemeToSize(meme, bytes) {
    console.log("Rendering to size...")
    const maxBelowTarget = 0.05;
    const bytesBase64 = 1.37 * bytes; // base64 encodings are about 37% larger
    let quality = 1;

    // Perform binary search to find suitable quality for jpeg compression
    for (let delta = 0.5; delta > 0.01; delta /= 2) {
        const rendering = renderMeme(meme, quality)
        const bytesCurrent = Buffer.byteLength(rendering);
        console.log("Quality: " + quality + " - bytes in base64 string: " + bytesCurrent
            + " - expected img size: " + Math.round(bytesCurrent / 1.37))
        if (bytesCurrent > bytesBase64) {
            quality -= delta;
        } else if (bytesCurrent < (1 - maxBelowTarget) * bytesBase64 && quality < 1) {
            quality += delta;
            quality = Math.min(quality, 1);
        } else {
            return rendering;
        }
    }

    return "Error. JPEG cannot compress the requested meme this far. Target Size too small!"
}

function renderAndStoreMeme(meme) {
    renderSchema.create(new renderSchema({
        memeId: meme.memeId,
        dataUrl: renderMeme(meme)
    })).then(_ => {
        console.log("Rendered Meme " + meme.memeId);
    }).catch(err => console.log("Could not render Meme " + meme.memeId + " Reason: " + err));
}

function getOrRenderMemeInternal(memeId, targetFileSize, onSuccess, onError, onNoMemeFound, retry = true) {
    // use stored rendering if possible and no specific target size is requested.
    // otherwise, perform rendering
    renderSchema
        .findOne({memeId: memeId})
        .exec((err, render) => {
            if (targetFileSize || ((err || !render) && retry)) {
                memeSchema
                    .findOne({memeId: memeId})
                    .populate('texts')
                    .exec((err, meme) => {
                        if (err) {
                            onError(err);
                        } else {
                            if (meme) {
                                if (targetFileSize) {
                                    onSuccess(renderMemeToSize(meme, targetFileSize));
                                } else {
                                    renderAndStoreMeme(meme);
                                    return getOrRenderMemeInternal(memeId, targetFileSize, onSuccess, onError, onNoMemeFound, false);
                                }
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

function getOrRenderMeme(memeId, onSuccess, onError, onNoMemeFound) {
    return getOrRenderMemeInternal(memeId, undefined, onSuccess, onError, onNoMemeFound);
}

function getOrRenderMemeToSize(memeId, targetFileSize, onSuccess, onError, onNoMemeFound) {
    return getOrRenderMemeInternal(memeId, targetFileSize, onSuccess, onError, onNoMemeFound);
}

function getOrRenderMemesRec(memeIdArray, onSuccess, onError, result = []) {
    if (memeIdArray.length <= 0) {
        onSuccess(result);
    } else {
        const memeId = memeIdArray.shift();
        getOrRenderMeme(memeId, dataUrl => {
            result.push(dataUrl);
            getOrRenderMemesRec(memeIdArray, onSuccess, onError, result);
        }, onError, _ => undefined);
    }
}

function getOrRenderMemes(memeIdArray, onSuccess, onError) {
    return getOrRenderMemesRec(memeIdArray, onSuccess, onError);
}

module.exports = {renderMeme, renderAndStoreMeme, getOrRenderMeme, getOrRenderMemeToSize, getOrRenderMemes}