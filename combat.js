class Combat {
	static objs = {}

	constructor (name, order_obj) {
		Combat.objs[name] = this
		this.name = name

		const order_obj_copy = {...order_obj}

		// iter over obj_copy to get each char agility and add it to the given values
		Object.keys(order_obj_copy).forEach((char_name) => {
			const char_obj = Char.objs[char_name]
			order_obj_copy[char_name] += char_obj.stats_objs.current.agility
		})
		
		const ties = {}
		const tmp_sorted_order = Object.keys(order_obj_copy).sort((a, b) => {
			const diff = order_obj_copy[a] - order_obj_copy[b]

			if (diff == 0) {
				const tie_value = order_obj_copy[a]
				if (!Object.keys(ties).includes(tie_value)) {
					ties[ tie_value ] = []
				}

				if (!ties[ tie_value ].includes(a)) {
					ties[ tie_value ].push(a)
				}
				if (!ties[ tie_value ].includes(b)) {
					ties[ tie_value ].push(b)
				}
			}
		})

		if (Object.keys(ties).length > 0) {
			let ties_msg = ''

			Object.keys(ties).forEach((tie_value) => {
				const tie_array = ties[tie_value]
				ties_msg += `${tie_array.length} tied chars at combat order ${tie_value}: ${tie_array.join(', ')}`
			})

			new Modal('Tie at combat order', ties_msg)
			return
		}

		// sorted_order is an array to keep combat order sorting
		const sorted_order = []
		tmp_sorted_order.forEach((char_name) => {
			sorted_order.push([char_name, order_obj[char_name]])
		})
		
		this.sorted_order = sorted_order

		this.turn = 0
	}

	skip () {
		this.turn = (this.turn + 1) % this.sorted_order.length
	}
}


class Team {
	static objs = {}

	constructor (name, members) {
		Team.objs[name] = this
		this.name = name
		this.members = members
	}
}


class CombatView {

	static selected_combat = null

	static get_html () {
		let html = `
<div class="combat-container">
	<div>
		<h2>Teams</h2>

		<div>
			<div>
				<label for="combat-team-name">Team name</label>
				<input type="text" id="combat-team-name" />
			</div>
			<div style="display: none">
				<label for="combat-team">Team</label>
				<select id="combat-teams-team-selector"></select>
				<button>Delete Team</button>
			</div>

			<table id="combat-team-members">
				<thead>
					<tr>
						<th>Member</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>

			<div>
				<label for="combat-team-member">Member</label>
				<select id="combat-team-member"></select>
				<button onclick="CombatView.add_team_member()">Add member to Team</button>
			</div>

			<button onclick="CombatView.create_team()">Create Team</button>
		</div>
	</div>

	<div>
		<h2>Combats</h2>

		<div class="combat-creation-container">
			<div>
				<label for="combat-creation-name">Combat name:</label>
				<input type="text" id="combat-creation-name" />
			</div>

			<table id="combat-creation-team-members">
				<thead>
					<tr>
						<th>Char</th>
						<th>Initiative</th>
						<th></th>
				</thead>
				<tbody>
				</tbody>
			</table>

			<div>
				<select id="combat-teams-selector"></select>
				<button onclick="CombatView.add_team()">Add team to Combat</button>
			</div>

			<button onclick="CombatView.create_combat()">Create Combat</button>
		</div>

		<div class="combat-turns-container">
			<div>
				<select id="combat-combat-selector" onchange="CombatView.select_combat()"></select>
			</div>
			<table id="combat-turns">
				<thead>
					<tr>
						<th>Char</th>
						<th>Order</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</div>

</div>
`
		return html
	}

	static add_team_member () {
		const char_name = CombatView.team_member.selectedOptions[0].innerText

		const tbody = CombatView.team_members.tBodies[0]
		//console.log(tbody)

		const tr = document.createElement("tr")
		tr.innerHTML = `<td>${char_name}</td>
<td><button onclick="CombatView.remove_team_member(this)">Remove</button></td>`
		tr.classList.add("combat-team-member-row")

		tbody.appendChild(tr)
	}

	static remove_team_member (button) {
		const tr = button.parentElement.parentElement
		const tbody = tr.parentElement
		tbody.removeChild(tr)
	}

	static create_team () {
		const team_name = CombatView.team_name.value

		const team_members = []

		const member_rows = document.getElementsByClassName('combat-team-member-row')
		for (let i = 0; i < member_rows.length; i++) {
			const member_row = member_rows[i]
			const member_name = member_row.children[0].innerText
			team_members.push(member_name)
		}

		//console.log(team_members)

		new Team(team_name, team_members)

		fill_select(CombatView.teams_team_selector, Object.keys(Team.objs))
		fill_select(CombatView.teams_selector, Object.keys(Team.objs))
	}

