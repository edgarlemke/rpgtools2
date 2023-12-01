class Attack {
	static objs = []

	static damage_types = ["Air", "Water", "Fire", "Earth", "Illusion", "Darkness", "Perfuration", "Cutting", "Shooting", "Explosion", "Cheese", "Electricity", "Acid", "Poison"]

	static get_html () {
		let html = `<div class="actions-container">
`

		Object.keys(Attack.objs).forEach((key) => {
			html += Attack.objs[key].get_html()
		})

		html += `</div>`

		return html
	}

	constructor (action_obj) {
		this.name = action_obj.name
		this.action_obj = action_obj

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
}


new Attack(new Action("Punch", "Punches someone.", 7, ["Strength", "Agility", "Dextrity"], 0, [], [], true, true))
new Attack(new Action("Kick", "Kicks someone.", 9, ["Strength", "Agility", "Dextrity"], 0, [], [], true, true))
new Attack(new Action("Kneestrike", "Strikes someone with the knees.", 11, ["Strength", "Agility", "Dextrity"], 0, [], [], true, true))
new Attack(new Action("Weak spot strike", "Strikes someone in a weak spot.", 13, ["Strength", "Agility", "Dextrity"], 0, [], [], true, true))
new Attack(new Action("Armed attack", "Attacks someone using a weapon.", 7, ["Strength", "Agility", "Dextrity", "Intelligence", "Charisma"], 0, [], [], true, true))

new Attack(new Action("Onslaught", "The attacker runs furiously and simply removes an enemy from her way with a strike of her weapon.", 11, ["Strength"], 0, [], ["Fighter"], false, true))
new Attack(new Action("Bloody Jump", "The attacker jumps over an enemy and with a dimensional advantage strikes the enemy using the weight of her weapon.", 13, ["Strength", "Dextrity"], 0, [], ["Fighter", "Swordsman"], false, true))

new Attack(new Action("Shock blade", "", 9, ["Dextrity"], 0, [], ["Swordsman"], false, false))

new Attack(new Action("Astral discharge", "", 11, ["Intelligence"], 0, [], ["Witch"], false, true))

new Attack(new Action("Elemental sphere", "", 9, ["Intelligence"], 0, [], ["Alchemist"], false, true))
new Attack(new Action("Elemental spikes", "", 11, ["Intelligence"], 0, [], ["Alchemist"], false, true))
new Attack(new Action("Elemental spiral", "", 13, ["Intelligence"], 0, [], ["Alchemist"], false, true))
new Attack(new Action("Elemental wall", "", 15, ["Intelligence"], 0, [], ["Alchemist"], false, true))

new Attack(new Action("Feral outbreak", "", 11, ["Strength"], 0, [], ["Chimera"], false, true))

new Attack(new Action("Infernal hand", "", 13, ["Intelligence"], 0, [], ["Demonologist"], false, true))

new Attack(new Action("Infinite Love of the Divinity", "", 13, ["Intelligence"], 0, [], ["Messiah"], false, true))
