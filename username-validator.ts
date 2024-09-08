import { ValidatorErrorHandler } from "./auth-validator";
import profanity from "./profanity.json";

interface ProfanityDetails {
	id: string;
	match: string;
	tags: string[];
	severity: number;
	exceptions?: string[];
}

interface Details {
	message: string;
	username: string;
	profanityData?: ProfanityDetails;
	isProfane: boolean;
}

class UsernameValidator {
	private username: string;
	private usernameRegex: RegExp;
	private strictLowerCase: boolean;
	private errorObject = new ValidatorErrorHandler();
	private usernameMaxLength: number;
	private usernameMinLength: number;

	constructor() {
		this.username = "";
		// this.usernameRegex = /^[a-zA-Z0-9]+$/;
		this.strictLowerCase = true;
		this.usernameMaxLength = 256;
		this.usernameMinLength = 5;
		this.usernameRegex = new RegExp(
			String.raw`/^[a-zA-Z0-9_]{${
				(this.usernameMinLength, this.usernameMaxLength)
			}}$/`
		);
	}

	// TODO - create a method that'll allow the user to add in a max length and min length for the username and it'll check
	// TODO - create a method that'll check if the username contains certain symbols/characters
	// TODO - create a method that'll remove/replace characters with what the user passes
	// TODO - create a method that'll convert a string to a username-friendly format
	// TODO - have a boolean param representing whether or not to filter out inappropriate usernames
	// TODO - allow the user to blacklist/whitelist certain usernames
	//      -> maybe also have an array that'll contain strings where the user is able to "override" a blacklisted/whitelisted term
	// TODO - create a method that'll check if the username is in valid camelCase form and PascalCase form
	// TODO - create a method that'll allow users to pass in a character they'd like to replace spaces with/maybe allow them to enable/disable the option to remove spaces

	toPascalCase(): string {
		// expects a username with spaces (ex. 'some username here')
		// it will convert that username to pascalCase like so: SomeUsernameHere (capitalizes the first letter of every word)
		// if a username with no spaces is provided, it will simply return the username as-is
		const { username } = this;

		if (!username) {
			const errorObject = this.errorObject.createError(
				"No username provided. Please be sure to use the 'setUsername' method prior to using this method"
			);

			throw errorObject;
		}

		if (username.includes(" ")) {
			const words: string[] = username.split(" ");
			const pascalCasedUsername = words
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join("");

			this.username = pascalCasedUsername;
			return this.username;
		}

		return username;
	}

	toCamelCase() {
		// expects a username with spaces (ex. 'some username here')
		// it will convert that username to camelCase like so: someUsernameHere
		// if a username with no spaces is provided, it will simply convert it to lowercase
		const { username } = this;

		if (!username) {
			const errorObject = this.errorObject.createError(
				"No username provided. Please be sure to use the 'setUsername' method prior to using this method"
			);

			throw errorObject;
		}

		if (username.includes(" ")) {
			const camelCasedString = username
				.split(" ")
				.map((word: string, index: number) =>
					index === 0
						? word.toLowerCase()
						: word.charAt(0).toUpperCase() + word.slice(1)
				)
				.join("");

			this.username = camelCasedString;

			return this.username;
		} else {
			return this.username.toLowerCase();
		}
	}

	private binarySearch(profanity: ProfanityDetails[], target: string): number {
		let leftIndex = 0;
		let rightIndex = profanity.length - 1;
		while (leftIndex <= rightIndex) {
			let middleIndex = Math.floor((leftIndex + rightIndex) / 2);
			if (profanity[middleIndex].match.includes(target)) {
				return middleIndex;
			}
			// TODO - need to make this logic work because 'target' is a string
			if (target < profanity[middleIndex].match) {
				rightIndex = middleIndex - 1;
			} else {
				leftIndex = middleIndex + 1;
			}
		}
		return -1;
	}

	isInappropriateUsername(wantDetails?: boolean): boolean | Details {
		// wantDetails - a boolean representing if the method should return some details about whether or not the username is inappropriate
		// assumes username uses underscores
		const index = this.binarySearch(
			profanity,
			this.username.toLowerCase().replace(/_/g, " ")
		);

		if (!this.username) {
			const errorObject = this.errorObject.createError(
				"No username provided. Make sure you're using the the 'setUsername()' method to provide a username"
			);
			throw errorObject;
		}

		if (index === -1 && wantDetails) {
			return {
				message:
					"This username does not appear to be inappropriate. If you find this to be a mistake, please be sure to blacklist it by using the 'blackList' method",
				username: this.username,
				isProfane: false
			};
		} else if (index !== -1 && wantDetails) {
			return {
				message: "This username is inappropriate",
				username: this.username,
				profanityData: profanity[index],
				isProfane: true
			};
		}

		return index === -1;
	}

	setUsername(username: string, lowercaseStrict?: boolean) {
		// lowerCaseStrict - an optional param where you can enforce usernames being converted to lowercase nor not. By default, it's set to true so all usernames. However, to override that, pass in 'false' which will result in all usernames not being converted to lowercase.

		if (lowercaseStrict === false) {
			this.strictLowerCase = false;
		}

		this.username = this.strictLowerCase ? username.toLowerCase() : username;
		return this;
	}

	get u_name(): string {
		return this.username;
	}

	addUsernameRegex(usernameRegex: RegExp) {
		this.usernameRegex = usernameRegex;
		return this;
	}

	checkUsername(
		username: string,
		minUsernameLength: number,
		maxUsernameLength: number
	) {
		if (minUsernameLength === 0 || maxUsernameLength === 0) {
			const errorObject = this.errorObject.createError(
				"Min and max username length must be greater than 0"
			);

			throw errorObject;
		} else {
			if (
				username.length < minUsernameLength ||
				username.length > maxUsernameLength
			) {
				const errorObject = this.errorObject.createError(
					`Please make sure your username has a max of ${maxUsernameLength} characters and a minimum of ${minUsernameLength} characters`
				);

				throw errorObject;
			}
		}
	}

	isValidUsername(user_name?: string): boolean {
		return user_name
			? this.usernameRegex.test(user_name)
			: this.usernameRegex.test(this.username);
	}
}

export default UsernameValidator;
