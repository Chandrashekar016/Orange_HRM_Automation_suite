import { faker } from '@faker-js/faker';


export function generateEmployee(){
    return {

         firstname : faker.person.firstName(),
         lastname : faker.person.lastName(),
         newUserName :  faker.internet.userName(),
         newPassword :  faker.internet.password(),
         phoneNumber :  faker.phone.number()

    };

}
