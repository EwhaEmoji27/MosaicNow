import cv2

# 미리 훈련된 Haar Cascade 얼굴 감지기 로드
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# 웹캠 열기
cap = cv2.VideoCapture(0)

# 현재 시간 저장
start_time = cv2.getTickCount()

# 창 생성
cv2.namedWindow("Face Detection", cv2.WINDOW_NORMAL)  # 전체 화면을 위해 cv2.WINDOW_NORMAL로 설정

# 전체 화면으로 변경
cv2.setWindowProperty("Face Detection", cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

while True:
    # 프레임 읽기
    ret, frame = cap.read()

    # 좌우 반전 적용
    frame = cv2.flip(frame, 1)

    # 그레이스케일로 변환
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # 얼굴 감지 수행
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

    # 감지된 얼굴에 사각형 그리기
    for (x, y, w, h) in faces:
        # 얼굴 영역 추출
        face_roi = frame[y:y+h, x:x+w]

        # 모자이크 적용
        face_roi = cv2.GaussianBlur(face_roi, (99, 99), 30)

        # 모자이크를 원래 위치에 적용
        frame[y:y+h, x:x+w] = face_roi

    # 화면에 표시
    cv2.imshow("Face Detection", frame)

    # 'q' 키를 누르면 루프 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    # 30초 경과 시 프로그램 종료
    elapsed_time = (cv2.getTickCount() - start_time) / cv2.getTickFrequency()
    if elapsed_time > 30:
        break

# 사용한 자원 해제
cap.release()
cv2.destroyAllWindows()
