# 본인인증 및 결제 시스템 연동 가이드

## 개요
이 문서는 CivicOne 플랫폼에 실제 본인인증 및 결제 시스템을 연동하는 방법을 설명합니다.

---

## 1. 본인인증 시스템 연동

### 1.1 추천 서비스
- **PASS 인증**: SKT, KT, LG U+ 통합 본인인증
- **NICE 평가정보**: 주민등록번호 기반 실명 확인
- **토스 인증**: 간편한 휴대폰 본인인증

### 1.2 PASS 인증 연동 예시

```javascript
// src/routes/auth.ts
import { Hono } from 'hono'

const auth = new Hono()

// 본인인증 요청
auth.post('/verify/request', async (c) => {
  const { phone } = await c.req.json()
  
  // PASS API 호출
  const response = await fetch('https://api.pass.example.com/v1/verify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${c.env.PASS_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      phone_number: phone,
      return_url: 'https://your-domain.com/auth/callback'
    })
  })
  
  const data = await response.json()
  
  return c.json({
    verify_url: data.verify_url,
    session_id: data.session_id
  })
})

// 본인인증 콜백
auth.get('/verify/callback', async (c) => {
  const { session_id, result } = c.req.query()
  
  if (result === 'success') {
    // 인증 정보 조회
    const response = await fetch(`https://api.pass.example.com/v1/verify/${session_id}`, {
      headers: {
        'Authorization': `Bearer ${c.env.PASS_API_KEY}`
      }
    })
    
    const userData = await response.json()
    
    // DB에 사용자 저장
    const hashedResidentNumber = await hashResidentNumber(userData.resident_number)
    
    const { DB } = c.env
    await DB.prepare(`
      INSERT INTO users (phone, real_name, nickname, resident_number_hash, is_verified)
      VALUES (?, ?, ?, ?, 1)
    `).bind(
      userData.phone,
      userData.name,
      generateNickname(userData.name),
      hashedResidentNumber
    ).run()
    
    return c.redirect('/?verified=true')
  }
  
  return c.redirect('/?verified=false')
})

export default auth
```

### 1.3 보안 권장사항
- 주민등록번호는 반드시 해시화하여 저장 (SHA-256 이상)
- HTTPS 연결만 허용
- 인증 세션은 15분 이내 만료
- 중복 인증 시도 제한 (IP당 5회/일)

---

## 2. 결제 시스템 연동

### 2.1 추천 결제 게이트웨이
- **토스페이먼츠**: 가장 간편하고 수수료 저렴
- **이니시스**: 안정적이고 다양한 결제수단 지원
- **NHN KCP**: 대기업 레벨 보안 인증

### 2.2 토스페이먼츠 연동 예시

#### 2.2.1 환경 변수 설정 (.dev.vars)
```env
TOSS_CLIENT_KEY=test_ck_xxxxxxxxx
TOSS_SECRET_KEY=test_sk_xxxxxxxxx
```

#### 2.2.2 결제 요청 API

```javascript
// src/routes/payment.ts
import { Hono } from 'hono'

const payment = new Hono()

// 정책 제안 결제 요청
payment.post('/proposals/payment', async (c) => {
  const { user_id, proposal_title } = await c.req.json()
  const amount = 5000 // 제안 등록 비용
  const orderId = `PROPOSAL_${Date.now()}_${user_id}`
  
  // 토스페이먼츠 결제 준비
  const response = await fetch('https://api.tosspayments.com/v1/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(c.env.TOSS_SECRET_KEY + ':')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      orderId,
      amount,
      orderName: `정책 제안: ${proposal_title}`,
      successUrl: 'https://your-domain.com/payment/success',
      failUrl: 'https://your-domain.com/payment/fail'
    })
  })
  
  const paymentData = await response.json()
  
  // DB에 결제 대기 상태 저장
  const { DB } = c.env
  await DB.prepare(`
    INSERT INTO payments (user_id, payment_type, amount, status, transaction_id)
    VALUES (?, 'proposal', ?, 'pending', ?)
  `).bind(user_id, amount, orderId).run()
  
  return c.json({
    payment_url: paymentData.checkout.url,
    order_id: orderId
  })
})

