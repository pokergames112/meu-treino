/**
 * FitTracker - Aplicativo de Treino (Treinos A & B)
 * Dados importados diretamente da Planilha Google Sheets
 */

// Dados padrão extraídos da planilha
const DEFAULT_WORKOUT_DATA = {
  workoutA: [
    {
      id: "a-1",
      name: "Cadeira extensora",
      sets: 3,
      reps: "15",
      weight: 57.0,
      rest: 50,
      notes: "",
      completedSets: [false, false, false]
    },
    {
      id: "a-2",
      name: "Cadeira abdutora",
      sets: 3,
      reps: "15",
      weight: 63.0,
      rest: 50,
      notes: "",
      completedSets: [false, false, false]
    },
    {
      id: "a-3",
      name: "Mesa flexora",
      sets: 3,
      reps: "15",
      weight: 43.0,
      rest: 50,
      notes: "",
      completedSets: [false, false, false]
    },
    {
      id: "a-4",
      name: "Supino inclinado articulado",
      sets: 3,
      reps: "15",
      weight: 18.0,
      rest: 50,
      notes: "Exercício de peito",
      completedSets: [false, false, false]
    },
    {
      id: "a-5",
      name: "Elevação lateral",
      sets: 3,
      reps: "12",
      weight: 0.0,
      rest: 50,
      notes: "",
      completedSets: [false, false, false]
    },
    {
      id: "a-6",
      name: "Desenvolvimento com halteres neutro",
      sets: 3,
      reps: "12",
      weight: 3.0,
      rest: 50,
      notes: "",
      completedSets: [false, false, false]
    },
    {
      id: "a-7",
      name: "Abdominal canivete",
      sets: 3,
      reps: "15",
      weight: 0.0,
      rest: 50,
      notes: "",
      completedSets: [false, false, false]
    },
    {
      id: "a-8",
      name: "Bíceps com haltere alternado",
      sets: 3,
      reps: "12",
      weight: 8.0,
      rest: 50,
      notes: "Adicionado do Treino B",
      completedSets: [false, false, false]
    }
  ],
  workoutB: [
    {
      id: "b-1",
      name: "Agachamento sumô",
      sets: 3,
      reps: "15",
      weight: 16.0,
      rest: 50,
      notes: "",
      completedSets: [false, false, false]
    },
    {
      id: "b-2",
      name: "Remada articulada cabo neutra",
      sets: 3,
      reps: "12",
      weight: 36.0,
      rest: 50,
      notes: "",
      completedSets: [false, false, false]
    },
    {
      id: "b-3",
      name: "Bíceps na máquina",
      sets: 3,
      reps: "12",
      weight: 29.0,
      rest: 50,
      notes: "",
      completedSets: [false, false, false]
    },
    {
      id: "b-4",
      name: "Tríceps banco",
      sets: 3,
      reps: "15",
      weight: 50.0,
      rest: 50,
      notes: "",
      completedSets: [false, false, false]
    },
    {
      id: "b-5",
      name: "Caminhada na esteira",
      sets: 1,
      reps: "15-20 min",
      weight: 0.0,
      rest: 0,
      notes: "Cardio",
      completedSets: [false]
    },
    {
      id: "b-6",
      name: "Supino inclinado articulado",
      sets: 3,
      reps: "15",
      weight: 18.0,
      rest: 50,
      notes: "Adicionado do Treino A",
      completedSets: [false, false, false]
    },
    {
      id: "b-7",
      name: "Leg Pés",
      sets: 3,
      reps: "15",
      weight: 110.0,
      rest: 50,
      notes: "",
      completedSets: [false, false, false]
    },
    {
      id: "b-8",
      name: "Panturrilha Máquina",
      sets: 3,
      reps: "15",
      weight: 80.0,
      rest: 50,
      notes: "",
      completedSets: [false, false, false]
    },
    {
      id: "b-9",
      name: "Supino vertical",
      sets: 3,
      reps: "15",
      weight: 36.0,
      rest: 50,
      notes: "",
      completedSets: [false, false, false]
    }
  ]
};

