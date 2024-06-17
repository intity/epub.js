import Manifest from "./manifest";
import Metadata from "./metadata";
import Spine from "./spine";
import { qs, qsp } from "./utils/core";

/**
 * Open Packaging Format Parser
 */
class Packaging {
	/**
	 * Constructor
	 * @param {Document} [packageXml] OPF XML
	 */
	constructor(packageXml) {
		/**
		 * @member {Metadata} metadata
		 * @memberof Packaging
		 * @readonly
		 */
		this.metadata = new Metadata();
		/**
		 * @member {Manifest} manifest
		 * @memberof Packaging
		 * @readonly
		 */
		this.manifest = new Manifest();
		/**
		 * @member {Spine} spine
		 * @memberof Packaging
		 * @readonly
		 */
		this.spine = new Spine();
		/**
		 * @member {string} version Package version
		 * @memberof Packaging
		 * @readonly
		 */
		this.version = "";
		/**
		 * @member {string} direction
		 * @memberof Packaging
		 * @readonly
		 */
		this.direction = "";

		if (packageXml) {
			this.parse(packageXml);
		}
	}

	/**
	 * Parse OPF XML
	 * @param {Document} packageXml OPF XML
	 * @return {object} parsed package parts
	 */
	parse(packageXml) {

		if (!packageXml) {
			throw new Error("Package File Not Found");
		}

		const metadataNode = qs(packageXml, "metadata");
		if (!metadataNode) {
			throw new Error("No Metadata Found");
		}

		const manifestNode = qs(packageXml, "manifest");
		if (!manifestNode) {
			throw new Error("No Manifest Found");
		}

		const spineNode = qs(packageXml, "spine");
		if (!spineNode) {
			throw new Error("No Spine Found");
		}

		this.metadata.parse(metadataNode);
		this.manifest.parse(manifestNode);
		this.spine.parse(spineNode);
		this.uniqueIdentifier = this.findUniqueIdentifier(packageXml);
		this.direction = this.parseDirection(packageXml, spineNode);
		this.version = this.parseVersion(packageXml);

		return {
			metadata: this.metadata,
			manifest: this.manifest,
			spine: this.spine,
			direction: this.direction,
			version: this.version
		}
	}

	/**
	 * Parse direction flow
	 * @param {Document} packageXml
	 * @param {Node} node spine node 
	 * @returns {string}
	 * @private
	 */
	parseDirection(packageXml, node) {

		const el = packageXml.documentElement;
		let dir = el.getAttribute("dir");
		if (dir === null) {
			dir = node.getAttribute("page-progression-direction");
		}
		return dir || "";
	}

	/**
	 * Find Unique Identifier
	 * @param {Document} packageXml
	 * @return {string} Unique Identifier text
	 * @private
	 */
	findUniqueIdentifier(packageXml) {

		const el = packageXml.documentElement;
		const uniqueIdentifier = el.getAttribute("unique-identifier");
		if (!uniqueIdentifier) {
			return "";
		}

		const identifier = packageXml.getElementById(uniqueIdentifier);
		if (!identifier) {
			return "";
		}

		if (identifier.localName === "identifier" &&
			identifier.namespaceURI === "http://purl.org/dc/elements/1.1/") {
			return identifier.childNodes.length > 0 ? identifier.childNodes[0].nodeValue.trim() : "";
		}

		return "";
	}

	/**
	 * Parse package version
	 * @param {Document} packageXml 
	 * @returns {string}
	 * @private
	 */
	parseVersion(packageXml) {

		const pkg = qs(packageXml, "package");
		return pkg.getAttribute("version") || "";
	}

	/**
	 * Load JSON Manifest
	 * @param {json} json 
	 * @return {object} parsed package parts
	 */
	load(json) {

		const metadata = json.metadata;
		Object.keys(metadata).forEach((prop) => {
			this.metadata.set(prop, metadata[prop]);
		});

		const spine = json.readingOrder || json.spine;
		this.spine.items = spine.map((item, index) => {
			item.index = index;
			item.linear = item.linear || "yes";
			return item;
		});

		json.resources.forEach((item, index) => {
			this.manifest.set(index, item);
			if (item.rel && item.rel[0] === "cover") {
				this.manifest.coverPath = item.href;
			}
		});

		this.toc = json.toc.map((item, index) => {
			item.label = item.title;
			return item;
		});

		return {
			metadata: this.metadata,
			manifest: this.manifest,
			spine: this.spine,
			toc: this.toc
		}
	}

	/**
	 * destroy
	 */
	destroy() {

		this.metadata.destroy();
		this.manifest.destroy();
		this.spine.destroy();

		this.metadata = undefined;
		this.manifest = undefined;
		this.spine = undefined;
		this.direction = undefined;
		this.version = undefined;
	}
}

export default Packaging;