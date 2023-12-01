class Char {
	static objs = {}

	static motivations = [
		"Chaos",
		"Family",
		"Friends",
		"Knowledge",
		"Nationalism",
		"Pleasure",
		"Revenge",
	]
	static virtues = [
		"Abstemious",
		"Gentle",
		"Insightful",
		"Clean",
		"Faithful",
		"Discrete",
		"Careful",
		"Attentive",
		"Altruistic",
		"Humble",
		"Dedicated",
		"Punctual",
		"Peaceful",
		"Clear",
		"Temperate",
		"Polite",
		"Erudite",
		"Forgiving",
		"Tolerant",
		"Funny",
		"Honest",
		"Beautiful",
		"Planner",
		"Athletic",
		"Competent",
		"Performatic"
	]
	static defects = [
		"Addicted",
		"Rude",
		"Naive",
		"Dirty",
		"Promiscuous",
		"Indiscreet",
		"Careless",
		"Inattentive",
		"Narcisist",
		"Egocentric",
		"Arrogant",
		"Lazy",
		"Delayed",
		"Violent",
		"Prolix",
		"Fanatic",
		"Cleptomaniac",
		"Perverted",
		"Uncultured",
		"Spiteful",
		"Gluttonous",
		"Intolerant",
		"Annoying",
		"Manipulator",
		"Ugly",
		"Inconsequential"
	]

	constructor (name, age, level, race, class_, primary_motivation, secondary_motivations, virtues, defects, inventory_obj, total_action_points) {
		Char.objs[name] = this

		this.name = name
		this.age = age
		this.level = level
		this.race = race
		this.class = class_
		this.primary_motivation = primary_motivation
		this.secondary_motivation = secondary_motivation
		this.virtues = virtues
		this.defects = defects
		this.inventory_obj = inventory_obj
		inventory_obj.char_obj = this

		this.action_points = {
			total : total_action_points,
			free : 0
		}
	}
}


