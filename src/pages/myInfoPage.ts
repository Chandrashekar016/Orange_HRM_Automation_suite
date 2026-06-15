import {expect, Page} from "@playwright/test"


export class MyInfoPage{


    readonly page: Page;
    readonly myinfoBTN;
    readonly personalDetailsHeader;
    readonly addButton;
    readonly inputFile;
    readonly fileUploadSuccessToast;
    readonly saveInput;

    constructor(page: Page)
    {
        this.page = page;
        this.myinfoBTN = this.page.locator("//*[text()='My Info']");
        this.personalDetailsHeader = this.page.locator("//h6[text()='Personal Details']");
        this.addButton = this.page.getByRole('button',{name:'Add'});
        this.inputFile = this.page.locator("//input[@type='file']");
        this.saveInput= this.page.locator("//button[@type='submit']").nth(2);
        this.fileUploadSuccessToast = this.page.locator("#oxd-toaster_1");


    }
async gotoMyinfo()
{
    await this.myinfoBTN.click();
    await this.personalDetailsHeader.waitFor({state:"visible"});

}

async clickAddbutton ()
{
    await this.addButton.click();
}


async uploadTheFile(filepath: string)
{
    await this.inputFile.setInputFiles(filepath);
    await this.page.waitForTimeout(2000);
    await this.saveInput.click();
}



}