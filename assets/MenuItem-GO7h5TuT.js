import{b as O,a as T,r as l,u as j,Z as m,_ as L,$ as P,j as C,s as D,c as x,d as E,a0 as F,a1 as G,a2 as N,a3 as d,a4 as $,a5 as I}from"./index-CyTrnyqj.js";const M=O("MuiDivider",["root","absolute","fullWidth","inset","middle","flexItem","light","vertical","withChildren","withChildrenVertical","textAlignRight","textAlignLeft","wrapper","wrapperVertical"]);function U(e){return T("MuiMenuItem",e)}const r=O("MuiMenuItem",["root","focusVisible","dense","disabled","divider","gutters","selected"]),H=(e,t)=>{const{ownerState:a}=e;return[t.root,a.dense&&t.dense,a.divider&&t.divider,!a.disableGutters&&t.gutters]},z=e=>{const{disabled:t,dense:a,divider:s,disableGutters:n,selected:c,classes:o}=e,i=E({root:["root",a&&"dense",t&&"disabled",!n&&"gutters",s&&"divider",c&&"selected"]},U,o);return{...o,...i}},A=D(F,{shouldForwardProp:e=>G(e)||e==="classes",name:"MuiMenuItem",slot:"Root",overridesResolver:H})(N(({theme:e})=>({...e.typography.body1,display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",minHeight:48,paddingTop:6,paddingBottom:6,boxSizing:"border-box",whiteSpace:"nowrap","&:hover":{textDecoration:"none",backgroundColor:(e.vars||e).palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${r.selected}`]:{backgroundColor:e.vars?`rgba(${e.vars.palette.primary.mainChannel} / ${e.vars.palette.action.selectedOpacity})`:d(e.palette.primary.main,e.palette.action.selectedOpacity),[`&.${r.focusVisible}`]:{backgroundColor:e.vars?`rgba(${e.vars.palette.primary.mainChannel} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.focusOpacity}))`:d(e.palette.primary.main,e.palette.action.selectedOpacity+e.palette.action.focusOpacity)}},[`&.${r.selected}:hover`]:{backgroundColor:e.vars?`rgba(${e.vars.palette.primary.mainChannel} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.hoverOpacity}))`:d(e.palette.primary.main,e.palette.action.selectedOpacity+e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:e.vars?`rgba(${e.vars.palette.primary.mainChannel} / ${e.vars.palette.action.selectedOpacity})`:d(e.palette.primary.main,e.palette.action.selectedOpacity)}},[`&.${r.focusVisible}`]:{backgroundColor:(e.vars||e).palette.action.focus},[`&.${r.disabled}`]:{opacity:(e.vars||e).palette.action.disabledOpacity},[`& + .${M.root}`]:{marginTop:e.spacing(1),marginBottom:e.spacing(1)},[`& + .${M.inset}`]:{marginLeft:52},[`& .${I.root}`]:{marginTop:0,marginBottom:0},[`& .${I.inset}`]:{paddingLeft:36},[`& .${$.root}`]:{minWidth:36},variants:[{props:({ownerState:t})=>!t.disableGutters,style:{paddingLeft:16,paddingRight:16}},{props:({ownerState:t})=>t.divider,style:{borderBottom:`1px solid ${(e.vars||e).palette.divider}`,backgroundClip:"padding-box"}},{props:({ownerState:t})=>!t.dense,style:{[e.breakpoints.up("sm")]:{minHeight:"auto"}}},{props:({ownerState:t})=>t.dense,style:{minHeight:32,paddingTop:4,paddingBottom:4,...e.typography.body2,[`& .${$.root} svg`]:{fontSize:"1.25rem"}}}]}))),Z=l.forwardRef(function(t,a){const s=j({props:t,name:"MuiMenuItem"}),{autoFocus:n=!1,component:c="li",dense:o=!1,divider:g=!1,disableGutters:i=!1,focusVisibleClassName:w,role:R="menuitem",tabIndex:v,className:k,...V}=s,b=l.useContext(m),f=l.useMemo(()=>({dense:o||b.dense||!1,disableGutters:i}),[b.dense,o,i]),p=l.useRef(null);L(()=>{n&&p.current&&p.current.focus()},[n]);const B={...s,dense:f.dense,divider:g,disableGutters:i},u=z(s),S=P(p,a);let y;return s.disabled||(y=v!==void 0?v:-1),C.jsx(m.Provider,{value:f,children:C.jsx(A,{ref:S,role:R,tabIndex:y,component:c,focusVisibleClassName:x(u.focusVisible,w),className:x(u.root,k),...V,ownerState:B,classes:u})})});export{Z as M};
