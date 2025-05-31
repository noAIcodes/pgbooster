// scripts/app.js

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggling
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('.theme-icon');

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    body.classList.add(savedTheme);
    themeIcon.textContent = savedTheme === 'dark-mode' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'dark-mode');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'light-mode');
        }
    });

    // Tab Navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panes
            navTabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab and corresponding pane
            tab.classList.add('active');
            const targetPaneId = tab.dataset.tab;
            document.getElementById(targetPaneId).classList.add('active');
        });
    });

    // Set current date
    const currentDateEl = document.getElementById('currentDate');
    if (currentDateEl) {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateEl.textContent = today.toLocaleDateString(undefined, options);
    }
    
    // Initialize other modules (will be expanded later)
    Storage.init();
    TaskManager.init();
    SpacedRepetition.init();
    
    // Modal Functionality
    const modalOverlay = document.getElementById('modalOverlay');
    const addNewTopicBtn = document.getElementById('addNewTopic');
    const modalCloseBtn = document.getElementById('modalClose');
    const cancelAddBtn = document.getElementById('cancelAdd');
    const addTopicForm = document.getElementById('addTopicForm');

    if (addNewTopicBtn) {
        addNewTopicBtn.addEventListener('click', () => {
            modalOverlay.classList.add('active');
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }
    
    if (cancelAddBtn) {
        cancelAddBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }

    if (addTopicForm) {
        addTopicForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const subject = document.getElementById('topicSubject').value;
            const name = document.getElementById('topicName').value;
            const reason = document.getElementById('topicReason').value;
            
            // Placeholder for adding topic to improvise list
            TaskManager.addToImproviseList({ subject, name, reason, id: Date.now().toString() });
            
            addTopicForm.reset();
            modalOverlay.classList.remove('active');
        });
    }
    
    // Custom Daily Task Modal Functionality
    const customTaskModalOverlay = document.getElementById('customTaskModalOverlay');
    const addCustomDailyTaskBtn = document.getElementById('addCustomDailyTaskBtn');
    const customTaskModalClose = document.getElementById('customTaskModalClose');
    const cancelAddCustomTask = document.getElementById('cancelAddCustomTask');
    const addCustomTaskForm = document.getElementById('addCustomTaskForm');

    if (addCustomDailyTaskBtn) {
        addCustomDailyTaskBtn.addEventListener('click', () => {
            if (customTaskModalOverlay) customTaskModalOverlay.classList.add('active');
        });
    }

    if (customTaskModalClose) {
        customTaskModalClose.addEventListener('click', () => {
            if (customTaskModalOverlay) customTaskModalOverlay.classList.remove('active');
        });
    }

    if (cancelAddCustomTask) {
        cancelAddCustomTask.addEventListener('click', () => {
            if (customTaskModalOverlay) customTaskModalOverlay.classList.remove('active');
        });
    }

    if (customTaskModalOverlay) {
        customTaskModalOverlay.addEventListener('click', (event) => {
            if (event.target === customTaskModalOverlay) {
                customTaskModalOverlay.classList.remove('active');
            }
        });
    }

    if (addCustomTaskForm) {
        addCustomTaskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const taskTextEl = document.getElementById('customDailyTaskText');
            const taskText = taskTextEl ? taskTextEl.value.trim() : '';
            
            if (taskText) {
                TaskManager.addCustomDailyTask(taskText);
                if (taskTextEl) taskTextEl.value = ''; // Clear input
                if (customTaskModalOverlay) customTaskModalOverlay.classList.remove('active');
            } else {
                // Optionally, provide feedback that task text cannot be empty
                alert("Please enter a task description.");
            }
        });
    }

    // Initial UI Updates (placeholders for now)
    updateProgressCircle(0); // Example: 0% progress
    updateBadges(0, 0, 0); // Example: 0 items in backlog, revision, improvise
});

// Helper function to update progress circle (will be moved to taskManager.js later)
function updateProgressCircle(percentage) {
    const progressCircle = document.getElementById('progressCircle');
    const progressText = document.getElementById('progressText');
    if (progressCircle && progressText) {
        const radius = progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = offset;
        progressText.textContent = `${Math.round(percentage)}%`;
    }
}

// Helper function to update badges (will be moved to taskManager.js later)
function updateBadges(backlogCount, revisionCount, improviseCount) {
    const backlogBadge = document.getElementById('backlogBadge');
    const revisionBadge = document.getElementById('revisionBadge');
    const improviseBadge = document.getElementById('improviseBadge');

    if (backlogBadge) backlogBadge.textContent = backlogCount;
    if (revisionBadge) revisionBadge.textContent = revisionCount;
    if (improviseBadge) improviseBadge.textContent = improviseCount;
}

// Add SVG definitions for gradients to the body
// This is a workaround because CSS url() for gradients in SVG strokes can be tricky
// and often requires the <defs> to be in the HTML.
function addSvgDefs() {
    const svgDefs = `
    <svg width="0" height="0" style="position:absolute;visibility:hidden;">
      <defs>
        <linearGradient id="progressGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#007bff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#6f42c1;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="progressGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--primary-cyan);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--primary-magenta);stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>
    `;
    document.body.insertAdjacentHTML('beforeend', svgDefs);
}

addSvgDefs();