class Inventory {

	static objs = {}

	static drops = []

	constructor (char_obj) {
		this.char_obj = char_obj
		Inventory.objs[char_obj.name] = this

		this.items = []
		this.coins = 0
		this.equipped = []
	}

	get_stats () {
		const stats = new Stats(0, 0, 0, 0, 0)

		this.equipped.forEach((item_index) => {
			const item_name = this.items[item_index]

			switch (item_name) {
				case 'Strength ring':
					stats.strength += 1
					break

				case 'Agility ring':
					stats.agility += 1
					break

				case 'Dextrity ring':
					stats.dextrity += 1
					break

				case 'Intelligence ring':
					stats.intelligence += 1
					break

				case 'Charisma ring':
					stats.charisma += 1
					break
			}
		})

		return stats
	}

	get_capacity () {
		const strength = this.char_obj.stats_objs.current.strength
		return 100 + strength
	}

	get_free_capacity () {
		const capacity = this.get_capacity()

		const counter = {}
		this.items.forEach((item_name) => {
			const item_obj = Item.objs[item_name]

			if (!Object.keys(counter).includes(item_obj.name)) {
				counter[item_name] = 1
				return
			}

			counter[item_name] += 1
		})

		let used_capacity = 0
		Object.keys(counter).forEach((item_name) => {
			const item_obj = Item.objs[item_name]
			const item_used_capacity = Math.ceil(counter[item_name] / item_obj.stacking)
			used_capacity += item_used_capacity
		})

		return capacity - used_capacity
	}

	can_hold_item (hold_item_name) {
		const hold_item_obj = Item.objs[hold_item_name]

		//
		const capacity = this.get_capacity()

		const counter = {}
		this.items.forEach((item_name) => {
			const item_obj = Item.objs[item_name]

			if (!Object.keys(counter).includes(item_obj.name)) {
				counter[item_name] = 1
				return
			}

			counter[item_name] += 1
		})

		let used_capacity = 0
		let has_free_stacking = false

		Object.keys(counter).forEach((item_name) => {
			const item_obj = Item.objs[item_name]
			const item_used_capacity = Math.ceil(counter[item_name] / item_obj.stacking)

			if (hold_item_name == item_obj.name && counter[hold_item_name] < item_obj.stacking) {
				has_free_stacking = true
			} 

			used_capacity += item_used_capacity
		})

		//
		const has_free_weight = hold_item_obj.weight <= (capacity - used_capacity)
		const can_hold = has_free_stacking || has_free_weight

		return can_hold
	}
}

class InventoryView {

	static selected_char = null

	static get_html () {
		const html = `
<div class="inventory-container">
	<div>
		Char:
		<select id="inventory-char-selector" onchange="InventoryView.select_char()"></select>
	</div>
	
	<div>
		<h2>Inventory</h2>
		<div>Capacity: <div id="inventory-capacity"></div></div>
		<div>Free capacity: <div id="inventory-free-capacity"></div></div>
		<div>Coins: <input type="number" id="inventory-coins" min="0" value="0" onchange="InventoryView.update_coins()"></div>
		<table id="inventory-items">
			<thead>
				<tr>
					<th>Item</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
	
	<div>
		Shopping
		<select id="inventory-shop-item-selector"></select>
		<button onclick="InventoryView.buy()">Buy</button>
		<button onclick="InventoryView.random()">Random</button>
	</div>
	
	<div>
		<h2>Drops</h2>
	
		<table id="inventory-drops">
			<thead>
				<tr>
					<th>Item</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	
		<div>
			<select id="inventory-airdrop-selector"></select>
			<button onclick="InventoryView.airdrop()">Airdrop</button>
		</div>
	
		<div>
			<button onclick="InventoryView.flush_drops()">Flush</button>
		</div>
	</div>
</div>
`

		return html
	}

