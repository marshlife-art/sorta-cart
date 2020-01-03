(this["webpackJsonpsorta-cart"]=this["webpackJsonpsorta-cart"]||[]).push([[0],{245:function(e,t,n){e.exports=n(346)},254:function(e,t,n){},346:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(16),i=n.n(c),o=n(57),l=(n(254),n(118)),u=n(77),s=n(390),m=n(385),p=n(121),f=n.n(p),d=n(228),h=Object(d.a)({palette:{type:"dark",primary:{main:"#556cd6"},secondary:{main:"#FF4081"},error:{main:f.a.A400}}}),g=Object(d.a)({palette:{type:"light",primary:{main:"#556cd6"},secondary:{main:"#FF4081"},error:{main:f.a.A400}}}),E=n(24),b=n(210),y=n.n(b),v=n(205),O=n(387),j=n(151),S=n(204),C=n(135),w=n.n(C),k=n(222),_=n.n(k),F=(n(223),n(136)),N=n.n(F),x=n(6),R=n(119),P=n(208),T=n(193),z=n(386),A=n(155),I=n.n(A),B={dark_mode:"false"},D=function(e){return{type:"SET_PREFERENCES",preferences:e}},q=function(e){return{type:"SET_FETCHING_PREFERENCES",isFetching:e}},G=Object(x.a)({paper:{border:"1px solid #d3d4d5"}})((function(e){return r.a.createElement(R.a,Object.assign({elevation:0,getContentAnchorEl:null,anchorOrigin:{vertical:"bottom",horizontal:"center"},transformOrigin:{vertical:"top",horizontal:"center"}},e))})),H=Object(x.a)((function(e){return{root:{}}}))(P.a);var L=Object(o.b)((function(e){return{preferencesService:e.preferences.preferencesService}}),(function(e){return{getPreferences:function(){return e((function(e){return I.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",new Promise((function(t,n){e(q(!0));var a=localStorage&&localStorage.getItem("preferences");e(D(a?JSON.parse(a):B)),e(q(!1)),t()})));case 1:case"end":return t.stop()}}))}))},setPreferences:function(t){return e(function(e){return function(t){return I.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",new Promise((function(n,a){t(q(!0)),e?(localStorage&&localStorage.setItem("preferences",JSON.stringify(e)),t(D(e))):t(D(B)),t(q(!1)),n()})));case 1:case"end":return n.stop()}}))}}(t))}}}))((function(e){var t=e.anchorEl,n=e.setAnchorEl,c=e.preferencesService,i=e.getPreferences,o=e.setPreferences,l=Object(a.useState)(null),u=Object(E.a)(l,2),s=u[0],m=u[1];return Object(a.useEffect)((function(){i()}),[i]),Object(a.useEffect)((function(){!c.isFetching&&c.preferences&&null===s&&m("true"===c.preferences.dark_mode)}),[c]),Object(a.useEffect)((function(){c&&c.preferences&&null!==s&&"true"===c.preferences.dark_mode!==s&&o({dark_mode:s?"true":"false"})}),[s]),r.a.createElement(r.a.Fragment,null,r.a.createElement(G,{id:"user--menu",anchorEl:t,keepMounted:!0,open:Boolean(t),onClose:function(){n(null)}},r.a.createElement(H,null,r.a.createElement(T.a,{primary:"Sign in",onClick:function(){return console.log("login")}})),r.a.createElement(H,null,r.a.createElement(T.a,{primary:"Register",onClick:function(){return console.log("register")}})),r.a.createElement(H,null,r.a.createElement(T.a,{onClick:function(){return m((function(e){return!e}))}},r.a.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},r.a.createElement("span",null,"Dark Theme"),r.a.createElement(z.a,{checked:null!==s&&void 0!==s&&s,value:"useDarkTheme",inputProps:{"aria-label":"secondary checkbox"}}))))))})),W=n(393),J=n(218),M=n(382),U=n(198),V=n(175),X=n(171),$=n(195),K=n(176),Q=n(200),Y=n(124),Z=n(189),ee=n(206),te=n(203),ne=n(221),ae=n.n(ne),re=n(58),ce=n(219),ie=n(229),oe=n(220),le=n(230),ue=n(15),se=(n(344),new(function(e){function t(){var e;return Object(ce.a)(this,t),(e=Object(ie.a)(this,Object(oe.a)(t).call(this,"SortaCartDatabase"))).cart=void 0,e.version(1).stores({cart:"++id,&product_id"}),e.cart=e.table("cart"),e}return Object(le.a)(t,e),t}(ue.a))),me=function(){var e=Object(a.useState)({status:"loading"}),t=Object(E.a)(e,2),n=t[0],r=t[1];return Object(a.useEffect)((function(){se.cart.toArray().then((function(e){return r({status:"loaded",payload:{line_items:e}})})).catch((function(e){r({status:"error",error:e})})),se.on("changes",(function(e){e.find((function(e){return"cart"===e.table}))&&se.cart.toArray().then((function(e){console.log("[useCartService] db changes!! "),r({status:"loaded",payload:{line_items:e}})})).catch((function(e){r({status:"error",error:e})}))}))}),[]),n},pe=function(){return se.cart.count().catch((function(e){return console.warn("[useCartItemCount] caught error:",e),0}))},fe=function(){var e=Object(a.useState)(0),t=Object(E.a)(e,2),n=t[0],r=t[1];return Object(a.useEffect)((function(){pe().then((function(e){return r(e)})),se.on("changes",(function(e){e.find((function(e){return"cart"===e.table}))&&pe().then((function(e){return r(e)}))}))}),[]),n},de=function(e){var t=Object(re.a)({},e,{product_id:e.id,quantity:1,total:parseFloat(e.ws_price),selected_unit:"CS"});delete t.id,se.cart.add(t).catch((function(e){return console.warn("[addToCart] caught error:",e)}))},he=function(e){se.cart.delete(e).catch((function(e){return console.warn("[removeItemFromCart] caught error:",e)}))},ge=function(){se.cart.clear().catch((function(e){console.warn("[emptyCart] caught error:",e)}))},Ee=function(e){se.cart.update(e.id,e).catch((function(e){return console.warn("[updateLineItem] caught error:",e)}))},be=.07,ye=Object(J.a)((function(e){return Object(M.a)({root:{width:"100%",overflowX:"auto",height:"100%"},table:{maxWidth:"95vw",padding:e.spacing(1),borderCollapse:"separate","& td":{border:"none"}},qtyinput:{width:"50px"}})}));function ve(e){return"$".concat("string"===typeof e?parseFloat(e).toFixed(2):e.toFixed(2))}function Oe(e){return"EA"===e.selected_unit&&e.u_price?e.quantity*parseFloat(e.u_price):e.quantity*parseFloat(e.ws_price)}function je(e){var t=ye(),n=e.line_items.map((function(e){return e.total})).reduce((function(e,t){return e+t}),0),a=be*n,c=a+n;return r.a.createElement(Y.a,{className:t.root},r.a.createElement(U.a,{className:t.table,"aria-label":"cart"},r.a.createElement($.a,null,r.a.createElement(K.a,null,r.a.createElement(X.a,{align:"center"}),r.a.createElement(X.a,null,"Description"),r.a.createElement(X.a,{align:"center"},"Price"),r.a.createElement(X.a,{align:"center"},"Unit"),r.a.createElement(X.a,{align:"center"},"Qty."),r.a.createElement(X.a,{align:"center"},"Total"))),r.a.createElement(V.a,null,e.line_items.map((function(e,n){return r.a.createElement(K.a,{key:"li".concat(n)},r.a.createElement(X.a,{align:"center"},r.a.createElement(j.a,{"aria-label":"delete",size:"small",onClick:function(t){return n=e.id,void he(n);var n}},r.a.createElement(ae.a,{fontSize:"inherit"}))),r.a.createElement(X.a,null,e.name," ",e.description),r.a.createElement(X.a,{align:"right"},r.a.createElement("div",null,"EA"===e.selected_unit&&e.u_price?ve(e.u_price):ve(e.ws_price)),r.a.createElement("div",null,function(e){var t=[];return e.pk&&1!==e.pk&&t.push(e.pk),e.size&&t.push(e.size),t.join(" / ")}(e))),r.a.createElement(X.a,{align:"center"},e.u_price&&e.u_price!==e.ws_price?r.a.createElement(te.a,{value:e.selected_unit,onChange:function(t){return function(e,t){e.selected_unit=t,e.total=Oe(e),Ee(e)}(e,t.target.value)},margin:"dense"},r.a.createElement(P.a,{value:"CS"},"Case"),r.a.createElement(P.a,{value:"EA"},"Each")):"CS"===e.unit_type?"Case":"Each"),r.a.createElement(X.a,{align:"right"},r.a.createElement(ee.a,{className:t.qtyinput,type:"number",InputLabelProps:{shrink:!0},margin:"dense",fullWidth:!0,value:e.quantity,onChange:function(t){return function(e,t){e.quantity=t>0?t:1,e.total=Oe(e),Ee(e)}(e,t.target.value)},inputProps:{min:"1",step:"1"}})),r.a.createElement(X.a,{align:"right"},ve(e.total)))})),r.a.createElement(K.a,null,r.a.createElement(X.a,{rowSpan:3,colSpan:3}),r.a.createElement(X.a,null,"Subtotal"),r.a.createElement(X.a,{align:"center"},e.line_items&&e.line_items.length),r.a.createElement(X.a,{align:"right"},ve(n))),r.a.createElement(K.a,null,r.a.createElement(X.a,null,"Tax"),r.a.createElement(X.a,{align:"center"},"".concat((100*be).toFixed(0)," %")),r.a.createElement(X.a,{align:"right"},ve(a))),r.a.createElement(K.a,null,r.a.createElement(X.a,null,"Total"),r.a.createElement(X.a,{align:"right",colSpan:2},r.a.createElement("b",null,ve(c))))),r.a.createElement(Q.a,null,r.a.createElement(K.a,null,r.a.createElement(X.a,{colSpan:3,align:"left"},r.a.createElement(Z.a,{variant:"contained",color:"secondary",onClick:e.emptyCartAndCloseDrawer},"Empty Cart")),r.a.createElement(X.a,{colSpan:3,align:"right"},r.a.createElement(Z.a,{variant:"contained",color:"primary"},"Checkout"))))))}var Se=function(e){var t=e.open,n=e.setOpen,a=me();return r.a.createElement(W.a,{anchor:"right",open:t,onClose:function(){return n(!t)}},"loaded"!==a.status&&"Loading...","loaded"===a.status&&a.payload.line_items.length>0&&r.a.createElement(je,{line_items:a.payload.line_items,emptyCartAndCloseDrawer:function(e){window.confirm("Are you sure?")&&(ge(),n(!1))}}))};var Ce="https://api.marshcoop.org",we={a:"Artificial ingredients",c:"Low carb",d:"Dairy free",f:"Food Service items",g:"Gluten free",k:"Kosher",l:"Low sodium/no salt",m:"Non-GMO Project Verified",og:"Organic",r:"Refined sugar",v:"Vegan",w:"Wheat free",ft:"Fair Trade",n:"Natural",s:"Specialty Only",y:"Yeast free",1:"100% organic",2:"95%+ organic",3:"70%+ organic"};var ke=Object(u.f)((function(e){var t=Object(a.createRef)(),n=fe(),c=Object(a.useState)(!1),i=Object(E.a)(c,2),o=i[0],l=i[1],u=r.a.useState(null),s=Object(E.a)(u,2),m=s[0],p=s[1],f={icon:function(){return r.a.createElement(O.a,{badgeContent:n,max:99,color:"primary"},r.a.createElement(w.a,null))},tooltip:"Cart",isFreeAction:!0,onClick:function(){return l(!o)}},d={icon:function(){return r.a.createElement(N.a,null)},tooltip:"User",isFreeAction:!0,onClick:function(e){p(e.currentTarget)}},h=Object(a.useState)([d]),g=Object(E.a)(h,2),b=g[0],C=g[1];Object(a.useEffect)((function(){C(n?[f,d]:[d])}),[n]);var k=Object(a.useState)((function(){fetch("".concat(Ce,"/categories")).then((function(e){return e.json()})).then((function(e){return R(e)})).catch(console.warn)})),F=Object(E.a)(k,2),x=F[0],R=F[1],P=Object(a.useState)((function(){fetch("".concat(Ce,"/sub_categories")).then((function(e){return e.json()})).then((function(e){return A(e)})).catch(console.warn)})),T=Object(E.a)(P,2),z=T[0],A=T[1],I=e.match&&e.match.params&&e.match.params.cat&&[e.match.params.cat],B=e.match&&e.match.params&&e.match.params.subcat&&[e.match.params.subcat];return r.a.createElement(r.a.Fragment,null,r.a.createElement(y.a,{tableRef:t,columns:[{title:"category",field:"category",type:"string",lookup:x,filterPlaceholder:"filter",defaultFilter:I},{title:"sub category",field:"sub_category",type:"string",lookup:z,editComponent:function(e){return console.log("editComponent arg:",e),r.a.createElement(r.a.Fragment,null,"subcat")},filterPlaceholder:"filter",defaultFilter:B},{title:"description",field:"description",type:"string",filtering:!1,render:function(e){return e.name?"".concat(e.name," -- ").concat(e.description):e.description}},{title:"pk",field:"pk",type:"numeric",filtering:!1},{title:"size",field:"size",type:"string",filtering:!1},{title:"unit type",field:"unit_type",type:"string",lookup:{CS:"Case",EA:"Each"},filterPlaceholder:"filter"},{title:"price",field:"ws_price",type:"currency",filtering:!1},{title:"unit price",field:"u_price",type:"currency",filtering:!1,render:function(e){return e.ws_price!==e.u_price?"$".concat(e.u_price):""}},{title:"properties",field:"codes",type:"string",lookup:we,filterPlaceholder:"filter",render:function(e){return e.codes.split(", ").map((function(e,t){return we[e]?r.a.createElement(v.a,{label:we[e],style:{margin:5},size:"small",key:"pprop".concat(t)}):""}))}},{title:void 0,field:void 0,type:"string",render:function(e){var t="add to shopping cart";return r.a.createElement(S.a,{"aria-label":t,title:t},r.a.createElement(j.a,{color:"primary",onClick:function(){return de(e)}},r.a.createElement(_.a,null)))}},{title:"upc",field:"upc_code",type:"string",hidden:!0},{title:"id",field:"id",type:"string",hidden:!0}],data:function(e){return new Promise((function(t,n){console.log("query:",e),fetch("".concat(Ce,"/products"),{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).then((function(e){return e.json()})).then((function(e){console.log("result",e),t(e)})).catch((function(e){return console.warn("onoz, caught err:",e),t({data:[],page:0,totalCount:0})}))}))},title:"MARSH COOP",options:{headerStyle:{position:"sticky",top:0},filterCellStyle:{maxWidth:"132px"},maxBodyHeight:"calc(100vh - 133px)",pageSize:50,pageSizeOptions:[50,100,500],debounceInterval:750,filtering:!0,search:!0,emptyRowsWhenPaging:!1},actions:b}),r.a.createElement(Se,{open:o,setOpen:l}),r.a.createElement(L,{anchorEl:m,setAnchorEl:p}))})),_e=n(84),Fe=n(384),Ne=n(357),xe=n(389),Re=n(226),Pe=n.n(Re),Te=n(95),ze=n(388),Ae=n(172),Ie=n(234),Be=n(11),De=n(225),qe=n.n(De),Ge=Object(J.a)((function(e){return Object(M.a)({root:{flexGrow:1},menuButton:{marginLeft:e.spacing(2)},title:Object(Te.a)({flexGrow:1,display:"none"},e.breakpoints.up("sm"),{display:"block"}),search:Object(Te.a)({position:"relative",borderRadius:e.shape.borderRadius,backgroundColor:Object(Be.c)(e.palette.common.white,.15),"&:hover":{backgroundColor:Object(Be.c)(e.palette.common.white,.25)},marginLeft:0,width:"100%"},e.breakpoints.up("sm"),{marginLeft:e.spacing(1),width:"auto"}),searchIcon:{width:e.spacing(7),height:"100%",position:"absolute",pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center"},inputRoot:{color:"inherit"},inputInput:Object(Te.a)({padding:e.spacing(1,1,1,7),transition:e.transitions.create("width"),width:"100%"},e.breakpoints.up("sm"),{width:120,"&:focus":{width:200}})})}));function He(){var e=Ge(),t=fe(),n=Object(a.useState)(!1),c=Object(E.a)(n,2),i=c[0],o=c[1],l=Object(a.useState)(null),u=Object(E.a)(l,2),s=u[0],m=u[1];return r.a.createElement(ze.a,{position:"static",className:e.root},r.a.createElement(Ae.a,null,r.a.createElement(_e.a,{className:e.title,variant:"h6",noWrap:!0},"MARSH COOP"),r.a.createElement("div",{className:e.search},r.a.createElement("div",{className:e.searchIcon},r.a.createElement(qe.a,null)),r.a.createElement(Ie.a,{placeholder:"Search\u2026",classes:{root:e.inputRoot,input:e.inputInput},inputProps:{"aria-label":"search"}})),t>0&&r.a.createElement(j.a,{edge:"end",className:e.menuButton,color:"inherit","aria-label":"show cart",onClick:function(){return o((function(e){return!e}))}},r.a.createElement(O.a,{badgeContent:t,max:99,color:"secondary"},r.a.createElement(w.a,null))),r.a.createElement(j.a,{edge:"end",className:e.menuButton,color:"inherit","aria-label":"user menu",onClick:function(e){m(e.currentTarget)}},r.a.createElement(N.a,null))),r.a.createElement(L,{anchorEl:s,setAnchorEl:m}),r.a.createElement(Se,{open:i,setOpen:o}))}var Le="https://api.marshcoop.org",We=Object(J.a)((function(e){return Object(M.a)({root:{width:"100%",overflowX:"auto",minHeight:"calc(100vh - 64px)",padding:e.spacing(2),display:"flex",flexDirection:"column"},crumbz:{display:"flex",flexDirection:"row"},gridRoot:{flexGrow:1,padding:e.spacing(2)},gridBtn:{width:"100%",height:"100%"},catHover:{"&:hover":{textDecoration:"underline",cursor:"pointer"}},catBtn:{overflow:"hidden",overflowWrap:"break-word"}})}));var Je=Object(u.f)((function(e){var t=We(),n=Object(a.useState)([]),c=Object(E.a)(n,2),i=c[0],o=c[1],l=Object(a.useState)(""),u=Object(E.a)(l,2),s=u[0],m=u[1],p=Object(a.useState)([]),f=Object(E.a)(p,2),d=f[0],h=f[1];return Object(a.useEffect)((function(){fetch("".concat(Le,"/categories")).then((function(e){return e.json()})).then((function(e){console.log("result",e),o(Object.keys(e))})).catch((function(e){console.warn("onoz, caught err:",e),o([])}))}),[o]),Object(a.useEffect)((function(){fetch("".concat(Le,"/sub_categories"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({categories:[s]})}).then((function(e){return e.json()})).then((function(e){console.log("result",e),h(Object.keys(e).map((function(e){return{name:e,label:e.split(":").join(": ").split(",").join(", ").split("/").join(" / ").split("-").join(" - ")}})))})).catch((function(e){console.warn("onoz, caught err:",e),h([])}))}),[s,h]),r.a.createElement(r.a.Fragment,null,r.a.createElement(He,null),r.a.createElement(Y.a,{className:t.root},r.a.createElement("div",{className:t.crumbz},r.a.createElement(_e.a,{variant:"h4",onClick:function(){return m("")},className:s&&t.catHover},"CATEGORIES"),s&&r.a.createElement(Ne.a,{in:!0},r.a.createElement(_e.a,{variant:"h4"},r.a.createElement(Pe.a,{fontSize:"large"}),s.toUpperCase()))),r.a.createElement(Fe.a,{container:!0,spacing:4,justify:"center",className:t.gridRoot},i&&!s&&i.map((function(e,n){return r.a.createElement(xe.a,{in:!0,style:{transitionDelay:"".concat(50*n,"ms")},key:"lb".concat(n)},r.a.createElement(Fe.a,{item:!0,xs:6,sm:4,md:3,lg:2},r.a.createElement(Z.a,{className:t.gridBtn,variant:"outlined",size:"large",key:"lb".concat(n),onClick:function(){return m(e)}},r.a.createElement(_e.a,{variant:"h5",className:t.catBtn},e))))})),i.length>0&&!s&&r.a.createElement(xe.a,{in:!0,style:{transitionDelay:"".concat(50*i.length,"ms")}},r.a.createElement(Fe.a,{item:!0,xs:6,sm:4,md:3,lg:2},r.a.createElement(Z.a,{className:t.gridBtn,variant:"outlined",size:"large",onClick:function(){return e.history.push("/products")}},r.a.createElement(_e.a,{variant:"h5",className:t.catBtn},"See Everything")))),d&&s&&d.map((function(n,a){return r.a.createElement(xe.a,{in:!0,style:{transitionDelay:"".concat(50*a,"ms")},key:"lb".concat(a)},r.a.createElement(Fe.a,{item:!0,xs:6,sm:4,md:3},r.a.createElement(Z.a,{className:t.gridBtn,variant:"outlined",size:"large",key:"lb".concat(a),onClick:function(){return e.history.push("/products/".concat(s,"/").concat(n.name))}},r.a.createElement(_e.a,{variant:"h5",className:t.catBtn},n.label))))})),d.length>0&&s&&r.a.createElement(xe.a,{in:!0,style:{transitionDelay:"".concat(50*d.length,"ms")}},r.a.createElement(Fe.a,{item:!0,xs:6,sm:4,md:3,lg:2},r.a.createElement(Z.a,{className:t.gridBtn,variant:"outlined",size:"large",onClick:function(){return e.history.push("/products/".concat(s))}},r.a.createElement(_e.a,{variant:"h5",className:t.catBtn},"See Everything")))))))}));var Me=Object(o.b)((function(e){return{preferencesService:e.preferences.preferencesService}}),{})((function(e){var t=e.preferencesService,n=t&&t.preferences&&"true"===t.preferences.dark_mode?h:g;return r.a.createElement(m.a,{theme:n},r.a.createElement(s.a,null),r.a.createElement(l.a,null,r.a.createElement(u.c,null,r.a.createElement(u.a,{path:"/products",exact:!0,component:ke}),r.a.createElement(u.a,{path:"/products/:cat/",exact:!0,component:ke}),r.a.createElement(u.a,{path:"/products/:cat/:subcat",component:ke}),r.a.createElement(u.a,{path:"/",component:Je}))))})),Ue=n(31),Ve=n(227),Xe=Object(Ue.c)({userService:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{isFetching:!1},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"SET":return Object(re.a)({},e,{user:t.user,error:void 0});case"SET_FETCHING":return Object(re.a)({},e,{isFetching:t.isFetching});case"SET_ERROR":return Object(re.a)({},e,{user:void 0,error:t.error})}return e}}),$e=Object(Ue.c)({preferencesService:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{isFetching:!1},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"SET_PREFERENCES":return Object(re.a)({},e,{preferences:t.preferences,error:void 0});case"SET_FETCHING_PREFERENCES":return Object(re.a)({},e,{isFetching:t.isFetching});case"SET_ERROR_PREFERENCES":return Object(re.a)({},e,{preferences:void 0,error:t.error})}return e}}),Ke=Object(Ue.e)(Object(Ue.c)({session:Xe,preferences:$e}),Object(Ue.a)(Ve.a));i.a.render(r.a.createElement(o.a,{store:Ke},r.a.createElement(Me,null)),document.querySelector("#root"))}},[[245,1,2]]]);
//# sourceMappingURL=main.7e5bf337.chunk.js.map