import Path from "./utils/path";
import { qs } from "./utils/core";

/**
 * Parsing the Epub Container
 * @link https://www.w3.org/TR/epub/#sec-container-metainf
 */
class Container {
	/**
	 * Constructor
	 * @param {Document} [containerDocument] xml document
	 */
	constructor(containerDocument) {
		/**
		 * @member {string} directory Package directory
		 * @memberof Container
		 * @readonly
		 */
		this.directory = "";
		/**
		 * @member {string} fullPath Path to package file
		 * @memberof Container
		 * @readonly
		 */
		this.fullPath = "";
		/**
		 * @member {string} encoding Encoding
		 * @memberof Container
		 * @readonly
		 */
		this.encoding = "";
		/**
		 * @member {string} mediaType Media type
		 * @memberof Container
		 * @readonly
		 */
		this.mediaType = "";

		if (containerDocument) {
			this.parse(containerDocument);
		}
	}

	/**
	 * Parse the Container XML
	 * @param {Document} containerDocument
	 */
	parse(containerDocument) {

		if (!containerDocument) {
			throw new Error("Container File Not Found");
		}

		// <rootfile
		//   full-path="OPS/package.opf" 
		//   media-type="application/oebps-package+xml"/>
		const rootfile = qs(containerDocument, "rootfile");

		if (!rootfile) {
			throw new Error("No RootFile Found");
		}

		this.fullPath = rootfile.getAttribute("full-path");
		this.directory = Path.prototype.dirname(this.fullPath);
		this.encoding = containerDocument.characterSet;
		this.mediaType = rootfile.getAttribute("media-type");
	}

	/**
	 * destroy
	 */
	destroy() {

		this.directory = undefined;
		this.fullPath = undefined;
		this.encoding = undefined;
		this.mediaType = undefined;
	}
}

export default Container;