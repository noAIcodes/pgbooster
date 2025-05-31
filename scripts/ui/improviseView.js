// scripts/ui/improviseView.js

const ImproviseView = (() => {
    const improviseContentEl = document.getElementById('improviseContent');
    const improviseTodayEl = document.getElementById('improviseToday');
    let currentTaskManagerRef = null;

    const renderImproviseList = (improviseList, taskManagerRef) => {
        if (!improviseContentEl) return;
        if(taskManagerRef) currentTaskManagerRef = taskManagerRef; // Store ref if passed

        improviseContentEl.innerHTML = ''; 

        if (improviseList.length === 0) {
            improviseContentEl.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⚡</div>
                    <h3>No topics in improvise list</h3>
                    <p>Add topics you find challenging to focus on them.</p>
                </div>`;
            renderImprovisePrompt(improviseList); // Still render prompt, it will show empty message
            return;
        }

        improviseList.forEach(topic => {
            if (currentTaskManagerRef && typeof currentTaskManagerRef.createTaskCard === 'function') {
                const card = currentTaskManagerRef.createTaskCard(topic, 'improvise');
                improviseContentEl.appendChild(card);
            } else {
                console.error("ImproviseView: TaskManager reference or createTaskCard method not available.");
            }
        });
        renderImprovisePrompt(improviseList);
    };
    
    const renderImprovisePrompt = (improviseList) => {
        if (!improviseTodayEl) return;
        improviseTodayEl.innerHTML = '';
        
        // Suggest first 2, or fewer if list is smaller
        const suggestions = improviseList.slice(0, 2); 
        
        if (suggestions.length > 0) {
            const promptTitle = document.getElementById('improvisePrompt')?.querySelector('.prompt-title');
            if(promptTitle) promptTitle.textContent = "Daily Improvise Challenge";

            suggestions.forEach(topic => {
                const el = document.createElement('div');
                el.classList.add('suggestion-item'); // Ensure this class is styled
                el.textContent = `${topic.subject}: ${topic.name}`;
                // Could add a button here to "Start Studying" this topic
                improviseTodayEl.appendChild(el);
            });
        } else {
             const promptTitle = document.getElementById('improvisePrompt')?.querySelector('.prompt-title');
            if(promptTitle) promptTitle.textContent = "Improvise List Empty";
            improviseTodayEl.innerHTML = '<p>Add some topics to your improvise list to see suggestions here!</p>';
        }
    };

    // Event listeners for this view can be added here if any
    // For example, if improvise items had direct actions within this view
    const initEventListeners = (taskManagerRef) => {
        currentTaskManagerRef = taskManagerRef;
        // Currently, actions on improvise cards (remove, study) are handled by
        // event listeners set up in TaskManager.createTaskCard.
        // If those were to be delegated to this view, they'd be set up here.
    };

    return {
        renderImproviseList,
        renderImprovisePrompt, // Might be called if only prompt needs update
        initEventListeners
    };
})();