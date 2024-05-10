class Action {
	static objs = {}

	static get_char_available_actions () {
	}

	static get_html () {
		let html = `<div>
`
		html += `<h2>Attacks</h2>`
		html += Attack.get_html()

		// html += `<h2>Advantage Attacks</h2>`
		// html += AdvantageAttack.get_html()

		html += `<h2>Tricks</h2>`
		html += Trick.get_html()

		html += `</div>`

		return html
	}

	constructor (name, description, difficulty, habilities, char_level, char_races, char_classes, for_all, requires_showing, targets_count, combat_modal_content, combat_modal_onload, view_functions) {
		this.name = name
		this.description = description
		this.difficulty = difficulty - 3
		this.habilities = habilities
		this.char_level = char_level
		this.char_races = char_races
		this.char_classes = char_classes
		this.for_all = for_all
		this.requires_showing
		this.meta_obj = null
		this.targets_count = targets_count
		this.combat_modal_content = combat_modal_content
		this.combat_modal_onload = combat_modal_onload
		this.view_functions = view_functions

		Action.objs[name] = this
	}

	get_html () {
		let habilities_html = `<b>Habilities:</b> ` + (this.habilities == null ? "None" : this.habilities.join(', '))

		let html = `<div class="action-container">
<div class="action-name">${this.name}</div>
<div class="action-description">${this.description}</div>
<div class="action-difficulty"><b>Difficulty:</b> ${this.difficulty}</div>
<div class="action-habilities">${habilities_html}</div>
<div class="action-char-level"><b>Char level:</b> ${this.char_level}</div>
</div>
`
		return html
	}

}

//new Action("Withdraw", "Allows a player to move out of the hot zone of combat. Enemies can still see them. Melee attacks aren't possible even if an enemy moves closer after this move for the current/next turn. Only ranger attacks are possible.", 7, null, 0, [], [], true, false, 1)
//new Action("Hide", "Allows a player to avoid being perceived by an enemy. It remains hidden until an enemy uses \"Seek\" with success or the player does some actions that *requires showing*.", 10, null, 0, [], [], true, false, 1)
//new Action("Seek", "Looks for a hidden enemy.", 10, null, 0, [], [], true, true, 1)
//new Action("Insight", "Allows a player to get some important information from the world.", 7, null, 0, [], [], true, false, 1)

new Action("Consume drug", "Consume drug.", 7, null, 0, [], [], true, false, 1, `
<div>
	<div>
		<label>Drug</label>
	</div>
	<div>
		<select id="consume-drug-select"></select>
	</div>
</div>
<div><button onclick="Action.objs['Consume drug'].view_functions.act()">Consume</button></div>
`, () => {
	Action.objs['Consume drug'].view_functions.update_select()
}, {
	act () {
		const consume_drug_select = document.getElementById('consume-drug-select')
		const item_name = consume_drug_select.selectedOptions[0].innerText

		const combat_name = CombatView.creation_name.value
		const combat_obj = Combat.objs[combat_name]
		const char_name = combat_obj.sorted_order[combat_obj.turn][0]
		const char_obj = Char.objs[char_name]

		const inventory_obj = char_obj.inventory_obj
		const item_index = inventory_obj.items.indexOf(item_name)
		const item_obj = Item.objs[item_name]

		item_obj.meta_obj.act(char_obj)
		inventory_obj.drop(item_index)

		Action.objs['Consume drug'].view_functions.update_select()
		CombatView.update_status()

		new Modal('Drug consumed!', `${item_name} was consumed!`)
	},
	update_select () {
		const consume_drug_select = document.getElementById('consume-drug-select')

		remove_children(consume_drug_select)

		// get consumable drugs
		const combat_name = CombatView.creation_name.value
		const combat_obj = Combat.objs[combat_name]
		const char_name = combat_obj.sorted_order[combat_obj.turn][0]
		const char_obj = Char.objs[char_name]
	
		char_obj.inventory_obj.items.forEach((item_name) => {
			if (!Object.keys(Drug.objs).includes(item_name)) {
				return
			}
	
			// add them to select
			const option = document.createElement('option')
			option.innerText = item_name
			consume_drug_select.appendChild(option)
		})
	}
})

// some cause damage, some don't

// Throw acid bottle
// Throw poison bottle
// Throw sedative

// Throw potion
// Throw medicine
// Throw stimulant
// Throw antidote

//new Action("Fabricate Potion", "", 2, null, 0, [], ["Alchemist"], true, false, 1)
//new Action("Preach the Word", "", 2, null, 0, [], ["Messiah"], true, false, 1)
//new Action("Forge item", "", 2, null, 0, [], ["Engineer"], true, false, 1)
//new Action("Fabricate Powder", "", 2, null, 0, [], ["Engineer"], true, false, 1)
//new Action("Copy Action", "", 2, null, 0, [], ["Mirror"], true, false, 1)
//new Action("Copy Habilities", "", 2, null, 0, [], ["Mirror"], true, false, 1)
//new Content("actions", Action.get_html())
