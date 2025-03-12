# import cv2
# import mediapipe as mp
# import numpy as np
# import pandas as pd
# import time
# import os
# import argparse
# from sklearn.svm import SVC
# import joblib

# # Define directories and file names for saving images and landmarks
# IMAGES_DIR = "captured_images"  # Directory to store captured images
# CSV_FILE = "landmarks.csv"       # CSV file to save facial landmark data
# SVM_MODEL_FILE = "svm_model.pkl" # File to save the trained SVM model

# # Create the images directory if it does not exist
# if not os.path.exists(IMAGES_DIR):
#     os.makedirs(IMAGES_DIR)

# # Initialize MediaPipe FaceMesh solution with desired parameters
# mp_face_mesh = mp.solutions.face_mesh
# face_mesh = mp_face_mesh.FaceMesh(
#     static_image_mode=False,     # For video stream, set to False
#     max_num_faces=1,             # Process only one face
#     min_detection_confidence=0.5,
#     min_tracking_confidence=0.5
# )
# # Utility for drawing the face mesh on images
# mp_drawing = mp.solutions.drawing_utils

# def capture_and_save_landmarks():
#     """
#     Capture images from the webcam, extract facial landmarks using MediaPipe FaceMesh,
#     display the facial landmarks (showing face movements in real-time), save the image every 3 seconds,
#     and append the 468 landmarks along with a timestamp into a CSV file.
#     """
#     cap = cv2.VideoCapture(0)  # Open default webcam
#     start_time = time.time()   # Initialize timer for 3-second intervals
#     frame_count = 0            # Counter for saved frames
    
#     # If the CSV file does not exist, create it with headers.
#     if not os.path.isfile(CSV_FILE):
#         # The header includes a timestamp and 468 landmarks with x, y, z coordinates.
#         header = ["timestamp"] + [f"lm_{i}_{axis}" for i in range(468) for axis in ['x', 'y', 'z']]
#         df = pd.DataFrame(columns=header)
#         df.to_csv(CSV_FILE, index=False)
    
#     while True:
#         ret, frame = cap.read()  # Read a frame from the webcam
#         if not ret:
#             print("Failed to grab frame.")
#             break
        
#         # Flip the frame horizontally to mimic a mirror view
#         frame = cv2.flip(frame, 1)
#         # Convert the BGR image (from OpenCV) to RGB for MediaPipe processing
#         frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
#         # Process the frame to find face landmarks
#         results = face_mesh.process(frame_rgb)
        
#         # If face landmarks are detected
#         if results.multi_face_landmarks:
#             for face_landmarks in results.multi_face_landmarks:
#                 # Draw the face mesh on the frame for visualization
#                 mp_drawing.draw_landmarks(
#                     image=frame,
#                     landmark_list=face_landmarks,
#                     connections=mp_face_mesh.FACEMESH_TESSELATION,
#                     landmark_drawing_spec=None,
#                     connection_drawing_spec=mp_drawing.DrawingSpec(color=(0,255,0), thickness=1, circle_radius=1)
#                 )
                
#                 # Extract the 468 landmarks; each landmark has x, y, z values
#                 landmarks = []
#                 for lm in face_landmarks.landmark:
#                     landmarks.extend([lm.x, lm.y, lm.z])
                
#                 current_time = time.time()
#                 # Check if 3 seconds have elapsed to capture an image and log landmarks
#                 if current_time - start_time >= 3:
#                     start_time = current_time  # Reset the timer
#                     frame_count += 1
#                     # Save the current frame as an image in the IMAGES_DIR folder
#                     image_path = os.path.join(IMAGES_DIR, f"image_{frame_count}.png")
#                     cv2.imwrite(image_path, frame)
                    
#                     # Prepare a row with the current timestamp and the 468 landmark values
#                     row = [time.strftime("%Y-%m-%d %H:%M:%S")] + landmarks
#                     df_row = pd.DataFrame([row])
#                     # Append the row to the CSV file (without writing the header again)
#                     df_row.to_csv(CSV_FILE, mode='a', header=False, index=False)
                    
#                     print(f"Saved image and landmarks for frame {frame_count}")
                    
#                     # OPTIONAL: If an SVM model has been trained and saved,
#                     # load the model and predict the emotion using the landmarks.
#                     if os.path.exists(SVM_MODEL_FILE):
#                         svm_model = joblib.load(SVM_MODEL_FILE)
#                         # Reshape landmarks into a 2D array for prediction
#                         landmarks_np = np.array(landmarks).reshape(1, -1)
#                         emotion = svm_model.predict(landmarks_np)[0]
#                         # Display the predicted emotion on the frame
#                         cv2.putText(frame, f"Emotion: {emotion}", (30, 30),
#                                     cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
#                 # Process only the first detected face
#                 break
        
