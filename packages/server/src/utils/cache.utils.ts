export class Cached<T> {
  private readonly getter: () => Promise<T>
  private cache: T | null = null

  constructor(_getter: () => Promise<T>) {
    this.getter = _getter
  }

  async get() {
    if (this.cache === null) {
      this.cache = await this.getter()
    }
    return this.cache
  }

  async refresh() {
    this.cache = await this.getter()
  }

  async clear() {
    this.cache = null
  }

  isCached() {
    return this.cache !== null
  }
}
