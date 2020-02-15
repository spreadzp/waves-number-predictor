import { Component, ViewEncapsulation, OnInit, AfterViewInit, ViewChild } from '@angular/core';
// import Snap from 'snapsvg';

@Component({
  selector: 'app-page-statistic',
  templateUrl: './statistic.html',
  styleUrls: ['./statistic.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StatisticComponent implements OnInit {

  // s:Snap;
  svgEl = document.querySelector("svg");
     pathEl = document.querySelector("#bezier");
     pathElSegList: any;
     evtStartTarget = {};
     pointArray = [{x: 15, y: 35}, {x: 15, y: 60}, {x: 50, y: 60}, {x: 50, y: 35}, {x: 50, y: 10}, {x: 85, y: 10}, {x: 85, y: 35}];

     numberRound = '128-511';
  constructor() {
  }

  ngOnInit() {
    document.querySelector("#sOffset").addEventListener("input", (ev: any) => {
      document.querySelector("#tp").setAttribute("startOffset", ev.target.value + "%");
    });
    this.pathElSegList = this.pathEl['pathSegList'];
    // draw initial UI
    this.svgEl.appendChild(this.uiLine(this.pointArray[0].x, this.pointArray[0].y, this.pointArray[1].x, this.pointArray[1].y, 1));
    this.svgEl.appendChild(this.uiLine(this.pointArray[2].x, this.pointArray[2].y, this.pointArray[3].x, this.pointArray[3].y, 2));
    this.svgEl.appendChild(this.uiLine(this.pointArray[3].x, this.pointArray[3].y, this.pointArray[4].x, this.pointArray[4].y, 3));
    this.svgEl.appendChild(this.uiLine(this.pointArray[5].x, this.pointArray[5].y, this.pointArray[6].x, this.pointArray[6].y, 4));

    for (var i = 0; i < this.pathElSegList.numberOfItems; i++) {
      this.svgEl.appendChild(this.uiDot(this.pathElSegList.getItem(i).x, this.pathElSegList.getItem(i).y, 3*i));
      if ("x1" in this.pathElSegList.getItem(i)) {
        this.svgEl.appendChild(this.uiDot(this.pathElSegList.getItem(i).x1, this.pathElSegList.getItem(i).y1, 3*(i-1)+1));
      }
      if ("x2" in this.pathElSegList.getItem(i)) {
        this.svgEl.appendChild(this.uiDot(this.pathElSegList.getItem(i).x2, this.pathElSegList.getItem(i).y2, 3*(i-1)+2));
      }
    }
  }


uiLine(x1, y1, x2, y2, i) {
  var lineEl = document.createElementNS("http://www.w3.org/2000/svg", "line");
  lineEl.setAttribute('x1', x1);
  lineEl.setAttribute('y1', y1);
  lineEl.setAttribute('x2', x2);
  lineEl.setAttribute('y2', y2);
  lineEl.setAttribute('id', "line" + i);
  return lineEl;
}

uiDot(x, y, i) {
  var circleEl = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circleEl.setAttribute('cx', x);
  circleEl.setAttribute('cy', y);
  circleEl.setAttribute('r', '2');
  circleEl.addEventListener("mousedown", this.mdEvent);
  circleEl.addEventListener("touchstart", this.mdEvent);
  circleEl.setAttribute("id", "dot" + i);
  return circleEl;
}

// mouse/touch event handling
mdEvent (evt) {
  evt.preventDefault();
  this.evtStartTarget = evt.target;
  document.addEventListener("mousemove", this.mmEvent);
  document.addEventListener("mouseup", this.muEvent);
  document.addEventListener("touchmove", this.mmEvent);
  document.addEventListener("touchend", this.muEvent);
}

mmEvent (evt) {
  var pointIndex = 0;
  evt.preventDefault();
  var p = this.svgEl.createSVGPoint();
  if(evt.targetTouches) {
    p.x = evt.targetTouches[0].clientX;
    p.y = evt.targetTouches[0].clientY;
  } else {
    p.x = evt.clientX;
    p.y = evt.clientY;
  }
  p = this.coordinateTransform(p);
  pointIndex = parseInt(this.evtStartTarget['getAttribute']("id").slice(-1), 10);
  this.pointArray[pointIndex].x = Number(p.x.toFixed(2));
  this.pointArray[pointIndex].y = Number(p.y.toFixed(2));
  this.updateUI(pointIndex);
}

muEvent (evt) {
  evt.preventDefault();
  document.removeEventListener("mousemove", this.mmEvent, true);
  document.removeEventListener("mouseup", this.muEvent, true);
  document.removeEventListener("touchmove", this.mmEvent, true);
  document.removeEventListener("touchend", this.muEvent, true);    }

// update the ui
updateUI (index) {
  // draw dots
  this.evtStartTarget['setAttribute']("cx", this.pointArray[index].x);
  this.evtStartTarget['setAttribute']("cy", this.pointArray[index].y);
  // draw lines
  switch (index) {
    case 0:
    case 1:
      var lineEl = document.querySelector("#line1");
      lineEl.setAttribute("x1", this.pointArray[0].x.toString());
      lineEl.setAttribute("y1", this.pointArray[0].y.toString());
      lineEl.setAttribute("x2", this.pointArray[1].x.toString());
      lineEl.setAttribute("y2", this.pointArray[1].y.toString());
      break;
    case 2:
    case 3:
    case 4:
      var lineEl = document.querySelector("#line2");
      lineEl.setAttribute("x1", this.pointArray[2].x.toString());
      lineEl.setAttribute("y1", this.pointArray[2].y.toString());
      lineEl.setAttribute("x2", this.pointArray[3].x.toString());
      lineEl.setAttribute("y2", this.pointArray[3].y.toString());
      var lineEl = document.querySelector("#line3");
      lineEl.setAttribute("x1", this.pointArray[3].x.toString());
      lineEl.setAttribute("y1", this.pointArray[3].y.toString());
      lineEl.setAttribute("x2", this.pointArray[4].x.toString());
      lineEl.setAttribute("y2", this.pointArray[4].y.toString());
      break;
    case 5:
    case 6:
      var lineEl = document.querySelector("#line4");
      lineEl.setAttribute("x1", this.pointArray[5].x.toString());
      lineEl.setAttribute("y1", this.pointArray[5].y.toString());
      lineEl.setAttribute("x2", this.pointArray[6].x.toString());
      lineEl.setAttribute("y2", this.pointArray[6].y.toString());
  }
  // draw bezier path
  this.pathElSegList[0].x = this.pointArray[0].x;
  this.pathElSegList[0].y = this.pointArray[0].y;
  this.pathElSegList[1].x1 = this.pointArray[1].x;
  this.pathElSegList[1].y1 = this.pointArray[1].y;
  this.pathElSegList[1].x2 = this.pointArray[2].x;
  this.pathElSegList[1].y2 = this.pointArray[2].y;
  this.pathElSegList[1].x = this.pointArray[3].x;
  this.pathElSegList[1].y = this.pointArray[3].y;
  this.pathElSegList[2].x1 = this.pointArray[4].x;
  this.pathElSegList[2].y1 = this.pointArray[4].y;
  this.pathElSegList[2].x2 = this.pointArray[5].x;
  this.pathElSegList[2].y2 = this.pointArray[5].y;
  this.pathElSegList[2].x = this.pointArray[6].x;
  this.pathElSegList[2].y = this.pointArray[6].y;
}

//  https://msdn.microsoft.com/en-us/library/ie/hh535760(v=vs.85).aspx
coordinateTransform(screenPoint) {
  var CTM = this.svgEl.getScreenCTM();
  return screenPoint.matrixTransform( CTM.inverse() );
}
}
