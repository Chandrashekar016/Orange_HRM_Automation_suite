import {Page, expect} from "@playwright/test"
import dotenv from 'dotenv'


export class PIMPage {

    readonly page: Page;
    readonly PIM;
    readonly Add;
    readonly newFirstname;
    readonly newLastname;
    readonly createLoginDetailsCheckbox;
    readonly statusLabel;
    readonly newUsername;
    readonly newPassword;
    readonly enabledRadio;
    readonly confirmPassword;
    readonly newUserSaveBtn;
    readonly personalDetailsHeader;


    constructor(page: Page)
    {
        //page intiatlization;
        this.page = page;

        //All elements initialization;
        this.PIM = this.page.locator("//span[text()='PIM']");
        this.Add = this.page.getByRole("button",{name: "Add"});
        this.newFirstname = this.page.getByPlaceholder("First Name");
        this.newLastname = this.page.getByPlaceholder("Last Name");
        this.createLoginDetailsCheckbox = this.page.locator(".oxd-switch-input");
        this.statusLabel = this.page.locator("//label[text()='Status']");
        this.newUsername= this.page.locator("//label[text()='Username']/following::input[1]");
        this.enabledRadio = this.page.getByLabel("Enabled");
        this.newPassword = this.page.locator("//label[text()='Password']/following::input[1]");
        this.confirmPassword = this.page.locator("//label[text()='Confirm Password']/following::input[1]");
        this.newUserSaveBtn = this.page.getByRole('button',{name: "Save"});
        this.personalDetailsHeader = this.page.locator("//h6[text()='Personal Details']");
        
    }


    async navigatetoAddUserPage()
    {
        await this.PIM.click({timeout: 3000});
        await this.Add.click({timeout: 3000});
    }

    async addNewEmployee(newFirstname: string, newLastname: string)
    {
        await this.newFirstname.fill(newFirstname);
        await this.newLastname.fill(newLastname);
    }

    async checkCreateLoginDetails()
    {
        await this.createLoginDetailsCheckbox.click();
        // await expect(this.createLoginDetailsCheckbox).toBeChecked({timeout: 3000});
        await expect(this.newUsername).toBeVisible();
        await expect(this.newPassword).toBeVisible();
    }

    async creatNewUserDetails(newUserName: string, newPassword: string)
    {
        await this.newUsername.fill(newUserName);
        await expect(this.enabledRadio).toBeEnabled();
        await this.newPassword.fill(newPassword);
        await this.confirmPassword.fill(newPassword);
        await this.newUserSaveBtn.click();

    }
}