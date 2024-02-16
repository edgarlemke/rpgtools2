class Trick {
	static objs = []

	static get_html () {
		let html = `<div class="actions-container">
`

		Object.keys(Trick.objs).forEach((key) => {
			html += Trick.objs[key].get_html()
		})

		html += `</div>`

		return html
	}

	constructor (action_obj, legend_html, act_fn) {
		this.name = action_obj.name
		this.action_obj = action_obj
		this.class = 'Trick'

		this.legend_html = legend_html
		this.act_fn = act_fn

		action_obj.meta_obj = this
		Trick.objs[action_obj.name] = this
	}

	get_html () {
		const habilities_html = `<b>Habilities:</b> ` + (this.action_obj.habilities == null ? "None" : this.action_obj.habilities.join(', '))
		const damage_types_html = `<b>Damage types:</b> ` + (this.damage_types ? this.damage_types.join(', ') : '')

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

	act (tricker_name, hability, targets_names, tricker_d20 /* no damage type */) {
		return this.act_fn(this.name, tricker_name, hability, targets_names, tricker_d20)
	}
}


new Trick(new Action("Jungle Sedative", "Adds Sedated status.", 0, ["Intelligence"], 1, [], ["Chimera"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) - (TH + TD20) >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>TH - Target Hability</li>
	<li>TD20 - Target D20</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}	

	targets_names.forEach((target_name) => {
		const target_obj = Char.objs[target_name]
		const target_hability = target_obj.stats_objs.current[hability]

		const test_result_value = (tricker_hability + tricker_d20) - (target_hability)
		const test_result = test_result_value >= difficulty

		// sets the proper result object with an object already containing the abbreviations
		result[target_obj.name] = `
<div><b>${target_name}</b></div>
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) - ${target_hability} >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`

		const status_name = 'Sedated'
		const status_obj = {
			name: status_name,
			...Char.status_objs[status_name]
		}
		const old_turn = status_obj.turn
		status_obj.turn = () => {old_turn(target_obj, status_obj)}

		const old_end = status_obj.end
		status_obj.end = () => {old_end(target_obj, status_obj)}

		target_obj.status.push(status_obj)
	})

	return result
})

new Trick(new Action("Minor Healing", "Recovers health points", 1, ["Intelligence"], 1, [], ["Witch", "Chimera"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) >= DIF</div>
<div><b>HEAL:</b> 50 + TRH + D20</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}	

	targets_names.forEach((target_name) => {
		const target_obj = Char.objs[target_name]

		const test_result_value = (tricker_hability + tricker_d20)
		const test_result = test_result_value >= difficulty

		const heal_result = 50 + tricker_hability + tricker_d20

		// sets the proper result object with an object already containing the abbreviations
		result[target_obj.name] = `
<div><b>${target_name}</b></div>
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
<div><b>HEAL:</b> 50 + ${tricker_hability} + ${tricker_d20} = <b>${heal_result}</b> </div>
`

		if (target_obj.health.current + heal_result > target_obj.health.base) {
			target_obj.health.current = target_obj.health.base
		}
		else {
			target_obj.health.current += heal_result
		}
	})

	return result
})

new Trick(new Action("Conjurate Animal Spirit", "If successful, allows to try a second attack.", 3, ["Intelligence"], 1, [], ["Chimera"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}

	const test_result_value = tricker_hability + tricker_d20
	const test_result = test_result_value > difficulty

	result[tricker_name] = `
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`

	return result
})

new Trick(new Action("Bless", "Adds Blessed status, adds 3 hability points for all hablities, 3 rounds, upon 1 player.", 3, ["Intelligence", "Charisma"], 1, [], ["Witch"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}

	targets_names.forEach((target_name) => {
		const target_obj = Char.objs[target_name]
		const target_hability = target_obj.stats_objs.current[hability]
		const target_d20 = targets_d20s[targets_names.indexOf(target_name)]

		const test_result_value = (tricker_hability + tricker_d20) 
		const test_result = test_result_value >= difficulty

		// sets the proper result object
		result[target_obj.name] = `
<div><b>${target_name}</b></div>
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`
		// setup status
		const status_name = 'Blessed'
		const status_obj = {
			name: status_name,
			...Char.status_objs[status_name]
		}
		const old_turn = status_obj.turn
		status_obj.turn = () => {old_turn(target_obj, status_obj)}

		const old_end = status_obj.end
		status_obj.end = () => {old_end(target_obj, status_obj)}

		target_obj.status.push(status_obj)

		// adds given points to all habilities 
		Object.keys(target_obj.stats_objs.current).forEach((key) => {
			target_obj.stats_objs.current[key] += status_obj.points
		})
	})

	return result
})

