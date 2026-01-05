// app.js

// --- CONFIGURATION ---
const nepaliMonths = ["Baishakh", "Jestha", "Ashad", "Shrawan", "Bhadra", "Ashwin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"];
const englishMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let currentBsYear, currentBsMonth;
let selectedDate = { year: null, month: null, day: null };
let animationDir = null;

// --- INITIALIZATION ---
window.onload = function() {
    // 1. Configure Tailwind immediately
    tailwind.config = {
        darkMode: 'class',
        theme: {
            extend: {
                colors: { primary: '#d93025' },
                screens: { 'xs': '360px' }
            }
        }
    };

    // 2. Check for Date Library
    if (typeof NepaliDate === 'undefined') {
        document.getElementById('error-ui').classList.remove('hidden');
        return;
    }

    // 3. Initialize App
    populateDropdowns();
    initTodayButton();
    goToToday();
    setupSwipe();
    initDarkMode();

    // 4. Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js', { scope: '.' })
            .catch(err => console.error('SW Fail', err));
    }
};

// --- CORE FUNCTIONS ---
function initDarkMode() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleDarkMode() {
    triggerHaptic();
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.theme = isDark ? 'dark' : 'light';
}

function triggerHaptic() {
    if (navigator.vibrate) navigator.vibrate(10);
}

function initTodayButton() {
    const now = new NepaliDate();
    const eng = new Date();
    document.getElementById('todayNp').textContent = `${nepaliMonths[now.getMonth()]} ${now.getDate()}`;
    document.getElementById('todayEn').textContent = `${englishMonths[eng.getMonth()]} ${eng.getDate()}`;
}

function populateDropdowns() {
    const mSelect = document.getElementById('monthSelect');
    const ySelect = document.getElementById('yearSelect');
    
    // Clear existing to prevent duplicates if re-run
    mSelect.innerHTML = '';
    ySelect.innerHTML = '';

    nepaliMonths.forEach((m, i) => mSelect.add(new Option(m, i)));
    for (let y = 2000; y <= 2090; y++) ySelect.add(new Option(y, y));
}

function goToToday() {
    triggerHaptic();
    const now = new NepaliDate();
    currentBsYear = now.getYear();
    currentBsMonth = now.getMonth();
    animationDir = null;
    selectDate(currentBsYear, currentBsMonth, now.getDate(), new Date());
    updateUI();
}

function selectDate(bsYear, bsMonth, bsDay, adDateObj) {
    triggerHaptic();
    selectedDate = { year: bsYear, month: bsMonth, day: bsDay };

    if (currentBsYear === bsYear && currentBsMonth === bsMonth) {
        renderCalendar();
    } else {
        currentBsYear = bsYear;
        currentBsMonth = bsMonth;
        updateUI();
    }
}

function jumpToSelection() {
    triggerHaptic();
    currentBsMonth = parseInt(document.getElementById('monthSelect').value);
    currentBsYear = parseInt(document.getElementById('yearSelect').value);
    animationDir = null;
    updateUI();
}

function changeMonth(offset) {
    triggerHaptic();
    if (offset > 0) animationDir = 'next';
    else animationDir = 'prev';

    currentBsMonth += offset;
    if (currentBsMonth > 11) { currentBsMonth = 0; currentBsYear++; }
    else if (currentBsMonth < 0) { currentBsMonth = 11; currentBsYear--; }
    updateUI();
}

function updateUI() {
    document.getElementById('monthSelect').value = currentBsMonth;
    document.getElementById('yearSelect').value = currentBsYear;
    renderCalendar();
}

