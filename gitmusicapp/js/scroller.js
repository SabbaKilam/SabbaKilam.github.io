var scroller = {
  targetElement: {},
  scrollElement: {},
  text: "",
  color: "",
  speed: 1,
  timerKey: 0,

  addScroller: function(target) {
    this.targetElement = target;
    this.scrollElement = document.createElement("span");
    this.scrollElement.onclick = function(e){e.stopPropagation();}
    this.scrollElement.onmousedown = function(e){e.stopPropagation();}
    target.innerHTML="";
    target.appendChild(this.scrollElement);
    this.prepareTarget();
    this.modify();
  },
  modify: function() {
    this.scrollElement.innerHTML = this.text;
    this.scrollElement.style.color = this.color;
    this.changeSpeed();
  },
  removeScroller: function(target) {
    if( this.targetElement &&  this.scrollElement && this.targetElement.removeChild){
          this.targetElement.removeChild(this.scrollElement);
          clearInterval(this.timerKey);
    }
    this.scrollElement = {};
    this.targetElement = {};
  },
  changeSpeed: function() {
    clearInterval(this.timerKey);
    var delay = 10 / this.speed;
    var step = 0.5 * this.speed; 
    var width = this.scrollElement.getBoundingClientRect().width;
    var element = this.scrollElement;
    var margin = width;
    this.timerKey = setInterval(function() {
      var firstOffset = scroller.targetElement.getBoundingClientRect().width;        
      if (margin <= -width) {
        margin = firstOffset;
      }
      margin -= step;
      element.style.marginLeft = margin + "px";
    }, delay);
  },
  prepareTarget: function() {
    this.targetElement.style.postion = "relative";
    this.targetElement.style.overflow = "hidden";
    this.targetElement.style.whiteSpace = "nowrap";
    this.targetElement.style.textOverflow = "ellipsis";
    this.targetElement.style.textAlign = "left";
  }
};
//----| END of scroller object |----