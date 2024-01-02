class Action {
	static objs = {}

	static get_char_available_actions () {
	}

	static get_html () {
		let html = `<div>
`
		html += `<h2>Attacks</h2>`
		html += Attack.get_html()

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

new Action("Hide", "Allows a player to get out of combat temporarily. It remains hidden until an enemy uses \"Seek\" with success.", 10, null, 0, [], [], true, false, 1)
new Action("Seek", "Looks for a hidden enemy.", 10, null, 0, [], [], true, true, 1)


//new Content("actions", Action.get_html())
