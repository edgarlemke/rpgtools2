class Weapon {
	static objs = {}

	static get_html () {
		//console.log("Weapon.get_html()")

		let html = `<div class="items-container">`

		Object.keys(Weapon.objs).forEach((key) => {
			//console.log(key)

			let weapon_obj = Weapon.objs[key]
			//console.log(weapon_obj)

			html += weapon_obj.get_html()
		})

		html += `</div>`
		return html
	}

	constructor (item_obj, damage_type, ammo) {
		//console.log("Weapon constructor: " + name)

		this.name = item_obj.name
		this.item_obj = item_obj
		this.item_obj.meta_obj = this

		this.damage_type = damage_type
		this.ammo = ammo

		Weapon.objs[this.name] = this
	}

	get_html () {
		let buildable_text = this.item_obj.buildable ? "Buildable." : "Not buildable."
		let made_of_html = this.item_obj.get_made_of_html()
		let use_class_html = this.item_obj.use_class == null ? "All" : this.item_obj.use_class.join(', ')

		let damage_type_html = this.damage_type.join(', ')
		let ammo_html = this.ammo ? this.ammo : "-"

		let html = `<div class="item-container">
<div class="item-name">${this.name}</div>
<div class="item-description">${this.item_obj.description}</div>

<div class="weapon-damage-type"><b>Damage types:</b> ${damage_type_html}</div>
<div class="weapon-ammo"><b>Ammo:</b> ${ammo_html}</div>
<br/>

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


new Weapon(new Item("Bow", " ", 1, 5, true, null, 1, 0, null, null), ["Shooting"], "Arrow")
new Weapon(new Item("Crossbow", " ", 1, 5, true, null, 1, 0, null, null), ["Shooting"], "Dart")
new Weapon(new Item("Pistol", " ", 1, 5, true, null, 1, 0, null, null), ["Shooting"], "Pistol ammo")
new Weapon(new Item("Revolver", " ", 1, 5, true, null, 1, 0, null, null), ["Shooting"], "Revolver ammo")
new Weapon(new Item("Shotgun", " ", 1, 5, true, null, 1, 0, null, null), ["Shooting"], "Shotgun ammo")
new Weapon(new Item("Rifle", " ", 1, 5, true, null, 1, 0, null, null), ["Shooting"], "Rifle ammo")
new Weapon(new Item("Sniper rifle", " ", 1, 5, true, null, 1, 0, null, null), ["Shooting"], "Sniper rifle ammo")

new Weapon(new Item("Granade launcher", " ", 1, 5, true, null, 1, 0, null, null), ["Explosion"])

new Weapon(new Item("Knife", " ", 1, 5, true, null, 1, 0, null, null), ["Cutting", "Perfuration"])
new Weapon(new Item("Sword", " ", 1, 5, true, null, 1, 0, null, null), ["Cutting", "Perfuration"])
new Weapon(new Item("Spear", " ", 1, 5, true, null, 1, 0, null, null), ["Perfuration", "Throwing"])
new Weapon(new Item("Axe", " ", 1, 5, true, null, 1, 0, null, null), ["Impact", "Perfuration"])

new Weapon(new Item("Hammer", " ", 1, 5, true, null, 1, 0, null, null), ["Impact"])
new Weapon(new Item("Stick", " ", 1, 5, true, null, 1, 0, null, null), ["Impact"])
new Weapon(new Item("Claw", " ", 1, 5, true, null, 1, 0, null, null), ["Impact"])

new Weapon(new Item("Wand", " ", 1, 5, true, null, 1, 0, null, null), ["Fire", "Air", "Water", "Earth"])
new Weapon(new Item("Staff", " ", 1, 5, true, null, 1, 0, null, null), ["Fire", "Air", "Water", "Earth"])

new Weapon(new Item("Grimorium", " ", 1, 5, true, null, 1, 0, null, null), ["Darkness"])

new Weapon(new Item("Instrument", " ", 1, 5, true, null, 1, 0, null, null), ["Illusion"])

new Weapon(new Item("Cheesegun", " ", 1, 5, true, null, 1, 0, null, null), ["Cheese"])
