(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{119:function(e,t){e.exports="Type your request for Alexa.."},121:function(e,t){var a=Object.freeze({EMPTY_RESPONSE_FROM_ALEXA:"a canned response when Alexa repsonds with an empty message."});e.exports={cannedResponses:a}},129:function(e,t,a){e.exports=a(294)},134:function(e,t,a){},135:function(e,t,a){},248:function(e,t,a){},251:function(e,t,a){},275:function(e,t,a){},284:function(e,t,a){},285:function(e,t,a){},286:function(e,t,a){},294:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),s=a(24),o=a.n(s),i=(a(134),a(18)),c=a(25),l=a(28),u=a(19),d=a(26),m=(a(135),a(115)),h=a.n(m),E=a(39),g=a.n(E),p=a(116),f=a.n(p);a(248);function v(e){return r.a.createElement(f.a,{className:"header-flat-button",label:e.label,onClick:function(){return e.onClick()}})}var A=a(126),b=a(127),x=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).message=e,a.name="IllegalArgumentError",a}return Object(d.a)(t,e),t}(Object(b.a)(Error)),R=a(47),w=a.n(R),O=a(20),T=a.n(O),N=r.a.createContext(),S=function(e){if(!(e&&e.access_token&&e.expires_in)){var t=T.a.inspect(e,{showHidden:!0,depth:null});throw new x("LoginWithAmazon Authorization response is undefined or \n        doesnt have access_token/expires_in.\n        lwaResponse: ".concat(t))}w.a.set("amazon_Login_accessToken",e.access_token,{expires:e.expires_in/86400,secure:!1})},y=Object.freeze({scope:["alexa:all","profile"],scope_data:{"alexa:all":{productID:"Silent_Alexa",productInstanceAttributes:{deviceSerialNumber:"12345"}}},popup:!1}),C="authresponse";function U(){var e=Object(n.useContext)(N),t=e.clear;return e.isAuthenticated?r.a.createElement(v,{label:"Logout",onClick:t}):r.a.createElement(v,{label:"Login",onClick:L})}function L(){window.amazon.Login.authorize(y,window.location.href+C)}a(251);function _(e){return r.a.createElement("div",{id:"header"},r.a.createElement("div",{id:"header-info"},r.a.createElement(g.a,null,r.a.createElement(h.a,{className:"app-bar",showMenuIconButton:!1,title:"Silent Alexa (Under Construction)",iconElementRight:r.a.createElement(U,null)}))))}var k=a(2),M=a(117),j=a.n(M),I=a(128),X={text:{fontSize:20},chatbubble:{background:"#00ACE0"},userBubble:{background:"#646A72"}},H=function(e){return r.a.createElement(k.ChatBubble,{message:e.message,bubbleStyles:Object(I.a)({},X)})},P=a(31),z=a(118),q=a.n(z),D=a(119),W=a.n(D),F=function(e){return r.a.createElement("form",{onSubmit:function(t){return e.onSubmit(t)}},r.a.createElement(g.a,null,r.a.createElement(q.a,{id:"user-request-to-alexa-text-field",hintText:W.a,value:e.value,onChange:function(t){return e.onChange(t)}})))},B=(a(275),a(14));var V=Object.freeze({USER:0,ALEXA:1}),J=Object(B.Map)([[V.USER,{name:"You",avatar:void 0}],[V.ALEXA,{avatar:r.a.createElement(function(){return r.a.createElement("svg",{width:"24",viewBox:"0 0 24 24"},r.a.createElement("path",{fill:"#00ACE0",d:"M0,10.0000489 C0,15.0707816 3.77428289,19.2594477 8.66667972,19.9113334 L8.66667972,17.8962718 C8.66667972,17.3281595 8.30829606,16.8174945 7.76974193,16.636736 C4.94690794,15.688512 2.927648,12.9904434 3.00202582,9.8313279 C3.09245359,5.9853886 6.22532565,2.96152397 10.0722248,3.00037678 C13.9049334,3.03913173 16.9999315,6.15812215 16.9999315,10.0000489 C16.9999315,10.087639 16.9977785,10.1747398 16.9945489,10.2614491 C16.9887748,10.4004189 16.9838815,10.4807669 16.9775203,10.5606256 C16.975563,10.5860707 16.9731163,10.611418 16.9707676,10.6367653 C16.9658743,10.692549 16.9601002,10.7479411 16.9538368,10.8032355 C16.9466926,10.8660654 16.9385698,10.928504 16.9298598,10.9906489 C16.9258473,11.01903 16.9220305,11.0475091 16.9177244,11.0756945 C16.0607158,16.7212922 8.70778325,19.8942068 8.66756051,19.9115291 C9.10355154,19.9694658 9.54815475,20 9.99990213,20 C15.5228467,20 20,15.5229227 20,10.0000489 C20,4.47717519 15.5228467,0 9.99990213,0 C4.47715329,0 0,4.47717519 0,10.0000489 Z",transform:"translate(2 2)"}))},null)}]]),K=a(81),G=a.n(K),Q=a(120),Y=a(82),Z=a(121),$=a(122),ee=a.n($),te="application/json; charset=UTF-8";function ae(e){if(!e)throw new x("The response to be parsed cannot be empty. Input: "+e);var t=ee()(e);if(!t||!t.multipart)throw new x("Given raw response is not a valid multi-part message. Input: "+e);var a=t.multipart.filter(function(e){return te===Object(B.getIn)(e,["headers","Content-Type"])&&e.body}).map(function(e){return e.body}),n=[],r=!0,s=!1,o=void 0;try{for(var i,c=a[Symbol.iterator]();!(r=(i=c.next()).done);r=!0){var l=i.value,u=void 0;try{u=JSON.parse(l)}catch(d){throw new x("Given directive couldn't be parsed to a JSON object. Input: \" ".concat(l.toString(),"\n        StackTrace:\n        ").concat(T.a.inspect(d,{showHidden:!0,depth:null})))}if(!Object(B.hasIn)(u,["directive","payload","caption"]))throw new x("Given directive doesn't contain the expected path directive.payload.caption. Input: "+u);n.push(u.directive.payload.caption)}}catch(m){s=!0,o=m}finally{try{r||null==c.return||c.return()}finally{if(s)throw o}}return Object(B.fromJS)(n)}var ne=a(123),re=a.n(ne),se=a(283).sprintf,oe=Y.urls.NA+Y.paths.EVENTS,ie=new(function(){function e(){Object(i.a)(this,e)}return Object(c.a)(e,[{key:"sendTextMessageEvent",value:function(){var e=Object(Q.a)(G.a.mark(function e(t,a){var n,r,s,o,i;return G.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t&&a){e.next=2;break}throw new x("The request string to Alexa or the access token cannot be empty.\n        RequestString: ".concat(t,"\n        AccessToken: ").concat(a));case 2:return n=JSON.stringify(this.buildTextMessageEvent(t)),r=this.buildTextMessageFetchRequestOptions(n,a),s=!1,e.next=7,fetch(oe,r).then(function(e){return e.ok?(s=!0,e.text()):e.json()}).then(function(e){o=e}).catch(function(e){s=!1,console.log(T.a.inspect(e,{showHidden:!0,depth:null}))});case 7:if(!s){e.next=17;break}return e.prev=8,o&&(i=ae(o)),i&&i.get(0)||(i=B.List.of(Z.cannedResponses.EMPTY_RESPONSE_FROM_ALEXA)),e.abrupt("return",i);case 14:e.prev=14,e.t0=e.catch(8),console.log("Encountered an error while trying to parse the speak directive from AVS."+T.a.inspect(e.t0,{showHidden:!0,depth:null}));case 17:return e.abrupt("return",B.List.of(this.convertErrorToHumanReadableMessage(o)));case 18:case"end":return e.stop()}},e,this,[[8,14]])}));return function(t,a){return e.apply(this,arguments)}}()},{key:"convertErrorToHumanReadableMessage",value:function(e){var t;return Object(B.hasIn)(e,["payload","code"])&&(t=e.payload.code),P.cannedErrorResponses.get(t,P.cannedErrorResponses.get(P.customErrorCodes.UNKNOWN_ERROR))}},{key:"buildTextMessageFetchRequestOptions",value:function(e,t){return{body:se('--silent-alexa-http-boundary\nContent-Disposition: form-data; name="metadata"\nContent-Type: application/json; charset=UTF-8\n\n%s',e),headers:{Authorization:"Bearer "+t,"content-type":"multipart/form-data; boundary=silent-alexa-http-boundary"},cache:"no-store",method:"POST"}}},{key:"buildTextMessageEvent",value:function(e){return{event:{header:{namespace:"Text",name:"TextMessage",messageId:re()()},payload:{textMessage:e}}}}}]),e}()),ce=function(e){function t(){var e;return Object(i.a)(this,t),(e=Object(l.a)(this,Object(u.a)(t).call(this))).state={messages:[new k.Message({id:V.USER,message:"Hello Alexa!",senderName:J.get(V.USER).name}),new k.Message({id:V.ALEXA,message:"Hey! Alexa here.",avatar:J.get(V.ALEXA).avatar}),new k.Message({id:V.USER,message:"Hello Alexa!",senderName:J.get(V.USER).name}),new k.Message({id:V.ALEXA,message:"Hey! Alexa here.",avatar:J.get(V.ALEXA).avatar}),new k.Message({id:V.USER,message:"Hello Alexa!",senderName:J.get(V.USER).name}),new k.Message({id:V.ALEXA,message:"Hey! Alexa here.",avatar:J.get(V.ALEXA).avatar}),new k.Message({id:V.USER,message:"Hello Alexa!",senderName:J.get(V.USER).name}),new k.Message({id:V.ALEXA,message:"Hey! Alexa here.",avatar:J.get(V.ALEXA).avatar}),new k.Message({id:V.USER,message:"Hello Alexa!",senderName:J.get(V.USER).name}),new k.Message({id:V.ALEXA,message:"Hey! Alexa here.",avatar:J.get(V.ALEXA).avatar}),new k.Message({id:V.USER,message:"Hello Alexa!",senderName:J.get(V.USER).name}),new k.Message({id:V.ALEXA,message:"Hey! Alexa here.",avatar:J.get(V.ALEXA).avatar}),new k.Message({id:V.USER,message:"Hello Alexa!",senderName:J.get(V.USER).name}),new k.Message({id:V.ALEXA,message:"Hey! Alexa here.",avatar:J.get(V.ALEXA).avatar}),new k.Message({id:V.USER,message:"Hello Alexa!",senderName:J.get(V.USER).name}),new k.Message({id:V.ALEXA,message:"Hey! Alexa here.",avatar:J.get(V.ALEXA).avatar}),new k.Message({id:V.USER,message:"Hello Alexa!",senderName:J.get(V.USER).name}),new k.Message({id:V.ALEXA,message:"Hey! Alexa here.",avatar:J.get(V.ALEXA).avatar}),new k.Message({id:V.USER,message:"Hello Alexa!",senderName:J.get(V.USER).name}),new k.Message({id:V.ALEXA,message:"Hey! Alexa here.",avatar:J.get(V.ALEXA).avatar}),new k.Message({id:V.USER,message:"Hello Alexa!",senderName:J.get(V.USER).name}),new k.Message({id:V.ALEXA,message:"Hey! Alexa here.",avatar:J.get(V.ALEXA).avatar}),new k.Message({id:V.USER,message:"Hello Alexa!",senderName:J.get(V.USER).name})],userRequestToAlexa:"",is_typing:!1},e}return Object(d.a)(t,e),Object(c.a)(t,[{key:"onUserRequestToAlexaSubmit",value:function(e){var t,a=this,n=this.state.userRequestToAlexa;if(e.preventDefault(),!n||0===n.length)return console.log("Request string for Alexa was empty: "+n),void this.setState({userRequestToAlexa:""});this.pushMessage(V.USER,n),this.setState({userRequestToAlexa:""}),this.context.isAuthenticated?(t=this.context.getAccessToken(),ie.sendTextMessageEvent(n,t).then(function(e){return e.map(function(e){return a.pushMessage(V.ALEXA,e)})}).catch(function(e){a.pushMessage(V.ALEXA,P.cannedErrorResponses.get(P.customErrorCodes.UNKNOWN_ERROR))})):console.log("Access token is missing.")}},{key:"pushMessage",value:function(e,t){var a=J.get(e);if(a)if(t&&0!==t.length){var n=this.state.messages.slice(),r=new k.Message({id:e,message:t,senderName:a.name,avatar:a.avatar});n.push(r),this.setState({messages:n})}else console.log("Empty message: "+t);else console.log("Unknown userId: "+e)}},{key:"handleChangeInUserRequestToAlexa",value:function(e){e.preventDefault(),this.setState({userRequestToAlexa:e.target.value})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{id:"leftpanel"},r.a.createElement("div",{className:"panel-body"},r.a.createElement(j.a,null,function(t){var a=t.height;return r.a.createElement(k.ChatFeed,{messages:e.state.messages,isTyping:e.state.is_typing,hasInputField:!1,showSenderName:!0,bubblesCentered:!1,maxHeight:a,chatBubble:H})})),r.a.createElement("div",{id:"chat-input"},r.a.createElement(F,{value:this.state.userRequestToAlexa,onChange:function(t){return e.handleChangeInUserRequestToAlexa(t)},onSubmit:function(t){return e.onUserRequestToAlexaSubmit(t)}})))}}]),t}(n.Component);ce.contextType=N;var le=ce;a(284);function ue(){return r.a.createElement("div",{id:"rightpanel"},r.a.createElement("div",{className:"panel-body"},"Right side content"))}a(285);function de(e){return r.a.createElement("div",{id:"welcome-screen"},r.a.createElement("h1",null," WELCOME TO SILENT ALEXA (Under Construction) "),r.a.createElement("h1",null," Login to get started "))}function me(){return Object(n.useContext)(N).isAuthenticated?[r.a.createElement(g.a,{key:"muiThemeProvider"},r.a.createElement(le,null)),r.a.createElement(ue,{key:"rightPanel"})]:r.a.createElement(de,null)}a(286);function he(){return r.a.createElement("div",{id:"footer"},r.a.createElement("div",{id:"footer-info"},r.a.createElement("span",null,"Footer Info Bar"),r.a.createElement("span",null," That Collapses")),r.a.createElement("div",{id:"footer-controls"},r.a.createElement("a",{href:"http://example.com"},"Clickable"),r.a.createElement("a",{href:"http://example.com"},"icons"),r.a.createElement("a",{href:"http://example.com"},"and"),r.a.createElement("a",{href:"http://example.com"},"links"),r.a.createElement("a",{href:"http://example.com"},"can"),r.a.createElement("a",{href:"http://example.com"},"go"),r.a.createElement("a",{href:"http://example.com"},"here")))}var Ee=a(297),ge=a(298),pe=a(296),fe=a(124),ve=a.n(fe);function Ae(e){var t;Object(B.hasIn)(e,["location","hash"])&&(t=ve.a.parse(e.location.hash));var a=Object(n.useContext)(N).setLWAResponse;return function(e){if(!e||!e.access_token||!e.expires_in||e.expires_in<0)return console.log("Encountered an error on login: "+T.a.inspect(e,{showHidden:!0,depth:null})),!1;return!0}(t)&&a(t),r.a.createElement(pe.a,{to:"/"})}var be=function(e){function t(){return Object(i.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement(pe.a,{to:"/"})}}]),t}(r.a.Component);function xe(e){return r.a.createElement(Ee.a,null,r.a.createElement(ge.a,{exact:!0,path:"/authresponse",render:function(t){return r.a.createElement(Ae,Object.assign({},t,e))}}),"// TODO: Redirect to NotFound Page for other paths rather than redirecting // to home. https://github.com/s-maheshbabu/silent-alexa/issues/55",r.a.createElement(ge.a,{exact:!0,path:"/:foo+",render:function(e){return r.a.createElement(be,e)}}))}var Re=function(e){function t(){return Object(i.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{id:"page"},r.a.createElement(xe,null),r.a.createElement(_,null),r.a.createElement(me,null),r.a.createElement(he,null))}}]),t}(n.Component),we=a(295),Oe=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function Te(e){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var t=e.installing;t.onstatechange=function(){"installed"===t.state&&(navigator.serviceWorker.controller?console.log("New content is available; please refresh."):console.log("Content is cached for offline use."))}}}).catch(function(e){console.error("Error during service worker registration:",e)})}o.a.render(r.a.createElement(we.a,null,r.a.createElement(function(e){var t=e.children,a=Object(n.useState)(!1),s=Object(A.a)(a,2),o=s[0],i=s[1],c={setLWAResponse:function(e){S(e),i(void 0!==w.a.get("amazon_Login_accessToken"))},isAuthenticated:o,getAccessToken:function(){return w.a.get("amazon_Login_accessToken")},clear:function(){w.a.remove("amazon_Login_accessToken"),i(!1)}};return r.a.createElement(N.Provider,{value:c},t)},null,r.a.createElement(Re,null))),document.getElementById("root")),function(){if("serviceWorker"in navigator){if(new URL("/silent-alexa",window.location).origin!==window.location.origin)return;window.addEventListener("load",function(){var e="".concat("/silent-alexa","/service-worker.js");Oe?(function(e){fetch(e).then(function(t){404===t.status||-1===t.headers.get("content-type").indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):Te(e)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(e),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://goo.gl/SC7cgQ")})):Te(e)})}}()},31:function(e,t,a){var n=(0,a(14).Map)({INVALID_REQUEST_EXCEPTION:"a canned response for INVALID_REQUEST_EXCEPTION",UNAUTHORIZED_REQUEST_EXCEPTION:"a canned response for UNAUTHORIZED_REQUEST_EXCEPTION",UNSUPPORTED_MEDIA_TYPE:"a canned response for UNSUPPORTED_MEDIA_TYPE",THROTTLING_EXCEPTION:"a canned response for THROTTLING_EXCEPTION",INTERNAL_SERVICE_EXCEPTION:"a canned response for INTERNAL_SERVICE_EXCEPTION","N/A":"a canned response for N/A Exception",UNKNOWN_ERROR:"a canned response for UNKNOWN_ERROR. This shouldn't ever happen. Don't show it as an Alexa bubble."}),r=Object.freeze({UNKNOWN_ERROR:"UNKNOWN_ERROR"});e.exports={cannedErrorResponses:n,customErrorCodes:r}},82:function(e,t){var a=Object.freeze({EVENTS:"/v20160207/events",DIRECTIVES:"/v20160207/directives"}),n=Object.freeze({NA:"https://avs-alexa-na.amazon.com",EU:"https://avs-alexa-eu.amazon.com",FE:"https://avs-alexa-fe.amazon.com"});e.exports={urls:n,paths:a}}},[[129,1,2]]]);
//# sourceMappingURL=main.6b68476a.chunk.js.map