// Estado da Aplicação
const AppState = {
  currentWorkout: 'A', // 'A' ou 'B'
  data: null,
  settings: {
    sound: true,
    vibrate: true
  },
  timer: {
    intervalId: null,
    totalSeconds: 50,
    remainingSeconds: 50,
    isRunning: false,
    exerciseName: ''
  }
};

// Web Audio API para som de bip ao terminar descanso
let audioCtx = null;
function playBeepSound() {
  if (!AppState.settings.sound) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    // Toca sequência dupla de bipes esportivos
    const playTone = (freq, startTime, duration) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = audioCtx.currentTime;
    playTone(880, now, 0.15); // La5
    playTone(1174.66, now + 0.18, 0.25); // Re6
    playTone(1760, now + 0.45, 0.4); // La6
  } catch (e) {
    console.warn("Áudio não pôde ser reproduzido:", e);
  }
}

function triggerVibration() {
  if (!AppState.settings.vibrate) return;
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200, 100, 300]);
  }
}

// Inicialização e LocalStorage
function loadData() {
  const saved = localStorage.getItem('fitTrackerData');
  if (saved) {
    try {
      AppState.data = JSON.parse(saved);
      // Garantir integridade dos arrays de séries
      ['workoutA', 'workoutB'].forEach(wKey => {
        if (!AppState.data[wKey]) AppState.data[wKey] = [];
        AppState.data[wKey].forEach(ex => {
          if (!Array.isArray(ex.completedSets) || ex.completedSets.length !== ex.sets) {
            ex.completedSets = new Array(ex.sets).fill(false);
          }
        });
      });
    } catch (e) {
      console.error('Erro ao ler localStorage, restaurando padrão:', e);
      AppState.data = JSON.parse(JSON.stringify(DEFAULT_WORKOUT_DATA));
    }
  } else {
    AppState.data = JSON.parse(JSON.stringify(DEFAULT_WORKOUT_DATA));
    saveData();
  }

  const savedSettings = localStorage.getItem('fitTrackerSettings');
  if (savedSettings) {
    try {
      AppState.settings = JSON.parse(savedSettings);
    } catch (e) {}
  }
}

function saveData() {
  localStorage.setItem('fitTrackerData', JSON.stringify(AppState.data));
  localStorage.setItem('fitTrackerSettings', JSON.stringify(AppState.settings));
}

// Elementos DOM
const elements = {
  tabA: document.getElementById('tab-workout-a'),
  tabB: document.getElementById('tab-workout-b'),
  countA: document.getElementById('count-workout-a'),
  countB: document.getElementById('count-workout-b'),
  progressPercent: document.getElementById('progress-percent'),
  progressFill: document.getElementById('progress-fill'),
  exercisesList: document.getElementById('exercises-list'),
  btnAddExercise: document.getElementById('btn-add-exercise'),
  btnResetDay: document.getElementById('btn-reset-day'),
  btnOpenSettings: document.getElementById('btn-open-settings'),
  workoutDate: document.getElementById('workout-date'),
  
  // Timer Bar
  timerBar: document.getElementById('rest-timer-bar'),
  timerDisplay: document.getElementById('timer-display'),
  timerCircleFill: document.getElementById('timer-circle-fill'),
  timerExerciseName: document.getElementById('timer-exercise-name'),
  btnTimerPlus: document.getElementById('btn-timer-plus'),
  btnTimerPause: document.getElementById('btn-timer-pause'),
  btnTimerStop: document.getElementById('btn-timer-stop'),
  timerPauseIcon: document.getElementById('timer-pause-icon'),

  // Modal Exercício
  modalExercise: document.getElementById('exercise-modal'),
  formExercise: document.getElementById('exercise-form'),
  modalTitle: document.getElementById('modal-title'),
  btnCloseModal: document.getElementById('btn-close-modal'),
  btnCancelModal: document.getElementById('btn-cancel-modal'),
  btnDeleteExercise: document.getElementById('btn-delete-exercise'),
  formId: document.getElementById('form-exercise-id'),
  formName: document.getElementById('form-name'),
  formWorkout: document.getElementById('form-workout'),
  formWeight: document.getElementById('form-weight'),
  formSets: document.getElementById('form-sets'),
  formReps: document.getElementById('form-reps'),
  formRest: document.getElementById('form-rest'),
  formNotes: document.getElementById('form-notes'),

  // Modal Configurações
  modalSettings: document.getElementById('settings-modal'),
  btnCloseSettings: document.getElementById('btn-close-settings'),
  settingSound: document.getElementById('setting-sound'),
  settingVibrate: document.getElementById('setting-vibrate'),
  btnResetDefault: document.getElementById('btn-reset-default'),
  btnExportData: document.getElementById('btn-export-data'),
  fileImportData: document.getElementById('file-import-data')
};