	static select_char () {
		const char_name = InventoryView.char_selector.selectedOptions[0].innerText
		const char_obj = Char.objs[char_name]

		const tbody = InventoryView.items.tBodies[0]
		remove_children(tbody)

		const inventory_obj = char_obj.inventory_obj
		let item_index = 0

		inventory_obj.items.forEach((item_name) => {
			const equippable = Item.objs[item_name].equippable
			const tr = document.createElement('tr')
			tr.setAttribute('data-item-name', item_name)
			tr.setAttribute('data-item-index', item_index)
			tr.innerHTML = `<td>${item_name}</td>
<td>
	${equippable ? '<button onclick="InventoryView.toggle_equip(this)">Equip</button>' : ''}
	<button onclick="InventoryView.drop(this)">Drop</button>
	<button onclick="InventoryView.sell(this)">Sell</button>
</td>`
			tbody.appendChild(tr)

			item_index += 1
		})

		InventoryView.capacity.innerText = inventory_obj.get_capacity()
		InventoryView.free_capacity.innerText = inventory_obj.get_free_capacity()
		InventoryView.coins.value = inventory_obj.coins

		InventoryView.selected_char = char_name
	}

	static update_coins () {
		const char_name = InventoryView.selected_char
		const char_obj = Char.objs[char_name]
		const inventory_obj = char_obj.inventory_obj

		inventory_obj.coins = Number(InventoryView.coins.value)
	}

	static toggle_equip (button) {
		const item_name = button.parentElement.parentElement.getAttribute('data-item-name')
		const item_index = Number(button.parentElement.parentElement.getAttribute('data-item-index'))

		const char_name = InventoryView.selected_char
		const char_obj = Char.objs[char_name]
		const inventory_obj = char_obj.inventory_obj

		if (button.innerText == 'Equip') {
			button.innerText = 'Unequip'
			inventory_obj.equipped.push(item_index)
		}
		else {
			button.innerText = 'Equip'
			inventory_obj.equipped.splice(inventory_obj.equipped.indexOf(item_index, 1))
		}

		//console.log(inventory_obj.equipped)
	}

	static drop (button) {
		const char_name = InventoryView.selected_char
		const char_obj = Char.objs[char_name]
		const inventory_obj = char_obj.inventory_obj

		const item_index = Number(button.parentElement.parentElement.getAttribute('data-item-index'))
		inventory_obj.equipped.splice(inventory_obj.equipped.indexOf(item_index, 1))
		Inventory.drops.push(inventory_obj.items[item_index])
		inventory_obj.items.splice(item_index, 1)

		InventoryView.select_char()
		InventoryView.show_drops()
	}

	static _buy (char_name, item_name) {
		// console.log('_buy ' + item_name)

		const char_obj = Char.objs[char_name]
		const inventory_obj = char_obj.inventory_obj
		const item_obj = Item.objs[item_name]

		//console.log('item_name', item_name)

		const char_has_money = inventory_obj.coins >= item_obj.price 
		// console.log('char doesnt have money: ' + !char_has_money + ' - char cant hold item: ' + !inventory_obj.can_hold_item(item_name))

		if (!char_has_money || !inventory_obj.can_hold_item(item_name)) {
			return false
		}

		inventory_obj.items.push(item_obj.name)
		inventory_obj.coins -= item_obj.price

		return true
	}

	static buy () {
		const char_name = InventoryView.selected_char
		//const char_obj = Char.objs[char_name]
		//const inventory_obj = char_obj.inventory_obj

		const item_name = InventoryView.shop_item_selector.selectedOptions[0].innerText
		//const item_obj = Item.objs[item_name]

		//if (inventory_obj.coins < item_obj.price) {
		//	new Modal('Insufficient money', `Char ${char_name} doesn't have sufficient money to buy ${item_obj.name}!<br>${char_name} has ${inventory_obj.coins} coins but ${item_obj.name} costs ${item_obj.price} coins.`)
		//	return
		//}

		//inventory_obj.items.push(item_obj.name)
		//inventory_obj.coins -= item_obj.price

		const bought = InventoryView._buy(char_name, item_name)
		if (!bought) {
			//new Modal('Insufficient money', `Char ${char_name} doesn't have sufficient money to buy ${item_obj.name}!<br>${char_name} has ${inventory_obj.coins} coins but ${item_obj.name} costs ${item_obj.price} coins.`)
			new Modal('Insufficient money', 'Insufficient money to buy this item.')
			return
		}

		InventoryView.select_char()
	}

