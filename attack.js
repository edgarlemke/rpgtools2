class Attack {
	static objs = []

	static damage_types = ["Air", "Water", "Fire", "Earth", "Psychic", "Invocation", "Perfuration", "Cutting", "Shooting", "Explosion", "Impact", "Cheese", "Electricity", "Acid", "Poison", "Throwing"]

	static get_html () {
		let html = `<div class="actions-container">
`

		Object.keys(Attack.objs).forEach((key) => {
			html += Attack.objs[key].get_html()
		})

		html += `</div>`

		return html
	}

	constructor (action_obj, damage_types, base_damage) {
		this.name = action_obj.name
		this.action_obj = action_obj
		this.class = 'Attack'
		this.damage_types = damage_types || []
		this.base_damage = base_damage || 0

		action_obj.meta_obj = this
		Attack.objs[this.name] = this
	}

	get_html () {
		const habilities_html = `<b>Habilities:</b> ` + (this.action_obj.habilities == null ? "None" : this.action_obj.habilities.join(', '))
		const damage_types_html = `<b>Damage types:</b> ` + this.damage_types.join(', ')

		const races_html = (this.action_obj.for_all ? "All" : (this.action_obj.char_races.length == 0 ? "All" : this.action_obj.char_races.join(', ')))
		const classes_html = (this.action_obj.for_all ? "All" : this.action_obj.char_classes.length == 0 ? "All" : this.action_obj.char_classes.join(', '))
		const for_all_html = (this.action_obj.for_all ? "Yes" : "No")

		let html = `<div class="action-container">
	<div class="action-name">${this.name}</div>
	<div class="action-description">${this.action_obj.description}</div>
	<div class="action-difficulty"><b>Difficulty:</b> ${this.action_obj.difficulty}</div>
	<div class="action-habilities">${habilities_html}</div>
	<div class="attack-damage-types">${damage_types_html}</div>
	<div class="action-char-level"><b>Char level:</b> ${this.action_obj.char_level}</div>
	<div class="action-char-classes"><b>Char races:</b> ${races_html}</div>
	<div class="action-char-races"><b>Char classes:</b> ${classes_html}</div>
	<div class="action-char-races"><b>For all:</b> ${for_all_html}</div>
</div>
`
		return html
	}

	act (attacker_name, hability, targets_names, attacker_d20, damage_type) {
		const attacker_obj = Char.objs[attacker_name]
		const attacker_hability = attacker_obj.stats_objs.current[hability]
		const attacker_aptitude = attacker_obj.aptitudes[damage_type]
		const action_level = attacker_obj.actions_obj.actions_levels[this.name] || 1

		let attacker_weapons = 0
		let weapons_damage = 0
		attacker_obj.inventory_obj.equipped.forEach((item_index) => {
			const item_name = attacker_obj.inventory_obj.items[item_index]
			const item_obj = Item.objs[item_name]

			if (Object.keys(Weapon.objs).includes(item_name)) {
				attacker_weapons += item_obj.meta_obj.attack_points
				weapons_damage += item_obj.price
			}
		})

		const difficulty = this.action_obj.difficulty

		const targets_objs = []
		let targets_count = 0
		targets_names.forEach((target_name) => {
			targets_objs.push(Char.objs[target_name])
			targets_count += 1
		})

		const result = {}

		// test and apply damage to each target
		targets_objs.forEach((target_obj) => {
			// console.log('target_obj', target_obj)

			const target_hability = target_obj.stats_objs.current[hability]

			const target_resistance = target_obj.resistances[damage_type]

			let target_defenses_defense_points = 0
			let target_defenses_protection_points = 0
			//console.log('target_obj.inventory_obj.equipped', target_obj.inventory_obj.equipped)
			target_obj.inventory_obj.equipped.forEach((item_index) => {
				// console.log('item_index', item_index)

				const item_name = target_obj.inventory_obj.items[item_index]
				// console.log('item_name', item_name)

				const item_obj = Item.objs[item_name]
				// console.log('item_obj', item_obj)

				if (!item_obj.meta_obj.damage_types) {
					return
				}

				const is_defense = Object.keys(Defense.objs).includes(item_name)
				const matches_damage_type = item_obj.meta_obj.damage_types.filter((damage_type_) => {return damage_type_.toLowerCase() == damage_type}).length > 0

				// console.log('is_defense', is_defense)
				// console.log('item_obj.meta_obj.damage_types', item_obj.meta_obj.damage_types)
				// console.log('damage_type', damage_type)

				if (is_defense && matches_damage_type) {
					// console.log('item_obj.meta_obj.defense_points', item_obj.meta_obj.defense_points)
					target_defenses_defense_points += item_obj.meta_obj.defense_points
					target_defenses_protection_points += item_obj.price
				}
			})
			// console.log('target_defenses', target_defenses)

			const test_result_value = ((attacker_hability + attacker_aptitude + attacker_weapons + attacker_d20) - (target_hability + target_resistance + target_defenses_defense_points))
			const test_result = test_result_value >= difficulty

			// sets the proper result object with an object already containing the abbreviations
			result[target_obj.name] = {
				BD: this.base_damage,
				AH: attacker_hability,
				AA: attacker_aptitude,
				AW: attacker_weapons,
				D20: attacker_d20,
				WD: weapons_damage,
				AL: action_level,
				TH: target_hability,
				TR: target_resistance,
				TD: target_defenses_defense_points,
				TDP: target_defenses_protection_points,
				TC: targets_count,
				DIF: difficulty,
				test_result_value: test_result_value,
				test_result: test_result,
				damage: 0
			}

			// apply damage if test passed
			if (test_result) {
				// damage
				// const mul = attacker_d20 == 20 ? 3 : 1
				const mul = attacker_d20 == 20 ? 2 : 1

				// const damage = Math.floor( (((attacker_hability + attacker_aptitude + attacker_d20 + difficulty + weapons_damage) - (target_resistance + target_defenses)) / targets_count) * mul)
				const attack_damage = Math.floor( this.base_damage + ((attacker_hability + attacker_aptitude + attacker_d20 + weapons_damage) * (1+((action_level-1)*0.2))) )
				const damage = Math.floor( (( attack_damage  - (target_resistance + target_defenses_protection_points)) / targets_count) * difficulty * mul)
				result[target_obj.name].AD = attack_damage
				result[target_obj.name].damage = damage

				const health = target_obj.health.current - damage
				if (health <= 0) {
					target_obj.health.current = 0

					// dirty setting Alive/Dead status
					target_obj.status = target_obj.status.filter((status_obj) => {
						return status_obj.name != 'Alive'
					})
					target_obj.status.push({name: 'Dead'})
				}
				else {
					target_obj.health.current = health
				}

				// dirty removing Pacified status
				target_obj.status = target_obj.status.filter((status_obj) => {
					return status_obj.name != 'Pacified' || (status_obj.name == 'Pacified' && status_obj.char_name != attacker_name)
				})
			}
		})

		return result
	}
}


