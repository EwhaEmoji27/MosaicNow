import cv2
from facenet_pytorch import InceptionResnetV1
import torch
import numpy as np
import os

# YOLOv5와 InceptionResnetV1 모델 로딩 및 초기화
script_dir = os.path.dirname(os.path.abspath('__file__'))  # 현재 스크립트 경로
yolov5_path = os.path.join(script_dir, 'yolov5')  # YOLOv5 경로
model_path = os.path.join(script_dir, 'face_detection_yolov5s.pt')  # 모델 파일 경로
model = torch.hub.load(yolov5_path, 'custom', path=model_path, source='local')

resnet = InceptionResnetV1(pretrained='vggface2').eval()


def load_embeddings():
    embeddings = []
    labels = []
    for file in os.listdir(dataset_path):
        embedding = np.load(os.path.join(dataset_path, file))
        label = int(file.split('_')[-1].split('.')[0])
        embeddings.append(embedding)
        labels.append(label)
    return np.array(embeddings), np.array(labels)


def apply_mosaic(frame, top_left, bottom_right, factor=0.1):
    x1, y1 = top_left
    x2, y2 = bottom_right
    region = frame[y1:y2, x1:x2]
    mosaic = cv2.resize(region, (0,0), fx=factor, fy=factor)
    mosaic = cv2.resize(mosaic, (x2-x1, y2-y1), interpolation=cv2.INTER_NEAREST)
    frame[y1:y2, x1:x2] = mosaic
    return frame


# 데이터셋 및 임베딩 로드
dataset_path = os.path.join(script_dir, 'dataset')
embeddings, labels = load_embeddings()
embeddings = np.squeeze(embeddings, axis=1)

# 얼굴 인식과 유사성 판단을 위한 메인 루프
cap = cv2.VideoCapture(0)  # 카메라 디바이스 열기

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame)
    for *xyxy, conf, cls in results.xyxy[0]:
        x1, y1, x2, y2 = map(int, xyxy)
        face = frame[y1:y2, x1:x2]
        face = cv2.resize(face, (160, 160))
        face = torch.tensor(face.transpose((2, 0, 1))).float().div(255)
        face = face.unsqueeze(0)
        current_embedding = resnet(face).detach().numpy()

        distances = np.linalg.norm(embeddings - current_embedding, axis=1)
        min_distance = np.min(distances)
        min_distance_index = np.argmin(distances)
        label = labels[min_distance_index]

        if min_distance < 0.7:
            name = f"User {label}"
        else:
            name = "Unknown"
            frame = apply_mosaic(frame, (x1, y1), (x2, y2))

        #cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        #cv2.putText(frame, name, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    cv2.imshow('Frame', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()