	static sell (button) {
		const item_name = InventoryView.shop_item_selector.selectedOptions[0].innerText
		const item_obj = Item.objs[item_name]

		const item_index = button.parentElement.parentElement.getAttribute('data-item-id')

		const char_name = InventoryView.selected_char
		const char_obj = Char.objs[char_name]
		const inventory_obj = char_obj.inventory_obj

		inventory_obj.items.splice(item_index, 1)
		inventory_obj.coins += item_obj.price

		InventoryView.select_char()
	}

	static show_drops () {
		const tbody = InventoryView.drops.tBodies[0]
		remove_children(tbody)

		let item_index = 0
		Inventory.drops.forEach((item_name) => {
			const tr = document.createElement('tr')
			tr.setAttribute('data-item-name', item_name)
			tr.setAttribute('data-item-index', item_index)
			tr.innerHTML = `<td>${item_name}</td>
<td>
	<button onclick="InventoryView.grab_item(this)">Grab</button>
	<button onclick="InventoryView.destroy_item(this)">Destroy</button>
</td>`
			tbody.appendChild(tr)

			item_index += 1
		})
	}

	static airdrop () {
		const item_name = InventoryView.airdrop_selector.selectedOptions[0].innerText
		Inventory.drops.push(item_name)
		InventoryView.show_drops()
	}

	static flush_drops () {
		Inventory.drops = []
		InventoryView.show_drops()
	}

	static grab_item (button) {
		const item_name = button.parentElement.parentElement.getAttribute('data-item-name')
		const item_index = button.parentElement.parentElement.getAttribute('data-item-index')
		const inventory_obj = Char.objs[InventoryView.selected_char].inventory_obj.items.push(item_name)
		Inventory.drops.splice(item_index, 1)	
		InventoryView.show_drops()
		InventoryView.select_char()
	}

	static destroy_item (button) {
		const item_index = button.parentElement.parentElement.getAttribute('data-item-index')
		Inventory.drops.splice(item_index, 1)	
		InventoryView.show_drops()
	}

