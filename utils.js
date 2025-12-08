export function generateId() {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function getCurrentDate() {
    return new Date().toLocaleString();
}
