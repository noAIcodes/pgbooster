// scripts/storage.js

const Storage = (() => {
    const APP_PREFIX = 'neetPgBooster_';

    const getItem = (key) => {
        try {
            const item = localStorage.getItem(APP_PREFIX + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error getting item ${key} from localStorage:`, error);
            return null;
        }
    };

    const setItem = (key, value) => {
        try {
            localStorage.setItem(APP_PREFIX + key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting item ${key} in localStorage:`, error);
        }
    };

    const removeItem = (key) => {
        try {
            localStorage.removeItem(APP_PREFIX + key);
        } catch (error) {
            console.error(`Error removing item ${key} from localStorage:`, error);
        }
    };

    const clearAll = () => {
        try {
            // Be cautious with this, only clear app-specific data
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(APP_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Error clearing app data from localStorage:', error);
        }
    };
    
    // Initialize with default data if not present
    const init = () => {
        if (!getItem('userProgress')) {
            setItem('userProgress', {
                currentDay: 1,
                completedTasks: [], // Store task IDs
                backlogTasks: [],   // Store task IDs
                revisionTasks: [],  // Store task IDs with revision dates
                improviseList: [],  // Store improvise topic objects
                customDailyTasks: {}, // Stores user-added tasks for each day
                darkMode: document.body.classList.contains('dark-mode'), // Sync with initial theme
                lastActive: Date.now()
            });
        }
        if (!getItem('studyPlanProgress')) {
            // This will store completion status for each day's main topic
            // e.g., { day1: 'completed', day2: 'pending' }
            setItem('studyPlanProgress', {}); 
        }
    };

    return {
        getItem,
        setItem,
        removeItem,
        clearAll,
        init
    };
})();

// Initialize storage on load
Storage.init();