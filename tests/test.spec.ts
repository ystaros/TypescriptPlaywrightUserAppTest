import {test} from "@playwright/test";

test("Test 1", async({page}) => {
    await page.goto("https://nodeexpressapi-39yx.onrender.com")
});