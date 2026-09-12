// Baixar uma amostra do exercises.json e verificar URLs das imagens/gifs
async function check() {
  const url = 'https://raw.githubusercontent.com/Devillmy/exercises-dataset-zh/main/data/exercises.json';
  const res = await fetch(url);
  const data = await res.json();
  console.log('Total de exercícios na base:', data.length);
  console.log('Exemplo de item 0:', JSON.stringify(data[0], null, 2));

  // Buscar termos chave
  const terms = [
    'extension', 'abductor', 'leg curl', 'incline', 'lateral raise', 
    'shoulder press', 'sit-up', 'bicep curl', 'squat', 'row', 
    'dip', 'treadmill', 'leg press', 'calf'
  ];

  terms.forEach(t => {
    const matches = data.filter(d => (d.name || '').toLowerCase().includes(t));
    console.log(`Termo "${t}": ${matches.length} encontrados. Exemplo: ${matches[0]?.name} (id: ${matches[0]?.id})`);
  });
}

check().catch(console.error);
