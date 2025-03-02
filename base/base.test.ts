import {test as base} from "@playwright/test";
import * as preconditions from "@preconditions/preconditions";
import * as usersData from "@data/users.data";

import { step, owner, link } from "allure-js-commons";

type MyFixtures = {
    forEachTest: void;
    createDB: void;
}

export const test = base.extend<MyFixtures>({
    forEachTest: [ async ({ page }, use) => {
        {
            await owner('ystaros');
            await link('https://github.com/ystaros/TypescriptPlaywrightUserAppTest');
            await link('https://github.com/ystaros/NodeExpressAPI');
            await link('https://nodeexpressapi-39yx.onrender.com');
        }
        await step('Navigate to the Home Page.', async () => {
            await page.goto('/');
        })
        await use();
    }, { auto: true }
    ],

    createDB: [async({request}, use) => {
        await step('Delete DB if exist and Create new users DB.', async () => {
            await preconditions.deleteUsers(request);
            await preconditions.createUsers(request, usersData.users);
        })
        await use();
        await step('Precondition: Dispose request.', async () => {
          await request.dispose();
        });
    }, {auto: false, scope: "test", title: "Precondition: Setup Data Base."}],
});

export { expect } from '@playwright/test';

export  async function allureMeta(epic?: any, story?: any, tags?: any, Severity?: any, description?: any) {
    return await Promise.all([
        epic, story, tags, Severity, description
    ])
}



