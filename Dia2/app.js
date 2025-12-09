const API_URL = 'https://67f91aad094de2fe6ea07a32.mockapi.io/people/project/JustDoIt';
        
        let tasks = [];

        // Elementos del DOM
        const taskInput = document.getElementById('taskInput');
        const addBtn = document.getElementById('addBtn');
        const tasksList = document.getElementById('tasksList');
        const errorMsg = document.getElementById('errorMsg');
        const totalTasksEl = document.getElementById('totalTasks');
        const completedTasksEl = document.getElementById('completedTasks');
        const pendingTasksEl = document.getElementById('pendingTasks');

        // Evento para añadir tarea con Enter
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        // Evento para añadir tarea con botón
        addBtn.addEventListener('click', addTask);

        // Cargar tareas al iniciar
        loadTasks();

        async function loadTasks() {
            try {
                hideError();
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Error al cargar tareas');
                
                tasks = await response.json();
                renderTasks();
                updateStats();
            } catch (error) {
                showError('Error al cargar las tareas. Intenta de nuevo.');
                console.error('Error:', error);
            }
        }

        async function addTask() {
            const text = taskInput.value.trim();
            
            if (!text) {
                showError('Por favor, escribe una tarea válida.');
                return;
            }

            try {
                hideError();
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: text,
                        completed: false
                    })
                });

                if (!response.ok) throw new Error('Error al crear tarea');

                const newTask = await response.json();
                tasks.push(newTask);
                
                taskInput.value = '';
                taskInput.focus();
                
                renderTasks();
                updateStats();
            } catch (error) {
                showError('Error al crear la tarea. Intenta de nuevo.');
                console.error('Error:', error);
            }
        }

        async function deleteTask(id) {
            try {
                hideError();
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('Error al eliminar tarea');

                tasks = tasks.filter(task => task.id !== id);
                renderTasks();
                updateStats();
            } catch (error) {
                showError('Error al eliminar la tarea. Intenta de nuevo.');
                console.error('Error:', error);
            }
        }

        async function toggleTaskCompletion(id) {
            try {
                hideError();
                const task = tasks.find(t => t.id === id);
                if (!task) return;

                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...task,
                        completed: !task.completed
                    })
                });

                if (!response.ok) throw new Error('Error al actualizar tarea');

                task.completed = !task.completed;
                renderTasks();
                updateStats();
            } catch (error) {
                showError('Error al actualizar la tarea. Intenta de nuevo.');
                console.error('Error:', error);
            }
        }

        function renderTasks() {
            if (tasks.length === 0) {
                tasksList.innerHTML = `
                    <div class="empty-state">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                            </path>
                        </svg>
                        <p>No hay tareas aún. ¡Crea una para comenzar!</p>
                    </div>
                `;
                return;
            }

            tasksList.innerHTML = tasks.map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''}">
                    <input 
                        type="checkbox" 
                        class="checkbox" 
                        ${task.completed ? 'checked' : ''}
                        onchange="toggleTaskCompletion('${task.id}')"
                    >
                    <span class="task-text">${escapeHtml(task.title)}</span>
                    <button class="btn-delete" onclick="deleteTask('${task.id}')">Eliminar</button>
                </div>
            `).join('');
        }

        function updateStats() {
            const total = tasks.length;
            const completed = tasks.filter(t => t.completed).length;
            const pending = total - completed;

            totalTasksEl.textContent = total;
            completedTasksEl.textContent = completed;
            pendingTasksEl.textContent = pending;
        }

        function showError(message) {
            errorMsg.textContent = message;
            errorMsg.classList.add('show');
        }

        function hideError() {
            errorMsg.classList.remove('show');
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }