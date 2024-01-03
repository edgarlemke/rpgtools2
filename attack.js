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

	constructor (action_obj, damage_types) {
		this.name = action_obj.name
		this.action_obj = action_obj
		this.class = 'Attack'
		this.damage_types = damage_types || []

		action_obj.meta_obj = this
		Attack.objs[this.name] = this
	}

	get_html () {
		const habilities_html = `<b>Habilities:</b> ` + (this.action_obj.habilities == null ? "None" : this.action_obj.habilities.join(', '))
		const races_html = (this.action_obj.for_all ? "All" : (this.action_obj.char_races.length == 0 ? "All" : this.action_obj.char_races.join(', ')))
		const classes_html = (this.action_obj.for_all ? "All" : this.action_obj.char_classes.length == 0 ? "All" : this.action_obj.char_classes.join(', '))
		const for_all_html = (this.action_obj.for_all ? "Yes" : "No")

		let html = `<div class="action-container">
	<div class="action-name">${this.name}</div>
	<div class="action-description">${this.action_obj.description}</div>
	<div class="action-difficulty"><b>Difficulty:</b> ${this.action_obj.difficulty}</div>
	<div class="action-habilities">${habilities_html}</div>
	<div class="action-char-level"><b>Char level:</b> ${this.action_obj.char_level}</div>
	<div class="action-char-classes"><b>Char races:</b> ${races_html}</div>
	<div class="action-char-races"><b>Char classes:</b> ${classes_html}</div>
	<div class="action-char-races"><b>For all:</b> ${for_all_html}</div>
</div>
`
		return html
	}

	act (attacker_name, hability, targets_names, attacker_d20, targets_d20s, damage_type) {
		console.log('act!')
		console.log(attacker_name)
		console.log(hability)
		console.log(targets_names)
		console.log(attacker_d20)
		console.log(targets_d20s)

		const attacker_obj = Char.objs[attacker_name]
		console.log(attacker_obj)
		const attacker_hability = attacker_obj.stats_objs.current[hability]
		console.log(attacker_hability)

		const attacker_aptitude = attacker_obj.aptitudes[damage_type]

		let weapons_damage = 0
		attacker_obj.inventory_obj.equipped.forEach((item_name) => {
			const item_obj = Item.objs[item_name]

			if (Weapon.objs.includes(item_obj.meta_obj)) {
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
			console.log('test apply')
			console.log(target_obj)

			const target_hability = target_obj.stats_objs.current[hability]

			console.log(target_obj.resistances)
			console.log(damage_type)
			const target_resistance = target_obj.resistances[damage_type]

			let target_defenses = 0
			target_obj.inventory_obj.equipped.forEach((item_name) => {
				const item_obj = Item.obj[item_name]
				if (Defense.objs.includes(item_obj.meta_obj) && item_obj.meta_obj.damage_types.includes(damage_type)) {
					target_defenses += item_obj.meta_obj.defense_points
				}	
			})

			const target_d20 = targets_d20s[targets_objs.indexOf(target_obj)]

			const test_result = ((attacker_hability + attacker_aptitude + attacker_d20) - (target_hability + target_resistance + target_defenses + target_d20)) >= difficulty

			// sets the proper result object with an object already containing the abbreviations
			result[target_obj.name] = {
				AH: attacker_hability,
				AA: attacker_aptitude,
				D20: attacker_d20,
				WD: weapons_damage,
				TH: target_hability,
				TR: target_resistance,
				TD: target_defenses,
				TC: targets_count,
				TD20: target_d20,
				DIF: difficulty,
				test_result: test_result,
				damage: 0
			}

			// apply damage if test passed
			if (test_result) {
				// damage

				//let weapon = 0
				//let mul = 0
    			//let dmg = ( (  ( (((attacker_hab+(difficulty*4))) + weapon) ) + (attacker_aptitude * 3) + attacker_d20) - (target_defenses + (target_resistance * 3)) ) * mul
				const mul = attacker_d20 == 20 ? 3 : 1

				const damage = Math.floor( (((attacker_hability + attacker_aptitude + attacker_d20 + difficulty + weapons_damage) - (target_resistance + target_defenses)) / targets_count) * mul)
				result[target_obj.name].damage = damage

				const health = target_obj.health.current - damage
				if (health <= 0) {
					target_obj.health.current = 0
				}
				else {
					target_obj.health.current = health
				}
			}
		})

		return result
	}
}


new Attack(new Action("Punch", "Punches someone.", 7, ["Strength", "Agility", "Dextrity"], 0, [], [], true, true, 1), ['Impact'])
new Attack(new Action("Kick", "Kicks someone.", 9, ["Strength", "Agility", "Dextrity"], 0, [], [], true, true, 1), ['Impact'])
new Attack(new Action("Kneestrike", "Strikes someone with the knees.", 11, ["Strength", "Agility", "Dextrity"], 0, [], [], true, true, 1), ['Impact'])
new Attack(new Action("Weak spot strike", "Strikes someone in a weak spot.", 13, ["Strength", "Agility", "Dextrity"], 0, [], [], true, true, 1), ['Impact'])
new Attack(new Action("Armed attack", "Attacks someone using a weapon.", 7, ["Strength", "Agility", "Dextrity", "Intelligence", "Charisma"], 0, [], [], true, true, 1), ['Impact'])

new Attack(new Action("Onslaught", "The attacker runs furiously and simply removes an enemy from her way with a strike of her weapon.", 11, ["Strength"], 0, [], ["Fighter"], false, true, 1), ['Impact', 'Cutting'])
new Attack(new Action("Bloody Jump", "The attacker jumps over an enemy and with a dimensional advantage strikes the enemy using the weight of her weapon.", 13, ["Strength", "Dextrity"], 0, [], ["Fighter", "Swordsman"], false, true, 1), ['Impact', 'Perfuration', 'Cutting'])

new Attack(new Action("Shock blade", "", 9, ["Dextrity"], 0, [], ["Swordsman"], false, false, 1), ['Cutting'])

new Attack(new Action("Astral discharge", "", 11, ["Intelligence"], 0, [], ["Witch"], false, true, 1), ['Impact'])

new Attack(new Action("Elemental sphere", "", 9, ["Intelligence"], 0, [], ["Alchemist"], false, true, 1), ['Air', 'Water', 'Earth', 'Fire', 'Cheese', 'Electricity'])
new Attack(new Action("Elemental spikes", "", 11, ["Intelligence"], 0, [], ["Alchemist"], false, true, 1), ['Air', 'Water', 'Earth', 'Fire', 'Cheese', 'Electricity'])
new Attack(new Action("Elemental spiral", "", 13, ["Intelligence"], 0, [], ["Alchemist"], false, true, 1), ['Air', 'Water', 'Earth', 'Fire', 'Cheese', 'Electricity'])
new Attack(new Action("Elemental wall", "", 15, ["Intelligence"], 0, [], ["Alchemist"], false, true, 3), ['Air', 'Water', 'Earth', 'Fire', 'Cheese', 'Electricity'])

new Attack(new Action("Feral outbreak", "", 11, ["Strength"], 0, [], ["Chimera"], false, true, 1), ['Impact', 'Cutting', 'Perfuration'])

new Attack(new Action("Infernal hand", "", 13, ["Intelligence"], 0, [], ["Demonologist"], false, true, 1), ['Invocation'])

new Attack(new Action("Infinite Love of the Divinity", "", 13, ["Intelligence"], 0, [], ["Messiah"], false, true, 1), ['Psychic'])
