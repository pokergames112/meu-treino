// Script de mapeamento e busca de GIFs de exercícios
const exercises = [
  { key: "cadeira_extensora", pt: "Cadeira extensora", en: "Leg Extensions" },
  { key: "cadeira_abdutora", pt: "Cadeira abdutora", en: "Thigh Abductor" },
  { key: "mesa_flexora", pt: "Mesa flexora", en: "Lying Leg Curls" },
  { key: "supino_inclinado", pt: "Supino inclinado articulado", en: "Lever Incline Chest Press" },
  { key: "elevacao_lateral", pt: "Elevação lateral", en: "Side Lateral Raise" },
  { key: "desenvolvimento_halteres", pt: "Desenvolvimento com halteres neutro", en: "Dumbbell Shoulder Press" },
  { key: "abdominal_canivete", pt: "Abdominal canivete", en: "Jackknife Sit-Up" },
  { key: "biceps_haltere", pt: "Bíceps com haltere alternado", en: "Alternate Incline Dumbbell Curl" },
  { key: "agachamento_sumo", pt: "Agachamento sumô", en: "Dumbbell Sumo Squat" },
  { key: "remada_articulada", pt: "Remada articulada cabo neutra", en: "Seated Cable Rows" },
  { key: "biceps_maquina", pt: "Bíceps na máquina", en: "Machine Bicep Curl" },
  { key: "triceps_banco", pt: "Tríceps banco", en: "Bench Dips" },
  { key: "caminhada_esteira", pt: "Caminhada na esteira", en: "Treadmill Walking" },
  { key: "leg_pes", pt: "Leg Pés", en: "Leg Press" },
  { key: "panturrilha_maquina", pt: "Panturrilha Máquina", en: "Standing Calf Raises" },
  { key: "supino_vertical", pt: "Supino vertical", en: "Chest Press Machine" }
];

console.log("Mapeamento preparado:", exercises.length);
