import { generateId } from "./utils.js";

test("ID должен быть строкой", () => {
    expect(typeof generateId()).toBe("string");
});
