// scripts/taskManager.js

const TaskManager = (() => {
    const defaultUserProgress = {
        currentDay: 1,
        completedTasks: [],
        backlogTasks: [],
        revisionTasks: [],
        improviseList: [],
        customDailyTasks: {}, // Added default for custom tasks
        darkMode: false,
        lastActive: Date.now()
    };
    let storedUserProgress = Storage.getItem('userProgress');
    let userProgress = {
        ...defaultUserProgress,
        ...(storedUserProgress || {})
    };
    // Ensure customDailyTasks is always an object if userProgress was loaded and didn't have it
    // This handles cases where userProgress exists from an older version of the app
    if (userProgress.customDailyTasks === undefined) {
        userProgress.customDailyTasks = {};
    }
    // Also ensure other potentially missing arrays are initialized if loaded from a very old state
    userProgress.completedTasks = userProgress.completedTasks || [];
    userProgress.backlogTasks = userProgress.backlogTasks || [];
    userProgress.revisionTasks = userProgress.revisionTasks || [];
    userProgress.improviseList = userProgress.improviseList || [];
    let studyPlanProgress = Storage.getItem('studyPlanProgress') || {};

    const dailySubjectEl = document.getElementById('dailySubject');
    const subjectNameEl = document.getElementById('subjectName');
    const topicTitleEl = document.getElementById('topicTitle');
    const topicDescriptionEl = document.getElementById('topicDescription'); // Not used in current HTML, but good to have
    const dailyChecklistEl = document.getElementById('dailyChecklist');
    const currentDayEl = document.getElementById('currentDay');
    const completedTasksEl = document.getElementById('completedTasks');
    const totalTasksEl = document.getElementById('totalTasks');
    const markTopicCompleteBtn = document.getElementById('markTopicComplete');
    const addToImproviseBtn = document.getElementById('addToImprovise');

    const backlogContentEl = document.getElementById('backlogContent');
    const revisionContentEl = document.getElementById('revisionContent');
    const improviseContentEl = document.getElementById('improviseContent');
    const improviseTodayEl = document.getElementById('improviseToday');


    const loadDay = (dayNumber) => {
        userProgress.currentDay = dayNumber;
        if (currentDayEl) currentDayEl.textContent = dayNumber;

        const dayPlan = StudyPlan.getDayPlan(dayNumber); // Pre-defined plan
        
        const currentDayKey = `day${dayNumber}`;
        const customTasksForDay = userProgress.customDailyTasks[currentDayKey] || [];

        if (!dayPlan && customTasksForDay.length === 0) { // If no pre-defined plan AND no custom tasks
            console.warn(`No plan or custom tasks found for day ${dayNumber}`); // Changed to warn
            if (dailySubjectEl) dailySubjectEl.innerHTML = ""; // Clear subject card content
            if (subjectNameEl) subjectNameEl.textContent = "No Plan";
            if (topicTitleEl) topicTitleEl.textContent = "No tasks scheduled for today.";
            if (dailyChecklistEl) dailyChecklistEl.innerHTML = '<p class="empty-checklist">No tasks for today. Add some custom tasks!</p>';
            
            // Call update functions with empty/null data
            updateDailyStats([], []);
            updateTopicCompletionStatus(null, []);
            Storage.setItem('userProgress', userProgress); // Save userProgress (e.g. currentDay update)
            return;
        }
        
        // If dayPlan exists, populate subject and topic, otherwise use defaults
        if (dayPlan) {
            if (dailySubjectEl && dailySubjectEl.innerHTML.includes("No tasks for today")) dailySubjectEl.innerHTML = ''; // Reset if previously empty
            if (subjectNameEl) subjectNameEl.textContent = dayPlan.subject;
            if (topicTitleEl) topicTitleEl.textContent = dayPlan.topic;
        } else {
            if (dailySubjectEl && dailySubjectEl.innerHTML.includes("No tasks for today")) dailySubjectEl.innerHTML = ''; // Reset
            if (subjectNameEl) subjectNameEl.textContent = "Custom Tasks";
            if (topicTitleEl) topicTitleEl.textContent = "Your tasks for the day";
        }

        // Combine tasks
        const predefinedTasks = dayPlan ? dayPlan.checklist.map((item, index) => ({
            id: `day${dayPlan.day}-task${index}`,
            text: item,
            type: 'predefined',
        })) : [];

        // Ensure custom tasks also have a 'type' if they don't (e.g. from older storage)
        const typedCustomTasksForDay = customTasksForDay.map(task => ({...task, type: 'custom'}));
        const combinedTasks = [...predefinedTasks, ...typedCustomTasksForDay];

        renderChecklist(combinedTasks, dayPlan ? dayPlan.day : dayNumber);
        updateDailyStats(predefinedTasks, typedCustomTasksForDay);
        updateTopicCompletionStatus(dayPlan, predefinedTasks);
        
        Storage.setItem('userProgress', userProgress);
    };

    const renderChecklist = (combinedTasks, currentDayNumber) => {
        if (!dailyChecklistEl) return;
        dailyChecklistEl.innerHTML = '';

        if (!combinedTasks || combinedTasks.length === 0) {
            dailyChecklistEl.innerHTML = '<p class="empty-checklist">No tasks for today. Add some custom tasks!</p>';
            return;
        }

        combinedTasks.forEach((task) => {
            let taskId = task.id;
            let isCompleted;

            if (task.type === 'predefined') {
                isCompleted = userProgress.completedTasks.includes(taskId);
            } else {
                isCompleted = task.completed;
            }

            const li = document.createElement('div');
            li.classList.add('checklist-item');
            if (isCompleted) {
                li.classList.add('completed');
            }
            li.dataset.taskId = taskId;
            li.dataset.taskType = task.type;

            const checkbox = document.createElement('span');
            checkbox.classList.add('checklist-checkbox');
            if (isCompleted) {
                checkbox.classList.add('checked');
                checkbox.innerHTML = '✓';
            }
            
            const label = document.createElement('span');
            label.classList.add('checklist-label');
            label.textContent = task.text;

            li.appendChild(checkbox);
            li.appendChild(label);
            
            li.addEventListener('click', () => toggleTaskCompletion(taskId, task.type, currentDayNumber));
            dailyChecklistEl.appendChild(li);
        });
    };

    const toggleTaskCompletion = (taskId, taskType, currentDayNumber) => {
        const checklistItemEl = dailyChecklistEl.querySelector(`[data-task-id="${taskId}"]`);
        const checkboxEl = checklistItemEl.querySelector('.checklist-checkbox');
        const currentDayKey = `day${currentDayNumber}`;

        if (taskType === 'custom') {
            const customTasksForDay = userProgress.customDailyTasks[currentDayKey] || [];
            const taskIndex = customTasksForDay.findIndex(t => t.id === taskId);
            if (taskIndex > -1) {
                customTasksForDay[taskIndex].completed = !customTasksForDay[taskIndex].completed;
                if (customTasksForDay[taskIndex].completed) {
                    checklistItemEl.classList.add('completed');
                    checkboxEl.classList.add('checked');
                    checkboxEl.innerHTML = '✓';
                } else {
                    checklistItemEl.classList.remove('completed');
                    checkboxEl.classList.remove('checked');
                    checkboxEl.innerHTML = '';
                }
            }
        } else { // 'predefined'
            const taskIndexInCompleted = userProgress.completedTasks.indexOf(taskId);
            if (taskIndexInCompleted > -1) {
                userProgress.completedTasks.splice(taskIndexInCompleted, 1);
                checklistItemEl.classList.remove('completed');
                checkboxEl.classList.remove('checked');
                checkboxEl.innerHTML = '';
            } else {
                userProgress.completedTasks.push(taskId);
                checklistItemEl.classList.add('completed');
                checkboxEl.classList.add('checked');
                checkboxEl.innerHTML = '✓';
            }
        }
        
        Storage.setItem('userProgress', userProgress);

        const dayPlan = StudyPlan.getDayPlan(currentDayNumber);
        const customTasks = userProgress.customDailyTasks[currentDayKey] || [];
        const predefinedTasks = dayPlan ? dayPlan.checklist.map((item, index) => ({
            id: `day${dayPlan.day}-task${index}`,
            text: item,
            type: 'predefined'
        })) : [];
        const typedCustomTasks = customTasks.map(task => ({...task, type: 'custom'}));


        updateDailyStats(predefinedTasks, typedCustomTasks);
        updateTopicCompletionStatus(dayPlan, predefinedTasks);
    };
    
    const updateDailyStats = (predefinedTasks, customTasksForDay) => {
        const completedPredefined = predefinedTasks.filter(task =>
            userProgress.completedTasks.includes(task.id)
        ).length;
        
        const completedCustom = customTasksForDay.filter(task => task.completed).length;
        
        const totalCompleted = completedPredefined + completedCustom;
        const totalTasks = predefinedTasks.length + customTasksForDay.length;

        if (completedTasksEl) completedTasksEl.textContent = totalCompleted;
        if (totalTasksEl) totalTasksEl.textContent = totalTasks;
        
        const overallPercentage = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;
        updateProgressCircle(overallPercentage);
    };

    const updateTopicCompletionStatus = (dayPlan, predefinedTasks) => {
        if (!dayPlan) {
            if (markTopicCompleteBtn) {
                markTopicCompleteBtn.textContent = 'Mark Topic Complete';
                markTopicCompleteBtn.disabled = true;
                markTopicCompleteBtn.classList.remove('btn-success');
            }
            return;
        }

        const totalPredefinedTasks = dayPlan.checklist.length;
        // Count completed predefined tasks based on the passed predefinedTasks list and userProgress
        const completedPredefinedTasks = predefinedTasks.filter(task =>
            userProgress.completedTasks.includes(task.id)
        ).length;

        const isTopicCompleted = totalPredefinedTasks > 0 && completedPredefinedTasks === totalPredefinedTasks;
        const topicId = `day${dayPlan.day}-topic`;

        if (isTopicCompleted) {
            if (markTopicCompleteBtn) {
                markTopicCompleteBtn.textContent = 'Topic Completed!';
                markTopicCompleteBtn.disabled = true;
                markTopicCompleteBtn.classList.add('btn-success');
            }
            studyPlanProgress[topicId] = 'completed';
            SpacedRepetition.scheduleRevision(dayPlan);
        } else {
             if (markTopicCompleteBtn) {
                markTopicCompleteBtn.textContent = 'Mark Topic Complete';
                markTopicCompleteBtn.disabled = totalPredefinedTasks === 0;
                markTopicCompleteBtn.classList.remove('btn-success');
            }
            if (totalPredefinedTasks > 0) { // Only set to pending if there are tasks
                 studyPlanProgress[topicId] = 'pending';
            }
        }
        Storage.setItem('studyPlanProgress', studyPlanProgress);
    };
    
    if (markTopicCompleteBtn) {
        markTopicCompleteBtn.addEventListener('click', () => {
            const dayPlan = StudyPlan.getDayPlan(userProgress.currentDay);
            if (!dayPlan) return;

            // Mark all tasks for the current day's topic as complete
            dayPlan.checklist.forEach((_, index) => {
                const taskId = `day${dayPlan.day}-task${index}`;
                if (!userProgress.completedTasks.includes(taskId)) {
                    userProgress.completedTasks.push(taskId);
                }
            });
            // After marking predefined tasks complete...
            const currentDayKey = `day${userProgress.currentDay}`;
            const customTasks = (userProgress.customDailyTasks[currentDayKey] || []).map(task => ({...task, type: 'custom'}));
            const updatedPredefinedTasks = dayPlan.checklist.map((item, index) => ({
                id: `day${dayPlan.day}-task${index}`,
                text: item,
                type: 'predefined'
            }));
            const combined = [...updatedPredefinedTasks, ...customTasks];
            
            renderChecklist(combined, dayPlan.day);
            updateDailyStats(updatedPredefinedTasks, customTasks);
            updateTopicCompletionStatus(dayPlan, updatedPredefinedTasks);
            Storage.setItem('userProgress', userProgress);
        });
    }

    if (addToImproviseBtn) {
        addToImproviseBtn.addEventListener('click', () => {
            const dayPlan = StudyPlan.getDayPlan(userProgress.currentDay);
            if (!dayPlan) return;
            
            const newImproviseTopic = {
                id: `improvise-${Date.now()}`,
                subject: dayPlan.subject,
                name: dayPlan.topic,
                reason: "Marked from daily target.",
                addedDate: Date.now()
            };
            addToImproviseList(newImproviseTopic);
            alert(`${dayPlan.topic} added to your Special Improvise List!`);
        });
    }
    
    const addToImproviseList = (topicData) => {
        // Check if topic already exists (by name and subject for simplicity)
        const exists = userProgress.improviseList.some(
            item => item.name === topicData.name && item.subject === topicData.subject
        );
        if (!exists) {
            userProgress.improviseList.push(topicData);
            Storage.setItem('userProgress', userProgress);
            renderImproviseList();
            updateBadgesCount();
        } else {
            console.warn("Topic already in improvise list:", topicData.name);
        }
    };

    const renderImproviseList = () => {
        if (!improviseContentEl) return;
        improviseContentEl.innerHTML = ''; // Clear previous list

        if (userProgress.improviseList.length === 0) {
            improviseContentEl.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⚡</div>
                    <h3>No topics in improvise list</h3>
                    <p>Add topics you find challenging to focus on them.</p>
                </div>`;
            return;
        }

        userProgress.improviseList.forEach(topic => {
            const card = createTaskCard(topic, 'improvise');
            improviseContentEl.appendChild(card);
        });
        renderImprovisePrompt();
    };
    
    const renderImprovisePrompt = () => {
        if (!improviseTodayEl) return;
        improviseTodayEl.innerHTML = '';
        
        const suggestions = userProgress.improviseList.slice(0, 2); // Suggest first 2
        if (suggestions.length > 0) {
            suggestions.forEach(topic => {
                const el = document.createElement('div');
                el.classList.add('suggestion-item');
                el.textContent = `${topic.subject}: ${topic.name}`;
                improviseTodayEl.appendChild(el);
            });
        } else {
            improviseTodayEl.innerHTML = '<p>Your improvise list is empty. Add some topics!</p>';
        }
    };

    const renderBacklog = () => {
        if (!backlogContentEl) return;
        backlogContentEl.innerHTML = '';
        
        // Logic to determine backlog tasks (e.g., tasks from previous days not completed)
        // This is a simplified version. A more robust check would involve checking studyPlanProgress
        // and individual task completion from previous days.
        const backlogTasksData = userProgress.backlogTasks.map(taskId => {
            // This requires a way to get task details from taskId.
            // For now, let's assume backlogTasks stores full task objects or can retrieve them.
            // This part needs more robust data handling.
            const dayNum = parseInt(taskId.match(/day(\d+)/)[1]);
            const taskIdx = parseInt(taskId.match(/task(\d+)/)[1]);
            const dayPlan = StudyPlan.getDayPlan(dayNum);
            if (!dayPlan || !dayPlan.checklist[taskIdx]) return null;
            return {
                id: taskId,
                name: dayPlan.checklist[taskIdx],
                subject: dayPlan.subject,
                topic: dayPlan.topic,
                day: dayNum
            };
        }).filter(Boolean);


        if (backlogTasksData.length === 0) {
            backlogContentEl.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h3>No backlog tasks</h3>
                    <p>Great job! You're up to date with your studies.</p>
                </div>`;
            return;
        }
        backlogTasksData.forEach(task => {
            const card = createTaskCard(task, 'backlog');
            backlogContentEl.appendChild(card);
        });
    };
    
    // Generic task card renderer
    const createTaskCard = (task, type) => {
        const card = document.createElement('div');
        card.classList.add('task-card', 'glass-card');
        card.dataset.id = task.id;

        let title = task.name; // For improvise list items
        let details = `Subject: ${task.subject}`;
        if (type === 'backlog' || type === 'revision') { // Backlog/Revision items are specific tasks/topics
            title = `${task.topic} (Day ${task.day})`;
            // For revision, task.name is topicName, which is already in task.topic (title).
            // For backlog, task.name is the specific checklist item text.
            details = `Subject: ${task.subject}${type === 'backlog' ? ` - Task: ${task.name}` : ''}`;
        }
        if (type === 'revision') {
            details += `<br>Revision due: ${new Date(task.nextRevisionDate).toLocaleDateString()}`;
        }


        card.innerHTML = `
            <div class="task-card-header">
                <h4 class="task-card-title">${title}</h4>
                ${type === 'improvise' ? `<span class="task-card-subject">${task.subject}</span>` : ''}
            </div>
            <p class="task-card-body">${details}</p>
            ${task.reason ? `<p class="task-card-reason"><em>Reason: ${task.reason}</em></p>` : ''}
            <div class="task-card-actions">
                ${type === 'backlog' ? `<button class="btn btn-primary btn-sm complete-backlog-task">Complete Task</button>` : ''}
                ${type === 'revision' ? `<button class="btn btn-primary btn-sm complete-revision-task">Mark Revised</button>` : ''}
                ${type === 'improvise' ? `<button class="btn btn-primary btn-sm start-improvise-task">Study Now</button>` : ''}
                <button class="btn btn-secondary btn-sm remove-task-item">Remove</button>
            </div>
        `;
        
        // Add event listeners for actions
        const completeBtn = card.querySelector('.complete-backlog-task, .complete-revision-task, .start-improvise-task');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => {
                // Handle completion based on type
                if (type === 'backlog') {
                    // Mark original task as complete, remove from backlog
                    // This needs to link back to the original checklist item
                    console.log("Completing backlog task:", task.id);
                    // toggleTaskCompletion(task.id, StudyPlan.getDayPlan(task.day)); // This might be complex
                    userProgress.backlogTasks = userProgress.backlogTasks.filter(id => id !== task.id);
                    Storage.setItem('userProgress', userProgress);
                    renderBacklog();
                } else if (type === 'revision') {
                    SpacedRepetition.markRevised(task.id);
                } else if (type === 'improvise') {
                    // Potentially load this topic into a study view or just remove
                    console.log("Starting improvise task:", task.name);
                }
                updateBadgesCount();
            });
        }

        const removeBtn = card.querySelector('.remove-task-item');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                if (type === 'improvise') {
                    userProgress.improviseList = userProgress.improviseList.filter(item => item.id !== task.id);
                    Storage.setItem('userProgress', userProgress);
                    renderImproviseList();
                    updateBadgesCount();
                } else if (type === 'backlog') {
                     userProgress.backlogTasks = userProgress.backlogTasks.filter(id => id !== task.id);
                     Storage.setItem('userProgress', userProgress);
                     renderBacklog();
                     updateBadgesCount();
                } else if (type === 'revision') {
                    SpacedRepetition.removeRevision(task.id); // Use the new encapsulated function
                    // SpacedRepetition.removeRevision handles setUserProgress, renderRevisionList, and updateBadgesCount
                }
                // Storage.setItem and updateBadgesCount are now handled within each specific type block or by the delegated function.
            });
        }
        return card;
    };
    
    const updateBadgesCount = () => {
        const backlogCount = userProgress.backlogTasks.length;
        const revisionCount = userProgress.revisionTasks.filter(t => new Date(t.nextRevisionDate) <= new Date()).length; // Count only due revisions
        const improviseCount = userProgress.improviseList.length;
        updateBadges(backlogCount, revisionCount, improviseCount); // app.js function
    };
    
    // Check for overdue tasks and move to backlog
    const manageBacklog = () => {
        const today = userProgress.currentDay;
        for (let day = 1; day < today; day++) {
            const dayPlan = StudyPlan.getDayPlan(day);
            if (!dayPlan) continue;

            const topicId = `day${day}-topic`;
            if (studyPlanProgress[topicId] !== 'completed') {
                // If entire topic not marked complete, add its tasks to backlog
                dayPlan.checklist.forEach((taskItem, index) => {
                    const taskId = `day${day}-task${index}`;
                    if (!userProgress.completedTasks.includes(taskId) && !userProgress.backlogTasks.includes(taskId)) {
                        userProgress.backlogTasks.push(taskId);
                    }
                });
            }
        }
        Storage.setItem('userProgress', userProgress);
        renderBacklog();
        updateBadgesCount();
    };

    const addCustomDailyTask = (taskText) => {
        const currentDayKey = `day${userProgress.currentDay}`;
        if (!userProgress.customDailyTasks[currentDayKey]) {
            userProgress.customDailyTasks[currentDayKey] = [];
        }

        const newTask = {
            id: `custom_${Date.now()}`,
            text: taskText,
            completed: false,
            type: 'custom' // Added type for differentiation
        };

        userProgress.customDailyTasks[currentDayKey].push(newTask);
        Storage.setItem('userProgress', userProgress);
        loadDay(userProgress.currentDay); // Refresh the current day's view
    };

    const init = () => {
        // Load user's current day or default to 1
        loadDay(userProgress.currentDay);
        manageBacklog(); // Check for any tasks to move to backlog
        renderImproviseList();
        // SpacedRepetition.init() will call its own render method
        updateBadgesCount();

    };

    return {
        init,
        loadDay,
        addCustomDailyTask, // Exposed for adding custom daily tasks
        addToImproviseList, // Expose for direct use if needed
        renderImproviseList,
        renderBacklog,
        createTaskCard, // Expose for SpacedRepetition module
        updateBadgesCount,
        getUserProgress: () => userProgress, // For SpacedRepetition
        getStudyPlanProgress: () => studyPlanProgress, // For SpacedRepetition
        setUserProgress: (newProgress) => { // For SpacedRepetition
            userProgress = newProgress;
            Storage.setItem('userProgress', userProgress);
        }
    };
})();

// Initialize TaskManager after DOM is loaded (app.js might call this)
// Or ensure DOM elements are available if called directly.
// document.addEventListener('DOMContentLoaded', TaskManager.init);
// For now, app.js will handle the main init sequence.