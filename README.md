# JoyVerse-G330-PS25

**JoyVerse** is an interactive, emotion-aware learning platform designed specifically for children with dyslexia. Through engaging word puzzle games, JoyVerse adapts dynamically to each child’s emotional and performance states — offering personalized support, real-time adjustments, and therapist supervision.

---

## 🎯 Purpose

JoyVerse combines the power of gamification, emotion detection, and adaptive learning to:

- Support dyslexic children in an engaging environment.
- Dynamically adjust game themes and difficulty based on emotional state and performance.
- Allow therapists to monitor progress and emotional trends.

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, MediaPipe FaceMesh  
- **Backend**: Node.js, Express  
- **Database**: MongoDB using Mongoose  
- **Emotion Detection**: FaceMesh + Transformer (PyTorch)  

---

![Made with Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![Built with React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Database-MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-Active-success)

## 🚀 How to Run JoyVerse Locally

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/joyverse.git
cd joyverse


## 🛠️ Backend Setup

```bash
cd backend/src
npm install
npm run dev

## Frontend Setup
cd ../frontend
npm install
npm run dev

## Emotion-Model Setup
cd ../backend/model
pip install -r requirements.txt
python app.py