new Trick(new Action("Curse", "Adds Cursed status, subtracts 3 hability points for all habilities, 3 rounds, upon 1 plyaer.", 3, ["Intelligence", "Charisma"], 1, [], ["Witch", "Circus Artist"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}

	targets_names.forEach((target_name) => {
		const target_obj = Char.objs[target_name]
		const target_hability = target_obj.stats_objs.current[hability]

		const test_result_value = (tricker_hability + tricker_d20) - (target_hability)
		const test_result = test_result_value >= difficulty

		// sets the proper result object
		result[target_obj.name] = `
<div><b>${target_name}</b></div>
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) - ${target_hability} >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`
		// setup status
		const status_name = 'Cursed'
		const status_obj = {
			name: status_name,
			...Char.status_objs[status_name]
		}
		const old_turn = status_obj.turn
		status_obj.turn = () => {old_turn(target_obj, status_obj)}

		const old_end = status_obj.end
		status_obj.end = () => {old_end(target_obj, status_obj)}

		target_obj.status.push(status_obj)

		// take points from all habilities 
		Object.keys(target_obj.stats_objs.current).forEach((key) => {
			target_obj.stats_objs.current[key] -= status_obj.points
		})
	})

	return result
})

new Trick(new Action("Alchemical Imobilization", "Adds Imobilized status.", 3, ["Intelligence", "Charisma"], 1, [], ["Alchemist"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}

	targets_names.forEach((target_name) => {
		const target_obj = Char.objs[target_name]
		const target_hability = target_obj.stats_objs.current[hability]

		const test_result_value = (tricker_hability + tricker_d20) - (target_hability)
		const test_result = test_result_value >= difficulty

		// sets the proper result object
		result[target_obj.name] = `
<div><b>${target_name}</b></div>
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) - ${target_hability} >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`
		// setup status
		const status_name = 'Imobilized'
		const status_obj = {
			name: status_name,
			...Char.status_objs[status_name]
		}
		const old_turn = status_obj.turn
		status_obj.turn = () => {old_turn(target_obj, status_obj)}

		const old_end = status_obj.end
		status_obj.end = () => {old_end(target_obj, status_obj)}

		target_obj.status.push(status_obj)
	})

	return result
})

new Trick(new Action("Frenesi", "The player is brought to an altered state of belic trance and gains hability points temporarily.", 2, ["Strength"], 1, [], ["Fighter", "Chimera"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}

	const test_result_value = tricker_hability + tricker_d20
	const test_result = test_result_value > difficulty

	result[tricker_name] = `
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`

	// setup status
	const status_name = 'Frenesi'
	const status_obj = {
		name: status_name,
		...Char.status_objs[status_name]
	}
	const old_turn = status_obj.turn
	status_obj.turn = () => {old_turn(tricker_obj, status_obj)}

	const old_end = status_obj.end
	status_obj.end = () => {old_end(tricker_obj, status_obj)}

	tricker_obj.status.push(status_obj)

	// adds given points to all habilities 
	Object.keys(tricker_obj.stats_objs.current).forEach((key) => {
		tricker_obj.stats_objs.current[key] += status_obj.points
	})

	return result
})


new Trick(new Action("Mirrors and Smoke", "Allows the Circus Artist to Hide more easily.", 0, ["Dextrity", "Charisma"], 1, [], ["Circus Artist"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}

	const test_result_value = tricker_hability + tricker_d20
	const test_result = test_result_value > difficulty

	result[tricker_name] = `
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`

	// setup status
	const status_name = 'Hidden'
	const status_obj = {
		name: status_name,
		...Char.status_objs[status_name]
	}
	tricker_obj.status.push(status_obj)

	return result
})

new Trick(new Action("Lullaby", "Sings or plays a lullaby, that calms down an enemy and avoids being hit by such enemy unless it's attacked by her. Adds Pacified status.", 0, ["Charisma"], 1, [], ["Circus Artist"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) - (TAH + TD20) >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>TAH - Target Hability</li>
	<li>TD20 - Target D20</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}

	targets_names.forEach((target_name) => {
		const target_obj = Char.objs[target_name]
		const target_hability = target_obj.stats_objs.current[hability]

		const test_result_value = (tricker_hability + tricker_d20) - (target_hability)
		const test_result = test_result_value >= difficulty

		// sets the proper result object
		result[target_obj.name] = `
<div><b>${target_name}</b></div>
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) - ${target_hability} >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`
		// setup status
		const status_name = 'Pacified'
		const status_obj = {
			name: status_name,
			...Char.status_objs[status_name]
		}
		status_obj.char_name = tricker_name

		target_obj.status.push(status_obj)
	})

	return result
})

