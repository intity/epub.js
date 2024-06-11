import { qs, qsa, qsp, indexOfElementNode } from "./utils/core";

/**
 * Open Packaging Format Parser
 */
class Packaging {
	/**
	 * Constructor
	 * @param {Document} packageXml OPF XML
	 */
	constructor(packageXml) {
		/**
		 * @member {object} manifest
		 * @memberof Packaging
		 * @readonly
		 */
		this.manifest = {};
		/**
		 * @member {object} metadata
		 * @property {string} title
		 * @property {string} creator
		 * @property {string} description
		 * @property {string} publisher
		 * @property {string} language
		 * @property {string} rights
		 * @property {string} date
		 * @property {string} modified
		 * @property {string} flow
		 * @property {string} layout
		 * @property {string} spread
		 * @property {string} viewport
		 * @property {string} orientation
		 * @property {string} media_active_class
		 * @memberof Packaging
		 * @readonly
		 */
		this.metadata = {};
		/**
		 * @member {string} navPath
		 * @memberof Packaging
		 * @readonly
		 */
		this.navPath = "";
		/**
		 * @member {string} ncxPath
		 * @memberof Packaging
		 * @readonly
		 */
		this.ncxPath = "";
		/**
		 * @member {string} coverPath
		 * @memberof Packaging
		 * @readonly
		 */
		this.coverPath = "";
		/**
		 * @member {object[]} spine
		 * @memberof Packaging
		 * @readonly
		 */
		this.spine = [];
		/**
		 * @member {number} spineNodeIndex
		 * @memberof Packaging
		 * @readonly
		 */
		this.spineNodeIndex = 0;
		/**
		 * @member {string} version Package version
		 * @memberof Packaging
		 * @readonly
		 */
		this.version = "";

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

		this.manifest = this.parseManifest(manifestNode);
		this.navPath = this.findNavPath(manifestNode);
		this.ncxPath = this.findNcxPath(manifestNode, spineNode);
		this.coverPath = this.findCoverPath(packageXml);
		this.spineNodeIndex = indexOfElementNode(spineNode);
		this.spine = this.parseSpine(spineNode, this.manifest);
		this.uniqueIdentifier = this.findUniqueIdentifier(packageXml);
		this.metadata = this.parseMetadata(metadataNode, spineNode);
		this.metadata.direction = spineNode.getAttribute("page-progression-direction");
		this.version = this.parseVersion(packageXml);

		return {
			metadata: this.metadata,
			spine: this.spine,
			manifest: this.manifest,
			navPath: this.navPath,
			ncxPath: this.ncxPath,
			coverPath: this.coverPath,
			spineNodeIndex: this.spineNodeIndex,
			version: this.version
		}
	}

	/**
	 * Parse Metadata
	 * @param {Node} node
	 * @return {object} metadata
	 * @private
	 */
	parseMetadata(node) {

		return {
			//-- dc:
			title: this.getElementText(node, "title"),
			creator: this.getElementText(node, "creator"),
			description: this.getElementText(node, "description"),
			publisher: this.getElementText(node, "publisher"),
			identifier: this.getElementText(node, "identifier"),
			language: this.getElementText(node, "language"),
			rights: this.getElementText(node, "rights"),
			date: this.getElementText(node, "date"),
			//-- dcterms:
			modified: this.getPropertyText(node, "dcterms:modified"),
			//-- rendition:
			flow: this.getPropertyText(node, "rendition:flow"),
			layout: this.getPropertyText(node, "rendition:layout"),
			spread: this.getPropertyText(node, "rendition:spread"),
			viewport: this.getPropertyText(node, "rendition:viewport"),
			orientation: this.getPropertyText(node, "rendition:orientation"),
			//-- media:
			media_active_class: this.getPropertyText(node, "media:active-class")
		}
	}

	/**
	 * Parse Manifest
	 * @param {Node} manifestNode
	 * @return {object} manifest
	 * @private
	 */
	parseManifest(manifestNode) {

		const manifest = {};
		//-- Turn items into an array
		const selected = qsa(manifestNode, "item");
		const items = Array.prototype.slice.call(selected);
		//-- Create an object with the id as key
		items.forEach((item) => {
			const id = item.getAttribute("id");
			const props = item.getAttribute("properties") || "";

			manifest[id] = {
				href: item.getAttribute("href") || "",
				type: item.getAttribute("media-type") || "",
				overlay: item.getAttribute("media-overlay") || "",
				properties: props.length ? props.split(" ") : []
			};
		});

		return manifest;
	}

