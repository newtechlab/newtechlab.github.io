// Predictable RNG from SO - used so we always get the same placement if we will later re-draw
// https://stackoverflow.com/questions/424292/seedable-javascript-random-number-generator
function RNG() {
    this.m = 0x80000000; this.a = 1103515245; this.c = 12345;
    this.state = 0;
}
RNG.prototype.int = function() {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
}
RNG.prototype.float = function() {
    return this.int() / (this.m - 1);
}
var mrnd = new RNG(0)

// Simply do it presciptive, we want it to be reproducible regardless
var layout = function(list) {
    let p = [
        // TODO: Make this list longer
        {col: 0, row: 0, x: mrnd.float(), y: mrnd.float()},
        {col: 2, row: 0, x: mrnd.float(), y: mrnd.float()},
        {col: 1, row: 1, x: mrnd.float(), y: mrnd.float()},
        {col: 0, row: 2, x: mrnd.float(), y: mrnd.float()},
        {col: 2, row: 2, x: mrnd.float(), y: mrnd.float()},
        {col: 1, row: 3, x: mrnd.float(), y: mrnd.float()},
        {col: 0, row: 4, x: mrnd.float(), y: mrnd.float()},
        {col: 1, row: 5, x: mrnd.float(), y: mrnd.float()},
        {col: 0, row: 6, x: mrnd.float(), y: mrnd.float()},
        {col: 2, row: 6, x: mrnd.float(), y: mrnd.float()},
        {col: 1, row: 7, x: mrnd.float(), y: mrnd.float()},
    ]
    list.map((it, i) => {
        list[i].col = p[i].col
        list[i].row = p[i].row
        list[i].fuzz = [p[i].x, p[i].y]
    })
}



  