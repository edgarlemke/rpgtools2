class Race	{

	static objs = {}

	static get_html () {
		let html = `<div class="races-container">
`

		Object.keys(Race.objs).forEach((key) => {
			//console.log(key)

			let race_obj = Race.objs[key]
			//console.log(race_obj)

			html += race_obj.get_html()
		})

		html += `</div>`

		return html
	}

	constructor (name, description, stats_obj, has_class) {
		Race.objs[name] = this

		this.name = name
		this.description = description
		this.stats_obj = stats_obj
		this.has_class = has_class
	}

	get_html () {
		let has_class_text = (this.has_class ? "Has class." : "Doesn't have class.")

		let html = `<div class="race-container">
<div class="race-name">${this.name}</div>
<div class="race-description">${this.description}</div>
<div class="race-has-class">${has_class_text}</div>
<div class="race-stats">
${this.stats_obj.get_html()}
</div>
</div>
`
		return html
	}

}

new Race("Elf",          "They come from an unimaginable kingdom of magic and are really graceful.", new Stats(0, 0, 2, 2, 1), true)
new Race("Human",        "Predictable and agitated when their plans go wrong.", new Stats(0, 1, 1, 2, 1), true)
new Race("Yeti",         "Mweeeer!", new Stats(3, 2, 0, 0, 0), true)
new Race("Dwarf",        "Let's go to the war weakling.", new Stats(2, 1, 2, 0, 0), true)
new Race("Tiefling",     "Demon face was my nickname when I was a kid.", new Stats(2, 1, 1, 1, 0), true)
new Race("Gnome",        "Small and curious, they go around spreading their happiness - even if it's not always welcome.", new Stats(0, 0, 1, 3, 1), true)
new Race("Orc",          "Go out of my way, idiot! Bwoorrrrk!", new Stats(3, 1, 1, 0, 0), true)
new Race("Cyborg",       "My next upgrade will be on my geolocalization features, after that I want to advance my vision, install a more advanced CPU and improve my lasers.", new Stats(1, 0, 1, 3, 0), true)
new Race("Reptilian",    "Submit to the power of my superior intergalactic species and maybe I spare you. It's obvious for me you want this.", new Stats(0, 3, 0, 2, 0), true)
new Race("Atlant",       "Atlantis, the continent where I lived was sank but I survived.", new Stats(2, 0, 0, 3, 0), true)
new Race("Alien",        "We come from much beyond the stars you can see from here.", new Stats(0, 0, 1, 3, 1), true)
new Race("Tree",         "Plants invented animals to spread seeds.", new Stats(3, 0, 0, 1, 1), true)
new Race("Ghoul",        "I am hungry.", new Stats(3, 3, 2, 2, 0), false)
new Race("Elemental", "Person made of an elemental.", new Stats(1, 1, 2, 3, 3), false)
new Race("Golem",        "A creature made of inanimate matter and impregnated with magical wish to make a conscious being.", new Stats(1, 1, 1, 1, 1), true)
//new Race("Undead",        "It can be a ghost, a skeleton or a mummy.", new Stats(1, 2, 2, 3, 2), false)

try {
	new Content("races", Race.get_html())
} catch (e) {}
