from flask import Flask, render_template, Response, request
import mediapipe as mp
import cv2
import os
import subprocess
import numpy as np
from scipy.spatial.distance import euclidean

app = Flask(__name__)

mp_drawing = mp.solutions.drawing_utils
mphands = mp.solutions.hands
output_dir = 'Captured_Gestures'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

generate_frames_flag = True
gestures_tasks = {}
cap = cv2.VideoCapture(0)
hands = mphands.Hands()
gesture_count = 0
saved_gestures = {}

available_tasks = [
    'close window', 'switch window', 'minimise', 'maximise', 'Screenshot',
    'Lock', 'open chrome', 'close chrome'
]

def perform_task(task, recognized_gesture):
    if task == 'close window':
        pyautogui.hotkey('alt', 'f4')
        print("Window closed using gesture:", recognized_gesture)
    elif task == 'switch window':
        pyautogui.hotkey('alt', 'tab')
        print("Window switched using gesture:", recognized_gesture)
    elif task == 'minimise':
        pyautogui.hotkey('win', 'd')
        print("Window minimised using gesture:", recognized_gesture)
    elif task == 'maximise':
        pyautogui.hotkey('win', 'up')
        print("Window maximised using gesture:", recognized_gesture)
    elif task == 'Screenshot':
        pyautogui.hotkey('win', 'prtsc')
        print("Screenshot of Entire Screen using gesture:", recognized_gesture)
    elif task == 'Lock':
        os.system("rundll32.exe user32.dll,LockWorkStation")
        print("Screen Locked using gesture:", recognized_gesture)
    elif task == 'open chrome':
        subprocess.Popen(["C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"])
        print("Google Chrome opened using gesture:", recognized_gesture)
    elif task == 'close chrome':
        os.system("taskkill /f /im chrome.exe /t")
        print("Google Chrome closed using gesture:", recognized_gesture)

def generate_frames():
    global gesture_count, generate_frames_flag
    while generate_frames_flag:
        if cap.isOpened():
            data, image = cap.read()
            image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
            results = hands.process(image)
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    mp_drawing.draw_landmarks(image, hand_landmarks, mphands.HAND_CONNECTIONS)

                    # Extract hand landmarks
                    landmarks = np.array([(lm.x, lm.y, lm.z) for lm in hand_landmarks.landmark])

                    # Perform gesture recognition
                    min_distance = float('inf')
                    recognized_gesture = None
                    for gesture, saved_landmarks in saved_gestures.items():
                        distance = np.mean([euclidean(saved_landmarks[i], landmarks[i]) for i in range(len(landmarks))])
                        if distance < min_distance and distance < 0.1:  # Adjust the threshold value as needed
                            min_distance = distance
                            recognized_gesture = gesture

                    if recognized_gesture:
                        task = gestures_tasks[recognized_gesture]
                        perform_task(task, recognized_gesture)

            ret, buffer = cv2.imencode('.jpg', image)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        else:
            break

@app.route('/')
def index():
    return render_template('index.html', tasks=available_tasks, assigned_tasks=gestures_tasks)

@app.route('/capture', methods=['POST'])
def capture():
    global gesture_count, cap
    gesture_count += 1
    image_name = os.path.join(output_dir, f'gesture_{gesture_count}.jpg')
    data, image = cap.read()
    image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
    results = hands.process(image)
    cv2.imwrite(image_name, cv2.cvtColor(image, cv2.COLOR_RGB2BGR))
    print(f'Gesture {gesture_count} captured and saved.')

    # Save hand landmarks for the captured gesture
    if results.multi_hand_landmarks:
        hand_landmarks = results.multi_hand_landmarks[0]
        saved_landmarks = [(lm.x, lm.y, lm.z) for lm in hand_landmarks.landmark]
        saved_gestures[f'gesture_{gesture_count}'] = saved_landmarks

    # Reset the camera
    cap.release()
    cap = cv2.VideoCapture(0)

    return 'Gesture captured.'

@app.route('/assign', methods=['POST'])
def assign():
    global available_tasks
    task = request.form['task']
    gestures_tasks[f'gesture_{gesture_count}'] = task
    print(f'Gesture {gesture_count} registered with task: {task}')

    # Remove the assigned task from the available tasks list
    available_tasks.remove(task)

    # Display a message after assigning the task
    message = f"Task '{task}' assigned. Click on reset to assign a new task."
    return message

@app.route('/reset', methods=['POST'])
def reset():
    global cap, gesture_count, saved_gestures, generate_frames_flag
    cap.release()
    cap = cv2.VideoCapture(0)
    gesture_count = 0
    saved_gestures = {}
    generate_frames_flag = False  # Set the flag to False to stop frame generation
    print('Camera reset. Ready to capture new gestures.')

    # Restart the frame generation process
    generate_frames_flag = True

    return 'Camera reset.'

@app.route('/video')
def video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)
