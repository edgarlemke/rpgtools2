class Stats {

	constructor (strength, agility, dextrity, intelligence, charisma) {
		this.strength = strength
		this.agility = agility
		this.dextrity = dextrity
		this.intelligence = intelligence
		this.charisma = charisma
	}

	get_html () {
		let html = `<table class="stats">
	<thead>
		<tr>
			<th colspan="2">Stats</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Strength</td>
			<td>${this.strength}</td>
		</tr>
		<tr>
			<td>Agility</td>
			<td>${this.agility}</td>
		</tr>
		<tr>
			<td>Dextrity</td>
			<td>${this.dextrity}</td>
		</tr>
		<tr>
			<td>Intelligence</td>
			<td>${this.intelligence}</td>
		</tr>
		<tr>
			<td>Charisma</td>
			<td>${this.charisma}</td>
		</tr>
	</tbody>
</table>`

		return html
	}

}
