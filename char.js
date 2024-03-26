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

	static toll_obj = {
		stats: {strength: 0, agility: 0, dextrity: 0, intelligence: 0, charisma: 0},
		health: 0
	}

	static status_objs = {
		Alive    : {},
		Dead     : {},
		Hidden   : {},
		Sleeping : {},
		Injured  : {},
		'Severely Injured' : {},
		Stimulated : {},
		Safeguarded : {},

		Imobilized : {turns: 1, duration: 1,
			turn: (target_obj, status_obj) => {
				status_obj.duration -= 1
			},
			end: (target_obj, status_obj) => {
				// clean Imobilized status object
				target_obj.status = target_obj.status.filter((status_obj_) => {
					return status_obj !== status_obj_
				})
			},
			toll: {...Char.toll_obj}
		},
        'Unstoppable Blade' : {turns: 1, duration: 1,
			turn: (target_obj, status_obj) => {
				status_obj.duration -= 1
			},
			end: (target_obj, status_obj) => {
				// clean Unstoppable Blade status object
				target_obj.status = target_obj.status.filter((status_obj_) => {
					return status_obj !== status_obj_
				})
			},
			toll: {...Char.toll_obj}
		},
		Covered : {turns: 1, duration: 1,
			turn: (target_obj, status_obj) => {
				status_obj.duration -= 1
			},
			end: (target_obj, status_obj) => {
				// clean Covered status object
				target_obj.status = target_obj.status.filter((status_obj_) => {
					return status_obj !== status_obj_
				})
			},
			toll: {...Char.toll_obj}
		},
		'Accurate Shot' : {turns: 1, duration: 1,
			turn: (target_obj, status_obj) => {
				status_obj.duration -= 1
			},
			end: (target_obj, status_obj) => {
				// clean Covered status object
				target_obj.status = target_obj.status.filter((status_obj_) => {
					return status_obj !== status_obj_
				})
			},
			toll: {...Char.toll_obj}
		},

		Pacified : {char_name: null},
		Hypnotized : {char_name: null, turns: 2, duration: 2,
			turn: (target_obj, status_obj) => {
				status_obj.duration -= 1
			},
			end: (target_obj, status_obj) => {
				// clean Hypnotized status object
				target_obj.status = target_obj.status.filter((status_obj_) => {
					return status_obj !== status_obj_
				})
			},
			toll: {...Char.toll_obj}
		},
		Possessed : {turns: 2, duration: 2,
			turn: (target_obj, status_obj) => {
				status_obj.duration -= 1
			},
			end: (target_obj, status_obj) => {
				//console.log('end', target_obj, status_obj)
				// clean Possessed status object
				target_obj.status = target_obj.status.filter((status_obj_) => {
					//console.log('status_obj', status_obj)
					//console.log('status_obj_', status_obj_)

					return status_obj !== status_obj_
				})
			},
			toll: {...Char.toll_obj}
		},

		Frenesi  : {turns: 3, duration: 3, points: 3,
			turn: (target_obj, status_obj) => {
				status_obj.duration -= 1
			},
			end: (target_obj, status_obj) => {
				// clean Frenesi status object
				target_obj.status = target_obj.status.filter((status_obj_) => {
					return status_obj !== status_obj_
				})

				// subtract given points from all habilities
				Object.keys(target_obj.stats_objs.current).forEach((key) => {
					target_obj.stats_objs.current[key] -= status_obj.points
				})
			},
			toll: {...Char.toll_obj}
		},
		Blessed  : {turns: 3, duration: 3, points: 3,
			turn: (target_obj, status_obj) => {
				status_obj.duration -= 1
			},
			end: (target_obj, status_obj) => {
				// clean Blessed status object
				target_obj.status = target_obj.status.filter((status_obj_) => {
					return status_obj !== status_obj_
				})

				// subtract given points from all habilities
				Object.keys(target_obj.stats_objs.current).forEach((key) => {
					target_obj.stats_objs.current[key] -= status_obj.points
				})
			},
			toll: {...Char.toll_obj}
		},
		Cursed   : {turns: 3, duration: 3, points: 3,
			turn: (target_obj, status_obj) => {
				status_obj.duration -= 1
			},
			end: (target_obj, status_obj) => {
				// clean Cursed status object
				target_obj.status = target_obj.status.filter((status_obj_) => {
					return status_obj !== status_obj_
				})

				// add back taken points from all habilities
				Object.keys(target_obj.stats_objs.current).forEach((key) => {
					target_obj.stats_objs.current[key] += status_obj.points
				})
			},
			toll: {...Char.toll_obj}
		},
		//Poisoned : {turns: 0, duration: 0, points: 100},
		Sedated  : {turns: 3, duration: 3, points: 1,
			turn: (target_obj, status_obj) => {
				Object.keys(target_obj.stats_objs.current).forEach((key) => {
					target_obj.stats_objs.current[key] -= status_obj.points
					status_obj.toll.stats[key] -= status_obj.points
				})
				status_obj.duration -= 1
			},
			end: (target_obj, status_obj) => {
				// clean Sedated status object
				target_obj.status = target_obj.status.filter((status_obj_) => {
					return status_obj !== status_obj_
				})

				// give back lost points
				Object.keys(target_obj.stats_objs.current).forEach((key) => {
					target_obj.stats_objs.current[key] += (status_obj.points * status_obj.turns)
				})

				// add Sleeping status
				target_obj.status.push({name: 'Sleeping'})
			},
			toll: {...Char.toll_obj}
		},
	}

	static base_health_points = 3000
	static health_points_per_level = 1000

	constructor (name, age, level, race, class_, primary_motivation, secondary_motivations, virtues, defects, player_stats_obj, story, aptitudes, resistances, actions_obj) {
		Char.objs[name] = this

		this.name = name
		this.age = age
		this.level = level
		this.race = race
		this.class = class_
		this.primary_motivation = primary_motivation
		this.secondary_motivations = secondary_motivations
		this.virtues = virtues
		this.defects = defects
		this.story = story

		this.stats_objs = {}
		this.stats_objs.player = player_stats_obj
		this.stats_objs.base = this.get_base_stats_obj()
		this.stats_objs.current = {... this.stats_objs.base}

		this.aptitudes = aptitudes
		this.resistances = resistances

		this.actions_obj = actions_obj

		this.health = {}
		this.health.base = Char.base_health_points + (level * Char.health_points_per_level)
		this.health.current = this.health.base

		this.inventory_obj = new Inventory(this)

		this.status = [{name: 'Alive'}]
	}

	get_base_stats_obj () {
		const race_obj = Race.objs[this.race]
		const race_stats_obj = race_obj.stats_obj
		const class_stats_obj = race_obj.has_class ? Class.objs[this.class].stats_obj : new Stats(0, 0, 0, 0, 0)
		const base_stats_obj = new Stats(0, 0, 0, 0, 0)

		Object.keys(base_stats_obj).forEach((key) => {
			base_stats_obj[key] = race_stats_obj[key] + class_stats_obj[key] + this.stats_objs.player[key]
		})

		return base_stats_obj
	}

	get_highest_stats () {
		const curr = this.stats_objs.current
		const orderly = {}

		Object.keys(curr).forEach((hability) => {
			const value = curr[hability]

			if (!Object.keys(orderly).includes(value)) {
				orderly[value] = []
			}

			orderly[value].push(hability)
		})
		// console.log(orderly)

		const max = Object.keys(orderly).reverse()[0]
		const highest_stats = orderly[max]

		// console.log('highest_stats')
		// console.log(highest_stats)

		return highest_stats
	}

	get_status_stats () {
		const status_stats = new Stats(0, 0, 0, 0, 0)

		// iter over char status, adding tolls for habilities
		this.status.forEach((status_obj) => {
			if (!Object.keys(status_obj).includes('toll')) {
				return
			}

			Object.keys(status_obj.toll.stats).forEach((hability) => {
				console.log('hability', hability)
				console.log('toll', status_obj.toll)
				console.log('stats', status_obj.toll.stats)
				status_stats[hability] += status_obj.toll.stats[hability]
			})
		})

		return status_stats
	}

	static actions_points = 10
	static random (name, age, level) {
		name = name ? name : Char._get_random_name()

		age = age ? age : dice(10000)
		level = level ? level : dice(10)

		const race_index = dice(Object.keys(Race.objs).length) - 1
		const race_name = Object.keys(Race.objs)[race_index]
		const race_obj = Race.objs[race_name]

		let class_ = null
		if (race_obj.has_class) {
			const class_index = dice(Object.keys(Class.objs).length) - 1
			const class_name = Object.keys(Class.objs)[class_index]
			const class_obj = Class.objs[class_name]
			class_ = class_name
		}

		// const class_ = race_obj.has_class ? Class.objs[ dice(Object.keys(Class.objs).length) - 1 ].name : null
		// const class_ = race_obj.has_class ? class_name : null

		const primary_motivation = Char.motivations[ dice(Char.motivations.length) - 1 ] 

		const virtues = []
		for (let i = 0; i < 3; i++) {
			virtues.push( Char.virtues[ dice(Char.virtues.length) - 1 ] )
		}

		const defects = []
		for (let i = 0; i < 3; i++) {
			defects.push( Char.defects[ dice(Char.defects.length) - 1 ] )
		}

		const player_stats_obj = Stats.get_random(level)

		const aptitudes = {}
		Attack.damage_types.forEach((damage_type) => {
			aptitudes[damage_type.toLowerCase()] = 0
		})
		const resistances = {...aptitudes}

		const char_actions_names = Char._get_char_actions(level, race_name, class_)

		const actions_obj = {
			total_points : (level * Char.actions_points),
			actions_levels : {}
		}

		// sort out actions+slots and action upgrades
		if (char_actions_names.length > 0) {
			//console.log(actions_obj.total_points)

			for (let i = 0; i < actions_obj.total_points;) {
				//console.log('i: ' + i)

				const keys = Object.keys(actions_obj.actions_levels)
	
				// taking an action+slot is an option if not all actions have been taken and if we have at least 2 action points
				let not_all_actions_taken = keys.length < char_actions_names.length
				let have_2_action_points = i < (actions_obj.total_points - 2)
	
				let action_is_option = not_all_actions_taken && have_2_action_points
	
				// taking a upgrade is an option if some action+slot have been taken
				let upgrade_is_option = keys.length > 0
	
				if (action_is_option && upgrade_is_option) {
					if (dice(2) == 1) {
						upgrade_is_option = false
					}
					else {
						action_is_option = false
					}
				}
	
				if (action_is_option) {
					//console.log(char_actions_names)

					// seek an action that have not already been taken
					let action_index = null
					let action = null
					while (true) {
						action_index = dice(char_actions_names.length) - 1
						action = char_actions_names[action_index]

						if (!Object.keys(actions_obj.actions_levels).includes(action)) {
							break
						}
					}
					actions_obj.actions_levels[action] = 1
					i += 2

					//console.log('taking action ' + action + ' action_index ' + action_index)
				}
				else if (upgrade_is_option) {
					const action_index = dice(keys.length) - 1
					const action = keys[action_index]
					actions_obj.actions_levels[action] += 1
					i += 1
					//console.log('upgrading action ' + action + ' action_index ' + action_index)
				}
	
			}
		}

		// console.log(actions_obj)

		const char_obj = new Char(name, age, level, race_name, class_, primary_motivation, 'Some secondary motivations', virtues, defects, player_stats_obj, 'Some story', aptitudes, resistances, actions_obj)

		return char_obj
	}

	static _get_random_name () {
		var names = ['Ash', 'Zig', 'Harley', 'Jesse', 'Kai', 'Quin', 'Remi',
			'Taylor', 'Val', 'Xerxes', 'Xo', 'Zane', 'Sasha', 'Dani',
			'Collie', 'Ebany', 'Adri', 'Acha', 'Lavon', 'Ren', 'Aldwin',
			'Farvardin', 'Revon', 'Darel', 'Galel', 'Dali', 'Raven',
			'Easton', 'Landry', 'Atlas', 'August', 'Avery', 'Cameron',
			'Colby', 'Koda', 'Saylor', 'Rowan', 'Kirby', 'Maddox', 'Roxxie',
			'Sydney', 'Ellison', 'Auden', 'Jude', 'Phoenix', 'Loren',
			'Kai', 'Lane', 'Nowell', 'Oakley', 'Alex', 'Oliver', 'Jessie',

			'Cornustíbia', 'Alcebíades', 'Jeanecleide', 'Andrileide'
			]

		return names[dice(names.length)-1] + " " + names[dice(names.length)-1]
	}

	static _get_char_actions (char_level, char_race, char_class) {
		return Object.keys(Action.objs).filter((key) => {
			const action_obj = Action.objs[key]
			return ((!action_obj.for_all) && (action_obj.char_races.includes(char_race) || action_obj.char_classes.includes(char_class)) && action_obj.char_level <= char_level)
		})
	}



}


