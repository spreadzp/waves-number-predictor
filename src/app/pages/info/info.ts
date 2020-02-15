import { Component, ViewEncapsulation, OnInit, AfterViewInit, ViewChild } from '@angular/core';
// import Snap from 'snapsvg';
import {TimelineMax, Linear, gsap } from 'gsap';
import {EasePack, TextPlugin } from 'gsap/all';

@Component({
  selector: 'app-page-info',
  templateUrl: './info.html',
  styleUrls: ['./info.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InfoComponent implements OnInit {
  // container: Element;
  _sentenceEndExp = /(\.|\?|!)$/g; //regular expression to sense punctuation that indicates the end of a sentence so that we can adjust timing accordingly

  constructor() {
  }

  ngOnInit() {
    // this.container = document.querySelector("#demo");

    this.curvedText(1);
    this.machineGun("These words are constantly animating in your face to suck you in and leave you hanging for what comes next. Can you handle the awesomeness? Or are you left quivering in fear? It's only text, silly. Longer words stay on the screen for a greater duration. Each sentence ends with a dramatatic pause. Yes, that pause. The End");
   /*  const t = this.machineGun("These words are constantly animating in your face to suck you in and leave you hanging for what comes next. Can you handle the awesomeness? Or are you left quivering in fear? It's only text, silly. Longer words stay on the screen for a greater duration. Each sentence ends with a dramatatic pause. Yes, that pause. The End");
    // console.log('@@@@this.container :', this.container);
    setTimeout(() => t, 5000) */
  }



machineGun(text) {
  gsap.registerPlugin(EasePack, TextPlugin);
  var words = text.split(" "),

      tl = gsap.timeline({delay:2, repeat:2, repeatDelay:1}),
      wordCount = words.length,
      time = 0,
      word, element, duration, isSentenceEnd, i;

  for(i = 0; i < wordCount; i++){
    word = words[i];
    isSentenceEnd = this._sentenceEndExp.test(word);
    const container = document.querySelector("#demo");
    const elem = document.createElement("h3");

    elem.innerText = word;
    elem.style.color = 'red';
    container.appendChild(elem);
    // element = container.append("<h3>" + word + "</h3>");
    //  element = document.createTextNode("<h3>" + word + "</h3>")['appendTo'](this.container);
    duration = Math.max(2, word.length * 0.1); // longer words take longer to read, so adjust timing. Minimum of 0.5 seconds.
    if (isSentenceEnd) {
      duration += 0.6; //if it's the last word in a sentence, drag out the timing a bit for a dramatic pause.
    }
    // set opacity and scale to 0 initially. We set z to 0.01 just to kick in 3D rendering in the browser which makes things render a bit more smoothly.
    gsap.set(elem, {autoAlpha:0, scale:0, z:0.01});
    //the SlowMo ease is like an easeOutIn but it's configurable in terms of strength and how long the slope is linear. See https://www.greensock.com/v12/#slowmo and https://api.greensock.com/js/com/greensock/easing/SlowMo.html
    tl.to(elem, duration, {scale:1.2,  ease:"slow(0.2, 0.8)"}, time)
      //notice the 3rd parameter of the SlowMo config is true in the following tween - that causes it to yoyo, meaning opacity (autoAlpha) will go up to 1 during the tween, and then back down to 0 at the end.
      .to(elem, duration, {autoAlpha:1, ease:"slow(0.3, 0.8, true)"}, time)
      .to(elem, duration, {autoAlpha:0.8, ease:"slow(0.1, 0.8, true)"}, time)
      .to(elem, duration, {autoAlpha:0.8, ease:"slow(0.1, 0.8, true)"}, time)

      .to(elem, duration, {autoAlpha:0.3, ease:"slow(0.1, 0.8, true)"}, time)
      .to(elem, duration, {autoAlpha:0.6, ease:"slow(0.1, 0.8, true)"}, time)
      .to(elem, duration, {autoAlpha:0.7, ease:"slow(0.1, 0.8, true)"}, time)
      .to(elem, duration, {autoAlpha:0.5, ease:"slow(0.1, 0.8, true)"}, time)
      .to(elem, duration, {autoAlpha:1, ease:"slow(0.3, 0.8, true)"}, time)
       .to(elem, duration, {autoAlpha:0.8, ease:"slow(0.1, 0.8, true)"}, time)
       .to(elem, duration, {autoAlpha:0.8, ease:"slow(0.1, 0.8, true)"}, time)
       .to(elem, duration, {autoAlpha:0.7, ease:"slow(0.1, 0.8, true)"}, time)
       .to(elem, duration, {autoAlpha:0.6, ease:"slow(0.1, 0.8, true)"}, time)
       .to(elem, duration, {autoAlpha:0.5, ease:"slow(0.1, 0.8, true)"}, time)
       .to(elem, duration, {autoAlpha:0.3, ease:"slow(0.1, 0.8, true)"}, time)
       .to(elem, duration, {autoAlpha:0.2, ease:"slow(0.1, 0.8, true)"}, time)
       .to(elem, duration, {autoAlpha:0.1, ease:"slow(0.8, 0.8, true)"}, time)
       .to(elem, duration, {autoAlpha:0, ease:"slow(1, 0.8, true)"}, time);
    time += duration - 0.05;
    if (isSentenceEnd) {
      time += 0.6; //at the end of a sentence, add a pause for dramatic effect.
    }
    //gsap.set(elem, {autoAlpha:0, scale:0, z:0.01});

  }

}




  curvedText(time) {
    const tl   = new TimelineMax({ repeat: -1, yoyo:true });
    const text = document.querySelector('svg textpath'),
        path = document.querySelector('svg defs #txt-path');

    const from = {
      left:800, top:800
      /* transformOrigin: 'right right',
      rotation: 1 */
    };

    const to = {
      left:1000, top:2000,
      rotation: 360
      /* rotation: 360,
      ease: Linear.easeOut */
    };

    tl.fromTo([text, path], time, from, to);

    return tl;
  }


}
