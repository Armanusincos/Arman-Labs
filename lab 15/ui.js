import { getNotes, deleteNote, updateNote } from "./storage.js";

export function renderNotes({ containerId = "notesContainer", filter = "", sort = "new" } = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let notes = getNotes();

    const q = (filter || "").trim().toLowerCase();
    if (q) {
        notes = notes.filter(n => `${n.title} ${n.text}`.toLowerCase().includes(q));
    }


    notes.sort((a, b) => {
        if(a.pinned && !b.pinned) return -1;
        if(!a.pinned && b.pinned) return 1;
        if(sort === "old") return a.date.localeCompare(b.date);
        return b.id.localeCompare(a.id);
    });

    container.innerHTML = "";

    if (notes.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1;padding:18px;text-align:center;color:#666">Заметок нет</div>`;
        return;
    }

    for (const note of notes) {
        const card = createNoteCard(note);
        container.appendChild(card);
    }
}

function createNoteCard(note) {
    const el = document.createElement("article");
    el.className = "note";
    if(note.pinned) el.classList.add("pinned");
    el.style.background = note.color || "#ffffff";
    el.setAttribute("data-id", note.id);

    // Заголовок и кнопка закрепления
    const header = document.createElement("div");
    header.className = "note-header";
    const titleEl = document.createElement("h3");
    titleEl.textContent = note.title || "(Без заголовка)";

    // Кнопка закрепления рядом с заголовком
    const pinBtn = document.createElement("button");
    pinBtn.className = "btn pin-btn small";
    pinBtn.textContent = note.pinned ? "📌 Закреплено" : "📍 Закрепить";
    pinBtn.title = "Закрепить/открепить заметку";

    header.appendChild(titleEl);
    header.appendChild(pinBtn);

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = note.color || "#ffffff";
    colorInput.title = "Изменить цвет заметки";
    header.appendChild(colorInput);

    // Текст заметки и дата
    const p = document.createElement("p");
    p.textContent = note.text || "";

    const dateEl = document.createElement("small");
    dateEl.textContent = note.date || "";

    // Контрольные кнопки
    const controls = document.createElement("div");
    controls.className = "note-controls";

    const editBtn = document.createElement("button");
    editBtn.className = "btn edit-btn small";
    editBtn.textContent = "Редактировать";

    const saveBtn = document.createElement("button");
    saveBtn.className = "btn save-btn small";
    saveBtn.textContent = "Сохранить";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn delete-btn small";
    deleteBtn.textContent = "Удалить";

    controls.appendChild(editBtn);
    controls.appendChild(saveBtn);
    controls.appendChild(deleteBtn);

    const editTextarea = document.createElement("textarea");
    editTextarea.style.width = "100%";
    editTextarea.style.border = "1px solid rgba(0,0,0,0.08)";
    editTextarea.style.borderRadius = "8px";
    editTextarea.style.padding = "8px";
    editTextarea.style.marginTop = "8px";
    editTextarea.value = note.text || "";
    editTextarea.hidden = true;

    const editTitleInput = document.createElement("input");
    editTitleInput.type = "text";
    editTitleInput.value = note.title || "";
    editTitleInput.style.marginTop = "8px";
    editTitleInput.style.width = "100%";
    editTitleInput.hidden = true;


    colorInput.addEventListener("input", (e) => {
        const newColor = e.target.value;
        el.style.background = newColor;
        updateNote(note.id, { color: newColor });
    });

    deleteBtn.addEventListener("click", () => {
        if (!confirm("Удалить заметку?")) return;
        deleteNote(note.id);
        renderNotes({ filter: document.getElementById("searchInput")?.value || "", sort: document.getElementById("sortSelect")?.value || "new" });
    });

    editBtn.addEventListener("click", () => {
        const editing = !editTextarea.hidden;
        if (!editing) {
            editTextarea.hidden = false;
            editTitleInput.hidden = false;
            p.hidden = true;
            titleEl.hidden = true;
            saveBtn.disabled = false;
            editTextarea.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
            editTextarea.hidden = true;
            editTitleInput.hidden = true;
            p.hidden = false;
            titleEl.hidden = false;
        }
    });

    saveBtn.addEventListener("click", () => {
        const newText = editTextarea.value.trim();
        const newTitle = editTitleInput.value.trim() || "(Без заголовка)";
        updateNote(note.id, { text: newText, title: newTitle });
        p.textContent = newText;
        titleEl.textContent = newTitle;
        editTextarea.hidden = true;
        editTitleInput.hidden = true;
        p.hidden = false;
        titleEl.hidden = false;
    });

    pinBtn.addEventListener("click", () => {
        note.pinned = !note.pinned;
        updateNote(note.id, { pinned: note.pinned });
        pinBtn.textContent = note.pinned ? "📌 Закреплено" : "📍 Закрепить";
        if(note.pinned) el.classList.add("pinned"); else el.classList.remove("pinned");
        renderNotes({ filter: document.getElementById("searchInput")?.value || "", sort: document.getElementById("sortSelect")?.value || "new" });
    });

    el.appendChild(header);
    el.appendChild(p);
    el.appendChild(editTitleInput);
    el.appendChild(editTextarea);
    el.appendChild(dateEl);
    el.appendChild(controls);

    return el;
}
