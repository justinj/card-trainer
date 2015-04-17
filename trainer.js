require("style!css!less!./style.less");

var red = x => `<span style='color: red'>${x}</span>`

var club    = { display:     "♣" , value: 0 };
var diamond = { display: red("♦"), value: 1 };
var spade   = { display:     "♠" , value: 2 };
var heart   = { display: red("♥"), value: 3 };
var suits = [club, diamond, heart, spade];

var sample = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getSuit = function() {
  return sample(suits);
};

var suitMap = new Map();
suits.forEach(suit => suitMap.set(suit.value, suit));
var suitOfSum = function(s) {
  return suitMap.get(s);
}

var sum = function(left, right) {
  return suitOfSum((left.value + right.value) % suits.length);
};

var first    = Symbol("first")
var second   = Symbol("second")
var revealed = Symbol("revealed")

var getStartingState = function() {
  var left = getSuit();
  var right = getSuit();
  return {
    state: first,
    left,
    right,
    sum: sum(left, right)
  };
};

// Take a state and produce the next one.
var advance = function(state) {
  if (state.state === first) {
    return {
      state: second,
      left: state.left,
      right: state.right,
      sum: state.sum
    };
  } else if (state.state === second) {
    return {
      state: revealed,
      left: state.left,
      right: state.right,
      sum: state.sum
    };
  } else if (state.state === revealed) {
    return getStartingState();
  }
};

var elem = document.querySelector("#elem");

var render = function(state) {
  // multimethods are a pretty good idea
  if (state.state === first) {
    elem.innerHTML = state.left.display;
  } else if (state.state === second) {
    elem.innerHTML = "+ " + state.right.display;
  } else if (state.state === revealed) {
    elem.innerHTML = "= " + state.sum.display;
  } else {
    throw "Can't render " + state.state;
  }
};

var currentState = getStartingState();
render(currentState);

var SPACE = 32;
document.addEventListener("keypress", function(e) {
  if (e.which === SPACE) {
    currentState = advance(currentState);
    render(currentState);
  }
});
