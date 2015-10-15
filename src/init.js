
var move = function (node,x,y){
  var newX = node.left+x;
  var newY = node.top-y;
  node.setPosition(newY,newX);
}
var moveIntoPairs = function (node1, node2, steps) {
  var difY = (node1.top - node2.top)/2;
  var difX = (node2.left - node1.left)/2;
  var space = 50;
  if (difX<0){
    difX +=space;
  } else {
    difX-=space;
  }
  var time = 2000/steps;
  var counter = 0;
  //for (var i = 0; i <= steps; i++) {
  var timer = setInterval(function (){
    if (counter > steps) {
      clearInterval(timer);
    }
    move(node1,difX/steps,difY/steps);
    counter ++;

  },time);
  //};
};

var pythagorean = function (top1, top2, left1, left2) {
  return Math.sqrt(Math.pow((top1-top2),2) + Math.pow((left1-left2),2));
};

var distance = function (node1, node2){
  return pythagorean(node1.top,node2.top,node1.left,node2.left);
}
var minDistance = function (arr) {
  var min = 1000000, minIndex;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < min && arr[i] !== 0) {
      min = arr[i];
      minIndex = i;
    }
  };
  return minIndex;
};

var distanceCalc = function (distances) {
  for (var i = 0; i < window.dancers.length; i++) {
    distances[i]= [];
    for (var j = 0; j < window.dancers.length; j++) {
      distances[i][j] = distance(window.dancers[i], window.dancers[j]);
    };
  };
  for (var key in distances) {
    distances[key] = minDistance(distances[key]);
  }
  console.log(distances);
  var closest = matchClosest(distances);
  for (var l = 0; l < window.dancers.length; l++) {
    moveIntoPairs(window.dancers[l],window.dancers[closest[l]],300);
  };
  
};


var matchClosest = function (obj) {
  var pairs = {}, unmatched = [];
  for (var key in obj) {
    if (obj[obj[key]] === key) {
      pairs[key] = obj[key];
    } else {
      unmatched.push(parseInt(key));
    }
  }
  while (unmatched.length !== 0){
    var pair1 = unmatched.pop();
    var pair2 = unmatched.pop();
    pairs[pair1] = pair2;
    pairs[pair2] = pair1;
  }
  return pairs;
};


$(document).ready(function() {
  window.dancers = [];

  $(".addDancerButton").on("click", function(event) {
    /* This function sets up the click handlers for the create-dancer
     * buttons on dancefloor.html. You should only need to make one small change to it.
     * As long as the "data-dancer-maker-function-name" attribute of a
     * class="addDancerButton" DOM node matches one of the names of the
     * maker functions available in the global scope, clicking that node
     * will call the function to make the dancer.
     */

    /* dancerMakerFunctionName is a string which must match
     * one of the dancer maker functions available in global scope.
     * A new object of the given type will be created and added
     * to the stage.
     */
    var dancerMakerFunctionName = $(this).data("dancer-maker-function-name");

    // get the maker function for the kind of dancer we're supposed to make
    var dancerMakerFunction = window[dancerMakerFunctionName];

    // make a dancer with a random position

    var dancer = new dancerMakerFunction(
      $("body").height() * Math.random()*.7,
      $("body").width() * Math.random()*.7,
      Math.random() * 1000
    );
    $('body').append(dancer.$node);
    window.dancers.push(dancer);
  });
  
  $(".lineUp").on("click", function(event) {


    // $('.dancer').css({top:300, left: 400});
    for (var i = 0; i < window.dancers.length; i++) {
      // console.log(window.dancers[i]);
      window.dancers[i].setPosition(300,i*100+200);
    };
  });

  $(document).on('mouseover','.dancer', function(){
    var angle = 0;
    var startRotation = setInterval(function(){
      angle+=3;
    this.rotate(angle);
    }.bind($(this)),50);
  });

  $(document).on('mouseout','.dancer', function(){
    var angle = 0;
    setInterval(function(){
      angle+=3;
    this.rotate(angle);
    }.bind($(this)),50);
  });

  $('.calculate').on('click',function(event){
    var distances = {};
    if (window.dancers.length % 2 !== 0) {
      var bye = window.dancers[window.dancers.length-1].$node;
      bye.css({
        'background-image':'url("img/explosion.gif")', 
        'background-size':' 50% 50%',
        width:'400px',
        height:'221px'});
      setTimeout(function() { 
        bye.fadeOut();
        window.dancers.pop();
        distanceCalc(distances);
         },3500);
    } else {
      distanceCalc(distances);
    }
          
  });
});