	static add_team () {
		const team = CombatView.teams_selector.selectedOptions[0].innerText

		const team_obj = Team.objs[team]

		for (let i = 0; i < team_obj.members.length; i++) {
			const team_member = team_obj.members[i]

			const tbody = CombatView.creation_team_members.tBodies[0]

			const tr = document.createElement('tr')
			tr.innerHTML = `<td>${team_member}</td>
<td><input type="number" min="0" value="0" /></td>
<td><button onclick="CombatView.remove_team_member(this)">Remove</button></td>`

			tbody.appendChild(tr)
		}
	}

	static create_combat () {
		const combat_name = CombatView.creation_name.value

		const order_obj = {}

		const tbody = CombatView.creation_team_members.tBodies[0]
		for (let i = 0; i < tbody.children.length; i++) {
			const row = tbody.children[i]
			const team_member = row.children[0].innerText
			const team_member_initiative = Number( row.children[1].children[0].value )
			order_obj[team_member] = team_member_initiative
		}

		new Combat(combat_name, order_obj)

		fill_select(CombatView.combat_selector, Object.keys(Combat.objs))
		CombatView.combat_selector.onchange()
	}

	static select_combat () {
		const combat_name = CombatView.combat_selector.selectedOptions[0].innerText
		CombatView.selected_combat = combat_name

		const combat_obj = Combat.objs[combat_name]

		combat_obj.sorted_order.forEach((char_array) => {
			const char_name = char_array[0]
			const char_initiative = char_array[1]

			const total_order = Char.objs[char_name].stats_objs.current.agility + char_initiative
			const order_text = `${Char.objs[char_name].stats_objs.current.agility}+${char_initiative} = ${total_order}`

			const tr = document.createElement('tr')
			tr.classList.add('combat-turn-char-row')
			tr.setAttribute('data-char-name', char_name)
			tr.innerHTML = `<td>${char_name}</td>
<td>${order_text}</td>
<td></td>
<td></td>`

			const tbody = CombatView.combat_turns.tBodies[0]
			tbody.appendChild(tr)
		})

		CombatView.update_status()
		CombatView.update_actions()
	}

	static update_status () {
		const rows = document.getElementsByClassName('combat-turn-char-row')

		for (let i = 0; i < rows.length; i++) {
			const row = rows[i]
			const char_name = row.getAttribute('data-char-name')
			const char_obj = Char.objs[char_name]
			const status_ = []

			if (char_obj.health.current > 0) {
				status_.push(`Alive (${char_obj.health.current})`)
			}
			else {
				status_.push(`Dead`)
			}

			const status_text = status_.join(', ')
			row.children[2].innerText = status_text
		}
	}

	static update_actions () {
		const rows = document.getElementsByClassName('combat-turn-char-row')
		const combat_obj = Combat.objs[CombatView.selected_combat]

		//console.log(rows)

		for (let i = 0; i < rows.length; i++) {
			const row = rows[i]
			const char_name = row.getAttribute('data-char-name')
			const char_obj = Char.objs[char_name]

			const actions_levels = char_obj.actions_obj.actions_levels
			const cell = row.children[3]
			remove_children(cell)

			// skip all rows which doesn't match the turn char row
			if (i != combat_obj.turn) {
				continue
			}

			// add char actions
			Object.keys(actions_levels).forEach((key) => {
				const template = document.createElement('template')
				template.innerHTML = `<button onclick="CombatView.open_action_modal('${key}')">${key}</button>`
				cell.appendChild(...template.content.children)
			})

			// add "for all" actions
			Object.keys(Action.objs).forEach((action_name) => {
				const action_obj = Action.objs[action_name]
				if (!action_obj.for_all) {
					return
				}

				const template = document.createElement('template')
				template.innerHTML = `<button onclick="CombatView.open_action_modal('${action_name}')">${action_name}</button>`
				cell.appendChild(...template.content.children)
			})

			const skip_template = document.createElement('template')
			skip_template.innerHTML = `<button onclick="CombatView.skip()">Skip</button>`
			cell.appendChild(...skip_template.content.children)
		}
	}

	static open_action_modal (action_name) {
		const modal_content = CombatView.get_action_modal_content(action_name)
		new Modal(action_name, modal_content[0], modal_content[1])
	}

