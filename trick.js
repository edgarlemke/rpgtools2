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


new Trick(new Action("Jungle Sedative", "Adds Sedated status: who is sedated loses 1 point from all habilities at each turn, it lasts 3 turns, and after it ends, the points are recovered but they get the Sleeping status.", 13, ["Intelligence"], 1, [], ["Chimera"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) - TH >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>TH - Target Hability</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}	
	const combat_name = CombatView.combat_selector.selectedOptions[0].innerText
	const combat_obj = Combat.objs[combat_name]
	const status_turn = tricker_obj.status_turns

	targets_names.forEach((target_name) => {
		const target_obj = Char.objs[target_name]
		const target_hability = target_obj.stats_objs.current[hability]

		const test_result_value = (tricker_hability + tricker_d20) - (target_hability)
		const test_result = test_result_value >= difficulty

		// sets the proper result object with an object already containing the abbreviations
		result[target_obj.name] = `
<div><b>${target_name}</b></div>
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) - ${target_hability} = ${test_result_value} >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`

        if (!test_result) {
			return
		}

		const status_name = 'Sedated'
		const status_obj = {
			name: status_name,
			... Char.status_objs[status_name]
		}
		status_obj.toll = JSON.parse(JSON.stringify(status_obj.toll))

		const old_turn = status_obj.turn
		status_obj.turn = (skip_duration) => {old_turn(target_obj, status_obj, skip_duration)}
		status_obj.turn(true)

		const old_end = status_obj.end
		status_obj.end = () => {old_end(target_obj, status_obj, tricker_obj)}

		target_obj.status.push(status_obj)
		status_turn.push(status_obj)
	})

	return result
})

new Trick(new Action("Minor Healing", "Recovers health points. Heals (50 + TRH + D20) points.", 11, ["Intelligence"], 1, [], ["Witch", "Chimera"], false, false, 1), `
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
` + (test_result ? `<div><b>HEAL:</b> 50 + ${tricker_hability} + ${tricker_d20} = <b>${heal_result}</b> </div>` : '')

        if (!test_result) {
			return
		}

		if (target_obj.health.current + heal_result > target_obj.health.base) {
			target_obj.health.current = target_obj.health.base
		}
		else {
			target_obj.health.current += heal_result
		}
	})

	return result
})

new Trick(new Action("Conjurate Animal Spirit", "If successful, allows to try a second attack.", 13, ["Intelligence"], 1, [], ["Chimera"], false, false, 1), `
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

new Trick(new Action("Bless", "Adds Blessed status, adds 3 hability points for all hablities, lasts 3 rounds, upon 1 player.", 16, ["Intelligence", "Charisma"], 1, [], ["Witch"], false, false, 1), `
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
	const combat_name = CombatView.combat_selector.selectedOptions[0].innerText
	const combat_obj = Combat.objs[combat_name]
	const status_turn = tricker_obj.status_turns

	targets_names.forEach((target_name) => {
		const target_obj = Char.objs[target_name]
		const target_hability = target_obj.stats_objs.current[hability]

		const test_result_value = (tricker_hability + tricker_d20) 
		const test_result = test_result_value >= difficulty

		// sets the proper result object
		result[target_obj.name] = `
<div><b>${target_name}</b></div>
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`

        if (!test_result) {
			return
		}

		// setup status
		const status_name = 'Blessed'
		const status_obj = {
			name: status_name,
			... Char.status_objs[status_name]
		}
		status_obj.toll = JSON.parse(JSON.stringify(status_obj.toll))

		const old_turn = status_obj.turn
		status_obj.turn = (skip_duration) => {old_turn(target_obj, status_obj, skip_duration)}
		status_obj.turn(true)

		const old_end = status_obj.end
		status_obj.end = () => {old_end(target_obj, status_obj, tricker_obj)}

		target_obj.status.push(status_obj)
		status_turn.push(status_obj)

		// adds given points to all habilities 
		Object.keys(target_obj.stats_objs.current).forEach((key) => {
			target_obj.stats_objs.current[key] += status_obj.points
			status_obj.toll.stats[key] += status_obj.points
		})
	})

	return result
})

