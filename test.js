class TestView {
	static get_html () {	
		const template = `
<div>
	<section>
		<div>
			Action:
			<input type="text" id="test-name" />
		</div>
		<div>
			Description:
			<textarea id="test-description"></textarea>
		</div>
		<div>
			Type:
			<select id="test-type-selector" onchange="TestView.select_type()">
				<option>Arbitrary</option>
				<option>Attack</option>
				<option>Attack with Advantage</option>
				<option>Trick</option>
			</select>
		</div>
		<div>
			Char:
			<select id="test-char-selector"></select>
		</div>
		<div>
			D20:
			<input type="number" id="test-d20" />
		</div>

	</section>

	<section>
		<div id="test-arbitrary-container">
			<div>
				Hability:
				<select id="test-arbitrary-hability-selector"></select>
			</div>
			<div>
				Difficulty:
				<input type="number" id="test-arbitrary-difficulty" min="0" value="0" />
			</div>
			<div>
				Requires showing:
				<input type="checkbox" id="test-arbitrary-requires-showing" />
			</div>
		</div>

		<div id="test-attack-container">
		</div>

		<div id="test-attack-advantage-container">
		</div>

		<div id="test-trick-container">
		</div>
	</section>
</div>
`
		return template
	}


	static select_type () {
		const type = TestView.type_selector.selectedOptions[0].innerText
	}

}

new Content('test', TestView.get_html())
TestView.type_selector = document.getElementById('test-type-selector')
