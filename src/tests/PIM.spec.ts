import {test, expect} from "@playwright/test"
import {PIMPage} from "../pages/PIMPage"
import { HomePage } from "../pages/homePage"
import { env } from "../../config/env"
import {generateEmployee} from "../test-data/fakerEmployeeData";


test("validation of new user creation via PIM.",async({page})=>{

// object creatieon for homepage.ts
const homepage1 = new HomePage(page);
//object creation for PIM page.
const pimpage = new PIMPage(page);

// loggin in using the "homepage1" object;
await homepage1.navigateToHomepage();
await homepage1.PerformLogin(env.username, env.password); 
await expect(homepage1.dashboardHeader).toBeVisible();
await page.waitForTimeout(3000);

// User creation flow via PIM:
await pimpage.navigatetoAddUserPage();




//addin user details
const employee = generateEmployee();
await pimpage.addNewEmployee(

    employee.firstname,
    employee.lastname
);
//enabling the radio buttont to see further details like user creation;
await pimpage.checkCreateLoginDetails();

//validating the appearence of details;
await expect(pimpage.statusLabel).toBeVisible({timeout: 2000});

//filling new user details;
await pimpage.creatNewUserDetails(employee.newUserName, employee.newPassword);

//asserting the visibility of Personal details page after successful user creation;
await pimpage.personalDetailsHeader.waitFor({state: 'visible'})
await expect(pimpage.personalDetailsHeader).toBeVisible({timeout: 2000});
console.log(`Assertion text: ${pimpage.personalDetailsHeader.innerText()}`);

})