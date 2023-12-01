class Content {

	static objs = {}

	static show(ref) {
		if (! Object.keys(Content.objs).includes(ref)) {
			throw "Invalid Content ref: " + ref
		}

		Object.keys(Content.objs).forEach((key) => {
			Content.objs[key].content_div.classList.add("hidden")
		})
		Content.objs[ref].content_div.classList.remove("hidden")
		
	}

	/*
	static update_src(ref) {
		let elements = document.getElementsByClassName("src-race")
		for (let i = 0; i < elements.length; i++) {
			let element = elements[i]

			let keys = Object.keys(Race.objs)
			for (let j = 0; j < keys.length; j++) {
				let key = keys[j]

				let option = document.createElement("option")
				option.value = j
				option.innerText = key

				element.appendChild(option)
			}
		}
	}
	*/

	constructor (ref, content) {
		Content.objs[ref] = this

		this.ref = ref
		this.content = content

		let content_container = document.getElementById("content-container")
		
		let content_div = document.createElement("div")
		content_div.id = "content-" + ref
		content_div.classList.add("hidden")
		content_div.innerHTML = content
		content_container.appendChild(content_div)
		this.content_div = content_div
	}

}
