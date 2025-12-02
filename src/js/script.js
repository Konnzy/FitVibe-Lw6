document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initTabsConstructor();
    initTabsViewer();
});
function initMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('menu1');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', function () {
            navMenu.classList.toggle('show');
        });
    }
}

function initTabsConstructor() {
    const addBtn      = document.getElementById("addTabBtn");
    const saveBtn     = document.getElementById("SaveTabsBtn");
    const titleInput  = document.getElementById("tabTitle");
    const descInput   = document.getElementById("tabDescription");
    const preview     = document.getElementById("previewTabs");

    if (!addBtn || !saveBtn || !titleInput || !descInput || !preview) {
        return;
    }

    let tabs = [];

    addBtn.onclick = function () {
        const title = titleInput.value.trim();
        const desc  = descInput.value.trim();

        if (!title || !desc) return;

        tabs.push({ title, desc });

        const li = document.createElement("li");
        li.textContent = `${title}: ${desc}`;
        preview.appendChild(li);

        titleInput.value = "";
        descInput.value  = "";
    };

    saveBtn.onclick = function () {
        if (tabs.length === 0) {
            alert("No tabs to save.");
            return;
        }

        fetch("save.php", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(tabs)
        })
            .then(r => r.text())
            .then(t => {
                alert("Saved!");

                initTabsViewer();

                const iframe = document.getElementById('copyFrame');
                if (iframe) {
                    iframe.src = 'indexcopy.html?ts=' + Date.now(); // захист від кешу
                }

            })
            .catch(err => console.error(err));
    };
}

function initTabsViewer() {
    const viewer = document.getElementById("tabsViewer");
    if (!viewer) return;

    fetch("load.php?ts=" + Date.now())
        .then(r => r.json())
        .then(tabs => buildTabs(viewer, tabs))
        .catch(err => console.error(err));
}

function buildTabs(root, tabs) {
    if (!Array.isArray(tabs) || tabs.length === 0) {
        root.textContent = "No tabs saved.";
        return;
    }

    const header = document.createElement("div");
    header.className = "tabs-header";

    const content = document.createElement("div");
    content.className = "tabs-content";

    tabs.forEach((tab, index) => {
        const btn = document.createElement("button");
        btn.className = "tab-button";
        btn.textContent = tab.title || ("Tab " + (index + 1));

        const pane = document.createElement("div");
        pane.className = "tab-pane";
        pane.textContent = tab.description || "";

        if (index === 0) {
            btn.classList.add("active");
            pane.classList.add("active");
        }

        btn.addEventListener("click", () => {
            header.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
            content.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            pane.classList.add("active");
        });

        header.appendChild(btn);
        content.appendChild(pane);
    });

    root.innerHTML = "";
    root.appendChild(header);
    root.appendChild(content);
}
