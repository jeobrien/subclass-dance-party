
var _move = function (node,x,y){
  var newX = node.left+x;
  var newY = node.top-y;
  node.setPosition(newY,newX);
}

window.stopMoving = false;

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
    _move(node1,difX/steps,difY/steps);
    counter ++;

  },time);
  //};
};

var lissajous = function(t,sizex, sizey,speed) {
  var result = [];
  result.push(3*sizex*Math.cos(3*speed*t));
  result.push(sizey*Math.cos(1.5*speed*t+5))
  return result;
};

var lissajousMove = function(node) {
    var t = 0;
    var steps = 200;
    var pos = Math.random()-.5;
    var speed = Math.random()+pos;
    var sizeX = Math.random()*.2-.1;
    var sizeY = Math.random()*.2-.1;


    var animate = setInterval(function(){
      var lissajousePairs = lissajous(t/(5*steps),sizeX,sizeY,speed);
      var lissajousX = lissajousePairs[0];
      var lissajousY = lissajousePairs[1];
      _move(node,lissajousX,lissajousY);
      t++;
      if (window.stopMoving){
        clearInterval(animate);
      }
    },1000/steps);
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

var dancerEach = function(cb){
  for (var i = 0; i < window.dancers.length; i++) {
    cb(window.dancers[i]);
  };
}


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
    window.stopMoving = true;
    // $('.dancer').css({top:300, left: 400});
    for (var i = 0; i < window.dancers.length; i++) {
      // console.log(window.dancers[i]);
      window.dancers[i].setPosition(300,i*100+200);
    };

  });

  $(document).on('mouseover','.dancer', function(){
    $(this).rotate({bind:{
      mousemove: function(){
        $(this).rotate({
          angle: 0,
          animateTo:360,
          easing: $.easing.easeInOutElastic
        })
      }
    } 
  });
  });

  $( '.earthquake' ).click(function() {
    for(var i = 0; i < 5; i++){
      $( 'body' ).effect( "shake" );
    }
    var dancers = $('.dancer');
    for (var k = window.dancers.length - 1; k >= 0; k--) {
      _move(window.dancers[k],-100,0);
      
    };
    dancers.css({
        'background-image':'url("img/explosion.gif")', 
        'background-size':' 100% 100%',
        width:'400px',
        height:'221px'});
    setTimeout(function (){
      dancers.fadeOut();
      window.dancers = [];
    },3500);

  });

  $('.calculate').on('click',function(event){
    var distances = {};
    if (window.dancers.length % 2 !== 0) {
      var bye = window.dancers[window.dancers.length-1].$node;
      _move(window.dancers[window.dancers.length-1],-100,0);
      bye.css({
        'background-image':'url("img/explosion.gif")', 
        'background-size':' 100%',
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

  $('.lissajous').on('click',function(){
    window.stopMoving = false;
    dancerEach(lissajousMove);
  });

  $('.stop').on('click',function(){
    window.stopMoving = true;
  });





});




