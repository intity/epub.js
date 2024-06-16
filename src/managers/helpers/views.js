/**
 * Views
 */
class Views extends Array {
	/**
	 * Constructor
	 * @param {Element} container 
	 */
	constructor(container) {

		super();
		this.container = container;
		this.hidden = false;
	}

	first() {

		return this[0];
	}

	last() {

		return this[this.length - 1];
	}

	get(i) {

		return this[i];
	}

	append(view) {

		if (this.container) {
			this.container.appendChild(view.element);
		}
		this.push(view);
		return view;
	}

	prepend(view) {

		if (this.container) {
			this.container.insertBefore(view.element, this.container.firstChild);
		}
		this.unshift(view);
		return view;
	}

	insert(view, index) {

		if (this.container) {
			if (index < this.container.children.length) {
				this.container.insertBefore(view.element, this.container.children[index]);
			} else {
				this.container.appendChild(view.element);
			}
		}
		this.splice(index, 0, view);
		return view;
	}

	remove(view) {

		const index = this.indexOf(view);
		if (index > -1) {
			this.splice(index, 1);
		}
		this.destroy(view);
	}

	destroy(view) {

		if (view.displayed) {
			view.destroy();
		}

		if (this.container) {
			this.container.removeChild(view.element);
		}
	}

	clear() {

		if (this.length === 0) return;

		for (let i = 0; i < this.length; i++) {
			const view = this[i];
			this.destroy(view);
		}
		this.splice(0);
	}

	find(section) {

		for (let i = 0; i < this.length; i++) {
			const view = this[i];
			if (view.displayed && 
				view.section.index == section.index) {
				return view;
			}
		}
	}

	displayed() {

		const displayed = [];
		for (let i = 0; i < this.length; i++) {
			const view = this[i];
			if (view.displayed) {
				displayed.push(view);
			}
		}
		return displayed;
	}

	show() {

		for (let i = 0; i < this.length; i++) {
			const view = this[i];
			if (view.displayed) {
				view.show();
			}
		}
		this.hidden = false;
	}

	hide() {

		for (let i = 0; i < this.length; i++) {
			const view = this[i];
			if (view.displayed) {
				view.hide();
			}
		}
		this.hidden = true;
	}
}

export default Views;