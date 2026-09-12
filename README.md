# FitTracker - App de Treinos A & B 💪

Aplicativo web mobile-first criado para acompanhamento de treinos na academia, controle de cargas, séries e cronômetro de descanso automático.

## 🚀 Funcionalidades

- **Treinos A & B Separados**: Carregados automaticamente da sua planilha de treinos.
- **Cronômetro de Descanso Automático**: Ao marcar uma série concluída (ex: S1, S2, S3), o cronômetro inicia a contagem regressiva automaticamente com alerta sonoro.
- **Controle Rápido de Cargas**: Botões `+` e `-` em cada exercício para atualizar o peso direto na academia sem complicação.
- **100% Editável**: Altere nomes de exercícios, pesos, repetições, número de séries e tempo de intervalo.
- **Armazenamento no Celular (`LocalStorage`)**: Tudo o que você alterar fica salvo no seu aparelho sem precisar de servidor.
- **Funciona Offline (PWA)**: Pode ser instalado na tela de início do celular como um aplicativo comum.
- **Backup & Restauração**: Exporte seus treinos em JSON ou restaure os dados originais da planilha a qualquer momento.

---

## 📲 Como Publicar e Usar no Celular (Opção 1: GitHub Pages - 100% Grátis)

1. Crie um repositório no seu GitHub (ex: `meu-treino`).
2. Envie todos os arquivos desta pasta para o repositório (`index.html`, `style.css`, `app.js`, `manifest.json`, `sw.js`, `icon.svg`).
3. No seu repositório no GitHub:
   - Acesse **Settings** (Configurações) > **Pages**.
   - Em **Branch**, selecione `main` (ou `master`) e a pasta `/ (root)`.
   - Clique em **Save**.
4. O GitHub vai gerar um link como: `https://seu-usuario.github.io/meu-treino/`.
5. Abra esse link no navegador do celular (Chrome no Android ou Safari no iPhone).
6. Toque em **"Adicionar à tela de início"** / **"Instalar aplicativo"**.

---

## ⚡ Como Publicar na Vercel (Opção 2)

1. Acesse [vercel.com](https://vercel.com) e faça login com seu GitHub.
2. Clique em **"Add New..."** > **"Project"**.
3. Importe o repositório do seu treino e clique em **Deploy**.
4. Em menos de 1 minuto seu link estará pronto e funcionando online no celular!
