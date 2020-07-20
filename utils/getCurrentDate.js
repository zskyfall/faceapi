
function getCurrentDate() {
	var today = new Date();
	var date = today.getDate() + '-' + (today.getMonth()+1) + '-' + today.getFullYear();
	return date;
}

module.exports = getCurrentDate;