class CharView {
	static get_html () {
		let html = `
<div class="char-container">

	<div>
		<label>Mode</label>
		<button id="char-mode-create-button" onclick="CharView.set_mode('create')">Create</button>
		<button id="char-mode-edit-button" onclick="CharView.set_mode('edit')">Edit</butto>
	</div>

	<div id="char-random-container">
		<button onclick="CharView.random()">Random</button>
	</div>

	<div id="char-selector-container">
		<select id="char-selector"></select>
	</div>

	<form onsubmit="CharView.create(event)">
	
	<div class="char-div">
		<table>
			<tbody>
				<tr>
					<td colspan="2">Name <input type="text" id="char-name"/></td>
				</tr>
				<tr>
					<td>Age</td>
					<td>Level</td>
				</tr>
				<tr>
					<td><input type="number" id="char-age" value="0" /></td>
					<td><input type="number" id="char-level" value="1" min="1"/></td>
				</tr>
				<tr>
					<td>Race</td>
					<td>Class</td>
				</tr>
				<tr>
					<td><select id="char-race" onchange="CharView.fill_race_stats()"></select></td>
					<td><select id="char-class" onchange="CharView.fill_class_stats()"></select></td>
				</tr>
				<tr>
					<td>Primary Motivation</td>
					<td>Secondary Motivations</td>
				</tr>
				<tr>
					<td><select id="char-primary-motivation"></select></td>
					<td><textarea id="char-secondary-motivations"></textarea></td>
				</tr>
				<tr>
					<td>Virtues</td>
					<td>Defects</td>
				</tr>
				<tr>
					<td>
						<select id="char-virtue-0"></select><br/>
						<select id="char-virtue-1"></select><br/>
						<select id="char-virtue-2"></select>
					</td>
					<td>
						<select id="char-defect-0"></select><br/>
						<select id="char-defect-1"></select><br/>
						<select id="char-defect-2"></select>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	
	<div class="char-div">
		<table id="char-stats">
			<thead>
				<tr>
					<th colspan="6">Stats</th>
				</tr>
				<tr>
					<th></th>
					<th>Race</th>
					<th>Class</th>
					<th>Player</th>
					<th>Items</th>
					<th>Total</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Strength</td>
					<td id="char-stat-race-strength"></td>
					<td id="char-stat-class-strength"></td>
					<td><input type="number" id="char-stat-player-strength" value="0" onchange="CharView.fill_total_stats()" /></td>
					<td id="char-stat-items-strength">></td>
					<td id="char-stat-total-strength"></td>
				</tr>
				<tr>
					<td>Agility</td>
					<td id="char-stat-race-agility"></td>
					<td id="char-stat-class-agility"></td>
					<td><input type="number" id="char-stat-player-agility" value="0" onchange="CharView.fill_total_stats()" /></td>
					<td id="char-stat-items-agility"></td>
					<td id="char-stat-total-agility"></td>
				</tr>
				<tr>
					<td>Dextrity</td>
					<td id="char-stat-race-dextrity"></td>
					<td id="char-stat-class-dextrity"></td>
					<td><input type="number" id="char-stat-player-dextrity" value="0" onchange="CharView.fill_total_stats()" /></td>
					<td id="char-stat-items-dextrity"></td>
					<td id="char-stat-total-dextrity"></td>
				</tr>
				<tr>
					<td>Intelligence</td>
					<td id="char-stat-race-intelligence"></td>
					<td id="char-stat-class-intelligence"></td>
					<td><input type="number" id="char-stat-player-intelligence" value="0" onchange="CharView.fill_total_stats()" /></td>
					<td id="char-stat-items-intelligence"></td>
					<td id="char-stat-total-intelligence"></td>
				</tr>
				<tr>
					<td>Charisma</td>
					<td id="char-stat-race-charisma"></td>
					<td id="char-stat-class-charisma"></td>
					<td><input type="number" id="char-stat-player-charisma" value="0" onchange="CharView.fill_total_stats()" /></td>
					<td id="char-stat-items-charisma"></td>
					<td id="char-stat-total-charisma"></td>
				</tr>
			</tbody>
		</table>
	</div>

	<div class="char-div" id="char-aptitudes-and-resistances-container">
		<table id="char-aptitudes-and-resistances">
			<thead>
				<tr>
					<th colspan="12">
						Aptitutes and Resistances
					</th>
				</tr>
				<tr>
					<th>Damage Type</th>
					<th>APT</th>
					<th>RES</th>

					<th>Damage Type</th>
					<th>APT</th>
					<th>RES</th>

					<th>Damage Type</th>
					<th>APT</th>
					<th>RES</th>

					<th>Damage Type</th>
					<th>APT</th>
					<th>RES</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Air</td>
					<td></td>
					<td></td>

					<td>Water</td>
					<td></td>
					<td></td>

					<td>Fire</td>
					<td></td>
					<td></td>

					<td>Earth</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>Cheese</td>
					<td></td>
					<td></td>

					<td>Psychic</td>
					<td></td>
					<td></td>

					<td>Darkness</td>
					<td></td>
					<td></td>

					<td>Poison</td>
					<td></td>
					<td></td>

				</tr>
				<tr>
					<td>Acid</td>
					<td></td>
					<td></td>

					<td>Electricity</td>
					<td></td>
					<td></td>

					<td>Perfuration</td>
					<td></td>
					<td></td>

					<td>Impact</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>Shooting</td>
					<td></td>
					<td></td>

					<td>Throwing</td>
					<td></td>
					<td></td>

					<td>Explosion</td>
					<td></td>
					<td></td>

							<td>Cutting</td>
					<td></td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
	
	<div class="char-div" id="char-inventory-container">
		<table id="char-inventory">
			<thead>
				<tr><th colspan="2">Inventory</th></tr>
				<tr><th>Coins</th><th></th></tr>
				<tr><th>Item</th><th>Quantity</th></tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>

	<div class="char-div">
		<b>Story</b>
		<textarea id="char-story"></textarea>
	</div>

	<div class="char-div">
		<b>Actions</b>

		<div>
			<b>Action Points:</b>
			<div style="display: inline;">Total: <div id="char-total-action-points"></div></div>
            <div style="display: inlien;">Free: <div id="char-free-action-points"></div></div>
		</div>
		<br/>
		<div>
			<input type="button" onclick="CharView.add_action_slot()" value="Add slot" />
		</div>

		<table id="char-actions-slots">
			<thead>
				<tr>
					<td>Action</td>
					<td>Level</td>
					<td></td>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>

	<div id="char-create-button-container">
		<button>Create</button>
	</div>

	</form>
</div>
`

		return html
	}

	static set_mode (mode) {
		switch (mode) {
			case "create":	
				CharView._set_mode_create()
				break

			case "edit":
				CharView._set_mode_edit()
				break

			default:
				throw "CharView: Invalid mode: " + mode
		}
	}

	static _set_mode_create() {
		CharView.random_container.classList.remove("hidden")
		CharView.create_button_container.classList.remove("hidden")
		CharView.selector_container.classList.add("hidden")
	}

	static _set_mode_edit() {
		CharView.random_container.classList.add("hidden")
		CharView.create_button_container.classList.add("hidden")
		CharView.selector_container.classList.remove("hidden")
	}

