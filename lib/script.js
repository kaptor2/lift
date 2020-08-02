class Qweue {
  constructor(lift, countFloor) {
    this.timing = 500;
    this.countFloor = countFloor;
    this.lift = lift;
    this.moving(1, 0);
    this.qweueAll = [];
    this.floor = 1;
    this.sost = "stop"; // stop, start
    this.subscribers = [];
    this.timer = null;
  }

  start = async () => {
    this.sost = "start";
    while (this.qweueAll.length > 0) {
      await this.go(null, 500);
      this.closestInQweue();
      let { floor } = this.qweueAll[0];
      let time = Math.abs(this.floor - floor);
      this.goInterval(floor);
      await this.go(() => this.moving(floor, time), time * this.timing);
      this.stopInterval();
      await this.go(null, this.timing);
      await this.go(this.openLift, this.timing * 2);
      this.floor = floor;
      this.clearQweue();
      await this.go(this.closeLift, this.timing * 2);
    }
    this.sost = "stop";
  };

  goInterval = (floor) => {
    if (floor == this.floor && this.subscribers.length == 0) return;
    let incDec = floor > this.floor ? 1 : -1;

    this.timer = setInterval(() => {
      this.floor = this.floor + incDec;
      this.broadcast();
    }, this.timing);

  };

  broadcast = () => {
    this.subscribers.forEach((el) => {
      el.innerHTML = this.floor;
    });
  };

  stopInterval = () => {
    clearInterval(this.timer);
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

  setSubscriber = (elements) => {
    this.subscribers = elements;
  };

  moving = (toMove, time) => {
    time = time * this.timing;
    this.lift.style.cssText = `
      top:calc((100%/${this.countFloor}) * (${this.countFloor} - ${toMove})); 
      -moz-transition: top ${time}ms linear;
      -webkit-transition: top ${time}ms linear;
      transition: top ${time}ms linear;`;
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

function addListners(classObjects, classActive, invert = false) {
  const floors = document.querySelectorAll(classObjects);
  floors.forEach((obj, i) => {
    obj.addEventListener("click", (e) => {
      qweue.setQweue({
        obj,
        classActive,
        floor: invert ? floors.length - i : i + 1,
      });
    });
  });
}

addListners(".dial ol", "dial-active");
addListners(".floor ol button", "btn-active", true);

let qweue = new Qweue(
  document.querySelector(".lift"),
  document.querySelectorAll(".dial ol").length
);

qweue.setSubscriber([
  document.querySelector(".dial-container span"),
  ...document.querySelectorAll(".floor span"),
]);