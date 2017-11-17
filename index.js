const fs = require('fs')
const path = require('path')
const {chain} = require('lodash')

// Word blacklists
const englishWords = require('an-array-of-english-words')
const maleFirstNames = require('datasets-male-first-names-en')
  .map(name => name.toLowerCase())
const femaleFirstNames = require('datasets-female-first-names-en')
  .map(name => name.toLowerCase())
const cityNames = require('all-the-cities')
  .map(city => city.name.toLowerCase())
const countryNames = require('country-list')()
  .getNames()
  .map(country => country.toLowerCase())

const text = fs.readFileSync(path.join(__dirname, 'phoenix.txt'), 'utf8')

function clean(word) {
  return word
    .replace(/[^a-z-']/ig, '')
    .replace(/'s$/, '')
}

const words = chain(text.split(/\s/))
  .compact()
  .map(clean)
  .compact()
  .uniq()
  .filter(word => !word.includes('\''))
  .filter(word => !word.includes('-'))
  .filter(word => word.length > 1)
  .filter(word => !englishWords.includes(word.toLowerCase()))
  .filter(word => !maleFirstNames.includes(word.toLowerCase()))
  .filter(word => !femaleFirstNames.includes(word.toLowerCase()))
  .filter(word => !cityNames.includes(word.toLowerCase()))
  .filter(word => !countryNames.includes(word.toLowerCase()))
  .sort((a,b) => a.localeCompare(b))
  .value()

console.log(`# Harry Potter Words

> ${words.length} terms you won't find in a muggle dictionary.

${words.map(word => '- ' + word).join('\n')}

`)
