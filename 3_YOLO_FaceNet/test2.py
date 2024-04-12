import cv2
from facenet_pytorch import MTCNN, InceptionResnetV1
import torch
import numpy as np
import os
import subprocess

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

# 모자이크 처리 함수
def apply_mosaic(frame, bbox, factor=0.1):
    (x1, y1, x2, y2) = [int(v) for v in bbox]  # 바운딩 박스 좌표
    face = frame[y1:y2, x1:x2]  # 얼굴 영역 추출
    face = cv2.resize(face, (0,0), fx=factor, fy=factor)  # 축소
    face = cv2.resize(face, (x2-x1, y2-y1), interpolation=cv2.INTER_NEAREST)  # 확대
    frame[y1:y2, x1:x2] = face  # 모자이크 처리된 얼굴 영역을 원본 이미지에 복사
    return frame

embeddings, labels = load_embeddings()
embeddings = np.squeeze(embeddings, axis=1)  # (2, 1, 512) -> (2, 512)

# 확인: embeddings와 labels의 길이 출력
print(f"Loaded embeddings: {len(embeddings)}, labels: {len(labels)}")

# 얼굴 인식과 유사성 판단
cap = cv2.VideoCapture(0)


# 스트리밍 세팅
FFmpeg = r'C:\Users\yhj01\ffmpeg\bin\ffmpeg.exe'
Stream_Key = 'cs16-fkcd-ur25-rjem-66e4'
YOUTUBE_URL = 'rtmp://a.rtmp.youtube.com/live2/'
streaming = False  # 스트리밍 상태 플래그
command = [
            FFmpeg,
            '-f', 'image2pipe',
            '-vcodec', 'mjpeg',
            '-s', '640x480',
            '-i', '-',
            '-f', 'lavfi',
            '-i', 'anullsrc=r=44100:cl=stereo',  # Dummy audio generation
            '-acodec', 'aac',
            '-ar', '44100',
            '-ac', '2',
            '-strict', 'experimental',
            '-vcodec', 'libx264',
            '-g', '60',
            '-vb', '1500k',
            '-profile:v', 'baseline',
            '-preset', 'ultrafast',
            '-r', '30',
            '-f', 'flv',
            f"{YOUTUBE_URL}/{Stream_Key}"  
        ]

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # MTCNN으로 얼굴 감지
    boxes, _ = mtcnn.detect(frame)
    if boxes is not None:
        for box in boxes:
            x1, y1, x2, y2 = [int(v) for v in box]
        # 얼굴 영역이 유효한지 확인
        if (x2 - x1) > 0 and (y2 - y1) > 0:
            face = frame[y1:y2, x1:x2]
            # 유효한 얼굴 영역에 대해서만 처리 수행
            if face.size > 0:
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
                        frame = apply_mosaic(frame, box)  # 모자이크 처리 추가

                    cv2.rectangle(frame, (int(box[0]), int(box[1])), (int(box[2]), int(box[3])), (0, 255, 0), 2)
                    cv2.putText(frame, name, (int(box[0]), int(box[1]-10)), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,0), 2)

    # 's' 키를 누르면 스트리밍 시작
    if cv2.waitKey(1) & 0xFF == ord('s') and not streaming:
        pipe = subprocess.Popen(command, stdin=subprocess.PIPE)
        streaming = True

    # 스트리밍 중이면 프레임을 파이프로 전송
    if streaming:
        # Encode the frame as JPEG
        _, jpg_data = cv2.imencode('.jpg', frame)
        
        # Write the JPEG data to the pipe
        pipe.stdin.write(jpg_data.tobytes())
        pipe.stdin.write(jpg_data.tobytes())
        pipe.stdin.write(jpg_data.tobytes())

    cv2.imshow('Frame', frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

pipe.stdin.close()
pipe.wait()

cap.release()
cv2.destroyAllWindows()