// Script para encontrar o exercício exato e o GIF correspondente
async function mapExercises() {
  const url = 'https://raw.githubusercontent.com/Devillmy/exercises-dataset-zh/main/data/exercises.json';
  const res = await fetch(url);
  const data = await res.json();

  const myExercises = [
    // Treino A
    { name: "Cadeira extensora", search: "lever leg extension", fallback: "leg extension" },
    { name: "Cadeira abdutora", search: "lever seated hip abduction", fallback: "hip abductor" },
    { name: "Mesa flexora", search: "lever lying leg curl", fallback: "lying leg curl" },
    { name: "Supino inclinado articulado", search: "lever incline chest press", fallback: "incline chest press" },
    { name: "Elevação lateral", search: "dumbbell lateral raise", fallback: "lateral raise" },
    { name: "Desenvolvimento com halteres neutro", search: "dumbbell shoulder press", fallback: "shoulder press" },
    { name: "Abdominal canivete", search: "jackknife", fallback: "tuck crunch" },
    { name: "Bíceps com haltere alternado", search: "dumbbell alternate bicep curl", fallback: "bicep curl" },

    // Treino B
    { name: "Agachamento sumô", search: "sumo squat", fallback: "squat" },
    { name: "Remada articulada cabo neutra", search: "cable seated row", fallback: "seated row" },
    { name: "Bíceps na máquina", search: "lever preacher curl", fallback: "bicep curl" },
    { name: "Tríceps banco", search: "bench dip", fallback: "triceps dip" },
    { name: "Caminhada na esteira", search: "treadmill", fallback: "walking" },
    { name: "Leg Pés", search: "sled 45° leg press", fallback: "leg press" },
    { name: "Panturrilha Máquina", search: "lever standing calf raise", fallback: "calf raise" },
    { name: "Supino vertical", search: "lever chest press", fallback: "chest press" }
  ];

  console.log("=== Mapeamento de Exercícios ===");
  const results = {};

  for (const item of myExercises) {
    let match = data.find(d => d.name && d.name.toLowerCase().includes(item.search));
    if (!match && item.fallback) {
      match = data.find(d => d.name && d.name.toLowerCase().includes(item.fallback));
    }

    if (match) {
      const gifUrl = `https://cdn.jsdelivr.net/gh/Devillmy/exercises-dataset-zh@main/${match.gif_url}`;
      const imgUrl = `https://cdn.jsdelivr.net/gh/Devillmy/exercises-dataset-zh@main/${match.image}`;
      results[item.name] = {
        matchedName: match.name,
        target: match.target,
        bodyPart: match.body_part,
        gif: gifUrl,
        image: imgUrl
      };
      console.log(`✓ [${item.name}] -> "${match.name}" | Target: ${match.target} | GIF: ${match.gif_url}`);
    } else {
      console.log(`✗ [${item.name}] -> Não encontrado diretamente`);
    }
  }

  const fs = require('fs');
  fs.writeFileSync('scratch/matched_gifs.json', JSON.stringify(results, null, 2));
}

mapExercises().catch(console.error);
