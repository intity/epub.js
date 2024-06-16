/**
 * createDefiner
 * @returns {Element}
 */
export const createDefiner = () => {

	const definer = document.createElement("div");
	definer.dir = "rtl";

	definer.style.position = "fixed";
	definer.style.width = "1px";
	definer.style.height = "1px";
	definer.style.top = "0px";
	definer.style.left = "0px";
	definer.style.overflow = "hidden";

	const innerDiv = document.createElement("div");
	innerDiv.style.width = "2px";

	const spanA = document.createElement("span");
	spanA.style.width = "1px";
	spanA.style.display = "inline-block";

	const spanB = document.createElement("span");
	spanB.style.width = "1px";
	spanB.style.display = "inline-block";

	innerDiv.appendChild(spanA);
	innerDiv.appendChild(spanB);
	definer.appendChild(innerDiv);

	return definer;
}

/**
 * Detect RTL scroll type
 * @link https://github.com/othree/jquery.rtl-scroll-type/blob/master/src/jquery.rtl-scroll.js
 * @returns {string} scroll type
 */
const scrollType = () => {

	let type = "reverse";
	const definer = createDefiner();
	document.body.appendChild(definer);

	if (definer.scrollLeft > 0) {
		type = "default";
	} else {
		if (typeof Element !== "undefined" &&
			Element.prototype.scrollIntoView) {
			definer.children[0].children[1].scrollIntoView();
			if (definer.scrollLeft < 0) {
				type = "negative";
			}
		} else {
			definer.scrollLeft = 1;
			if (definer.scrollLeft === 0) {
				type = "negative";
			}
		}
	}

	document.body.removeChild(definer);
	return type;
}

export default scrollType;