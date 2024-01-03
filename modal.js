class Modal {
	static objs = []

	constructor (title, content, onload) {
		Modal.objs.push(this)

		this.id = Modal.objs.length - 1
		this.title = title
		this.content = content

		const template = document.createElement('template')
		template.innerHTML = `
<div class="overlay" id="modal-overlay-${this.id}">
	<div class="modal">
		<div class="modal-header">
			<div class="modal-title"><h3>${this.title}</h3></div>
			<div class="modal-close-button" onclick="Modal.close(${this.id})">x</div>
		</div>
		<div class="modal-body">
			${this.content}
		</div>
	</div>
</div>
`
		window.scrollTo(0, 0)

		window.document.body.appendChild(...template.content.children)

		if (onload) {
			onload()
		}
	}

	static close (id) {
		const overlay = document.getElementById('modal-overlay-' + id)
		overlay.parentElement.removeChild(overlay)
		Modal.objs.splice(id, 1)
	}
}
