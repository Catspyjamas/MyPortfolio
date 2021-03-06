



// Hide Header 


function classToggle() {
  const list = document.querySelector('.header-items-list')
  list.classList.toggle('header-items-list-hidden');
}

document.querySelector('.navbar-link-toggle')
  .addEventListener('click', classToggle);



var z = 1

var closeButtons = document.querySelectorAll(".pf-close-button");
var images = document.querySelectorAll(".pf-prevbox");
window.history.pushState(null, "", window.location.pathname);


function onImageEnter() {
  images.forEach(img => {
    if (img === this) {
      img.style.zIndex = images.length - 1;
      img.style.cursor = "drag"
    } else {
      const oldZ = img.style.zIndex || 0;
      const newZ = Math.max(oldZ - 1, 0);

      img.style.zIndex = newZ;
      img.style.cursor = "grab"

    }
  });
}





function onMouseDown() {
  //in this scope, .this is still img
  var img = this;

  var lastClientX = null;
  var lastClientY = null;
  //ask for the initial offset values. If there aren't any, set to 0
  var countDeltaX = Number(img.dataset.countDeltaX) || 0;
  var countDeltaY = Number(img.dataset.countDeltaY) || 0;
  img.style.cursor = "grabbing"


  function onMouseMove(event) {
    if (lastClientX !== null) {
      //determine offset values, dependent on current mouse position and mouse position when event last fired
      var deltaX = event.clientX - lastClientX;
      var deltaY = event.clientY - lastClientY;

      //add up the offset values for the next static position
      countDeltaX += deltaX;
      countDeltaY += deltaY;
      
      window.requestAnimationFrame(function () {
        //dataset = box where we can save a value per image for knowing the offset values in the css for next time
        //dataset always saves strings, if it's not a string anyway
        img.dataset.countDeltaX = countDeltaX;
        img.dataset.countDeltaY = countDeltaY;
        
        img.dataset.hasBeenMoved = "true";
        //save offset value of current position to css

        img.style.setProperty("--transform-transition-duration", "0s");
        img.style.setProperty("--x", countDeltaX + "px");
        img.style.setProperty("--y", countDeltaY + "px");
      });
    }
    lastClientX = event.clientX;
    lastClientY = event.clientY;
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    img.style.cursor = "pointer"
    img.style.setProperty("--transform-transition-duration", "");
  }

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

function openProject() {
  var img = this;


  if (img.dataset.hasBeenMoved === "true") {
    img.dataset.hasBeenMoved = "false";
  }
  else {
    console.log("openProject");
    var linkName = img.dataset.link;
    var url = img.dataset.url;
    document.getElementById(linkName).classList.add("pf-item-on");
    window.history.pushState(null, "", "/projects/" + url);
    window.scrollTo(0, 0);

  }

}

function closeProject () {
  document.querySelectorAll(".pf-item").forEach (itm => {
    itm.classList.remove("pf-item-on");
    window.history.pushState(null, "", "/projects");
  });
}

function goBack() {
  if (window.location.pathname === "/projects") {
    document.querySelectorAll(".pf-item").forEach (itm => {
      itm.classList.remove("pf-item-on");
    });
  }

}

images.forEach(img => {
  //change z-index on hover
  img.addEventListener("mouseenter", onImageEnter);
  img.addEventListener("touchstart", onImageEnter);
  img.addEventListener("dragstart", function(){return false;});
  //drag and drop effect: first handler
  img.addEventListener("mousedown", onMouseDown);
  img.addEventListener("click", openProject);

});



closeButtons.forEach (btn => {
  btn.addEventListener ("click", closeProject);
});


window.addEventListener("popstate", goBack);