// 결제 성공 콜백
payment.get('/success', async (c) => {
  const { orderId, paymentKey, amount } = c.req.query()
  
  // 결제 승인 요청
  const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(c.env.TOSS_SECRET_KEY + ':')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ orderId, amount })
  })
  
  if (response.ok) {
    const { DB } = c.env
    
    // 결제 상태 업데이트
    await DB.prepare(`
      UPDATE payments 
      SET status = 'completed', payment_method = 'card'
      WHERE transaction_id = ?
    `).bind(orderId).run()
    
    return c.redirect('/proposals/new?payment=success')
  }
  
  return c.redirect('/proposals/new?payment=failed')
})

// 투표 결제 요청 (유료 투표)
payment.post('/votes/payment', async (c) => {
  const { user_id, proposal_id, amount } = await c.req.json()
  const orderId = `VOTE_${Date.now()}_${user_id}`
  
  // 토스페이먼츠 결제 준비 (동일한 로직)
  // ...
  
  return c.json({
    payment_url: paymentData.checkout.url,
    order_id: orderId
  })
})

export default payment
```

#### 2.2.3 프론트엔드 결제 연동

```javascript
// public/static/payment.js

// 정책 제안 결제
async function payForProposal(proposalTitle) {
  try {
    const response = await axios.post('/api/payment/proposals/payment', {
      user_id: currentUser.id,
      proposal_title: proposalTitle
    })
    
    // 결제 페이지로 리다이렉트
    window.location.href = response.data.payment_url
    
  } catch (error) {
    console.error('결제 요청 실패:', error)
    showNotification('결제 요청에 실패했습니다.', 'error')
  }
}

// 유료 투표 결제
async function payForVote(proposalId, voteType, amount = 1000) {
  try {
    const response = await axios.post('/api/payment/votes/payment', {
      user_id: currentUser.id,
      proposal_id: proposalId,
      amount: amount
    })
    
    // 결제 페이지로 리다이렉트
    window.location.href = response.data.payment_url
    
  } catch (error) {
    console.error('결제 요청 실패:', error)
    showNotification('결제 요청에 실패했습니다.', 'error')
  }
}
```

### 2.3 결제 보안 권장사항
- Secret Key는 절대 프론트엔드에 노출하지 않음
- 모든 결제 요청은 백엔드에서 처리
- 결제 금액 검증을 서버 사이드에서 수행
- 결제 완료 후 반드시 승인(confirm) 단계 거치기
- 웹훅(Webhook)으로 결제 상태 실시간 확인

---

## 3. Cloudflare 환경 변수 설정

### 3.1 로컬 개발용 (.dev.vars)
```env
# 본인인증 API
PASS_API_KEY=your_pass_api_key
PASS_API_SECRET=your_pass_api_secret

# 결제 API
TOSS_CLIENT_KEY=test_ck_xxxxxxxxx
TOSS_SECRET_KEY=test_sk_xxxxxxxxx

# OpenAI (AI 정책 분석용)
OPENAI_API_KEY=sk-xxxxxxxxx
```

### 3.2 프로덕션 환경 변수 설정
```bash
# Cloudflare Pages에 환경 변수 등록
wrangler pages secret put PASS_API_KEY --project-name webapp
wrangler pages secret put PASS_API_SECRET --project-name webapp
wrangler pages secret put TOSS_CLIENT_KEY --project-name webapp
wrangler pages secret put TOSS_SECRET_KEY --project-name webapp
wrangler pages secret put OPENAI_API_KEY --project-name webapp
```

---

## 4. AI 정책 분석 연동 (OpenAI)

### 4.1 정책 제안 자동 분석

```javascript
// src/routes/ai.ts
import { Hono } from 'hono'

const ai = new Hono()

