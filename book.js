/*
function book () {
	const popup = window.open('', 'Book', 'width=1000 height=1000')

	const head_template = document.createElement('template')
	head_template.innerHTML = `
<style>
	@media all {
		body {
			background-color: white;
			color: black;
			margin: 0;
		}
	
		.page {
			width: 99%;
			height: 99%;
			break-after: always;
			text-align: center;
		}

		table, tr, td, th {
			border: solid 1px black;
			border-collapse: collapse;
		}
		td, th {
			padding: 5px;
		}

		div.race-container {
			break-before: always;
		}
		div.race-stats table {
			margin: 0 auto;
		}
		div.race-name {
			font-size: 1.5em;
		}
	}
</style>
`

	const head_children = [...head_template.content.children]
	head_children.forEach((child) => {
		popup.document.head.appendChild(child)
	})


	let races_html = Race.get_html()


	const body_template = document.createElement('template')
	body_template.innerHTML = `
<div class="page">
	<h1 style="margin: 50% auto; font-size: 5em;">Clash of Desires</h1>
</div>

<div class="page">
	<h2>Races</h2>
	<div>
	${races_html}
	</div>
</div>

<div style="break-before: always;">
<h1>ARA ARA</h1>
</div>

<!--
<div class="page">
	<h2>Classes</h2>
</div>

<div class="page">
	<h2>Items</h2>
</div>

<div class="page">
	<h2>Actions</h2>
</div>
-->
`

	const body_children = [...body_template.content.children]
	body_children.forEach((ch) => {
		popup.document.body.appendChild(ch)
	})

}
*/

const rule_content = document.getElementById('rule-content')
rule_content.innerHTML = Rule.get_html()

const race_content = document.getElementById('race-content')
race_content.innerHTML = Race.get_html()

const class_content = document.getElementById('class-content')
class_content.innerHTML = Class.get_html()

const weapon_content = document.getElementById('weapon-content')
weapon_content.innerHTML = Weapon.get_html()

const defense_content = document.getElementById('defense-content')
defense_content.innerHTML = Defense.get_html()

const ammo_content = document.getElementById('ammo-content')
ammo_content.innerHTML = Ammo.get_html()

const generic_content = document.getElementById('generic-content')
generic_content.innerHTML = Generic.get_html()

const drug_content = document.getElementById('drug-content')
drug_content.innerHTML = Drug.get_html()

const attack_content = document.getElementById('attack-content')
attack_content.innerHTML = Attack.get_html()

const trick_content = document.getElementById('trick-content')
trick_content.innerHTML = Trick.get_html()
