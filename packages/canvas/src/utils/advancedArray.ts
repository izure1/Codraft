interface FindableItem {
  id: string
}

export function getItemFromID<T extends FindableItem>(sources: T[], id: string): T|null {
  return sources.find((source) => source.id === id) ?? null
}

export function hasItemFromID<T extends FindableItem>(sources: T[], id: string): boolean {
  return !!getItemFromID(sources, id)
}

export function add<T>(sources: T[], item: T): T[] {
  const clone = [...sources]
  if (!clone.includes(item)) {
    clone.push(item)
  }
  return clone
}

export function addFromID<T extends FindableItem>(sources: T[], item: T): T[] {
  const clone = [...sources]
  if (!hasItemFromID(sources, item.id)) {
    clone.push(item)
  }
  return clone
}

export function remove<T>(sources: T[], item: T): T[] {
  const clone = [...sources]
  const i = clone.findIndex((src) => src === item)
  if (i !== -1) {
    clone.splice(i, 1)
  }
  return clone
}

export function removeFromID<T extends FindableItem>(sources: T[], id: string): T[] {
  const clone = [...sources]
  const i = clone.findIndex((src) => src.id === id)
  if (i !== -1) {
    clone.splice(i, 1)
  }
  return clone
}

export function has<T>(sources: T[], item: T): boolean {
  return sources.includes(item)
}