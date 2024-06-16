import { qs, qsa, querySelectorByType, filterChildren } from "./utils/core";

/**
 * Navigation Parser
 */
class Navigation {
	/**
	 * Constructor
	 * @param {Document} xml navigation html / xhtml / ncx
	 */
	constructor(xml) {

		this.toc = [];
		this.tocByHref = {};
		this.tocById = {};
		this.landmarks = [];
		this.landmarksByType = {};
		this.length = 0;
		if (xml) {
			this.parse(xml);
		}
	}

	/**
	 * Parse out the navigation items
	 * @param {Document} xml navigation html / xhtml / ncx
	 */
	parse(xml) {

		const isXml = xml.nodeType;

		let html;
		let ncx;

		if (isXml) {
			html = qs(xml, "html");
			ncx = qs(xml, "ncx");
		}

		if (!isXml) {
			this.toc = this.load(xml);
		} else if (html) {
			this.toc = this.parseNav(xml);
			this.landmarks = this.parseLandmarks(xml);
		} else if (ncx) {
			this.toc = this.parseNcx(xml);
		}

		this.length = 0;
		this.unpack(this.toc);
	}

	/**
	 * Unpack navigation items
	 * @param {Array} toc
	 * @private
	 */
	unpack(toc) {

		for (let i = 0; i < toc.length; i++) {
			const item = toc[i];

			if (item.href) {
				this.tocByHref[item.href] = i;
			}

			if (item.id) {
				this.tocById[item.id] = i;
			}

			this.length++;

			if (item.subitems.length) {
				this.unpack(item.subitems);
			}
		}
	}

	/**
	 * Get an item from the navigation
	 * @param {string} target
	 * @return {object} navItem
	 */
	get(target) {

		if (!target) {
			return this.toc;
		}

		let index;
		if (target.indexOf("#") === 0) {
			index = this.tocById[target.substring(1)];
		} else if (target in this.tocByHref) {
			index = this.tocByHref[target];
		}

		return this.getByIndex(target, index, this.toc);
	}

	/**
	 * Get an item from navigation subitems recursively by index
	 * @param {string} target
	 * @param {number} index
	 * @param {Array} navItems
	 * @return {object} navItem
	 */
	getByIndex(target, index, navItems) {

		if (navItems.length === 0) {
			return;
		}

		const item = navItems[index];
		if (item && (target === item.id || target === item.href)) {
			return item;
		} else {
			let result;
			for (let i = 0; i < navItems.length; ++i) {
				result = this.getByIndex(target, index, navItems[i].subitems);
				if (result) {
					break;
				}
			}
			return result;
		}
	}

	/**
	 * Get a landmark by type
	 * @link https://idpf.github.io/epub-vocabs/structure/
	 * @param {string} type
	 * @return {object} landmarkItem
	 */
	landmark(type) {

		if (!type) {
			return this.landmarks;
		}

		const index = this.landmarksByType[type];
		return this.landmarks[index];
	}

	/**
	 * Parse toc from a Epub > 3.0 Nav
	 * @param {Document} navHtml
	 * @return {Array} navigation list
	 * @private
	 */
	parseNav(navHtml) {

		const navElement = querySelectorByType(navHtml, "nav", "toc");
		const list = [];

		if (!navElement) return list;

		const navList = filterChildren(navElement, "ol", true);
		if (!navList) return list;

		return this.parseNavList(navList);
	}

	/**
	 * Parses lists in the toc
	 * @param {Document} navListHtml
	 * @param {string} parent id
	 * @return {Array} navigation list
	 */
	parseNavList(navListHtml, parent) {

		const result = [];

		if (!navListHtml) return result;
		if (!navListHtml.children) return result;

		const len = navListHtml.children.length;

		for (let i = 0; i < len; i++) {
			const child = navListHtml.children[i];
			const item = this.navItem(child, parent);

			if (item) {
				result.push(item);
			}
		}

		return result;
	}

	/**
	 * Create a navItem
	 * @param {Element} item
	 * @return {object} navItem
	 * @private
	 */
	navItem(item, parent) {

		const content = filterChildren(item, "a", true) ||
						filterChildren(item, "span", true);

		if (!content) {
			return;
		}

		let src = content.getAttribute("href") || "";
		let id = item.getAttribute("id") || undefined;
		if (!id) id = src;

		let subitems;
		let nested = filterChildren(item, "ol", true);
		if (nested) {
			subitems = this.parseNavList(nested, id);
		}

		return {
			id: id,
			href: src,
			label: content.textContent || "",
			subitems: subitems || [],
			parent: parent
		};
	}

	/**
	 * Parse landmarks from a Epub > 3.0 Nav
	 * @param {Document} navHtml
	 * @return {Array} landmarks list
	 * @private
	 */
	parseLandmarks(navHtml) {

		const navElement = querySelectorByType(navHtml, "nav", "landmarks");
		const navItems = navElement ? qsa(navElement, "li") : [];
		const length = navItems.length;
		const list = [];

		if (!navItems || length === 0) return list;

		for (let i = 0; i < length; ++i) {
			const item = this.landmarkItem(navItems[i]);
			if (item) {
				list.push(item);
				this.landmarksByType[item.type] = i;
			}
		}

		return list;
	}

	/**
	 * Create a landmarkItem
	 * @param {Element} item
	 * @return {object|null} landmarkItem
	 * @private
	 */
	landmarkItem(item) {

		const content = filterChildren(item, "a", true);

		if (!content) return null;

		const type = content.getAttributeNS("http://www.idpf.org/2007/ops", "type") || undefined;
		const href = content.getAttribute("href") || "";
		const text = content.textContent || "";

		return {
			href: href,
			label: text,
			type: type
		};
	}

	/**
	 * Parse from a Epub > 3.0 NC
	 * @param {Document} navHtml
	 * @return {Array} navigation list
	 * @private
	 */
	parseNcx(tocXml) {

		const navPoints = qsa(tocXml, "navPoint");
		const length = navPoints.length;
		const toc = {};
		const list = [];

		if (!navPoints || length === 0) return list;

		for (let i = 0; i < length; ++i) {
			const item = this.ncxItem(navPoints[i]);
			toc[item.id] = item;
			if (!item.parent) {
				list.push(item);
			} else {
				const parent = toc[item.parent];
				parent.subitems.push(item);
			}
		}

		return list;
	}

	/**
	 * Create a ncxItem
	 * @param  {Element} item
	 * @return {object} ncxItem
	 * @private
	 */
	ncxItem(item) {

		const content = qs(item, "content");
		const navLabel = qs(item, "navLabel");
		const text = navLabel.textContent ? navLabel.textContent : "";
		const pn = item.parentNode;

		let parent;
		if (pn && (pn.nodeName === "navPoint" ||
			pn.nodeName.split(":").slice(-1)[0] === "navPoint")) {
			parent = pn.getAttribute("id");
		}

		return {
			id: item.getAttribute("id") || false,
			href: content.getAttribute("src"),
			label: text,
			subitems: [],
			parent: parent
		};
	}

	/**
	 * Load Spine Items
	 * @param  {object} json the items to be loaded
	 * @return {Array} navItems
	 */
	load(json) {

		return json.map((item) => {
			item.label = item.title;
			item.subitems = item.children
				? this.load(item.children) : [];
			return item;
		});
	}

	/**
	 * forEach pass through
	 * @param {Function} fn function to run on each item
	 * @return {method} forEach loop
	 */
	forEach(fn) {

		return this.toc.forEach(fn);
	}
}

export default Navigation;