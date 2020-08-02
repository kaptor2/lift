import { Qweue } from "./Qweue.js"

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