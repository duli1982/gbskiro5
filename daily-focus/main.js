        import { render } from '../shared/scripts/utils/render.js';

        // --- App State ---
        let focusPoints = [];
        let progressState = {};
        let currentDeck = [];
        let currentIndex = 0;
        let categoryCounts = {};

        // --- DOM Elements ---
        const cardOfTheDayContainer = document.getElementById('card-of-the-day-container');
        const cardContainer = document.getElementById('card-container');
        const categoryFiltersContainer = document.getElementById('category-filters');
        const cardNavigation = document.getElementById('card-navigation');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const cardCounter = document.getElementById('card-counter');

        // --- State Management ---
        function initializeData(focusPointsData) {
            focusPoints = focusPointsData.map((point, index) => ({ ...point, id: `fp-${index}` }));

            categoryCounts = focusPoints.reduce((acc, point) => {
                acc[point.category] = (acc[point.category] || 0) + 1;
                return acc;
            }, {});
            categoryCounts['All'] = focusPoints.length;

            const savedProgress = localStorage.getItem('sourcingFocusProgress');
            if (savedProgress) {
                progressState = JSON.parse(savedProgress);
            } else {
                focusPoints.forEach(point => {
                    progressState[point.id] = Array(point.actions.length).fill(false);
                });
            }
        }

        function saveProgress() {
            localStorage.setItem('sourcingFocusProgress', JSON.stringify(progressState));
        }

        // --- Card Creation & UI Updates ---
        function createCard(point) {
            const pointId = point.id;
            const cardElement = document.createElement('div');
            cardElement.className = 'card w-full bg-white p-6 rounded-xl shadow-lg border border-gray-200';
            cardElement.dataset.pointId = pointId;

            // Top section
            const topDiv = document.createElement('div');
            const headerDiv = document.createElement('div');
            headerDiv.className = 'flex justify-between items-center mb-3';

            const categorySpan = document.createElement('span');
            categorySpan.className = 'text-sm font-semibold text-indigo-600';
            categorySpan.textContent = point.category;

            const progressSpan = document.createElement('span');
            progressSpan.className = 'progress-text text-sm font-medium text-gray-500';

            headerDiv.appendChild(categorySpan);
            headerDiv.appendChild(progressSpan);

            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar w-full bg-gray-200 rounded-full h-2.5 mb-4';
            const progressBarInner = document.createElement('div');
            progressBarInner.className = 'progress-bar-inner bg-green-500 h-2.5 rounded-full';
            progressBarInner.style.width = '0%';
            progressBar.appendChild(progressBarInner);

            const title = document.createElement('h3');
            title.className = 'text-lg md:text-xl font-bold text-gray-800';
            title.textContent = point.title;

            const quote = document.createElement('p');
            quote.className = 'text-gray-500 italic my-2 text-sm md:text-base';
            quote.textContent = `"${point.quote}"`;

            topDiv.appendChild(headerDiv);
            topDiv.appendChild(progressBar);
            topDiv.appendChild(title);
            topDiv.appendChild(quote);

            // Bottom section
            const bottomDiv = document.createElement('div');

            const actionsLabel = document.createElement('p');
            actionsLabel.className = 'font-semibold mb-2 text-gray-700';
            actionsLabel.textContent = 'Action Items:';

            const ul = document.createElement('ul');
            ul.className = 'space-y-2';

            point.actions.forEach((action, index) => {
                const isChecked = progressState[pointId] ? progressState[pointId][index] : false;

                const li = document.createElement('li');
                li.className = `action-item rounded-lg ${isChecked ? 'completed' : ''}`;

                const label = document.createElement('label');
                label.className = 'flex items-center p-3 cursor-pointer';
                label.setAttribute('for', `action-${pointId}-${index}`);

                const input = document.createElement('input');
                input.id = `action-${pointId}-${index}`;
                input.type = 'checkbox';
                input.className = 'h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500';
                if (isChecked) {
                    input.checked = true;
                }
                input.addEventListener('change', () => window.handleCheckboxChange(input, pointId, index));

                const span = document.createElement('span');
                span.className = 'ml-3 text-gray-700';
                span.textContent = action;

                label.appendChild(input);
                label.appendChild(span);
                li.appendChild(label);
                ul.appendChild(li);
            });

            const completionBanner = document.createElement('div');
            completionBanner.className = 'completion-banner hidden mt-4 p-4 bg-green-100 border-l-4 border-green-500 rounded-r-lg';

            const bannerFlex = document.createElement('div');
            bannerFlex.className = 'flex';

            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'py-1';
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'h-6 w-6 text-green-500 mr-4');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('stroke', 'currentColor');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('d', 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z');
            svg.appendChild(path);
            iconWrapper.appendChild(svg);

            const textWrapper = document.createElement('div');
            const bannerTitle = document.createElement('p');
            bannerTitle.className = 'font-bold text-green-800';
            bannerTitle.textContent = 'All Actions Completed!';
            const bannerText = document.createElement('p');
            bannerText.className = 'text-sm text-green-700';
            bannerText.textContent = "✨ Fantastic work! You've mastered this focus. ✨";
            textWrapper.appendChild(bannerTitle);
            textWrapper.appendChild(bannerText);

            bannerFlex.appendChild(iconWrapper);
            bannerFlex.appendChild(textWrapper);
            completionBanner.appendChild(bannerFlex);

            bottomDiv.appendChild(actionsLabel);
            bottomDiv.appendChild(ul);
            bottomDiv.appendChild(completionBanner);

            cardElement.appendChild(topDiv);
            cardElement.appendChild(bottomDiv);

            return cardElement;
        }

        function updateProgressUI(pointId) {
            const cards = document.querySelectorAll(`.card[data-point-id="${pointId}"]`);
            if (cards.length === 0) return;

            const progress = progressState[pointId] || [];
            const completedCount = progress.filter(Boolean).length;
            const totalCount = progress.length;
            const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

            cards.forEach(card => {
                card.querySelector('.progress-bar-inner').style.width = `${percentage}%`;
                card.querySelector('.progress-text').textContent = `${completedCount} / ${totalCount} Completed`;

                const completionBanner = card.querySelector('.completion-banner');
                if (percentage === 100) {
                    completionBanner.classList.remove('hidden');
                } else {
                    completionBanner.classList.add('hidden');
                }
            });
        }

        window.handleCheckboxChange = (checkbox, pointId, actionIndex) => {
            if (!progressState[pointId]) {
                 progressState[pointId] = Array(checkbox.closest('ul').children.length).fill(false);
            }
            progressState[pointId][actionIndex] = checkbox.checked;

            const cardElements = document.querySelectorAll(`.card[data-point-id="${pointId}"] .action-item`);
            cardElements.forEach(item => {
                const label = item.querySelector('label');
                if (label && label.getAttribute('for') === `action-${pointId}-${actionIndex}`) {
                    item.classList.toggle('completed', checkbox.checked);
                }
            });

            updateProgressUI(pointId);
            saveProgress();
        };

        // --- Card of the Day Logic ---
        function renderCardOfTheDay() {
            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 0);
            const diff = now - startOfYear;
            const oneDay = 1000 * 60 * 60 * 24;
            const dayOfYear = Math.floor(diff / oneDay);

            const cardIndex = dayOfYear % focusPoints.length;
            const dailyPoint = focusPoints[cardIndex];

            if (dailyPoint) {
                const card = createCard(dailyPoint);
                render(cardOfTheDayContainer, card);
                updateProgressUI(dailyPoint.id);
            }
        }

        // --- Deck Management for Library ---
        function loadDeck(category = 'All') {
            currentDeck = (category === 'All') ? [...focusPoints] : focusPoints.filter(p => p.category === category);
            currentIndex = 0;
            showCardInLibrary(currentIndex);
            updateActiveFilterButton(category);
        }

        function showCardInLibrary(index) {
            if (!currentDeck || currentDeck.length === 0) {
                const noItemsDiv = document.createElement('div');
                noItemsDiv.className = 'text-center text-gray-500 p-8 bg-white rounded-xl shadow-md';
                const h3 = document.createElement('h3');
                h3.textContent = 'No items in this category.';
                noItemsDiv.appendChild(h3);
                render(cardContainer, noItemsDiv);
                cardNavigation.style.display = 'none';
                return;
            }

            cardNavigation.style.display = 'flex';

            const point = currentDeck[index];
            const card = createCard(point);
            render(cardContainer, card);
            updateProgressUI(point.id);

            cardCounter.textContent = `${index + 1} / ${currentDeck.length}`;
            prevBtn.disabled = index === 0;
            nextBtn.disabled = index === currentDeck.length - 1;
        }

        // --- Filter Buttons ---
        function populateFilters() {
            const categories = ['All', ...new Set(focusPoints.map(p => p.category))];
            categories.forEach(category => {
                const button = document.createElement('button');
                const count = categoryCounts[category] || 0;
                button.textContent = `${category} (${count})`;
                button.className = 'filter-button px-3 py-1.5 text-sm font-medium rounded-full bg-white text-gray-700 shadow-sm hover:bg-gray-200 transition-colors';
                button.dataset.category = category;
                button.addEventListener('click', () => loadDeck(category));
                categoryFiltersContainer.appendChild(button);
            });
        }

        function updateActiveFilterButton(activeCategory) {
            document.querySelectorAll('.filter-button').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.category === activeCategory);
            });
        }

        // --- Initial Load & Event Listeners ---
        document.addEventListener('DOMContentLoaded', () => {
            fetch('focus.json')
                .then(response => response.json())
                .then(data => {
                    initializeData(data);
                    renderCardOfTheDay();
                    populateFilters();
                    loadDeck('All');
                })
                .catch(error => console.error('Error fetching focus points:', error));

            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    showCardInLibrary(currentIndex);
                }
            });

            nextBtn.addEventListener('click', () => {
                if (currentIndex < currentDeck.length - 1) {
                    currentIndex++;
                    showCardInLibrary(currentIndex);
                }
            });
        });
