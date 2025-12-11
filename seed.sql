-- 테스트 사용자 생성
INSERT OR IGNORE INTO users (id, phone, real_name, nickname, resident_number_hash, is_verified, is_admin, trust_score) VALUES 
  (1, '010-1234-5678', '김철수', '정책시민', 'hash_123456_1234567', 1, 0, 150),
  (2, '010-2345-6789', '이영희', '참여주민', 'hash_234567_2345678', 1, 0, 120),
  (3, '010-3456-7890', '박민수', '공론장관리자', 'hash_345678_3456789', 1, 1, 200);

-- 테스트 정책 제안 생성
INSERT OR IGNORE INTO proposals (id, user_id, title, problem_definition, current_situation, solution, estimated_budget, expected_effect, category, status, payment_status, payment_amount, vote_count_yes, vote_count_no, view_count) VALUES 
  (1, 1, '버스 노선 확대 제안', '출퇴근 시간 대중교통 부족', '주민들이 버스 정류장까지 도보 20분 이상 소요되어 불편 호소', '3개 노선 추가 운행 및 배차 간격 단축', '연간 5억원', '대중교통 이용률 30% 증가 예상', 'transport', 'voting', 'paid', 5000, 124, 23, 456),
  (2, 2, '공원 야간 조명 설치', '야간 공원 안전 문제', '공원 이용 시민들이 어두워 불안감 호소, 최근 1년간 안전사고 5건 발생', 'LED 가로등 20개 설치 및 CCTV 보강', '3천만원', '야간 안전도 향상 및 공원 이용률 증가', 'safety', 'approved', 'paid', 5000, 89, 12, 234),
  (3, 1, '지역 축제 개최 제안', '지역 문화 활성화 필요', '주민 커뮤니티 활동 부족으로 지역 정체성 약화', '분기별 지역 축제 개최 및 주민 참여 프로그램 운영', '분기당 2천만원', '주민 화합 및 지역 경제 활성화', 'culture', 'pending', 'paid', 5000, 0, 0, 89);

-- 테스트 투표 데이터
INSERT OR IGNORE INTO votes (proposal_id, user_id, vote_type, is_paid, payment_amount, reason) VALUES 
  (1, 2, 'yes', 1, 1000, '출퇴근이 너무 불편합니다. 꼭 필요한 정책입니다.'),
  (1, 3, 'yes', 1, 2000, '대중교통 활성화는 환경 보호에도 도움이 됩니다.'),
  (2, 1, 'yes', 0, 0, '안전이 최우선입니다.'),
  (2, 3, 'yes', 1, 1000, '야간 운동하는 시민들에게 꼭 필요합니다.');

-- 테스트 댓글 데이터
INSERT OR IGNORE INTO comments (proposal_id, user_id, content, is_paid, payment_amount) VALUES 
  (1, 2, '이 제안에 전적으로 동의합니다. 출퇴근 시간 버스를 타려면 30분 이상 기다려야 합니다.', 1, 1000),
  (1, 3, '예산 규모가 적절한지 검토가 필요할 것 같습니다.', 0, 0),
  (2, 1, '공원 조명은 정말 시급한 문제입니다. 빠른 시일 내에 실행되길 바랍니다.', 1, 1000);

-- 테스트 정책 진행 상황
INSERT OR IGNORE INTO policy_progress (proposal_id, stage, budget_used, progress_percentage, description) VALUES 
  (2, 'budget_allocated', 10000000, 30, '예산 배정 완료. 설치 업체 선정 중입니다.');

-- 테스트 알림 데이터
INSERT OR IGNORE INTO notifications (user_id, type, title, content, target_type, target_id, is_read) VALUES 
  (1, 'proposal_approved', '제안이 승인되었습니다', '버스 노선 확대 제안이 검토를 통과하여 투표 단계로 진입했습니다.', 'proposal', 1, 0),
  (2, 'comment_reply', '댓글에 답글이 달렸습니다', '공원 야간 조명 설치 제안에 새로운 댓글이 달렸습니다.', 'proposal', 2, 1);