	/**
	 * Parse Spine
	 * @param {Node} spineNode
	 * @param {Packaging.manifest} manifest
	 * @return {object} spine
	 * @private
	 */
	parseSpine(spineNode, manifest) {

		const spine = [];
		const selected = qsa(spineNode, "itemref");
		const items = Array.prototype.slice.call(selected);
		//-- Add to array to maintain ordering and cross reference with manifest
		items.forEach((item, index) => {

			const props = item.getAttribute("properties") || "";
			const itemref = {
				id: item.getAttribute("id"),
				idref: item.getAttribute("idref"),
				index: index,
				linear: item.getAttribute("linear") || "yes",
				properties: props.length ? props.split(" ") : []
			};
			spine.push(itemref);
		});

		return spine;
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
	 * Find TOC NAV
	 * @param {Node} manifestNode
	 * @return {string}
	 * @private
	 */
	findNavPath(manifestNode) {
		// Find item with property "nav"
		// Should catch nav regardless of order
		const node = qsp(manifestNode, "item", {
			properties: "nav"
		});
		return node ? node.getAttribute("href") : false;
	}

	/**
	 * Find TOC NCX
	 * - `media-type="application/x-dtbncx+xml" href="toc.ncx"`
	 * @param {Node} manifestNode
	 * @param {Node} spineNode
	 * @return {string}
	 * @private
	 */
	findNcxPath(manifestNode, spineNode) {

		let node = qsp(manifestNode, "item", {
			"media-type": "application/x-dtbncx+xml"
		});
		// If we can't find the toc by media-type then try to look for id of the item in the spine attributes as
		// according to http://www.idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.4.1.2,
		// "The item that describes the NCX must be referenced by the spine toc attribute."
		if (!node) {
			const tocId = spineNode.getAttribute("toc");
			if (tocId) {
				node = manifestNode.querySelector(`#${tocId}`);
			}
		}

		return node ? node.getAttribute("href") : false;
	}

	/**
	 * Find the Cover Path
	 * - `<item properties="cover-image" id="ci" href="cover.svg" media-type="image/svg+xml"/>`
	 * 
	 * Fallback for Epub 2.0
	 * @param {Document} packageXml
	 * @return {string} href
	 * @private
	 */
	findCoverPath(packageXml) {

		// Try parsing cover with epub 3.
		const node = qsp(packageXml, "item", { properties: "cover-image" });
		if (node) return node.getAttribute("href");

		// Fallback to epub 2.
		const metaCover = qsp(packageXml, "meta", { name: "cover" });
		if (metaCover) {
			const coverId = metaCover.getAttribute("content");
			const cover = packageXml.getElementById(coverId);
			return cover ? cover.getAttribute("href") : "";
		}
		else {
			return null;
		}
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
	 * Get text of a namespaced element
	 * @param {Node} xml
	 * @param {string} tag
	 * @return {string} text
	 * @private
	 */
	getElementText(xml, tag) {

		const ns = "http://purl.org/dc/elements/1.1/";
		const found = xml.getElementsByTagNameNS(ns, tag);
		if (!found || found.length === 0) return "";

		const el = found[0];
		return el.childNodes.length ? el.childNodes[0].nodeValue : "";
	}

	/**
	 * Get text by property
	 * @param {Node} xml
	 * @param {string} property
	 * @return {string} text
	 * @private
	 */
	getPropertyText(xml, property) {

		const el = qsp(xml, "meta", {
			property: property
		});
		if (el && el.childNodes.length) {
			return el.childNodes[0].nodeValue;
		}
		return "";
	}

	/**
	 * Load JSON Manifest
	 * @param {json} json 
	 * @return {object} parsed package parts
	 */
	load(json) {

		this.metadata = json.metadata;

		const spine = json.readingOrder || json.spine;
		this.spine = spine.map((item, index) => {
			item.index = index;
			item.linear = item.linear || "yes";
			return item;
		});

		json.resources.forEach((item, index) => {
			this.manifest[index] = item;
			if (item.rel && item.rel[0] === "cover") {
				this.coverPath = item.href;
			}
		});

		this.spineNodeIndex = 0;
		this.toc = json.toc.map((item, index) => {
			item.label = item.title;
			return item;
		});

		return {
			metadata: this.metadata,
			spine: this.spine,
			manifest: this.manifest,
			navPath: this.navPath,
			ncxPath: this.ncxPath,
			coverPath: this.coverPath,
			spineNodeIndex: this.spineNodeIndex,
			toc: this.toc
		}
	}

	/**
	 * destroy
	 */
	destroy() {

		this.manifest = undefined;
		this.navPath = undefined;
		this.ncxPath = undefined;
		this.coverPath = undefined;
		this.spineNodeIndex = undefined;
		this.spine = undefined;
		this.metadata = undefined;
		this.version = undefined;
	}
}

export default Packaging;