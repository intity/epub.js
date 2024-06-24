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
		 * @member {string} current
		 * @memberof Themes
		 * @readonly
		 */
		this.current = undefined;
		/**
		 * Injected css rules
		 * @member {object} rules
		 * @memberof Themes
		 * @readonly
		 */
		this.rules = {};
		this.rendition.hooks.content.register(this.inject.bind(this));
		this.rendition.hooks.content.register(this.update.bind(this));
	}

	/**
	 * Add themes to be used by a rendition
	 * @param {object|Array<object>|string} args
	 * @example themes.register("light", "http://example.com/light.css")
	 * @example themes.register("light", { body: { color: "purple"}})
	 * @example themes.register({ light: {...}, dark: {...}})
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
	 * @param {object} themes
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
	 * @param {string} name Theme name
	 * @param {string} input URL string
	 * @example themes.registerUrl("light", "light.css")
	 * @example themes.registerUrl("light", "http://example.com/light.css")
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
	 * @param {string} name
	 * @param {object} rules
	 * @example themes.registerRules("light", { body: { color: "purple"}})
	 */
	registerRules(name, rules) {

		this.set(name, {
			injected: false,
			rules: rules
		});
	}

	/**
	 * Select a theme
	 * @param {string} name Theme name
	 */
	select(name) {

		const theme = this.get(name);
		if (this.current === name || !theme) return;

		const prev = this.current;
		this.current = name;

		const contents = this.rendition.getContents();
		contents.forEach((content) => {
			if (content) {
				content.removeClass(prev);
				content.addClass(name);
				this.add(name, theme, content);
			}
		});
		/**
		 * Emit which occurs when theme is selected
		 * @event selected
		 * @param {string} name Theme key
		 * @param {object} theme Theme value
		 * @memberof Themes
		 */
		this.emit(EVENTS.THEMES.SELECTED, name, theme);
	}

	/**
	 * Add Theme to contents
	 * @param {string} key
	 * @param {object} value 
	 * @param {Contents} contents
	 * @private
	 */
	add(key, value, contents) {

		if (value.url) {
			contents.addStylesheet(value.url);
			value.injected = true;
		}
		if (value.rules) {
			contents.addStylesheetRules(value.rules, key);
			value.injected = true;
		}
		if (value.injected) {
			/**
			 * Emit of injected a stylesheet into contents
			 * @event injected
			 * @param {string} key Theme key
			 * @param {object} value Theme value
			 * @param {Contents} contents
			 * @memberof Themes
			 */
			this.emit(EVENTS.THEMES.INJECTED, key, value, contents);
		}
	}

	/**
	 * Inject all themes into contents
	 * @param {Contents} contents
	 * @private
	 */
	inject(contents) {
		
		this.forEach((value, key) => {

			if (this.current === key) {
				this.add(key, value, contents);
			}
		});

		contents.addClass(this.current);
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
	 * @param {string} name
	 * @param {string} value
	 * @param {boolean} [priority=false]
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
	 * @param {string} name
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
	 * @param {number} size
	 */
	fontSize(size) {

		this.appendRule("font-size", size);
	}

	/**
	 * Adjust the font-family of a rendition
	 * @param {string} f
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