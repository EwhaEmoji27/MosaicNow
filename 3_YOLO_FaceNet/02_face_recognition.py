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

# 데이터셋 경로 설정
dataset_path = os.path.join(script_dir, 'dataset')

# 사용자 ID 배열 정의
selected_user_ids = [1, 2]  

def load_selected_embeddings(selected_user_ids):
    embeddings = []
    labels = []
    for user_id in selected_user_ids:
        user_folder = os.path.join(dataset_path, f"user_{user_id}")  # 사용자 ID별 폴더 경로
        if not os.path.exists(user_folder):
            print(f"No data for user ID {user_id}")
            continue  # 해당 사용자 폴더가 없으면 다음 사용자로 넘어감
        for file in os.listdir(user_folder):
            if file.endswith(".npy"):  # npy 파일만 로드
                embedding = np.load(os.path.join(user_folder, file))
                embeddings.append(embedding)
                labels.append(int(user_id))
    return np.array(embeddings), np.array(labels)

def apply_mosaic(frame, top_left, bottom_right, factor=0.1):
    x1, y1 = top_left
    x2, y2 = bottom_right
    region = frame[y1:y2, x1:x2]
    mosaic = cv2.resize(region, (0,0), fx=factor, fy=factor)
    mosaic = cv2.resize(mosaic, (x2-x1, y2-y1), interpolation=cv2.INTER_NEAREST)
    frame[y1:y2, x1:x2] = mosaic
    return frame



# 입력받은 사용자 ID에 해당하는 임베딩 로드
embeddings, labels = load_selected_embeddings(selected_user_ids)
embeddings = np.squeeze(embeddings, axis=1) 

if len(embeddings) == 0:  # 로드할 임베딩이 없는 경우
    print("No embeddings found for the selected user IDs.")
    exit()  # 프로그램 종료

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

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, name, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    cv2.imshow('Frame', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()