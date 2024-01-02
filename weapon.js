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

	constructor (item_obj, habilities, damage_type, ammo) {
		//console.log("Weapon constructor: " + name)

		this.name = item_obj.name
		this.item_obj = item_obj
		this.item_obj.meta_obj = this

		this.habilities = habilities
		this.damage_type = damage_type
		this.ammo = ammo

		Weapon.objs[this.name] = this
	}

	get_html () {
		let buildable_text = this.item_obj.buildable ? "Buildable." : "Not buildable."
		let made_of_html = this.item_obj.get_made_of_html()
		let use_class_html = this.item_obj.use_class == null ? "All" : this.item_obj.use_class.join(', ')

		let habilities_html = this.habilities.join(', ')
		let damage_type_html = this.damage_type.join(', ')
		let ammo_html = this.ammo ? this.ammo : "-"

		let html = `<div class="item-container">
<div class="item-name">${this.name}</div>
<div class="item-description">${this.item_obj.description}</div>

<div class="weapon-hability"><b>Habilities:</b> ${habilities_html}</div>
<div class="weapon-damage-type"><b>Damage types:</b> ${damage_type_html}</div>
<div class="weapon-ammo"><b>Ammo:</b> ${ammo_html}</div>
<br/>

<div class="item-buildable">${buildable_text}</div>
<div class="item-weight"><b>Weight:</b> ${this.item_obj.weight}</div>
<div class="item-stacking"><b>Stacking:</b> ${this.item_obj.stacking}</div>
<div class="item-price"><b>Price:</b> ${this.item_obj.price}</div>
<div class="item-use-level"><b>Use level:</b> ${this.item_obj.level}</div>
<div class="item-use-class"><b>Use class:</b> ${use_class_html}</div>
<div class="item-made-of">${made_of_html}</div>
</div>
`
		return html
	}

}


new Weapon(new Item("Bow", " ", null, 1, true, true, {Wood: 4, Material: 2}, null, 1, null, null), ["Dextrity", "Agility"], ["Shooting"], "Arrow")
new Weapon(new Item("Crossbow", " ", null, 1, true, true, {Wood: 2, Material: 3, Metal: 2}, null, 1, null, null), ["Dextrity"], ["Shooting"], "Dart")
new Weapon(new Item("Revolver", " ", null, 1, true, true, {Wood: 1, Material: 2, Metal: 4}, null, 1, null, null), ["Dextrity", "Agility"], ["Shooting"], "Revolver ammo")

// new Weapon(new Item("Pistol", " ", null, 1, true, true, {Wood: 2, Material: 1, Metal: 4}, null, 1, null, null), ["Shooting"], "Pistol ammo")
// new Weapon(new Item("Shotgun", " ", null, 1, true, true, {Wood: 2, Material: 1, Metal: 5}, null, 1, null, null), ["Shooting"], "Shotgun ammo")
// new Weapon(new Item("Rifle", " ", null, 1, true, true, {Wood: 1, Material: 2, Metal: 6}, null, 1, null, null), ["Shooting"], "Rifle ammo")
// new Weapon(new Item("Sniper Rifle", " ", null, 1, true, true, {Wood: 2, Material: 1, Metal: 6}, null, 1, null, null), ["Shooting"], "Sniper rifle ammo")

//new Weapon(new Item("Granade launcher", " ", null, 1, true, true, {Wood: 1, Material: 2, Metal: 7}, null, 1, null, null), ["Explosion"])

// new Weapon(new Item("Survival Knife", " ", null, 1, true, true, {Wood: 0, Material: 1, Metal: 3}, null, 1, null, null), ["Cutting", "Perfuration"])
new Weapon(new Item("Scimitar", " ", null, 1, true, true, {Wood: 1, Material: 1, Metal: 4}, null, 1, null, null), ["Dextrity", "Agility"], ["Cutting"], null)
new Weapon(new Item("Rapier", " ", null, 1, true, true, {Wood: 1, Material: 1, Metal: 4}, null, 1, null, null), ["Dextrity", "Agility"], ["Perfuration"], null)

// new Weapon(new Item("Spear", " ", null, 1, true, true, {Wood: 4, Material: 1, Metal: 2}, null, 1, null, null), ["Cutting", "Perfuration", "Throwing"])
new Weapon(new Item("Light War Axe", " ", null, 1, true, true, {Wood: 2, Material: 1, Metal: 5}, null, 1, null, null), ["Strength", "Dextrity"], ["Impact", "Cutting"], null)

// new Weapon(new Item("Stick", " ", null, 1, true, true, {Wood: 5, Material: 1, Metal: 0}, null, 1, null, null), ["Impact"])
new Weapon(new Item("Light War Hammer", " ", null, 1, true, true, {Wood: 2, Material: 1, Metal: 4}, null, 1, null, null), ["Strength"], ["Impact"], null)
// new Weapon(new Item("Claw", " ", null, 1, true, true, {Wood: 2, Material: 0, Metal: 4}, null, 1, null, null), ["Impact"])

new Weapon(new Item("Wand", " ", null, 1, true, true, {Wood: 4, Material: 1, Metal: 2}, null, 1, null, null), ["Intelligence", "Charisma"], ["Fire", "Air", "Water", "Earth", "Electricity", "Cheese"], null)
// new Weapon(new Item("Staff", " ", null, 1, true, true, {Wood: 1, Material: 2, Metal: 6}, null, 1, null, null), ["Fire", "Air", "Water", "Earth", "Electricity"])

new Weapon(new Item("Grimorium", " ", null, 1, true, true, {Wood: 0, Material: 3, Metal: 3}, null, 1, null, null), ["Intelligence", "Charisma"], ["Invocation"], null)

new Weapon(new Item("Instrument", " ", null, 1, true, true, {Wood: 1, Material: 1, Metal: 4}, null, 1, null, null), ["Charisma"], ["Illusion"], null)

//new Weapon(new Item("Cheesegun", " ", 1, 5, true, true, {Wood: , Material: , Metal: }, null, 1, null, null), ["Cheese"])

new Weapon(new Item("Light Kwink", " ", null, 1, true, true, {Wood: 1, Material: 1, Metal: 4}, null, 1, null, null), ["Dextrity"], [], null)