	static get_action_modal_content (action_name) {
		const action_obj = Action.objs[action_name]
		const action_class = action_obj.meta_obj ? action_obj.meta_obj.class : null

		switch (action_class) {
			case 'Attack':
				return CombatView.get_attack_modal_content(action_name)
				break

			default:
				throw 'Invalid action_class: ' + action_class
				break
		}
	}

	static get_attack_modal_content (action_name) {
		const template = `
<section class="modal_section">
	<h4>Test</h4>
	<div class="modal_line">
		<div class="modal_first_cell">Hability</div>
		<div><select id="attack-hability"></select></div>
	</div>

	<div class="modal_line">
		<div class="modal_first_cell">Damage type</div>
		<div><select id="attack-damage-type"></select></div>
	</div>

	<div class="modal_line">
		<div class="modal_first_cell">D20</div>
		<div><input id="attack-d20" type="number" min="0" max="20" value="0" /></div>
	</div>

	<div class="modal_line">
		<div class="modal_first_cell">Targets</div>
		<div><select id="attack-targets" onchange="CombatView.handle_attack_targets_change()" multiple></select></div>
	</div>

	<div id="combat-attack-targets-d20s-container">
	</div>

	<button onclick="CombatView.attack('${action_name}')" style="margin: 20px 0 auto;">Attack!</button>
</section>
`

		const onload = () => {
			const attack_hability = document.getElementById('attack-hability')
			const attack_damage_type = document.getElementById('attack-damage-type')
			const attack_targets = document.getElementById('attack-targets')
			const attack_d20 = document.getElementById('attack-d20')
			const attack_enemies_d20 = document.getElementsByClassName('attack-enemy-d20')

			const action_obj = Action.objs[action_name]

			action_obj.habilities.forEach((hability) => {
				const option = document.createElement('option')
				option.innerText = hability
				attack_hability.appendChild(option)
			})

			fill_select(attack_damage_type, action_obj.meta_obj.damage_types)

			const combat_obj = Combat.objs[CombatView.selected_combat]
			const targets = combat_obj.sorted_order.forEach((order_array) => {
				if (order_array[0] == combat_obj.sorted_order[combat_obj.turn][0]) {
					return
				}

				const option = document.createElement('option')
				option.innerText = order_array[0]
				attack_targets.appendChild(option)
			})
		}

		return [template, onload]
	}

	static skip () {
		const combat_obj = Combat.objs[CombatView.selected_combat]
		combat_obj.skip()
		CombatView.update_actions()
	}

