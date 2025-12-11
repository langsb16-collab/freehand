# CivicOne - 주민 정책참여 플랫폼

**실명 기반 · 유료제 · 투명한 정책 집행**

주민이 만드는 정책, 지자체가 응답하는 디지털 민주주의 플랫폼입니다.

## 🌐 배포된 서비스 URL

- **샌드박스**: https://3000-iiakl04e81u93cx0bpj7g-5185f4aa.sandbox.novita.ai
- **프로덕션**: (Cloudflare Pages 배포 후 URL 추가 예정)

---

## 📋 프로젝트 개요

### 주요 목표
1. **실명 기반 신뢰성 확보**: 본인인증을 통한 책임 있는 정책 제안
2. **유료제로 품질 보장**: 무분별한 제안 방지 및 진지한 참여 유도
3. **투명한 정책 집행**: 제안부터 실행까지 전 과정 공개
4. **데이터 기반 의사결정**: 투표 및 통계를 통한 과학적 정책 수립

### 핵심 가치
- ✅ **실명 인증**: 휴대폰 본인인증 + 주민등록번호 확인
- 💰 **유료 시스템**: 제안 등록(5,000원), 유료 투표(1,000원)
- 🗳️ **민주적 투표**: 찬반 투표로 정책 우선순위 결정
- 📊 **투명한 진행**: 정책 실행 과정 실시간 공개
- 🤖 **AI 정책 분석**: 제안의 실현 가능성 자동 평가

---

## 🎯 주요 기능

### ✅ 현재 구현된 기능

#### 1. 정책 제안 시스템
- 주민이 정책 아이디어 등록 (유료: 5,000원)
- 제안 내용: 문제 정의, 현재 상황, 해결 방안, 예상 예산, 기대 효과
- 관리자 검토 → 승인/반려 프로세스
- 카테고리별 분류 (교통, 안전, 문화, 복지, 환경)

#### 2. 투표 시스템
- 찬성/반대 투표 (무료 투표 + 유료 투표 옵션)
- 유료 투표는 정책 우선순위에 가중치 적용
- 실시간 투표율 표시 및 그래프 시각화
- 중복 투표 방지 (1인 1표)

#### 3. 토론 커뮤니티
- 실명 댓글 시스템
- 유료 댓글(1,000원)은 상단 노출 우선
- AI 필터로 비방/욕설 자동 차단
- 대댓글 기능

#### 4. 정책 진행 상황 추적
- 채택된 정책의 실행 단계 표시
- 예산 사용 내역 공개
- 진행률(%) 및 KPI 달성률 표시

#### 5. 통계 대시보드
- 전체 제안 수, 투표 수, 참여 주민 수
- 카테고리별/상태별 제안 분포
- 연령/지역별 투표 분석 (향후 확장)

#### 6. 알림 시스템
- 제안 승인/반려 알림
- 댓글 달림 알림
- 정책 채택 알림

### 🔄 현재 기능 URI 및 파라미터

#### API 엔드포인트

**사용자 관리**
```
GET /api/users                    # 사용자 목록 조회
GET /api/users/:id                # 사용자 정보 조회
```

**정책 제안**
```
GET /api/proposals                # 제안 목록 조회
    ?status=voting|pending|approved|adopted|completed
    ?category=transport|safety|culture|welfare|environment
    ?page=1

GET /api/proposals/:id            # 제안 상세 조회
POST /api/proposals               # 제안 등록 (유료)
    Body: { user_id, title, problem_definition, current_situation, 
            solution, estimated_budget, expected_effect, category }

PATCH /api/proposals/:id/status   # 제안 승인/반려 (관리자)
    Body: { admin_user_id, status, admin_feedback }
```

**투표**
```
POST /api/votes                   # 투표하기
    Body: { proposal_id, user_id, vote_type: "yes"|"no", 
            is_paid: 0|1, payment_amount, reason }

GET /api/proposals/:id/votes      # 투표 결과 조회
```

