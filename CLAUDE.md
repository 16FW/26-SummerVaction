# 프로젝트: 고가용성 웹 서비스 아키텍처 & CI/CD 포트폴리오

## 목적
대규모 트래픽 확장과 무중단 배포가 가능한 클라우드 인프라를 직접 구축하는
개인 포트폴리오. 앱 개발보다 **네트워크 설계 / 컨테이너화 / 배포 자동화**가 핵심.

## 기술 스택
- 백엔드: FastAPI + SQLAlchemy 2.0 + PyMySQL (MySQL 8)
- 프론트엔드: Next.js (App Router) + TypeScript
- DB: MySQL 8 (로컬은 Docker, 운영은 AWS RDS)
- 인프라: Docker, GitHub Actions, AWS (VPC/EC2/RDS/ALB/S3/ECR)

## 역할 분담 (반드시 지킬 것)
- **클로드 코드가 하는 일:** `backend/`, `frontend/`의 애플리케이션 코드만 작성.
- **사람이 직접 하는 일 (절대 대신 만들지 말 것):**
  AWS 콘솔 작업, VPC/서브넷/보안그룹, EC2/RDS 프로비저닝,
  **Dockerfile 작성, docker-compose 운영 설정, CI/CD(.github/workflows)**.
  이 부분들은 학습 목적이라 사람이 손으로 한다. 요청받지 않으면 만들지 말 것.
  (단, 로컬 개발용 MySQL을 띄우는 docker-compose.yml은 예외로 허용)

## 코딩 규칙
- 설정·비밀정보는 코드에 하드코딩 금지. pydantic-settings로 .env에서 로드.
  DB 접속정보는 개별 환경변수로 분리(로컬↔RDS 무수정 전환 목표).
- `.env`는 git 제외, `.env.example`은 견본으로 커밋.
- 주석은 한국어로, "왜 이렇게 했는지" 핵심만 간결하게.
- 큰 작업은 코드 작성 전에 계획을 먼저 보여주고 승인받을 것.

## 폴더 구조
cloud-portfolio/
├── backend/   (FastAPI)
├── frontend/  (Next.js)
├── infra/     (사람이 작성하는 배포 스크립트·문서)
└── .github/workflows/  (사람이 작성하는 CI/CD)