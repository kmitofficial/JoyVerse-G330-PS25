# -*- coding: utf-8 -*-
#flask for creating web-application, request: to get incoming data from a POST request, jsonify :to send a json response
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np

# ====================
# LANDMARK TRANSFORMER (RAW 468x3)
# ====================
class LandmarkTransformer(nn.Module):
    def __init__(self, input_dim=3, num_classes=5, d_model=64, nhead=4, num_layers=3, dropout=0.2):
        super(LandmarkTransformer, self).__init__()
        self.embedding = nn.Linear(input_dim, d_model)
        self.pos_embedding = nn.Parameter(torch.randn(1, 468, d_model))
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=nhead,
            dim_feedforward=128,
            dropout=dropout,
            batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
        self.dropout = nn.Dropout(dropout)
        self.classifier = nn.Linear(d_model, num_classes)

    def forward(self, x):  # x: [batch_size, 468, 3]
        x = self.embedding(x)
        x = x + self.pos_embedding
        x = self.transformer(x)
        x = x.mean(dim=1)
        x = self.dropout(x)
        return self.classifier(x)

# ====================
# FLASK APP SETUP
# ====================
app = Flask(__name__)
CORS(app)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = LandmarkTransformer(input_dim=3, num_classes=5).to(device)
model.load_state_dict(torch.load('best_model.pth', map_location=device))
model.eval()

# Example label list (update if your labels are different)
EMOTION_LABELS = ['Anger', 'Disgust', 'Fear', 'Happiness',  'Neutral']

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'landmarks' not in data:
            return jsonify({'error': 'No landmarks data provided'}), 400

        landmarks = data['landmarks']
        # Accept both flat and nested input
        arr = np.array(landmarks, dtype=np.float32)
        if arr.shape == (1404,):
            arr = arr.reshape(468, 3)
        elif arr.shape == (468, 3):
            pass
        else:
            return jsonify({'error': f'Invalid landmarks shape: {arr.shape}, expected (468,3) or flat 1404'}), 400

        tensor = torch.tensor(arr, dtype=torch.float32).unsqueeze(0).to(device)  # [1, 468, 3]
        with torch.no_grad():
            output = model(tensor)
            probs = F.softmax(output, dim=1)
            pred_idx = torch.argmax(probs, dim=1).item()
        emotion = EMOTION_LABELS[pred_idx] if pred_idx < len(EMOTION_LABELS) else 'Unknown'
        return jsonify({'emotion': emotion})
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
