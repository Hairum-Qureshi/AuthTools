import { ValidatorErrorHandler } from "./auth-validator";
// JSON credit to https://github.com/dsojevic/profanity-list
// License: MIT
// A few additions added by me
import profanity from "./profanity.json";

// TODO:
// - may need to utilize '.match()' Regex method compared to '.test()' (lookup difference for more research)
// - utilize the '.endsWith()' method compared to using the splitting logic you normally use

// TODO - ensure username uses the Latin text
// 		-> https://stackoverflow.com/questions/10940137/regex-test-v-s-string-match-to-know-if-a-string-matches-a-regular-expression

// TODO - move the blacklister logic to a separate class that extends the username validator

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
	protected username: string;
	protected usernameRegex: RegExp;
	protected strictLowerCase: boolean;
	protected errorObject = new ValidatorErrorHandler();
	protected usernameMaxLength: number;
	protected usernameMinLength: number;
	protected blackListedUsernames: string[];

	constructor() {
		this.username = "";
		// this.usernameRegex = /^[a-zA-Z0-9]+$/;
		this.strictLowerCase = true;
		this.usernameMaxLength = 256;
		this.usernameMinLength = 5;
		this.usernameRegex = new RegExp(
			`^[a-zA-Z0-9_]{${this.usernameMinLength},${this.usernameMaxLength}}$`
		);
		// TODO - add default values to black list array
		this.blackListedUsernames = ["admin"];
	}

	// TODO - create a method that'll allow the user to add in a max length and min length for the username and it'll check
	// TODO - create a method that'll check if the username contains certain symbols/characters
	// TODO - create a method that'll remove/replace characters with what the user passes
	// TODO - create a method that'll convert a string to a username-friendly format
	// TODO - have a boolean param representing whether or not to filter out inappropriate usernames
	// TODO - add a snake_case method and a check to see if a username is in valid snake_case form
	// TODO - create a method that'll allow users to pass in a character they'd like to replace spaces with/maybe allow them to enable/disable the option to remove spaces
	// TODO - create a private method that'll simply return an error if there's no username provided which'll prevent duplicate code
	// TODO - implement logic to check if the username the user passes in exists inside of the black listed array
	// 		-> may need to also format the usernames inside of the black listed array so they're in proper username format

	toPascalCase(): string {
		// expects a username with spaces (ex. 'some username here')
		// it will convert that username to pascalCase like so: SomeUsernameHere (capitalizes the first letter of every word)
		// if a username with no spaces is provided, it will simply return the username as-is
		// TODO - maybe make it so that if a username is something like 'userName', it will check if the string is in valid camelCase and if it is, it would simply need to capitalize the first letter

		if (!this.username) {
			const errorObject = this.errorObject.createError(
				"No username provided. Please be sure to use the 'setUsername' method prior to using this method"
			);

			throw errorObject;
		}

		if (this.username.includes(" ")) {
			const words: string[] = this.username.split(" ");
			const pascalCasedUsername = words
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join("");

			this.username = pascalCasedUsername;
			return this.username;
		}

		return this.username;
	}

	isValidPascalCase(): boolean {
		if (!this.username) {
			const errorObject = this.errorObject.createError(
				"No username provided. Please be sure to use the 'setUsername' method prior to using this method"
			);

			throw errorObject;
		}

		return /[A-Z]([A-Z0-9]*[a-z][a-z0-9]*[A-Z]|[a-z0-9]*[A-Z][A-Z0-9]*[a-z])[A-Za-z0-9]*/.test(
			this.username
		);
	}

	toCamelCase() {
		// TODO - maybe make it accept it with underscores too?
		// expects a username with spaces (ex. 'some username here')
		// it will convert that username to camelCase like so: someUsernameHere
		// if a username with no spaces is provided, it will simply convert it to lowercase

		if (!this.username) {
			const errorObject = this.errorObject.createError(
				"No username provided. Please be sure to use the 'setUsername' method prior to using this method"
			);

			throw errorObject;
		}

		if (this.username.includes(" ")) {
			const camelCasedString = this.username
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

	isValidCamelCase(): boolean {
		if (!this.username) {
			const errorObject = this.errorObject.createError(
				"No username provided. Please be sure to use the 'setUsername' method prior to using this method"
			);

			throw errorObject;
		}

		return /^[a-z]+(?:[A-Z][a-z0-9]*)*$/.test(this.username);
	}

	private binarySearch(target: string): number {
		// TODO - consider making this algorithm recursive
		// TODO - need some improvement
		let leftIndex = 0;
		let rightIndex = profanity.length - 1;

		while (leftIndex <= rightIndex) {
			let middleIndex = Math.floor((leftIndex + rightIndex) / 2);
			let middleId = profanity[middleIndex].id;
			let middlePattern = new RegExp(profanity[middleIndex].match);

			console.log(target, middleId);
			if (target.includes(middleId) || middlePattern.test(target)) {
				return middleIndex;
			}

			if (target < middleId) {
				rightIndex = middleIndex - 1;
			} else {
				leftIndex = middleIndex + 1;
			}
		}

		return -1;
	}

	addToBlackList(wordsToAdd: string[]) {
		// TODO - maybe implement a max length for the black list array
		// TODO - maybe add a check to see if the words are in a valid username format?
		if (!this.username) {
			const errorObject = this.errorObject.createError(
				"No username provided. Make sure you're using the the 'setUsername()' method to provide a username"
			);
			throw errorObject;
		}

		if (wordsToAdd.length === 0) {
			const errorObject = this.errorObject.createError(
				"No words provided. Please make sure your array has at least 1 word inside it"
			);
			throw errorObject;
		}

		wordsToAdd.map((wordToAdd: string) => {
			if (
				this.blackListedUsernames.find(
					(word: string) => word === wordToAdd.toLowerCase()
				)
			) {
				{
					const errorObject = this.errorObject.createError(
						`'${wordToAdd}' already exists inside of the blacklist array`
					);
					throw errorObject;
				}
			} else {
				this.blackListedUsernames.push(wordToAdd.toLowerCase());
			}
		});

		return this;
	}

	getBlackListedUsernames(): string[] {
		return this.blackListedUsernames;
	}

	isInappropriateUsername(wantDetails?: boolean): boolean | Details {
		// wantDetails - a boolean representing if the method should return some details about whether or not the username is inappropriate
		// assumes username uses underscores
		const index = this.binarySearch(
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
				message: "This username does not appear to be inappropriate",
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
		// lowerCaseStrict - an optional param where you can enforce usernames being converted to lowercase nor not. By default, it's set to true for all usernames. However, to override that, pass in 'false' which will result in all usernames not being converted to lowercase.

		if (lowercaseStrict === false) {
			this.strictLowerCase = false;
		}

		this.blackListedUsernames.map((bannedWord: string) => {
			if (bannedWord === username.toLowerCase()) {
				const errorObject = this.errorObject.createError(
					"This username is blacklisted. Please try another username"
				);

				throw errorObject;
			}
		});

		this.username = this.strictLowerCase ? username.toLowerCase() : username;
		return this;
	}

	// TODO - rename method
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

class UsernameBlacklist extends UsernameValidator {}

export default UsernameValidator;
