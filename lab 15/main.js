import { generateId, getCurrentDate } from "./utils.js";
import { addNote } from "./storage.js";
import { renderNotes } from "./ui.js";

const titleInput = document.getElementById("titleInput");
const textInput = document.getElementById("textInput");
const colorInput = document.getElementById("noteColor");
const presetSelect = document.getElementById("presetColors");
const addBtn = document.getElementById("addBtn");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

function resetForm() {
    titleInput.value = "";
    textInput.value = "";
    colorInput.value = "#ffffff";
    presetSelect.value = "";
}

addBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const text = textInput.value.trim();
    const color = colorInput.value || "#ffffff";

    if (!title && !text) {
        alert("Введите заголовок или текст заметки.");
        return;
    }

    const note = {
        id: generateId(),
        title: title || "(Без заголовка)",
        text: text || "",
        date: getCurrentDate(),
        color,
        pinned: false
    };

    addNote(note);
    resetForm();
    renderNotes({ filter: searchInput.value, sort: sortSelect.value });
});

presetSelect.addEventListener("change", () => {
    if (presetSelect.value) colorInput.value = presetSelect.value;
});

searchInput.addEventListener("input", () => {
    renderNotes({ filter: searchInput.value, sort: sortSelect.value });
});

sortSelect.addEventListener("change", () => {
    renderNotes({ filter: searchInput.value, sort: sortSelect.value });
});

document.addEventListener("DOMContentLoaded", () => {
    renderNotes({ filter: "", sort: sortSelect.value });
});
