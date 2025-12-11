// API 기본 URL
const API_BASE = '/api'

// 전역 상태
let currentUser = null
let currentPage = 1
let currentCategory = ''
let currentStatus = 'voting'

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  // 언어 선택기 추가
  const navContainer = document.querySelector('nav .container .flex')
  if (navContainer && !document.getElementById('languageSelector')) {
    const languageSelectorContainer = document.createElement('div')
    languageSelectorContainer.id = 'languageSelector'
    languageSelectorContainer.appendChild(createLanguageSelector())
    
    const loginBtn = document.getElementById('loginBtn')
    if (loginBtn) {
      loginBtn.parentNode.insertBefore(languageSelectorContainer, loginBtn)
    }
  }
  
  initializeApp()
})

// 앱 초기화
async function initializeApp() {
  // 임시 사용자 설정 (실제 환경에서는 인증 시스템 사용)
  currentUser = { id: 1, nickname: '정책시민' }
  
  // 통계 로드
  await loadStatistics()
  
  // 정책 제안 목록 로드
  await loadProposals()
  
  // 이벤트 리스너 등록
  setupEventListeners()
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 카테고리 필터
  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    currentCategory = e.target.value
    currentPage = 1
    loadProposals()
  })
  
  // 상태 필터
  document.getElementById('statusFilter').addEventListener('change', (e) => {
    currentStatus = e.target.value
    currentPage = 1
    loadProposals()
  })
  
  // 더 보기 버튼
  document.getElementById('loadMoreBtn').addEventListener('click', () => {
    currentPage++
    loadProposals(true) // append mode
  })
}

// 통계 로드
async function loadStatistics() {
  try {
    const response = await axios.get(`${API_BASE}/statistics`)
    const stats = response.data
    
    document.getElementById('stat-proposals').textContent = stats.total_proposals
    document.getElementById('stat-votes').textContent = stats.total_votes
    document.getElementById('stat-users').textContent = stats.total_users
    
    // 채택된 정책 수 계산
    const adoptedCount = stats.proposals_by_status.find(s => s.status === 'adopted')?.count || 0
    document.getElementById('stat-adopted').textContent = adoptedCount
    
  } catch (error) {
    console.error('통계 로드 실패:', error)
  }
}

