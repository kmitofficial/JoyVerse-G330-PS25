from flask import Flask, request, jsonify
import torch
import numpy as np
import torch.nn.functional as F
from model import EmotionTransformer  # Assuming the model class is saved as model.py

# Initialize Flask app
app = Flask(__name__)

# Load the pre-trained emotion model
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = EmotionTransformer(input_dim=1404, num_classes=5).to(device)
model.load_state_dict(torch.load('best_model.pth'))
model.eval()

# Route to handle emotion prediction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Receive landmarks data from POST request
        data = request.get_json()
        landmarks = data['landmarks']

        # Convert landmarks to the format expected by the model
        landmarks = np.array(landmarks).flatten()  # Flatten the landmarks into a single array
        landmarks = torch.tensor(landmarks, dtype=torch.float32).unsqueeze(0).to(device)

        # Predict emotion
        with torch.no_grad():
            output = model(landmarks)

            # Print the raw model output (logits)
            print(f"Raw model output: {output}")

            # Apply softmax to get probabilities
            probabilities = F.softmax(output, dim=1)

            # Print the probabilities
            print(f"Probabilities: {probabilities}")

            # Get the predicted class (index of the highest probability)
            _, predicted = torch.max(probabilities, 1)

        # Get predicted emotion
        emotion = get_emotion_label(predicted.item())

        return jsonify({'emotion': emotion})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Function to map model output to emotion label
def get_emotion_label(index):
    emotion_labels = ['Anger', 'Disgust', 'Fear', 'Happiness', 'Sadness', 'Surprise']
    # Check if the predicted index is within bounds (this is important as the model has 5 outputs)
    if index < len(emotion_labels):
        return emotion_labels[index]
    else:
        return 'Unknown'  # In case the index is out of range

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
