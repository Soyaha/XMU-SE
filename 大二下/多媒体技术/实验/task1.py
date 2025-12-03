import cv2

# 加载人脸检测模型
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# 打开摄像头
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("无法打开摄像头")
    exit()

while True:
    # 读取视频流中的一帧
    ret, frame = cap.read()
    if not ret:
        print("无法接收帧（流结束？）")
        break

    # 将帧转换为灰度图像，因为人脸检测在灰度图像上效果更好
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # 检测人脸
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # 在检测到的人脸周围画矩形框
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # 显示带有矩形框的视频流
    cv2.imshow('FaceRect', frame)

    # 按 'q' 键退出循环
    if cv2.waitKey(1) == ord('q'):
        break

# 释放摄像头并关闭窗口
cap.release()
cv2.destroyAllWindows()