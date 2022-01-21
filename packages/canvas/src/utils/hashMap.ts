interface HashMapSource {
  id: string
  [key: string]: any
}

export function createHashMap<T extends HashMapSource>(sources: T[]): Map<string, T> {
  const map = new Map<string, T>()
  sources.forEach((source) => {
    map.set(source.id, source)
  })
  return map
}