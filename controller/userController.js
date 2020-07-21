const del = require('del');
const path = require("path");

const multipleUploadMiddleware = require("../middleware/multipleUploadMiddleware");
var gen_user_code = require('../utils/gen_user_code');
var User = require('../models/User');

let debug = console.log.bind(console);

async function removeUserDir(user_code) {
    let dir_path = path.join(`${__dirname}/../public/upload/photos/` + user_code + '/');

    try {
        await del(dir_path);

        console.log(`${dir_path} is deleted!`);
        return true;
    } catch (err) {
        console.error(`Error while deleting ${dir_path}.`);
        return false;
    }
}

let addUser = async (req, res) => {
  let photos_path = [];

  try {
    // thực hiện upload
    await multipleUploadMiddleware(req, res);

    // Nếu upload thành công, không lỗi thì tất cả các file của bạn sẽ được lưu trong biến req.files

    req.files.forEach((file) => {
      photos_path.push(file.path);
    });

    let {full_name, email, address, phone_number, job, level, gender, birth_day} = req.body;
    let user_code = gen_user_code(full_name, birth_day);

    // Mình kiểm tra thêm một bước nữa, nếu như không có file nào được gửi lên thì trả về thông báo cho client
    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file or more.`);
    }

    var newUser = new User({
        name: full_name,
        email: email,
        code: user_code,
        phone_number: phone_number,
        gender: gender,
        birthday: birth_day,
        address: address,
        avatar: photos_path[0],
        photos: photos_path,
        job: job,
        level: level,
    });

        newUser.save((e) => {
            if(!e) {
                return res.send(`Thêm người dùng thành công!`);
            }
            else {
                debug(e);
            }
        })
    
   
  } catch (error) {
    // Nếu có lỗi thì debug lỗi xem là gì ở đây
    debug(error);

    // Bắt luôn lỗi vượt quá số lượng file cho phép tải lên trong 1 lần
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send(`Exceeds the number of files allowed to upload.`);
    }

    return res.send(`Error when trying upload many files: ${error}}`);
  }
};

let getAllUsers = async (req, res) => {
    
    User.find({}).exec((err, users) => {
        if(err) return res.send("ERROR: " + err);
        else {
            return res.render('users_list', {users: users});
        }
    });
}

let removeUser = async (req, res) => {
    let id = req.body.id;
    console.log(id);
    User.findOneAndDelete({_id: id}).exec(async (e, u) => {
        if(e) {
            
            return res.json({success: 'false'});
        }
        else {
            let user_code = u.code;
            let rs = await removeUserDir(user_code);
            if(rs) {
               
                 return res.json({success: 'true'});
            }
            else {
               
                return res.json({success: 'false'});
            }
           
        }
    });
}

module.exports = {
  addUser: addUser,
  getAllUsers: getAllUsers,
  removeUser: removeUser
};