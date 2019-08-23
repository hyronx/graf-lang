export class Point {
  /**
   * @field {number} x
   * @field {number} y
   */
  x
  y

  /**
   * Constructs a new Point
   * @param {number|string} x
   * @param {number|string} y
   */
  constructor(x, y) {
    this.x = Number(x)
    this.y = Number(y)
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
    }
  }
}

export class Position extends Point {
  /**
   * Constructs a new Position
   * @param {number|string} x
   * @param {number|string} y
   * @param {number} column
   */
  constructor(x, y, column) {
    super(x, y)
    this.column = Number(column)
  }

  toJSON() {
    return {
      ...super.toJSON(),
      column: this.column,
    }
  }
}
