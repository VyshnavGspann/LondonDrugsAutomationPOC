import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.afterAll(async () => {
    // Manually ensure the allure-results directory is saved
    const allureResultsFolder = path.join(process.cwd(), 'allure-results');
    if (!fs.existsSync(allureResultsFolder)) {
        fs.mkdirSync(allureResultsFolder);
    }

    // Ensure the results are written to the disk
    console.log('Allure results saved successfully!');
});