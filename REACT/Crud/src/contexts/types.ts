export type TCrudContextDispatch<T> = (items: T[]) => void
export type THaveId = {_id: string}
export type TCrudItem = {[key: string]: unknown} & THaveId