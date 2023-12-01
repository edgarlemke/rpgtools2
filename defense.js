class Defense {
	static objs = {}

	static get_html () {
		let html = `<div class="items-container">`

		Object.keys(Defense.objs).forEach((key) => {
			//console.log(key)

			let defense_obj = Defense.objs[key]
			//console.log(defense_obj)

			html += defense_obj.get_html()
		})

		html += `</div>`
		return html
	}

	constructor (item_obj) {
		this.name = item_obj.name
		this.item_obj = item_obj
		item_obj.meta_obj = this
		Defense.objs[this.name] = this
	}

	get_html () {
		let buildable_text = this.item_obj.buildable ? "Buildable." : "Not buildable."
		let made_of_html = this.item_obj.get_made_of_html()
		let use_class_html = this.item_obj.use_class == null ? "All" : this.item_obj.use_class.join(', ')

		let html = `<div class="item-container">
<div class="item-name">${this.name}</div>
<div class="item-description">${this.item_obj.description}</div>
<div class="item-buildable">${buildable_text}</div>
<div class="item-weight"><b>Weight:</b> ${this.item_obj.weight}</div>
<div class="item-stacking"><b>Stacking:</b> ${this.item_obj.stacking}</div>
<div class="item-price"><b>Price:</b> ${this.item_obj.price}</div>
<div class="item-price"><b>Use class:</b> ${use_class_html}</div>
<div class="item-made-of">${made_of_html}</div>
</div>
`
		return html
	}
}


new Defense(new Item("Shield", " ", 1, 5, false, null, 1, 0, null, null))
new Defense(new Item("Gloves", " ", 1, 5, false, null, 1, 0, null, null))
new Defense(new Item("Armour", " ", 1, 5, false, null, 1, 0, null, null))
new Defense(new Item("Pants", " ", 1, 5, false, null, 1, 0, null, null))
new Defense(new Item("Elm", " ", 1, 5, false, null, 1, 0, null, null))
new Defense(new Item("Boots", " ", 1, 5, false, null, 1, 0, null, null))
