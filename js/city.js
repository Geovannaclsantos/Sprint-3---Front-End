/* ========================================
   Care City — Lógica de Gamificação
   Front-End Sprint 3
   ======================================== */

// ===== Dados das áreas (config) =====
const AREAS = {
  usina: {
    name: 'Usina de Energia',
    icon: '⚡',
    color: '#f59e0b',
    desc: 'Sono, descanso e disposição diária',
    tip: 'Durma 7h+ para gerar mais energia à cidade!',
    category: 'Sono'
  },
  hospital: {
    name: 'Hospital Preventivo',
    icon: '🏥',
    color: '#ef4444',
    desc: 'Check-ups, consultas, exames e vacinas',
    tip: 'Agende um check-up para fortalecer o hospital!',
    category: 'Check-up'
  },
  rios: {
    name: 'Rios da Hidratação',
    icon: '💧',
    color: '#3b82f6',
    desc: 'Ingestão de água e hidratação corporal',
    tip: 'Beba 2L de água hoje para os rios fluírem!',
    category: 'Hidratação'
  },
  dados: {
    name: 'Centro de Dados Vital',
    icon: '📊',
    color: '#06b6d4',
    desc: 'Dados de wearables e sensores de saúde',
    tip: 'Registre batimentos e sintomas para o centro crescer!',
    category: 'Dados Vital'
  },
  parque: {
    name: 'Parque do Equilíbrio',
    icon: '🌿',
    color: '#10b981',
    desc: 'Saúde mental, pausas e bem-estar emocional',
    tip: 'Medite 5 min ou registre seu humor para o parque florescer!',
    category: 'Saúde Mental'
  },
  avenidas: {
    name: 'Avenidas Ativas',
    icon: '🏃',
    color: '#8b5cf6',
    desc: 'Movimento, caminhada e atividade física',
    tip: 'Caminhe 20 min para ativar as avenidas!',
    category: 'Movimento'
  }
}

// ===== Persistência =====
const STORAGE_KEY = 'careCity_missions'

function loadMissions() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try { return JSON.parse(raw) } catch(e) { /* fall through */ }
  }
  return null
}

function saveMissions(missions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(missions))
}

// ===== Cálculos =====
function calcAreaProgress(missions, areaId) {
  const ms = missions.filter(m => m.area === areaId)
  if (!ms.length) return 0
  const done = ms.filter(m => m.completed).length
  return Math.round((done / ms.length) * 100)
}

function calcCityProgress(missions) {
  const progresses = Object.keys(AREAS).map(id => calcAreaProgress(missions, id))
  const avg = progresses.reduce((s, p) => s + p, 0) / progresses.length
  return Math.round(avg)
}

function calcTotalPoints(missions) {
  return missions.filter(m => m.completed).reduce((s, m) => s + m.points, 0)
}

function getCityStage(pct) {
  if (pct <= 25)  return { label: 'Cidade em Construção', icon: '🏗️' }
  if (pct <= 50)  return { label: 'Cidade em Evolução', icon: '🌆' }
  if (pct <= 80)  return { label: 'Cidade Saudável', icon: '🌇' }
                  return { label: 'Cidade Protegida', icon: '✨' }
}

function getAreaStatus(progress) {
  if (progress >= 70) return { label: 'Protegido', className: 'area-status-protegido' }
  if (progress >= 35) return { label: 'Estável', className: 'area-status-estavel' }
  return { label: 'Em atenção', className: 'area-status-atencao' }
}

// ===== Estado global =====
let MISSIONS = []
let SELECTED = null

// ===== Render =====
function renderCityHeader() {
  const cityPct = calcCityProgress(MISSIONS)
  const stage = getCityStage(cityPct)
  const points = calcTotalPoints(MISSIONS)
  const done = MISSIONS.filter(m => m.completed).length

  document.getElementById('city-stage-icon').textContent = stage.icon
  document.getElementById('city-stage-label').textContent = stage.label
  document.getElementById('city-progress-pct').textContent = cityPct + '%'
  document.getElementById('city-points').textContent = points
  document.getElementById('city-missions').textContent = done + '/' + MISSIONS.length
  document.getElementById('city-progress-bar').style.width = cityPct + '%'
}

function renderMapSVG() {
  Object.keys(AREAS).forEach(id => {
    const pct = calcAreaProgress(MISSIONS, id)
    const pctEl = document.getElementById('pct-' + id)
    if (pctEl) pctEl.textContent = pct + '%'

    // Camadas que aparecem conforme progresso
    document.querySelectorAll('[data-show-from]').forEach(el => {
      const area = el.getAttribute('data-area')
      const threshold = parseInt(el.getAttribute('data-show-from'), 10)
      if (area === id) {
        el.style.display = pct >= threshold ? '' : 'none'
      }
    })
  })
}

function renderAreaList() {
  const list = document.getElementById('area-list')
  list.innerHTML = ''
  Object.keys(AREAS).forEach(id => {
    const a = AREAS[id]
    const pct = calcAreaProgress(MISSIONS, id)
    const isActive = SELECTED === id

    const btn = document.createElement('button')
    btn.className = 'area-list-item' + (isActive ? ' active' : '')
    btn.onclick = () => selectArea(id)
    btn.innerHTML = `
      <span style="font-size:1.05rem;">${a.icon}</span>
      <span style="font-size:0.82rem; color:var(--text-main); flex-shrink:0; min-width:90px; font-weight:500;">${a.name.split(' ')[0]}</span>
      <span class="area-mini-bar"><span style="width:${pct}%;background:${a.color};"></span></span>
      <span class="area-pct" style="color:${a.color}">${pct}%</span>
    `
    list.appendChild(btn)
  })
}

