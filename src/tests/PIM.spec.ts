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


    test.skip("validation of new user creation via PIM.",async({page})=>{

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
        const pathofTestFile = path.resolve("src/test-data/last_in_segment.txt");
        await myinfo.uploadTheFile(pathofTestFile)
        await expect(myinfo.fileUploadSuccessToast).toBeVisible({timeout: 2000});
        console.log(await myinfo.fileUploadSuccessToast.innerText());

        // validating the uploaded file if added to the table or not;
        await myinfo.table.waitFor({state: "visible"});
        const uploadingfilename = "last_in_segment.txt";
        await myinfo.getRowByFileName(uploadingfilename);
        await myinfo.verifyIfNewRowExists(uploadingfilename);
        console.log("uploaded file: " + uploadingfilename);
        await page.waitForTimeout(3000);
        //clciking specific row's edit button.
        await myinfo.rowEDIT(uploadingfilename);
        await expect(myinfo.editAttachmentheader).toBeVisible({timeout: 2000});
        console.log(await myinfo.editAttachmentheader.innerText());

        // adding new file name by editing the uploade file;
        const datevalue=  Date.now();
        await myinfo.addnewFileNmae(`TestFile_${datevalue}`);
        // await page.waitForTimeout(3000);

    })


    test("validate the Uploaded file delete functionality by deleting them.",async({page})=>{

        //object creation;
        const myinfo = new MyInfoPage(page);
        await myinfo.myinfoBTN.click({timeout: 2000});
        await myinfo.table.waitFor({state: "visible"});
    
        await myinfo.trashAllUploads();
        await expect.soft(myinfo.successfullyDeletionToast).toBeVisible();

    })


    
});