# 🏙️ Care City — Care Plus

**Jornada Gamificada do Cuidado Contínuo**
FIAP · 1º Ano Engenharia de Software · Sprint 3 · **Front-End Design**

> A Care City transforma o cuidado preventivo em uma cidade digital interativa. Cada hábito saudável fortalece uma área da cidade — sono, hidratação, movimento, saúde mental, prevenção médica e dados vitais.

---

## 🚀 Como executar

Como o projeto usa `fetch()` para carregar JSON local, é necessário um servidor HTTP simples (não funciona abrindo o arquivo direto no navegador via `file://`):

### Opção 1 — Live Server (VS Code)
1. Abra a pasta no VS Code
2. Instale a extensão **Live Server**
3. Clique em "Go Live" no rodapé

### Opção 2 — Python (sem instalação extra)
```bash
python -m http.server 8000
```
Acesse: `http://localhost:8000`

### Opção 3 — Node.js
```bash
npx serve
```

---

## 📂 Estrutura do projeto

```
care-city-frontend/
├── index.html              # Landing page com hero + benefícios
├── care-city.html          # 🏙️ Mapa interativo da cidade (página principal)
├── missoes.html            # Lista de missões + filtros + formulário
├── vitais.html             # Dados de wearables/ESP32
├── css/
│   ├── style.css           # Estilos globais (variáveis, botões, badges)
│   └── care-city.css       # Estilos do mapa interativo
├── js/
│   └── city.js             # Lógica do mapa, gamificação e localStorage
├── data/
│   └── missions.json       # API local (missões em JSON)
├── INTEGRANTES.TXT
└── README.md
```

---

## ✨ Funcionalidades

### 🏙️ Mapa Interativo da Care City
- 6 áreas visuais ilustradas em SVG no estilo Monopoly
- Hover em cada área mostra detalhes no painel lateral
- Prédios evoluem visualmente conforme o progresso (painéis solares, ambulância, fonte do parque, antena de dados)
- Status colorido: Protegido / Estável / Em atenção

### 🎯 Sistema de Missões
- Lista filtrada por categoria (dropdown de filtros)
- Modal de feedback motivacional ao concluir
- Formulário de novo hábito com validação
- Persistência via `localStorage`

### 📊 Dados Vitais (Edge Computing)
- Cards de batimentos, sono, passos, hidratação, humor, saturação
- Alertas preventivos baseados em thresholds
- Integração conceitual com sensores IoT/ESP32

---

## 🏗️ Estágios da Cidade

| Estágio | Progresso |
|---|---|
| 🏗️ Cidade em Construção | 0–25% |
| 🌆 Cidade em Evolução | 26–50% |
| 🌇 Cidade Saudável | 51–80% |
| ✨ Cidade Protegida | 81–100% |

## 🗺️ As 6 áreas

| Área | Dimensão |
|---|---|
| ⚡ Usina de Energia | Sono e descanso |
| 🌿 Parque do Equilíbrio | Saúde mental |
| 💧 Rios da Hidratação | Ingestão de água |
| 🏃 Avenidas Ativas | Movimento físico |
| 🏥 Hospital Preventivo | Check-ups e vacinas |
| 📊 Centro de Dados Vital | Wearables e sensores |

---

## 🛠️ Tecnologias

- **HTML5** (semântica W3C)
- **CSS3** (variáveis customizadas, Flexbox, Grid)
- **Bootstrap 5.3** (grid responsivo)
- **Bootstrap Icons** (ícones)
- **SVG** (mapa ilustrado da cidade)
- **JavaScript Vanilla** (manipulação DOM, eventos, fetch)
- **localStorage** (persistência client-side)
- **Google Fonts** (Sora + Inter)

## ✅ Requisitos da Sprint 3 — Front-End Design

| Requisito | ✅ |
|---|---|
| Estrutura semântica W3C | ✓ |
| Interface responsiva (mobile/tablet/desktop) | ✓ |
| Bootstrap + CSS Grid + Flexbox | ✓ |
| Componentes reutilizáveis | ✓ |
| Consumo de JSON local | ✓ |
| Manipulação de eventos (click, submit, hover) | ✓ |
| Drop-down de filtros funcional | ✓ |
| Formulário com validação | ✓ |
| Modal de feedback | ✓ |
| localStorage para persistência | ✓ |
| Design moderno coerente com saúde | ✓ |
| 10 Heurísticas de Nielsen aplicadas | ✓ |

---

## 👥 Integrantes

| Nome | RM |
|---|---|
| Geovanna Caroline Lima Santos | 567754 |
| Helton Pacheco dos Santos | 567113 |
| Gustavo Firmino Barbosa | 566903 |

*Care Plus · FIAP 2026 · Sprint 3 · Front-End Design*
