class Backup {
	static objs = {}

	constructor (name) {
		Backup.objs[name] = this
		this.name = name
	}

}


class BackupView {
	static get_html () {
		let html = `Backup`
		return html
	}
}

new Content('backup', BackupView.get_html())