// AI 정책 분석 API
ai.post('/analyze', async (c) => {
  const { proposal_id } = await c.req.json()
  const { DB } = c.env
  
  // 제안 정보 조회
  const proposal = await DB.prepare(`
    SELECT * FROM proposals WHERE id = ?
  `).bind(proposal_id).first()
  
  if (!proposal) {
    return c.json({ error: 'Proposal not found' }, 404)
  }
  
  // OpenAI API 호출
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '당신은 지자체 정책 전문가입니다. 주민 제안을 분석하여 실현 가능성, 예산 타당성, 법률 검토, 주민 안전 영향을 평가하세요.'
        },
        {
          role: 'user',
          content: `
정책 제안 분석 요청:
- 제목: ${proposal.title}
- 문제 정의: ${proposal.problem_definition}
- 현재 상황: ${proposal.current_situation}
- 해결 방안: ${proposal.solution}
- 예상 예산: ${proposal.estimated_budget}

다음 항목을 JSON 형식으로 평가해주세요:
1. feasibility_score (0-100): 실현 가능성 점수
2. budget_assessment: 예산 타당성 평가
3. legal_review: 법률 위반 가능성
4. safety_impact: 주민 안전 영향도
5. priority_score (0-100): 정책 우선순위 점수
6. recommendations: 개선 권장사항
          `
        }
      ],
      temperature: 0.7
    })
  })
  
  const aiResult = await response.json()
  const analysis = JSON.parse(aiResult.choices[0].message.content)
  
  // AI 분석 결과 저장
  await DB.prepare(`
    UPDATE proposals 
    SET ai_analysis = ?
    WHERE id = ?
  `).bind(JSON.stringify(analysis), proposal_id).run()
  
  return c.json({ analysis })
})

export default ai
```

---

## 5. 통합 테스트 체크리스트

### 5.1 본인인증 테스트
- [ ] 휴대폰 인증 성공 시나리오
- [ ] 인증 실패 시나리오
- [ ] 중복 가입 방지
- [ ] 외국인 주민 인증
- [ ] 인증 세션 만료 처리

### 5.2 결제 테스트
- [ ] 정책 제안 결제 성공
- [ ] 유료 투표 결제 성공
- [ ] 결제 실패 처리
- [ ] 결제 취소 처리
- [ ] 환불 프로세스

### 5.3 보안 테스트
- [ ] SQL Injection 방어
- [ ] XSS 공격 방어
- [ ] CSRF 토큰 검증
- [ ] Rate Limiting
- [ ] API 인증/인가

---

## 6. 실제 운영 시 주의사항

### 6.1 개인정보 보호
- 주민등록번호는 해시화 후 저장
- 실명은 암호화 저장 권장
- 로그에 개인정보 미포함
- 정기적인 보안 감사

### 6.2 결제 관리
- PG사 정산 주기 확인
- 환불 정책 명시
- 부가세 처리
- 전자세금계산서 발행

### 6.3 법률 준수
- 공직선거법 준수 (특정 후보 지지 금지)
- 개인정보보호법 준수
- 전자금융거래법 준수
- 정보통신망법 준수

---

## 7. 문의 및 지원

### 7.1 PG사 고객센터
- **토스페이먼츠**: 1544-7772
- **이니시스**: 1644-1234
- **NHN KCP**: 1644-8661

### 7.2 본인인증 서비스
- **PASS**: pass.skt.co.kr
- **NICE평가정보**: https://www.niceid.co.kr

### 7.3 기술 문서
- 토스페이먼츠 개발 문서: https://docs.tosspayments.com
- Cloudflare Workers 문서: https://developers.cloudflare.com/workers
- Hono 프레임워크: https://hono.dev

---

## 부록: 샘플 환경 변수 파일

```bash
# .dev.vars (로컬 개발용)
# 주의: 이 파일은 .gitignore에 포함되어야 합니다

# 본인인증
PASS_API_KEY=dev_pass_api_key
PASS_API_SECRET=dev_pass_secret

# 결제
TOSS_CLIENT_KEY=test_ck_example
TOSS_SECRET_KEY=test_sk_example

# AI
OPENAI_API_KEY=sk-example

# 데이터베이스 (로컬 개발은 자동 생성)
# DATABASE_ID는 wrangler.jsonc에서 관리
```

이 가이드를 참고하여 실제 운영 환경에서 안전하게 본인인증과 결제 시스템을 연동할 수 있습니다.
