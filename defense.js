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

	constructor (item_obj, defense_points, damage_types) {
		this.name = item_obj.name
		this.item_obj = item_obj
		item_obj.meta_obj = this
		Defense.objs[this.name] = this

		this.defense_points = defense_points
		this.damage_types = damage_types
	}

	get_html () {
		let buildable_text = this.item_obj.buildable ? "Buildable." : "Not buildable."
		let made_of_html = this.item_obj.get_made_of_html()
		let use_class_html = this.item_obj.use_class == null ? "All" : this.item_obj.use_class.join(', ')

		let damage_types_html = this.damage_types.join(', ')

		let html = `<div class="item-container">
<div class="item-name">${this.name}</div>
<div class="item-description">${this.item_obj.description}</div>

<div class="weapon-defense-points"><b>Defense points:</b> ${this.defense_points}</div>
<div class="weapon-damage-types"><b>Damage types:</b> ${damage_types_html}</div>

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


new Defense(new Item("Shield", " ", null, 1, true, true, {Wood: 1, Material: 1, Metal: 0}, null, 0, null, null), 1, ["Perfuration", "Cutting", "Shooting", "Explosion", "Impact", "Acid", "Throwing"])
new Defense(new Item("Gloves", " ", null, 1, true, true, {Wood: 0, Material: 2, Metal: 0}, null, 0, null, null), 1, ["Perfuration", "Cutting", "Shooting", "Explosion", "Impact", "Acid", "Throwing"])
new Defense(new Item("Armour", " ", null, 1, true, true, {Wood: 0, Material: 2, Metal: 0}, null, 0, null, null), 2, ["Perfuration", "Cutting", "Shooting", "Explosion", "Impact", "Acid", "Throwing"])
new Defense(new Item("Elm", " ", null, 1, true, true, {Wood: 1, Material: 1, Metal: 0}, null, 0, null, null), 1, ["Perfuration", "Cutting", "Shooting", "Explosion", "Impact", "Acid", "Throwing"])
new Defense(new Item("Boots", " ", null, 1, true, true, {Wood: 0, Material: 2, Metal: 0}, null, 0, null, null), 1, ["Perfuration", "Cutting", "Shooting", "Explosion", "Impact", "Acid", "Throwing"])

new Defense(new Item("Elemental Talisman", "", null, 1, true, true, {Wood: 2, Material: 2, Metal: 2}, null, 0, null, null), 6, ["Air", "Water", "Fire", "Earth", "Cheese", "Electricity", "Psychic", "Invocation"])
