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
            console.log("drawing txt " + textComponent.text)
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

function getOrRenderMeme(memeId, onSuccess, onNoMemeFound, onError, retry = true) {
    renderSchema.find({memeId: memeId}, (err, lst) => {
        if ((err || lst.length === 0) && retry) {
            memeSchema.find({memeId: memeId}, (err, lst) => {
                if (err) {
                    onError(err);
                } else {
                    if (lst.length === 0) {
                        onNoMemeFound();
                    } else {
                        renderAndStoreMeme(lst[0]);
                        return getOrRenderMeme(memeId, onSuccess, onError, onNoMemeFound, false);
                    }
                }
            });
        } else if (lst.length > 0) {
            onSuccess(lst[0].dataUrl)
        } else {
            onError("Could not load rendered meme or rerender it.")
        }
    });
}

module.exports = {renderMeme, renderAndStoreMeme, getOrRenderMeme}