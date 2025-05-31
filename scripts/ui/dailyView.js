// scripts/ui/dailyView.js

const DailyView = (() => {
    // DOM Elements specific to the Daily View
    const dailySubjectEl = document.getElementById('dailySubject');
    const subjectNameEl = document.getElementById('subjectName');
    const topicTitleEl = document.getElementById('topicTitle');
    // const topicDescriptionEl = document.getElementById('topicDescription'); // Not currently used in HTML
    const dailyChecklistEl = document.getElementById('dailyChecklist');
    const currentDayTextEl = document.getElementById('currentDay'); // Renamed to avoid conflict if TaskManager also has 'currentDayEl'
    const completedTasksTextEl = document.getElementById('completedTasks'); // Renamed
    const totalTasksTextEl = document.getElementById('totalTasks'); // Renamed
    const markTopicCompleteBtn = document.getElementById('markTopicComplete');
    // const addToImproviseBtn = document.getElementById('addToImprovise'); // This button's logic might stay in TaskManager or be passed as a callback

    let currentDayPlan = null;
    let currentTaskManagerRef = null; // To call back to TaskManager for state changes

    const renderDay = (dayPlan, userProgress, taskManagerRef) => {
        currentDayPlan = dayPlan;
        currentTaskManagerRef = taskManagerRef;

        if (!dayPlan) {
            console.error("DailyView: No day plan provided.");
            if (dailySubjectEl) dailySubjectEl.innerHTML = "<p>No plan for today.</p>"; // Or handle end of plan
            return;
        }
        
        if (currentDayTextEl) currentDayTextEl.textContent = dayPlan.day;
        if (subjectNameEl) subjectNameEl.textContent = dayPlan.subject;
        if (topicTitleEl) topicTitleEl.textContent = dayPlan.topic;
        // if (topicDescriptionEl) topicDescriptionEl.textContent = `Key areas: ${dayPlan.subtopics.join(', ')}`;

        renderChecklist(dayPlan, userProgress);
        updateDailyStats(dayPlan, userProgress);
        updateTopicCompletionButton(dayPlan, userProgress);
    };

    const renderChecklist = (dayPlan, userProgress) => {
        if (!dailyChecklistEl) return;
        dailyChecklistEl.innerHTML = ''; 

        dayPlan.checklist.forEach((item, index) => {
            const taskId = `day${dayPlan.day}-task${index}`;
            const isCompleted = userProgress.completedTasks.includes(taskId);

            const li = document.createElement('div');
            li.classList.add('checklist-item');
            if (isCompleted) li.classList.add('completed');
            li.dataset.taskId = taskId;

            const checkbox = document.createElement('span');
            checkbox.classList.add('checklist-checkbox');
            if (isCompleted) {
                checkbox.classList.add('checked');
                checkbox.innerHTML = '✓';
            }
            
            const label = document.createElement('span');
            label.classList.add('checklist-label');
            label.textContent = item;

            li.appendChild(checkbox);
            li.appendChild(label);

            li.addEventListener('click', () => {
                if (currentTaskManagerRef) {
                    currentTaskManagerRef.toggleTaskCompletion(taskId, dayPlan);
                    // TaskManager will then call back to update DailyView if needed, or DailyView updates itself
                    // For now, let TaskManager handle re-rendering or calling specific update functions.
                }
            });
            dailyChecklistEl.appendChild(li);
        });
    };

    const updateDailyStats = (dayPlan, userProgress) => {
        if (!dayPlan) dayPlan = currentDayPlan; // Use stored if not passed
        if (!dayPlan) return;

        const total = dayPlan.checklist.length;
        const completed = dayPlan.checklist.filter((_, index) => 
            userProgress.completedTasks.includes(`day${dayPlan.day}-task${index}`)
        ).length;

        if (completedTasksTextEl) completedTasksTextEl.textContent = completed;
        if (totalTasksTextEl) totalTasksTextEl.textContent = total;
        
        const overallPercentage = total > 0 ? (completed / total) * 100 : 0;
        // Assuming updateProgressCircle is a global function or part of app.js for now
        if (typeof updateProgressCircle === 'function') {
            updateProgressCircle(overallPercentage);
        }
    };

    const updateTopicCompletionButton = (dayPlan, userProgress) => {
        if (!dayPlan) dayPlan = currentDayPlan; // Use stored if not passed
        if (!dayPlan || !markTopicCompleteBtn) return;

        const totalTasks = dayPlan.checklist.length;
        const completedTasks = dayPlan.checklist.filter((_, index) => 
            userProgress.completedTasks.includes(`day${dayPlan.day}-task${index}`)
        ).length;
        
        const isTopicConsideredComplete = completedTasks === totalTasks && totalTasks > 0;

        if (isTopicConsideredComplete) {
            markTopicCompleteBtn.textContent = 'Topic Completed!';
            markTopicCompleteBtn.disabled = true;
            markTopicCompleteBtn.classList.add('btn-success'); // Ensure this class is defined
        } else {
            markTopicCompleteBtn.textContent = 'Mark Topic Complete';
            markTopicCompleteBtn.disabled = totalTasks === 0; // Disable if no tasks
            markTopicCompleteBtn.classList.remove('btn-success');
        }
    };
    
    // Event listeners for buttons specific to DailyView can be initialized here
    const initEventListeners = (taskManagerRef) => {
        currentTaskManagerRef = taskManagerRef;
        if (markTopicCompleteBtn) {
            markTopicCompleteBtn.addEventListener('click', () => {
                if (currentTaskManagerRef && currentDayPlan) {
                    currentTaskManagerRef.markDailyTopicComplete(currentDayPlan);
                }
            });
        }

        // addToImproviseBtn is handled by TaskManager as it directly modifies improviseList
    };

    return {
        renderDay,
        renderChecklist, // Expose if TaskManager needs to call it directly after a task toggle
        updateDailyStats, // Expose for same reason
        updateTopicCompletionButton, // Expose for same reason
        initEventListeners
    };
})();