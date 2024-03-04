import cv2
from facenet_pytorch import InceptionResnetV1
import torch
import numpy as np
import os

# YOLOv5 모델 로드
model = torch.hub.load('./yolov5', 'custom', path='./face_detection_yolov5s.pt', source='local')

# InceptionResnetV1 얼굴 임베딩 모델 초기화
resnet = InceptionResnetV1(pretrained='vggface2').eval()

# 저장된 임베딩 로드
def load_embeddings():
    embeddings = []
    labels = []
    for file in os.listdir('./dataset'):
        embedding = np.load(os.path.join('./dataset', file))
        label = int(file.split('_')[-1].split('.')[0])
        embeddings.append(embedding)
        labels.append(label)
    return np.array(embeddings), np.array(labels)

embeddings, labels = load_embeddings()
embeddings = np.squeeze(embeddings, axis=1)  # 차원 조정

# 확인: embeddings와 labels의 길이 출력
print(f"Loaded embeddings: {len(embeddings)}, labels: {len(labels)}")

# 얼굴 인식과 유사성 판단
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # YOLOv5를 사용한 얼굴 감지
    results = model(frame)
    for *xyxy, conf, cls in results.xyxy[0]:
        x1, y1, x2, y2 = map(int, xyxy)
        face = frame[y1:y2, x1:x2]
        face = cv2.resize(face, (160, 160))
        face = torch.tensor(face.transpose((2, 0, 1))).float().div(255)
        face = face.unsqueeze(0)
        current_embedding = resnet(face).detach().numpy()

        # 저장된 임베딩과의 거리(유사도) 계산
        distances = np.linalg.norm(embeddings - current_embedding, axis=1)
        min_distance = np.min(distances)
        min_distance_index = np.argmin(distances)
        label = labels[min_distance_index]

        if min_distance < 0.7:  # 임계값 설정, 실험을 통해 조정 필요
            name = f"User {label}"
        else:
            name = "Unknown"

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, name, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    cv2.imshow('Frame', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()