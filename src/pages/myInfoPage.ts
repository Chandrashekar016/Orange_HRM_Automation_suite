import { expect, Locator, Page } from "@playwright/test"


export class MyInfoPage {


    readonly page: Page;
    readonly myinfoBTN;
    readonly personalDetailsHeader;
    readonly addButton;
    readonly inputFile;
    readonly fileUploadSuccessToast;
    readonly saveInput;
    readonly table;
    readonly row;
    readonly actionsClass;
    readonly editAttachmentheader;
    readonly comment;
    readonly editSectionSaveBtn: Locator;
    readonly allDeletableTableRows;
    readonly deleteConfirmationMessage;
    readonly yesDeleteButton;
    readonly successfullyDeletionToast;

    constructor(page: Page) {
        this.page = page;
        this.myinfoBTN = this.page.locator("//*[text()='My Info']");
        this.personalDetailsHeader = this.page.locator("//h6[text()='Personal Details']");
        this.addButton = this.page.getByRole('button', { name: 'Add' });
        this.inputFile = this.page.locator("//input[@type='file']");
        this.saveInput = this.page.locator("//button[@type='submit']").nth(2);
        this.fileUploadSuccessToast = this.page.locator("#oxd-toaster_1");
        this.table = this.page.locator(".oxd-table-body");
        this.row = this.page.locator(".oxd-table-card");
        this.actionsClass = this.page.locator(".oxd-table-cell-actions");
        this.editAttachmentheader = this.page.locator("//h6[text()='Edit Attachment']");
        this.comment = this.page.getByPlaceholder("Type comment here");

        // this xpath says, locate the 1st Save button after the comment textarea.
        this.editSectionSaveBtn = this.comment.locator("xpath=following::button[normalize-space()='Save'][1]");

        // locator for locating the entire table rows at a time for deletion.
        this.allDeletableTableRows = this.page.locator(".oxd-table-body").locator(".oxd-table-card");
        //delete confirmation modal content and its locator for assertion.
        this.deleteConfirmationMessage = this.page.locator(".oxd-text oxd-text--p oxd-text--card-body");
        this.yesDeleteButton = this.page.getByRole("button", { name: "Yes, Delete" });
        this.successfullyDeletionToast = this.page.locator("#oxd-toaster_1");




    }
    async gotoMyinfo() {
        await this.myinfoBTN.click();
        await this.personalDetailsHeader.waitFor({ state: "visible" });

    }

    async clickAddbutton() {
        await this.addButton.click();
    }


    async uploadTheFile(filepath: string) {
        await this.inputFile.setInputFiles(filepath);
        // await this.page.waitForTimeout(2000);
        await this.saveInput.click();
    }

    //Dynamic loactor methods: 

    getRowByFileName(filename: string): Locator {
        return this.row.filter({ hasText: filename })
    }

    async verifyIfNewRowExists(filename: string) {
        await expect(this.getRowByFileName(filename)).toBeVisible();
    }


    getEditButton(filename: string): Locator {
        return this.getRowByFileName(filename).locator(".oxd-table-cell-actions button").nth(0);
    }

    getDeleteButton(filename: string): Locator {
        return this.getRowByFileName(filename).locator(".oxd-table-cell-actions button").nth(1);
    }

    //Action methods;

    async rowEDIT(filename: string) {
        await this.getEditButton(filename).click();
    }

    //this methoed is for adding new file name by editing the uploaded file.
    async addnewFileNmae(newFilename: string) {
        await this.comment.clear();
        await this.comment.fill(newFilename);

        await expect(this.comment).toHaveValue(newFilename);
        console.log(await this.comment.inputValue());

        console.log(
            await this.editSectionSaveBtn.count()
        );

        await this.editSectionSaveBtn.click();

    }

    //creating a resuable function which is capable of deleting all the uploaded entries and makes the table empty;    

    async trashAllUploads() {
        const rowsCount: number = await this.allDeletableTableRows.count();
        console.log(`count of total rows: ${rowsCount}`);

        if (rowsCount === 0) {
            console.log("There are no rows to delete, Please proceed with the new file's upload.")
            return;  //Return Early : Because, Then continue with deletion logic, This reduces nesting.
        }
        else {

            for (let i = 0; i < rowsCount; i++) {
                const requiredRow = this.allDeletableTableRows.nth(0)
                const trashIcon = requiredRow.locator(".oxd-table-cell-actions button").nth(1);
                await expect(trashIcon).toBeVisible({ timeout: 4000 })
                await trashIcon.click();
                //clicking delete Confirmation button; 
                // await expect.soft(this.deleteConfirmationMessage).toBeVisible({timeout: 3000});
                await expect(this.yesDeleteButton).toBeVisible();
                await this.yesDeleteButton.click();
                //"Asserting if One row was actually deleted."
                await expect.soft(this.allDeletableTableRows).toHaveCount(rowsCount - 1);
            }

            console.log("All rows deleted successfully.");
        }


    }


}