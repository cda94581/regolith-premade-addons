const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

let settings = process.argv[2];
let type = 'stable';
let teams = 4;
try {
	settings = JSON.parse(settings);
	type = settings.type;
	teams = settings.teams;
} catch { }

if (type != 'custom') {
	if (!fs.existsSync('BP')) fs.mkdirSync('BP');
	if (!fs.existsSync('BP/entities')) fs.mkdirSync('BP/entities');
	const file = fs.createWriteStream('BP/entities/player.json', 'utf-8');
	https.get(`https://raw.githubusercontent.com/bedrock-dot-dev/packs/master/${type}/behavior/entities/player.json`, res => res.pipe(file));
	file.on('finish', () => {
		file.close();
		console.log('Downloaded player.json file for use.');
		next();
	});
} else next();

function next() {
	console.log('Opening player.json file.');
	let data = JSON.parse(fs.readFileSync('BP/entities/player.json', 'utf-8'));
	console.log('Editing player.json file to incorporate teams.');
	if (!data['minecraft:entity'].components['minecraft:damage_sensor']) data['minecraft:entity'].components['minecraft:damage_sensor'] = { triggers: [] };
	if (!Array.isArray(eval(data['minecraft:entity'].components['minecraft:damage_sensor'].triggers))) data['minecraft:entity'].components['minecraft:damage_sensor'].triggers = [ data['minecraft:entity'].components['minecraft:damage_sensor'].triggers ];
	let trigger = {
		on_damage: { filters: { any_of: [] } },
		deals_damage: false
	};
	for (let t = 1; t <= teams; t++) {
		const filter = {
			all_of: [
				{
					test: 'has_tag',
					subject: 'other',
					value: `team${t}`
				},
				{
					test: 'has_tag',
					subject: 'self',
					value: `team${t}`
				}
			]
		}
		trigger.on_damage.filters.any_of.push(filter);
	}
	data['minecraft:entity'].components['minecraft:damage_sensor'].triggers.push(trigger);

	console.log(`Writing modified player.json file with ${teams} teams.`);
	fs.writeFile('BP/entities/player.json', JSON.stringify(data, null, '\t'), 'utf-8', err => { if (err) throw err; });

	if (fs.existsSync('BP/manifest.json')) return;
	console.log('Generating manifest.json.');
	const manifest = {
		format_version: 2,
		header: {
			description: `Teams add-on which supports up to ${teams} teams.\n\nCreated using a §oregolith§r script made by §l§ccda94581§r.`,
			name: `Teams add-on (${teams} teams)`,
			uuid: crypto.randomUUID(),
			version: [ 1, 0, 0 ],
			min_engine_version: [ 1, 18, 0 ]
		},
		modules: [{
			type: 'data',
			uuid: crypto.randomUUID(),
			version: [ 1, 0, 0 ]
		}]
	}
	console.log('Writing manifest.json.');
	fs.writeFile('BP/manifest.json', JSON.stringify(manifest, null, '\t'), 'utf-8', err => { if (err) throw err; });

	if (fs.existsSync('BP/pack_icon.png')) return;
	console.log('Creating pack_icon.png.');
	fs.copyFile('data/premade-scalable-teams/pack_icon.png', 'BP/pack_icon.png', err => { if (err) throw err; });
	
	console.log('Success!');
}