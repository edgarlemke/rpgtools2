class Item {
	static objs = {}

	static get_html () {
		//console.log("Item.get_html()")
		//console.log(Object.keys(Item.objs))

/*
		let html = `<div class="items-container">
`

		Object.keys(Item.objs).forEach((key) => {
			console.log(key)

			let item_obj = Item.objs[key]
			console.log(item_obj)

			html += item_obj.get_html()
		})

		html += `</div>`
		console.log(html)
*/
		let html = "<h2>Weapons</h2>"
		html += Weapon.get_html()

		html += "<h2>Defenses</h2>"
		html += Defense.get_html()

		html += "<h2>Ammos</h2>"
		html += Ammo.get_html()

		html += "<h2>Generics</h2>"
		html += Generic.get_html()

		html += "<h2>Drugs</h2>"
		html += Drug.get_html()

		return html
	}

	constructor (name, description, weight, stacking, equippable, buildable, made_of, price, level, use_class, build_class /*, equip_slot*/) {
		// console.log("Item constructor: " + name)

		Item.objs[name] = this
		this.name = name
		this.description = description
		this.weight = weight
		this.stacking = stacking
		this.equippable = equippable
		this.buildable = buildable
		this.made_of = made_of
		this.price = price
		this.level = level
		this.use_class = use_class
		this.build_class = build_class
		//this.equip_slot = equip_slot
		this.meta_obj = null

		// if weight is null, calculate it from made_of
		if (this.weight == null) {
			if (typeof this.made_of != "object") {
				throw "Item: weight is null but made_of isn't object: " + name
			}

			this.weight = 0
			Object.keys(this.made_of).forEach((key) => {
				// console.log(key)

				let quantity = this.made_of[key]
				let item_obj = Item.objs[key]
				for (let i = 0; i < quantity; i++) {
					this.weight += item_obj.weight
				}
			})
		}

		if (this.price == null) {
			if (typeof this.made_of != "object") {
				throw "Item: price is null but made_of isn't object: " + name
			}

			this.price = 0
			Object.keys(this.made_of).forEach((key) => {
				let quantity = this.made_of[key]
				let item_obj = Item.objs[key]
				for (let i = 0; i < quantity; i++) {
					this.price += item_obj.price
				}
			})

			this.price *= 2
		}

	}

	get_html () {
		let html = `<div class="item-container">
<div class="item-name">${this.name}</div>
<div class="item-description">${this.description}</div>
</div>
`
		return html
	}

	get_made_of_html () {
		let many = this.made_of != null

		let html = `<table>
	<thead>
		<tr><th ${many ? 'colspan="2"' : ''}>Made of</th></tr>
		${many ? '<tr><th>Item</th><th>Quantity</th></tr>' : ''}
	</thead>
	<tbody>`

		if (this.made_of == null) {
			html += `<tr><td>-</td><tr>`
		}
		else {
			Object.keys(this.made_of).forEach( (key) => {
				html += `<tr><td>${key}</td><td>${this.made_of[key]}</td></tr>`
			})
		}

		html += `	
	</tbody>
</table>
`
		return html
	}
}


//new Content("items", Item.get_html())
