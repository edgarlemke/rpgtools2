function fill_select (element, keys) {
	//console.log(element_id)

	//let element = document.getElementById(element_id)
	//console.log(element)
	remove_children(element)

	for (let i = 0; i < keys.length; i++) {
		let key = keys[i]
		//console.log(key)

		let option = document.createElement("option")
		option.value = i
		option.innerText = key

		element.appendChild(option)
	}
}


function fill_table (element_id, keys) {
	//console.log(element_id)
	//console.log(keys)

	let columns = 6
	let lines = Math.ceil(keys.length / columns)
	//console.log(lines)

	let table = document.getElementById(element_id)
	//console.log(table)

	let idx = 0
	for (let i = 0; i < lines; i++) {
		let tr = document.createElement("tr")

		for (let j = 0; j < columns; j++) {
			let td = document.createElement("td")
			tr.appendChild(td)

			if (idx <= keys.length - 1) {
				td.innerHTML = `<input type="checkbox" /> <label>${keys[idx]}</label>`
			}

			idx += 1
		}

		table.tBodies[0].appendChild(tr)
	}
}


function remove_children (element) {
	for (let i = element.children.length - 1; i >= 0; i--) {
		const child = element.children[i]
		element.removeChild(child)
	}
}
