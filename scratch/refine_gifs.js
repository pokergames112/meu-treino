// Refinamento de correspondência exata
async function refineGifs() {
  const url = 'https://raw.githubusercontent.com/Devillmy/exercises-dataset-zh/main/data/exercises.json';
  const res = await fetch(url);
  const data = await res.json();

  function findExact(keywords) {
    for (const kw of keywords) {
      const found = data.find(d => d.name && d.name.toLowerCase().includes(kw.toLowerCase()));
      if (found) return found;
    }
    return null;
  }

  const refined = {
    "Cadeira extensora": findExact(["lever leg extension", "leg extension"]),
    "Cadeira abdutora": findExact(["lever seated hip abduction", "hip abduction"]),
    "Mesa flexora": findExact(["lever lying leg curl", "lying leg curl"]),
    "Supino inclinado articulado": findExact(["lever incline chest press", "incline chest press"]),
    "Elevação lateral": findExact(["dumbbell lateral raise", "lateral raise"]),
    "Desenvolvimento com halteres neutro": findExact(["dumbbell shoulder press", "dumbbell seated shoulder press", "dumbbell standing overhead press"]),
    "Abdominal canivete": findExact(["jackknife sit-up", "tuck crunch", "seated in and out"]),
    "Bíceps com haltere alternado": findExact(["dumbbell alternate bicep curl", "dumbbell alternate hammer curl", "dumbbell bicep curl"]),
    "Agachamento sumô": findExact(["dumbbell sumo squat", "kettlebell sumo squat", "smith sumo squat"]),
    "Remada articulada cabo neutra": findExact(["cable seated row", "lever seated row", "cable seated high row"]),
    "Bíceps na máquina": findExact(["lever preacher curl", "lever bicep curl"]),
    "Tríceps banco": findExact(["bench dip (knees bent)", "bench dip on floor", "bench dip"]),
    "Caminhada na esteira": findExact(["walking on incline treadmill", "walking on treadmill"]),
    "Leg Pés": findExact(["sled 45° leg press (side pov)", "sled 45° leg press", "lever leg press"]),
    "Panturrilha Máquina": findExact(["lever standing calf raise", "lever seated calf raise", "standing calf raise"]),
    "Supino vertical": findExact(["lever chest press", "lever seated chest press"])
  };

  const finalMap = {};
  for (const [key, match] of Object.entries(refined)) {
    if (match) {
      const gifUrl = `https://cdn.jsdelivr.net/gh/Devillmy/exercises-dataset-zh@main/${match.gif_url}`;
      finalMap[key] = {
        name: match.name,
        target: match.target,
        bodyPart: match.body_part,
        gif: gifUrl,
        image: `https://cdn.jsdelivr.net/gh/Devillmy/exercises-dataset-zh@main/${match.image}`
      };
      console.log(`✓ [${key}] => "${match.name}" -> ${match.gif_url}`);
    } else {
      console.log(`✗ [${key}] => NOT FOUND`);
    }
  }

  const fs = require('fs');
  fs.writeFileSync('scratch/final_gifs.json', JSON.stringify(finalMap, null, 2));
}

refineGifs().catch(console.error);