// 정책 제안 목록 로드
async function loadProposals(append = false) {
  try {
    const params = {
      page: currentPage,
      status: currentStatus
    }
    
    if (currentCategory) {
      params.category = currentCategory
    }
    
    const response = await axios.get(`${API_BASE}/proposals`, { params })
    const proposals = response.data.proposals
    
    const container = document.getElementById('proposals')
    
    if (!append) {
      container.innerHTML = ''
    }
    
    if (proposals.length === 0 && !append) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fas fa-inbox text-gray-300 text-6xl mb-4"></i>
          <p class="text-gray-500 text-lg" data-i18n="proposals.empty">등록된 정책 제안이 없습니다.</p>
        </div>
      `
      updatePageLanguage()
      return
    }
    
    proposals.forEach(proposal => {
      container.appendChild(createProposalCard(proposal))
    })
    
  } catch (error) {
    console.error('정책 제안 로드 실패:', error)
    showNotification('정책 제안을 불러오는데 실패했습니다.', 'error')
  }
}

// 정책 제안 카드 생성
function createProposalCard(proposal) {
  const card = document.createElement('div')
  card.className = 'bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 cursor-pointer'
  card.onclick = () => showProposalDetail(proposal.id)
  
  const categoryColors = {
    transport: 'bg-blue-100 text-blue-800',
    safety: 'bg-red-100 text-red-800',
    culture: 'bg-purple-100 text-purple-800',
    welfare: 'bg-green-100 text-green-800',
    environment: 'bg-emerald-100 text-emerald-800'
  }
  
  const categoryNames = {
    transport: t('proposals.category.transport'),
    safety: t('proposals.category.safety'),
    culture: t('proposals.category.culture'),
    welfare: t('proposals.category.welfare'),
    environment: t('proposals.category.environment')
  }
  
  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    approved: 'bg-blue-100 text-blue-800',
    voting: 'bg-green-100 text-green-800',
    adopted: 'bg-purple-100 text-purple-800',
    completed: 'bg-indigo-100 text-indigo-800'
  }
  
  const statusNames = {
    pending: t('proposals.status.pending'),
    approved: t('proposals.status.approved'),
    voting: t('proposals.status.voting'),
    adopted: t('proposals.status.adopted'),
    completed: t('proposals.status.completed')
  }
  
  const totalVotes = proposal.vote_count_yes + proposal.vote_count_no
  const yesPercentage = totalVotes > 0 ? Math.round((proposal.vote_count_yes / totalVotes) * 100) : 0
  
  card.innerHTML = `
    <div class="flex justify-between items-start mb-3">
      <div class="flex space-x-2">
        <span class="px-3 py-1 rounded-full text-sm font-semibold ${categoryColors[proposal.category] || 'bg-gray-100 text-gray-800'}">
          ${categoryNames[proposal.category] || proposal.category}
        </span>
        <span class="px-3 py-1 rounded-full text-sm font-semibold ${statusColors[proposal.status]}">
          ${statusNames[proposal.status]}
        </span>
      </div>
      <div class="flex items-center text-gray-500 text-sm">
        <i class="fas fa-eye mr-1"></i>
        ${proposal.view_count}
      </div>
    </div>
    
    <h4 class="text-xl font-bold text-gray-800 mb-2">${proposal.title}</h4>
    
    <p class="text-gray-600 mb-4 line-clamp-2">${proposal.problem_definition}</p>
    
    <div class="mb-4">
      <div class="flex justify-between text-sm mb-1">
        <span class="text-gray-600">${t('proposals.agree')} ${yesPercentage}%</span>
        <span class="text-gray-600">${totalVotes}${t('proposals.participants')}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="bg-green-500 h-2 rounded-full transition-all" style="width: ${yesPercentage}%"></div>
      </div>
    </div>
    
    <div class="flex justify-between items-center text-sm text-gray-500">
      <div class="flex items-center">
        <i class="fas fa-user-circle mr-2"></i>
        ${proposal.author_nickname}
      </div>
      <div class="flex items-center">
        <i class="fas fa-clock mr-2"></i>
        ${formatDate(proposal.created_at)}
      </div>
    </div>
  `
  
  return card
}

// 정책 제안 상세 모달 표시
async function showProposalDetail(proposalId) {
  try {
    const response = await axios.get(`${API_BASE}/proposals/${proposalId}`)
    const { proposal, comments } = response.data
    
    // 모달 생성
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto'
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove()
    }
    
    const totalVotes = proposal.vote_count_yes + proposal.vote_count_no
    const yesPercentage = totalVotes > 0 ? Math.round((proposal.vote_count_yes / totalVotes) * 100) : 0
    
    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h3 class="text-2xl font-bold text-gray-800">${proposal.title}</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-2xl"></i>
          </button>
        </div>
        
        <div class="p-6">
          <!-- 기본 정보 -->
          <div class="mb-6">
            <div class="flex items-center space-x-2 mb-4">
              <span class="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                ${proposal.category}
              </span>
              <span class="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                ${proposal.status}
              </span>
            </div>
            <div class="flex justify-between text-sm text-gray-600">
              <span><i class="fas fa-user mr-2"></i>${proposal.author_nickname} (신뢰지수: ${proposal.author_trust_score})</span>
              <span><i class="fas fa-clock mr-2"></i>${formatDate(proposal.created_at)}</span>
            </div>
          </div>
          
          <!-- 투표 현황 -->
          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 class="font-bold text-lg mb-4">투표 현황</h4>
            <div class="flex justify-between mb-2">
              <span class="text-green-600 font-bold">찬성: ${proposal.vote_count_yes}명</span>
              <span class="text-red-600 font-bold">반대: ${proposal.vote_count_no}명</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div class="bg-green-500 h-3 rounded-full" style="width: ${yesPercentage}%"></div>
            </div>
            ${proposal.status === 'voting' ? `
              <div class="grid grid-cols-2 gap-4">
                <button onclick="vote(${proposal.id}, 'yes', false)" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
                  <i class="fas fa-thumbs-up mr-2"></i>찬성 (무료)
                </button>
                <button onclick="vote(${proposal.id}, 'no', false)" class="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition">
                  <i class="fas fa-thumbs-down mr-2"></i>반대 (무료)
                </button>
              </div>
              <div class="text-center mt-2 text-sm text-gray-600">
                유료 투표(1,000원)는 정책 우선순위에 반영됩니다
              </div>
            ` : ''}
          </div>
          
          <!-- 제안 내용 -->
          <div class="space-y-6">
            <div>
              <h4 class="font-bold text-lg mb-2 flex items-center">
                <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>문제 정의
              </h4>
              <p class="text-gray-700">${proposal.problem_definition}</p>
            </div>
            
            <div>
              <h4 class="font-bold text-lg mb-2 flex items-center">
                <i class="fas fa-chart-line text-orange-500 mr-2"></i>현재 상황
              </h4>
              <p class="text-gray-700">${proposal.current_situation}</p>
            </div>
            
            <div>
              <h4 class="font-bold text-lg mb-2 flex items-center">
                <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>해결 방안
              </h4>
              <p class="text-gray-700">${proposal.solution}</p>
            </div>
            
            ${proposal.estimated_budget ? `
              <div>
                <h4 class="font-bold text-lg mb-2 flex items-center">
                  <i class="fas fa-won-sign text-green-500 mr-2"></i>예상 예산
                </h4>
                <p class="text-gray-700">${proposal.estimated_budget}</p>
              </div>
            ` : ''}
            
            ${proposal.expected_effect ? `
              <div>
                <h4 class="font-bold text-lg mb-2 flex items-center">
                  <i class="fas fa-star text-purple-500 mr-2"></i>기대 효과
                </h4>
                <p class="text-gray-700">${proposal.expected_effect}</p>
              </div>
            ` : ''}
            
            ${proposal.admin_feedback ? `
              <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h4 class="font-bold text-lg mb-2 flex items-center">
                  <i class="fas fa-comment-dots text-blue-500 mr-2"></i>관리자 피드백
                </h4>
                <p class="text-gray-700">${proposal.admin_feedback}</p>
              </div>
            ` : ''}
          </div>
          
          <!-- 댓글 섹션 -->
          <div class="mt-8 border-t pt-6">
            <h4 class="font-bold text-xl mb-4">
              <i class="fas fa-comments mr-2"></i>토론 (${comments.length})
            </h4>
            
            <!-- 댓글 작성 -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <textarea id="commentInput-${proposal.id}" class="w-full border rounded-lg p-3 mb-2" rows="3" placeholder="건설적인 의견을 남겨주세요..."></textarea>
              <div class="flex justify-between items-center">
                <label class="flex items-center text-sm text-gray-600">
                  <input type="checkbox" id="paidComment-${proposal.id}" class="mr-2">
                  유료 댓글 (1,000원) - 상단 노출 우선
                </label>
                <button onclick="submitComment(${proposal.id})" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  등록
                </button>
              </div>
            </div>
            
            <!-- 댓글 목록 -->
            <div id="comments-${proposal.id}" class="space-y-4">
              ${comments.map(comment => `
                <div class="bg-white border rounded-lg p-4 ${comment.is_blocked ? 'opacity-50' : ''}">
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center">
                      <i class="fas fa-user-circle text-gray-400 text-2xl mr-2"></i>
                      <div>
                        <span class="font-semibold">${comment.author_nickname}</span>
                        ${comment.is_paid ? '<span class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">유료</span>' : ''}
                      </div>
                    </div>
                    <span class="text-sm text-gray-500">${formatDate(comment.created_at)}</span>
                  </div>
                  <p class="text-gray-700 ml-10">${comment.content}</p>
                  ${comment.is_blocked ? '<p class="text-red-500 text-sm ml-10 mt-2">⚠️ 관리자 검토 대기 중</p>' : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
  } catch (error) {
    console.error('정책 상세 로드 실패:', error)
    showNotification('정책 상세 정보를 불러오는데 실패했습니다.', 'error')
  }
}

// 투표하기
async function vote(proposalId, voteType, isPaid) {
  if (!currentUser) {
    showNotification('로그인이 필요합니다.', 'error')
    return
  }
  
  try {
    const response = await axios.post(`${API_BASE}/votes`, {
      proposal_id: proposalId,
      user_id: currentUser.id,
      vote_type: voteType,
      is_paid: isPaid ? 1 : 0,
      payment_amount: isPaid ? 1000 : 0,
      reason: ''
    })
    
    showNotification('투표가 완료되었습니다!', 'success')
    
    // 모달 닫고 목록 새로고침
    const modal = document.querySelector('.fixed')
    if (modal) modal.remove()
    
    await loadProposals()
    
  } catch (error) {
    console.error('투표 실패:', error)
    const message = error.response?.data?.error || '투표에 실패했습니다.'
    showNotification(message, 'error')
  }
}

// 댓글 등록
async function submitComment(proposalId) {
  if (!currentUser) {
    showNotification('로그인이 필요합니다.', 'error')
    return
  }
  
  const content = document.getElementById(`commentInput-${proposalId}`).value.trim()
  const isPaid = document.getElementById(`paidComment-${proposalId}`).checked
  
  if (!content) {
    showNotification('댓글 내용을 입력해주세요.', 'error')
    return
  }
  
  try {
    const response = await axios.post(`${API_BASE}/comments`, {
      proposal_id: proposalId,
      user_id: currentUser.id,
      content: content,
      is_paid: isPaid ? 1 : 0,
      payment_amount: isPaid ? 1000 : 0
    })
    
    if (response.data.warning) {
      showNotification(response.data.warning, 'warning')
    } else {
      showNotification('댓글이 등록되었습니다!', 'success')
    }
    
    // 모달 닫고 다시 열기 (댓글 새로고침)
    const modal = document.querySelector('.fixed')
    if (modal) modal.remove()
    
    await showProposalDetail(proposalId)
    
  } catch (error) {
    console.error('댓글 등록 실패:', error)
    showNotification('댓글 등록에 실패했습니다.', 'error')
  }
}

// 날짜 포맷팅
function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return '방금 전'
  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 7) return `${diffDays}일 전`
  
  return date.toLocaleDateString('ko-KR')
}

// 알림 표시
function showNotification(message, type = 'info') {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }
  
  const notification = document.createElement('div')
  notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity`
  notification.textContent = message
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.style.opacity = '0'
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}
