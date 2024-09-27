'use client';

import { useState, useEffect } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';

export default function Home() {
	const [image, setImage] = useState<string | null>(null);
	const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
	const [prediction, setPrediction] = useState<string | null>(null);

	useEffect(() => {
		// Load the MobileNet model
		const loadModel = async () => {
			const loadedModel = await mobilenet.load();
			setModel(loadedModel);
		};
		loadModel();
	}, []);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setImage(imageUrl);
			setPrediction(null); // Reset prediction on new image upload
		}
	};

	const handlePredict = async () => {
		if (model && image) {
			const imgElement = document.getElementById('uploaded-image') as HTMLImageElement;
			const predictions = await model.classify(imgElement);
			setPrediction(predictions[0]?.className || 'Unable to classify');
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1 className="text-2xl font-bold mb-4">Image Classification App</h1>

			<input type="file" accept="image/*" onChange={handleImageUpload} />

			{image && (
				<div className="mt-4">
					<img id="uploaded-image" src={image} alt="Uploaded" className="w-64 h-64 object-cover" />
					<button
						onClick={handlePredict}
						className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
						Classify Image
					</button>
				</div>
			)}

			{prediction && (
				<div className="mt-4">
					<h2 className="text-xl">Prediction: {prediction}</h2>
				</div>
			)}
		</div>
	);
}
