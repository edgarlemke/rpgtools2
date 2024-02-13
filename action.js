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

	constructor (name, description, difficulty, habilities, char_level, char_races, char_classes, for_all, requires_showing, targets_count) {
		this.name = name
		this.description = description
		this.difficulty = difficulty
		this.habilities = habilities
		this.char_level = char_level
		this.char_races = char_races
		this.char_classes = char_classes
		this.for_all = for_all
		this.requires_showing
		this.meta_obj = null
		this.targets_count = targets_count

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

new Action("Withdraw", "Allows a player to move out of the hot zone of combat. Enemies can still see them. Melee attacks are possible only if the enemy moves closer to the player.", 7, null, 0, [], [], true, false, 1)
new Action("Hide", "Allows a player to get out of combat temporarily. It remains hidden until an enemy uses \"Seek\" with success.", 10, null, 0, [], [], true, false, 1)
new Action("Seek", "Looks for a hidden enemy.", 10, null, 0, [], [], true, true, 1)
new Action("Insight", "Allows a player to get some important information from the world.", 7, null, 0, [], [], true, false, 1)
new Action("Consume item", "Consume an item over self or others.", 10, null, 0, [], [], true, true, 1)

//new Action("Fabricate Potion", "", 2, null, 0, [], ["Alchemist"], true, false, 1)
//new Action("Preach the Word", "", 2, null, 0, [], ["Messiah"], true, false, 1)
//new Action("Forge item", "", 2, null, 0, [], ["Engineer"], true, false, 1)
//new Action("Fabricate Powder", "", 2, null, 0, [], ["Engineer"], true, false, 1)
//new Action("Copy Action", "", 2, null, 0, [], ["Mirror"], true, false, 1)
//new Action("Copy Habilities", "", 2, null, 0, [], ["Mirror"], true, false, 1)


//new Content("actions", Action.get_html())