function renderDetailCard() {
  const card = document.getElementById('detail-card')
  if (!SELECTED) {
    card.classList.remove('highlighted')
    card.innerHTML = `
      <div class="city-detail-empty">
        <div class="city-img" role="img" aria-label="Ilustração da Care City"></div>
        <div class="city-img-text">Passe o mouse ou clique<br>em uma área da cidade</div>
      </div>
    `
    return
  }
  const a = AREAS[SELECTED]
  const pct = calcAreaProgress(MISSIONS, SELECTED)
  const status = getAreaStatus(pct)
  const completedCount = MISSIONS.filter(m => m.area === SELECTED && m.completed).length
  const totalCount = MISSIONS.filter(m => m.area === SELECTED).length

  card.classList.add('highlighted')
  card.innerHTML = `
    <div style="display:flex; align-items:center; gap:0.8rem; margin-bottom:0.6rem;">
      <div style="width:48px; height:48px; border-radius:var(--radius-sm); background:${a.color}22; display:flex; align-items:center; justify-content:center; font-size:1.7rem;">
        ${a.icon}
      </div>
      <div>
        <div style="font-family:'Sora',sans-serif; font-weight:700; font-size:0.98rem; color:var(--text-main); line-height:1.2;">${a.name}</div>
        <span class="area-status-badge ${status.className}" style="margin-top:0.25rem;">${status.label}</span>
      </div>
    </div>
    <p style="color:var(--text-muted); font-size:0.8rem; margin:0 0 0.75rem; line-height:1.45;">${a.desc}</p>
    <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--text-muted); margin-bottom:0.3rem;">
      <span>Progresso da área</span>
      <span style="font-weight:700; color:${a.color}">${pct}%</span>
    </div>
    <div class="progress-cp" style="height:7px;">
      <div class="progress-cp-bar" style="width:${pct}%; background:${a.color};"></div>
    </div>
    <div style="font-size:0.74rem; color:var(--text-light); margin-top:0.4rem;">
      ${completedCount} de ${totalCount} missões dessa área concluídas
    </div>
    <div class="city-tip">💡 ${a.tip}</div>
    <button class="btn-cp-accent" style="width:100%; margin-top:0.85rem; font-size:0.85rem; padding:0.6rem;"
            onclick="completeNextInArea('${SELECTED}')">
      Concluir missão dessa área
    </button>
  `
}

function renderAll() {
  renderCityHeader()
  renderMapSVG()
  renderAreaList()
  renderDetailCard()
}

// ===== Interações =====
function selectArea(id) {
  SELECTED = id
  // Dim outras áreas no mapa
  document.querySelectorAll('.city-area').forEach(el => {
    el.classList.toggle('dim', el.id !== 'area-' + id)
  })
  // Highlight ring no SVG
  document.querySelectorAll('.city-highlight').forEach(el => {
    el.style.display = el.getAttribute('data-area') === id ? '' : 'none'
  })
  renderAreaList()
  renderDetailCard()
}

function clearSelection() {
  SELECTED = null
  document.querySelectorAll('.city-area').forEach(el => el.classList.remove('dim'))
  document.querySelectorAll('.city-highlight').forEach(el => el.style.display = 'none')
  renderAreaList()
  renderDetailCard()
}

function completeNextInArea(areaId) {
  const next = MISSIONS.find(m => m.area === areaId && !m.completed)
  if (!next) {
    showToast('🎉 Área completa!', AREAS[areaId].name + ' está no máximo!')
    return
  }
  next.completed = true
  saveMissions(MISSIONS)
  renderAll()
  showToast('+' + next.points + ' pts ganhos!', next.title)
}

function resetCity() {
  if (!confirm('Tem certeza que deseja reiniciar o progresso da Care City?')) return
  MISSIONS = MISSIONS.map(m => ({ ...m, completed: false }))
  saveMissions(MISSIONS)
  clearSelection()
  renderAll()
  showToast('🔄 Cidade reiniciada', 'Comece sua jornada novamente!')
}

function showToast(title, msg) {
  const existing = document.querySelector('.cp-toast')
  if (existing) existing.remove()

  const toast = document.createElement('div')
  toast.className = 'cp-toast'
  toast.innerHTML = `
    <div class="cp-toast-icon">✓</div>
    <div>
      <div class="cp-toast-title">${title}</div>
      <div class="cp-toast-msg">${msg}</div>
    </div>
  `
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 3200)
}

// ===== Inicialização =====
async function initCity() {
  const stored = loadMissions()
  if (stored && stored.length) {
    MISSIONS = stored
  } else {
    // Carrega API local (JSON)
    try {
      const res = await fetch('data/missions.json')
      MISSIONS = await res.json()
    } catch (e) {
      console.error('Erro ao carregar missions.json:', e)
      MISSIONS = []
    }
  }

  // Hover handlers nas áreas SVG
  document.querySelectorAll('.city-area').forEach(el => {
    const id = el.id.replace('area-', '')
    el.addEventListener('mouseenter', () => {
      if (SELECTED !== id) {
        SELECTED = id
        document.querySelectorAll('.city-highlight').forEach(h => {
          h.style.display = h.getAttribute('data-area') === id ? '' : 'none'
        })
        renderAreaList()
        renderDetailCard()
      }
    })
    el.addEventListener('click', () => selectArea(id))
  })

  renderAll()
}

document.addEventListener('DOMContentLoaded', initCity)
