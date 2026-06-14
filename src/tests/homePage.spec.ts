import {test, expect} from '@playwright/test'
import {HomePage} from "../pages/homePage"
import { env } from '../../config/env';




test("validaton of login in OragneHRM",async({page})=>{


const homepage = new HomePage(page);
await homepage.navigateToHomepage();
await homepage.PerformLogin(env.username, env.password);
await expect(homepage.dashboardHeader).toBeVisible({timeout:2000});
await page.waitForTimeout(3000);

})