new Trick(new Action("Curse", "Adds Cursed status: subtracts 3 hability points for all habilities, lasting 3 rounds, upon 1 player.", 16, ["Intelligence", "Charisma"], 1, [], ["Witch", "Circus Artist"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) - TH >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>TH - Target Hability</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}
	const combat_name = CombatView.combat_selector.selectedOptions[0].innerText
	const combat_obj = Combat.objs[combat_name]
	const status_turn = tricker_obj.status_turns

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

        if (!test_result) {
			return
		}

		// setup status
		const status_name = 'Cursed'
		const status_obj = {
			name: status_name,
			... Char.status_objs[status_name]
		}
		status_obj.toll = JSON.parse(JSON.stringify(status_obj.toll))

		const old_turn = status_obj.turn
		status_obj.turn = (skip_duration) => {old_turn(target_obj, status_obj, skip_duration)}
		status_obj.turn(true)

		const old_end = status_obj.end
		status_obj.end = () => {old_end(target_obj, status_obj, tricker_obj)}

		target_obj.status.push(status_obj)
		status_turn.push(status_obj)

		// take points from all habilities 
		Object.keys(target_obj.stats_objs.current).forEach((key) => {
			target_obj.stats_objs.current[key] -= status_obj.points
			status_obj.toll.stats[key] -= status_obj.points
		})
	})

	return result
})

new Trick(new Action("Alchemical Imobilization", "Adds Imobilized status: who gets imobilized status can't act for 1 turn.", 11, ["Intelligence", "Charisma"], 1, [], ["Alchemist"], false, false, 1), `
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
	const combat_name = CombatView.combat_selector.selectedOptions[0].innerText
	const combat_obj = Combat.objs[combat_name]
	const status_turn = tricker_obj.status_turns

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

        if (!test_result) {
			return
		}

		// setup status
		const status_name = 'Imobilized'
		const status_obj = {
			name: status_name,
			...Char.status_objs[status_name]
		}

		const old_turn = status_obj.turn
		status_obj.turn = (skip_duration) => {old_turn(target_obj, status_obj, skip_duration)}
		status_obj.turn(true)

		const old_end = status_obj.end
		status_obj.end = () => {old_end(target_obj, status_obj, tricker_obj)}

		target_obj.status.push(status_obj)
		status_turn.push(status_obj)
	})

	return result
})

new Trick(new Action("Frenesi", "The player is brought to an altered state of belic trance and gains hability points temporarily. Adds Frenesi status: the player gets 3 more points on all habilities once the action is done, and it lasts 3 turns.", 13, ["Strength"], 1, [], ["Fighter", "Chimera"], false, false, 1), `
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
	const combat_name = CombatView.combat_selector.selectedOptions[0].innerText
	const combat_obj = Combat.objs[combat_name]
	const status_turn = tricker_obj.status_turns

	const test_result_value = tricker_hability + tricker_d20
	//console.log('test_result_value', test_result_value)

	const test_result = test_result_value > difficulty
	//console.log('test_result', test_result)

	result[tricker_name] = `
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`

    if (!test_result) {
		return result
	}

	// setup status
	const status_name = 'Frenesi'
	const status_obj = {
		name: status_name,
		... Char.status_objs[status_name]
	}
	status_obj.toll = JSON.parse(JSON.stringify(status_obj.toll))

	const old_turn = status_obj.turn
	status_obj.turn = (skip_duration) => {old_turn(tricker_obj, status_obj, skip_duration)}
	status_obj.turn(true)

	const old_end = status_obj.end
	status_obj.end = () => {old_end(tricker_obj, status_obj)}

	tricker_obj.status.push(status_obj)
	status_turn.push(status_obj)

	// adds given points to all habilities 
	Object.keys(tricker_obj.stats_objs.current).forEach((key) => {
		tricker_obj.stats_objs.current[key] += status_obj.points
		status_obj.toll.stats[key] += status_obj.points
	})

	return result
})