function renderCalendar() {
    const calendarBody = document.getElementById('calendarBody');
    
    // Reset Animations
    calendarBody.classList.remove('anim-next', 'anim-prev');
    void calendarBody.offsetWidth; // Force Reflow
    
    if (animationDir === 'next') calendarBody.classList.add('anim-next');
    if (animationDir === 'prev') calendarBody.classList.add('anim-prev');
    
    calendarBody.innerHTML = '';
    const fragment = document.createDocumentFragment();

    const startBsDate = new NepaliDate(currentBsYear, currentBsMonth, 1);
    let iteratorAdDate = new Date(startBsDate.toJsDate());
    const startDayOfWeek = iteratorAdDate.getDay();

    let startEng = `${englishMonths[iteratorAdDate.getMonth()]} ${iteratorAdDate.getFullYear()}`;
    let endEng = "";

    let row = document.createElement('tr');
    for (let i = 0; i < startDayOfWeek; i++) row.appendChild(createCell(null));

    let dayCounter = 1;
    let keepLooping = true;
    let safetyLimit = 0;

    while (keepLooping && safetyLimit < 35) {
        if (row.children.length === 7) {
            fragment.appendChild(row);
            row = document.createElement('tr');
        }

        const today = new NepaliDate();
        const isToday = (currentBsYear === today.getYear() && currentBsMonth === today.getMonth() && dayCounter === today.getDate());
        const isSelected = (selectedDate.year === currentBsYear && selectedDate.month === currentBsMonth && selectedDate.day === dayCounter);
        const isSat = row.children.length === 6;
        const currentAdDate = new Date(iteratorAdDate);
        
        endEng = `${englishMonths[iteratorAdDate.getMonth()]} ${iteratorAdDate.getFullYear()}`;

        const adDate = iteratorAdDate.getDate();
        let engDisplayText = adDate;
        if (adDate === 1) {
            engDisplayText = `${englishMonths[iteratorAdDate.getMonth()]} ${adDate}`;
        }

        row.appendChild(createCell(dayCounter, engDisplayText, isToday, isSat, isSelected, currentAdDate));
        
        iteratorAdDate.setDate(iteratorAdDate.getDate() + 1);
        const nextDayBs = new NepaliDate(iteratorAdDate);
        
        if (nextDayBs.getMonth() !== currentBsMonth) keepLooping = false;
        else dayCounter++;
        
        safetyLimit++;
    }

    while (row.children.length < 7) row.appendChild(createCell(null));
    fragment.appendChild(row);
    calendarBody.appendChild(fragment);

    const rangeText = (startEng === endEng) ? startEng : `${startEng} - ${endEng}`;
    
    const rangeEl = document.getElementById('englishDateRange');
    rangeEl.className = "text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1";
    rangeEl.innerText = rangeText;
}

function createCell(nepaliText, englishText, isToday, isSaturday, isSelected, adDateObj) {
    const cell = document.createElement('td');
    let baseClass = "h-[13vh] md:h-24 align-top p-1 md:p-2 border border-gray-100 dark:border-gray-800 relative transition-colors cursor-pointer";
    
    if (!nepaliText) {
        cell.className = baseClass + " cursor-default bg-transparent";
        return cell;
    }

    // Attach click listener
    cell.addEventListener('click', () => selectDate(currentBsYear, currentBsMonth, nepaliText, adDateObj));

    if (isToday) {
        baseClass += " bg-blue-100 dark:bg-blue-900";
    } else {
        baseClass += " hover:bg-gray-50 dark:hover:bg-gray-900";
    }

    if (isSelected) {
        baseClass += " selected-ring rounded-lg";
    }

    cell.className = baseClass;
    const numColor = isSaturday ? "text-red-500" : "text-gray-700 dark:text-gray-200";

    cell.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full gap-1">
            <span class="text-xl md:text-3xl font-bold ${numColor} leading-none select-none">${nepaliText}</span>
            <span class="text-[10px] md:text-sm text-gray-400 dark:text-gray-500 font-medium select-none text-center">${englishText}</span>
        </div>
    `;
    return cell;
}

function setupSwipe() {
    const surface = document.getElementById('touchSurface');
    let tX = 0;
    surface.addEventListener('touchstart', e => tX = e.changedTouches[0].screenX, {passive: true});
    surface.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].screenX - tX;
        if (diff < -50) changeMonth(1);
        if (diff > 50) changeMonth(-1);
    }, {passive: true});
}

// Make functions available globally for HTML onclick attributes
window.goToToday = goToToday;
window.toggleDarkMode = toggleDarkMode;
window.changeMonth = changeMonth;
window.jumpToSelection = jumpToSelection;