	static random () {
		const weapon_hints = {
			'Fighter' : ['Light War Axe', 'Light War Hammer'],
			'Swordsman' : ['Scimitar', 'Rapier'],
			'Shooter' : ['Crossbow', 'Revolver'],
			'Engineer' : ['Light Kwink'],
			'Witch' : ['Wand', 'Grimorium'],
			'Alchemist' : ['Wand'],
			//'Mentalist': ['Instrument', 'Wand'],
			'Chimera' : ['Wand'],
			'Demonologist' : ['Wand', 'Grimorium'],
			'Messiah' : ['Wand', 'Grimorium', 'Sinister Deck'],
			//'Slime' : ['Wand'], // can use any weapon according to habilities
			'Circus Artist' : ['Instrument', 'Sinister Deck'],

			'Ghoul' : ['Ghoul Strength Damage Kit', 'Ghoul Agility Damage Kit'],
			'Elemental' : ['Wand'],
			//'Undead' : ['Wand', 'Grimorium']
		}

		const char_name = InventoryView.char_selector.selectedOptions[0].innerText
		const char_obj = Char.objs[char_name]
		const highest_stats = char_obj.get_highest_stats()

		//console.log('char_obj', char_obj)

		const buy_ammo = function (item_name) {
			const max_spending = 20 + (dice(3) * 10)
			const ammo_obj = Item.objs[item_name]
			let spent = 0

			// even if char doesn't have enough coins it's going to try to buy ammo as long as below max_spending
			while ((spent + ammo_obj.price) < max_spending) {
				InventoryView._buy(char_name, item_name)
				spent += ammo_obj.price
			}
		}

		// buy primary weapon
		const race_obj = Race.objs[char_obj.race]
		const hints = race_obj.has_class ? weapon_hints[char_obj.class] : weapon_hints[char_obj.race]


		if (hints.length > 0) {

			//console.log('hints', hints)
	
			let hints_filtered_level = hints.filter((item_name) => {
				const item_obj = Item.objs[item_name]
				const habilities = item_obj.meta_obj.habilities
				//console.log('item habilities')
				//console.log(habilities)
	
				return !(item_obj.level > char_obj.level) 
			})
	
			//console.log('hints_filtered_level', hints_filtered_level)
	
			let hints_filtered = hints_filtered_level.filter((item_name) => {
				const item_obj = Item.objs[item_name]
				const habilities = item_obj.meta_obj.habilities
	
				let matches = false
				highest_stats.forEach((hability) => {
					const tuc_hability = hability[0].toUpperCase() + hability.slice(1)
					//console.log('tuc_hability: ' + tuc_hability)
	
					if (habilities.includes(tuc_hability)) {
						matches = true
					}
				})
	
				return matches
			})
			hints_filtered = hints_filtered.length > 0 ? hints_filtered : hints_filtered_level
	
			//console.log('hints_filtered', hints_filtered)
	
			const primary_weapon = hints_filtered[ dice(hints_filtered.length) - 1 ]
			const bought_primary_weapon = InventoryView._buy(char_name, primary_weapon)
	
			// buy ammo for primary weapon if needed
			if (bought_primary_weapon) {
				const primary_weapon_obj = Item.objs[primary_weapon]
				const primary_weapon_ammo = primary_weapon_obj.meta_obj.ammo
				if (primary_weapon_ammo) {
					buy_ammo(primary_weapon_ammo)
				}
			}
		}

		// sort out some secondary weapon
		const secondary_weapons_candidates = []
		Object.keys(Weapon.objs).forEach((item_name) => {
			const item_obj = Item.objs[item_name]
			if (item_obj.level <= char_obj.level) {
				secondary_weapons_candidates.push(item_name)
			}
		})

		const secondary_weapon = secondary_weapons_candidates[ dice(secondary_weapons_candidates.length) - 1 ]
		const bought_secondary_weapon = InventoryView._buy(char_name, secondary_weapon)

		// buy ammo for secondary weapon if needed
		if (bought_secondary_weapon) {
			const secondary_weapon_obj = Item.objs[secondary_weapon]
			const secondary_weapon_ammo = secondary_weapon_obj.meta_obj.ammo
			if (secondary_weapon_ammo) {
				buy_ammo(secondary_weapon_ammo)
			}
		}

		const random_stuff = [...Object.keys(Defense.objs), ...Object.keys(Drug.objs)]
		// console.log('random_stuff')
		// console.log(random_stuff)
		// console.log(typeof random_stuff)

		while (true) {
			let can_buy = random_stuff.filter((item_name) => {
				const item_obj = Item.objs[item_name]
				const has_coins = item_obj.price <= char_obj.inventory_obj.coins			
				const is_defense = Object.keys(Defense.objs).includes(item_name)
				const already_bought = char_obj.inventory_obj.items.includes(item_name)
				const can_hold_item = char_obj.inventory_obj.can_hold_item(item_name)

				if ((is_defense && already_bought) || !has_coins || !can_hold_item) {
					return false
				}

				return true
			})

			//console.log('can_buy')
			//console.log(can_buy)

			if (can_buy.length == 0) {
				break
			}

			const to_buy = can_buy[ dice(can_buy.length) - 1 ]
			// console.log('to_buy')
			// console.log(to_buy)

			InventoryView._buy(char_name, to_buy)
		}

		InventoryView.select_char()
	}
}

new Content('inventory', InventoryView.get_html())

InventoryView.char_selector = document.getElementById('inventory-char-selector')
InventoryView.coins = document.getElementById('inventory-coins')
InventoryView.items = document.getElementById('inventory-items')
InventoryView.shop_item_selector = document.getElementById('inventory-shop-item-selector')
InventoryView.capacity = document.getElementById('inventory-capacity')
InventoryView.free_capacity = document.getElementById('inventory-free-capacity')
InventoryView.drops = document.getElementById('inventory-drops')
InventoryView.airdrop_selector = document.getElementById('inventory-airdrop-selector')

fill_select(InventoryView.shop_item_selector, Object.keys(Item.objs))
fill_select(InventoryView.airdrop_selector, Object.keys(Item.objs))