new Trick(new Action("Mirrors and Smoke", "Allows the Circus Artist to Hide more easily.", 11, ["Dextrity", "Charisma"], 1, [], ["Circus Artist"], false, false, 1), `
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
	const combat_name = CombatView.combat_selector.selectedOptions[0].innerText
	const combat_obj = Combat.objs[combat_name]
	const status_turn = tricker_obj.status_turns

	const test_result_value = tricker_hability + tricker_d20
	const test_result = test_result_value > difficulty

	result[tricker_name] = `
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`

    if (!test_result) {
		return
	}

	// setup status
	const status_name = 'Hidden'
	const status_obj = {
		name: status_name,
		...Char.status_objs[status_name]
	}
	tricker_obj.status.push(status_obj)
	status_turn.push(status_obj)

	return result
})

new Trick(new Action("Lullaby", "Sings or plays a lullaby, that calms down an enemy and avoids being hit by such enemy unless it's attacked by her. Adds Pacified status.", 13, ["Charisma"], 1, [], ["Circus Artist"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) - TAH >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>TAH - Target Hability</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}
	const combat_name = CombatView.combat_selector.selectedOptions[0].innerText
	const combat_obj = Combat.objs[combat_name]
	const status_turn = tricker_obj.status_turns

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

    	if (!test_result) {
			return
		}

		// setup status
		const status_name = 'Pacified'
		const status_obj = {
			name: status_name,
			... Char.status_objs[status_name]
		}
		status_obj.char_name = tricker_name

		target_obj.status.push(status_obj)
		status_turn.push(status_obj)
	})

	return result
})

new Trick(new Action("Hypnosis", "Makes someone else obey a single command.", 16, ["Charisma"], 1, [], ["Circus Artist"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) - TAH >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>TAH - Target Hability</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}
	const combat_name = CombatView.combat_selector.selectedOptions[0].innerText
	const combat_obj = Combat.objs[combat_name]
	const status_turn = tricker_obj.status_turns

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

    	if (!test_result) {
			return
		}

		// setup status
		const status_name = 'Hypnotized'
		const status_obj = {
			name: status_name,
			...Char.status_objs[status_name]
		}
		status_obj.char_name = tricker_name

		const old_turn = status_obj.turn
		status_obj.turn = (skip_duration) => {old_turn(tricker_obj, status_obj, skip_duration)}
		status_obj.turn(true)

		const old_end = status_obj.end
		status_obj.end = () => {old_end(tricker_obj, status_obj)}

		target_obj.status.push(status_obj)
		status_turn.push(status_obj)
	})

	return result
})

new Trick(new Action("Possession", "Adds Possessed status to the target, which is controlled by a supernatural entity for 2 turns.", 11, ["Intelligence", "Charisma"], 1, [], ["Messiah"], false, false, 1), `
<div><b>TEST:</b> (TRH + D20) - TAH >= DIF</div>
<ul>
	<li>TRH - Tricker Hability</li>
	<li>D20 - Tricker D20</li>
	<li>TAH - Target Hability</li>
	<li>DIF - Difficulty</li>
</ul>
`, (action_name, tricker_name, hability, targets_names, tricker_d20) => {
	const action_obj = Action.objs[action_name]

	const tricker_obj = Char.objs[tricker_name]
	const difficulty = action_obj.difficulty
	const tricker_hability = tricker_obj.stats_objs.current[hability]

	const action_level = tricker_obj.actions_obj.actions_levels[action_name]

	const result = {}
	const combat_name = CombatView.combat_selector.selectedOptions[0].innerText
	const combat_obj = Combat.objs[combat_name]
	const status_turn = tricker_obj.status_turns

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

    	if (!test_result) {
			return
		}

		// setup status
		const status_name = 'Possessed'
		const status_obj = {
			name: status_name,
			...Char.status_objs[status_name]
		}

		const old_turn = status_obj.turn
		status_obj.turn = (skip_duration) => {old_turn(target_obj, status_obj, skip_duration)}
		status_obj.turn(true)

		const old_end = status_obj.end
		status_obj.end = () => {old_end(target_obj, status_obj, tricker_obj)}

		target_obj.status.push(status_obj)
		status_turn.push(status_obj)
	})

	return result
})

new Trick(new Action("Unstoppable Blade", "Allows the Swordsman to break the weapon of an enemy.", 13, ["Dextrity", "Agility"], 1, [], ["Swordsman"], false, false, 1), `
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
	const combat_name = CombatView.combat_selector.selectedOptions[0].innerText
	const combat_obj = Combat.objs[combat_name]
	const status_turn = tricker_obj.status_turns

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
	status_obj.turn = (skip_duration) => {old_turn(tricker_obj, status_obj, skip_duration)}
	status_obj.turn(true)

	const old_end = status_obj.end
	status_obj.end = () => {old_end(tricker_obj, status_obj)}

	tricker_obj.status.push(status_obj)
	status_turn.push(status_obj)

	return result
})

