//============PSEUDOCLASSICAL
var makeFadingDancer = function (top, left, timeBetweenSteps) {
  makeDancer.call(this, top, left, timeBetweenSteps);
  this.$node.addClass('fadingDancer');
  // this.$node = $('<span class="fadingDancer"></span>');
  // this.step(timeBetweenSteps);
  // this.setPosition(top, left);
};
makeFadingDancer.prototype = Object.create(makeDancer.prototype);
makeFadingDancer.prototype.constructor = makeFadingDancer;
makeFadingDancer.prototype.step = function () {
  makeDancer.prototype.step.call(this);
};