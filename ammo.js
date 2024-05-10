class Ammo {
	static objs = {}

	static get_html () {
		let html = `<div class="items-container">`

		Object.keys(Ammo.objs).forEach((key) => {
			//console.log(key)

			let ammo_obj = Ammo.objs[key]
			//console.log(ammo_obj)

			html += ammo_obj.get_html()
		})

		html += `</div>`
		return html
	}

	constructor (item_obj) {
		this.name = item_obj.name
		this.item_obj = item_obj
		item_obj.meta_obj = this
		Ammo.objs[this.name] = this
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


new Ammo(new Item("Arrow", "Ammo for bows", 1, 10, false, true, {Wood: 1}, null, 1, null, null))
new Ammo(new Item("Dart", "Ammo for crossbows", 1, 10, false, true, {Wood: 1, Material: 1}, null, 1, null, null))
//new Ammo(new Item("Pistol ammo", "Ammo for pistols", 1, 10, false, true, {Powder: 1, 'Cartridge case': 1, Bullet: 1}, null, 1, null, null))
new Ammo(new Item("Revolver ammo", "Ammo for revolvers", 1, 10, false, true, {Powder: 1, 'Cartridge case': 1, Bullet: 1}, null, 1, null, null))
// new Ammo(new Item("Shotgun ammo", "Ammo for shotguns", 1, 5, false, true, {Powder: 1, 'Cartridge case': 1, Bullet: 1}, null, 1, null, null))
// new Ammo(new Item("Rifle ammo", "Ammo for rifles", 1, 5, false, true, {Powder: 1, 'Cartridge case': 1, Bullet: 1}, null, 1, null, null))
// new Ammo(new Item("Sniper rifle ammo", "Ammor for sniper rifles", 1, 5, false, true, {Powder: 1, 'Cartridge case': 1, Bullet: 1}, null, 1, null, null))
