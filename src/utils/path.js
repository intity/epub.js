/**
 * Creates a Path object for parsing and manipulation of a path strings
 * @link https://nodejs.org/api/path.html
 */
class Path {
	/**
	 * Constructor
	 * @param {string} uri a url string (relative or absolute)
	 */
	constructor(uri) {

		if (uri.indexOf("://") > -1) {
			uri = new URL(uri).pathname;
		}

		const parsed = this.parse(uri);
		/**
		 * @member {string} directory
		 * @memberof Path
		 * @readonly
		 */
		this.directory = parsed.dir + "/";
		/**
		 * @member {string} filename
		 * @memberof Path
		 * @readonly
		 */
		this.filename = parsed.base;
		/**
		 * @member {string} extension
		 * @memberof Path
		 * @readonly
		 */
		this.extension = parsed.ext.slice(1);
		/**
		 * @member {string} path
		 * @memberof Path
		 * @readonly
		 */
		this.path = uri;
	}

	/**
	 * Parse the path
	 * @link https://nodejs.org/api/path.html#path_path_parse_path
	 * @param {string} path
	 * @returns {object}
	 */
	parse(path) {

		const ret = { root: "", dir: "", base: "", ext: "", name: "" };

		if (path.length === 0) {
			return ret;
		}

		const parts = this.splitPath(path);
		if (!parts || parts.length !== 4) {
			throw new Error(`Invalid path: ${path}`);
		}

		ret.root = parts[0];

		if (this.isDirectory(path)) {
			ret.dir = parts[0] + parts[1] + parts[2];
		} else {
			ret.dir = parts[0] + parts[1].slice(0, -1);
			ret.base = parts[2];
			ret.ext = parts[3];
			ret.name = parts[2].slice(0, parts[2].length - parts[3].length);
		}

		return ret;
	}

	/**
	 * dirname
	 * @link https://nodejs.org/api/path.html#pathdirnamepath
	 * @param {string} path 
	 * @returns {string}
	 */
	dirname(path) {

		const result = this.splitPath(path);
		const root = result[0];
		const dir = result[1];

		if (!root && !dir) {
			return ".";
		}

		return root + dir;
	}

	/**
	 * isAbsolute
	 * @link https://nodejs.org/api/path.html#pathisabsolutepath
	 * @param {string} path
	 * @returns {boolean}
	 */
	isAbsolute(path) {

		return path.charAt(0) === "/";
	}

	/**
	 * Check if path ends with a directory
	 * @param {string} path
	 * @returns {boolean}
	 */
	isDirectory(path) {

		return path.charAt(path.length - 1) === "/";
	}

	/**
	 * Resolve path
	 * @link https://nodejs.org/api/path.html#pathresolvepaths
	 * @returns {string} resolved
	 */
	resolve() {

		let resolvedPath = "";
		let resolvedAbsolute = false;

		for (let i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {

			let path;
			if (i >= 0) {
				path = arguments[i];
			} else {
				path = process ? process.cwd() : "/";
			}

			if (path.length === 0) {
				continue;
			}

			resolvedPath = path + "/" + resolvedPath;
			resolvedAbsolute = this.isAbsolute(path);
		}

		resolvedPath = this.normalizeArray(
			resolvedPath.split("/"),
			!resolvedAbsolute
		).join("/");
		return ((resolvedAbsolute ? "/" : "") + resolvedPath) || ".";
	}

	/**
	 * Relative path resolve
	 * @link https://nodejs.org/api/path.html#pathrelativefrom-to
	 * @param {string} from
	 * @param {string} to 
	 * @returns {string} relative path
	 */
	relative(from, to) {

		if (from === to) return "";

		from = this.resolve(from);
		to = this.resolve(to);

		if (from === to) return "";

		const fromParts = this.trimArray(from.split("/"));
		const toParts = this.trimArray(to.split("/"));

		const length = Math.min(fromParts.length, toParts.length);
		let samePartsLength = length;
		for (let i = 0; i < length; i++) {
			if (fromParts[i] !== toParts[i]) {
				samePartsLength = i;
				break;
			}
		}

		let outputParts = [];
		for (let i = samePartsLength; i < fromParts.length; i++) {
			outputParts.push("..");
		}

		outputParts = outputParts.concat(toParts.slice(samePartsLength));
		return outputParts.join("/");
	}

	/**
	 * Normalize path
	 * @link https://nodejs.org/api/path.html#pathnormalizepath
	 * @param {string} path 
	 * @returns {string}
	 */
	normalize(path) {

		const isAbsolute = this.isAbsolute(path);
		const trailingSlash = path && path[path.length - 1] === "/";

		path = this.normalizeArray(path.split("/"), !isAbsolute).join("/");

		if (!path && !isAbsolute) {
			path = ".";
		}
		if (path && trailingSlash) {
			path += "/";
		}

		return (isAbsolute ? "/" : "") + path;
	}

	/**
	 * Return the path string
	 * @returns {string} path
	 */
	toString() {

		return this.path;
	}

	normalizeArray(parts, allowAboveRoot) {

		const res = [];
		for (let i = 0; i < parts.length; i++) {
			const p = parts[i];

			if (!p || p === ".") {
				continue;
			}

			if (p === "..") {
				if (res.length && res[res.length - 1] !== "..") {
					res.pop();
				} else if (allowAboveRoot) {
					res.push("..");
				}
			} else {
				res.push(p);
			}
		}

		return res;
	}

	splitPath(filename) {

		const pattern = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
		return pattern.exec(filename).slice(1);
	}

	trimArray(arr) {

		const lastIndex = arr.length - 1;

		let start = 0;
		for (; start <= lastIndex; start++) {
			if (arr[start]) {
				break;
			}
		}

		let end = lastIndex;
		for (; end >= 0; end--) {
			if (arr[end]) {
				break;
			}
		}

		if (start === 0 && end === lastIndex) {
			return arr;
		}

		if (start > end) {
			return [];
		}

		return arr.slice(start, end + 1);
	}
}

export default Path;