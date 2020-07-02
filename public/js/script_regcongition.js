const imageUpload = document.getElementById('imageUpload');

Promise.all([
	faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
	faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
	faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
	faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
	faceapi.nets.faceExpressionNet.loadFromUri('./models'),
	faceapi.nets.ageGenderNet.loadFromUri('./models'),
]).then(start)

async function start() {
	const container = document.createElement('div');
	container.style.position = 'relative';
	document.body.append(container);
	const labeledFaceDescriptors = await loadLabelImages()
	const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)

	let image;
	let canvas;

	document.body.append('Loaded');
	imageUpload.addEventListener('change', async () => {
		if(image) image.remove();
		if(canvas) canvas.remove();

		image = await faceapi.bufferToImage(imageUpload.files[0]);
		container.append(image);
		canvas = faceapi.createCanvasFromMedia(image);
		container.append(canvas);
		const displaySize = { width: image.width, height: image.height};
		faceapi.matchDimensions(canvas, displaySize);
		const detections = await faceapi.detectAllFaces(image)
							.withFaceLandmarks().withFaceExpressions()
							.withAgeAndGender().withFaceDescriptors()

		const resizedDetections = faceapi.resizeResults(detections, displaySize);
		const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))

		results.forEach((result,i ) => {
			
			console.log(resizedDetections[i].expressions);

			const box = resizedDetections[i].detection.box;

			let expressions;
			let main_expression;
			let arr = Object.values(resizedDetections[i].expressions);
			let max = Math.max(...arr);

			Object.keys(resizedDetections[i].expressions).forEach((key, index) => {
				let percent = resizedDetections[i].expressions[key];
				
				if(percent === max) {
					main_expression = key + " : " + percent.toFixed(2) * 100 + "%";
				}

				expressions = key + " : " + percent + "\n";
			});

			const drawBox = new faceapi.draw.DrawBox(box, { label: main_expression });
			drawBox.draw(canvas)

			const text = [
				"Age: " + resizedDetections[i].age.toFixed(1),
				"",
				"Gender: " + resizedDetections[i].gender
			]

			const anchor = { x: resizedDetections[i].alignedRect._box.x, y: resizedDetections[i].alignedRect._box.y}

			const drawOptions = {
				label: '',
				lineWidth: 4
			}

			const drawText = new faceapi.draw.DrawTextField(text, anchor, drawOptions)
				  drawText.draw(canvas)
		})
	})
}


function loadLabelImages() {
	const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark'];
	return Promise.all(
		labels.map(async label => {
			const descriptions = [];

			for(let i = 1; i <= 2; i++) {
				const img = await faceapi.fetchImage('/labeled_images/' + label + '/'+ i + '.jpg')
				const detections = await faceapi.detectSingleFace(img)
				.withFaceLandmarks().withFaceDescriptor()
				descriptions.push(detections.descriptor)
			}

			return new faceapi.LabeledFaceDescriptors(label, descriptions)
		})
	)
}