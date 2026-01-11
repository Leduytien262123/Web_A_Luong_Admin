import{q as z,s as q,f as y,o as g,n as A,g as a,v as V,x as j,d as I,e as u,y as _,l as d,z as b,t as S,r as $,T as D,A as F,B as H,C as T,j as x,h as w,D as M,E as R,G as W,F as O,H as L,I as E,J as N,p as B,a as U,k as G,u as J,K,i as Q,L as Z,M as X,N as Y,O as tt,P as nt,Q as et}from"./index-DYcU_f0W.js";import"./UserAvatar-D9wWu3xO.js";import{_ as ot}from"./_plugin-vue_export-helper-DlAUqK2U.js";const Bt={__name:"ToggleTheme",setup(t){const o=z(),n=q();async function i({clientX:e,clientY:s}){function p(){o.toggleDark(),V(n)()}if(!document.startViewTransition)return p();const f=[`circle(0px at ${e}px ${s}px)`,`circle(${Math.hypot(Math.max(e,window.innerWidth-e),Math.max(s,window.innerHeight-s))}px at ${e}px ${s}px)`];await document.startViewTransition(p).ready,document.documentElement.animate({clipPath:n.value?f.reverse():f},{duration:500,easing:"ease-in",pseudoElement:`::view-transition-${n.value?"old":"new"}(root)`})}return(e,s)=>(g(),y("i",{id:"toggleTheme",class:A(["mr-16 cursor-pointer",a(n)?"i-fe:moon":"i-fe:sun"]),onClick:i},null,2))}};var it=void 0;const rt=(t,o)=>{let n=null,i=!0;return function(){if(!i)return;i=!1;for(var e=arguments.length,s=new Array(e),p=0;p<e;p++)s[p]=arguments[p];let f=s;n&&clearTimeout(n),n=setTimeout(()=>{i=!0,t.apply(it,f)},o)}};var C=j({name:"Vue3IntroStep",props:{show:{type:Boolean,required:!0},config:{type:Object,required:!0}},emits:["update:show"],data(){return{originalBox:{left:250,top:250,width:200,height:100},tipBoxPosition:"bottom",currentIndex:0}},watch:{config:{deep:!0,handler(){this.currentIndex=0},immediate:!0},show(t){t?this.setBoxInfo():document.body.style.overflow="auto"}},computed:{tipBoxStyle(){if(this.tipBoxPosition==="right")return{left:`${this.originalBox.left+this.originalBox.width}px`,top:`${this.originalBox.top}px`};if(this.tipBoxPosition==="left")return{right:`${window.innerWidth-this.originalBox.left}px`,top:`${this.originalBox.top}px`};if(this.tipBoxPosition==="top")return{left:`${this.originalBox.left}px`,bottom:`${window.innerHeight-this.originalBox.top}px`};if(this.tipBoxPosition==="bottom")return{left:`${this.originalBox.left>window.innerWidth-300?window.innerWidth-300:this.originalBox.left}px`,top:`${this.originalBox.top+this.originalBox.height}px`}}},created(){this.init()},mounted(){window.onresize=rt(()=>{this.show&&this.setBoxInfo()},100)},beforeUnmount(){window.onresize=null},methods:{async prev(){let t=!0;if(this.config.tips[this.currentIndex]&&this.config.tips[this.currentIndex].onPrev&&(t=await this.config.tips[this.currentIndex].onPrev()),!t)throw new Error("onPrev 需要 Promise.resolve(true) 才可以继续往下走");this.setBoxInfo(this.currentIndex-1)},async next(){let t=!0;if(this.config.tips[this.currentIndex]&&this.config.tips[this.currentIndex].onNext&&(t=await this.config.tips[this.currentIndex].onNext()),!t)throw new Error("onNext 需要 Promise.resolve(true) 才可以继续往下走");this.setBoxInfo(this.currentIndex+1)},done(){this.$emit("update:show",!1)},async setBoxInfo(t){try{t===void 0&&(t=this.currentIndex),this.show&&(document.body.style.overflow="hidden");let o=this.config.tips[t].el,n=document.querySelector(o);if(!n)throw new Error("没有找到相应的元素");let i=n.getBoundingClientRect();this.originalBox={left:i.left,top:i.top,width:i.width,height:i.height},this.tipBoxPosition=this.config.tips[t].tipPosition,this.currentIndex=t}catch(o){throw new Error(o.message)}},init(){const{tips:t}=this.config;let o=null;if(t&&Array.isArray(t))if(t.length>0){this.currentIndex=0;try{let n=document.querySelector(t[0].el);o=setInterval(()=>{n=document.querySelector(t[0].el),n&&(this.setBoxInfo(0),clearInterval(o))},0)}catch(n){throw new Error(n.message)}}else throw new Error("tips数组不能为空");else throw new Error("config中的tips不存在或者不是数组")}}});const st=t=>(F("data-v-5d3b253c"),t=t(),H(),t),at={key:0,id:"intro_box"},lt=st(()=>d("div",{class:"round round-flicker"},null,-1)),ct=[lt],pt={class:"tip-content"},dt={class:"action",style:{justifyContent:"center"}};function ut(t,o,n,i,e,s){return g(),I(D,{name:"custom-classes-transition","enter-active-class":"animate__animated animate__fadeIn animate__faster","leave-active-class":"animate__animated animate__fadeOut animate__faster"},{default:u(()=>[t.show?(g(),y("div",at,[d("div",{class:"top",style:b({height:`${t.originalBox.top}px`,backgroundColor:`rgba(0, 0, 0, ${t.config.backgroundOpacity?t.config.backgroundOpacity:.9})`})},null,4),d("div",{class:"content",style:b({height:`${t.originalBox.height}px`})},[d("div",{class:"left",style:b({top:`${t.originalBox.top}px`,width:`${t.originalBox.left}px`,height:`${t.originalBox.height}px`,backgroundColor:`rgba(0, 0, 0, ${t.config.backgroundOpacity?t.config.backgroundOpacity:.9})`})},null,4),d("div",{class:"original-box",style:b({top:`${t.originalBox.top}px`,left:`${t.originalBox.left}px`,width:`${t.originalBox.width}px`,height:`${t.originalBox.height}px`})},ct,4),d("div",{class:"tip-box",style:b(t.tipBoxStyle)},[d("div",pt,[t.config.tips[t.currentIndex].title?(g(),y("div",{key:0,class:"title",style:b({textAlign:t.config.titleStyle&&t.config.titleStyle.textAlign?t.config.titleStyle.textAlign:"center",fontSize:t.config.titleStyle&&t.config.titleStyle.fontSize?t.config.titleStyle.fontSize:"19px"})},S(t.config.tips[t.currentIndex].title),5)):_("",!0),d("div",{class:"content",style:b({textAlign:t.config.contentStyle&&t.config.contentStyle.textAlign?t.config.contentStyle.textAlign:"center",fontSize:t.config.contentStyle&&t.config.contentStyle.fontSize?t.config.contentStyle.fontSize:"15px"})},S(t.config.tips[t.currentIndex].content),5),d("div",dt,[t.currentIndex!==0?$(t.$slots,"prev",{key:0,index:t.currentIndex,tipItem:t.config.tips[t.currentIndex]},()=>[d("div",{class:"item prev",onClick:o[0]||(o[0]=function(){return t.prev&&t.prev(...arguments)})},"上一步")]):_("",!0),t.currentIndex!==t.config.tips.length-1?$(t.$slots,"next",{key:1,index:t.currentIndex,tipItem:t.config.tips[t.currentIndex]},()=>[d("div",{class:"item next",onClick:o[1]||(o[1]=function(){return t.next&&t.next(...arguments)})},"下一步")]):_("",!0),t.currentIndex===t.config.tips.length-1?$(t.$slots,"done",{key:2,index:t.currentIndex,tipItem:t.config.tips[t.currentIndex]},()=>[d("div",{class:"item done",onClick:o[2]||(o[2]=function(){return t.done&&t.done(...arguments)})},"完成")]):$(t.$slots,"skip",{key:3,index:t.currentIndex,tipItem:t.config.tips[t.currentIndex]},()=>[d("div",{class:"item skip",onClick:o[3]||(o[3]=function(){return t.done&&t.done(...arguments)})},"跳过")])])])],4),d("div",{class:"right",style:b({top:`${t.originalBox.top}px`,left:`${t.originalBox.left+t.originalBox.width}px`,width:`calc(100% - ${t.originalBox.left+t.originalBox.width}px)`,height:`${t.originalBox.height}px`,backgroundColor:`rgba(0, 0, 0, ${t.config.backgroundOpacity?t.config.backgroundOpacity:.9})`}),ref:"tip_box"},null,4)],4),d("div",{class:"bottom",style:b({height:`calc(100% - ${t.originalBox.top}px - ${t.originalBox.height}px)`,backgroundColor:`rgba(0, 0, 0, ${t.config.backgroundOpacity?t.config.backgroundOpacity:.9})`})},null,4)])):_("",!0)]),_:3})}function ht(t,o){o===void 0&&(o={});var n=o.insertAt;if(!(typeof document>"u")){var i=document.head||document.getElementsByTagName("head")[0],e=document.createElement("style");e.type="text/css",n==="top"&&i.firstChild?i.insertBefore(e,i.firstChild):i.appendChild(e),e.styleSheet?e.styleSheet.cssText=t:e.appendChild(document.createTextNode(t))}}var ft=`
#intro_box[data-v-5d3b253c] {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
}
#intro_box > .top[data-v-5d3b253c] {
  width: 100%;
}
#intro_box > .content[data-v-5d3b253c] {
  width: 100%;
}
#intro_box > .content > .left[data-v-5d3b253c] {
  position: absolute;
  left: 0;
}
#intro_box > .content > .original-box[data-v-5d3b253c] {
  position: absolute;
  background-color: transparent;
  transition: all 0.3s cubic-bezier(0, 0, 0.58, 1);
}
#intro_box > .content > .original-box .round[data-v-5d3b253c] {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  opacity: 0.65;
  background-color: #9900ff;
}
#intro_box > .content > .original-box .round-flicker[data-v-5d3b253c]:before,
#intro_box > .content > .original-box .round-flicker[data-v-5d3b253c]:after {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  left: -1px;
  top: -1px;
  box-shadow: #9900ff 0px 0px 2px 2px;
  border: 1px solid rgba(153, 0, 255, 0.5);
  border-radius: 50%;
  animation: warn-5d3b253c 2s linear 0s infinite;
}
@keyframes warn-5d3b253c {
0% {
    transform: scale(0.5);
    opacity: 1;
}
25% {
    transform: scale(1);
    opacity: 0.75;
}
50% {
    transform: scale(1.5);
    opacity: 0.5;
}
75% {
    transform: scale(2);
    opacity: 0.25;
}
100% {
    transform: scale(2.5);
    opacity: 0;
}
}
#intro_box > .content > .tip-box[data-v-5d3b253c] {
  position: absolute;
  /*宽度应为内容宽*/
  width: fit-content;
  max-width: 300px;
  box-sizing: border-box;
  /*高度应为内容高度*/
  height: fit-content;
  transition: all 0.3s;
  z-index: 99999;
  padding: 12px;
  font-size: 15px;
}
#intro_box > .content > .tip-box > .tip-content[data-v-5d3b253c] {
  border-radius: 10px;
  overflow: hidden;
  padding: 10px;
  color: #fff;
}
#intro_box > .content > .tip-box > .tip-content > .title[data-v-5d3b253c] {
  font-weight: bold;
  margin-bottom: 10px;
}
#intro_box > .content > .tip-box > .tip-content > .content[data-v-5d3b253c] {
  white-space: normal;
  overflow-wrap: break-word;
  line-height: 1.5;
}
#intro_box > .content > .tip-box > .tip-content > .action[data-v-5d3b253c] {
  margin-top: 15px;
  width: 100%;
  display: flex;
}
#intro_box > .content > .tip-box > .tip-content > .action > .item[data-v-5d3b253c] {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
  padding: 5px 15px;
  color: #fff;
  font-weight: bold;
  border: 1px solid #ccc;
  margin: 5px;
}
#intro_box > .content > .tip-box > .tip-content > .action > .item.prev[data-v-5d3b253c] {
  color: #ccc;
}
#intro_box > .content > .tip-box > .tip-content > .action > .item.next[data-v-5d3b253c] {
  color: #ccc;
}
#intro_box > .content > .tip-box > .tip-content > .action > .item.done[data-v-5d3b253c] {
  color: #ccc;
}
#intro_box > .content > .tip-box > .tip-content > .action > .item.skip[data-v-5d3b253c] {
  color: #ccc;
}
#intro_box > .content > .right[data-v-5d3b253c] {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.9);
}
#intro_box > .bottom[data-v-5d3b253c] {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.9);
}
`;ht(ft);C.render=ut;C.__scopeId="data-v-5d3b253c";var gt=(()=>{const t=C;return t.install=o=>{o.component("Vue3IntroStep",t)},t})();const _t={__name:"BeginnerGuide",setup(t){const o=T(null),n=T(!1),i={backgroundOpacity:.8,titleStyle:{textAlign:"left",fontSize:"18px"},contentStyle:{textAlign:"left",fontSize:"14px"},tips:[{el:"#toggleTheme",tipPosition:"bottom",title:"Chuyển đổi chủ đề hệ thống",content:"Một chạm bật chế độ bảo vệ mắt"},{el:"#fullscreen",tipPosition:"bottom",title:"Toàn màn hình/Thoát toàn màn hình",content:"Một chạm bật toàn màn hình"},{el:"#theme-setting",tipPosition:"bottom",title:"Thiết lập màu chủ đề",content:"Điều chỉnh thành màu chủ đề bạn yêu thích"},{el:"#user-dropdown",tipPosition:"bottom",title:"Trung tâm cá nhân",content:"Xem thông tin cá nhân và thoát hệ thống"},{el:"#menu-collapse",tipPosition:"bottom",title:"Mở rộng/Thu gọn menu",content:"Một chạm mở rộng/thu gọn menu"},{el:"#top-tab",tipPosition:"bottom",title:"Thanh tab",content:"Cuộn chuột để điều chỉnh đến tầm nhìn tốt nhất"},{el:"#layout-setting",tipPosition:"left",title:"Điều chỉnh bố cục hệ thống",content:"Điều chỉnh bố cục hệ thống theo ý thích của bạn"}]};function e(){n.value=!1}function s(){n.value=!1}function p(){o.value.next()}function f(){o.value.prev()}return(k,l)=>{const c=M,r=R;return g(),y(O,null,[x(c,{trigger:"hover"},{trigger:u(()=>[d("i",{class:"i-fe:beginner mr-16 cursor-pointer text-20",onClick:l[0]||(l[0]=h=>n.value=!0)})]),default:u(()=>[l[2]||(l[2]=w(" Hướng dẫn sử dụng "))]),_:1,__:[2]}),x(a(gt),{ref_key:"myIntroStep",ref:o,show:a(n),"onUpdate:show":l[1]||(l[1]=h=>W(n)?n.value=h:null),config:i},{prev:u(({tipItem:h,index:v})=>[x(r,{class:"mr-12",type:"primary",color:"#fff","text-color":"#fff",ghost:"",round:"",size:"small",onClick:m=>f(h,v)},{default:u(()=>l[3]||(l[3]=[w(" Bước trước ")])),_:2,__:[3]},1032,["onClick"])]),next:u(({tipItem:h})=>[x(r,{class:"mr-12",type:"primary",color:"#fff","text-color":"#fff",ghost:"",round:"",size:"small",onClick:v=>p(h)},{default:u(()=>l[4]||(l[4]=[w(" Bước tiếp theo ")])),_:2,__:[4]},1032,["onClick"])]),skip:u(()=>[x(r,{type:"primary",color:"#fff","text-color":"#fff",ghost:"",round:"",size:"small",onClick:e},{default:u(()=>l[5]||(l[5]=[w(" Bỏ qua ")])),_:1,__:[5]})]),done:u(()=>[x(r,{type:"primary",color:"#fff","text-color":"#fff",ghost:"",round:"",size:"small",onClick:s},{default:u(()=>l[6]||(l[6]=[w(" Hoàn thành ")])),_:1,__:[6]})]),_:1},8,["show"])],64)}}},$t={__name:"Fullscreen",setup(t){const{isFullscreen:o,toggle:n}=L();return(i,e)=>(g(),y("i",{id:"fullscreen",class:A(["mr-16 cursor-pointer",a(o)?"i-fe:minimize":"i-fe:maximize"]),onClick:e[0]||(e[0]=(...s)=>a(n)&&a(n)(...s))},null,2))}},mt={__name:"ContextMenu",props:{show:{type:Boolean,default:!1},currentPath:{type:String,default:""},x:{type:Number,default:0},y:{type:Number,default:0}},emits:["update:show"],setup(t,{emit:o}){const n=t,i=o,e=E(),s=N(()=>[{label:"Tải lại",key:"reload",disabled:n.currentPath!==e.activeTab,icon:()=>B("i",{class:"i-mdi:refresh text-14"})},{label:"Đóng",key:"close",disabled:e.tabs.length<=1,icon:()=>B("i",{class:"i-mdi:close text-14"})},{label:"Đóng các tab khác",key:"close-other",disabled:e.tabs.length<=1,icon:()=>B("i",{class:"i-mdi:arrow-expand-horizontal text-14"})},{label:"Đóng bên trái",key:"close-left",disabled:e.tabs.length<=1||n.currentPath===e.tabs[0].path,icon:()=>B("i",{class:"i-mdi:arrow-expand-left text-14"})},{label:"Đóng bên phải",key:"close-right",disabled:e.tabs.length<=1||n.currentPath===e.tabs[e.tabs.length-1].path,icon:()=>B("i",{class:"i-mdi:arrow-expand-right text-14"})}]),p=U(),f=new Map([["reload",()=>{var c;e.reloadTab(p.fullPath,(c=p.meta)==null?void 0:c.keepAlive)}],["close",()=>{e.removeTab(n.currentPath)}],["close-other",()=>{e.removeOther(n.currentPath)}],["close-left",()=>{e.removeLeft(n.currentPath)}],["close-right",()=>{e.removeRight(n.currentPath)}]]);function k(){i("update:show",!1)}function l(c){const r=f.get(c);typeof r=="function"&&r(),k()}return(c,r)=>{const h=G;return g(),I(h,{show:t.show,options:a(s),x:t.x,y:t.y,placement:"bottom-start",onClickoutside:k,onSelect:l},null,8,["show","options","x","y"])}}},bt={id:"top-tab"},xt={__name:"index",setup(t){const o=J(),n=E(),i=K({show:!1,x:0,y:0,currentPath:""}),e=N(()=>{const c=new Set;return n.tabs.filter(r=>c.has(r.path)?!1:(c.add(r.path),!0))});function s(c){n.setActiveTab(c),o.push(c)}function p(){i.show=!0}function f(){i.show=!1}function k(c,r,h){Object.assign(i,{x:c,y:r,currentPath:h})}async function l(c,r){const{clientX:h,clientY:v}=c;f(),k(h,v,r.path),await tt(),p()}return(c,r)=>{const h=Z,v=Y;return g(),y("div",bt,[x(v,{value:a(n).activeTab,closable:a(n).tabs.length>1,type:"card",onClose:r[0]||(r[0]=m=>a(n).removeTab(m))},{default:u(()=>[(g(!0),y(O,null,Q(e.value,m=>(g(),I(h,{key:m.path,name:m.path,onClick:P=>s(m.path),onContextmenu:X(P=>l(P,m),["prevent"])},{default:u(()=>[w(S(m.title),1)]),_:2},1032,["name","onClick","onContextmenu"]))),128))]),_:1},8,["value","closable"]),a(i).show?(g(),I(mt,{key:0,show:a(i).show,"onUpdate:show":r[1]||(r[1]=m=>a(i).show=m),"current-path":a(i).currentPath,x:a(i).x,y:a(i).y},null,8,["show","current-path","x","y"])):_("",!0)])}}},It=ot(xt,[["__scopeId","data-v-19118a1b"]]),yt={class:"f-c-c"},St={__name:"ThemeSetting",setup(t){const o=z(),n=Object.entries(nt.getPresetColors()).map(([,i])=>i.primary);return(i,e)=>{const s=et,p=M;return g(),y("div",yt,[x(p,{trigger:"hover",placement:"bottom"},{trigger:u(()=>[x(s,{id:"theme-setting",class:"h-32 w-32",value:a(o).primaryColor,swatches:a(n),"on-update:value":f=>a(o).setPrimaryColor(f),"render-label":()=>""},null,8,["value","swatches","on-update:value"])]),default:u(()=>[e[0]||(e[0]=w(" 设置主题色 "))]),_:1,__:[0]})])}}};export{It as A,_t as _,Bt as a,$t as b,St as c};