new Attack(new Action("Punch", "Punches someone.", 6, ["Strength", "Agility", "Dextrity"], 1, [], [], true, true, 1), ['Impact'], 0)
new Attack(new Action("Kick", "Kicks someone.", 9, ["Strength", "Agility", "Dextrity"], 1, [], [], true, true, 1), ['Impact'], 0)
new Attack(new Action("Kneestrike", "Strikes someone with the knees.", 12, ["Strength", "Agility", "Dextrity"], 1, [], [], true, true, 1), ['Impact'], 0)
new Attack(new Action("Weak spot strike", "Strikes someone in a weak spot.", 15, ["Strength", "Agility", "Dextrity"], 1, [], [], true, true, 1), ['Impact'], 0)

new Attack(new Action("Armed attack", "Attacks someone using a weapon. It's a generic action for when a player wants to (more probably) hit an attack using a weapon, even if causing low damage.", 5, ["Strength", "Agility", "Dextrity", "Intelligence", "Charisma"], 1, [], [], true, true, 1), ['Impact', 'Cutting', 'Perfuration', 'Shooting', 'Throwing', 'Explosion', 'Air', 'Water', 'Fire', 'Earth', 'Cheese', 'Psychic', 'Invocation', 'Poison', 'Acid', 'Electricity'], 0)

new Attack(new Action("Onslaught", "The attacker runs furiously and simply removes an enemy from her way with a strike of her weapon.", 11, ["Strength"], 1, [], ["Fighter"], false, true, 1), ['Impact', 'Cutting'], 0)
new Attack(new Action("Bloody Jump", "The attacker jumps over an enemy and with a dimensional advantage strikes the enemy using the weight of her weapon.", 16, ["Strength", "Dextrity"], 1, [], ["Fighter", "Swordsman"], false, true, 1), ['Impact', 'Perfuration', 'Cutting'], 0)

