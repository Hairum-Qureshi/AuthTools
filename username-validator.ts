class UsernameValidator {
	private username: string;
	private usernameRegex: RegExp;
	private strictLowerCase: boolean;

	constructor() {
		this.username = "";
		// this.usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
		this.usernameRegex = /^[a-zA-Z0-9]+$/;
		this.strictLowerCase = true;
	}

	// TODO - create a method that'll check if the username is in valid camelCase form and PascalCase form

	toPascalCase(): string {
		const { username } = this;

		if (!username) {
			throw new Error(
				"No username provided. Please be sure to use the 'setUsername' method prior to using this method"
			);
		}

		if (username.includes(" ")) {
			let pascalCasedUsername = "";
			const words: string[] = username.split(" ");
			words.forEach((word: string) => {
				pascalCasedUsername += word.charAt(0).toUpperCase() + word.slice(1);
			});

			this.username = pascalCasedUsername;
			return this.username;
		} else {
		}

		return username;
	}

	toCamelCase() {
		// expects a username with spaces (ex. 'some username here')
		// it will convert that username to camelCase like so: someUsernameHere
		// if a username with no spaces is provided, it will simply convert it to lowercase
		const { username } = this;

		if (!username) {
			throw new Error(
				"No username provided. Please be sure to use the 'setUsername' method prior to using this method"
			);
		}

		if (username.includes(" ")) {
			let camelCasedUsername = "";
			const words = this.username.split(" ");
			words.forEach((word: string, index: number) => {
				camelCasedUsername +=
					index === 0
						? word.toLowerCase()
						: word.charAt(0).toUpperCase() + word.slice(1);
			});

			this.username = camelCasedUsername;
			return this.username;
		} else {
			return this.username.toLowerCase();
		}
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
			throw new Error("Min and max username length must be greater than 0");
		} else {
			if (
				username.length < minUsernameLength ||
				username.length > maxUsernameLength
			) {
				throw new Error(
					`Please make sure your username has a max of ${maxUsernameLength} characters and a minimum of ${minUsernameLength} characters`
				);
			}
		}
	}

	isValidUsername(user_name?: string): boolean {
		return user_name
			? this.usernameRegex.test(user_name)
			: this.usernameRegex.test(this.username);
	}

	// TODO - create a method where the user is able to add their own username regex
	// TODO - create a method that'll allow the user to add in a max length and min length for the username and it'll check
	// TODO - create a method that'll check if the username contains certain symbols/characters
	// TODO - create a method that'll remove/replace characters with what the user passes
	// TODO - create a method that'll convert a string to a username-friendly format
	// TODO - have a boolean param representing whether or not to filter out inappropriate usernames
	// TODO - allow the user to blacklist/whitelist certain usernames
	//      -> maybe also have an array that'll contain strings where the user is able to "override" a blacklisted/whitelisted term
}

export default UsernameValidator;
