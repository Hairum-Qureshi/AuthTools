interface EmailOptions {
	strictDomain: boolean; // represents whether or not the user can add an email from any domain
	permittedDomains: string[]; // list of email domains permitted - only required IF strictDomain is true
	noTempEmails: boolean; // represents whether or not temporary emails are allowed or not - false by default
	showPermittedDomains?: boolean; // represents whether or not to show the list of permitted domains on error
}

interface ErrorObject {
	errorMessage: string;
	errorName: string;
}

// ! Regex utilized is RFC 5322
// https://stackoverflow.com/questions/13992403/regex-validation-of-email-addresses-according-to-rfc5321-rfc5322

// TODO - still need to handle these methods regarding edu emails:
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
	private MAX_LOCAL_EMAIL_LENGTH = 254;
	private MIN_LOCAL_EMAIL_LENGTH = 3;
	private emailRegex: RegExp;

	constructor() {
		this.email = "";
		this.strictDomain = false;
		this.permittedDomains = []; // if empty, assumes all domains are permitted
		this.noTempEmails = false;
		this.isEduEmail = false;
		this.asArray = false;
		this.showPermittedDomains = false;
		this.emailRegex =
			/([-!#-'*+\/-9=?A-Z^-~]+(\.[-!#-'*+\/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/;
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
		this.email = email.toLowerCase();
		return this;
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

	matchesDomain(domain: string) {
		// given a domain param, this method checks if the inputted email's domain matches the domain entered
		// must not include @ sign, just the name (i.e. wanna check if it's a Google domain? Use 'gmail' or 'gmail.com')
		// not recommended to use to check if it's an edu email because it won't be accurate since edu emails have some kinks that differ from other emails

		const domainMatcherRegex = new RegExp(String.raw`@${domain}\s*$`);
		console.log(domainMatcherRegex);
		return domainMatcherRegex.test(this.email);
	}

	// TODO - need to limit the length of the permitted domains array
	// TODO - need to add a check to make sure users are adding the extensions after the '@' symbol in the permitted domains array
	// TODO - handle cases where it's an edu email and check if it's valid
	// TODO - need to make sure permitted domains does not contain duplicate domains
	// TODO - add a more descriptive name for 'errorName'
	// TODO - maybe add a method that'll check if the email domain came from a specific domain?
	// TODO - include option if users would like to prevent temp emails/check if an email is a temp email
	// TODO - maybe add the option for users to provide their own email Regex
	//	-> see: https://stackoverflow.com/questions/3270185/javascript-regex-to-determine-the-emails-domain-yahoo-com-for-example

	isValidEmail(
		domain?: string,
		maxLocalLength?: number,
		minLocalLength?: number
	) {
		// Domain expects the email domain after the '@' symbol (ex. gmail.com, icloud.com, etc.)
		// By default if no domain is provided, the method won't be picky if the domain makes no sense (so long as it passes the regex) so if the user passes in an email like test@gmail.net or test@icloud.school, it'll work fine.
		// TODO - instead of maybe having a string parameter, change it to be an array of string domains?
		// TODO - instead of having the parameter be a domain string/array of strings, maybe add a "strict domain" property where it checks if the domain makes sense? Con is, there's tons of domains and you won't be able to cover every case

		// maxLocalLength represents the maximum characters the local part of the email (the text before the '@' symbol) can be.
		// if it's not provided, it will utilize the default max which is 254 characters

		// minLocalLength represents the minimum characters the local part of the email (the text before the '@' symbol) can be.
		// If it's not provided, it will utilize the default min which is 3 characters

		const local_half = this.email.split("@")[0];

		// TODO - do some more testing on the logic here. You're able to set the maxLocalLength to 1 which goes against the minLocalLength

		// if (minLocalLength) {
		// 	if (minLocalLength > this.MIN_LOCAL_EMAIL_LENGTH) {
		// 		const errorObject = this.createError(
		// 			`The minimum length the local part of an email can be is 3 characters`
		// 		);
		// 		throw errorObject;
		// 	} else if (local_half.length < minLocalLength) {
		// 		const errorObject = this.createError(
		// 			`The local part of your email must be at least ${minLocalLength} characters long`
		// 		);
		// 		throw errorObject;
		// 	}
		// }

		// if (maxLocalLength) {
		// 	if (maxLocalLength > this.MAX_LOCAL_EMAIL_LENGTH) {
		// 		const errorObject = this.createError(
		// 			`The maximum length the local part of an email can be is 254 characters`
		// 		);
		// 		throw errorObject;
		// 	} else if (local_half.length > maxLocalLength) {
		// 		const errorObject = this.createError(
		// 			`The local part of your email must be smaller than ${maxLocalLength} characters long`
		// 		);
		// 		throw errorObject;
		// 	}
		// }

		if (domain && this.email.split("@")[1] !== domain) {
			const errorObject = this.createError(
				"Email domain does not match expected domain"
			);
			throw errorObject;
		}

		return this.emailRegex.test(this.email);
	}

	setEmailRegex(emailRegex: RegExp) {
		this.emailRegex = emailRegex;
		return this;
	}

	validateEmail(email: string, options: EmailOptions) {
		this.email = email.toLowerCase();
		this.permittedDomains = options.permittedDomains;
		this.strictDomain = options.strictDomain;
		this.showPermittedDomains = options.showPermittedDomains || false;

		// TODO - first and foremost: check if the email passed in is in a valid format
		// TODO - check if the local part of the email address does not exceed 254 characters

		if (!this.isValidEmail()) {
			const errorObject = this.createError("Incorrect email format");
			throw errorObject;
		}

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
			if (showPermittedDomains) {
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