	static create (event) {
		event.preventDefault()

		const name = CharView.name_.value
		console.log("CharView.create(): name: " + name)

		const age = CharView.age.value
		console.log("CharView.create(): age: " + age)

		const level = CharView.level.value
		console.log("CharView.create(): level: " + level)

		const race = CharView.race.value
		console.log("CharView.create(): race: " + race)

		const class_ = CharView.class_.value
		console.log("CharView.create(): class_: " + class_)

		const primary_motivation = CharView.primary_motivation
		console.log("CharView.create(): primary_motivation: " + primary_motivation)

		const secondary_motivations = CharView.secondary_motivations
		console.log("CharView.create(): secondary_motivations: " + secondary_motivations)

		const virtue_0 = CharView.virtue_0.value
		const virtue_1 = CharView.virtue_1.value
		const virtue_2 = CharView.virtue_2.value
		console.log("CharView.create(): virtue_0: " + virtue_0)
		console.log("CharView.create(): virtue_1: " + virtue_1)
		console.log("CharView.create(): virtue_2: " + virtue_2)

		const defect_0 = CharView.defect_0.value
		const defect_1 = CharView.defect_1.value
		const defect_2 = CharView.defect_2.value
		console.log("CharView.create(): defect_0: " + defect_0)
		console.log("CharView.create(): defect_1: " + defect_1)
		console.log("CharView.create(): defect_2: " + defect_2)

		const story = CharView.story.value
		console.log("CharView.create(): story: " + story)

	}

	static _get_race_stats_obj () {
		const race_name = CharView.race.selectedOptions[0].innerText
		const race_obj = Race.objs[race_name]
		const stats_obj = race_obj.stats_obj

		return stats_obj
	}

	static fill_race_stats () {
		const stats_obj = CharView._get_race_stats_obj()

		CharView.stat_race_strength.innerText = stats_obj.strength
		CharView.stat_race_agility.innerText = stats_obj.agility
		CharView.stat_race_dextrity.innerText = stats_obj.dextrity
		CharView.stat_race_intelligence.innerText = stats_obj.intelligence
		CharView.stat_race_charisma.innerText = stats_obj.charisma

		CharView.fill_total_stats()
	}

	static _get_class_stats_obj () {
		const class_name = CharView.class_.selectedOptions[0].innerText
		const class_obj = Class.objs[class_name]
		const stats_obj = class_obj.stats_obj

		return stats_obj
	}

	static fill_class_stats () {
		const stats_obj = CharView._get_class_stats_obj()

		CharView.stat_class_strength.innerText = stats_obj.strength
		CharView.stat_class_agility.innerText = stats_obj.agility
		CharView.stat_class_dextrity.innerText = stats_obj.dextrity
		CharView.stat_class_intelligence.innerText = stats_obj.intelligence
		CharView.stat_class_charisma.innerText = stats_obj.charisma

		CharView.fill_total_stats()
	}

	static _get_player_stats_obj () {
		const strength = Number(CharView.stat_player_strength.value)
		const agility = Number(CharView.stat_player_agility.value)
		const dextrity = Number(CharView.stat_player_dextrity.value)
		const intelligence = Number(CharView.stat_player_intelligence.value)
		const charisma = Number(CharView.stat_player_charisma.value)

		return new Stats(strength, agility, dextrity, intelligence, charisma)
	}

	static _get_items_stats_obj () {
		return new Stats(0, 0, 0, 0, 0)
	}

	static fill_items_stats () {
		const stats_obj = CharView._get_items_stats_obj()

		CharView.stat_items_strength.innerText = stats_obj.strength
		CharView.stat_items_agility.innerText = stats_obj.agility
		CharView.stat_items_dextrity.innerText = stats_obj.dextrity
		CharView.stat_items_intelligence.innerText = stats_obj.intelligence
		CharView.stat_items_charisma.innerText = stats_obj.charisma
	}

	static fill_total_stats () {
		const race_stats_obj = CharView._get_race_stats_obj()
		const class_stats_obj = CharView._get_class_stats_obj()
		const player_stats_obj = CharView._get_player_stats_obj()
		const items_stats_obj = CharView._get_items_stats_obj()

		let total_stats =  new Stats(0, 0, 0, 0, 0)

		const objs = [race_stats_obj, class_stats_obj, player_stats_obj, items_stats_obj]

		objs.forEach((obj) => {
			Object.keys(total_stats).forEach((key) => {
				total_stats[key] += obj[key]
			})
		})

		CharView.stat_total_strength.innerHTML = total_stats.strength
		CharView.stat_total_agility.innerHTML = total_stats.agility
		CharView.stat_total_dextrity.innerHTML = total_stats.dextrity
		CharView.stat_total_intelligence.innerHTML = total_stats.intelligence
		CharView.stat_total_charisma.innerHTML = total_stats.charisma
	}

