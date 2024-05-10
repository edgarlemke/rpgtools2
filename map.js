class Map {
	static objs = {}

	constructor (name) {
		Map.objs[name] = this
	}
}

class MapView {
	static draw_hexagon(x, y, size) {
		const ctx = MapView.canvas.getContext('2d')

        ctx.beginPath();
        ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));

        for (var i = 1; i <= 6; i++) {
            ctx.lineTo(x + size * Math.cos(i * 2 * Math.PI / 6), y + size * Math.sin(i * 2 * Math.PI / 6));
        }

        ctx.closePath();
        ctx.stroke();
    }

    static drawSquare(x, y, size) {
		const ctx = MapView.canvas.getContext('2d')

        ctx.beginPath();
        ctx.rect(x, y, size, size);
        ctx.stroke();
    }

	static get_html () {
		const html = `
<div id="map-container">
	<div id="map-creation-container">
		<h1>Creation</h1>

		<div>
			<select id="map-selector">
				<option></option>
			</select>
		</div>
	
		<div>
			<label for="map-name">Name</label>
			<input type="text" id="map-name" />
		</div>
	
		<div>
			<label for="map-lines">Lines</label>
			<input type="number" id="map-lines" min="1" max="7" />
		</div>
	
		<div>
			<label for="map-columns">Columns</label>
			<input type="number" id="map-columns" min="1" max="18" />
		</div>
	
		<button>Create map</button>
	</div>

	<div>
		<h1>Grid</h1>
		<canvas id="map-canvas" width="1799" height="699"/>
	</div>
</div>`
		return html
	}

	static draw_grid () {

		const lines = 7
		const columns = 18
		const factor = 100

		for (let i = 0; i < lines; i++) {
			for (let j = 0; j < columns; j++) {
				MapView.drawSquare((factor*j), (factor*i), factor)
			}
		}

	}
}

new Content('map', MapView.get_html()) 

MapView.container = document.getElementById('map-container')
MapView.canvas = document.getElementById('map-canvas')

MapView.draw_grid()