class CharView {
	static mode = 'create'

	static get_html () {
		let html = `
<div class="char-container">

	<nav>
		<ul>
			<li id="char-mode-create-button" onclick="CharView.set_mode('create', this)">Create</li>
			<li id="char-mode-edit-button" onclick="CharView.set_mode('edit', this)">Edit</li>
		</ul>
	</nav>

	<div id="char-random-container">
		<button onclick="CharView.random()">Random</button>
	</div>

	<div class="char-div">
		<table>
			<tbody>
				<tr>
					<td colspan="2">
						<span>Name</span>
						<div id="char-name-container">
							<input type="text" id="char-name" />
						</div>
						<div id="char-selector-container">
							<select id="char-selector" onchange="CharView.edit_select_char()"></select>
						</div>
					</td>
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
					<td><select id="char-race" onchange="CharView.handle_race_change()"></select></td>
					<td><select id="char-class" onchange="CharView.handle_class_change()"></select></td>
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
				<tr>
					<td colspan="2">Story</td>
				</tr>
				<tr>
					<td colspan="2"><textarea id="char-story"></textarea></td>
				</tr>
			</tbody>
		</table>
	</div>
	
	<div class="char-div">
		<table id="char-stats">
			<thead>
				<tr>
					<th colspan="6">Base</th>
					<th colspan="2">Current</th>
				</tr>
				<tr>
					<th></th>
					<th>Race</th>
					<th>Class</th>
					<th>Player</th>
					<th>Items</th>
					<th>Total</th>
					<th>Status</th>
					<th>Current</th>
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
					<td id="char-stat-status-strength"></td>
					<td id="char-stat-current-strength"></td>
				</tr>
				<tr>
					<td>Agility</td>
					<td id="char-stat-race-agility"></td>
					<td id="char-stat-class-agility"></td>
					<td><input type="number" id="char-stat-player-agility" value="0" onchange="CharView.fill_total_stats()" /></td>
					<td id="char-stat-items-agility"></td>
					<td id="char-stat-total-agility"></td>
					<td id="char-stat-status-agility"></td>
					<td id="char-stat-current-agility"></td>
				</tr>
				<tr>
					<td>Dextrity</td>
					<td id="char-stat-race-dextrity"></td>
					<td id="char-stat-class-dextrity"></td>
					<td><input type="number" id="char-stat-player-dextrity" value="0" onchange="CharView.fill_total_stats()" /></td>
					<td id="char-stat-items-dextrity"></td>
					<td id="char-stat-total-dextrity"></td>
					<td id="char-stat-status-dextrity"></td>
					<td id="char-stat-current-dextrity"></td>
				</tr>
				<tr>
					<td>Intelligence</td>
					<td id="char-stat-race-intelligence"></td>
					<td id="char-stat-class-intelligence"></td>
					<td><input type="number" id="char-stat-player-intelligence" value="0" onchange="CharView.fill_total_stats()" /></td>
					<td id="char-stat-items-intelligence"></td>
					<td id="char-stat-total-intelligence"></td>
					<td id="char-stat-status-intelligence"></td>
					<td id="char-stat-current-intelligence"></td>
				</tr>
				<tr>
					<td>Charisma</td>
					<td id="char-stat-race-charisma"></td>
					<td id="char-stat-class-charisma"></td>
					<td><input type="number" id="char-stat-player-charisma" value="0" onchange="CharView.fill_total_stats()" /></td>
					<td id="char-stat-items-charisma"></td>
					<td id="char-stat-total-charisma"></td>
					<td id="char-stat-status-charisma"></td>
					<td id="char-stat-current-charisma"></td>
				</tr>
			</tbody>
		</table>
	</div>

	<div class="char-div" id="char-status">
		<table>
			<thead>
				<tr>
					<th colspan="3">Status</th>
				</tr>
				<tr>
					<th>Name</th>
					<th>Description</th>
					<th>Setting</th>
			</thead>
			<tbody id="char-status-tbody">
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
					<td><input type="number" id="char-aptitude-air" min="0" value="0" /></td>
					<td><input type="number" id="char-resistance-air" min="0" value="0" /></td>

					<td>Water</td>
					<td><input type="number" id="char-aptitude-water" min="0" value="0" /></td>
					<td><input type="number" id="char-resistance-water" min="0" value="0" /></td>

					<td>Fire</td>
					<td><input type="number" id="char-aptitude-fire" min="0" value="0" /></td>
					<td><input type="number" id="char-resistance-fire" min="0" value="0" /></td>

					<td>Earth</td>
					<td><input type="number" id="char-aptitude-earth" min="0" value="0" /></td>
					<td><input type="number" id="char-resistance-earth" min="0" value="0" /></td>
				</tr>
				<tr>
					<td>Cheese</td>
					<td><input type="number" id="char-aptitude-cheese" min="0" value="0" /></td>
					<td><input type="number" id="char-resistance-cheese" min="0" value="0" /></td>

					<td>Psychic</td>
					<td><input type="number" id="char-aptitude-psychic" min="0" value="0" /></td>
					<td><input type="number" id="char-resistance-psychic" min="0" value="0" /></td>

					<td>Invocation</td>
					<td><input type="number" id="char-aptitude-invocation" min="0" value="0" /></td>
					<td><input type="number" id="char-resistance-invocation" min="0" value="0" /></td>

					<td>Poison</td>
					<td><input type="number" id="char-aptitude-poison" min="0" value="0" /></td>
					<td><input type="number" id="char-resistance-poison" min="0" value="0" /></td>

				</tr>
				<tr>
					<td>Acid</td>
					<td><input type="number" id="char-aptitude-acid" min="0" value="0" /></td>
					<td><input type="number" id="char-resistance-acid" min="0" value="0" /></td>

					<td>Electricity</td>
					<td><input type="number" id="char-aptitude-electricity" min="0" value="0" /></td>
					<td><input type="number" id="char-resistance-electricity" min="0" value="0" /></td>

					<td>Perfuration</td>
					<td><input type="number" id="char-aptitude-perfuration" min="0" value="0" /></td>
					<td><input type="number" id="char-resistance-perfuration" min="0" value="0" /></td>

					<td>Impact</td>
					<td><input type="number" id="char-aptitude-impact" min="0" value="0" /></td>
					<td><input type="number" id="char-resistance-impact" min="0" value="0" /></td>
				</tr>
				<tr>
					<td>Shooting</td>
					<td><input type="number" id="char-aptitude-shooting" min="0" value="0" /></td>
					<td><input type="number" id="char-resistance-shooting" min="0" value="0" /></td>

					<td>Throwing</td>
					<td><input type="number" id="char-aptitude-throwing" min="0" value="0" /></td>
					<td><input type="number" id="char-resistance-throwing" min="0" value="0" /></td>

					<td>Explosion</td>
					<td><input type="number" id="char-aptitude-explosion" min="0" value="0" /></td>
					<td><input type="number" id="char-resistance-explosion" min="0" value="0" /></td>

					<td>Cutting</td>
					<td><input type="number" id="char-aptitude-cutting" min="0" value="0" /></td>
					<td><input type="number" id="char-resistance-cutting" min="0" value="0" /></td>
				</tr>
			</tbody>


		</table>
	</div>
	
	<!--
	<div class="char-div">
		<b>Badges</b>

		<table id="char-badges">
			<thead>
				<tr>
					<th>Badge</th>
					<th></th>
				</tr>
			</thead>
		</table>
	</div>
	-->

	<div class="char-div">
		<b>Actions</b>

		<div>
			<div style="display: inline-block;"><b>Action Points:</b></div>
			<div style="display: inline-block;">Total: <input id="char-total-action-points" type="number" min="0" value="0" onchange="CharView.handle_total_action_points_change()"></div>
            <div style="display: inline-block;">Free: <div style="display: inline;" id="char-free-action-points"></div></div>
		</div>
		<div>
			<input type="button" onclick="CharView.add_action_slot()" value="Add slot" />
		</div>

		<table id="char-actions-slots">
			<thead>
				<tr>
					<th>Action</th>
					<th>Level</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>

	<button id="char-submit-button" onclick="CharView.submit()">Create</button>

</div>
`

		return html
	}

