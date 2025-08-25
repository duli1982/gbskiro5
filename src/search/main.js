/* global lunr */
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');

let documents = [];
let idx;

const fetchData = async () => {
  const response = await fetch('./search-data.json');
  documents = await response.json();
  idx = lunr(function () {
    this.ref('id');
    this.field('title');
    this.field('description');
    this.field('category');
    this.field('type');
    documents.forEach((doc) => this.add(doc));
  });
  renderResults();
};

function getSelectedTypes() {
  const checks = document.querySelectorAll('#filters input:checked');
  return Array.from(checks).map((c) => c.value);
}

function renderResults(query = '') {
  const types = getSelectedTypes();
  let items = [];
  if (query) {
    items = idx
      .search(query)
      .map((res) => documents.find((d) => d.id === res.ref));
  } else {
    items = documents;
  }
  items = items.filter((item) => types.includes(item.type));
  resultsContainer.innerHTML = '';
  if (items.length === 0) {
    resultsContainer.innerHTML =
      '<p class="text-center text-gray-600">No results found.</p>';
    return;
  }
  items.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow';
    div.innerHTML = `
      <h3 class="font-bold">${item.title}</h3>
      <p class="text-sm text-gray-500">${item.category} · ${item.type}</p>
      ${item.description ? `<p class="mt-2">${item.description}</p>` : ''}
    `;
    resultsContainer.appendChild(div);
  });
}

searchInput.addEventListener('input', () => {
  renderResults(searchInput.value.trim());
});

document.querySelectorAll('#filters input').forEach((input) => {
  input.addEventListener('change', () => {
    renderResults(searchInput.value.trim());
  });
});

fetchData();