	static attack (action_name) {
		const attack_hability = document.getElementById('attack-hability')
		const attack_damage_type = document.getElementById('attack-damage-type')
		const attack_targets = document.getElementById('attack-targets')
		const attack_d20 = document.getElementById('attack-d20')
		const attack_enemies_d20 = document.getElementsByClassName('attack-enemy-d20')

		const combat_obj = Combat.objs[CombatView.selected_combat]
		const action_obj = Action.objs[action_name]

		const attacker_name = combat_obj.sorted_order[combat_obj.turn][0]
		const hability = attack_hability.selectedOptions[0].innerText.toLowerCase()
		const targets_names = []
		for (let i = 0; i < attack_targets.selectedOptions.length; i++) {
			const selectedOption = attack_targets.selectedOptions[i]
			targets_names.push(selectedOption.innerText)
		}
		const attacker_d20 = Number(attack_d20.value)
		const targets_d20s = []
		for (let i = 0; i < attack_enemies_d20.length; i++) {
			const enemy_d20 = attack_enemies_d20[i]
			targets_d20s.push(Number(enemy_d20.value))
		}

		const damage_type = attack_damage_type.selectedOptions[0].innerText

		const result = action_obj.meta_obj.act(attacker_name, hability, targets_names, attacker_d20, targets_d20s, damage_type)
		console.log(result)


		//
		const result_modal_content = `
<section id="combat-attack-results" class="modal_section">
	<h4>Results</h4>
</section>
<hr style="border: solid 1px black;" />
<section class="modal_section">
	<h4>Legend</h4>

	<div><b>TEST:</b> ((AH + AA + D20) - (TH + TR + TD + TD20)) >= DIF</div>
	<div><b>DAMAGE:</b> (((AH + AA + D20 + DIF + WD) - (TR + TD)) / TC) * MUL</div>
	<div><small>When damage isn't integer, it's rounded down.</small></div>

	<ul>
		<li>AH - Attacker Hability</li>
		<li>AP - Attacker Aptitude in Damage Type</li>
		<li>D20 - Attacker D20</li>
		<li>WD - Weapon Damage</li>
		<li>TH - Target Hability</li>
		<li>TR - Target Resistance against Damage Type</li>
		<li>TD - Target Defenses</li>
		<li>TC - Target Count</li>
		<li>TD20 - Target D20</li>
		<li>DIF - Action Difficulty</li>
		<li>MUL - Multiplier - 3 if D20 == 20, else 1</li>
	</ul>
</section>
`
		new Modal(`${action_name} result`, result_modal_content)

		let some_passed = false

		const combat_attack_results = document.getElementById('combat-attack-results')
		Object.keys(result).forEach((target_name) => {
			const r = result[target_name]
			const template = document.createElement('template')
			template.innerHTML = `
<div class="combat-attack-target-result">
	<div><b>${target_name}</b></div>
	<div><b>TEST:</b> ((${r.AH} + ${r.AA} + ${r.D20}) - (${r.TH} + ${r.TR} + ${r.TD} + ${r.TD20})) >= ${r.DIF} = <b>${r.test_result ? 'Passed' : 'Failed'}</b></div>
	${r.test_result ? `<div><b>DAMAGE:</b> (((${r.AH} + ${r.AA} + ${r.D20} + ${r.DIF} + ${r.WD}) - (${r.TR} + ${r.TD})) / ${r.TC}) * ${r.D20 == 20 ? 3 : 1} = <b>${r.damage}</b></div>` : ''}
	${r.test_result ? `<div><button onclick="CombatView.add_sub_aptitude_resistance('${target_name}', 'resistances', '${damage_type}', 'add', this)">Add Resistance point</button></div>` : ''}
</div>`

			combat_attack_results.appendChild(...template.content.children)

			if (r.test_result) {
				some_passed = true
			}
		})

		if (some_passed) {
			const template = document.createElement('template')
			template.innerHTML = `
<button onclick="CombatView.add_sub_aptitude_resistance('${attacker_name}', 'aptitudes', '${damage_type}', 'add', this)">Add Aptitude point</button>
`
			combat_attack_results.appendChild(...template.content.children)
		}

		CombatView.update_status()
	}

	static handle_attack_targets_change () {
		console.log('handle_attack_targets_change')

		const attack_targets = document.getElementById('attack-targets')
		console.log(attack_targets)

		const container = document.getElementById('combat-attack-targets-d20s-container')
		remove_children(container)

		const targets = []
		for (let i = 0; i < attack_targets.selectedOptions.length; i++) {
			const target_name = attack_targets.selectedOptions[i].innerText

			const template = document.createElement('template')
			template.innerHTML = `
<div class="modal_line">
	<div class="modal_first_cell">${target_name} D20</div>
	<div><input class="attack-enemy-d20" type="number" min="0" max="20" value="0" /></div>
</div>
`
			container.appendChild(...template.content.children)
		}
	}

	static add_sub_aptitude_resistance (char_name, key, damage_type, action, button) {
		const char_obj = Char.objs[char_name]

		let innerText = null
		let onclick = null

		if (action == 'add') {
			char_obj[key][damage_type] += 1

			if (key == 'aptitudes') {
				innerText = 'Sub Aptitude point'
			}
			else if (key == 'resistances') {
				innerText = 'Sub Resistance point'
			}

			onclick = () => {CombatView.add_sub_aptitude_resistance(char_name, key, damage_type, 'sub', button)}
		}
		else if (action == 'sub') {
			char_obj[key][damage_type] -= 1

			if (key == 'aptitudes') {
				innerText = 'Add Aptitude point'
			}
			else if (key == 'resistances') {
				innerText = 'Add Resistance point'
			}

			onclick = () => {CombatView.add_sub_aptitude_resistance(char_name, key, damage_type, 'add', button)}
		}

		button.innerText = innerText
		button.onclick = onclick
	}
}

new Content('combats', CombatView.get_html())

CombatView.team_name = document.getElementById("combat-team-name")
CombatView.team_member = document.getElementById("combat-team-member")
CombatView.team_members = document.getElementById("combat-team-members")
CombatView.teams_team_selector = document.getElementById("combat-teams-team-selector")
CombatView.teams_selector = document.getElementById("combat-teams-selector")
CombatView.creation_name = document.getElementById("combat-creation-name")
CombatView.creation_team_members = document.getElementById("combat-creation-team-members")
CombatView.combat_turns_container = document.getElementById("combat-turns-container")
CombatView.combat_turns = document.getElementById("combat-turns")
CombatView.combat_selector = document.getElementById("combat-combat-selector")
