class Drug {
	static objs = {}

	static get_html () {
		let html = `<div class="items-container">`

		Object.keys(Drug.objs).forEach((key) => {
			//console.log(key)

			let drugs_obj = Drug.objs[key]
			//console.log(drugs_obj)

			html += drugs_obj.get_html()
		})

		html += `</div>`
		return html
	}

	constructor (item_obj, act) {
		this.name = item_obj.name
		this.item_obj = item_obj
		item_obj.meta_obj = this
		Drug.objs[this.name] = this

		this.act = act
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


//new Drug(new Item("Weed", "A little smokey herb.", 1, 5, false, false, null, 30, 1, null, null))
//new Drug(new Item("Stimulant", "A little smokey herb.", 1, 5, false, false, null, 30, 1, null, null))
//new Drug(new Item("Somniferous", "A little smokey herb.", 1, 5, false, false, null, 30, 1, null, null))
//new Drug(new Item("Hallucinogen", "A little smokey herb.", 1, 5, false, false, null, 30, 1, null, null))
//new Drug(new Item("Healing Pill", "A little smokey herb.", 1, 5, false, false, null, 30, 1, null, null))

new Drug(new Item("Medicine", "Restores 1000 life points, up to base life points.", 1, 5, false, false, null, 30, 1, null, null), (char_obj) => {
	char_obj.health.current = (
		char_obj.health.current + 1000 < char_obj.health.base
			? char_obj.health.current + 1000
			: char_obj.health.base
	)
})

new Drug(new Item("Antidote", "Cures any and all Sedated status.", 1, 5, false, false, null, 30, 1, null, null), (char_obj) => {
	char_obj.status.forEach((status_obj) => {
		if (!['Sedated'].includes(status_obj.name)) {
			return
		}

		if (status_obj.end) {
			status_obj.end()
		}
	})
	char_obj.status.forEach((status_obj) => {
		if (!['Sleeping'].includes(status_obj.name)) {
			return
		}

		delete char_obj.status[ char_obj.status.indexOf(status_obj) ]
	})
})

//new Drug(new Item("Milk", "A little smokey herb.", 1, 5, false, false, null, 1, 1, null, null))
