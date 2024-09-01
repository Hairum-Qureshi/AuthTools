import { EmailValidator } from "./auth-validator";

// const test = {
// 	strictDomain: true, // represents whether or not the user can add an email from any domain
// 	permittedDomains: [], // list of email domains permitted - only required IF strictDomain is true
// 	onlyEduEmails: false, // false by default
// 	permittedEduExtension: "", // edu email extension (ex. udel.edu, wilmu.edu, etc.) - only applicable if onlyEduEmails is true
// 	noTempEmails: true // represents whether or not temporary emails are allowed or not - false by default
// };

const test = {
	strictDomain: true, // represents whether or not the user can add an email from any domain
	permittedDomains: "gmail", // list of email domains permitted - only required IF strictDomain is true
	noTempEmails: true // represents whether or not temporary emails are allowed or not - false by default
};

const email = "hqureshi@udel.edu";
const x = new EmailValidator();
x.setEmail = email;
console.log(x.validateEmail(email, test));
