interface EmailOptions {
	strictDomain: boolean; // represents whether or not the user can add an email from any domain
	permittedDomains: string[]; // list of email domains permitted - only required IF strictDomain is true
	noTempEmails: boolean; // represents whether or not temporary emails are allowed or not - false by default
	showPermittedDomains?: boolean; // represents whether or ot to show the list of permitted domains on error
}

interface ErrorObject {
	errorMessage: string;
	errorName: string;
}

/*
	onlyEduEmails?: boolean; // false by default
	
    permittedEduExtension?: string; // edu email extension (ex. udel.edu, wilmu.edu, etc.) - only applicable if onlyEduEmails is true
*/

class EmailValidator {
	private strictDomain: boolean;
	private permittedDomains: string[]; // array containing the extensions after the '@' symbol
	private noTempEmails: boolean;
	private email: string;
	private isEduEmail: boolean;
	private asArray: boolean;
	private showPermittedDomains: boolean;

	constructor() {
		this.email = "";
		this.strictDomain = false;
		this.permittedDomains = []; // if empty, assumes all domains are permitted
		this.noTempEmails = false;
		this.isEduEmail = false;
		this.asArray = false;
		this.showPermittedDomains = false;
	}

	private createError(errorMessage: string): ErrorObject {
		const error = new Error(errorMessage);

		const errorObject = {
			errorMessage: errorMessage,
			errorName: error.name
		};

		return errorObject;
	}

	setEmail(email: string) {
		this.email = email;
	}

	get isValidEduEmail(): boolean {
		return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu)$/i.test(this.email);
	}

	setValidDomains(domains: string[], asArray?: boolean) {
		this.permittedDomains = domains;
		this.asArray = asArray || false;
		return this;
	}

	get allowedDomains(): string | string[] {
		let domains = "";

		if (this.asArray) {
			return this.permittedDomains;
		} else {
			const arrLength = this.permittedDomains.length;

			if (arrLength === 1) {
				domains = this.permittedDomains[0];
			} else {
				if (arrLength === 2) {
					domains = `'${this.permittedDomains[0]}' and '${this.permittedDomains[1]}'`;
				} else {
					this.permittedDomains.map((domain: string, index: number) => {
						domains += `${
							index !== arrLength - 1 ? `'${domain}', ` : `and '${domain}'`
						}`;
					});
				}
			}

			return domains;
		}
	}

	// TODO - need to limit the length of the permitted domains array
	// TODO - need to add a check to make sure users are adding the extensions after the '@' symbol in the permitted domains array
	// TODO - handle cases where it's an edu email and check if it's valid
	// TODO - need to make sure permitted domains does not contain duplicate domains
	// TODO - ensure lowercase safety
	// TODO - add a more descriptive name for 'errorName'

	validateEmail(email: string, options: EmailOptions) {
		this.email = email;
		this.permittedDomains = options.permittedDomains;
		this.strictDomain = options.strictDomain;
		this.showPermittedDomains = options.showPermittedDomains || false;

		// TODO - first and foremost: check if the email passed in is in a valid format

		const {
			strictDomain,
			permittedDomains,
			noTempEmails,
			isEduEmail,
			showPermittedDomains
		} = this;

		if (permittedDomains.length > 10) {
			// TODO - need to test if this works
			const errorObject = this.createError(
				"Permitted domains array cannot contain more than 10 domains"
			);

			throw errorObject;
		}

		if (strictDomain && permittedDomains.length === 0) {
			const errorObject = this.createError(
				"Permitted domains must be provided if strictDomain is true"
			);

			throw errorObject;
		} else if (!strictDomain && permittedDomains.length > 0) {
			const errorObject = this.createError(
				"Permitted domains must not be provided if strictDomain is false"
			);

			throw errorObject;
		} else if (!permittedDomains.includes(email.split("@")[1])) {
			if (!showPermittedDomains) {
				const errorObject = this.createError(
					`Email domain '@${
						email.split("@")[1]
					}' is not permitted. Permitted domains are: ${this.allowedDomains}`
				);

				throw errorObject;
			} else {
				const errorObject = this.createError(
					`Email domain '@${email.split("@")[1]}' is not permitted`
				);

				throw errorObject;
			}
		}
	}
}

export { EmailValidator };
