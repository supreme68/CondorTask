import EmblaCarousel from "embla-carousel";
import "../css/base.css";
import "../css/reset.css";
import "../css/embla.css";
import "../css/radio.css";

//prevAndNextButtons
  export const setupPrevNextBtns = (prevBtn, nextBtn, embla) => {
    prevBtn.addEventListener("click", embla.scrollPrev, false);
    nextBtn.addEventListener("click", embla.scrollNext, false);
  };
  
  export const disablePrevNextBtns = (prevBtn, nextBtn, embla) => {
    return () => {
      if (embla.canScrollPrev()) prevBtn.removeAttribute("disabled");
      else prevBtn.setAttribute("disabled", "disabled");
  
      if (embla.canScrollNext()) nextBtn.removeAttribute("disabled");
      else nextBtn.setAttribute("disabled", "disabled");
    };
  };

//dot buttons
export const setupDotBtns = (dotsArray, embla) => {
dotsArray.forEach((dotNode, i) => {
    dotNode.classList.add('embla__dot');
    dotNode.addEventListener('click', () => embla.scrollTo(i), false);
});
};

export const generateDotBtns = (dots, embla) => {
const scrollSnaps = embla.scrollSnapList();
const dotsFrag = document.createDocumentFragment();
const dotsArray = scrollSnaps.map(() => document.createElement('button'));
dotsArray.forEach(dotNode => dotsFrag.appendChild(dotNode));
dots.appendChild(dotsFrag);
return dotsArray;
};

export const selectDotBtn = (dotsArray, embla) => () => {
const previous = embla.previousScrollSnap();
const selected = embla.selectedScrollSnap();
dotsArray[previous].classList.remove('is-selected');
dotsArray[selected].classList.add('is-selected');
};

//Index
const wrap = document.querySelector(".embla");
const viewPort = wrap.querySelector(".embla__viewport");
const prevBtn = wrap.querySelector(".embla__button--prev");
const nextBtn = wrap.querySelector(".embla__button--next");
const dots = wrap.querySelector(".embla__dots");
const radioButtons = document.querySelectorAll(".radio__input");
const radioButtonsArray = [].slice.call(radioButtons);
const embla = EmblaCarousel(viewPort, { loop: true });
const dotsArray = generateDotBtns(dots, embla);
const setSelectedDotBtn = selectDotBtn(dotsArray, embla);
const disablePrevAndNextBtns = disablePrevNextBtns(prevBtn, nextBtn, embla);

setupPrevNextBtns(prevBtn, nextBtn, embla);
setupDotBtns(dotsArray, embla);
setupRadioButtons(radioButtonsArray, embla, disablePrevAndNextBtns);

embla.on("select", setSelectedDotBtn);
embla.on("select", disablePrevAndNextBtns);
embla.on("init", setSelectedDotBtn);
embla.on("init", disablePrevAndNextBtns);

// import { setupPrevNextBtns, disablePrevNextBtns } from "./prevAndNextButtons";
// import { setupDotBtns, generateDotBtns, selectDotBtn } from "./dotButtons";
// import { setupRadioButtons } from "./radioButtons";
