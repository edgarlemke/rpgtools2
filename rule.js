class Rule {
	static get_html() {
		return `
<section id="rules-container">
	<h3>Creating Chars</h3>
	<p>Every player must create a Char to play.<p>
	<p>
		When creating a Char, a player must choose:
		<ul>
			<li>a name</li>
			<li>an age</li>
			<li>a race</li>
			<li>a class - <small>however some races don't have classes, so not all Chars have a class</small></li>
			<li>a primary motivation</li>
			<li>some secondary motivation(s)</li>
			<li>three virtues - and they are:
				<small>
					<b>Abstemious</b>,
					<b>Gentle</b>,
					<b>Insightful</b>,
					<b>Clean</b>,
					<b>Faithful</b>,
					<b>Discrete</b>,
					<b>Careful</b>,
					<b>Attentive</b>,
					<b>Altruistic</b>,
					<b>Humble</b>,
					<b>Dedicated</b>,
					<b>Punctual</b>,
					<b>Peaceful</b>,
					<b>Clear</b>,
					<b>Temperate</b>,
					<b>Polite</b>,
					<b>Erudite</b>,
					<b>Forgiving</b>,
					<b>Tolerant</b>,
					<b>Funny</b>,
					<b>Honest</b>,
					<b>Beautiful</b>,
					<b>Planner</b>,
					<b>Athletic</b>,
					<b>Competent</b>,
					<b>Performatic</b>
				</small>
			</li>
			<li>three defects - and they are:
				<small>
					<b>Addicted</b>,
					<b>Rude</b>,
					<b>Naive</b>,
					<b>Dirty</b>,
					<b>Promiscuous</b>,
					<b>Indiscreet</b>,
					<b>Careless</b>,
					<b>Inattentive</b>,
					<b>Narcisist</b>,
					<b>Egocentric</b>,
					<b>Arrogant</b>,
					<b>Lazy</b>,
					<b>Delayed</b>,
					<b>Violent</b>,
					<b>Prolix</b>,
					<b>Fanatic</b>,
					<b>Cleptomaniac</b>,
					<b>Perverted</b>,
					<b>Uncultured</b>,
					<b>Spiteful</b>,
					<b>Gluttonous</b>,
					<b>Intolerant</b>,
					<b>Annoying</b>,
					<b>Manipulator</b>,
					<b>Ugly</b>,
					<b>Inconsequential</b>
				</small>
			</li>
			<li>a background story</li>
		</ul>
	</p>
	<p>Every player must distribute 5 points along their Char's Hability Points.</p>
	<p>The habilities are: Strength, Agility, Dextrity, Intelligence and Charisma.</p>
	<p>The sum of habilities comes from Race, Class, player chosen points and items (rings).</p>
	<p>They can also change, depending on Status being applied to the Char.</p>
	<p>Take in account that the Base Total of at least one hability should be at least 10 for effective combat.</p>
	<p>It's also important to align: Hability Points, aimed Aptitudes, Weapons and chosen Actions</p>
</section>
<section>
	<h3>Aptitudes and Resistances</h3>
	<p>Every Char can earn Aptitudes and Resistances Points in combat. They end up make a difference in Attack success calculation and in Attack Damage.</p>
	<p>Every time an attack is done succesfully, both the attacker and the attacked roll a D20.
	If the result is greater or equal than 18 for the attacker, an Aptitude point is earned.
	If the result is greater or equal than 15 for the attacked, an Resistance point is earned.
	</p>
	<p>Aptitude and Resistance points are added according to the Damage Type of the Attack</p>
	<p>The Damage Types are:
		<small>
			<b>Air</b>, <b>Water</b>, <b>Fire</b>, <b>Earth</b>, <b>Psychic</b>, <b>Invocation</b>, <b>Perfuration</b>, <b>Cutting</b>, <b>Shooting</b>, <b>Explosion</b>, <b>Impact</b>, <b>Cheese</b>, <b>Electricity</b>, <b>Acid</b>, <b>Poison</b>, <b>Throwing</b>
		</small>
	</p>
</section>
<section>
	<h3>Action Points</h3>
	<p>Every player starts with 10 Action Points.<p>
	<p>They're used to allocate Action Slots, adding new actions to the total of actions a player can do. Every new Action Slot takes 2 Action Points.</p>
	<p>And they're also used to level up Attack actions. Every level up takes 1 Action Point and makes an Attack Damage (AD) 20% stronger. </p>
</section>
<section>
	<h3>Shopping</h3>
	<p>Every player starts with 200 coins.</p>
	<p>It's recommended to buy, in this order:
		<ul>
			<li>a primary weapon</li>
			<li>ammo for the primary weapon, if appropriate</li>
			<li>a secondary weapon</li>
			<li>ammo for the secondary weapon, if appropriate</li>
			<li>defenses</li>
			<li>hability rings and drugs</li>
			<li>random generics</li>
		</ul>
	</p>
</section>
<section>
	<h3>Combat</h3>
	<p>Combat is structured in a Round-Robin system, the order is decided with D20 results + players Agility points.</p>
	<p>If there's some tie in ordering, the DM arranges the order, so previously arranged order is kept, and the contenders of the tie can roll D20s to untie.</p>
	<p>In combat, every Char can do up to 3 actions, in any order: an <b>Attack</b>, a <b>Trick</b> and a <b>Movement</b>.</p>
	<p>
		<b>Attacks</b> are actions that cause damage and they have quite a complex calculation:

	<div><b>TEST:</b> ((AH + AA + AW + D20) - (TH + TR + TD)) >= DIF</div>
	<div><b>ATTACK DAMAGE (AD):</b> BD + ((AH + AA + D20 + WD) * (1 + ((AL - 1) * 0.2)))</div>
	<div><b>DAMAGE:</b> ((AD - (TR + TDP)) / TC) * DIF * MUL</div>
	<div><small>When damage isn't integer, it's rounded down.</small></div>

	<ul>
		<li>BD - Base Damage</li>
		<li>AH - Attacker Hability</li>
		<li>AA - Attacker Aptitude in Damage Type</li>
	        <li>AW - Attacker Weapon Attack Points</li>
		<li>D20 - Attacker D20</li>
		<li>WD - Weapon Damage</li>
		<li>AL - Action Level</li>
		<li>TH - Target Hability</li>
		<li>TR - Target Resistance against Damage Type</li>
        	<li>TD - Target Defenses Defense Points</li>
		<li>TDP - Target Defenses Protection Points</li>
		<li>TC - Target Count</li>
		<li>DIF - Action Difficulty</li>
		<li>MUL - Multiplier - 2 if D20 == 20, else 1</li>
	</ul>
	</p>
	<p><b>Tricks</b> are special actions, they cause no damage but cause the player to get some Status, and each have different a calculation...</p>
	<p><b>Movements</b> are actions such as Hiding, Withdrawing, yelling something to someone else, throwing an item to someone (no damage or effects directly), taking a drug and others...</p>
</section>
`
	}
}

try {
	new Content("rules", Rule.get_html())
} catch (e) {}
