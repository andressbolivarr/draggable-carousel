let n = 15;
let parallax = []; // we'll store the animations in here.
let clamp = gsap.utils.clamp(0, 1);
let currentX = 0;
let snap = gsap.utils.pipe(gsap.utils.snap(450), gsap.utils.clamp(n * -450, 0));

// Set #slides width for draggable bounds
gsap.set('#slides', {width:n*450});

// Populate slide boxes
for (var i=0; i<n; i++){

  var box = document.createElement('div'),
      img = new Image(),
      link = document.createElement('a');

  gsap.set(box, {
    width:400,
    height:600,
    overflow:'hidden',
    position:'absolute',
    top:50,
    left:i*450,
    attr:{ class:'box b'+i },
    background:'#333'
  });

  gsap.set(img, {
    position:'absolute',
    left:-300,//-i*50,
    attr:{src:'https://picsum.photos/id/'+(i+10)+'/700/600/'}
  });

  parallax[i] = gsap.to(img, {x: 300, ease: "none", paused: true});

  gsap.set(link, {
    position:'absolute',
    textAlign:'center',
    width:105,
    height:70,
    paddingTop:'7px',
    top:490,
    left:-25,
    rotation:90,
    fontSize:'45px',
    color:'#000',
    background:'#fff',
    mixBlendMode:'lighten',
    textDecoration:'none',
    innerHTML:'<span style="font-size:20px">IMG </span>'+(i+1),
    attr:{
      class:'imgLink',
      href:'https://picsum.photos/id/'+(i+10)+'/700/600/',
      target:'_blank'
    },
  });

  box.appendChild(img);
  box.appendChild(link);
  slides.appendChild(box);
}

// Make #slides draggable
Draggable.create('#slides', {
  type:'x',
  bounds: {left: innerWidth/2, width:1},
  zIndexBoost: false,
  onDrag:updateParallax,
  inertia: true,
  throwResistance:8000,
  onRelease: function() { currentX = this.endX },
  onThrowUpdate: updateParallax,
  snap: snap
})

function updateParallax() {
  // parallax should start from the right edge of the screen and we know that the #slides starts with
  // its left edge centered, thus we add innerWidth/2
  let x = gsap.getProperty('#slides', 'x') + window.innerWidth / 2,
      
      // convert the position in the viewport (right edge of viewport to -400 because that's when the
      // right edge of the element would go off-screen to the left) into a progress value where it's 0
      // at the right edge and 1 when it reaches the left edge
      normalize = gsap.utils.mapRange(window.innerWidth, -400, 0, 1);
  
  // apply the clamped value to each animation
  parallax.forEach((animation, i) => animation.progress(clamp(normalize(x + i * 450))));
}

updateParallax();

// Update draggable bounds onResize
window.addEventListener('resize', ()=>{
  Draggable.get("#slides").applyBounds({left: innerWidth/2, width:1})
  updateParallax();
});

// Previous & next buttons
$('#prev, #next').on('click', function(e) {

  let nextX = snap(currentX + (e.currentTarget.id === "next" ? -450 : 450));
  if (nextX !== currentX) {
    gsap.to("#slides", {x: nextX, duration: 0.3, onUpdate: updateParallax, overwrite: true})
    currentX = nextX;
  }

});

$('#prev, #next').on('mouseenter', (e)=>{
  gsap.to('#'+e.currentTarget.id + ' circle', {attr:{r:22}, ease:'expo', overwrite: true})
});

$('#prev, #next').on('mouseleave', (e)=>{
  gsap.to('#'+e.currentTarget.id + ' circle', {attr:{r:20}, ease:'expo', overwrite: true})
});

// Img Link rollover/out behavior
$('.imgLink').on('mouseenter', (e)=>{
  gsap.to(e.currentTarget, {x:10, duration:0.3, ease:'power3', overwrite: true})
});

$('.imgLink').on('mouseleave', (e)=>{
  gsap.to(e.currentTarget, {x:0, duration:0.3, ease:'power4.inOut', overwrite: true})
});