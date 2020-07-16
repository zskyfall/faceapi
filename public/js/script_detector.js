const video = document.getElementById('video');

Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
	faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
	faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
	//faceapi.nets.faceExpressionNet.loadFromUri('./models'),
	faceapi.nets.ageGenderNet.loadFromUri('./models'),
	faceapi.nets.ssdMobilenetv1.loadFromUri('./models')
]).then(startVideo)

function startVideo() {
	navigator.getUserMedia(
		{	video: {} },
		stream => video.srcObject = stream,
		err => console.error(err)
	)
}

function loadLabelImages() {
	const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thang', 'Thor', 'Tony Stark'];
	return Promise.all(
		labels.map(async label => {
			const descriptions = [];

			for(let i = 1; i <= 2; i++) {
				const img = await faceapi.fetchImage('/labeled_images/' + label + '/'+ i + '.jpg')
				const detections = await faceapi.detectSingleFace(img)
				.withFaceLandmarks().withFaceDescriptor()
				descriptions.push(detections.descriptor)

				//console.log("load image: " + label + " - " + descriptions);
			}

			return new faceapi.LabeledFaceDescriptors(label, descriptions)
		})
	)
}

function getCurrentTime() {
	var today = new Date();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	return time;
}

function getCurrentDate() {
	var today = new Date();
	var date = today.getDate() + '-' + (today.getMonth()+1) + '-' + today.getFullYear();
	return date;
}

async function isAttendanced(id, date, time) {
	let url = 'http://localhost:3000/attendance/' + id + '/' + date + '/' + time;
	var check = fetch(url)
		.then(async function(response) {
		    if (!response.ok) {
		    	return false;
		  	}
		  // Read the response as json.
		  	response = await response.json();
		  	console.log(response.isAttendanced);
		  	if(response.isAttendanced === 'true') {
		  		return true;
		  	}
		  	else {
		  		return false;
		  	}
		  	//console.log(await response.json());
		})
		.catch(function(error) {
		  	return false;
		});
	return check;
}

async function getAttendancDetail(id) {
	let url = 'http://localhost:3000/detail/attendance/' + id;
	var check = fetch(url)
		.then(async function(response) {
		    if (!response.ok) {
		    	return response;
		  	}
		  // Read the response as json.
		  	response = await response.json();
		  	return response;
		  	//console.log(await response.json());
		})
		.catch(function(error) {
		  	return error;
		});
	return check;
}

(async function() {
	let response = await getAttendancDetail('Thang');
	if(response.success === 'true') {
  		console.log(response.detail);
  	}
  	else {
  		console.log(response);
  	}
	console.log("xxx: " + response);
});


video.addEventListener('play', async () => {
	const canvas = faceapi.createCanvasFromMedia(video)

	document.body.append(canvas)
	const displaySize = {width: video.width, height: video.height}
	faceapi.matchDimensions(canvas, displaySize);

	const labeledFaceDescriptors = await loadLabelImages()
	const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.8)

	setInterval(async () => {
		const detections = await faceapi.detectAllFaces(video)
		.withFaceLandmarks()
		.withFaceDescriptors()
		//console.log(detections)

		const resizedDetections = faceapi.resizeResults(detections, displaySize)
		canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height)
		//faceapi.draw.drawDetections(canvas, resizedDectections)
		//faceapi.draw.drawFaceLandmarks(canvas, resizedDectections)

		const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))

		results.forEach(async (result,i ) => {

			let label;
			let boxColor = "red";
			var name = result.toString();
  			var ind = name.indexOf("(");
				name = name.substring(0, ind).trim();

			if(name !== 'unknown') {
				if(await isAttendanced(name, getCurrentDate(), getCurrentTime())) {
					let detail = await getAttendancDetail(name);
					if(detail.success === 'true') {
				  		label = name + " " + "đã điểm danh: " + detail.detail.time + " | " + detail.detail.date;
						boxColor = "green";
				  	}
				}
				else {
					label = result.toString();
				}
			}
			const box = resizedDetections[i].detection.box;

			const boxOption = {
				label: label,
				boxColor: boxColor
			};
			const drawBox = new faceapi.draw.DrawBox(box, boxOption);
			drawBox.draw(canvas)
  			
  			var trust_score = resizedDetections[i].detection.score;

		});


		// const text = [
		// 	"Age: " + detections[0].age.toFixed(1),
		// 	"",
		// 	"Gender: " + detections[0].gender		
		// ]

		// const anchor = { x: detections[0].alignedRect._box.x, y: detections[0].alignedRect._box.y}

		// const drawOptions = {
		// 	label: 'Tao la thang',
		// 	lineWidth: 2
		// }

		// const drawBox = new faceapi.draw.DrawTextField(text, anchor, drawOptions)
		// 	  drawBox.draw(canvas)
	}, 1000)
})


