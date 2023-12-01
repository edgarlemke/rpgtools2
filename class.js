class Class	{

	static objs = {}

	static get_html () {
		let html = `<div class="classes-container">
`

		Object.keys(Class.objs).forEach((key) => {
			//console.log(key)

			let class_obj = Class.objs[key]
			//console.log(class_obj)

			html += class_obj.get_html()
		})

		html += `</div>`

		return html
	}


	constructor (name, description, stats_obj) {
		Class.objs[name] = this

		this.name = name
		this.description = description
		this.stats_obj = stats_obj
	}

	get_html () {
		let html = `<div class="class-container">
<div class="class-name">${this.name}</div>
<div class="class-description">${this.description}</div>
<div class="class-stats">
${this.stats_obj.get_html()}
</div>
</div>
`
		return html
	}

}

new Class("Fighter", "Have you seen his muscles? All he does is to train, eat healthy, sleep on the right time and train even more, in an exclusive worship of his own body. I wouldn't like to pick a fight with this guy.", new Stats(3, 1, 1, 0, 0))
new Class("Swordsman", "Once a time we needed to cut down an old and thick tree. We planned to cut it down with a saw but grandpa opposed it. He drawed his old war sword that shone when unsheathed and cut down the tree with a single blow.", new Stats(1, 1, 3, 0, 0))
new Class("Shooter", "Our uncle took us to hunting when I was a child. Next, I became sniper.", new Stats(0, 2, 3, 0, 0))
//new Class("Bounty Hunter",        "Let's go to the war weakling.", new Stats(2, 1, 2, 0, 0))
//new Class("Maniac",     "Demon face was my nickname when I was a kid.", new Stats(2, 1, 1, 1, 0))
new Class("Engineer",        "Have you known about my new gadget? It walks, blinks, jumps, play radio, serves coffee and regonizes ants in the garden.", new Stats(0, 0, 2, 3, 0))
new Class("Witch",          "Witch", new Stats(0, 0, 0, 3, 2))
new Class("Alchemist",       "", new Stats(0, 0, 2, 3, 0))
new Class("Mentalist",    "", new Stats(0, 0, 1, 1, 3))
new Class("Chimera",       "", new Stats(1, 0, 0, 3, 1))
new Class("Demonologist",        "", new Stats(0, 0, 1, 3, 1))
new Class("Messiah",         "", new Stats(2, 1, 1, 1, 0))
//new Class("Lich",        "", new Stats(2, 1, 1, 1, 0))

new Content("classes", Class.get_html())
