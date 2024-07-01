import EventEmitter from "event-emitter";
import Url from "./utils/url";
import { EVENTS } from "./utils/constants";

/**
 * Themes to apply to displayed content
 */
class Themes extends Map {
	/**
	 * Constructor
	 * @param {Rendition} rendition
	 */
	constructor(rendition) {

		super();
		this.rendition = rendition;
		/**
		 * @member {String} current
		 * @memberof Themes
		 * @readonly
		 */
		this.current = null;
		/**
		 * Injected css rules
		 * @member {Object} rules
		 * @memberof Themes
		 * @readonly
		 */
		this.rules = {};
		this.rendition.hooks.content.register(this.inject.bind(this));
		this.rendition.hooks.content.register(this.update.bind(this));
	}

	/**
	 * Add themes to be used by a rendition
	 * @param {IArguments} args
	 * @example register("light", "/path/to/light.css")
	 * @example register("light", "https://example.com/to/light.css")
	 * @example register("light", { body: { color: "purple"}})
	 * @example register({ light: {...}, dark: {...}})
	 */
	register() {

		if (arguments.length === 0) {
			return;
		}
		if (arguments.length === 1 && typeof (arguments[0]) === "object") {
			return this.registerThemes(arguments[0]);
		}
		if (arguments.length === 2 && typeof (arguments[1]) === "string") {
			return this.registerUrl(arguments[0], arguments[1]);
		}
		if (arguments.length === 2 && typeof (arguments[1]) === "object") {
			return this.registerRules(arguments[0], arguments[1]);
		}
	}

	/**
	 * Register themes object
	 * @param {Object} themes
	 */
	registerThemes(themes) {

		for (const theme in themes) {
			if (themes.hasOwnProperty(theme)) {
				if (typeof (themes[theme]) === "string") {
					this.registerUrl(theme, themes[theme]);
				} else {
					this.registerRules(theme, themes[theme]);
				}
			}
		}
	}

	/**
	 * Register a url
	 * @param {String} name Theme name
	 * @param {String} input URL string
	 * @example registerUrl("light", "light.css")
	 * @example registerUrl("light", "http://example.com/light.css")
	 */
	registerUrl(name, input) {

		const url = new Url(input);
		this.set(name, {
			injected: false,
			url: url.toString()
		});
	}

	/**
	 * Register rule
	 * @param {String} name
	 * @param {Object} rules
	 * @example registerRules("light", { body: { color: "purple"}})
	 */
	registerRules(name, rules) {

		this.set(name, {
			injected: false,
			rules: rules
		});
	}

	/**
	 * Select a theme
	 * @param {String} name Theme name
	 * @description Use null to reject the current selected theme
	 */
	select(name) {

		const prev = this.current;

		let theme;
		if (name) {
			theme = this.get(name);
		} else if (prev && name === null) {
			theme = this.get(prev);
		}
		if (this.current === name || !theme) {
			return;
		}

		this.current = name;

		const contents = this.rendition.getContents();
		contents.forEach((content) => {
			if (!content) {
				return;
			} else if (name) {
				content.removeClass(prev);
				content.appendClass(name);
				this.append(name, theme, content);
			} else if (prev) {
				content.removeClass(prev);
				this.remove(prev, theme, content);
			}
		});
		/**
		 * Emit which occurs when theme is selected
		 * @event selected
		 * @param {String} name Theme key
		 * @param {Object} theme Theme value
		 * @memberof Themes
		 */
		this.emit(EVENTS.THEMES.SELECTED, name, theme);
	}

	/**
	 * Append theme to contents
	 * @param {String} key
	 * @param {Object} theme 
	 * @param {Contents} contents
	 * @private
	 */
	append(key, theme, contents) {

		if (theme.url) {
			contents.appendStylesheet(theme.url, key);
			theme.injected = true;
		}
		if (theme.rules) {
			contents.appendStylesheetRules(theme.rules, key);
			theme.injected = true;
		}
		if (theme.injected) {
			/**
			 * Emit of injected a stylesheet into contents
			 * @event injected
			 * @param {String} key Theme key
			 * @param {Object} theme Theme value
			 * @param {Contents} contents
			 * @memberof Themes
			 */
			this.emit(EVENTS.THEMES.INJECTED, key, theme, contents);
		}
	}

	/**
	 * Remove theme from contents
	 * @param {String} key 
	 * @param {Object} theme 
	 * @param {Contents} contents 
	 * @private
	 */
	remove(key, theme, contents) {

		if (contents.removeStylesheet(key)) {
			theme.injected = false;
			/**
			 * Emit of rejected a stylesheet into contents
			 * @event rejected
			 * @param {String} key Theme key
			 * @param {Object} theme Theme value
			 * @param {Contents} contents
			 * @memberof Themes
			 */
			this.emit(EVENTS.THEMES.REJECTED, key, theme, contents);
		}
	}

	/**
	 * Clear all themes
	 */
	clear() {

		this.select(null);
		super.clear();
	}

	/**
	 * Inject all themes into contents
	 * @param {Contents} contents
	 * @private
	 */
	inject(contents) {

		this.forEach((theme, key) => {

			if (this.current === key) {
				this.append(key, theme, contents);
			}
		});

		contents.appendClass(this.current);
	}

	/**
	 * Update all themes into contents
	 * @param {Contents} contents
	 * @private
	 */
	update(contents) {

		const rules = this.rules;

		for (const rule in rules) {
			if (rules.hasOwnProperty(rule)) {
				contents.css(rule,
					rules[rule].value,
					rules[rule].priority
				);
			}
		}
	}

	/**
	 * Append rule
	 * @param {String} name
	 * @param {String} value
	 * @param {Boolean} [priority=false]
	 */
	appendRule(name, value, priority = false) {

		const rule = {
			value: value,
			priority: priority
		};
		const contents = this.rendition.getContents();
		contents.forEach((content) => {
			if (content) {
				content.css(name,
					rule.value,
					rule.priority
				);
			}
		});
		this.rules[name] = rule;
	}

	/**
	 * Remove rule
	 * @param {String} name
	 */
	removeRule(name) {

		delete this.rules[name];
		const contents = this.rendition.getContents();
		contents.forEach((content) => {
			if (content) {
				content.css(name);
			}
		});
	}

	/**
	 * Remove all rules
	 */
	removeRules() {

		Object.keys(this.rules).forEach((key) => {
			this.removeRule(key);
		});
	}

	/**
	 * Adjust the font size of a rendition
	 * @param {String} size
	 */
	fontSize(size) {

		this.appendRule("font-size", size);
	}

	/**
	 * Adjust the font-family of a rendition
	 * @param {String} f
	 */
	font(f) {

		this.appendRule("font-family", f, true);
	}

	/**
	 * destroy
	 */
	destroy() {

		this.clear();
		this.removeRules();
		this.current = undefined;
		this.rules = undefined;
	}
}

EventEmitter(Themes.prototype);

export default Themes;