	static _get_char_actions () {
		return Object.keys(Action.objs).filter((key) => {
			const action_obj = Action.objs[key]
			// console.log("CharView._get_char_actions(): action_obj")
			// console.log(action_obj)

			const char_race = CharView.race.selectedOptions[0].innerText
			const char_class = CharView.class_.selectedOptions[0].innerText
			const char_level = Number(CharView.level.value)

			return ((!action_obj.for_all) && (action_obj.char_races.includes(char_race) || action_obj.char_classes.includes(char_class)) && action_obj.char_level <= char_level)
		})
	}

	static add_action_slot (event) {
		const tbody = CharView.actions_slots.tBodies[0]

		const tr = document.createElement("tr")

		const template = `<td><select class="char-action-selector"></select></td>
	<td><input type="number" class="char-action-level" value="0" min="0"/></td>
	<td><input type="button" value="Remove slot" onclick="CharView.remove_action_slot(this)" /></td>`

		tr.innerHTML = template
		tbody.appendChild(tr)

		const char_actions = CharView._get_char_actions()

		const selectors = document.getElementsByClassName("char-action-selector")
		for (var i = 0; i < selectors.length; i++) {
			const selector = selectors[i]
			fill_select(selector, char_actions)
		}
	}

	static remove_action_slot (button_element) {
		const tr = button_element.parentElement.parentElement
		const tbody = tr.parentElement
		tbody.removeChild(tr)
	}
}

new Content('chars', CharView.get_html())

CharView.mode_create_button = document.getElementById("char-mode-create-button")
CharView.random_container = document.getElementById("char-random-container")
CharView.create_button_container = document.getElementById("char-create-button-container")
CharView.selector_container = document.getElementById("char-selector-container")
CharView.name_ = document.getElementById("char-name")
CharView.age = document.getElementById("char-age")
CharView.level = document.getElementById("char-level")
CharView.race = document.getElementById("char-race")
CharView.class_ = document.getElementById("char-class")
CharView.primary_motivation = document.getElementById("char-primary-motivation")
CharView.secondary_motivations = document.getElementById("char-secondary-motivations")

CharView.virtue_0 = document.getElementById("char-virtue-0")
CharView.virtue_1 = document.getElementById("char-virtue-1")
CharView.virtue_2 = document.getElementById("char-virtue-2")

CharView.defect_0 = document.getElementById("char-defect-0")
CharView.defect_1 = document.getElementById("char-defect-1")
CharView.defect_2 = document.getElementById("char-defect-2")

CharView.stat_race_strength = document.getElementById("char-stat-race-strength")
CharView.stat_race_agility = document.getElementById("char-stat-race-agility")
CharView.stat_race_dextrity = document.getElementById("char-stat-race-dextrity")
CharView.stat_race_intelligence = document.getElementById("char-stat-race-intelligence")
CharView.stat_race_charisma = document.getElementById("char-stat-race-charisma")

CharView.stat_class_strength = document.getElementById("char-stat-class-strength")
CharView.stat_class_agility = document.getElementById("char-stat-class-agility")
CharView.stat_class_dextrity = document.getElementById("char-stat-class-dextrity")
CharView.stat_class_intelligence = document.getElementById("char-stat-class-intelligence")
CharView.stat_class_charisma = document.getElementById("char-stat-class-charisma")

CharView.stat_player_strength = document.getElementById("char-stat-player-strength")
CharView.stat_player_agility = document.getElementById("char-stat-player-agility")
CharView.stat_player_dextrity = document.getElementById("char-stat-player-dextrity")
CharView.stat_player_intelligence = document.getElementById("char-stat-player-intelligence")
CharView.stat_player_charisma = document.getElementById("char-stat-player-charisma")

CharView.stat_items_strength = document.getElementById("char-stat-items-strength")
CharView.stat_items_agility = document.getElementById("char-stat-items-agility")
CharView.stat_items_dextrity = document.getElementById("char-stat-items-dextrity")
CharView.stat_items_intelligence = document.getElementById("char-stat-items-intelligence")
CharView.stat_items_charisma = document.getElementById("char-stat-items-charisma")

CharView.stat_total_strength = document.getElementById("char-stat-total-strength")
CharView.stat_total_agility = document.getElementById("char-stat-total-agility")
CharView.stat_total_dextrity = document.getElementById("char-stat-total-dextrity")
CharView.stat_total_intelligence = document.getElementById("char-stat-total-intelligence")
CharView.stat_total_charisma = document.getElementById("char-stat-total-charisma")

CharView.story = document.getElementById("char-story")

CharView.actions_slots = document.getElementById("char-actions-slots")

CharView.fill_items_stats()

CharView.mode_create_button.click()
