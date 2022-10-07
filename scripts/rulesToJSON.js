let yaml = require('yaml')
let fs = require('fs')
let glob = require('glob')

// this file is kindof a duplicate of RulesProvider (which serves for the local watched webpack environment) in ecolab-climat
// if it grows more than 20 lines, it should be shared

glob('data/**/*.yaml', (err, files) => {
	const rules = files.reduce((memo, filename) => {
		const data = fs.readFileSync('./' + filename, 'utf8')
		const rules = yaml.parse(data)
		return { ...memo, ...rules }
	}, {})
	glob('data/actions-plus/*.md', (err2, mdFiles) => {
		const rulesPlus = mdFiles.reduce((memo, filename) => {
			const data = fs.readFileSync('./' + filename, 'utf8')
			const dottedName = filename.replace(/(data\/actions-plus\/|\.md)/g, '')

			return { ...memo, [dottedName]: { ...memo[dottedName], plus: data } }
		}, rules)
		glob('data/guide-mode-groupe/*.md', (err2, mdFiles) => {
			const rulesPlusWithGuide = mdFiles.reduce((memo, filename) => {
				const data = fs.readFileSync('./' + filename, 'utf8')
				const guideName = filename.replace(
					/(data\/guide-mode-groupe\/|\.md)/g,
					''
				)
				return {
					...memo,
					['guide-mode-groupe']: {
						...memo['guide-mode-groupe'],
						[guideName]: data,
					},
				}
			}, rulesPlus)

			fs.writeFile(
				'./public/co2.json',
				JSON.stringify(rulesPlusWithGuide),
				function (err) {
					if (err) return console.error(err)
					console.log('Les règles en JSON ont été écrites avec succès, bravo !')
				}
			)
		})
	})
})
