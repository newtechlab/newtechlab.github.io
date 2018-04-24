// Predictable RNG from SO
// https://stackoverflow.com/questions/424292/seedable-javascript-random-number-generator
function RNG(seed) {
    // LCG using GCC's constants
    this.m = 0x80000000; // 2**31;
    this.a = 1103515245;
    this.c = 12345;
  
    this.state = seed ? seed : 3;
  }
  RNG.prototype.nextInt = function() {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
  }
  RNG.prototype.nextFloat = function() {
    // returns in range [0,1]
    return this.nextInt() / (this.m - 1);
  }
  RNG.prototype.nextRange = function(start, end) {
    // returns in range [start, end): including start, excluding end
    // can't modulu nextInt because of weak randomness in lower bits
    var rangeSize = end - start;
    var randomUnder1 = this.nextInt() / this.m;
    return start + Math.floor(randomUnder1 * rangeSize);
  }
  RNG.prototype.choice = function(array) {
    return array[this.nextRange(0, array.length)];
  }
var mrnd = new RNG(0)

// Lay out a list of items, based on impact and on distance, one by one.
// We lay them out in rows of three, to each element in list adding both
// row and col telling is where they should be positioned, as well as a
// fuzz value [x,y]
var layout = function(list) {
    let last = 2
    let row = -1
    list.map((it, i) => {
        switch(last) {
            case 0:
                last = mrnd.nextRange(0,2)
                if(last == 0) {
                    last = 2
                    list[i].row = row
                    list[i].col = last
                    break
                } else {
                    last = 2
                    row++
                }
            case 1:
            case 2:
                row++ 
                last = mrnd.nextRange(0,3)
                list[i].row = row
                list[i].col = last
        }
    })
    list.map((it,i) => {
        list[i].fuzz = [mrnd.nextFloat(), mrnd.nextFloat()]
    })
}



  