import cv2
from facenet_pytorch import InceptionResnetV1
import torch
import numpy as np
import os

# 모델 로드
script_dir = os.path.dirname(os.path.abspath(__file__))
yolov5_path = os.path.join(script_dir, 'yolov5')
model_path = os.path.join(script_dir, 'face_detection_yolov5s.pt')
model = torch.hub.load(yolov5_path, 'custom', path=os.path.join(script_dir, model_path), source='local')

# 디렉토리 생성 함수
def create_directory(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

# InceptionResnetV1 얼굴 임베딩 모델 초기화
resnet = InceptionResnetV1(pretrained='vggface2').eval()

# 데이터셋 저장 경로
dataset_path = os.path.join(script_dir, 'dataset')
create_directory(dataset_path)

# 사용자 ID 입력
user_id = input("Enter user ID: ")

# 비디오 캡처 시작
cap = cv2.VideoCapture(0)

embeddings = []  # 여러 임베딩을 저장할 리스트
count = 0
while True:
    success, frame = cap.read()
    if not success:
        break

    # YOLOv5를 사용한 얼굴 감지
    results = model(frame)
    for *xyxy, conf, cls in results.xyxy[0]:
        # 얼굴 임베딩 생성
        x1, y1, x2, y2 = map(int, xyxy)
        face = frame[y1:y2, x1:x2]
        face = cv2.resize(face, (160, 160))
        face = torch.tensor(face.transpose((2, 0, 1))).float().div(255)
        face = face.unsqueeze(0)
        embedding = resnet(face)
        embeddings.append(embedding.detach().numpy())  # 리스트에 임베딩 추가
        count += 1

        # 얼굴에 박스 그리기
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

    cv2.imshow('Face Capture', frame)

    # 'q'를 누르면 종료
    if cv2.waitKey(1) & 0xFF == ord('q') or count >= 30:  # 30개의 얼굴 샘플 후 종료
        break

# 모든 임베딩의 평균 계산
if embeddings:
    average_embedding = np.mean(embeddings, axis=0)
    # 평균 임베딩 저장
    np.save(os.path.join(dataset_path, f"user_{user_id}.npy"), average_embedding)

cap.release()
cv2.destroyAllWindows()