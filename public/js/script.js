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

video.addEventListener('play', () => {
	const canvas = faceapi.createCanvasFromMedia(video)
	document.body.append(canvas)
	const displaySize = {width: video.width, height: video.height}
	faceapi.matchDimensions(canvas, displaySize)
	setInterval(async () => {
		const detections = await faceapi.detectAllFaces(video)
		.withFaceLandmarks()
		.withAgeAndGender().withFaceDescriptors()
		console.log(detections)

		const resizedDectections = faceapi.resizeResults(detections, displaySize)
		canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height)
		//faceapi.draw.drawDetections(canvas, resizedDectections)
		//faceapi.draw.drawFaceLandmarks(canvas, resizedDectections)


		const text = [
			"Age: " + detections[0].age.toFixed(1),
			"",
			"Gender: " + detections[0].gender		
		]

		const anchor = { x: detections[0].alignedRect._box.x, y: detections[0].alignedRect._box.y}

		const drawOptions = {
			label: 'Tao la thang',
			lineWidth: 2
		}

		const drawBox = new faceapi.draw.DrawTextField(text, anchor, drawOptions)
			  drawBox.draw(canvas)
	}, 100)
})


