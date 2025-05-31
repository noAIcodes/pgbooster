// scripts/ui/backlogView.js

const BacklogView = (() => {
    const backlogContentEl = document.getElementById('backlogContent');
    let currentTaskManagerRef = null;
    let currentStudyPlanRef = null; // To get day plan details

    const renderBacklog = (backlogTaskIds, userProgress, taskManagerRef, studyPlanRef) => {
        if (!backlogContentEl) return;
        if (taskManagerRef) currentTaskManagerRef = taskManagerRef;
        if (studyPlanRef) currentStudyPlanRef = studyPlanRef;

        backlogContentEl.innerHTML = '';

        const backlogTasksData = backlogTaskIds.map(taskId => {
            // Extract day number and task index from taskId (e.g., "day5-task2")
            const match = taskId.match(/day(\d+)-task(\d+)/);
            if (!match) {
                console.warn(`Invalid taskId format in backlog: ${taskId}`);
                return null;
            }
            const dayNum = parseInt(match);
            const taskIdx = parseInt(match);
            
            if (!currentStudyPlanRef || typeof currentStudyPlanRef.getDayPlan !== 'function') {
                 console.error("BacklogView: StudyPlan reference or getDayPlan method not available.");
                 return null;
            }
            const dayPlan = currentStudyPlanRef.getDayPlan(dayNum);

            if (!dayPlan || !dayPlan.checklist || taskIdx >= dayPlan.checklist.length) {
                console.warn(`Could not find plan or task for backlog item: ${taskId}`);
                return null;
            }
            return {
                id: taskId, // This is the specific checklist item ID
                name: dayPlan.checklist[taskIdx], // The text of the checklist item
                subject: dayPlan.subject,
                topic: dayPlan.topic, // The main topic for that day
                day: dayNum
            };
        }).filter(Boolean); // Remove any nulls from failed lookups


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
            if (currentTaskManagerRef && typeof currentTaskManagerRef.createTaskCard === 'function') {
                const card = currentTaskManagerRef.createTaskCard(task, 'backlog');
                backlogContentEl.appendChild(card);
            } else {
                console.error("BacklogView: TaskManager reference or createTaskCard method not available.");
            }
        });
    };

    const initEventListeners = (taskManagerRef) => {
        currentTaskManagerRef = taskManagerRef;
        // Actions on backlog cards are handled by event listeners 
        // set up in TaskManager.createTaskCard.
    };

    return {
        renderBacklog,
        initEventListeners
    };
})();