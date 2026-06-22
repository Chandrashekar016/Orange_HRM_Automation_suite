import {expect, Page} from "@playwright/test"
import { url } from "inspector";



export class HomePage{

readonly page : Page;
//readonly welcomeLogo;
readonly LoginPageLoginHeading;
readonly usernameInput;
readonly passwordInput;
readonly loginButton; 
readonly dashboardHeader;

constructor(page: Page){

    this.page = page;
    
    //locators of the home page.
    //this.welcomeLogo = page.getByAltText("company-branding") 
    this.usernameInput = this.page.locator("input[placeholder='Username']");
    this.passwordInput = this.page.locator("input[placeholder='Password']");
    this.loginButton = this.page.locator("button[type='submit']");
    this.dashboardHeader = this.page.locator("//h6[text()='Dashboard']");
    this.LoginPageLoginHeading = this.page.locator("//h5[text()='Login']");


}


async navigateToHomepage()
{
     await this.page.goto('/');  // since we added the baseURL in the playwright.config.ts file, we can use relative URL here.
     // if we wanted goto register page just give "/register" to navigate to register page.
     await expect(this.LoginPageLoginHeading).toBeVisible({timeout: 10000});
}

async PerformLogin(username: string, password: string)
{
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password);
    await this.loginButton.click();
}


}