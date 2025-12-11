import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS 설정
app.use('/api/*', cors())

// 정적 파일 서빙
app.use('/static/*', serveStatic({ root: './public' }))

// ============================================
// API: 사용자 관련
// ============================================

// 사용자 목록 조회
app.get('/api/users', async (c) => {
  const { DB } = c.env
  const { results } = await DB.prepare(`
    SELECT id, nickname, trust_score, is_admin, created_at 
    FROM users 
    ORDER BY created_at DESC 
    LIMIT 50
  `).all()
  return c.json({ users: results })
})

// 사용자 정보 조회
app.get('/api/users/:id', async (c) => {
  const { DB } = c.env
  const userId = c.req.param('id')
  
  const user = await DB.prepare(`
    SELECT id, nickname, trust_score, is_admin, created_at 
    FROM users 
    WHERE id = ?
  `).bind(userId).first()
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  
  return c.json({ user })
})

// ============================================
// API: 정책 제안 관련
// ============================================

// 정책 제안 목록 조회
app.get('/api/proposals', async (c) => {
  const { DB } = c.env
  const status = c.req.query('status') // pending, approved, voting, adopted, completed
  const category = c.req.query('category')
  const page = parseInt(c.req.query('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit
  
  let query = `
    SELECT p.*, u.nickname as author_nickname
    FROM proposals p
    JOIN users u ON p.user_id = u.id
    WHERE 1=1
  `
  const params: any[] = []
  
  if (status) {
    query += ' AND p.status = ?'
    params.push(status)
  }
  
  if (category) {
    query += ' AND p.category = ?'
    params.push(category)
  }
  
  query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?'
  params.push(limit, offset)
  
  const { results } = await DB.prepare(query).bind(...params).all()
  
  return c.json({ proposals: results, page, limit })
})

// 정책 제안 상세 조회
app.get('/api/proposals/:id', async (c) => {
  const { DB } = c.env
  const proposalId = c.req.param('id')
  
  // 조회수 증가
  await DB.prepare(`
    UPDATE proposals 
    SET view_count = view_count + 1 
    WHERE id = ?
  `).bind(proposalId).run()
  
  // 제안 정보 조회
  const proposal = await DB.prepare(`
    SELECT p.*, u.nickname as author_nickname, u.trust_score as author_trust_score
    FROM proposals p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `).bind(proposalId).first()
  
  if (!proposal) {
    return c.json({ error: 'Proposal not found' }, 404)
  }
  
  // 댓글 조회
  const { results: comments } = await DB.prepare(`
    SELECT c.*, u.nickname as author_nickname
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.proposal_id = ? AND c.parent_id IS NULL
    ORDER BY c.created_at DESC
  `).bind(proposalId).all()
  
  return c.json({ proposal, comments })
})

// 정책 제안 등록 (유료)
app.post('/api/proposals', async (c) => {
  const { DB } = c.env
  const body = await c.req.json()
  
  // 필수 필드 검증
  const required = ['user_id', 'title', 'problem_definition', 'current_situation', 'solution', 'category']
  for (const field of required) {
    if (!body[field]) {
      return c.json({ error: `Missing required field: ${field}` }, 400)
    }
  }
  
  // 결제 검증 (실제 환경에서는 결제 API 연동 필요)
  const paymentAmount = 5000 // 제안 등록 비용
  
  // 제안 등록
  const result = await DB.prepare(`
    INSERT INTO proposals (
      user_id, title, problem_definition, current_situation, 
      solution, estimated_budget, expected_effect, similar_cases,
      category, status, payment_status, payment_amount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'paid', ?)
  `).bind(
    body.user_id,
    body.title,
    body.problem_definition,
    body.current_situation,
    body.solution,
    body.estimated_budget || '',
    body.expected_effect || '',
    body.similar_cases || '',
    body.category,
    paymentAmount
  ).run()
  
  // 결제 내역 기록
  await DB.prepare(`
    INSERT INTO payments (user_id, payment_type, target_id, amount, status, payment_method)
    VALUES (?, 'proposal', ?, ?, 'completed', 'card')
  `).bind(body.user_id, result.meta.last_row_id, paymentAmount).run()
  
  // 알림 생성 (관리자에게)
  await DB.prepare(`
    INSERT INTO notifications (user_id, type, title, content, target_type, target_id)
    SELECT id, 'new_proposal', '새로운 정책 제안', ?, 'proposal', ?
    FROM users WHERE is_admin = 1
  `).bind(`"${body.title}" 제안이 등록되었습니다.`, result.meta.last_row_id).run()
  
  return c.json({ 
    success: true, 
    proposal_id: result.meta.last_row_id,
    message: '정책 제안이 등록되었습니다. 관리자 검토 후 투표에 상정됩니다.'
  })
})

// 정책 제안 승인/반려 (관리자)
app.patch('/api/proposals/:id/status', async (c) => {
  const { DB } = c.env
  const proposalId = c.req.param('id')
  const body = await c.req.json()
  
  // 실제 환경에서는 관리자 권한 검증 필요
  if (!body.admin_user_id) {
    return c.json({ error: 'Admin authentication required' }, 403)
  }
  
  // 관리자 권한 확인
  const admin = await DB.prepare(`
    SELECT is_admin FROM users WHERE id = ?
  `).bind(body.admin_user_id).first()
  
  if (!admin || !admin.is_admin) {
    return c.json({ error: 'Admin permission required' }, 403)
  }
  
  // 상태 업데이트
  await DB.prepare(`
    UPDATE proposals 
    SET status = ?, admin_feedback = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(body.status, body.admin_feedback || '', proposalId).run()
  
  // 제안자에게 알림
  const proposal = await DB.prepare(`
    SELECT user_id, title FROM proposals WHERE id = ?
  `).bind(proposalId).first()
  
  if (proposal) {
    const notificationTitle = body.status === 'approved' 
      ? '제안이 승인되었습니다' 
      : '제안이 반려되었습니다'
    
    const notificationContent = body.status === 'approved'
      ? `"${proposal.title}" 제안이 승인되어 투표에 상정됩니다.`
      : `"${proposal.title}" 제안이 반려되었습니다. 사유: ${body.admin_feedback}`
    
    await DB.prepare(`
      INSERT INTO notifications (user_id, type, title, content, target_type, target_id)
      VALUES (?, 'proposal_status', ?, ?, 'proposal', ?)
    `).bind(proposal.user_id, notificationTitle, notificationContent, proposalId).run()
  }
  
  return c.json({ success: true, message: '제안 상태가 업데이트되었습니다.' })
})

// ============================================
// API: 투표 관련
// ============================================

// 투표하기 (유료/무료)
app.post('/api/votes', async (c) => {
  const { DB } = c.env
  const body = await c.req.json()
  
  // 필수 필드 검증
  if (!body.proposal_id || !body.user_id || !body.vote_type) {
    return c.json({ error: 'Missing required fields' }, 400)
  }
  
  // 중복 투표 확인
  const existing = await DB.prepare(`
    SELECT id FROM votes WHERE proposal_id = ? AND user_id = ?
  `).bind(body.proposal_id, body.user_id).first()
  
  if (existing) {
    return c.json({ error: '이미 투표하셨습니다.' }, 400)
  }
  
  // 투표 등록
  const isPaid = body.is_paid || 0
  const paymentAmount = isPaid ? (body.payment_amount || 1000) : 0
  
  await DB.prepare(`
    INSERT INTO votes (proposal_id, user_id, vote_type, is_paid, payment_amount, reason)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    body.proposal_id,
    body.user_id,
    body.vote_type,
    isPaid,
    paymentAmount,
    body.reason || ''
  ).run()
  
  // 제안의 투표 수 업데이트
  const voteColumn = body.vote_type === 'yes' ? 'vote_count_yes' : 'vote_count_no'
  await DB.prepare(`
    UPDATE proposals 
    SET ${voteColumn} = ${voteColumn} + 1
    WHERE id = ?
  `).bind(body.proposal_id).run()
  
  // 유료 투표인 경우 결제 내역 기록
  if (isPaid && paymentAmount > 0) {
    await DB.prepare(`
      INSERT INTO payments (user_id, payment_type, target_id, amount, status, payment_method)
      VALUES (?, 'vote', ?, ?, 'completed', 'card')
    `).bind(body.user_id, body.proposal_id, paymentAmount).run()
  }
  
  return c.json({ success: true, message: '투표가 완료되었습니다.' })
})

// 투표 결과 조회
app.get('/api/proposals/:id/votes', async (c) => {
  const { DB } = c.env
  const proposalId = c.req.param('id')
  
  const { results: votes } = await DB.prepare(`
    SELECT v.*, u.nickname as voter_nickname
    FROM votes v
    JOIN users u ON v.user_id = u.id
    WHERE v.proposal_id = ?
    ORDER BY v.created_at DESC
  `).bind(proposalId).all()
  
  // 투표 통계
  const stats = await DB.prepare(`
    SELECT 
      COUNT(*) as total_votes,
      SUM(CASE WHEN vote_type = 'yes' THEN 1 ELSE 0 END) as yes_votes,
      SUM(CASE WHEN vote_type = 'no' THEN 1 ELSE 0 END) as no_votes,
      SUM(CASE WHEN is_paid = 1 THEN payment_amount ELSE 0 END) as total_paid_amount
    FROM votes
    WHERE proposal_id = ?
  `).bind(proposalId).first()
  
  return c.json({ votes, stats })
})

// ============================================
// API: 댓글/토론 관련
// ============================================

// 댓글 등록
app.post('/api/comments', async (c) => {
  const { DB } = c.env
  const body = await c.req.json()
  
  // 필수 필드 검증
  if (!body.proposal_id || !body.user_id || !body.content) {
    return c.json({ error: 'Missing required fields' }, 400)
  }
  
  // AI 필터링 (실제 환경에서는 OpenAI Moderation API 사용)
  // 여기서는 간단한 키워드 필터링
  const blockedKeywords = ['욕설', '비방', '후보', '지지']
  const isBlocked = blockedKeywords.some(keyword => body.content.includes(keyword))
  
  const isPaid = body.is_paid || 0
  const paymentAmount = isPaid ? 1000 : 0
  
  const result = await DB.prepare(`
    INSERT INTO comments (proposal_id, user_id, parent_id, content, is_paid, payment_amount, is_blocked)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    body.proposal_id,
    body.user_id,
    body.parent_id || null,
    body.content,
    isPaid,
    paymentAmount,
    isBlocked ? 1 : 0
  ).run()
  
  if (isBlocked) {
    return c.json({ 
      success: true, 
      warning: '부적절한 내용이 감지되어 관리자 검토 후 게시됩니다.',
      comment_id: result.meta.last_row_id 
    })
  }
  
  // 제안자에게 알림
  const proposal = await DB.prepare(`
    SELECT user_id, title FROM proposals WHERE id = ?
  `).bind(body.proposal_id).first()
  
  if (proposal && proposal.user_id !== body.user_id) {
    await DB.prepare(`
      INSERT INTO notifications (user_id, type, title, content, target_type, target_id)
      VALUES (?, 'comment_reply', '새로운 댓글', ?, 'proposal', ?)
    `).bind(
      proposal.user_id,
      `"${proposal.title}" 제안에 새로운 댓글이 달렸습니다.`,
      body.proposal_id
    ).run()
  }
  
  return c.json({ success: true, comment_id: result.meta.last_row_id })
})

// 대댓글 조회
app.get('/api/comments/:id/replies', async (c) => {
  const { DB } = c.env
  const commentId = c.req.param('id')
  
  const { results } = await DB.prepare(`
    SELECT c.*, u.nickname as author_nickname
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.parent_id = ?
    ORDER BY c.created_at ASC
  `).bind(commentId).all()
  
  return c.json({ replies: results })
})

// ============================================
// API: 정책 진행 상황
// ============================================

// 정책 진행 상황 조회
app.get('/api/proposals/:id/progress', async (c) => {
  const { DB } = c.env
  const proposalId = c.req.param('id')
  
  const { results } = await DB.prepare(`
    SELECT * FROM policy_progress
    WHERE proposal_id = ?
    ORDER BY created_at DESC
  `).bind(proposalId).all()
  
  return c.json({ progress: results })
})

// 정책 진행 상황 업데이트 (관리자)
app.post('/api/proposals/:id/progress', async (c) => {
  const { DB } = c.env
  const proposalId = c.req.param('id')
  const body = await c.req.json()
  
  // 관리자 권한 확인 필요
  
  await DB.prepare(`
    INSERT INTO policy_progress (proposal_id, stage, budget_used, progress_percentage, kpi_achievement, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    proposalId,
    body.stage,
    body.budget_used || 0,
    body.progress_percentage || 0,
    body.kpi_achievement || '',
    body.description || ''
  ).run()
  
  return c.json({ success: true })
})

// ============================================
// API: 통계 및 대시보드
// ============================================

// 전체 통계
app.get('/api/statistics', async (c) => {
  const { DB } = c.env
  
  const totalProposals = await DB.prepare(`
    SELECT COUNT(*) as count FROM proposals
  `).first()
  
  const totalVotes = await DB.prepare(`
    SELECT COUNT(*) as count FROM votes
  `).first()
  
  const totalUsers = await DB.prepare(`
    SELECT COUNT(*) as count FROM users
  `).first()
  
  const proposalsByStatus = await DB.prepare(`
    SELECT status, COUNT(*) as count
    FROM proposals
    GROUP BY status
  `).all()
  
  const proposalsByCategory = await DB.prepare(`
    SELECT category, COUNT(*) as count
    FROM proposals
    GROUP BY category
  `).all()
  
  return c.json({
    total_proposals: totalProposals?.count || 0,
    total_votes: totalVotes?.count || 0,
    total_users: totalUsers?.count || 0,
    proposals_by_status: proposalsByStatus.results,
    proposals_by_category: proposalsByCategory.results
  })
})

// ============================================
// API: 알림
// ============================================

// 사용자 알림 조회
app.get('/api/notifications/:user_id', async (c) => {
  const { DB } = c.env
  const userId = c.req.param('user_id')
  
  const { results } = await DB.prepare(`
    SELECT * FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 50
  `).bind(userId).all()
  
  return c.json({ notifications: results })
})

// 알림 읽음 처리
app.patch('/api/notifications/:id/read', async (c) => {
  const { DB } = c.env
  const notificationId = c.req.param('id')
  
  await DB.prepare(`
    UPDATE notifications SET is_read = 1 WHERE id = ?
  `).bind(notificationId).run()
  
  return c.json({ success: true })
})

// ============================================
// 홈페이지 렌더링
// ============================================

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CivicOne - 주민 정책참여 플랫폼</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '#2563eb',
                  secondary: '#7c3aed',
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gray-50">
        <!-- 헤더 -->
        <nav class="bg-white shadow-md">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-users text-primary text-2xl"></i>
                        <h1 class="text-2xl font-bold text-gray-800">CivicOne</h1>
                    </div>
                    <div class="hidden md:flex space-x-6">
                        <a href="#proposals" class="text-gray-600 hover:text-primary transition">정책 제안</a>
                        <a href="#voting" class="text-gray-600 hover:text-primary transition">투표 중</a>
                        <a href="#progress" class="text-gray-600 hover:text-primary transition">진행 상황</a>
                        <a href="#statistics" class="text-gray-600 hover:text-primary transition">통계</a>
                    </div>
                    <button id="loginBtn" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                        <i class="fas fa-sign-in-alt mr-2"></i>로그인
                    </button>
                </div>
            </div>
        </nav>

        <!-- 히어로 섹션 -->
        <div class="bg-gradient-to-r from-primary to-secondary text-white py-16">
            <div class="container mx-auto px-4 text-center">
                <h2 class="text-4xl md:text-5xl font-bold mb-4">
                    주민이 만드는 정책, 지자체가 응답하는 플랫폼
                </h2>
                <p class="text-xl mb-8">실명 기반의 책임 있는 공론장으로 행정 신뢰도를 높입니다</p>
                <button class="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                    <i class="fas fa-lightbulb mr-2"></i>정책 제안하기
                </button>
            </div>
        </div>

        <!-- 주요 통계 -->
        <div class="container mx-auto px-4 py-12">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6" id="statistics">
                <div class="bg-white p-6 rounded-lg shadow-md text-center">
                    <div class="text-4xl font-bold text-primary" id="stat-proposals">-</div>
                    <div class="text-gray-600 mt-2">총 제안 수</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md text-center">
                    <div class="text-4xl font-bold text-green-600" id="stat-votes">-</div>
                    <div class="text-gray-600 mt-2">총 투표 수</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md text-center">
                    <div class="text-4xl font-bold text-purple-600" id="stat-users">-</div>
                    <div class="text-gray-600 mt-2">참여 주민</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md text-center">
                    <div class="text-4xl font-bold text-orange-600" id="stat-adopted">-</div>
                    <div class="text-gray-600 mt-2">채택된 정책</div>
                </div>
            </div>
        </div>

        <!-- 정책 제안 목록 -->
        <div class="container mx-auto px-4 py-8">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-3xl font-bold text-gray-800">
                    <i class="fas fa-vote-yea text-primary mr-2"></i>투표 중인 정책
                </h3>
                <div class="flex space-x-2">
                    <select class="border rounded-lg px-4 py-2" id="categoryFilter">
                        <option value="">전체 카테고리</option>
                        <option value="transport">교통</option>
                        <option value="safety">안전</option>
                        <option value="culture">문화</option>
                        <option value="welfare">복지</option>
                        <option value="environment">환경</option>
                    </select>
                    <select class="border rounded-lg px-4 py-2" id="statusFilter">
                        <option value="voting">투표 중</option>
                        <option value="pending">검토 중</option>
                        <option value="approved">승인됨</option>
                        <option value="adopted">채택됨</option>
                    </select>
                </div>
            </div>

            <div id="proposals" class="grid grid-cols-1 gap-6">
                <!-- 정책 제안 카드들이 여기에 동적으로 로드됩니다 -->
            </div>

            <div class="text-center mt-8">
                <button id="loadMoreBtn" class="bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
                    더 보기
                </button>
            </div>
        </div>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-8 mt-16">
            <div class="container mx-auto px-4 text-center">
                <p class="mb-4">주민 정책참여 플랫폼 CivicOne</p>
                <p class="text-gray-400 text-sm">실명 기반 · 유료제 · 투명한 정책 집행</p>
                <div class="mt-4 space-x-4">
                    <a href="#" class="text-gray-400 hover:text-white transition">이용약관</a>
                    <a href="#" class="text-gray-400 hover:text-white transition">개인정보처리방침</a>
                    <a href="#" class="text-gray-400 hover:text-white transition">고객센터</a>
                </div>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
