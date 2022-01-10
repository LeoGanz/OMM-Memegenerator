module.exports = function () {

    this.giveBackDateString = function () {
        const today = new Date();
        const creationDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
            + '--' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return creationDate;
    }

    this.findUpdateSingleValueDB = function (schema, partFind, partUpdate) {
        schema.findOneAndUpdate(partFind, partUpdate, (err) => {
            if (err) {
                return false;
            } else {
                return true;
            }
        });
    }
}


