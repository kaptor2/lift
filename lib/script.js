class Qweue {
  constructor(lift) {
    this.lift = lift;
    this.qweueAll = [];
    this.floor = 1;
    this.sost = "stop"; // stop, start
  }

  start = async () => {
    this.sost = "start";
    while (this.qweueAll.length > 0) {
      this.closestInQweue();
      let { floor } = this.qweueAll[0];
      let time = Math.abs(this.floor - floor);
      await this.go(() => this.moving(floor, time), time * 1000);
      await this.go(this.openLift, 2000);
      this.clearQweue();
      await this.go(this.closeLift, 2000);
    }
    this.sost = "stop";
  };

  closestInQweue = () => {
    this.qweueAll.sort((el, el2) => {
      return el2.floor < el.floor ? -1 : 1;
    });
  };

  clearQweue = () => {
    const { obj, classActive, floor } = this.qweueAll[0];
    this.floor = floor;
    obj.classList.remove(classActive);
    this.qweueAll.shift();
  };

  moving = (toMove, time) => {
    this.lift.style.cssText = `
      top:calc((100%/9) * (9 - ${toMove})); 
      -moz-transition: all ${time}s;
      -webkit-transition: all ${time}s;
      -o-transition: all ${time}s;
      transition: all ${time}s;`;
  };

  openLift = () => {
    this.lift.classList.remove("lift-off");
  };

  closeLift = () => {
    this.lift.classList.add("lift-off");
  };

  go = (fun, ms) =>
    new Promise((resolve) => {
      fun && fun();
      setTimeout(resolve, ms);
    });

  setQweue({ obj, classActive, floor }) {
    if (!obj.classList.contains(classActive)) {
      obj.classList.add(classActive);
      this.qweueAll.push({ obj, classActive, floor });
      this.sost == "stop" && this.start();
    }
  }
}

let qweue = new Qweue(document.querySelector(".lift"));

function addListners(classObjects, classActive, invert = false) {
  document.querySelectorAll(classObjects).forEach((obj, i) => {
    obj.addEventListener("click", (e) => {
      qweue.setQweue({
        obj,
        classActive,
        floor: invert ? 9 - i : i + 1,
      });
    });
  });
}

addListners(".dial ol", "dial-active");
addListners(".floor ol button", "btn-active", true);