**댓글/토론**
```
POST /api/comments                # 댓글 등록
    Body: { proposal_id, user_id, content, is_paid: 0|1, 
            parent_id (대댓글용) }

GET /api/comments/:id/replies     # 대댓글 조회
```

**정책 진행 상황**
```
GET /api/proposals/:id/progress   # 진행 상황 조회
POST /api/proposals/:id/progress  # 진행 상황 업데이트 (관리자)
    Body: { stage, budget_used, progress_percentage, 
            kpi_achievement, description }
```

**통계**
```
GET /api/statistics               # 전체 통계 조회
```

**알림**
```
GET /api/notifications/:user_id   # 사용자 알림 조회
PATCH /api/notifications/:id/read # 알림 읽음 처리
```

---

## 🚧 향후 구현 예정 기능

1. **본인인증 시스템**
   - PASS 인증, NICE 평가정보 연동
   - 실명 확인 및 주민등록번호 해시 저장
   - 외국인 주민 인증 (외국인등록번호)

2. **실제 결제 연동**
   - 토스페이먼츠, 이니시스 등 PG사 연동
   - 카드 결제, 계좌이체 지원
   - 결제 내역 관리 및 환불 처리

3. **AI 정책 분석**
   - OpenAI GPT-4 연동
   - 제안의 실현 가능성, 예산 타당성 자동 평가
   - 법률 위반 가능성 검토
   - 타 지자체 사례 자동 추천

4. **관리자 대시보드**
   - 제안 검토/승인 관리
   - 허위정보 필터링
   - 주민 참여 통계 분석

5. **고급 통계 분석**
   - 연령/지역별 투표 분석
   - 정책 카테고리별 참여도
   - 시간대별 활동 패턴

---

## 🗄️ 데이터베이스 구조

### 주요 테이블
- **users**: 사용자 정보 (실명, 닉네임, 신뢰지수)
- **proposals**: 정책 제안
- **votes**: 투표 내역
- **comments**: 댓글/토론
- **policy_progress**: 정책 진행 상황
- **payments**: 결제 내역
- **notifications**: 알림

### 데이터 흐름
```
제안 등록 → 관리자 검토 → 승인 → 투표 시작 → 채택 → 실행 → 완료
```

---

## 🛠️ 기술 스택

### Backend
- **Hono**: 초경량 웹 프레임워크
- **Cloudflare Workers**: 엣지 컴퓨팅 플랫폼
- **Cloudflare D1**: SQLite 기반 분산 데이터베이스

### Frontend
- **Vanilla JavaScript**: 프레임워크 없이 순수 JS
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **Axios**: HTTP 클라이언트
- **FontAwesome**: 아이콘 라이브러리

### DevOps
- **Wrangler**: Cloudflare CLI 도구
- **PM2**: Node.js 프로세스 매니저 (로컬 개발용)
- **Git**: 버전 관리

---

## 🚀 개발 환경 설정

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd webapp
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 로컬 데이터베이스 설정
```bash
# 마이그레이션 실행
npm run db:migrate:local

# 테스트 데이터 삽입
npm run db:seed
```

### 4. 로컬 개발 서버 실행
```bash
# 빌드
npm run build

# PM2로 서버 시작
pm2 start ecosystem.config.cjs

# 서버 테스트
curl http://localhost:3000
```

### 5. 포트 정리 (필요 시)
```bash
npm run clean-port
```

### 6. 데이터베이스 초기화 (필요 시)
```bash
npm run db:reset
```

---

## 📦 배포 가이드

### Cloudflare Pages 배포

#### 1. Cloudflare D1 데이터베이스 생성
```bash
npx wrangler d1 create webapp-production
```

생성된 `database_id`를 `wrangler.jsonc`에 입력합니다.

#### 2. 프로덕션 마이그레이션
```bash
npm run db:migrate:prod
```

#### 3. Cloudflare Pages 프로젝트 생성
```bash
npx wrangler pages project create webapp \
  --production-branch main \
  --compatibility-date 2024-01-01
```

#### 4. 배포
```bash
npm run deploy:prod
```

