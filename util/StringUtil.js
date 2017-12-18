const bcrypt = require('bcrypt')

module.exports = {
    hashPassword(password, callback)  {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                callback(hash);
            })
        })
    },
    checkCorrectPassword(password, hashedPassword, callback)  {
        bcrypt.compare(password, hashedPassword, function (err, res) {
        callback(res);
        })
    },

    makePreview(string) {
        var index = 0;
        if(string.length > 200) {
            index = string.slice(200, string.length).indexOf(' ');
            string = string.slice(0, 200 + index);
        }
        return string;
    },
    makePreviewLeft(string) {
        var index = 0;
        if(string.length > 50) {
            index = string.slice(0, 50).lastIndexOf(' ');
            string = string.slice(0, index);
            string += "...";
        }
        return string;
    },
    makePreviewCenter(string) {
        var index = 0;
        if(string.length > 45) {
            index = string.slice(0, 45).lastIndexOf(' ');
            string = string.slice(0, index);
            string += "...";
        }
        return string;
    },
    makePreviewSerie(string) {
        var index = 0;
        if(string.length > 60) {
            index = string.slice(0, 60).lastIndexOf(' ');
            string = string.slice(0, index);
            string += "...";
        }
        return string;
    },
    makePreviewSerieAdmin(string) {
        var index = 0;
        if(string.length > 150) {
            index = string.slice(0, 150).lastIndexOf(' ');
            string = string.slice(0, index);
            string += "...";
        }
        return string;
    },
    makePreviewAuthorCenter(string) {
        var index = 0;
        if(string.length > 28) {
            index = string.slice(0, 28).lastIndexOf(' ');
            string = string.slice(0, index);
            string += "...";
        }
        return string;
    },
    makePreviewAuthorLeft(string) {
        var index = 0;
        if(string.length > 25) {
            index = string.slice(0, 25).lastIndexOf(' ');
            string = string.slice(0, index);
            string += "...";
        }
        return string;
    },
    showMore(string){
        var index = 0;
        if(string.length > 200) {
            index = string.slice(200, string.length).indexOf(' ');
            string = string.slice(200 + index, string.length);
        }
        return string;
    }
}   

