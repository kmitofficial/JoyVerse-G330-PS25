from flask import Flask, request, jsonify
import torch
import numpy as np
import torch.nn.functional as F
from model import EmotionTransformer  

app = Flask(__name__)

device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = EmotionTransformer(input_dim=1404, num_classes=5).to(device)
model.load_state_dict(torch.load('best_model.pth'))
model.eval()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        landmarks = data['landmarks']

        landmarks = np.array(landmarks).flatten()  # Flatten the landmarks into a single array
        landmarks = torch.tensor(landmarks, dtype=torch.float32).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(landmarks)

            print(f"Raw model output: {output}")

            probabilities = F.softmax(output, dim=1)

            print(f"Probabilities: {probabilities}")

            _, predicted = torch.max(probabilities, 1)

        emotion = get_emotion_label(predicted.item())

        return jsonify({'emotion': emotion})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

def get_emotion_label(index):
    emotion_labels = ['Anger', 'Disgust', 'Fear', 'Happiness', 'Sadness', 'Surprise']
    if index < len(emotion_labels):
        return emotion_labels[index]
    else:
        return 'Unknown' 

if __name__ == '__main__':
    app.run(debug=True)