#### 5. 환경 변수 설정 (본인인증/결제 연동 시)
```bash
npx wrangler pages secret put PASS_API_KEY --project-name webapp
npx wrangler pages secret put TOSS_SECRET_KEY --project-name webapp
npx wrangler pages secret put OPENAI_API_KEY --project-name webapp
```

---

## 📚 추가 문서

- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)**: 본인인증 및 결제 시스템 연동 가이드
  - PASS 인증, NICE 평가정보 연동
  - 토스페이먼츠, 이니시스 결제 연동
  - OpenAI API를 통한 AI 정책 분석

---

## 👥 사용자 가이드

### 주민 참여 방법

1. **회원가입**: 본인인증 후 실명으로 가입
2. **정책 제안**: 5,000원 결제 후 정책 아이디어 등록
3. **투표 참여**: 무료 또는 유료(1,000원)로 찬반 투표
4. **토론 참여**: 댓글로 건설적인 의견 제시
5. **진행 확인**: 채택된 정책의 실행 과정 모니터링

### 관리자 기능

1. **제안 검토**: 등록된 제안 승인/반려
2. **진행 관리**: 채택된 정책의 진행 상황 업데이트
3. **통계 분석**: 주민 참여도 및 정책 효과 분석

---

## 🔒 보안 및 개인정보 보호

- **주민등록번호**: SHA-256 해시화 후 저장
- **실명**: 외부 노출 없이 닉네임 사용
- **결제 정보**: PG사를 통한 안전한 결제 처리
- **AI 필터**: 부적절한 콘텐츠 자동 차단
- **선거법 준수**: 특정 후보 지지/반대 게시 금지

---

## 📊 테스트 데이터

로컬 환경에는 다음 테스트 데이터가 포함되어 있습니다:

**사용자**
- 김철수 (정책시민) - 일반 사용자
- 이영희 (참여주민) - 일반 사용자
- 박민수 (공론장관리자) - 관리자

**정책 제안**
- 버스 노선 확대 제안 (투표 중)
- 공원 야간 조명 설치 (승인됨)
- 지역 축제 개최 제안 (검토 중)

---

## 🤝 기여 가이드

이 프로젝트는 지자체 실제 도입을 목표로 하는 오픈소스 프로젝트입니다.

### 개선 제안
- GitHub Issues에 기능 제안 또는 버그 리포트
- Pull Request를 통한 코드 기여

### 개발 우선순위
1. 본인인증 시스템 연동
2. 결제 시스템 연동
3. AI 정책 분석 기능
4. 관리자 대시보드 고도화

---

## 📞 문의 및 지원

### 기술 문서
- Hono 프레임워크: https://hono.dev
- Cloudflare Workers: https://developers.cloudflare.com/workers
- Cloudflare D1: https://developers.cloudflare.com/d1

### 프로젝트 정보
- **버전**: 1.0.0
- **라이선스**: MIT
- **최종 업데이트**: 2025-12-11

---

## 📈 로드맵

### 3개월 목표
- [x] 핵심 기능 구현 (제안, 투표, 댓글)
- [x] D1 데이터베이스 설계
- [x] 프론트엔드 UI 완성
- [ ] 본인인증 연동
- [ ] 결제 시스템 연동
- [ ] AI 정책 분석
- [ ] 베타 테스트

### 6개월 목표
- [ ] 파일럿 지자체 도입
- [ ] 모바일 앱 개발
- [ ] 고급 통계 분석
- [ ] 정책 추천 시스템

---

## 🎉 프로젝트 특징

이 플랫폼은 단순한 민원 시스템이 아닙니다:

✨ **디지털 민주주의**: 주민이 직접 정책을 제안하고 결정합니다  
💡 **데이터 기반**: 과학적 분석으로 정책 우선순위를 결정합니다  
🔐 **신뢰 구축**: 실명제와 유료제로 책임 있는 참여를 유도합니다  
📊 **투명성**: 정책 실행의 전 과정을 공개합니다

**주민의 목소리가 실제 정책이 되는 세상을 만듭니다.**

---

Made with ❤️ for better local governance
