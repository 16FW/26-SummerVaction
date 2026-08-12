# ===== 1단계: deps — 의존성 설치 전용 =====
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ===== 2단계: builder — 앱 빌드 전용 =====
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_ 변수는 '빌드 시점'에 코드에 박힌다 (아래 핵심 설명)
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# ===== 3단계: runner — 실제 실행용, 최소 구성 =====
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# 보안: 비-root 사용자 생성
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs
# standalone 결과물 + 정적 파일 + public 만 골라서 복사
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]