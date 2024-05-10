class Backup {
	static objs = {}

	static prefix = 'backup-clash-of-desires-'
	static rate = 60 // seconds
	static limit = 100 // limit of backup objects stored

	static export_localStorage () {
		const now_str = (new Date()).toLocaleString().replace(/\s/g, '_').replace(/\,/g, '_').replace(/\:/g, '_')
		const backup = new Backup(Backup.prefix + now_str)

		// check if current backup is different than last stored backup
		const keys = Backup.get_localstorage_keys()
		const last_key = keys[0]

		// stringified, decycled container
		const last_backup = localStorage.getItem(last_key)

		const str_container = JSON.stringify(backup.container)

		const has_changes = last_backup != str_container
		if (has_changes) {
			while (keys.length >= Backup.limit) {
				const index = keys.length - 1
				const old_key = keys[index]
				localStorage.removeItem(keys[index])
				keys.splice(index, 1)
				console.log('Removed backup from localStorage: ' + old_key)
			}

			localStorage.setItem(backup.name, JSON.stringify(backup.container))
			console.log('Saved backup to localStorage: ' + backup.name, backup)
		}
		else {
			console.log('No changes to save to localStorage')
		}

		return has_changes
	}

	static import_container_obj (container_obj) {
		// restore Char
		Object.keys(container_obj.Char).forEach((char_name) => {
			const char_obj = container_obj.Char[char_name]
			const c = char_obj
			console.log(c)

			const new_char_obj = new Char(c.name, c.age, c.level, c.race, c.class,
				c.primary_motivation, c.secondary_motivations, c.virtues, c.defects,
				c.stats_objs.player, c.story, c.aptitudes, c.resistances, c.actions_obj)
			new_char_obj.health = c.health
			new_char_obj.status = c.status
			new_char_obj.status_turns = c.status_turns

			const new_inventory = new Inventory(char_obj)
			Object.keys(char_obj.inventory_obj).forEach((key) => {
				// skip char_obj as it's already been set
				if (key == "char_obj") {
					return
				}
				new_inventory[key] = char_obj.inventory_obj[key]
			})
			new_char_obj.inventory_obj = new_inventory
		})
		CharView.update()

		// restore Team
		Team.objs = container_obj.Team
		// console.log(Team.objs)
		CombatView.update_team()

		// restore Combat
		Object.keys(container_obj.Combat).forEach((combat_name) => {
			const combat_obj = container_obj.Combat[combat_name]
			const new_combat = new Combat(combat_name, combat_obj.order_obj, combat_obj.teams, true)

			Object.keys(combat_obj).forEach((key) => {
				new_combat[key] = combat_obj[key]
			})
		})

		CombatView.update_combat()
	}

	static get_localstorage_keys () {
		const keys = []
	
		for (var i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i)
			const item = localStorage.getItem(key)
	
			if (key.indexOf(Backup.prefix) != 0) {
				continue
			}
	
			keys.push(key)
		}

		keys.sort(function(a,b) {
			const toDate = (local_storage_key) => {
				const split_local_storage_key = local_storage_key.substring('backup-clash-of-desires-'.length).split('__')
				const d = split_local_storage_key[0].split('/')
				const t = split_local_storage_key[1].split('_')
				return new Date(d[2], d[1], d[0], t[0], t[1], t[2])
			}
			const a_date = toDate(a)
			const b_date = toDate(b)
			return a_date > b_date ? -1 : a_date < b_date ? 1 : 0
		})

		return keys
	}

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
<section>
	<h2>JSON</h2>

	<button onclick="BackupView.export()">Export</button>
	<input type="file" id="backup-import-file" style="display: none;" onchange="BackupView.import(event)"/>
	<button onclick="BackupView.import_file.click()">Import</button>
</section>

<section>
	<h2>Local Storage (Browser)</h2>
	<div id="backup-local-storage">
		<div id="backup-local-storage-head">
			<div class="table-cell">Name</div>
			<div class="table-cell">Size</div>
			<div class="table-cell"></div>
		</div>
		<div id="backup-local-storage-body">
		</div>
	</div>
</section>
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
		link.download = Backup.prefix + now_str + '.json'
		link.click()
	}

	static import (event) {
		const file = event.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = function (event) {
				const content = event.target.result
				const container_obj = JSON.retrocycle( JSON.parse(content) )
				Backup.import_container_obj(container_obj)
				new Modal('Backup imported', `JSON "${file.name}" backup imported!`)
			}
			reader.readAsText(file)
		}
	}

	static fill_local_storage () {
		const keys = Backup.get_localstorage_keys()
		remove_children(BackupView.local_storage_body)
	
		var size = 0
		for (var i = 0; i < keys.length; i++) {
			const key = keys[i]
			const item = localStorage.getItem(key)
	
			if (key.indexOf(Backup.prefix) != 0) {
				continue
			}
	
			size += item.length
	
			const backup_div = document.createElement('template')
			backup_div.innerHTML = `
<div class="table-cell">
<div class="grid-item">${key}</div>
<div class="grid-item">${item.length}</div>
<div class="grid-item"><button onclick="BackupView.load_localStorage('${key}')">Load</button></div>
</div>
	`
			BackupView.local_storage_body.appendChild(... backup_div.content.children)
		}
	
		console.log('There are ' + keys.length + ' backups occupying ' + size * 2 + ' bytes')
	}

	static load_localStorage (key) {
		const item = localStorage.getItem(key)
		const container_obj = JSON.retrocycle( JSON.parse(item) )
		Backup.import_container_obj(container_obj)
		new Modal('Backup imported', `localStorage "${key}"  backup imported!`)
	}
}

new Content('backup', BackupView.get_html())

BackupView.import_file = document.getElementById('backup-import-file')
BackupView.local_storage = document.getElementById('backup-local-storage')
BackupView.local_storage_head = document.getElementById('backup-local-storage-head')
BackupView.local_storage_body = document.getElementById('backup-local-storage-body')
BackupView.local_storage_body_scroll = document.getElementById('backup-local-storage-body-scroll')

window.setInterval(() => {
	const keys = Backup.get_localstorage_keys()

	

	if (Backup.export_localStorage()) {
		BackupView.fill_local_storage()
	}

}, 1000 * Backup.rate )


BackupView.fill_local_storage()
