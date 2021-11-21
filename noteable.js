// @ts-check
'use strict'

const fs = require('fs')
const path = require('path')
var autoParse = require('auto-parse')

class Noteable {
  /**
   * Initialize a new Noteable instance
   * @typedef {import('./types/noteable').settings} settings
   * @param {settings} settings .noteable file path can be set to "default"
   */
  constructor(settings) {
    if (
      !settings.filePath ||
      settings.filePath.toString().toLowerCase() === 'default'
    ) {
      settings.filePath = './note.noteable'
    }
    if (!fs.existsSync(path.resolve(settings.filePath))) {
      fs.writeFileSync(path.resolve(settings.filePath), '', 'utf8')
    }
    if (!settings.filePath.toString().endsWith('.noteable')) {
      throw new Error(`File path ${settings.filePath} is not a .noteable file`)
    }
    this.filePath = settings.filePath
    this.notes = fs.readFileSync(settings.filePath, 'utf8')
    this.autoParse = settings.autoParse ?? true
    this.throwError = settings.throwError ?? false
    this.noteArray = this.notes.split('\n')
    this.check()
  }
  /**
   * Check if line is invalid
   * @returns {void|Error}
   */
  check() {
    let error = this.noteArray.findIndex((line) => {
      return !line.startsWith('#') && !line.includes('=') && !(line.length <= 1) || line.split('=').length > 2
    })
    if (error !== -1) {
      throw new Error(`Line ${error + 1} is not valid`)
    }
    let data = this.noteArray.filter((line) => line.length > 1)
    fs.writeFileSync(this.filePath, data.join('\n'), 'utf8')
    return
  }
  /**
   * Check if key is valid, if not, throw an error.
   * @param {*} key
   * @returns {void|Error}
   */
  keyCheck(key) {
    if (!this.noteArray.find((note) => note.split('=')[0] === key)) {
      if (this.throwError) {
        throw new Error(`Key ${key} doesn't exist`)
      } else {
        return
      }
    }
  }
  /**
   * Get value by key
   * @param {string} key
   * @returns {string|any} A key value
   * @example
   * const note = new Noteable();
   * note.get('years')
   * // returns '2021'
   * note.get('notExistValue')
   * // returns undefined
   */
  get(key) {
    this.keyCheck(key)
    let value = this.noteArray.find((note) => note.split('=')[0] === key)
    if (!value && this.throwError) {
      throw new Error(`No note found for key: ${key}`)
    }
    if (!value) return undefined
    if (
      parseInt(this.noteArray.find((note) => note.split('=')[0] === key)) > 1
    ) {
      if (this.throwError) {
        throw new Error(`Key ${key} has duplicate value`)
      } else {
        return undefined
      }
    }
    return this.autoParse ? autoParse(value.split('=')[1]) : value.split('=')[1]
  }
  /**
   * Set a key value
   * @param {string} key A key name
   * @param {string} value A key value to assign
   * @returns {void}
   * @example
   * const note = new Noteable();
   * note.set('years', '2022')
   * note.get('years')
   * // returns '2022'
   */
  set(key, value) {
    // Check if key exists
    if (this.has(key)) {
      if (this.throwError) {
        throw new Error(`Key ${key} already exists`)
      } else {
        return
      }
    }
    let data = this.noteArray
    data.push(`${key}=${value}`)
    fs.writeFileSync(this.filePath, data.join('\n'), 'utf8')
    return
  }
  /**
   *
   * @param {string} key A key name that you want to delete
   * @returns {void}
   * @example
   * const note = new Noteable();
   * note.remove('years')
   * note.get('years')
   * // returns undefined
   */
  remove(key) {
    this.keyCheck(key)
    let data = this.notes
      .split('\n')
      .filter((note) => note.split('=')[0] !== key)
    fs.writeFileSync(this.filePath, data.join('\n'), 'utf8')
    return
  }
  /**
   * Change the value of key
   * @param {string} key A key name that you want to change
   * @param {string} value A new value to assign
   * @returns {void}
   * @example
   * const note = new Noteable();
   * note.get('years')
   * // returns '2021'
   * note.change('years', '2022')
   * note.get('years')
   * // returns '2022'
   */
  change(key, value) {
    this.keyCheck(key)
    let data = this.noteArray.map((note) => {
      if (note.split('=')[0] === key) {
        return `${key}=${value}`
      }
      return note
    })
    fs.writeFileSync(this.filePath, data.join('\n'), 'utf8')
    return
  }
  /**
   * Check if a key exists
   * @param {string} key Key you want to check
   * @returns {boolean} True if key exists, false if not
   * @example
   * const note = new Noteable();
   * note.has('existsValue') // true
   * note.has('notExistValue') // false
   */
  has(key) {
    return this.noteArray.find((note) => note.split('=')[0] === key)
      ? true
      : false
  }
  /**
   * Check type of the key value, will always return string if autoParse is disabled
   * @param {string} key A key that you want to check
   * @returns {*} A key type
   * @example
   * const note = new Noteable("default", true);
   * note.getType('years')
   * // returns 'number'
   */
  typeof(key) {
    return typeof this.get(key)
  }
  /**
   * Get all keys and value
   * @returns {{ [x: string]: any; }[]|undefined} An array of keys and value
   * @example
   * const note = new Noteable();
   * note.getAllKeys()
   * // returns [{'a': 1}, {'b': 2}, {'c': ['somearr']}]
   */
  getAll() {
    return this.noteArray.map((note) => {
      return {
        [note.split('=')[0]]: this.autoParse ? autoParse(note.split('=')[1]) : note.split('=')[1],
      }
    })
  }
  /**
   * Remove all keys and value
   * @returns {void}
   * @example
   * const note = new Noteable();
   * note.removeAll()
   * note.getAll()
   * // return undefined
   */
  removeAll() {
    fs.writeFileSync(this.filePath, '', 'utf8')
    return
  }
  /**
   * Check is value is empty
   * @param {string} key A key name that you want to check
   * @returns {boolean} True if key empty, false if not
   */
  isEmpty(key) {
    return this.get(key) === undefined || this.get(key).length === 0
  }
}

module.exports = Noteable
