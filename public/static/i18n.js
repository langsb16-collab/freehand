// 다국어 번역 데이터
const translations = {
  ko: {
    // 헤더 & 네비게이션
    'app.name': 'CivicOne',
    'nav.proposals': '정책 제안',
    'nav.voting': '투표 중',
    'nav.progress': '진행 상황',
    'nav.statistics': '통계',
    'nav.admin': '관리자',
    'nav.login': '로그인',
    
    // 히어로 섹션
    'hero.title': '주민이 만드는 정책, 지자체가 응답하는 플랫폼',
    'hero.subtitle': '실명 기반의 책임 있는 공론장으로 행정 신뢰도를 높입니다',
    'hero.cta': '정책 제안하기',
    
    // 통계
    'stat.proposals': '총 제안 수',
    'stat.votes': '총 투표 수',
    'stat.users': '참여 주민',
    'stat.adopted': '채택된 정책',
    
    // 정책 제안 목록
    'proposals.voting.title': '투표 중인 정책',
    'proposals.category.all': '전체 카테고리',
    'proposals.category.transport': '교통',
    'proposals.category.safety': '안전',
    'proposals.category.culture': '문화',
    'proposals.category.welfare': '복지',
    'proposals.category.environment': '환경',
    'proposals.status.voting': '투표 중',
    'proposals.status.pending': '검토 중',
    'proposals.status.approved': '승인됨',
    'proposals.status.adopted': '채택됨',
    'proposals.status.completed': '완료됨',
    'proposals.status.rejected': '반려됨',
    'proposals.load.more': '더 보기',
    'proposals.empty': '등록된 정책 제안이 없습니다.',
    'proposals.views': '조회',
    'proposals.participants': '명 참여',
    'proposals.agree': '찬성',
    
    // 상세 페이지
    'detail.vote.status': '투표 현황',
    'detail.vote.yes': '찬성',
    'detail.vote.no': '반대',
    'detail.vote.yes.free': '찬성 (무료)',
    'detail.vote.no.free': '반대 (무료)',
    'detail.vote.paid.notice': '유료 투표(1,000원)는 정책 우선순위에 반영됩니다',
    'detail.problem': '문제 정의',
    'detail.situation': '현재 상황',
    'detail.solution': '해결 방안',
    'detail.budget': '예상 예산',
    'detail.effect': '기대 효과',
    'detail.feedback': '관리자 피드백',
    'detail.comments': '토론',
    'detail.comment.input': '건설적인 의견을 남겨주세요...',
    'detail.comment.paid': '유료 댓글 (1,000원) - 상단 노출 우선',
    'detail.comment.submit': '등록',
    'detail.comment.blocked': '⚠️ 관리자 검토 대기 중',
    'detail.author': '작성자',
    'detail.trust.score': '신뢰지수',
    
    // 푸터
    'footer.title': '주민 정책참여 플랫폼 CivicOne',
    'footer.tagline': '실명 기반 · 유료제 · 투명한 정책 집행',
    'footer.terms': '이용약관',
    'footer.privacy': '개인정보처리방침',
    'footer.support': '고객센터',
    
    // 알림
    'notification.login.required': '로그인이 필요합니다.',
    'notification.vote.success': '투표가 완료되었습니다!',
    'notification.vote.duplicate': '이미 투표하셨습니다.',
    'notification.comment.success': '댓글이 등록되었습니다!',
    'notification.comment.blocked': '부적절한 내용이 감지되어 관리자 검토 후 게시됩니다.',
    'notification.comment.required': '댓글 내용을 입력해주세요.',
    'notification.error.load': '데이터를 불러오는데 실패했습니다.',
    
    // 관리자 페이지
    'admin.title': 'CivicOne 관리자',
    'admin.user': '관리자',
    'admin.home': '메인으로',
    'admin.stat.pending': '검토 대기 중',
    'admin.stat.voting': '투표 진행 중',
    'admin.stat.adopted': '채택 예정',
    'admin.stat.users': '총 참여 주민',
    'admin.tab.pending': '검토 대기 중',
    'admin.tab.voting': '투표 중',
    'admin.tab.adopted': '채택된 정책',
    'admin.tab.all': '전체 제안',
    'admin.empty': '제안이 없습니다.',
    'admin.review': '검토하기',
    'admin.view': '상세보기',
    'admin.feedback': '검토 의견을 입력하세요...',
    'admin.approve': '승인 (투표 상정)',
    'admin.reject': '반려',
    'admin.feedback.required': '검토 의견을 입력해주세요.',
    'admin.reject.reason': '반려 사유를 입력해주세요.',
    'admin.approve.confirm': '제안이 승인되어 투표에 상정되었습니다.',
    'admin.reject.confirm': '정말 이 제안을 반려하시겠습니까?',
    'admin.reject.success': '제안이 반려되었습니다.',
    
    // 시간
    'time.just.now': '방금 전',
    'time.minutes.ago': '분 전',
    'time.hours.ago': '시간 전',
    'time.days.ago': '일 전'
  },
  
  en: {
    'app.name': 'CivicOne',
    'nav.proposals': 'Proposals',
    'nav.voting': 'Voting',
    'nav.progress': 'Progress',
    'nav.statistics': 'Statistics',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    
    'hero.title': 'Policy Made by Citizens, Responded by Government',
    'hero.subtitle': 'Building trust in administration through responsible, verified participation',
    'hero.cta': 'Submit Proposal',
    
    'stat.proposals': 'Total Proposals',
    'stat.votes': 'Total Votes',
    'stat.users': 'Participants',
    'stat.adopted': 'Adopted Policies',
    
    'proposals.voting.title': 'Policies in Voting',
    'proposals.category.all': 'All Categories',
    'proposals.category.transport': 'Transport',
    'proposals.category.safety': 'Safety',
    'proposals.category.culture': 'Culture',
    'proposals.category.welfare': 'Welfare',
    'proposals.category.environment': 'Environment',
    'proposals.status.voting': 'Voting',
    'proposals.status.pending': 'Under Review',
    'proposals.status.approved': 'Approved',
    'proposals.status.adopted': 'Adopted',
    'proposals.status.completed': 'Completed',
    'proposals.status.rejected': 'Rejected',
    'proposals.load.more': 'Load More',
    'proposals.empty': 'No proposals found.',
    'proposals.views': 'views',
    'proposals.participants': 'participants',
    'proposals.agree': 'Agree',
    
    'detail.vote.status': 'Voting Status',
    'detail.vote.yes': 'Agree',
    'detail.vote.no': 'Disagree',
    'detail.vote.yes.free': 'Agree (Free)',
    'detail.vote.no.free': 'Disagree (Free)',
    'detail.vote.paid.notice': 'Paid votes (₩1,000) are weighted in policy prioritization',
    'detail.problem': 'Problem Definition',
    'detail.situation': 'Current Situation',
    'detail.solution': 'Proposed Solution',
    'detail.budget': 'Estimated Budget',
    'detail.effect': 'Expected Effect',
    'detail.feedback': 'Admin Feedback',
    'detail.comments': 'Discussion',
    'detail.comment.input': 'Share your constructive opinion...',
    'detail.comment.paid': 'Paid comment (₩1,000) - Priority display',
    'detail.comment.submit': 'Submit',
    'detail.comment.blocked': '⚠️ Pending admin review',
    'detail.author': 'Author',
    'detail.trust.score': 'Trust Score',
    
    'footer.title': 'CivicOne - Citizen Policy Platform',
    'footer.tagline': 'Verified Identity · Paid System · Transparent Execution',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.support': 'Support',
    
    'notification.login.required': 'Login required.',
    'notification.vote.success': 'Vote submitted successfully!',
    'notification.vote.duplicate': 'You have already voted.',
    'notification.comment.success': 'Comment posted successfully!',
    'notification.comment.blocked': 'Your comment is pending review for inappropriate content.',
    'notification.comment.required': 'Please enter your comment.',
    'notification.error.load': 'Failed to load data.',
    
    'admin.title': 'CivicOne Admin',
    'admin.user': 'Admin',
    'admin.home': 'Home',
    'admin.stat.pending': 'Pending Review',
    'admin.stat.voting': 'In Voting',
    'admin.stat.adopted': 'To Be Adopted',
    'admin.stat.users': 'Total Users',
    'admin.tab.pending': 'Pending Review',
    'admin.tab.voting': 'In Voting',
    'admin.tab.adopted': 'Adopted Policies',
    'admin.tab.all': 'All Proposals',
    'admin.empty': 'No proposals found.',
    'admin.review': 'Review',
    'admin.view': 'View Details',
    'admin.feedback': 'Enter review comments...',
    'admin.approve': 'Approve (Open Voting)',
    'admin.reject': 'Reject',
    'admin.feedback.required': 'Please enter review comments.',
    'admin.reject.reason': 'Please enter rejection reason.',
    'admin.approve.confirm': 'Proposal approved and opened for voting.',
    'admin.reject.confirm': 'Are you sure you want to reject this proposal?',
    'admin.reject.success': 'Proposal rejected.',
    
    'time.just.now': 'Just now',
    'time.minutes.ago': 'min ago',
    'time.hours.ago': 'hours ago',
    'time.days.ago': 'days ago'
  },
  
  zh: {
    'app.name': 'CivicOne',
    'nav.proposals': '政策提案',
    'nav.voting': '投票中',
    'nav.progress': '进展情况',
    'nav.statistics': '统计',
    'nav.admin': '管理员',
    'nav.login': '登录',
    
    'hero.title': '居民制定政策，政府响应的平台',
    'hero.subtitle': '通过实名认证的负责任公共论坛提高行政信任度',
    'hero.cta': '提交政策提案',
    
    'stat.proposals': '总提案数',
    'stat.votes': '总投票数',
    'stat.users': '参与居民',
    'stat.adopted': '已采纳政策',
    
    'proposals.voting.title': '投票中的政策',
    'proposals.category.all': '全部类别',
    'proposals.category.transport': '交通',
    'proposals.category.safety': '安全',
    'proposals.category.culture': '文化',
    'proposals.category.welfare': '福利',
    'proposals.category.environment': '环境',
    'proposals.status.voting': '投票中',
    'proposals.status.pending': '审核中',
    'proposals.status.approved': '已批准',
    'proposals.status.adopted': '已采纳',
    'proposals.status.completed': '已完成',
    'proposals.status.rejected': '已驳回',
    'proposals.load.more': '加载更多',
    'proposals.empty': '没有政策提案。',
    'proposals.views': '次查看',
    'proposals.participants': '人参与',
    'proposals.agree': '赞成',
    
    'detail.vote.status': '投票状态',
    'detail.vote.yes': '赞成',
    'detail.vote.no': '反对',
    'detail.vote.yes.free': '赞成（免费）',
    'detail.vote.no.free': '反对（免费）',
    'detail.vote.paid.notice': '付费投票（₩1,000）将反映在政策优先级中',
    'detail.problem': '问题定义',
    'detail.situation': '当前状况',
    'detail.solution': '解决方案',
    'detail.budget': '预计预算',
    'detail.effect': '预期效果',
    'detail.feedback': '管理员反馈',
    'detail.comments': '讨论',
    'detail.comment.input': '请留下建设性意见...',
    'detail.comment.paid': '付费评论（₩1,000）- 优先显示',
    'detail.comment.submit': '提交',
    'detail.comment.blocked': '⚠️ 等待管理员审核',
    'detail.author': '作者',
    'detail.trust.score': '信任分数',
    
    'footer.title': '居民政策参与平台 CivicOne',
    'footer.tagline': '实名认证 · 付费制 · 透明执行',
    'footer.terms': '使用条款',
    'footer.privacy': '隐私政策',
    'footer.support': '客服中心',
    
    'notification.login.required': '需要登录。',
    'notification.vote.success': '投票成功！',
    'notification.vote.duplicate': '您已经投过票了。',
    'notification.comment.success': '评论已发布！',
    'notification.comment.blocked': '检测到不当内容，将在管理员审核后发布。',
    'notification.comment.required': '请输入评论内容。',
    'notification.error.load': '加载数据失败。',
    
    'admin.title': 'CivicOne 管理员',
    'admin.user': '管理员',
    'admin.home': '返回主页',
    'admin.stat.pending': '待审核',
    'admin.stat.voting': '投票进行中',
    'admin.stat.adopted': '待采纳',
    'admin.stat.users': '总参与居民',
    'admin.tab.pending': '待审核',
    'admin.tab.voting': '投票中',
    'admin.tab.adopted': '已采纳政策',
    'admin.tab.all': '全部提案',
    'admin.empty': '没有提案。',
    'admin.review': '审核',
    'admin.view': '查看详情',
    'admin.feedback': '输入审核意见...',
    'admin.approve': '批准（开放投票）',
    'admin.reject': '驳回',
    'admin.feedback.required': '请输入审核意见。',
    'admin.reject.reason': '请输入驳回理由。',
    'admin.approve.confirm': '提案已批准并开放投票。',
    'admin.reject.confirm': '确定要驳回此提案吗？',
    'admin.reject.success': '提案已驳回。',
    
    'time.just.now': '刚刚',
    'time.minutes.ago': '分钟前',
    'time.hours.ago': '小时前',
    'time.days.ago': '天前'
  },
  
  ja: {
    'app.name': 'CivicOne',
    'nav.proposals': '政策提案',
    'nav.voting': '投票中',
    'nav.progress': '進捗状況',
    'nav.statistics': '統計',
    'nav.admin': '管理者',
    'nav.login': 'ログイン',
    
    'hero.title': '住民が作る政策、自治体が応える プラットフォーム',
    'hero.subtitle': '実名認証による責任ある公論場で行政の信頼度を高めます',
    'hero.cta': '政策を提案する',
    
    'stat.proposals': '総提案数',
    'stat.votes': '総投票数',
    'stat.users': '参加住民',
    'stat.adopted': '採択された政策',
    
    'proposals.voting.title': '投票中の政策',
    'proposals.category.all': '全カテゴリー',
    'proposals.category.transport': '交通',
    'proposals.category.safety': '安全',
    'proposals.category.culture': '文化',
    'proposals.category.welfare': '福祉',
    'proposals.category.environment': '環境',
    'proposals.status.voting': '投票中',
    'proposals.status.pending': '審査中',
    'proposals.status.approved': '承認済み',
    'proposals.status.adopted': '採択済み',
    'proposals.status.completed': '完了',
    'proposals.status.rejected': '却下',
    'proposals.load.more': 'さらに読み込む',
    'proposals.empty': '提案がありません。',
    'proposals.views': '回閲覧',
    'proposals.participants': '人参加',
    'proposals.agree': '賛成',
    
    'detail.vote.status': '投票状況',
    'detail.vote.yes': '賛成',
    'detail.vote.no': '反対',
    'detail.vote.yes.free': '賛成（無料）',
    'detail.vote.no.free': '反対（無料）',
    'detail.vote.paid.notice': '有料投票（₩1,000）は政策の優先順位に反映されます',
    'detail.problem': '問題定義',
    'detail.situation': '現状',
    'detail.solution': '解決策',
    'detail.budget': '予想予算',
    'detail.effect': '期待効果',
    'detail.feedback': '管理者フィードバック',
    'detail.comments': '討論',
    'detail.comment.input': '建設的なご意見をお願いします...',
    'detail.comment.paid': '有料コメント（₩1,000）- 上段優先表示',
    'detail.comment.submit': '登録',
    'detail.comment.blocked': '⚠️ 管理者審査待ち',
    'detail.author': '作成者',
    'detail.trust.score': '信頼スコア',
    
    'footer.title': '住民政策参加プラットフォーム CivicOne',
    'footer.tagline': '実名認証 · 有料制 · 透明な政策執行',
    'footer.terms': '利用規約',
    'footer.privacy': '個人情報保護方針',
    'footer.support': 'カスタマーセンター',
    
    'notification.login.required': 'ログインが必要です。',
    'notification.vote.success': '投票が完了しました！',
    'notification.vote.duplicate': 'すでに投票されています。',
    'notification.comment.success': 'コメントが登録されました！',
    'notification.comment.blocked': '不適切な内容が検出され、管理者審査後に掲載されます。',
    'notification.comment.required': 'コメント内容を入力してください。',
    'notification.error.load': 'データの読み込みに失敗しました。',
    
    'admin.title': 'CivicOne 管理者',
    'admin.user': '管理者',
    'admin.home': 'ホームへ',
    'admin.stat.pending': '審査待ち',
    'admin.stat.voting': '投票進行中',
    'admin.stat.adopted': '採択予定',
    'admin.stat.users': '総参加住民',
    'admin.tab.pending': '審査待ち',
    'admin.tab.voting': '投票中',
    'admin.tab.adopted': '採択された政策',
    'admin.tab.all': '全提案',
    'admin.empty': '提案がありません。',
    'admin.review': '審査する',
    'admin.view': '詳細表示',
    'admin.feedback': '審査意見を入力...',
    'admin.approve': '承認（投票開始）',
    'admin.reject': '却下',
    'admin.feedback.required': '審査意見を入力してください。',
    'admin.reject.reason': '却下理由を入力してください。',
    'admin.approve.confirm': '提案が承認され、投票が開始されました。',
    'admin.reject.confirm': '本当にこの提案を却下しますか？',
    'admin.reject.success': '提案が却下されました。',
    
    'time.just.now': 'たった今',
    'time.minutes.ago': '分前',
    'time.hours.ago': '時間前',
    'time.days.ago': '日前'
  },
  
  vi: {
    'app.name': 'CivicOne',
    'nav.proposals': 'Đề xuất',
    'nav.voting': 'Đang bỏ phiếu',
    'nav.progress': 'Tiến độ',
    'nav.statistics': 'Thống kê',
    'nav.admin': 'Quản trị',
    'nav.login': 'Đăng nhập',
    
    'hero.title': 'Nền tảng chính sách do cư dân tạo ra, chính quyền phản hồi',
    'hero.subtitle': 'Nâng cao độ tin cậy hành chính thông qua diễn đàn công khai có xác thực danh tính',
    'hero.cta': 'Gửi đề xuất chính sách',
    
    'stat.proposals': 'Tổng số đề xuất',
    'stat.votes': 'Tổng số phiếu',
    'stat.users': 'Cư dân tham gia',
    'stat.adopted': 'Chính sách được thông qua',
    
    'proposals.voting.title': 'Chính sách đang bỏ phiếu',
    'proposals.category.all': 'Tất cả danh mục',
    'proposals.category.transport': 'Giao thông',
    'proposals.category.safety': 'An toàn',
    'proposals.category.culture': 'Văn hóa',
    'proposals.category.welfare': 'Phúc lợi',
    'proposals.category.environment': 'Môi trường',
    'proposals.status.voting': 'Đang bỏ phiếu',
    'proposals.status.pending': 'Đang xem xét',
    'proposals.status.approved': 'Đã phê duyệt',
    'proposals.status.adopted': 'Đã thông qua',
    'proposals.status.completed': 'Hoàn thành',
    'proposals.status.rejected': 'Bị từ chối',
    'proposals.load.more': 'Xem thêm',
    'proposals.empty': 'Không có đề xuất nào.',
    'proposals.views': 'lượt xem',
    'proposals.participants': 'người tham gia',
    'proposals.agree': 'Đồng ý',
    
    'detail.vote.status': 'Tình trạng bỏ phiếu',
    'detail.vote.yes': 'Đồng ý',
    'detail.vote.no': 'Không đồng ý',
    'detail.vote.yes.free': 'Đồng ý (Miễn phí)',
    'detail.vote.no.free': 'Không đồng ý (Miễn phí)',
    'detail.vote.paid.notice': 'Phiếu bầu trả phí (₩1,000) được tính vào độ ưu tiên chính sách',
    'detail.problem': 'Định nghĩa vấn đề',
    'detail.situation': 'Tình hình hiện tại',
    'detail.solution': 'Giải pháp đề xuất',
    'detail.budget': 'Ngân sách dự kiến',
    'detail.effect': 'Hiệu quả mong đợi',
    'detail.feedback': 'Phản hồi từ quản trị viên',
    'detail.comments': 'Thảo luận',
    'detail.comment.input': 'Chia sẻ ý kiến mang tính xây dựng...',
    'detail.comment.paid': 'Bình luận trả phí (₩1,000) - Ưu tiên hiển thị',
    'detail.comment.submit': 'Gửi',
    'detail.comment.blocked': '⚠️ Đang chờ quản trị viên xem xét',
    'detail.author': 'Tác giả',
    'detail.trust.score': 'Điểm tin cậy',
    
    'footer.title': 'Nền tảng chính sách cư dân CivicOne',
    'footer.tagline': 'Xác thực danh tính · Hệ thống trả phí · Thực hiện minh bạch',
    'footer.terms': 'Điều khoản dịch vụ',
    'footer.privacy': 'Chính sách bảo mật',
    'footer.support': 'Hỗ trợ',
    
    'notification.login.required': 'Yêu cầu đăng nhập.',
    'notification.vote.success': 'Bỏ phiếu thành công!',
    'notification.vote.duplicate': 'Bạn đã bỏ phiếu rồi.',
    'notification.comment.success': 'Bình luận đã được đăng!',
    'notification.comment.blocked': 'Nội dung không phù hợp được phát hiện, sẽ được đăng sau khi quản trị viên xem xét.',
    'notification.comment.required': 'Vui lòng nhập nội dung bình luận.',
    'notification.error.load': 'Tải dữ liệu thất bại.',
    
    'admin.title': 'Quản trị viên CivicOne',
    'admin.user': 'Quản trị viên',
    'admin.home': 'Về trang chủ',
    'admin.stat.pending': 'Đang chờ xem xét',
    'admin.stat.voting': 'Đang bỏ phiếu',
    'admin.stat.adopted': 'Sắp thông qua',
    'admin.stat.users': 'Tổng số người dùng',
    'admin.tab.pending': 'Đang chờ xem xét',
    'admin.tab.voting': 'Đang bỏ phiếu',
    'admin.tab.adopted': 'Chính sách đã thông qua',
    'admin.tab.all': 'Tất cả đề xuất',
    'admin.empty': 'Không có đề xuất nào.',
    'admin.review': 'Xem xét',
    'admin.view': 'Xem chi tiết',
    'admin.feedback': 'Nhập ý kiến xem xét...',
    'admin.approve': 'Phê duyệt (Mở bỏ phiếu)',
    'admin.reject': 'Từ chối',
    'admin.feedback.required': 'Vui lòng nhập ý kiến xem xét.',
    'admin.reject.reason': 'Vui lòng nhập lý do từ chối.',
    'admin.approve.confirm': 'Đề xuất đã được phê duyệt và mở để bỏ phiếu.',
    'admin.reject.confirm': 'Bạn có chắc chắn muốn từ chối đề xuất này?',
    'admin.reject.success': 'Đề xuất đã bị từ chối.',
    
    'time.just.now': 'Vừa xong',
    'time.minutes.ago': 'phút trước',
    'time.hours.ago': 'giờ trước',
    'time.days.ago': 'ngày trước'
  },
  
  mn: {
    'app.name': 'CivicOne',
    'nav.proposals': 'Саналууд',
    'nav.voting': 'Санал өгч байна',
    'nav.progress': 'Явц',
    'nav.statistics': 'Статистик',
    'nav.admin': 'Админ',
    'nav.login': 'Нэвтрэх',
    
    'hero.title': 'Иргэдийн бодлого, засгийн газрын хариулт',
    'hero.subtitle': 'Баталгаажсан нэрээр хариуцлагатай оролцооны тавцан',
    'hero.cta': 'Санал өгөх',
    
    'stat.proposals': 'Нийт санал',
    'stat.votes': 'Нийт санал өгсөн',
    'stat.users': 'Оролцогчид',
    'stat.adopted': 'Баталсан бодлого',
    
    'proposals.voting.title': 'Санал хураалт явагдаж байгаа бодлогууд',
    'proposals.category.all': 'Бүх ангилал',
    'proposals.category.transport': 'Тээвэр',
    'proposals.category.safety': 'Аюулгүй байдал',
    'proposals.category.culture': 'Соёл',
    'proposals.category.welfare': 'Нийгмийн халамж',
    'proposals.category.environment': 'Байгаль орчин',
    'proposals.status.voting': 'Санал өгч байна',
    'proposals.status.pending': 'Хянаж байна',
    'proposals.status.approved': 'Зөвшөөрсөн',
    'proposals.status.adopted': 'Батлагдсан',
    'proposals.status.completed': 'Дууссан',
    'proposals.status.rejected': 'Татгалзсан',
    'proposals.load.more': 'Цааш үзэх',
    'proposals.empty': 'Санал байхгүй байна.',
    'proposals.views': 'үзсэн',
    'proposals.participants': 'оролцогч',
    'proposals.agree': 'Зөвшөөрөх',
    
    'detail.vote.status': 'Санал өгөлтийн байдал',
    'detail.vote.yes': 'Зөвшөөрөх',
    'detail.vote.no': 'Татгалзах',
    'detail.vote.yes.free': 'Зөвшөөрөх (Үнэгүй)',
    'detail.vote.no.free': 'Татгалзах (Үнэгүй)',
    'detail.vote.paid.notice': 'Төлбөртэй санал (₩1,000) нь бодлогын тэргүүлэх ач холбогдолд нөлөөлнө',
    'detail.problem': 'Асуудлын тодорхойлолт',
    'detail.situation': 'Одоогийн байдал',
    'detail.solution': 'Санал болгож буй шийдэл',
    'detail.budget': 'Тооцоолсон төсөв',
    'detail.effect': 'Хүлээгдэж буй үр дүн',
    'detail.feedback': 'Админы санал',
    'detail.comments': 'Хэлэлцүүлэг',
    'detail.comment.input': 'Бүтээлч санал хуваалцана уу...',
    'detail.comment.paid': 'Төлбөртэй сэтгэгдэл (₩1,000) - Эхэнд харуулна',
    'detail.comment.submit': 'Илгээх',
    'detail.comment.blocked': '⚠️ Админы хянаж байна',
    'detail.author': 'Зохиогч',
    'detail.trust.score': 'Итгэлийн оноо',
    
    'footer.title': 'Иргэдийн бодлогын оролцооны тавцан CivicOne',
    'footer.tagline': 'Баталгаат нэр · Төлбөртэй систем · Ил тод биелэлт',
    'footer.terms': 'Үйлчилгээний нөхцөл',
    'footer.privacy': 'Нууцлалын бодлого',
    'footer.support': 'Тусламж',
    
    'notification.login.required': 'Нэвтрэх шаардлагатай.',
    'notification.vote.success': 'Санал амжилттай өгөгдлөө!',
    'notification.vote.duplicate': 'Та аль хэдийн санал өгсөн байна.',
    'notification.comment.success': 'Сэтгэгдэл нийтлэгдлээ!',
    'notification.comment.blocked': 'Зохисгүй агуулга илэрсэн тул админы хянасны дараа нийтлэгдэнэ.',
    'notification.comment.required': 'Сэтгэгдэл оруулна уу.',
    'notification.error.load': 'Өгөгдөл ачаалж чадсангүй.',
    
    'admin.title': 'CivicOne Админ',
    'admin.user': 'Админ',
    'admin.home': 'Нүүр хуудас',
    'admin.stat.pending': 'Хянахаар хүлээгдэж байна',
    'admin.stat.voting': 'Санал өгч байна',
    'admin.stat.adopted': 'Батлагдах гэж байна',
    'admin.stat.users': 'Нийт хэрэглэгчид',
    'admin.tab.pending': 'Хянахаар хүлээгдэж байна',
    'admin.tab.voting': 'Санал өгч байна',
    'admin.tab.adopted': 'Батлагдсан бодлого',
    'admin.tab.all': 'Бүх санал',
    'admin.empty': 'Санал байхгүй байна.',
    'admin.review': 'Хянах',
    'admin.view': 'Дэлгэрэнгүй',
    'admin.feedback': 'Хяналтын санал оруулах...',
    'admin.approve': 'Зөвшөөрөх (Санал өгөлт нээх)',
    'admin.reject': 'Татгалзах',
    'admin.feedback.required': 'Хяналтын санал оруулна уу.',
    'admin.reject.reason': 'Татгалзах шалтгаан оруулна уу.',
    'admin.approve.confirm': 'Санал зөвшөөрөгдөж, санал өгөлт нээгдлээ.',
    'admin.reject.confirm': 'Энэ саналыг татгалзахдаа итгэлтэй байна уу?',
    'admin.reject.success': 'Санал татгалзагдлаа.',
    
    'time.just.now': 'Дөнгөж сая',
    'time.minutes.ago': 'минутын өмнө',
    'time.hours.ago': 'цагийн өмнө',
    'time.days.ago': 'өдрийн өмнө'
  },
  
  ru: {
    'app.name': 'CivicOne',
    'nav.proposals': 'Предложения',
    'nav.voting': 'Голосование',
    'nav.progress': 'Прогресс',
    'nav.statistics': 'Статистика',
    'nav.admin': 'Админ',
    'nav.login': 'Войти',
    
    'hero.title': 'Политика, созданная гражданами, ответ правительства',
    'hero.subtitle': 'Повышение доверия к администрации через ответственное участие с подтвержденной личностью',
    'hero.cta': 'Подать предложение',
    
    'stat.proposals': 'Всего предложений',
    'stat.votes': 'Всего голосов',
    'stat.users': 'Участников',
    'stat.adopted': 'Принятых политик',
    
    'proposals.voting.title': 'Политики на голосовании',
    'proposals.category.all': 'Все категории',
    'proposals.category.transport': 'Транспорт',
    'proposals.category.safety': 'Безопасность',
    'proposals.category.culture': 'Культура',
    'proposals.category.welfare': 'Социальное обеспечение',
    'proposals.category.environment': 'Экология',
    'proposals.status.voting': 'Голосование',
    'proposals.status.pending': 'На рассмотрении',
    'proposals.status.approved': 'Одобрено',
    'proposals.status.adopted': 'Принято',
    'proposals.status.completed': 'Завершено',
    'proposals.status.rejected': 'Отклонено',
    'proposals.load.more': 'Загрузить еще',
    'proposals.empty': 'Предложений не найдено.',
    'proposals.views': 'просмотров',
    'proposals.participants': 'участников',
    'proposals.agree': 'За',
    
    'detail.vote.status': 'Статус голосования',
    'detail.vote.yes': 'За',
    'detail.vote.no': 'Против',
    'detail.vote.yes.free': 'За (Бесплатно)',
    'detail.vote.no.free': 'Против (Бесплатно)',
    'detail.vote.paid.notice': 'Платные голоса (₩1,000) учитываются в приоритизации политики',
    'detail.problem': 'Определение проблемы',
    'detail.situation': 'Текущая ситуация',
    'detail.solution': 'Предлагаемое решение',
    'detail.budget': 'Ориентировочный бюджет',
    'detail.effect': 'Ожидаемый эффект',
    'detail.feedback': 'Отзыв администратора',
    'detail.comments': 'Обсуждение',
    'detail.comment.input': 'Поделитесь конструктивным мнением...',
    'detail.comment.paid': 'Платный комментарий (₩1,000) - Приоритетный показ',
    'detail.comment.submit': 'Отправить',
    'detail.comment.blocked': '⚠️ Ожидает проверки администратора',
    'detail.author': 'Автор',
    'detail.trust.score': 'Рейтинг доверия',
    
    'footer.title': 'Платформа гражданской политики CivicOne',
    'footer.tagline': 'Подтвержденная личность · Платная система · Прозрачное исполнение',
    'footer.terms': 'Условия использования',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.support': 'Поддержка',
    
    'notification.login.required': 'Требуется вход в систему.',
    'notification.vote.success': 'Голос успешно отправлен!',
    'notification.vote.duplicate': 'Вы уже проголосовали.',
    'notification.comment.success': 'Комментарий успешно опубликован!',
    'notification.comment.blocked': 'Обнаружен неприемлемый контент, будет опубликован после проверки.',
    'notification.comment.required': 'Пожалуйста, введите комментарий.',
    'notification.error.load': 'Не удалось загрузить данные.',
    
    'admin.title': 'Администратор CivicOne',
    'admin.user': 'Администратор',
    'admin.home': 'На главную',
    'admin.stat.pending': 'Ожидает рассмотрения',
    'admin.stat.voting': 'На голосовании',
    'admin.stat.adopted': 'К принятию',
    'admin.stat.users': 'Всего пользователей',
    'admin.tab.pending': 'Ожидает рассмотрения',
    'admin.tab.voting': 'На голосовании',
    'admin.tab.adopted': 'Принятые политики',
    'admin.tab.all': 'Все предложения',
    'admin.empty': 'Предложений не найдено.',
    'admin.review': 'Рассмотреть',
    'admin.view': 'Подробнее',
    'admin.feedback': 'Введите отзыв...',
    'admin.approve': 'Одобрить (Открыть голосование)',
    'admin.reject': 'Отклонить',
    'admin.feedback.required': 'Пожалуйста, введите отзыв.',
    'admin.reject.reason': 'Пожалуйста, укажите причину отклонения.',
    'admin.approve.confirm': 'Предложение одобрено и открыто для голосования.',
    'admin.reject.confirm': 'Вы уверены, что хотите отклонить это предложение?',
    'admin.reject.success': 'Предложение отклонено.',
    
    'time.just.now': 'Только что',
    'time.minutes.ago': 'мин. назад',
    'time.hours.ago': 'ч. назад',
    'time.days.ago': 'дн. назад'
  }
}

