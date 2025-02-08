document.addEventListener("DOMContentLoaded", () => {
    const howToUseModal = document.getElementById("howToUseModal");
    const howToUseModalInstance = M.Modal.init(howToUseModal);

    const warningModal = document.getElementById("warningModal");
    const dangerModal = document.getElementById("dangerModal");
    const warningModalInstance = M.Modal.init(warningModal);
    const dangerModalInstance = M.Modal.init(dangerModal);

    document.getElementById("openHowToUse").addEventListener("click", () => {
        howToUseModalInstance.open();
    });

    const progress = document.getElementById("progress");
    const taskForm = document.getElementById("taskForm");
    const taskNameInput = document.getElementById("taskName");
    const taskLoadInput = document.getElementById("taskLoad");
    const taskList = document.getElementById("taskList");
    const loadContainer = document.getElementById("loadContainer");
    const turtleImage = document.getElementById("turtleImage");
    const turtleComment = document.getElementById("turtleComment");

    let totalLoad = 0;
    const maxCapacity = 30;
    const taskToLoadMap = new Map();

    taskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const taskName = taskNameInput.value.trim();
        const taskLoad = parseInt(taskLoadInput.value);

        if (taskName && taskLoad >= 1 && taskLoad <= 5) {
            addTask(taskName, taskLoad);
            taskNameInput.value = "";
            taskLoadInput.value = "";
        } else {
            alert("タスク名を入力し、負荷を1〜5の間で指定してください。");
        }
    });

    function addTask(taskName, taskLoad) {
        const taskId = Date.now();
        const li = document.createElement("li");
        li.classList.add("collection-item");

        const taskContent = document.createElement("div");
        taskContent.classList.add("task-content");
        taskContent.innerHTML = `
            <label>
                <input type="checkbox" class="filled-in" />
                <span>${taskName}</span>
                <span class="badge">${taskLoad}</span>
            </label>
        `;

        const deleteIcon = document.createElement("img");
        deleteIcon.src = "gomibako.png";
        deleteIcon.alt = "削除";
        deleteIcon.classList.add("task-delete");

        li.appendChild(taskContent);
        li.appendChild(deleteIcon);

        const checkbox = taskContent.querySelector("input[type='checkbox']");

        const loadIcon = document.createElement("img");
        loadIcon.src = "new-load-icon.png";
        loadIcon.classList.add("load-icon");
        loadIcon.style.width = `${30 + taskLoad * 10}px`;
        loadIcon.style.height = `${30 + taskLoad * 10}px`;

        loadContainer.appendChild(loadIcon);
        taskToLoadMap.set(taskId, { loadIcon, taskLoad });

        totalLoad += taskLoad; // タスクの負荷を追加
        updateTurtleCapacity();

        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                li.classList.add("completed");
                const loadElement = taskToLoadMap.get(taskId).loadIcon;
                if (loadElement) {
                    loadContainer.removeChild(loadElement);
                }
                totalLoad -= taskLoad;
            } else {
                li.classList.remove("completed");
                loadContainer.appendChild(loadIcon);
                totalLoad += taskLoad;
            }
            updateTurtleCapacity();
        });

        deleteIcon.addEventListener("click", () => {
            const loadElement = taskToLoadMap.get(taskId).loadIcon;
            if (loadElement) {
                loadContainer.removeChild(loadElement);
            }
            totalLoad -= taskLoad;
            taskToLoadMap.delete(taskId);
            taskList.removeChild(li);
            updateTurtleCapacity();
        });

        taskList.appendChild(li);
    }

    function updateTurtleCapacity() {
        const loadPercentage = (totalLoad / maxCapacity) * 100;
        progress.style.width = `${Math.min(loadPercentage, 100)}%`; // 最大値は100%

        // 警告ポップアップの表示
        if (loadPercentage > 90 && loadPercentage <= 100) {
            warningModalInstance.open();
        } else if (loadPercentage > 100) {
            dangerModalInstance.open();
        }

        // 亀の状態を更新
        if (loadPercentage <= 50) {
            progress.style.backgroundColor = "#A6D49E";
            turtleImage.src = "kame_yoyuu.PNG";
            turtleComment.textContent = "まだ余裕だよ！";
        } else if (loadPercentage <= 70) {
            progress.style.backgroundColor = "#FFD068";
            turtleImage.src = "kame_magao.PNG";
            turtleComment.textContent = "少しきついかな...";
        } else if (loadPercentage <= 80) {
            progress.style.backgroundColor = "#FFAA54";
            turtleImage.src = "kame_tyoisyonnbori.PNG";
            turtleComment.textContent = "もう限界が近いよ...";
        } else {
            progress.style.backgroundColor = "#CB2E46";
            turtleImage.src = "kame_naki.PNG";
            turtleComment.textContent = "重すぎるよ！助けて！";
        }
    }
});