#         # Show the frame with the face mesh (and predicted emotion if available)
#         cv2.imshow("FaceMesh SVM Emotion Recognition", frame)
        
#         # Exit the loop when 'q' is pressed
#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break
    
#     # Release the webcam and close all OpenCV windows
#     cap.release()
#     cv2.destroyAllWindows()

# def train_svm_model():
#     """
#     Train an SVM classifier on the saved facial landmarks.
#     NOTE: For a real scenario, the CSV must include a 'label' column with emotion labels.
#     Here, if no label exists, dummy labels (e.g., 'neutral') are added for demonstration.
#     """
#     # Load the CSV data containing landmarks
#     df = pd.read_csv(CSV_FILE)
    
#     # Check if a 'label' column exists; if not, add dummy labels for demonstration purposes.
#     if 'label' not in df.columns:
#         df['label'] = 'neutral'  # All data points are marked as 'neutral'
    
#     # Features: All columns except 'timestamp' and 'label'
#     feature_columns = [col for col in df.columns if col not in ['timestamp', 'label']]
#     X = df[feature_columns].values  # Landmark features
#     y = df['label'].values          # Emotion labels
    
#     # Initialize and train an SVM classifier with a linear kernel.
#     svm_model = SVC(kernel='linear', probability=True)
#     svm_model.fit(X, y)
    
#     # Save the trained SVM model to a file for later use.
#     joblib.dump(svm_model, SVM_MODEL_FILE)
#     print("SVM model trained and saved.")

# if __name__ == "__main__":
#     # Use argparse to allow running in either 'capture' mode or 'train' mode.
#     parser = argparse.ArgumentParser(description="FaceMesh SVM Emotion Recognition")
#     parser.add_argument('--mode', type=str, default='capture', choices=['capture', 'train'],
#                         help="Mode: 'capture' to capture images and landmarks, 'train' to train the SVM model.")
#     args = parser.parse_args()
    
#     if args.mode == 'capture':
#         capture_and_save_landmarks()
#     elif args.mode == 'train':
#         train_svm_model()


import cv2
import mediapipe as mp
import numpy as np
import pandas as pd
import time
import os
import argparse
from sklearn.svm import SVC
import joblib

# Directories and file names for saving images and landmarks.
IMAGES_DIR = "captured_images"  # Folder to store captured images
CSV_FILE = "landmarks.csv"       # CSV file to save landmark data
SVM_MODEL_FILE = "svm_model.pkl" # File to load (or save) the trained SVM model

# Create the images directory if it does not exist.
if not os.path.exists(IMAGES_DIR):
    os.makedirs(IMAGES_DIR)

# Initialize MediaPipe FaceMesh solution.
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,  # For video stream, set to False
    max_num_faces=1,          # Process only one face
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)
# Utility for drawing the face mesh.
mp_drawing = mp.solutions.drawing_utils

def compute_head_movement(landmarks):
    """
    Compute head movement based on key landmarks.
    Uses:
      - Left eye: landmark index 33
      - Right eye: landmark index 263
      - Nose tip: landmark index 1
    Returns a string indicating movement: "Left", "Right", "Up", "Down", or "Center".
    """
    try:
        left_eye_x = landmarks[33 * 3]
        left_eye_y = landmarks[33 * 3 + 1]
        right_eye_x = landmarks[263 * 3]
        right_eye_y = landmarks[263 * 3 + 1]
        nose_x = landmarks[1 * 3]
        nose_y = landmarks[1 * 3 + 1]
    except IndexError:
        return "Unknown"
    
    mid_eye_x = (left_eye_x + right_eye_x) / 2
    mid_eye_y = (left_eye_y + right_eye_y) / 2
    
    # Thresholds for head movement (adjust as needed)
    threshold_x = 0.02
    threshold_y = 0.02
    
    movement = "Center"
    if nose_x < mid_eye_x - threshold_x:
        movement = "Left"
    elif nose_x > mid_eye_x + threshold_x:
        movement = "Right"
    
    if nose_y < mid_eye_y - threshold_y:
        movement += " & Up" if movement != "Center" else "Up"
    elif nose_y > mid_eye_y + threshold_y:
        movement += " & Down" if movement != "Center" else "Down"
    
    return movement

