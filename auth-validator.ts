// interface EmailOptions {
// 	strictDomain: boolean; // represents whether or not the user can add an email from any domain
// 	permittedDomains?: string[]; // list of email domains permitted - only required IF strictDomain is true
// 	onlyEduEmails?: boolean; // false by default
// 	permittedEduExtension?: string; // edu email extension (ex. udel.edu, wilmu.edu, etc.) - only applicable if onlyEduEmails is true
// 	noTempEmails: boolean; // represents whether or not temporary emails are allowed or not - false by default
// }

interface EmailOptions {
	strictDomain: boolean; // represents whether or not the user can add an email from any domain
	permittedDomains: string[] | string; // list of email domains permitted - only required IF strictDomain is true
	noTempEmails: boolean; // represents whether or not temporary emails are allowed or not - false by default
}

/*
	onlyEduEmails?: boolean; // false by default
	
    permittedEduExtension?: string; // edu email extension (ex. udel.edu, wilmu.edu, etc.) - only applicable if onlyEduEmails is true

*/

class EmailValidator {
	private strictDomain: boolean;
	private permittedDomains: string[] | string;
	private noTempEmails: boolean;
	private email: string;
	private isEduEmail: boolean;

	constructor() {
		this.email = "";
		this.strictDomain = false;
		this.permittedDomains = "any";
		this.noTempEmails = false;
		this.isEduEmail = false;
	}

	setEmail(email: string) {
		this.email = email;
		return this;
	}

	get isValidEduEmail(): boolean {
		return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu)$/i.test(this.email);
	}

	validateEmail(email: string, options: EmailOptions) {
		this.email = email;

		if (!this.isValidEduEmail) {
			const { strictDomain, permittedDomains, noTempEmails } = options;

			if (strictDomain && permittedDomains?.length === 0) {
				throw new Error(
					"Permitted Domains must be provided if strictDomain is true"
				);
			} else if (!strictDomain && !noTempEmails) {
				throw new Error("noTempEmails must be true if strictDomain is false");
			} else if (strictDomain && !noTempEmails) {
				throw new Error("noTempEmails must be true if strictDomain is true");
			}

			// TODO - implement logic to validate the email
		} else {
			throw new Error(
				"Email is an edu email; cannot validate with options. Use the 'isValidEduEmail' instead"
			);
		}
	}
}

export { EmailValidator };
