const STORAGE_KEY = "notes_app_v1";

export function getNotes() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (e) {
        console.error("Parsing notes failed", e);
        return [];
    }
}

export function saveNotes(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function addNote(note) {
    const notes = getNotes();
    notes.push(note);
    saveNotes(notes);
}

export function deleteNote(id) {
    const notes = getNotes().filter(n => n.id !== id);
    saveNotes(notes);
}

export function updateNote(id, data) {
    const notes = getNotes().map(n => (n.id === id ? { ...n, ...data } : n));
    saveNotes(notes);
}
