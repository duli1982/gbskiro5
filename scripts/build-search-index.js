const fs = require('fs');
const path = require('path');

const stripHtml = (html) => html.replace(/<[^>]*>/g, '').trim();

const siteDir = path.join(__dirname, '..', 'src');

// Daily Focus entries
const dailyFocusPath = path.join(siteDir, 'daily-focus', 'focus.json');
let focusEntries = [];
try {
  const focusData = JSON.parse(fs.readFileSync(dailyFocusPath, 'utf8'));
  focusEntries = focusData.map((item, index) => ({
    id: `daily-focus-${index + 1}`,
    title: item.title,
    type: 'daily-focus',
    category: item.category,
    description: item.quote || '',
  }));
} catch (err) {
  console.error('Failed to process daily focus data', err);
}

// Prompt library entries
const promptsDir = path.join(siteDir, 'gbs-prompts', 'data');
let promptEntries = [];
try {
  const files = fs.readdirSync(promptsDir).filter((f) => f.endsWith('.json'));
  files.forEach((file) => {
    const data = JSON.parse(
      fs.readFileSync(path.join(promptsDir, file), 'utf8'),
    );
    Object.keys(data).forEach((mainCat) => {
      const subcats = data[mainCat];
      Object.keys(subcats).forEach((subcat) => {
        subcats[subcat].forEach((item) => {
          promptEntries.push({
            id: item.id,
            title: item.title,
            type: 'gbs-prompts',
            category: `${mainCat} > ${subcat}`,
            description: item.description || '',
          });
        });
      });
    });
  });
} catch (err) {
  console.error('Failed to process prompt library', err);
}

// Training session entries
const sessionsDir = path.join(siteDir, 'rpo-training', 'sessions');
let sessionEntries = [];
try {
  const sessionFiles = fs
    .readdirSync(sessionsDir)
    .filter((f) => f.endsWith('.html'));
  sessionFiles.forEach((file) => {
    const html = fs.readFileSync(path.join(sessionsDir, file), 'utf8');
    const titleMatch = html.match(/<h2[^>]*>(.*?)<\/h2>/i);
    const descMatch = html.match(/<p[^>]*>(.*?)<\/p>/i);
    sessionEntries.push({
      id: `training-${path.basename(file, '.html')}`,
      title: titleMatch
        ? stripHtml(titleMatch[1])
        : path.basename(file, '.html'),
      type: 'training',
      category: `Session ${path.basename(file, '.html')}`,
      description: descMatch ? stripHtml(descMatch[1]) : '',
    });
  });
} catch (err) {
  console.error('Failed to process training sessions', err);
}

const allEntries = [...focusEntries, ...promptEntries, ...sessionEntries];

const outputDir = path.join(siteDir, 'search');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}
const outputPath = path.join(outputDir, 'search-data.json');
fs.writeFileSync(outputPath, JSON.stringify(allEntries, null, 2));
console.log(`Search index written to ${outputPath}`);