// Renderização
function render() {
  const currentList = AppState.currentWorkout === 'A' ? AppState.data.workoutA : AppState.data.workoutB;
  
  // Atualizar Contadores das Abas
  elements.countA.textContent = `${AppState.data.workoutA.length} exercícios`;
  elements.countB.textContent = `${AppState.data.workoutB.length} exercícios`;

  // Atualizar Abas Ativas
  if (AppState.currentWorkout === 'A') {
    elements.tabA.classList.add('active');
    elements.tabB.classList.remove('active');
  } else {
    elements.tabB.classList.add('active');
    elements.tabA.classList.remove('active');
  }

  // Calcular Progresso
  let totalSets = 0;
  let completedSets = 0;
  currentList.forEach(ex => {
    totalSets += ex.sets;
    completedSets += (ex.completedSets || []).filter(Boolean).length;
  });

  const percent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  elements.progressPercent.textContent = `${percent}%`;
  elements.progressFill.style.width = `${percent}%`;

  // Renderizar Lista de Exercícios
  elements.exercisesList.innerHTML = '';

  if (currentList.length === 0) {
    elements.exercisesList.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <i class="fa-solid fa-dumbbell" style="font-size: 2.5rem; margin-bottom: 12px; opacity: 0.5;"></i>
        <p style="font-weight: 600;">Nenhum exercício cadastrado no Treino ${AppState.currentWorkout}.</p>
        <p style="font-size: 0.8rem; margin-top: 4px;">Clique no botão abaixo para adicionar!</p>
      </div>
    `;
    return;
  }

  currentList.forEach((ex, index) => {
    const isCompleted = ex.completedSets && ex.completedSets.every(Boolean) && ex.completedSets.length === ex.sets;
    const card = document.createElement('div');
    card.className = `exercise-card ${isCompleted ? 'completed' : ''}`;
    card.dataset.id = ex.id;

    // Gerar botões de séries
    let setsHtml = '';
    for (let i = 0; i < ex.sets; i++) {
      const isDone = ex.completedSets && ex.completedSets[i];
      setsHtml += `
        <button class="set-bubble ${isDone ? 'done' : ''}" data-set-index="${i}" title="Marcar Série ${i + 1}">
          <span class="set-number">S${i + 1}</span>
          <i class="fa-solid ${isDone ? 'fa-circle-check' : 'fa-circle'} set-check-icon"></i>
        </button>
      `;
    }

    card.innerHTML = `
      <div class="card-header">
        <div class="exercise-title-group">
          <span class="exercise-index">Exercício ${index + 1}</span>
          <h3 class="exercise-name">${escapeHtml(ex.name)}</h3>
          ${ex.notes ? `<div class="exercise-notes"><i class="fa-regular fa-note-sticky"></i> ${escapeHtml(ex.notes)}</div>` : ''}
        </div>
        <div class="card-quick-actions">
          <button class="btn-mini btn-edit" title="Editar Exercício"><i class="fa-solid fa-pen"></i></button>
        </div>
      </div>

      <div class="exercise-meta-row">
        <div class="meta-item">
          <span class="meta-label">Carga</span>
          <div class="weight-stepper">
            <button class="weight-btn btn-minus" title="Diminuir peso">-</button>
            <span class="meta-val">${ex.weight} <span class="meta-unit">kg</span></span>
            <button class="weight-btn btn-plus" title="Aumentar peso">+</button>
          </div>
        </div>

        <div class="meta-item">
          <span class="meta-label">Reps / Série</span>
          <span class="meta-val">${ex.sets}x <span class="meta-unit">${escapeHtml(ex.reps || '-')}</span></span>
        </div>

        <div class="meta-item">
          <span class="meta-label">Descanso</span>
          <span class="meta-val">${ex.rest > 0 ? ex.rest + 's' : '-'}</span>
        </div>
      </div>

      <div class="sets-tracker">
        ${setsHtml}
      </div>
    `;

    // Eventos do Card
    // Botão Editar
    card.querySelector('.btn-edit').addEventListener('click', () => openEditModal(ex));

    // Ajustes Rápidos de Peso (+ / -)
    card.querySelector('.btn-minus').addEventListener('click', (e) => {
      e.stopPropagation();
      adjustWeight(ex.id, -1);
    });
    card.querySelector('.btn-plus').addEventListener('click', (e) => {
      e.stopPropagation();
      adjustWeight(ex.id, 1);
    });

    // Clique nas Séries
    const setBubbles = card.querySelectorAll('.set-bubble');
    setBubbles.forEach(btn => {
      btn.addEventListener('click', () => {
        const setIdx = parseInt(btn.dataset.setIndex, 10);
        toggleSet(ex.id, setIdx);
      });
    });

    elements.exercisesList.appendChild(card);
  });
}

// Lógica de Modificação de Exercícios
function adjustWeight(exerciseId, delta) {
  const currentList = AppState.currentWorkout === 'A' ? AppState.data.workoutA : AppState.data.workoutB;
  const ex = currentList.find(item => item.id === exerciseId);
  if (ex) {
    ex.weight = Math.max(0, Math.round((ex.weight + delta) * 10) / 10);
    saveData();
    render();
  }
}

function toggleSet(exerciseId, setIndex) {
  const currentList = AppState.currentWorkout === 'A' ? AppState.data.workoutA : AppState.data.workoutB;
  const ex = currentList.find(item => item.id === exerciseId);
  if (!ex) return;

  if (!ex.completedSets) {
    ex.completedSets = new Array(ex.sets).fill(false);
  }

  const willBeDone = !ex.completedSets[setIndex];
  ex.completedSets[setIndex] = willBeDone;
  saveData();
  render();

  // Se a série acabou de ser marcada como concluída e tem descanso configurado, dispara o timer
  if (willBeDone && ex.rest > 0) {
    startRestTimer(ex.rest, `${ex.name} (Série ${setIndex + 1})`);
  }
}

// Lógica do Cronômetro de Descanso
function startRestTimer(seconds, exerciseName = '') {
  clearInterval(AppState.timer.intervalId);

  AppState.timer.totalSeconds = seconds;
  AppState.timer.remainingSeconds = seconds;
  AppState.timer.isRunning = true;
  AppState.timer.exerciseName = exerciseName;

  updateTimerUI();
  elements.timerBar.classList.add('show');

  AppState.timer.intervalId = setInterval(() => {
    if (!AppState.timer.isRunning) return;

    AppState.timer.remainingSeconds--;
    updateTimerUI();

    if (AppState.timer.remainingSeconds <= 0) {
      clearInterval(AppState.timer.intervalId);
      AppState.timer.isRunning = false;
      playBeepSound();
      triggerVibration();
      setTimeout(() => {
        elements.timerBar.classList.remove('show');
      }, 2500);
    }
  }, 1000);
}

function updateTimerUI() {
  const { remainingSeconds, totalSeconds, isRunning, exerciseName } = AppState.timer;
  
  elements.timerDisplay.textContent = `${remainingSeconds}s`;
  elements.timerExerciseName.textContent = exerciseName || 'Próxima série';

  // Atualizar anel circular
  const percent = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;
  elements.timerCircleFill.setAttribute('stroke-dasharray', `${percent}, 100`);

  // Ícone de pause/play
  elements.timerPauseIcon.className = isRunning ? 'fa-solid fa-pause' : 'fa-solid fa-play';
}

function toggleTimerPause() {
  AppState.timer.isRunning = !AppState.timer.isRunning;
  updateTimerUI();
}

function addTimerTime(secondsToAdd = 10) {
  AppState.timer.remainingSeconds += secondsToAdd;
  AppState.timer.totalSeconds = Math.max(AppState.timer.totalSeconds, AppState.timer.remainingSeconds);
  updateTimerUI();
}

function stopTimer() {
  clearInterval(AppState.timer.intervalId);
  AppState.timer.isRunning = false;
  elements.timerBar.classList.remove('show');
}

// Modais de Criação e Edição
function openAddModal() {
  elements.modalTitle.textContent = `Novo Exercício (Treino ${AppState.currentWorkout})`;
  elements.formId.value = '';
  elements.formName.value = '';
  elements.formWorkout.value = AppState.currentWorkout;
  elements.formWeight.value = '0';
  elements.formSets.value = '3';
  elements.formReps.value = '15';
  elements.formRest.value = '50';
  elements.formNotes.value = '';
  elements.btnDeleteExercise.style.display = 'none';

  updatePresetButtons(50);
  elements.modalExercise.classList.add('active');
}

function openEditModal(exercise) {
  elements.modalTitle.textContent = 'Editar Exercício';
  elements.formId.value = exercise.id;
  elements.formName.value = exercise.name;
  elements.formWorkout.value = AppState.currentWorkout;
  elements.formWeight.value = exercise.weight;
  elements.formSets.value = exercise.sets;
  elements.formReps.value = exercise.reps || '';
  elements.formRest.value = exercise.rest;
  elements.formNotes.value = exercise.notes || '';
  elements.btnDeleteExercise.style.display = 'inline-flex';

  updatePresetButtons(exercise.rest);
  elements.modalExercise.classList.add('active');
}

function closeExerciseModal() {
  elements.modalExercise.classList.remove('active');
}

function handleSaveExercise(e) {
  e.preventDefault();
  const id = elements.formId.value;
  const targetWorkout = elements.formWorkout.value; // 'A' ou 'B'
  const setsCount = parseInt(elements.formSets.value, 10) || 3;

  const exerciseData = {
    id: id || `ex-${Date.now()}`,
    name: elements.formName.value.trim(),
    sets: setsCount,
    reps: elements.formReps.value.trim(),
    weight: parseFloat(elements.formWeight.value) || 0,
    rest: parseInt(elements.formRest.value, 10) || 0,
    notes: elements.formNotes.value.trim(),
    completedSets: new Array(setsCount).fill(false)
  };

  const targetListKey = targetWorkout === 'A' ? 'workoutA' : 'workoutB';

  if (id) {
    // Edição: se mudou de treino (A -> B ou B -> A), remove do antigo e joga no novo
    ['workoutA', 'workoutB'].forEach(k => {
      AppState.data[k] = AppState.data[k].filter(item => item.id !== id);
    });
    AppState.data[targetListKey].push(exerciseData);
  } else {
    // Criação: adiciona no final
    AppState.data[targetListKey].push(exerciseData);
  }

  saveData();
  closeExerciseModal();
  render();
}

function handleDeleteExercise() {
  const id = elements.formId.value;
  if (!id) return;
  if (confirm('Tem certeza que deseja excluir este exercício?')) {
    ['workoutA', 'workoutB'].forEach(k => {
      AppState.data[k] = AppState.data[k].filter(item => item.id !== id);
    });
    saveData();
    closeExerciseModal();
    render();
  }
}

function updatePresetButtons(activeSeconds) {
  document.querySelectorAll('.btn-preset').forEach(btn => {
    if (parseInt(btn.dataset.sec, 10) === parseInt(activeSeconds, 10)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Configurações e Backup
function resetTodayWorkout() {
  if (confirm(`Deseja reiniciar todas as séries do Treino ${AppState.currentWorkout}?`)) {
    const currentList = AppState.currentWorkout === 'A' ? AppState.data.workoutA : AppState.data.workoutB;
    currentList.forEach(ex => {
      ex.completedSets = new Array(ex.sets).fill(false);
    });
    saveData();
    render();
  }
}

function resetToDefault() {
  if (confirm('Atenção: Isso restaurará todos os exercícios e pesos para a planilha original do Google Sheets. Deseja continuar?')) {
    AppState.data = JSON.parse(JSON.stringify(DEFAULT_WORKOUT_DATA));
    saveData();
    elements.modalSettings.classList.remove('active');
    render();
  }
}

function exportData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState.data, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `treino_backup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const imported = JSON.parse(event.target.result);
      if (imported.workoutA && imported.workoutB) {
        AppState.data = imported;
        saveData();
        elements.modalSettings.classList.remove('active');
        render();
        alert('Treinos importados com sucesso!');
      } else {
        alert('Formato de arquivo inválido.');
      }
    } catch (err) {
      alert('Erro ao processar arquivo JSON.');
    }
  };
  reader.readAsText(file);
}

