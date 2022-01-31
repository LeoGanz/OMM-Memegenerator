const {Canvas, Image} = require("canvas");
const renderSchema = require("./models/renderSchema");
const pictureSchema = require("./models/pictureSchema");

function renderMeme(picture) {
    const image = new Image();
    const canvas = new Canvas(picture.format.width, picture.format.height)
    const ctx = canvas.getContext('2d');
    image.onload = () => {

        // Black background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, picture.format.width, picture.format.height);

        // draw image in the middle of the specified area
        ctx.drawImage(image,
            (picture.format.width - image.width) / 2,
            (picture.format.height - image.height) / 2);

        // Draw text components
        for (const textComponent of picture.texts) {
            console.log("drawing txt " + textComponent.text)
            // specifications like in HTML 5 Canvas API
            ctx.font = (textComponent.fontSize ?? 30) + 'px Impact';
            ctx.fillStyle = textComponent.color ?? "white";

            ctx.fillText(textComponent.text, textComponent.xCoordinate, textComponent.yCoordinate);
        }
    };
    image.src = "data:;base64," + picture.img.base64; // mime type omitted


    return canvas.toDataURL('image/jpeg', 0.8); // data url with base64 encoding
}

function renderAndStoreMeme(picture) {
    renderSchema.create(new renderSchema({
        metadata: picture.metadata,
        dataUrl: renderMeme(picture)
    })).then(_ => {
        console.log("Rendered Meme " + picture.metadata);
    }).catch(err => console.log("Could not render Meme " + picture.metadata + " Reason: " + err));
}

function getOrRenderMeme(metadata, onSuccess, onNoMemeFound, onError, retry = true) {
    renderSchema.find({metadata: metadata}, (err, lst) => {
        if ((err || lst.length === 0) && retry) {
            pictureSchema.find({metadata: metadata}, (err, lst) => {
                if (err) {
                    onError(err);
                } else {
                    if (lst.length === 0) {
                        onNoMemeFound();
                    } else {
                        renderAndStoreMeme(lst[0]);
                        return getOrRenderMeme(metadata, onSuccess, onError, onNoMemeFound, false);
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