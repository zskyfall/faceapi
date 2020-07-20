function gen_user_code(name, birh_day) {
    let arrName = name.split(" ");
    let code = "";

    for(var i=0;i<arrName.length;i++) {
        code += arrName[i][0];
    }

    code = code.toUpperCase();

    return code + "_" + birh_day.replace(/-/g, "_");
}

module.exports = gen_user_code;