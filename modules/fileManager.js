var fs = require('fs').promises;
var change_vi_alias = require('../utils/change_vi_alias');

async function saveFile(file, dir) {

		var originalname = file.originalname;
        //  originalname = originalname.replace(".","_")+image_extension;
        //var destination = file.destination;
        var filename = file.filename;

        //var image = '/uploads/' + dir + '/' + originalname;
        var dirname = __dirname + "";
        	dirname = dirname.replace("modules","");
        	//console.log(dirname);
        var finalName = filename + originalname;
        	finalName = change_vi_alias(finalName);

        var pathUpload = dirname + 'public/uploads/' + dir + '/' + finalName;
        var result;

		await fs.readFile(file.path)
		  .then(async (data) => {
		  		await fs.writeFile(pathUpload, data)
	              	  .then(() => {
					    result = pathUpload;
					  })
					  .catch(er => {
					    console.log(er);
					  });
		  })
		  .catch(err => {
		  		console.log(err);
		  }); 
	    
		return result;
		
}

module.exports = {
	saveFile: saveFile
};