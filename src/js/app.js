import NormalizeWheel from './lib/normwheel';
import {TweenLite} from 'gsap';


let currentS = 0;
let lastS = 0;
let lastTime = 0;
let liheight = 150;
let windowHeight = $(window).height();
let windowWidth = $(window).width();

let top = (windowHeight - liheight)/2;
let factor = windowHeight/liheight;
let maxScroll = ($('.main-scroller').height() - windowHeight)/factor;

let isScrolling = false;

let clip = 'rect('+top+'px,'+windowWidth+'px,'+(top+liheight)+'px,0)';

$('.nav ul').css('top',top);
$('.nav__2').css('clip',clip);




function Velocity(e) {
  if(isScrolling) {
  	let speed = (currentS - lastS) / (e - lastTime);
  	
  	if(speed<-5) speed = -5;
  	if(speed>5) speed = 5;
  	TweenLite.to('.nav',2,{
  		skewY: -speed*10
  	});
  	lastTime = e;
  	lastS = currentS;
  }
  window.requestAnimationFrame(Velocity);
}

Velocity();

function gotoClosest() {
  let closest = Math.round(factor*currentS/windowHeight);
  goto(closest);
}

function goto(n) {
  currentS = liheight*n;
  TweenLite.to('.main-scroller',1,{
    y:-liheight*n*factor,
    overflow: 5, // preexisting
    onComplete: function() {
      isScrolling = false;
    }
  });
  TweenLite.to('.nav ul',1,{y:-liheight*n});
}

$('li').on('click',function() {
  goto($(this).index());
});




document.addEventListener('wheel',function(event) {
  event.preventDefault();
  if(!isScrolling) isScrolling = true;
  let norm = NormalizeWheel(event);
  currentS += norm.spinY*50;


  if(currentS<0) currentS = 0;
  if(currentS>maxScroll) currentS = maxScroll;

  TweenLite.to('.main-scroller',0.5,{
  	y:-currentS*factor,
  	overwrite: 5, // preexisting
  	onUpdate: function() {
  		TweenLite.set('.nav ul',{y:-currentS});
  	},
  	onComplete: function() {
  		gotoClosest();
  		isScrolling = false;
  	}
  });



});

