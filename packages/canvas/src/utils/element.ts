export function isElement(node: unknown): node is HTMLElement {
  return node instanceof HTMLElement
}

export function isTextNode(node: unknown): node is Text {
  return node instanceof Text
}