	static set_mode (mode, li) {
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
		CharView.mode = mode

		const ul = li.parentElement
		for (let i = 0; i < ul.children.length; i++) {
			const child = ul.children[i]
			child.classList.remove('selected')
		}
		li.classList.add('selected')
	}

	static _set_mode_create() {
		CharView.submit_button.innerText = 'Create'

		CharView.random_container.classList.remove("hidden")
		CharView.selector_container.classList.add("hidden")
		CharView.name_container.classList.remove("hidden")
	}

	static _set_mode_edit() {
		CharView.submit_button.innerText = 'Update'

		CharView.random_container.classList.add("hidden")
		CharView.selector_container.classList.remove("hidden")
		CharView.name_container.classList.add("hidden")
	}

	static get_data (output) {
		const name = CharView.mode == 'create' ? CharView.name_.value : CharView.selector.selectedOptions[0].innerText
		const age = CharView.age.value
		const level = CharView.level.value
		const race = CharView.race.selectedOptions[0].innerText
		const class_ = CharView.class_.selectedOptions[0].innerText
		const primary_motivation = CharView.primary_motivation.selectedOptions[0].innerText
		const secondary_motivations = CharView.secondary_motivations.value

		const virtue_0 = CharView.virtue_0.selectedOptions[0].innerText
		const virtue_1 = CharView.virtue_1.selectedOptions[0].innerText
		const virtue_2 = CharView.virtue_2.selectedOptions[0].innerText

		const defect_0 = CharView.defect_0.selectedOptions[0].innerText
		const defect_1 = CharView.defect_1.selectedOptions[0].innerText
		const defect_2 = CharView.defect_2.selectedOptions[0].innerText

		const player_stats_obj = new Stats(
			Number( CharView.stat_player_strength.value ),
			Number( CharView.stat_player_agility.value ),
			Number( CharView.stat_player_dextrity.value ),
			Number( CharView.stat_player_intelligence.value ),
			Number( CharView.stat_player_charisma.value )
		)

		const story = CharView.story.value

		const aptitudes = {
			air: 0,
			water: 0,
			fire: 0,
			earth: 0,
			cheese: 0,
			psychic: 0,
			invocation: 0,
			poison: 0,
			acid: 0,
			electricity: 0,
			perfuration: 0,
			impact: 0,
			shooting: 0,
			throwing: 0,
			explosion: 0,
			cutting: 0,
		}
		const resistances = {
			... aptitudes
		}

		aptitudes.air = Number(CharView.aptitude_air.value)
		aptitudes.water = Number(CharView.aptitude_water.value)
		aptitudes.fire = Number(CharView.aptitude_fire.value)
		aptitudes.earth = Number(CharView.aptitude_earth.value)
		aptitudes.cheese = Number(CharView.aptitude_cheese.value)
		aptitudes.psychic = Number(CharView.aptitude_psychic.value)
		aptitudes.invocation = Number(CharView.aptitude_invocation.value)
		aptitudes.poison = Number(CharView.aptitude_poison.value)
		aptitudes.acid = Number(CharView.aptitude_acid.value)
		aptitudes.electricity = Number(CharView.aptitude_electricity.value)
		aptitudes.perfuration = Number(CharView.aptitude_perfuration.value)
		aptitudes.impact = Number(CharView.aptitude_impact.value)
		aptitudes.shooting = Number(CharView.aptitude_shooting.value)
		aptitudes.throwing = Number(CharView.aptitude_throwing.value)
		aptitudes.explosion = Number(CharView.aptitude_explosion.value)
		aptitudes.cutting = Number(CharView.aptitude_cutting.value)

		resistances.air = Number(CharView.resistance_air.value)
		resistances.water = Number(CharView.resistance_water.value)
		resistances.fire = Number(CharView.resistance_fire.value)
		resistances.earth = Number(CharView.resistance_earth.value)
		resistances.cheese = Number(CharView.resistance_cheese.value)
		resistances.psychic = Number(CharView.resistance_psychic.value)
		resistances.invocation = Number(CharView.resistance_invocation.value)
		resistances.poison = Number(CharView.resistance_poison.value)
		resistances.acid = Number(CharView.resistance_acid.value)
		resistances.electricity = Number(CharView.resistance_electricity.value)
		resistances.perfuration = Number(CharView.resistance_perfuration.value)
		resistances.impact = Number(CharView.resistance_impact.value)
		resistances.shooting = Number(CharView.resistance_shooting.value)
		resistances.throwing = Number(CharView.resistance_throwing.value)
		resistances.explosion = Number(CharView.resistance_explosion.value)
		resistances.cutting = Number(CharView.resistance_cutting.value)

		const actions_obj = {
			total_points : CharView.total_action_points.value,
			actions_levels : {}
		}
		const char_action_rows = document.getElementsByClassName('char-action-row')
		for (let i = 0; i < char_action_rows.length; i++) {
			const action_row = char_action_rows[i]
			const action_name = action_row.children[0].children[0].selectedOptions[0].innerText
			const action_level = Number( action_row.children[1].children[0].value )
			actions_obj.actions_levels[action_name] = action_level
		}

		return [
			name,
			age,
			level,
			race,
			class_,
			primary_motivation,
			secondary_motivations,
			[virtue_0, virtue_1, virtue_2],
			[defect_0, defect_1, defect_2],
			player_stats_obj,
			story,
			aptitudes,
			resistances,
			actions_obj
		]
	}