def capture_and_save_landmarks():
    """
    Capture webcam frames, extract facial landmarks using MediaPipe FaceMesh,
    and display:
      - Predicted emotion (from a pre-trained SVM model, if available),
      - Confidence scores,
      - Head movement (computed from key landmarks).
    Every 3 seconds, the current frame and landmark data are saved automatically with
    the predicted emotion as the label (or "unknown" if no model exists).
    """
    cap = cv2.VideoCapture(0)
    start_time = time.time()
    frame_count = 0

    # Create CSV file with header if it doesn't exist.
    if not os.path.isfile(CSV_FILE):
        header = ["timestamp"] + [f"lm_{i}_{axis}" for i in range(468) for axis in ['x', 'y', 'z']] + ["label"]
        df = pd.DataFrame(columns=header)
        df.to_csv(CSV_FILE, index=False)

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame.")
            break

        # Flip for mirror view and convert BGR to RGB.
        frame = cv2.flip(frame, 1)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Process the frame with FaceMesh.
        results = face_mesh.process(frame_rgb)
        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                # Draw landmarks.
                mp_drawing.draw_landmarks(
                    image=frame,
                    landmark_list=face_landmarks,
                    connections=mp_face_mesh.FACEMESH_TESSELATION,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=1, circle_radius=1)
                )

                # Extract 468 landmarks.
                landmarks = []
                for lm in face_landmarks.landmark:
                    landmarks.extend([lm.x, lm.y, lm.z])

                # Compute head movement.
                head_movement = compute_head_movement(landmarks)
                cv2.putText(frame, f"Head: {head_movement}", (30, 90),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

                # Use pre-trained SVM model (if available) for emotion prediction.
                if os.path.exists(SVM_MODEL_FILE):
                    svm_model = joblib.load(SVM_MODEL_FILE)
                    landmarks_np = np.array(landmarks).reshape(1, -1)
                    emotion = svm_model.predict(landmarks_np)[0]
                    probabilities = svm_model.predict_proba(landmarks_np)[0]
                    classes = svm_model.classes_
                    score_str = ", ".join([f"{cls}: {prob:.2f}" for cls, prob in zip(classes, probabilities)])
                    cv2.putText(frame, f"Emotion: {emotion}", (30, 30),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                    cv2.putText(frame, score_str, (30, 60),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                    label = emotion  # Automatically use predicted emotion as label.
                else:
                    label = "unknown"  # No model available; default label.

                # Save image and data every 3 seconds (automatically, without user input).
                current_time = time.time()
                if current_time - start_time >= 3:
                    start_time = current_time
                    frame_count += 1
                    image_path = os.path.join(IMAGES_DIR, f"image_{frame_count}.png")
                    cv2.imwrite(image_path, frame)
                    row = [time.strftime("%Y-%m-%d %H:%M:%S")] + landmarks + [label]
                    df_row = pd.DataFrame([row])
                    df_row.to_csv(CSV_FILE, mode='a', header=False, index=False)
                    print(f"Saved image and landmarks for frame {frame_count} with label: {label}")
                break  # Process only the first detected face

        cv2.imshow("FaceMesh SVM Emotion Recognition", frame)
        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

def train_svm_model():
    """
    Train an SVM classifier on the saved facial landmarks.
    For meaningful training, the CSV must include a 'label' column with at least two distinct emotion labels.
    (This mode assumes you have a labeled dataset or have collected data with pre-assigned labels.)
    """
    df = pd.read_csv(CSV_FILE)
    if 'label' not in df.columns or len(np.unique(df['label'])) < 2:
        print("Error: The number of classes has to be greater than one. Please use a labeled dataset with at least two emotions.")
        return

    feature_columns = [col for col in df.columns if col not in ['timestamp', 'label']]
    X = df[feature_columns].values
    y = df['label'].values

    svm_model = SVC(kernel='linear', probability=True)
    svm_model.fit(X, y)
    joblib.dump(svm_model, SVM_MODEL_FILE)
    print("SVM model trained and saved.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FaceMesh SVM Emotion Recognition")
    parser.add_argument('--mode', type=str, default='capture', choices=['capture', 'train'],
                        help="Mode: 'capture' to capture images/landmarks (automatic labeling), 'train' to train the SVM model with a labeled dataset.")
    args = parser.parse_args()

    if args.mode == 'capture':
        capture_and_save_landmarks()
    elif args.mode == 'train':
        train_svm_model()