new Trick(new Action("Hypnosis", "Makes someone else obey a single command.", 3, ["Charisma"], 1, [], ["Circus Artist"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) - (TAH + TD20) >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>TAH - Target Hability</li>
	<li>TD20 - Target D20</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}

	targets_names.forEach((target_name) => {
		const target_obj = Char.objs[target_name]
		const target_hability = target_obj.stats_objs.current[hability]

		const test_result_value = (tricker_hability + tricker_d20) - (target_hability)
		const test_result = test_result_value >= difficulty

		// sets the proper result object
		result[target_obj.name] = `
<div><b>${target_name}</b></div>
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) - ${target_hability} >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`
		// setup status
		const status_name = 'Hypnotized'
		const status_obj = {
			name: status_name,
			...Char.status_objs[status_name]
		}
		status_obj.char_name = tricker_name

		const old_turn = status_obj.turn
		status_obj.turn = () => {old_turn(tricker_obj, status_obj)}

		const old_end = status_obj.end
		status_obj.end = () => {old_end(tricker_obj, status_obj)}

		target_obj.status.push(status_obj)
	})

	return result
})

new Trick(new Action("Possession", "", 0, ["Intelligence", "Charisma"], 1, [], ["Messiah"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) - (TAH + TD20) >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>TAH - Target Hability</li>
	<li>TD20 - Target D20</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}

	targets_names.forEach((target_name) => {
		const target_obj = Char.objs[target_name]
		const target_hability = target_obj.stats_objs.current[hability]

		const test_result_value = (tricker_hability + tricker_d20) - (target_hability)
		const test_result = test_result_value >= difficulty

		// sets the proper result object
		result[target_obj.name] = `
<div><b>${target_name}</b></div>
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) - ${target_hability} >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`
		// setup status
		const status_name = 'Possessed'
		const status_obj = {
			name: status_name,
			...Char.status_objs[status_name]
		}

		const old_turn = status_obj.turn
		status_obj.turn = () => {old_turn(tricker_obj, status_obj)}

		const old_end = status_obj.end
		status_obj.end = () => {old_end(tricker_obj, status_obj)}

		target_obj.status.push(status_obj)
	})

	return result
})

new Trick(new Action("Unstoppable Blade", "Allows the Swordsman to break the weapon of an enemy.", 0, ["Dextrity", "Agility"], 1, [], ["Swordsman"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}

	const test_result_value = tricker_hability + tricker_d20
	const test_result = test_result_value > difficulty

	result[tricker_name] = `
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`

	// setup status
	const status_name = 'Unstoppable Blade'
	const status_obj = {
		name: status_name,
		...Char.status_objs[status_name]
	}
	const old_turn = status_obj.turn
	status_obj.turn = () => {old_turn(tricker_obj, status_obj)}

	const old_end = status_obj.end
	status_obj.end = () => {old_end(tricker_obj, status_obj)}

	tricker_obj.status.push(status_obj)

	return result
})

new Trick(new Action("Cover Fire", "Gives cover fire to protect an ally for a turn.", 3, ["Dextrity"], 1, [], ["Shooter"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}

	targets_names.forEach((target_name) => {
		const target_obj = Char.objs[target_name]
		const target_hability = target_obj.stats_objs.current[hability]
		const target_d20 = targets_d20s[targets_names.indexOf(target_name)]

		const test_result_value = (tricker_hability + tricker_d20) 
		const test_result = test_result_value >= difficulty

		// sets the proper result object
		result[target_obj.name] = `
<div><b>${target_name}</b></div>
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`
		// setup status
		const status_name = 'Covered'
		const status_obj = {
			name: status_name,
			...Char.status_objs[status_name]
		}
		const old_turn = status_obj.turn
		status_obj.turn = () => {old_turn(target_obj, status_obj)}

		const old_end = status_obj.end
		status_obj.end = () => {old_end(target_obj, status_obj)}

		target_obj.status.push(status_obj)

		// adds given points to all habilities 
		Object.keys(target_obj.stats_objs.current).forEach((key) => {
			target_obj.stats_objs.current[key] += status_obj.points
		})
	})

	return result
})

new Trick(new Action("Accurate Shot", "Guarantees that if the shooter misses an attack, she causes at least 50 points of damage to the enemy.", 3, ["Dextrity"], 1, [], ["Shooter"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}

	targets_names.forEach((target_name) => {
		const target_obj = Char.objs[target_name]
		const target_hability = target_obj.stats_objs.current[hability]
		const target_d20 = targets_d20s[targets_names.indexOf(target_name)]

		const test_result_value = (tricker_hability + tricker_d20) 
		const test_result = test_result_value >= difficulty

		// sets the proper result object
		result[target_obj.name] = `
<div><b>${target_name}</b></div>
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`
		// setup status
		const status_name = 'Accurate Shot'
		const status_obj = {
			name: status_name,
			...Char.status_objs[status_name]
		}
		const old_turn = status_obj.turn
		status_obj.turn = () => {old_turn(target_obj, status_obj)}

		const old_end = status_obj.end
		status_obj.end = () => {old_end(target_obj, status_obj)}

		target_obj.status.push(status_obj)
	})

	return result
})


