class Backup {
	static objs = {}

	constructor (name) {
		Backup.objs[name] = this
		this.name = name

        const container = {
			Char : Char.objs,
			Team : Team.objs,
			Combat : Combat.objs
		}

		this.container = JSON.decycle(container)
	}
}


class BackupView {
	static get_html () {
		let html = `
<button onclick="BackupView.export()">Export</button>

<input type="file" id="backup-import-file" style="display: none;" onchange="BackupView.import(event)"/>
<button onclick="BackupView.import_file.click()">Import</button>
`
		return html
	}

	static export () {
		const now_str = (new Date()).toLocaleString().replace(/\s/g, '_').replace(/\,/g, '_').replace(/\:/g, '_')

		const backup_obj = new Backup(now_str)
		const json_text = JSON.stringify(backup_obj.container)

		const blob = new Blob([json_text], {type:'application/octet-stream'})
		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = 'backup-clash-of-desires-' + now_str + '.json'
		link.click()
	}

	static import (event) {
		const file = event.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = function (event) {
				const content = event.target.result
				const container_obj = JSON.retrocycle( JSON.parse(content) )

				// restore Char
				Object.keys(container_obj.Char).forEach((char_name) => {
					const char_obj = container_obj.Char[char_name]
					const new_inventory = new Inventory(char_obj)
					Object.keys(char_obj.inventory_obj).forEach((key) => {
						// skip char_obj as it's already been set
						if (key == "char_obj") {
							return
						}
						new_inventory[key] = char_obj.inventory_obj[key]
					})
					char_obj.inventory_obj = new_inventory
					Char.objs[char_name] = char_obj
				})
				CharView.update()

				// restore Team
				Team.objs = container_obj.Team
				console.log(Team.objs)
				CombatView.update_team()

				// restore Combat
				Object.keys(container_obj.Combat).forEach((combat_name) => {
					const combat_obj = container_obj.Combat[combat_name]
					const new_combat = new Combat(combat_name, combat_obj.order_obj)

					Object.keys(combat_obj).forEach((key) => {
						new_combat[key] = combat_obj[key]
					})
				})

				CombatView.update_combat()
			}
			reader.readAsText(file)
		}
	}
}

new Content('backup', BackupView.get_html())

BackupView.import_file = document.getElementById('backup-import-file')
