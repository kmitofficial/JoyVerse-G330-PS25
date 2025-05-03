import * as faceapi from 'face-api.js';
import { FaceApiModel } from './types';
import { MODEL_URL } from './config';

export async function loadFaceApi(): Promise<FaceApiModel> {
  try {
    // Load all required models for better emotion detection
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ]);

    return {
      type: 'face-api',
      detectEmotion: async (video: HTMLVideoElement) => {
        try {
          const result = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();

          if (!result?.expressions) {
            console.log('No face or expressions detected');
            return null;
          }

          // Get most confident expression
          const entries = Object.entries(result.expressions);
          const sorted = entries.sort((a, b) => b[1] - a[1]);
          console.log('Detected expressions:', entries);
          console.log('Most confident expression:', sorted[0]);
          return sorted[0][0]; // e.g. 'happy', 'sad', etc.
        } catch (error) {
          console.error('Error detecting emotion:', error);
          return null;
        }
      }
    };
  } catch (error) {
    console.error('Error loading face-api models:', error);
    throw new Error('Failed to load face-api models');
  }
}
