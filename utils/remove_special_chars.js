function remove_special_chars(str) {
    str = str.replace(/[^A-Z0-9]/ig, "");
    str = str.replace(/[!@#$%^&*]/g, "");
    return str;
}

module.exports = remove_special_chars;