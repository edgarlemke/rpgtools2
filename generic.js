class Generic {
	static objs = {}

	static get_html () {
		let html = `<div class="items-container">`

		Object.keys(Generic.objs).forEach((key) => {
			//console.log(key)

			let generic_obj = Generic.objs[key]
			//console.log(generic_obj)

			html += generic_obj.get_html()
		})

		html += `</div>`
		return html
	}

	constructor (item_obj) {
		this.name = item_obj.name
		Generic.objs[this.name] = this

		this.item_obj = item_obj
		item_obj.meta_obj = this
	}

	get_html () {
		let buildable_text = this.item_obj.buildable ? "Buildable." : "Not buildable."
		let equippable_text = this.item_obj.equippable ? "Equippable." : "Not equippable."
		let made_of_html = this.item_obj.get_made_of_html()
		let use_class_html = this.item_obj.use_class == null ? "All" : this.item_obj.use_class.join(', ')

		let html = `<div class="item-container">
<div class="item-name">${this.name}</div>
<div class="item-description">${this.item_obj.description}</div>
<div class="item-buildable">${buildable_text}</div>
<div class="item-equippable">${equippable_text}</div>
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


new Generic(new Item("Material", "Piece of material.", 1, 5, false, false, null, 1, 0, null, null))
new Generic(new Item("Wood", "Piece of wood.", 1, 3, false, false, null, 2, 0, null, null))
new Generic(new Item("Metal", "Piece of metal.", 1, 3, false, false, null, 3, 0, null, null))
new Generic(new Item("Electronic part", "Some electronic part.", 1, 5, false, false, null, 4, 0, null, null))

new Generic(new Item("Lantern", "Shines light.", null, 1, false, true, {"Material" : 5}, null, 0, null, null))
new Generic(new Item("Rope", "Useful to tie stuff.", null, 1, false, true, {"Material" : 5}, null, 0, null, null))
new Generic(new Item("Furnace", "Useful for Engineers who want to forge things.", null, 1, false, true, {"Material" : 5, "Metal" : 5}, null, 0, ["Engineer"], null))
new Generic(new Item("Powder", "Useful for making ammo.", 1, 1, false, false, null, 2, 0, null, null))
new Generic(new Item("Cartridge case", "Useful for making ammo.", 1, 1, false, false, null, 2, 0, null, null))
new Generic(new Item("Bullet", "Useful for making ammo.", 1, 1, false, false, null, 2, 0, null, null))
new Generic(new Item("Fuel bottle", "A plastic bottle filled with highly flammable fuel.", 1, 1, false, false, null, 2, 0, null, null))
new Generic(new Item("Glassware", "Useful for Alchemists to make alchemical reactions.", 1, 1, false, false, null, 2, 0, null, null))

new Generic(new Item("Strength ring", "A ring that adds 1 strength point.", 1, 10, true, false, null, 33, 0, null, null)) 
new Generic(new Item("Dextrity ring", "A ring that adds 1 dextrity point.", 1, 10, true, false, null, 33, 0, null, null)) 
new Generic(new Item("Agility ring", "A ring that adds 1 agility point.", 1, 10, true, false, null, 33, 0, null, null)) 
new Generic(new Item("Intelligence ring", "A ring that adds 1 intelligence point.", 1, 10, true, false, null, 33, 0, null, null)) 
new Generic(new Item("Charisma ring", "A ring that adds 1 charisma point.", 1, 10, true, false, null, 33, 0, null, null)) 
