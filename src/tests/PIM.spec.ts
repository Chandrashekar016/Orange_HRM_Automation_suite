import {test, expect} from "@playwright/test"
import {PIMPage} from "../pages/PIMPage"
import { HomePage } from "../pages/homePage"
import { env } from "../../config/env"
import {generateEmployee} from "../test-data/fakerEmployeeData";
import { MyInfoPage } from "../pages/myInfoPage";
import path from 'path'





test.describe("PIM, MYinfo scenarios",async()=>{


    test.beforeEach(async({page})=>{

        // object creatieon for homepage.ts
        const homepage1 = new HomePage(page);

        // loggin in using the "homepage1" object;
        await homepage1.navigateToHomepage();
        await homepage1.PerformLogin(env.username, env.password); 
        await expect(homepage1.dashboardHeader).toBeVisible();
        await page.waitForTimeout(3000);

    })


    test("validation of new user creation via PIM.",async({page})=>{

        //object creation for PIM page.
        const pimpage = new PIMPage(page);

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

    });


    test("validating the upload functionality in MYINFO page", {tag: '@sanity'}, async({page})=>{

        //object creation;
        const myinfo = new MyInfoPage(page);

        await myinfo.gotoMyinfo();
        await expect(myinfo.personalDetailsHeader).toBeVisible({timeout: 3000});
        await myinfo.clickAddbutton();
        //file uploading;
        const pathofTestFile = path.resolve("src/test-data/uploadingTest.txt");
        await myinfo.uploadTheFile(pathofTestFile)
        await page.waitForTimeout(3000);
        await expect(myinfo.fileUploadSuccessToast).toBeVisible();
        console.log(await myinfo.fileUploadSuccessToast.innerText());


    })


});