// scripts/ui/commonUIView.js

const CommonUIView = (() => {
    let currentTaskManagerRef = null;
    let currentSpacedRepetitionRef = null;
    let currentImproviseViewRef = null;
    let currentBacklogViewRef = null;

    // To store references to other modules for callbacks
    const initRefs = (taskManager, spacedRepetition, improviseView, backlogView) => {
        currentTaskManagerRef = taskManager;
        currentSpacedRepetitionRef = spacedRepetition;
        currentImproviseViewRef = improviseView;
        currentBacklogViewRef = backlogView;
    };

    const createTaskCard = (task, type) => {
        const card = document.createElement('div');
        card.classList.add('task-card', 'glass-card');
        card.dataset.id = task.id;

        let title = task.name; 
        let details = `Subject: ${task.subject}`;
        if (type === 'backlog' || type === 'revision') {
            title = `${task.topic || task.name} (Day ${task.day})`; // task.topic for backlog, task.name for revision if it's topicName
            details = `Subject: ${task.subject}`;
            if (type === 'backlog') details += ` - Task: ${task.name}`; // task.name is the checklist item text for backlog
        }
        if (type === 'revision' && task.nextRevisionDate) {
            details += `<br>Revision due: ${new Date(task.nextRevisionDate).toLocaleDateString()}`;
        }

        card.innerHTML = `
            <div class="task-card-header">
                <h4 class="task-card-title">${title}</h4>
                ${type === 'improvise' ? `<span class="task-card-subject">${task.subject}</span>` : ''}
            </div>
            <p class="task-card-body">${details}</p>
            ${task.reason && type === 'improvise' ? `<p class="task-card-reason"><em>Reason: ${task.reason}</em></p>` : ''}
            <div class="task-card-actions">
                ${type === 'backlog' ? `<button class="btn btn-primary btn-sm complete-backlog-task" data-task-id="${task.id}" data-day-num="${task.day}">Complete Task</button>` : ''}
                ${type === 'revision' ? `<button class="btn btn-primary btn-sm complete-revision-task" data-topic-id="${task.id}">Mark Revised</button>` : ''}
                ${type === 'improvise' ? `<button class="btn btn-primary btn-sm start-improvise-task" data-task-id="${task.id}">Study Now</button>` : ''}
                <button class="btn btn-secondary btn-sm remove-task-item" data-task-id="${task.id}" data-type="${type}">Remove</button>
            </div>
        `;
        
        const actionButton = card.querySelector('.btn-primary');
        if (actionButton) {
            actionButton.addEventListener('click', (e) => {
                if (!currentTaskManagerRef) return;
                const taskId = e.target.dataset.taskId || e.target.dataset.topicId;

                if (type === 'backlog') {
                    const dayNum = parseInt(e.target.dataset.dayNum);
                    currentTaskManagerRef.completeBacklogTask(taskId, dayNum);
                } else if (type === 'revision') {
                    if (currentSpacedRepetitionRef) currentSpacedRepetitionRef.markRevised(taskId);
                } else if (type === 'improvise') {
                    currentTaskManagerRef.startImproviseTask(taskId);
                }
            });
        }

        const removeButton = card.querySelector('.remove-task-item');
        if (removeButton) {
            removeButton.addEventListener('click', (e) => {
                if (!currentTaskManagerRef) return;
                const taskId = e.target.dataset.taskId;
                const taskType = e.target.dataset.type;
                currentTaskManagerRef.removeTaskFromList(taskId, taskType);
            });
        }
        return card;
    };

    // updateBadges function (moved from app.js for centralization)
    const updateBadges = (backlogCount, revisionCount, improviseCount) => {
        const backlogBadge = document.getElementById('backlogBadge');
        const revisionBadge = document.getElementById('revisionBadge');
        const improviseBadge = document.getElementById('improviseBadge');

        if (backlogBadge) backlogBadge.textContent = backlogCount;
        if (revisionBadge) revisionBadge.textContent = revisionCount;
        if (improviseBadge) improviseBadge.textContent = improviseCount;
    };
    
    // updateBadgesCount function (adapted from TaskManager)
    // It now calls the local updateBadges
    const updateBadgesCount = (userProgress) => {
        if (!userProgress) {
            if(currentTaskManagerRef) userProgress = currentTaskManagerRef.getUserProgress();
            else return; // Cannot proceed without userProgress
        }
        
        const backlogCount = userProgress.backlogTasks.length;
        // Count only revisions that are actually due today or earlier
        const dueRevisionTasks = userProgress.revisionTasks.filter(t => {
            const nextRevisionDate = new Date(t.nextRevisionDate);
            const today = new Date();
            today.setHours(0,0,0,0); // Normalize today's date
            nextRevisionDate.setHours(0,0,0,0); // Normalize revision date
            return nextRevisionDate <= today;
        });
        const revisionCount = dueRevisionTasks.length;
        const improviseCount = userProgress.improviseList.length;
        
        updateBadges(backlogCount, revisionCount, improviseCount);
    };


    return {
        initRefs,
        createTaskCard,
        updateBadgesCount,
        updateBadges // Expose if app.js needs to call it directly for some reason
    };
})();