from ultralytics import YOLO
import cv2

# Load YOLO model
model = YOLO("yolov8s.pt")

# Load pre-trained face detection model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()

    if ret:
        # Perform face detection
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.3, minNeighbors=5)

        # Apply mosaic to detected faces
        for (x, y, w, h) in faces:
            face_roi = frame[y:y + h, x:x + w]
            face_roi = cv2.resize(face_roi, (10, 10))  # Adjust the size for a stronger mosaic effect
            face_roi = cv2.resize(face_roi, (w, h), interpolation=cv2.INTER_NEAREST)
            frame[y:y + h, x:x + w] = face_roi

        # Perform YOLO object detection
        results = model(frame)
        cv2.imshow("Results", results[0].plot())

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cv2.destroyAllWindows()
cap.release()