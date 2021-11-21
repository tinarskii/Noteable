export type settings = {
  filePath: fs.PathLike
  autoParse: boolean
  throwError: boolean
}

export declare class Noteable {
  /**
   * Initialize a new Noteable instance
   * @param {settings} settings .noteable file path can be set to "default"
   */
  constructor(settings: settings)
  filePath: any
  notes: string
  autoParse: any
  throwError: any
  noteArray: string[]
  /**
   * Check if line is invalid
   * @returns {void|Error}
   */
  check(): void | Error
  /**
   * Check if key is valid, if not, throw an error.
   * @param {*} key
   * @returns {void|Error}
   */
  keyCheck(key: any): void | Error
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
  get(key: string): string | any
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
  set(key: string, value: string): void
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
  remove(key: string): void
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
  change(key: string, value: string): void
  /**
   * Check if a key exists
   * @param {string} key Key you want to check
   * @returns {boolean} True if key exists, false if not
   * @example
   * const note = new Noteable();
   * note.has('existsValue') // true
   * note.has('notExistValue') // false
   */
  has(key: string): boolean
  /**
   * Check type of the key value, will always return string if autoParse is disabled
   * @param {string} key A key that you want to check
   * @returns {*} A key type
   * @example
   * const note = new Noteable("default", true);
   * note.getType('years')
   * // returns 'number'
   */
  typeof(key: string): any
  /**
   * Get all keys and value
   * @returns {{ [x: string]: any; }[]|undefined} An array of keys and value
   * @example
   * const note = new Noteable();
   * note.getAllKeys()
   * // returns [{'a': 1}, {'b': 2}, {'c': ['somearr']}]
   */
  getAll(): {
    [x: string]: any
  }[]
  /**
   * Remove all keys and value
   * @returns {void}
   * @example
   * const note = new Noteable();
   * note.removeAll()
   * note.getAll()
   * // return undefined
   */
  removeAll(): void
  /**
   * Check is value is empty
   * @param {string} key A key name that you want to check
   * @returns {boolean} True if key empty, false if not
   */
  isEmpty(key: string): boolean
}

import fs = require('fs')
