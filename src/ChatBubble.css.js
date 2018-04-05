/*
We are using CSS-in-JS style here. Ideally, we should be using CSS Modules.
Support for CSS Modules is coming in Create React App V2 and once we start
using it, we should migrate this to CSS modules.

Context:
https://medium.com/nulogy/how-to-use-css-modules-with-create-react-app-9e44bec2b5c2
https://github.com/facebook/create-react-app/pull/2285
*/
export default {
  bubbleStyles: {
    text: {
      fontSize: 20
    },
    chatbubble: {
      background: "mediumslateblue"
    },
    userBubble: {
      background: "lightcoral"
    }
  }
};
