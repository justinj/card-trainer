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

var unrevealed = Symbol("unrevealed")
var revealed = Symbol("revealed")

var getStartingState = function() {
  var left = getSuit();
  var right = getSuit();
  return {
    state: unrevealed,
    left,
    right,
    sum: sum(left, right)
  };
};

// Take a state and produce the next one.
// Unrevealed states go to the corresponding revealed state,
// revealed states go to a fresh unrevealed state.
var advance = function(state) {
  if (state.state === revealed) {
    return getStartingState();
  } else {
    return {
      state: revealed,
      left: state.left,
      right: state.right,
      sum: state.sum
    };
  }
};

var firstDiv  = document.querySelector("#first");
var secondDiv = document.querySelector("#second");
var sumDiv    = document.querySelector("#sum");

var render = function(state) {
  if (state.state === unrevealed) {
    sumDiv.style.visibility = "hidden";
  } else if (state.state === revealed) {
    sumDiv.style.visibility = "";
  };
  firstDiv.innerHTML = state.left.display;
  secondDiv.innerHTML = state.right.display;
  sumDiv.innerHTML = state.sum.display;
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