// 현재 언어 (기본값: 한국어)
let currentLanguage = localStorage.getItem('language') || 'ko'

// 번역 함수
function t(key) {
  return translations[currentLanguage]?.[key] || translations['ko'][key] || key
}

// 언어 변경 함수
function changeLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang
    localStorage.setItem('language', lang)
    updatePageLanguage()
  }
}

// 페이지 언어 업데이트
function updatePageLanguage() {
  // data-i18n 속성이 있는 모든 요소 업데이트
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n')
    element.textContent = t(key)
  })
  
  // data-i18n-placeholder 속성이 있는 입력 요소 업데이트
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder')
    element.placeholder = t(key)
  })
}

// 언어 선택기 생성
function createLanguageSelector() {
  const languages = {
    'ko': '한국어',
    'en': 'English',
    'zh': '中文',
    'ja': '日本語',
    'vi': 'Tiếng Việt',
    'mn': 'Монгол',
    'ru': 'Русский'
  }
  
  const selector = document.createElement('select')
  selector.id = 'languageSelector'
  selector.className = 'border rounded-lg px-3 py-2 bg-white text-gray-700'
  
  Object.entries(languages).forEach(([code, name]) => {
    const option = document.createElement('option')
    option.value = code
    option.textContent = name
    option.selected = code === currentLanguage
    selector.appendChild(option)
  })
  
  selector.addEventListener('change', (e) => {
    changeLanguage(e.target.value)
  })
  
  return selector
}

// 언어 선택기를 네비게이션에 추가
document.addEventListener('DOMContentLoaded', () => {
  // 언어 선택기 추가
  const nav = document.querySelector('nav .container .flex')
  if (nav) {
    const languageContainer = document.createElement('div')
    languageContainer.className = 'flex items-center'
    languageContainer.appendChild(createLanguageSelector())
    
    // 로그인 버튼 앞에 추가
    const loginBtn = document.getElementById('loginBtn')
    if (loginBtn) {
      loginBtn.parentNode.insertBefore(languageContainer, loginBtn)
    }
  }
  
  // 초기 언어 적용
  updatePageLanguage()
})