	static submit () {
		const data = CharView.get_data()	

		new Char(...data)
		// new Char(name, age, level, race, class_, primary_motivation, secondary_motivations, [virtue_0, virtue_1, virtue_2], [defect_0, defect_1, defect_2], player_stats_obj, story, actions_obj)

		const name = data[0]
		if (CharView.mode == 'create') {
			new Modal('Char created', `Char ${name} created!`)
		}
		else if (CharView.mode == 'edit') {
			new Modal('Char updated', `Char ${name} updated!`)
		}
		
		CharView.update()
		CharView.clear()
	}

	static update () {
		fill_select(CharView.selector, ['', ...Object.keys(Char.objs)])
		fill_select(CombatView.team_member, Object.keys(Char.objs))
		fill_select(InventoryView.char_selector, Object.keys(Char.objs))
		InventoryView.select_char()
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
		const race_name = CharView.race.selectedOptions[0].innerText
		const race_obj = Race.objs[race_name]

		let stats_obj
		if (race_obj.has_class) {
			const class_name = CharView.class_.selectedOptions[0].innerText
			const class_obj = Class.objs[class_name]
			stats_obj = class_obj.stats_obj
		}
		else {
			stats_obj = new Stats(0, 0, 0, 0, 0)
		}

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
		if (CharView.mode == 'create') {
			return new Stats(0, 0, 0, 0, 0)
		}
		else if (CharView.mode == 'edit') {
			const char_name = CharView.selector.selectedOptions[0].innerText
			if (Char.objs[char_name]) {
				return Char.objs[char_name].inventory_obj.get_stats()		
			}
			else {
				return new Stats(0, 0, 0, 0, 0)
			}
		}
	}

