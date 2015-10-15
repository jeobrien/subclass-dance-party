//============PSEUDOCLASSICAL
var makeSlidingDancer = function (top, left, timeBetweenSteps) {
  // makeDancer.call(this, top, left, timeBetweenSteps);
  makeDancer.call(this, top, left, timeBetweenSteps);
  this.$node.addClass('slidingDancer');
  // this.$node = $('<span class="slidingDancer"></span>');
  // this.step(timeBetweenSteps);
  // this.setPosition(top, left);
};
makeSlidingDancer.prototype = Object.create(makeDancer.prototype);
makeSlidingDancer.prototype.constructor = makeSlidingDancer;
makeSlidingDancer.prototype.step = function () {
  makeDancer.prototype.step.call(this);
};