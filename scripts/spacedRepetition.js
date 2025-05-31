// scripts/spacedRepetition.js

const SpacedRepetition = (() => {
    const REVISION_INTERVAL_DAYS = 7; // First revision after 7 days
    const revisionContentEl = document.getElementById('revisionContent');

    // Access userProgress and studyPlanProgress via TaskManager getters
    // This avoids direct dependency on Storage module and keeps TaskManager as single source of truth for progress data.

    const scheduleRevision = (dayPlan) => {
        let userProgress = TaskManager.getUserProgress();
        const topicId = `day${dayPlan.day}-topic`; // Unique ID for the topic of a specific day

        // Check if already scheduled to avoid duplicates
        const existingRevision = userProgress.revisionTasks.find(task => task.topicId === topicId);
        if (existingRevision) {
            console.log(`Topic ${topicId} already scheduled for revision.`);
            return;
        }

        const completionDate = new Date(); // Assume completion is 'today'
        const nextRevisionDate = new Date(completionDate);
        nextRevisionDate.setDate(completionDate.getDate() + REVISION_INTERVAL_DAYS);

        userProgress.revisionTasks.push({
            topicId: topicId, // e.g., "day1-topic"
            subject: dayPlan.subject,
            topicName: dayPlan.topic, // Store name for display
            dayNumber: dayPlan.day, // Store original day number
            lastRevisedDate: completionDate.toISOString(),
            nextRevisionDate: nextRevisionDate.toISOString(),
            revisionCount: 0 // First revision
        });
        TaskManager.setUserProgress(userProgress); // Update progress through TaskManager
        renderRevisionList();
        TaskManager.updateBadgesCount();
    };

    const markRevised = (topicId) => {
        let userProgress = TaskManager.getUserProgress();
        const taskIndex = userProgress.revisionTasks.findIndex(task => task.topicId === topicId);

        if (taskIndex > -1) {
            const revisedTask = userProgress.revisionTasks[taskIndex];
            revisedTask.lastRevisedDate = new Date().toISOString();
            revisedTask.revisionCount += 1;
            
            // Simple interval, can be made more complex (e.g., Fibonacci sequence for intervals)
            const nextInterval = REVISION_INTERVAL_DAYS * (revisedTask.revisionCount + 1); 
            const nextRevisionDate = new Date(revisedTask.lastRevisedDate);
            nextRevisionDate.setDate(new Date(revisedTask.lastRevisedDate).getDate() + nextInterval);
            revisedTask.nextRevisionDate = nextRevisionDate.toISOString();
            
            TaskManager.setUserProgress(userProgress);
            renderRevisionList();
            TaskManager.updateBadgesCount();
        } else {
            console.error("Could not find task to mark as revised:", topicId);
        }
    };

    const removeRevision = (topicId) => {
        let userProgress = TaskManager.getUserProgress();
        const initialLength = userProgress.revisionTasks.length;
        userProgress.revisionTasks = userProgress.revisionTasks.filter(task => task.topicId !== topicId);

        if (userProgress.revisionTasks.length < initialLength) {
            TaskManager.setUserProgress(userProgress);
            renderRevisionList();
            TaskManager.updateBadgesCount();
            console.log(`Revision task ${topicId} removed.`);
        } else {
            console.warn(`Revision task ${topicId} not found for removal.`);
        }
    };

    const getDueRevisions = () => {
        let userProgress = TaskManager.getUserProgress();
        const today = new Date();
        // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison
        today.setHours(0, 0, 0, 0); 
        
        return userProgress.revisionTasks.filter(task => {
            const nextRevisionDate = new Date(task.nextRevisionDate);
            nextRevisionDate.setHours(0,0,0,0); // Normalize for comparison
            return nextRevisionDate <= today;
        });
    };

    const renderRevisionList = () => {
        if (!revisionContentEl) return;
        revisionContentEl.innerHTML = ''; // Clear previous list

        const dueRevisions = getDueRevisions();

        if (dueRevisions.length === 0) {
            revisionContentEl.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔄</div>
                    <h3>No revisions due</h3>
                    <p>Complete some topics to start your revision cycle, or check back later.</p>
                </div>`;
            return;
        }

        dueRevisions.forEach(task => {
            // Use TaskManager's createTaskCard for consistent UI
            // Need to adapt the 'task' object to what createTaskCard expects
            const cardData = {
                id: task.topicId, // Use topicId as the unique ID for the card
                name: task.topicName, // This is the main display name for the card
                subject: task.subject,
                topic: task.topicName, // createTaskCard might use 'topic'
                day: task.dayNumber,   // Original day of the topic
                nextRevisionDate: task.nextRevisionDate // For display on the card
            };
            const card = TaskManager.createTaskCard(cardData, 'revision');
            revisionContentEl.appendChild(card);
        });
    };
    
    const init = () => {
        renderRevisionList();
        // No specific interval check needed here as TaskManager.updateBadgesCount will be called
        // and it considers due revisions. Tab switching will also re-render if necessary.
    };

    return {
        init,
        scheduleRevision,
        markRevised,
        removeRevision, // Expose the new function
        getDueRevisions,
        renderRevisionList
    };
})();

// Initialize SpacedRepetition after DOM is loaded and TaskManager is available.
// app.js will handle the main init sequence.
// document.addEventListener('DOMContentLoaded', SpacedRepetition.init);