	static _get_status_stats_obj () {
		if (CharView.mode == 'create') {
			return new Stats(0, 0, 0, 0, 0)
		}
		else if (CharView.mode == 'edit') {
			const char_name = CharView.selector.selectedOptions[0].innerText
			if (Char.objs[char_name]) {
				console.log('Char.objs[char_name]', Char.objs[char_name])
				console.log('Char.objs[char_name]', Char.objs[char_name].get_status_stats)

				return Char.objs[char_name].get_status_stats()		
			}
			else {
				return new Stats(0, 0, 0, 0, 0)
			}
		}
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

	static fill_status_stats () {
		const status_stats = CharView._get_status_stats_obj()
		//console.log('status_stats', status_stats)

		CharView.stat_status_strength.innerHTML = status_stats.strength
		CharView.stat_status_agility.innerHTML = status_stats.agility
		CharView.stat_status_dextrity.innerHTML = status_stats.dextrity
		CharView.stat_status_intelligence.innerHTML = status_stats.intelligence
		CharView.stat_status_charisma.innerHTML = status_stats.charisma
	}

	static fill_current_stats () {
		CharView.stat_current_strength.innerHTML = Number(CharView.stat_total_strength.innerHTML) + Number(CharView.stat_status_strength.innerHTML)
		CharView.stat_current_agility.innerHTML = Number(CharView.stat_total_agility.innerHTML) + Number(CharView.stat_status_agility.innerHTML)
		CharView.stat_current_dextrity.innerHTML = Number(CharView.stat_total_dextrity.innerHTML) + Number(CharView.stat_status_dextrity.innerHTML)
		CharView.stat_current_intelligence.innerHTML = Number(CharView.stat_total_intelligence.innerHTML) + Number(CharView.stat_status_intelligence.innerHTML)
		CharView.stat_current_charisma.innerHTML = Number(CharView.stat_total_charisma.innerHTML) + Number(CharView.stat_status_charisma.innerHTML)
	}

	static _get_char_actions () {
		return Object.keys(Action.objs).filter((key) => {
			const action_obj = Action.objs[key]

			const char_race = CharView.race.selectedOptions[0].innerText
			const char_class = CharView.class_.selectedOptions[0].innerText
			const char_level = Number(CharView.level.value)

			const race_obj = Race.objs[char_race]

			return ((!action_obj.for_all) && (action_obj.char_races.includes(char_race) || (race_obj.has_class && action_obj.char_classes.includes(char_class))) && action_obj.char_level <= char_level)
		})
	}

	static get_free_action_points () {
		const total_action_points = Number( CharView.total_action_points.value )

		const action_rows = document.getElementsByClassName('char-action-row')

		let action_objs_ct = 0
		let action_levels_ct = 0
		for (let i = 0; i < action_rows.length; i++) {
			const action_row = action_rows[i]
			const action_select = action_row.children[0].children[0]
			const action_name = action_select.selectedOptions[0].innerText
			action_objs_ct += 2

			const action_level = Number( action_row.children[1].children[0].value )
			action_levels_ct += action_level - 1
		}

		const free_action_points = total_action_points - action_objs_ct - action_levels_ct

		return free_action_points
	}

	static handle_total_action_points_change () {
		CharView.free_action_points.innerText = CharView.get_free_action_points()
	}

	static add_action_slot (event) {
		const free_action_points = CharView.get_free_action_points()

		if (free_action_points < 2) {
			new Modal('Insufficient action points', 'Insufficient free action points for adding a slot: ' + free_action_points)
			return
		}

		if (CharView.mode == 'create') {
			CharView.free_action_points.innerText = free_action_points - 2
		}
		else if (CharView.mode == 'edit') {
		}	

		const tbody = CharView.actions_slots.tBodies[0]

		const tr = document.createElement("tr")

		const template = `<td><select class="char-action-selector"></select></td>
	<td><input type="number" class="char-action-level" value="1" min="1" onchange="CharView.handle_action_level_input(event, this)" /></td>
	<td><input type="button" value="Remove slot" onclick="CharView.remove_action_slot(this)" /></td>`

		tr.innerHTML = template
		tr.classList.add('char-action-row')
		tbody.appendChild(tr)

		const char_actions = CharView._get_char_actions()

		const selectors = document.getElementsByClassName("char-action-selector")
		const selector = selectors[selectors.length - 1]
		const options = char_actions
		fill_select(selector, options)
	}

	static remove_action_slot (button_element) {
		const tr = button_element.parentElement.parentElement
		const tbody = tr.parentElement
		tbody.removeChild(tr)

		if (CharView.mode == 'create') {
			CharView.free_action_points.innerText = CharView.get_free_action_points()		
		}
		else if (CharView.mode == 'edit') {
		}	
	}

	static handle_action_level_input (event, input) {
		const free_action_points = CharView.get_free_action_points()
		CharView.free_action_points.innerText = free_action_points
	}

	static handle_race_change () {
		CharView.fill_race_stats()

		// disable class selector when classless races are chosen
		const race_name = CharView.race.selectedOptions[0].innerText
		const race_obj = Race.objs[race_name]

		CharView.class_.disabled = ! race_obj.has_class
		CharView.fill_class_stats(new Stats(0, 0, 0, 0, 0))

		remove_children(CharView.actions_slots.tBodies[0])
		CharView.handle_total_action_points_change()
	}

	static handle_class_change () {
		CharView.fill_class_stats()
		remove_children(CharView.actions_slots.tBodies[0])
		CharView.handle_total_action_points_change()
	}

	static random () {
		const data = CharView.get_data()

		const name = data[0]
		const age = data[1]
		const level = data[2]

		const char_obj = Char.random(name, age, level)

		CharView.fill_char(char_obj)
	}

	static clear () {
		CharView.name_.value = ''
		CharView.age.value = 0
		CharView.level.value = 1

		CharView.race.value = 0
		CharView.handle_race_change()

		CharView.class_.value = 0
		CharView.fill_class_stats()

		CharView.primary_motivation.value = 0
		CharView.secondary_motivations.value = ''

		CharView.virtue_0.value = 0
		CharView.virtue_1.value = 0
		CharView.virtue_2.value = 0

		CharView.defect_0.value = 0
		CharView.defect_1.value = 0
		CharView.defect_2.value = 0

		CharView.stat_player_strength.value = 0
		CharView.stat_player_agility.value = 0
		CharView.stat_player_dextrity.value = 0
		CharView.stat_player_intelligence.value = 0
		CharView.stat_player_charisma.value = 0

		CharView.fill_race_stats()
		CharView.fill_class_stats()
		CharView.fill_items_stats()
		CharView.fill_total_stats()
		CharView.fill_status_stats()
		CharView.fill_current_stats()

		CharView.story.value = ''

		CharView.aptitude_air.value = 0
		CharView.aptitude_water.value = 0
		CharView.aptitude_fire.value = 0
		CharView.aptitude_earth.value = 0
		CharView.aptitude_cheese.value = 0
		CharView.aptitude_psychic.value = 0
		CharView.aptitude_invocation.value = 0
		CharView.aptitude_poison.value = 0
		CharView.aptitude_acid.value = 0
		CharView.aptitude_electricity.value = 0
		CharView.aptitude_perfuration.value = 0
		CharView.aptitude_impact.value = 0
		CharView.aptitude_shooting.value = 0
		CharView.aptitude_throwing.value = 0
		CharView.aptitude_explosion.value = 0
		CharView.aptitude_cutting.value = 0

		CharView.resistance_air.value = 0
		CharView.resistance_water.value = 0
		CharView.resistance_fire.value = 0
		CharView.resistance_earth.value = 0
		CharView.resistance_cheese.value = 0
		CharView.resistance_psychic.value = 0
		CharView.resistance_invocation.value = 0
		CharView.resistance_poison.value = 0
		CharView.resistance_acid.value = 0
		CharView.resistance_electricity.value = 0
		CharView.resistance_perfuration.value = 0
		CharView.resistance_impact.value = 0
		CharView.resistance_shooting.value = 0
		CharView.resistance_throwing.value = 0
		CharView.resistance_explosion.value = 0
		CharView.resistance_cutting.value = 0

		CharView.total_action_points.value = 0

		remove_children(CharView.actions_slots.tBodies[0])
	}

	static edit_select_char () {
		const char_name = CharView.selector.selectedOptions[0].innerText
		const char_obj = Char.objs[char_name]

		CharView.fill_char(char_obj)
	}

	static fill_char (char_obj) {
		CharView.name_.value = char_obj.name
		CharView.age.value = char_obj.age
		CharView.level.value = char_obj.level

		// fill up class field before because race may change values in the Stats table
		CharView.class_.value = char_obj.class ? Object.keys(Class.objs).indexOf(char_obj.class) : 0
		CharView.fill_class_stats()

		CharView.race.value = Object.keys(Race.objs).indexOf(char_obj.race)
		CharView.handle_race_change()

		CharView.primary_motivation.value = Char.motivations.indexOf(char_obj.primary_motivation)
		CharView.secondary_motivations.value = char_obj.secondary_motivations

		CharView.virtue_0.value = Char.virtues.indexOf(char_obj.virtues[0])
		CharView.virtue_1.value = Char.virtues.indexOf(char_obj.virtues[1])
		CharView.virtue_2.value = Char.virtues.indexOf(char_obj.virtues[2])

		CharView.defect_0.value = Char.defects.indexOf(char_obj.defects[0])
		CharView.defect_1.value = Char.defects.indexOf(char_obj.defects[1])
		CharView.defect_2.value = Char.defects.indexOf(char_obj.defects[2])
		
		CharView.stat_player_strength.value = char_obj.stats_objs.player.strength
		CharView.stat_player_agility.value = char_obj.stats_objs.player.agility
		CharView.stat_player_dextrity.value = char_obj.stats_objs.player.dextrity
		CharView.stat_player_intelligence.value = char_obj.stats_objs.player.intelligence
		CharView.stat_player_charisma.value = char_obj.stats_objs.player.charisma

		CharView.fill_race_stats()
		CharView.fill_class_stats()
		CharView.fill_items_stats()
		CharView.fill_total_stats()
		CharView.fill_status_stats()
		CharView.fill_current_stats()

		CharView.story.value = char_obj.story

		CharView.aptitude_air.value = char_obj.aptitudes.air
		CharView.aptitude_water.value = char_obj.aptitudes.water
		CharView.aptitude_fire.value = char_obj.aptitudes.fire
		CharView.aptitude_earth.value = char_obj.aptitudes.earth
		CharView.aptitude_cheese.value = char_obj.aptitudes.cheese
		CharView.aptitude_psychic.value = char_obj.aptitudes.psychic
		CharView.aptitude_invocation.value = char_obj.aptitudes.invocation
		CharView.aptitude_poison.value = char_obj.aptitudes.poison
		CharView.aptitude_acid.value = char_obj.aptitudes.acid
		CharView.aptitude_electricity.value = char_obj.aptitudes.electricity
		CharView.aptitude_perfuration.value = char_obj.aptitudes.perfuration
		CharView.aptitude_impact.value = char_obj.aptitudes.impact
		CharView.aptitude_shooting.value = char_obj.aptitudes.shooting
		CharView.aptitude_throwing.value = char_obj.aptitudes.throwing
		CharView.aptitude_explosion.value = char_obj.aptitudes.explosion
		CharView.aptitude_cutting.value = char_obj.aptitudes.cutting

		CharView.resistance_air.value = char_obj.resistances.air
		CharView.resistance_water.value = char_obj.resistances.water
		CharView.resistance_fire.value = char_obj.resistances.fire
		CharView.resistance_earth.value = char_obj.resistances.earth
		CharView.resistance_cheese.value = char_obj.resistances.cheese
		CharView.resistance_psychic.value = char_obj.resistances.psychic
		CharView.resistance_invocation.value = char_obj.resistances.invocation
		CharView.resistance_poison.value = char_obj.resistances.poison
		CharView.resistance_acid.value = char_obj.resistances.acid
		CharView.resistance_electricity.value = char_obj.resistances.electricity
		CharView.resistance_perfuration.value = char_obj.resistances.perfuration
		CharView.resistance_impact.value = char_obj.resistances.impact
		CharView.resistance_shooting.value = char_obj.resistances.shooting
		CharView.resistance_throwing.value = char_obj.resistances.throwing
		CharView.resistance_explosion.value = char_obj.resistances.explosion
		CharView.resistance_cutting.value = char_obj.resistances.cutting


		CharView.total_action_points.value = char_obj.actions_obj.total_points

		const actions_slots_tbody = CharView.actions_slots.tBodies[0]
		remove_children(actions_slots_tbody)

		const template = `<td><select class="char-action-selector"></select></td>
<td><input type="number" class="char-action-level" value="1" min="1" onchange="CharView.handle_action_level_input(event, this)" /></td>
<td><input type="button" value="Remove slot" onclick="CharView.remove_action_slot(this)" /></td>`

		Object.keys(char_obj.actions_obj.actions_levels).forEach(() => {
			const tr = document.createElement('tr')
			tr.innerHTML = template
			tr.classList.add('char-action-row')
			actions_slots_tbody.appendChild(tr)
		})

		const action_selectors = document.getElementsByClassName('char-action-selector')
		const action_level_inputs = document.getElementsByClassName('char-action-level')

		const char_actions = CharView._get_char_actions()
		for (var i = 0; i < action_selectors.length; i++) {
			const selector = action_selectors[i]
			const options = char_actions
			fill_select(selector, options)
		}


		for (let i = 0; i < action_selectors.length; i++) {
			const action_selector = action_selectors[i]
			const action_level_input = action_level_inputs[i]

			const key = Object.keys(char_obj.actions_obj.actions_levels)[i]
			const action_level = char_obj.actions_obj.actions_levels[key]

			action_selector.value = i
			action_level_input.value = action_level
		}

		CharView.handle_total_action_points_change()

	}
}

new Content('chars', CharView.get_html())

CharView.mode_create_button = document.getElementById("char-mode-create-button")
CharView.random_container = document.getElementById("char-random-container")
CharView.submit_button = document.getElementById('char-submit-button')
CharView.name_container = document.getElementById("char-name-container")
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

CharView.stat_status_strength = document.getElementById("char-stat-status-strength")
CharView.stat_status_agility = document.getElementById("char-stat-status-agility")
CharView.stat_status_dextrity = document.getElementById("char-stat-status-dextrity")
CharView.stat_status_intelligence = document.getElementById("char-stat-status-intelligence")
CharView.stat_status_charisma = document.getElementById("char-stat-status-charisma")

CharView.stat_current_strength = document.getElementById("char-stat-current-strength")
CharView.stat_current_agility = document.getElementById("char-stat-current-agility")
CharView.stat_current_dextrity = document.getElementById("char-stat-current-dextrity")
CharView.stat_current_intelligence = document.getElementById("char-stat-current-intelligence")
CharView.stat_current_charisma = document.getElementById("char-stat-current-charisma")

CharView.story = document.getElementById("char-story")

CharView.actions_slots = document.getElementById("char-actions-slots")
CharView.total_action_points = document.getElementById("char-total-action-points")
CharView.free_action_points = document.getElementById("char-free-action-points")

CharView.aptitudes_and_resistances_container = document.getElementById("char-aptitudes-and-resistances-container")

CharView.status = document.getElementById("chat-status")
CharView.status_tbody = document.getElementById("chat-status-tbody")

CharView.aptitude_air = document.getElementById('char-aptitude-air')
CharView.resistance_air = document.getElementById('char-resistance-air')
CharView.aptitude_water = document.getElementById('char-aptitude-water')
CharView.resistance_water = document.getElementById('char-resistance-water')
CharView.aptitude_fire = document.getElementById('char-aptitude-fire')
CharView.resistance_fire = document.getElementById('char-resistance-fire')
CharView.aptitude_earth = document.getElementById('char-aptitude-earth')
CharView.resistance_earth = document.getElementById('char-resistance-earth')

CharView.aptitude_cheese = document.getElementById('char-aptitude-cheese')
CharView.resistance_cheese = document.getElementById('char-resistance-cheese')
CharView.aptitude_psychic = document.getElementById('char-aptitude-psychic')
CharView.resistance_psychic = document.getElementById('char-resistance-psychic')
CharView.aptitude_invocation = document.getElementById('char-aptitude-invocation')
CharView.resistance_invocation = document.getElementById('char-resistance-invocation')
CharView.aptitude_poison = document.getElementById('char-aptitude-poison')
CharView.resistance_poison = document.getElementById('char-resistance-poison')

CharView.aptitude_acid = document.getElementById('char-aptitude-acid')
CharView.resistance_acid = document.getElementById('char-resistance-acid')
CharView.aptitude_electricity = document.getElementById('char-aptitude-electricity')
CharView.resistance_electricity = document.getElementById('char-resistance-electricity')
CharView.aptitude_perfuration = document.getElementById('char-aptitude-perfuration')
CharView.resistance_perfuration = document.getElementById('char-resistance-perfuration')
CharView.aptitude_impact = document.getElementById('char-aptitude-impact')
CharView.resistance_impact = document.getElementById('char-resistance-impact')

CharView.aptitude_shooting = document.getElementById('char-aptitude-shooting')
CharView.resistance_shooting = document.getElementById('char-resistance-shooting')
CharView.aptitude_throwing = document.getElementById('char-aptitude-throwing')
CharView.resistance_throwing = document.getElementById('char-resistance-throwing')
CharView.aptitude_explosion = document.getElementById('char-aptitude-explosion')
CharView.resistance_explosion = document.getElementById('char-resistance-explosion')
CharView.aptitude_cutting = document.getElementById('char-aptitude-cutting')
CharView.resistance_cutting = document.getElementById('char-resistance-cutting')

CharView.selector = document.getElementById("char-selector")

CharView.fill_items_stats()

CharView.mode_create_button.click()
