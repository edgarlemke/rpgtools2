class Stats {

	static habilities = ['strength', 'agility', 'dextrity', 'intelligence', 'charisma']

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

	static base_points = 0
	static points_per_level = 5

	static get_random (level) {
		const stats_obj = new Stats(0, 0, 0, 0, 0)

		const total_points = Stats.base_points + (Stats.points_per_level * level)
		for (let i = 0; i < total_points; i++) {
			const hability_index = dice(Stats.habilities.length) - 1
			const hability = Stats.habilities[hability_index]
			stats_obj[hability] += 1
		}

		return stats_obj
	}

}
