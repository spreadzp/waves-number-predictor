// import the required animation functions from the angular animations module
import { trigger, animate, transition, style, state, keyframes, sequence } from '@angular/animations';

export const fadeInAnimation =
    // trigger name for attaching this animation to an element using the [@triggerName] syntax
    trigger('fadeInAnimation', [
      state('*', style({
        // the view covers the whole screen with a semi tranparent background
        color: 'red'
    })),
        // route 'enter' transition
        transition('* <=> *', [

          // styles at start of transition
          style({
              // start with the content positioned off the right of the screen,
              // -400% is required instead of -100% because the negative position adds to the width of the element
              // right: '-400%',

              // start with background opacity set to 0 (invisible)
              color: 'green'
          }),

          // animation and styles at end of transition

          sequence([
          animate('5s ease-in-out', keyframes([
            style({ fontSize: '12px', offset: 0 }),
            style({ fontSize: '18px', offset: 0.67 }),
            style({ fontSize: '16px', offset: 1 })
          ])
        )
      ]),

     /*  // route 'leave' transition
      transition(':leave', [
          // animation and styles at end of transition
          animate('5s ease-in-out', style({
              // transition the right position to -400% which slides the content out of view
              color: 'yellow'
          }))
      ]) */
    ])
  ]);
