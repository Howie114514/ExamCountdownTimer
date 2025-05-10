export function calcDays(d1: Date, d2: Date): number {
  return Math.floor((asDate(d1) as any) - (d2 as any)) / (24 * 60 * 60 * 1000)
}
export function today() {
  let d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
export function asDate(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
console.log(today())

export namespace settings {
  export function readDate(key: string, defaultValue = '2025-1-1') {
    return new Date(localStorage[key] ?? defaultValue)
  }
  export function read(key: string, defaultValue: string = '') {
    return (localStorage[key] as string) ?? defaultValue
  }
  export function readBoolean(key: string, defaultValue: boolean = false) {
    return ((localStorage[key] as string) ?? defaultValue).toString() == 'true' ? true : false
  }
  export function readInt(key: string, defaultValue: number = 0) {
    return parseInt((localStorage[key] as string) ?? defaultValue)
  }
}
