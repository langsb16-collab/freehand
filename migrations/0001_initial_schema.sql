-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT UNIQUE NOT NULL,
  real_name TEXT NOT NULL,
  nickname TEXT UNIQUE NOT NULL,
  resident_number_hash TEXT UNIQUE NOT NULL, -- 주민등록번호 해시값 (보안)
  foreign_number_hash TEXT, -- 외국인등록번호 해시값 (선택)
  is_verified INTEGER DEFAULT 0, -- 본인인증 여부
  is_admin INTEGER DEFAULT 0, -- 관리자 여부
  trust_score INTEGER DEFAULT 100, -- 신뢰지수 점수
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 정책 제안 테이블
CREATE TABLE IF NOT EXISTS proposals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  problem_definition TEXT NOT NULL, -- 문제 정의
  current_situation TEXT NOT NULL, -- 주민 피해/불편 현황
  solution TEXT NOT NULL, -- 해결 방안
  estimated_budget TEXT, -- 예상 예산
  expected_effect TEXT, -- 기대 효과
  similar_cases TEXT, -- 타 지자체 사례
  category TEXT NOT NULL, -- 카테고리 (교통, 복지, 환경 등)
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, voting, adopted, completed
  payment_status TEXT DEFAULT 'pending', -- 결제 상태: pending, paid, refunded
  payment_amount INTEGER DEFAULT 0, -- 결제 금액
  admin_feedback TEXT, -- 관리자 피드백
  vote_count_yes INTEGER DEFAULT 0, -- 찬성 투표 수
  vote_count_no INTEGER DEFAULT 0, -- 반대 투표 수
  view_count INTEGER DEFAULT 0, -- 조회수
  ai_analysis TEXT, -- AI 정책 분석 결과
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 투표 테이블
CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  proposal_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  vote_type TEXT NOT NULL, -- yes, no
  is_paid INTEGER DEFAULT 0, -- 유료 투표 여부
  payment_amount INTEGER DEFAULT 0, -- 결제 금액
  reason TEXT, -- 투표 이유
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (proposal_id) REFERENCES proposals(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(proposal_id, user_id) -- 중복 투표 방지
);

-- 댓글/토론 테이블
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  proposal_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  parent_id INTEGER, -- 대댓글용 부모 ID
  content TEXT NOT NULL,
  is_paid INTEGER DEFAULT 0, -- 유료 댓글 여부
  payment_amount INTEGER DEFAULT 0,
  is_blocked INTEGER DEFAULT 0, -- AI 필터로 차단된 댓글
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (proposal_id) REFERENCES proposals(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parent_id) REFERENCES comments(id)
);

-- 정책 진행 상황 테이블
CREATE TABLE IF NOT EXISTS policy_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  proposal_id INTEGER NOT NULL,
  stage TEXT NOT NULL, -- 단계: budget_allocated, in_progress, completed
  budget_used INTEGER DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  kpi_achievement TEXT, -- KPI 달성률 JSON
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (proposal_id) REFERENCES proposals(id)
);

-- 결제 내역 테이블
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  payment_type TEXT NOT NULL, -- proposal, vote, comment
  target_id INTEGER NOT NULL, -- 제안/투표/댓글 ID
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method TEXT, -- card, bank_transfer
  transaction_id TEXT UNIQUE, -- 결제 고유 ID
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 알림 테이블
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL, -- proposal_approved, vote_started, comment_reply, policy_completed
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_type TEXT, -- proposal, comment
  target_id INTEGER,
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON proposals(user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_category ON proposals(category);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_votes_proposal_id ON votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);

CREATE INDEX IF NOT EXISTS idx_comments_proposal_id ON comments(proposal_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
