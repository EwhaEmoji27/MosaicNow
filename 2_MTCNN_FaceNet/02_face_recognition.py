import cv2
from facenet_pytorch import MTCNN, InceptionResnetV1
import torch
import numpy as np
import os

# MTCNN과 InceptionResnetV1 모델 초기화
mtcnn = MTCNN(keep_all=True)
resnet = InceptionResnetV1(pretrained='vggface2').eval()

# 데이터셋 저장 경로
script_directory = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(script_directory, 'dataset')

# 저장된 임베딩 로드
def load_embeddings():
    embeddings = []
    labels = []
    for file in os.listdir(dataset_path):
        embedding = np.load(os.path.join(dataset_path, file))
        label = int(file.split('_')[-1].split('.')[0])  
        embeddings.append(embedding)
        labels.append(label)
    return np.array(embeddings), np.array(labels)

embeddings, labels = load_embeddings()
embeddings = np.squeeze(embeddings, axis=1)  # (2, 1, 512) -> (2, 512)

# 확인: embeddings와 labels의 길이 출력
print(f"Loaded embeddings: {len(embeddings)}, labels: {len(labels)}")

# 얼굴 인식과 유사성 판단
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # MTCNN으로 얼굴 감지
    boxes, _ = mtcnn.detect(frame)
    if boxes is not None:
        for box in boxes:
            face = frame[int(box[1]):int(box[3]), int(box[0]):int(box[2])]
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

            cv2.rectangle(frame, (int(box[0]), int(box[1])), (int(box[2]), int(box[3])), (0, 255, 0), 2)
            cv2.putText(frame, name, (int(box[0]), int(box[1]-10)), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,0), 2)

    cv2.imshow('Frame', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()