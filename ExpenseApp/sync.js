const fs = require('fs');
const fetch = require('node-fetch');

const token = process.env.GH_TOKEN;
const repo = process.env.GH_REPO; // e.g. user/private-repo
const path = 'expenses.sqlite';
const apiBase = 'https://api.github.com';

if (!token || !repo) {
  console.error('GH_TOKEN and GH_REPO env vars required');
  process.exit(1);
}

async function getFileSha() {
  const res = await fetch(`${apiBase}/repos/${repo}/contents/${path}`, {
    headers: { 'Authorization': `token ${token}` }
  });
  if (res.status === 404) return null;
  const data = await res.json();
  return data.sha;
}

async function pushFile() {
  const content = fs.readFileSync(path, 'base64');
  const sha = await getFileSha();
  const res = await fetch(`${apiBase}/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Sync DB',
      content,
      sha
    })
  });
  if (!res.ok) {
    console.error('Push failed', await res.text());
    process.exit(1);
  }
  console.log('Pushed');
}

async function pullFile() {
  const res = await fetch(`${apiBase}/repos/${repo}/contents/${path}`, {
    headers: { 'Authorization': `token ${token}` }
  });
  if (!res.ok) {
    console.error('Pull failed', await res.text());
    process.exit(1);
  }
  const data = await res.json();
  fs.writeFileSync(path, Buffer.from(data.content, 'base64'));
  console.log('Pulled');
}

const cmd = process.argv[2];
if (cmd === 'push') pushFile();
else if (cmd === 'pull') pullFile();
else console.log('Usage: node sync.js [push|pull]');
