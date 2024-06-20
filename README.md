# MOSAICNOW 실행
로컬에서 해당 코드를 돌려보기 위해서는 아래와 같은 설정이 필요하다.

## 1. 데이터베이스 생성 및 연결

이 프로젝트에서는 두 가지 테이블을 사용한다.

사용자의 정보를 저장하는 users 테이블, 그리고 사용자가 등록한 얼굴들을 저장하는 embeddings 테이블을 사용한다.

직접 실행하기 위해서 아래 두 테이블을 생성한 뒤, 코드에 연결한다.

1. users 테이블

```sql
CREATE TABLE users (
    user_num INT NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL,
    user_pw VARCHAR(255) NOT NULL,
    streamkey VARCHAR(255),
    PRIMARY KEY (user_num)
);
```
![Users 테이블](https://github.com/EwhaEmoji27/MosaicNow/assets/113421649/3675f168-6004-4da9-8200-2d6cff297d90)

2. embeddings 테이블

```sql
CREATE TABLE embeddings (
embedding_id INT AUTO_INCREMENT PRIMARY KEY,
user_num INT NOT NULL,
embedding_name VARCHAR(255) NOT NULL,
embedding BLOB NOT NULL,
CONSTRAINT fk_user
FOREIGN KEY (user_num)
REFERENCES users(user_num)
ON DELETE CASCADE
); 
```

![Embeddings 테이블](https://github.com/EwhaEmoji27/MosaicNow/assets/113421649/530f3ec5-4eea-44a9-8a8a-2cdaaef7dbd7)


이제 아래 두 스크립트에서 각 데이터베이스에 접근이 가능하도록 연결한다.

1️⃣ .../MosaicNow_Web/Web_back/WebServer.js

2️⃣ .../MosaicNow_AI_Server/AIServer.py

## 2. 웹 설정

### 1. 모듈 설치

```jsx
cd .../MosaicNow_Web

npm install
```

## 3. AI 서버 설정

### 1. FFmpeg 설치

https://ffmpeg.org/

ffmpeg 설치 후 AI_Server.py의 FFmpeg 경로를 본인의 FFmpeg 파일 경로로 변경한다.

![ffmpeg](https://github.com/EwhaEmoji27/MosaicNow/assets/113421649/5172e546-3119-4a97-a04a-9f1efeefa108)


### 2. 모듈 설치

```jsx

cd .../MosaicNow_AI_Server

pip install -r requirements.txt
```

### 3. YOLOv5 설치

```jsx

cd .../MosaicNow_AI_Server

git clone https://github.com/ultralytics/yolov5.git
```

## 5. 실행

### 웹 프론트엔드 실행

```jsx
cd .../MosaicNow_Web

npm start
```

### 웹 서버 실행

```jsx
cd .../MosaicNow_Web/Web_back

node server.js
```

### AI 서버 실행

```jsx
cd .../MosaicNow_AI_Server

python AIServer.py
```