new Attack(new Action("Shock blade", "", 11, ["Dextrity"], 1, [], ["Swordsman"], false, false, 1), ['Cutting'], 0)
new Attack(new Action("Instant perfuration", "", 13, ["Agility", "Dextrity"], 1, [], ["Swordsman"], false, false, 2), ['Perfuration'], 0)
new Attack(new Action("Tornado", "", 16, ["Agility", "Dextrity"], 1, [], ["Swordsman"], false, false, 2), ['Cutting'], 0)

new Attack(new Action("Spectral discharge", "", 11, ["Intelligence"], 1, [], ["Witch", "Messiah"], false, true, 1), ['Invocation'], 0)
new Attack(new Action("Arcane spirits", "", 13, ["Intelligence"], 1, [], ["Witch", "Messiah"], false, true, 1), ['Invocation'], 0)
new Attack(new Action("Dangerous witchcraft", "", 16, ["Intelligence"], 1, [], ["Witch"], false, true, 1), ['Invocation'], 0)

new Attack(new Action("Minor Elemental Sphere", "", 11, ["Intelligence"], 1, [], ["Witch", "Alchemist"], false, true, 1), ['Air', 'Water', 'Earth', 'Fire', 'Cheese', 'Electricity'], 0)
new Attack(new Action("Alchemical Elemental Damage", "", 16, ["Intelligence"], 1, [], ["Alchemist"], false, true, 1), ['Air', 'Water', 'Earth', 'Fire', 'Cheese', 'Electricity'], 0)

new Attack(new Action("Feral outbreak", "", 11, ["Strength"], 1, [], ["Chimera"], false, true, 1), ['Impact', 'Cutting', 'Perfuration'], 0)
new Attack(new Action("Acid Bubble", "", 13, ["Intelligence"], 1, [], ["Alchemist", "Chimera"], false, true, 1), ['Acid'], 0)

new Attack(new Action("Infernal hand", "", 11, ["Intelligence"], 5, [], ["Messiah"], false, true, 1), ['Invocation'], 0)
new Attack(new Action("Purgatory", "", 13, ["Charisma"], 10, [], ["Messiah"], false, true, 1), ['Psychic'], 0)
new Attack(new Action("Infinite Love of the Divinity", "", 16, ["Intelligence"], 1, [], ["Messiah"], false, true, 1), ['Invocation'], 0)

new Attack(new Action("Fast shot", "", 11, ["Agility"], 1, [], ["Shooter"], false, true, 1), ['Shooting'], 0)
new Attack(new Action("Pew Pew", "", 13, ["Dextrity"], 1, [], ["Shooter"], false, true, 1), ['Shooting'], 0)

new Attack(new Action("Kwink Blade", "", 11, ["Agility", "Dextrity"], 1, [], ["Engineer"], false, true, 1), ['Cutting', 'Perfuration'], 0)
new Attack(new Action("Kwink Hammer", "", 13, ["Dextrity", "Strength"], 1, [], ["Engineer"], false, true, 1), ['Impact'], 0)
new Attack(new Action("Amplified Electrical Discharge", "", 16, ["Intelligence", "Dextrity"], 1, [], ["Engineer"], false, true, 2), ['Electricity'], 0)

new Attack(new Action("Suffering Spectacle", "", 11, ["Agility", "Dextrity"], 1, [], ["Circus Artist"], false, true, 1), ['Cutting'], 0)
new Attack(new Action("Bloody Acrobacies", "", 13, ["Dextrity", "Strength"], 1, [], ["Circus Artist"], false, true, 1), ['Impact'], 0)

new Attack(new Action("Blood needles", "", 11, ["Intelligence"], 1, ["Ghoul"], [], false, true, 1), ['Perfuration'], 0)
new Attack(new Action("Gluttonous thrust", "", 13, ["Agility", "Dextrity"], 1, ["Ghoul"], [], false, true, 1), ['Cutting', 'Perfuration'], 0)
new Attack(new Action("Flash Slay", "", 16, ["Agility"], 1, ["Ghoul"], [], false, true, 1), ['Cutting'], 0)

new Attack(new Action("Elemental sphere", "", 11, ["Intelligence"], 1, ["Elemental"], [], false, true, 1), ['Air', 'Water', 'Earth', 'Fire', 'Cheese', 'Electricity'], 0)
new Attack(new Action("Elemental spikes", "", 13, ["Intelligence"], 1, ["Elemental"], [], false, true, 1), ['Air', 'Water', 'Earth', 'Fire', 'Cheese', 'Electricity'], 0)
new Attack(new Action("Elemental spiral", "", 16, ["Intelligence"], 1, ["Elemental"], [], false, true, 1), ['Air', 'Water', 'Earth', 'Fire', 'Cheese', 'Electricity'], 0)


