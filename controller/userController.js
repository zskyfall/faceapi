const multipleUploadMiddleware = require("../middleware/multipleUploadMiddleware");
var gen_user_code = require('../utils/gen_user_code');
var User = require('../models/User');

let debug = console.log.bind(console);

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

module.exports = {
  addUser: addUser,
  getAllUsers: getAllUsers
};