class Combat {
	static objs = {}

	constructor (name) {
		Combat.objs[name] = this
		this.name = name
	}
}


class CombatView {
	static get_html () {
		let html = `
<div class="combat-container">
	<div>
		<h2>Teams</h2>

		<div>
			<label for="combat-team-name">Team name</label>
			<input type="text" id="combat-team-name" />
			<button>Add Team</button>

			<label for="combat-team">Team</label>
			<select id="combat-team"></select>

			<button>Delete Team</button>
		</div>

		<div>
			<label for="combat-team-member"></label>
			<select id="combat-team-member"></select>
			<button>Add member to Team</button>

			<div>
				<div>
					<div>Member</div>
					<div></div>
				</div>
			</div>

		</div>
	</div>
	<div>
		<h2>Combats</h2>

		<div class="combat-creation-container">
			<label for="combat-name">Combat name:</label>
			<input type="text" id="combat-name" />

			<select></select>
			<button>Add team</button>

			<button>Create combat</button>

			<div>
				<div>
					<div>Char</div>
					<div>Initiative</div>
				</div>
			</div>
		</div>

		<div class="combat-turns-container">
			<div>
				<div>Char</div>
				<div>State</div>
				<div>Actions</div>
			</div>
		</div>

	</div>
</div>
`
		return html
	}
}

new Content('combats', CombatView.get_html())