new Trick(new Action("Cover Fire", "Gives cover fire to protect an ally for a turn. Lasts 1 turn.", 16, ["Dextrity"], 1, [], ["Shooter"], false, false, 1), `
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
	const combat_name = CombatView.combat_selector.selectedOptions[0].innerText
	const combat_obj = Combat.objs[combat_name]
	const status_turn = tricker_obj.status_turns

	targets_names.forEach((target_name) => {
		const target_obj = Char.objs[target_name]
		const target_hability = target_obj.stats_objs.current[hability]

		const test_result_value = (tricker_hability + tricker_d20) 
		const test_result = test_result_value >= difficulty

		// sets the proper result object
		result[target_obj.name] = `
<div><b>${target_name}</b></div>
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`

    	if (!test_result) {
			return
		}

		// setup status
		const status_name = 'Covered'
		const status_obj = {
			name: status_name,
			...Char.status_objs[status_name]
		}
		const old_turn = status_obj.turn
		status_obj.turn = (skip_duration) => {old_turn(target_obj, status_obj, skip_duration)}
		status_obj.turn(true)

		const old_end = status_obj.end
		status_obj.end = () => {old_end(target_obj, status_obj, tricker_obj)}

		target_obj.status.push(status_obj)
		status_turn.push(status_obj)

		// adds given points to all habilities 
		Object.keys(target_obj.stats_objs.current).forEach((key) => {
			target_obj.stats_objs.current[key] += status_obj.points
		})
	})

	return result
})

new Trick(new Action("Accurate Shot", "Guarantees that if the shooter misses an attack, she causes at least 50 points of damage to the enemy.", 16, ["Dextrity"], 1, [], ["Shooter"], false, false, 1), `
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
	const combat_name = CombatView.combat_selector.selectedOptions[0].innerText
	const combat_obj = Combat.objs[combat_name]
	const status_turn = tricker_obj.status_turns

	targets_names.forEach((target_name) => {
		const target_obj = Char.objs[target_name]
		const target_hability = target_obj.stats_objs.current[hability]

		const test_result_value = (tricker_hability + tricker_d20) 
		const test_result = test_result_value >= difficulty

		// sets the proper result object
		result[target_obj.name] = `
<div><b>${target_name}</b></div>
<div><b>TEST:</b> (${tricker_hability} + ${tricker_d20}) >= ${difficulty} -> <b>${test_result ? 'Passed' : 'Failed'}</b></div>
`

    	if (!test_result) {
			return
		}

		// setup status
		const status_name = 'Accurate Shot'
		const status_obj = {
			name: status_name,
			...Char.status_objs[status_name]
		}
		const old_turn = status_obj.turn
		status_obj.turn = (skip_duration) => {old_turn(target_obj, status_obj, skip_duration)}
		status_obj.turn(true)

		const old_end = status_obj.end
		status_obj.end = () => {old_end(target_obj, status_obj, tricker_obj)}

		target_obj.status.push(status_obj)
		status_turn.push(status_obj)
	})

	return result
})