// Helpers
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function updateDateHeader() {
  const options = { weekday: 'long', day: 'numeric', month: 'short' };
  const today = new Date().toLocaleDateString('pt-BR', options);
  elements.workoutDate.textContent = today;
}

// Event Listeners Globais
function initEventListeners() {
  // Troca de Treino A/B
  elements.tabA.addEventListener('click', () => {
    AppState.currentWorkout = 'A';
    render();
  });
  elements.tabB.addEventListener('click', () => {
    AppState.currentWorkout = 'B';
    render();
  });

  // Botões do Header
  elements.btnResetDay.addEventListener('click', resetTodayWorkout);
  elements.btnOpenSettings.addEventListener('click', () => elements.modalSettings.classList.add('active'));
  elements.btnCloseSettings.addEventListener('click', () => elements.modalSettings.classList.remove('active'));

  // Timer Bar
  elements.btnTimerPause.addEventListener('click', toggleTimerPause);
  elements.btnTimerPlus.addEventListener('click', () => addTimerTime(10));
  elements.btnTimerStop.addEventListener('click', stopTimer);

  // Modal Exercício
  elements.btnAddExercise.addEventListener('click', openAddModal);
  elements.btnCloseModal.addEventListener('click', closeExerciseModal);
  elements.btnCancelModal.addEventListener('click', closeExerciseModal);
  elements.formExercise.addEventListener('submit', handleSaveExercise);
  elements.btnDeleteExercise.addEventListener('click', handleDeleteExercise);

  // Preset de descanso
  document.querySelectorAll('.btn-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      elements.formRest.value = btn.dataset.sec;
      updatePresetButtons(btn.dataset.sec);
    });
  });

  // Configurações
  elements.settingSound.addEventListener('change', (e) => {
    AppState.settings.sound = e.target.checked;
    saveData();
  });
  elements.settingVibrate.addEventListener('change', (e) => {
    AppState.settings.vibrate = e.target.checked;
    saveData();
  });
  elements.btnResetDefault.addEventListener('click', resetToDefault);
  elements.btnExportData.addEventListener('click', exportData);
  elements.fileImportData.addEventListener('change', importData);

  // Fechar modais ao clicar no backdrop
  [elements.modalExercise, elements.modalSettings].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  updateDateHeader();
  initEventListeners();
  render();
});
