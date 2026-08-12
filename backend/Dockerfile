# 1) 베이스 이미지: 파이썬 3.12의 경량(slim) 버전에서 출발
FROM python:3.12-slim

# 2) 파이썬 실행 환경 최적화
#    - PYTHONDONTWRITEBYTECODE: .pyc 캐시 파일 생성 안 함 (이미지 깔끔하게)
#    - PYTHONUNBUFFERED: 로그를 버퍼링 없이 즉시 출력 (컨테이너 로그 확인용)
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# 3) 컨테이너 안에서 작업할 디렉터리
WORKDIR /app

# 4) 의존성 목록만 '먼저' 복사해서 설치 (핵심 최적화 — 아래 설명 참고)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5) 앱 소스 코드 복사
COPY ./app ./app

# 6) 보안: root가 아닌 일반 사용자를 만들어 그 권한으로 실행
RUN useradd --create-home appuser
USER appuser

# 7) 이 컨테이너가 8000 포트를 사용한다는 '문서화' (실제 개방은 compose에서)
EXPOSE 8000

# 8) 컨테이너가 시작될 때 실행할 명령
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]