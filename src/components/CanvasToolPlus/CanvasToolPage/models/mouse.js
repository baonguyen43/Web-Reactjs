/**
 * handle mouse event
 */
function Mouse() {
  this.dataDown = {};
  this.dataUp = {};
  /**
   *
   * @param {IEvent} e
   * @returns {IEvent} IEvent current
   */
  this.eventDown = (e = null) => {
    if (e) {
      this.dataDown = e;
    }
    return this.dataDown;
  };
  /**
   *
   * @param {IEvent} e
   * @returns {IEvent} IEvent current
   */
  this.eventUp = (e = null) => {
    if (e) {
      this.dataUp = e;
    }
    return this.dataUp;
  };
  /**
   *
   * @returns {{x:Number,y:Number}}
   */
  this.getPointerDown = () => {
    return this.dataDown.pointer;
  };
  /**
   *
   * @returns {{x:Number,y:Number}}
   */
  this.getPointerUp = () => {
    return this.dataUp.pointer;
  };
  /**
   *
   * @returns {{ top:Number, left:Number, width:Number, height:Number }}
   */
  this.getShape = () => {
    const pointerDown = this.dataDown.pointer;
    const pointerUp = this.dataUp.pointer;
    //
    const width = Math.abs(pointerUp.x - pointerDown.x);
    const height = Math.abs(pointerUp.y - pointerDown.y);
    const [top, left] = [Math.min(pointerDown.y, pointerUp.y), Math.min(pointerDown.x, pointerUp.x)]; //coordinates closest to the origin
    return { top, left, width, height };
  };
}

export default Mouse;
