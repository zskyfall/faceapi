function string_to_date(str,char) {
    str = str.split(char);
    str = str[2] + '-' + str[1] + '-' + str[0];
    return new Date(str);
}

module.exports = string_to_date;