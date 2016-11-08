import { getListener } from './operation'

let Element

export function setElement (El) {
  Element = El
}

/**
 * A map which stores all type of elements.
 * @type {Object}
 */
export const elementTypes = {}

/**
 * Register an extended element type with component methods.
 * @param  {string} type    component type
 * @param  {array}  methods a list of method names
 */
export function registerElement (type, methods) {
  // Skip when no special component methods.
  if (!methods || !methods.length) {
    return
  }

  // Init constructor.
  const XElement = function (props) {
    Element.call(this, type, props, true)
  }

  // Init prototype.
  XElement.prototype = Object.create(Element.prototype)
  XElement.prototype.constructor = Element

  // Add methods to prototype.
  methods.forEach(methodName => {
    XElement.prototype[methodName] = function (...args) {
      const listener = getListener(this.docId)
      if (listener) {
        listener.callComponentMethod(this.ref, type, methodName, args)
      }
    }
  })

  // Add to element type map.
  elementTypes[type] = XElement
}

/**
 * Clear all element types. Only for testing.
 */
export function clearElementTypes () {
  for (const type in elementTypes) {
    delete elementTypes[type]
  }
}

