/* eslint-disable */
import { render } from '../shared/scripts/utils/render.js';
// --- DATA STRUCTURE ---
let promptData = {};
let allPrompts = [];
let lastScrollPosition = 0;
let promptIndex = {};
const categoriesLoaded = new Set();

// --- SCROLL TO TOP FUNCTIONALITY ---
const scrollToTopBtn = document.getElementById('scroll-to-top');

// Show/hide scroll to top button based on scroll position
function toggleScrollToTopButton() {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Event listeners for scroll to top
window.addEventListener('scroll', toggleScrollToTopButton);
scrollToTopBtn.addEventListener('click', scrollToTop);

/**
 * Flattens the prompt data into a single array for easier searching.
 */
function flattenPrompts() {
    allPrompts = [];
    for (const categoryName in promptData) {
        const category = promptData[categoryName];
        for (const subCategoryName in category) {
            const prompts = category[subCategoryName];
            prompts.forEach(prompt => {
                allPrompts.push({
                    ...prompt,
                    category: categoryName,
                    subcategory: subCategoryName
                });
            });
        }
    }
}

async function fetchCategory(categoryName) {
    if (categoriesLoaded.has(categoryName)) return;
    const file = promptIndex[categoryName]?.file;
    if (!file) return;
    const res = await fetch(file);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    Object.assign(promptData, data);
    categoriesLoaded.add(categoryName);
}

async function loadAllCategories() {
    const loads = Object.keys(promptIndex).map(name => fetchCategory(name));
    await Promise.all(loads);
    flattenPrompts();
}

async function loadPrompts() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const categoryCardsContainer = document.getElementById('category-cards-container');
    loadingIndicator.classList.remove('hidden');

    try {
        const response = await fetch('./categories.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        promptIndex = await response.json();
        renderHomepage();

        const promptCount = Object.values(promptIndex).reduce((s, v) => s + v.totalPrompts, 0);
        const date = new Date();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const heroSubtitle = document.getElementById('hero-subtitle');
        heroSubtitle.textContent = `Discover ${promptCount} Gemini prompts you have to try in ${month} ${year}!`;

        const animatedSubtitleEl = document.getElementById('animated-subtitle');
        if (animatedSubtitleEl) {
            const subtitles = [
                "Browse by Category...",
                "Search Specific Topics...",
                "Copy & Customize Prompts...",
                "Understand Prompt Structure...",
                "Tailor to Your Needs...",
                "Combine Multiple Prompts...",
                "Master Effective Prompting...",
            ];
            let subtitleIndex = 0;
            function cycleSubtitles() {
                animatedSubtitleEl.classList.remove('subtitle-animate-in');
                animatedSubtitleEl.classList.add('subtitle-animate-out');
                setTimeout(() => {
                    subtitleIndex = (subtitleIndex + 1) % subtitles.length;
                    animatedSubtitleEl.textContent = subtitles[subtitleIndex];
                    animatedSubtitleEl.classList.remove('subtitle-animate-out');
                    animatedSubtitleEl.classList.add('subtitle-animate-in');
                }, 500);
            }
            cycleSubtitles();
            setInterval(cycleSubtitles, 3000);
        }
    } catch (error) {
        console.error('Failed to load prompts:', error);
        render(categoryCardsContainer, `
            <div class="text-center text-red-500">
                <p>Error loading prompts. Please try again later.</p>
            </div>
        `, { sanitize: true });
    } finally {
        loadingIndicator.classList.add('hidden');
        categoryCardsContainer.classList.remove('hidden');
    }
}

// --- DOM ELEMENTS ---
const homepageView = document.getElementById('homepage-view');
const detailView = document.getElementById('detail-view');
const categoryCardsContainer = document.getElementById('category-cards-container');
const promptDisplayArea = document.getElementById('prompt-display-area');
const quickLinksSidebar = document.getElementById('quick-links-sidebar');
const backToHomeBtn = document.getElementById('back-to-home-btn');
const homepageSearchInput = document.getElementById('homepage-search');
const clearSearchBtn = document.getElementById('clear-search-btn');
const gemModal = document.getElementById('gem-modal');
const closeGemModalBtn = document.getElementById('close-gem-modal-btn');
const generateGemBtn = document.getElementById('generate-gem-btn');
const copyGemBtn = document.getElementById('copy-gem-btn');
const generatedGemContainer = document.getElementById('generated-gem-container');
const generatedGemTextarea = document.getElementById('generated-gem');

// ===== Helpers for Quick Start, Expected Output, and badges =====

/**
 * Highlights search terms in text
 * @param {string} text - The text to highlight
 * @param {string} searchTerm - The term to highlight
 * @returns {string} Text with highlighted search terms
 */
function highlightText(text, searchTerm) {
    if (!searchTerm || !text) return text;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}

function createDifficultyBadge(difficulty) {
    if (!difficulty) return '';
    const map = {
        beginner: { label: 'Beginner', class: 'difficulty-beginner' },
        intermediate: { label: 'Intermediate', class: 'difficulty-intermediate' },
        advanced: { label: 'Advanced', class: 'difficulty-advanced' },
    };
    const cfg = map[difficulty] || map.beginner;
    return `<span class="difficulty-badge ${cfg.class}">${cfg.label}</span>`;
}

function createTimeBadge(estimatedTime) {
    if (!estimatedTime) return '';
    return `<span class="time-badge">${estimatedTime}</span>`;
}

function createQuickStartSection(quickStart) {
    if (!quickStart || !quickStart.steps || quickStart.steps.length === 0) return '';
    const stepsHTML = quickStart.steps.map(step => `<li>${step}</li>`).join('');
    const tipsHTML = quickStart.tips && quickStart.tips.length
        ? `<div class="quick-start-tips"><h4>Pro Tips</h4><ul>${quickStart.tips.map(t => `<li>${t}</li>`).join('')}</ul></div>`
        : '';
    const skin = (quickStart.skin === 'white' || quickStart.skin === 'plain') ? quickStart.skin : 'plain';
    return `
    <div class="quick-start-section ${skin}">
      <div class="quick-start-content">
        <div class="quick-start-title">Quick Start Guide</div>
        <ol class="quick-start-steps">${stepsHTML}</ol>
        ${tipsHTML}
      </div>
    </div>
  `;
}

function createExpectedOutputSection(expectedOutput) {
    if (!expectedOutput) return '';
    return `<div class="expected-output">
    <div class="expected-output-title">What to Expect</div>
    <div class="expected-output-content">${expectedOutput}</div>
  </div>`;
}

// --- RENDER FUNCTIONS ---
function renderHomepage() {
    categoryCardsContainer.replaceChildren();
    categoryCardsContainer.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-8';
    for (const categoryName in promptIndex) {
        const meta = promptIndex[categoryName];
        const subCategories = Object.keys(meta.subcategories);
        const totalPrompts = meta.totalPrompts;

        const card = document.createElement('div');
        card.className = 'prompt-block flex flex-col';

        let subCategoryLinks = subCategories.map(subName =>
            `<li><a href="#" class="block py-1.5 text-gray-500" data-category="${categoryName}" data-subcategory="${subName}">→ ${subName}</a></li>`
        ).join('');

        render(card, `
            <div class="p-6 text-center">
                <h2 class="text-xl font-bold main-heading accent-text">${categoryName}</h2>
                <p class="text-gray-500 text-sm mt-2">${totalPrompts} prompts available</p>
            </div>
            <div class="flex-grow px-6 category-card-list scrollable-list overflow-y-auto">
                <ul>${subCategoryLinks}</ul>
            </div>
            <div class="p-6 mt-auto">
                <button class="see-all-btn w-full py-2.5 rounded-md font-semibold" data-category="${categoryName}">Explore ${categoryName} →</button>
            </div>
        `, { sanitize: true });
        categoryCardsContainer.appendChild(card);
    }
}

/**
 * Creates a DOM element for a single prompt.
 * Enhanced: includes badges, Quick Start, and Expected Output sections when available.
 * @param {object} prompt - The prompt object.
 * @param {boolean} isSearchResult - True if the prompt is for a search result.
 * @param {string} searchTerm - The term to highlight in the prompt.
 * @returns {HTMLElement} The created prompt element.
 */
function createPromptElement(prompt, isSearchResult = false, searchTerm = '') {
    const promptEl = document.createElement('div');
    const escapedContent = (prompt.content || '').replace(/"/g, '&quot;');

    const titleClass = isSearchResult ? 'text-lg' : 'text-xl';
    const breadcrumbHTML = isSearchResult
        ? `<p class="text-gray-500 text-sm mb-3"><span class="font-semibold">${prompt.category}</span> &gt; <span>${prompt.subcategory}</span></p>`
        : '';

    const descriptionHTML = prompt.description ? `<p class="text-gray-600 text-sm mb-3">${prompt.description}</p>` : '';
    const contentContainerClass = isSearchResult
        ? 'prompt-display-item p-4 text-gray-700 bg-gray-50 rounded-md'
        : 'prompt-display-item p-4 text-gray-700';

    const highlightedTitle = isSearchResult ? highlightText(prompt.title || '', searchTerm) : (prompt.title || '');
    const highlightedContent = isSearchResult ? highlightText(prompt.content || '', searchTerm) : (prompt.content || '');

    // badges + quick-start + expected output
    const difficultyBadge = createDifficultyBadge(prompt.difficulty);
    const timeBadge = createTimeBadge(prompt.estimatedTime);
    const quickStartSection = createQuickStartSection(prompt.quickStart || {});
    const expectedOutputSection = createExpectedOutputSection(prompt.expectedOutput || '');

    promptEl.className = isSearchResult ? 'prompt-block p-4' : 'mb-8';

    render(promptEl, `
        <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
                <div class="badges-container mb-2">
                  ${difficultyBadge}
                  ${timeBadge}
                </div>
                <h3 class="${titleClass} font-semibold main-heading">${highlightedTitle}</h3>
            </div>
            <div class="flex-shrink-0 ml-4">
                <button class="copy-btn text-sm py-1 px-3 rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200" data-prompt-content="${escapedContent}">
                    Copy
                </button>
                <button class="create-gem-btn text-sm py-1 px-3 rounded-md bg-green-100 text-green-700 hover:bg-green-200 ml-2 hidden" data-prompt-content="${escapedContent}">
                    Create Gem
                </button>
            </div>
        </div>

        ${breadcrumbHTML}
        ${descriptionHTML}

        <div class="${contentContainerClass}">
            <p>${highlightedContent}</p>
        </div>

        ${quickStartSection}
        ${expectedOutputSection}
    `, { sanitize: true });

    return promptEl;
}

/**
 * Renders the results of a search query on the homepage.
 * @param {Array} results - An array of prompt objects to display.
 */
function renderSearchResults(results) {
    const searchTerm = homepageSearchInput.value.trim();
    categoryCardsContainer.replaceChildren();
    if (results.length === 0) {
        render(categoryCardsContainer, `
        <div class="text-center text-gray-500 col-span-full py-16">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
            </svg>
            <h3 class="mt-2 text-sm font-semibold text-gray-900">No prompts found</h3>
            <p class="mt-1 text-sm text-gray-500">We couldn’t find anything with that search term. Please try again.</p>
            <div class="mt-6">
                <button type="button" id="clear-search-suggestions-btn" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Clear Search
                </button>
            </div>
        </div>`, { sanitize: true });
        return;
    }

    categoryCardsContainer.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-8';

    results.forEach(prompt => {
        const promptEl = createPromptElement(prompt, true, searchTerm);
        categoryCardsContainer.appendChild(promptEl);
    });
}

function renderQuickLinks(activeCategory, activeSubCategory) {
    quickLinksSidebar.replaceChildren();
    for (const categoryName in promptIndex) {
        const categoryTitle = document.createElement('h4');
        categoryTitle.className = 'font-bold mt-4 mb-2 main-heading';
        render(categoryTitle, `Gemini Prompts for <span class="accent-text">${categoryName}</span>`, { sanitize: true });
        quickLinksSidebar.appendChild(categoryTitle);

        const subList = document.createElement('ul');
        for (const subCategoryName in promptIndex[categoryName].subcategories) {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = subCategoryName;
            link.dataset.category = categoryName;
            link.dataset.subcategory = subCategoryName;
            if (categoryName === activeCategory && subCategoryName === activeSubCategory) {
                link.className = 'active font-semibold';
            }
            li.appendChild(link);
            subList.appendChild(li);
        }
        quickLinksSidebar.appendChild(subList);
    }
}

/**
 * Renders the detail view for a specific sub-category.
 * @param {string} activeCategory - The main category to display.
 * @param {string} activeSubCategory - The sub-category to display.
 */
function renderDetailView(activeCategory, activeSubCategory) {
    promptDisplayArea.replaceChildren();
    const subCategoryPrompts = promptData[activeCategory][activeSubCategory];

    const header = document.createElement('h1');
    header.className = 'text-3xl font-bold mb-8 main-heading';
    render(header, `Gemini Prompts for <span class="accent-text">${activeSubCategory}</span>`, { sanitize: true });
    promptDisplayArea.appendChild(header);

    subCategoryPrompts.forEach(prompt => {
        const fullPrompt = { ...prompt, category: activeCategory, subcategory: activeSubCategory };
        const promptEl = createPromptElement(fullPrompt, false);
        promptDisplayArea.appendChild(promptEl);
    });

    renderQuickLinks(activeCategory, activeSubCategory);
}

/**
 * Renders the detail view for all prompts in a specific category.
 * @param {string} activeCategory - The main category to display.
 */
function renderAllCategoryView(activeCategory) {
    promptDisplayArea.replaceChildren();

    const header = document.createElement('h1');
    header.className = 'text-3xl font-bold mb-8 main-heading';
    render(header, `All Prompts in <span class="accent-text">${activeCategory}</span>`, { sanitize: true });
    promptDisplayArea.appendChild(header);

    const category = promptData[activeCategory];
    for (const subCategoryName in category) {
        const subCategoryPrompts = category[subCategoryName];

        const subHeader = document.createElement('h2');
        subHeader.className = 'text-2xl font-bold mt-8 mb-4 main-heading';
        subHeader.textContent = subCategoryName;
        promptDisplayArea.appendChild(subHeader);

        subCategoryPrompts.forEach(prompt => {
            const fullPrompt = { ...prompt, category: activeCategory, subcategory: subCategoryName };
            const promptEl = createPromptElement(fullPrompt, false);
            promptDisplayArea.appendChild(promptEl);
        });
    }

    renderQuickLinks(activeCategory, null);
}

// --- NAVIGATION LOGIC ---
async function showDetailView(category, subCategory) {
    lastScrollPosition = window.scrollY;
    await fetchCategory(category);
    renderDetailView(category, subCategory);
    homepageView.classList.add('hidden');
    detailView.classList.remove('hidden');
    detailView.classList.add('fade-in');
    window.scrollTo(0, 0);
}
function showHomepage() {
    detailView.classList.add('hidden');
    homepageView.classList.remove('hidden');
    homepageView.classList.add('fade-in');
    setTimeout(() => { window.scrollTo(0, lastScrollPosition); }, 0);
}

async function showAllCategoryView(categoryName) {
    lastScrollPosition = window.scrollY;
    await fetchCategory(categoryName);
    renderAllCategoryView(categoryName);
    homepageView.classList.add('hidden');
    detailView.classList.remove('hidden');
    detailView.classList.add('fade-in');
    window.scrollTo(0, 0);
}

function populateGemModal(content) {
    const personaMatch = content.match(/act as an? (.*)/i);
    document.getElementById('gem-persona').value = personaMatch ? `You are a ${personaMatch[1]}` : '';
    document.getElementById('gem-task').value = content;
    document.getElementById('gem-context').value = '';
    document.getElementById('gem-audience').value = '';
    document.getElementById('gem-tone').value = '';
    document.getElementById('gem-format').value = '';
}
function showGemModal(content) { populateGemModal(content); gemModal.classList.remove('hidden'); }
function hideGemModal() { gemModal.classList.add('hidden'); generatedGemTextarea.value = ''; generatedGemContainer.classList.add('hidden'); }

// --- EVENT LISTENERS ---
homepageSearchInput.addEventListener('input', async (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    if (searchTerm === '') { renderHomepage(); clearSearchBtn.classList.add('hidden'); return; }
    clearSearchBtn.classList.remove('hidden');
    if (allPrompts.length === 0) {
        await loadAllCategories();
    }
    const filteredPrompts = allPrompts.filter(prompt => {
        const titleMatch = (prompt.title || '').toLowerCase().includes(searchTerm);
        const contentMatch = (prompt.content || '').toLowerCase().includes(searchTerm);
        return titleMatch || contentMatch;
    });
    renderSearchResults(filteredPrompts);
});
clearSearchBtn.addEventListener('click', () => { homepageSearchInput.value = ''; clearSearchBtn.classList.add('hidden'); renderHomepage(); });

function handleCopyClick(e) {
    const target = e.target.closest('.copy-btn');
    if (!target) return;
    const content = target.dataset.promptContent;
    if (content) {
        navigator.clipboard.writeText(content).then(() => {
            target.textContent = 'Copied!';
            target.classList.add('bg-green-200', 'text-green-800');
            setTimeout(() => { target.textContent = 'Copy'; target.classList.remove('bg-green-200', 'text-green-800'); }, 2000);
        }).catch(err => { console.error('Failed to copy text: ', err); target.textContent = 'Error'; setTimeout(() => { target.textContent = 'Copy'; }, 2000); });
    }
}

categoryCardsContainer.addEventListener('click', async (e) => {
    const target = e.target;
    if (target.id === 'clear-search-suggestions-btn') { homepageSearchInput.value = ''; clearSearchBtn.classList.add('hidden'); renderHomepage(); return; }
    if (target.closest('.copy-btn')) { handleCopyClick(e); return; }
    if (target.classList.contains('create-gem-btn')) { const content = target.dataset.promptContent; showGemModal(content); return; }
    if (target.classList.contains('see-all-btn')) { const categoryName = target.dataset.category; await showAllCategoryView(categoryName); return; }
    if (target.tagName === 'A' && target.dataset.subcategory) { e.preventDefault(); await showDetailView(target.dataset.category, target.dataset.subcategory); }
});

promptDisplayArea.addEventListener('click', (e) => {
    if (e.target.classList.contains('create-gem-btn')) { const content = e.target.dataset.promptContent; showGemModal(content); return; }
    handleCopyClick(e);
});

quickLinksSidebar.addEventListener('click', async (e) => {
    if (e.target.tagName === 'A' && e.target.dataset.subcategory) {
        e.preventDefault();
        await showDetailView(e.target.dataset.category, e.target.dataset.subcategory);
    }
});

backToHomeBtn.addEventListener('click', showHomepage);
closeGemModalBtn.addEventListener('click', hideGemModal);

generateGemBtn.addEventListener('click', () => {
    const persona = document.getElementById('gem-persona').value;
    const task = document.getElementById('gem-task').value;
    const context = document.getElementById('gem-context').value;
    const audience = document.getElementById('gem-audience').value;
    const tone = document.getElementById('gem-tone').value;
    const format = document.getElementById('gem-format').value;

    let gemString = `Persona: – “${persona}”\n\n`;
    gemString += `Task: – “${task}”\n\n`;
    gemString += `Context: – “${context}”\n\n`;
    if (audience) gemString += `Audience (optional): – “${audience}”\n\n`;
    if (tone) gemString += `Tone & Style (optional): – “${tone}”\n\n`;
    gemString += `Format: – “${format}”`;

    generatedGemTextarea.value = gemString;
    generatedGemContainer.classList.remove('hidden');
});

copyGemBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(generatedGemTextarea.value).then(() => {
        copyGemBtn.textContent = 'Copied!';
        setTimeout(() => { copyGemBtn.textContent = 'Copy Gem'; }, 2000);
    }).catch(err => { console.error('Failed to copy text: ', err); });
});

// --- INITIAL LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    loadPrompts();
});
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('quick-links-search');
    const nav = document.getElementById('quick-links-sidebar');
    if (searchInput && nav) {
        searchInput.addEventListener('input', () => {
            const term = searchInput.value.trim().toLowerCase();
            const items = Array.from(nav.querySelectorAll('a'));
            items.forEach(a => { const text = a.textContent.toLowerCase(); a.style.display = text.includes(term) ? '' : 'none'; });
        });
    }
});
