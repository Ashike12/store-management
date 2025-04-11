import{x as p,z as A,w as b,A as g,y,j as e,T as t}from"./index-6Mo_YPcM.js";import{C as w}from"./CustomTable-BUQrBqCU.js";/**
 * @license @tabler/icons-react v3.31.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var T=p("outline","arrow-narrow-right","IconArrowNarrowRight",[["path",{d:"M5 12l14 0",key:"svg-0"}],["path",{d:"M15 16l4 -4",key:"svg-1"}],["path",{d:"M15 8l4 4",key:"svg-2"}]]);const k=[{key:"InvoiceNumber",label:"INVOICE_NUMBER"},{key:"CreatedDate",label:"CREATED_DATE"},{key:"WholeSalerName",label:"WHOLE_SLAER_NAME"},{key:"TotalAmount",label:"TOTAL_BILL"},{key:"PaymentAmount",label:"PAID_AMOUNT"},{key:"ProfitMargin",label:"YOUR_PROFIT"}];function _(){var i,d;const{id:x}=A(),m=b(),[h]=g(),u=(i=h.get("phoneNumber"))==null?void 0:i.trim(),{data:r,isLoading:I}=y({pageNumber:1,pageSize:10,itemId:"",wholesalerId:x??""}),s=(r==null?void 0:r.Data)||[],N=((d=s[0])==null?void 0:d.WholeSalerName)||"N/A",v=async a=>{m(`/invoice/details/${a.ItemId}`)},o=s.reduce((a,l)=>a+(l.TotalAmount||0),0),n=s.reduce((a,l)=>a+(l.PaymentAmount||0),0),c=s.reduce((a,l)=>a+(l.ProfitMargin||0),0),j=()=>{const a=`sms:+${u}?body=${encodeURIComponent("You have due amount of: "+(o-n)+" tk, please pay it as soon as possible.")}`;console.log(a),window.location.href=a};return e.jsx(e.Fragment,{children:e.jsx("div",{className:"w-full",children:e.jsxs("div",{className:" mx-auto p-6 bg-white shadow-lg rounded-xl mt-10",children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-800 border-b pb-3",children:"Wholesaler Details"}),e.jsxs("div",{className:"mt-4 space-y-2",children:[e.jsxs("div",{children:[e.jsx(t,{variant:"H6",content:"WHOLESALER_NAME"}),e.jsx(t,{className:"text-bold !text-green ",variant:"Body1",content:": "+N})]}),e.jsxs("div",{children:[e.jsx(t,{variant:"H6",content:"TOTAL_BILL"}),e.jsx(t,{className:"text-bold text-green",variant:"Body1",content:": "+o+" tk"})]}),e.jsxs("div",{children:[e.jsx(t,{variant:"H6",content:"TOTAL_PAID_AMOUNT"}),e.jsx(t,{className:"text-bold text-green",variant:"Body1",content:": "+n+" tk"})]}),e.jsxs("div",{className:"flex flex-row",children:[e.jsx(t,{variant:"H6",content:"TOTAL_DUE_AMOUNT"}),":",o<=n?e.jsx(t,{className:"!text-green text-bold",variant:"Body1",content:o-n+" tk"}):e.jsx(t,{className:"!text-red text-bold",variant:"Body1",content:" "+(o-n)+" tk"}),o>n&&e.jsxs("div",{className:"pl-3 cursor-pointer flex flex-row",onClick:j,children:[e.jsx(t,{content:"SEND_A_MESSAGE"}),e.jsx("div",{className:"pl-2 pt-[3px]",children:e.jsx(T,{size:20})})]})]}),e.jsxs("div",{children:[e.jsx(t,{variant:"H6",content:"YOUR_PROFIT"}),":",c>=0?e.jsx(t,{className:"!text-green text-bold",variant:"Body1",content:c+" tk"}):e.jsx(t,{className:"!text-red text-bold",variant:"Body1",content:" "+c+" tk"})]}),s&&(s==null?void 0:s.length)>0&&e.jsx("div",{className:"p-10 w-full",children:e.jsx(w,{isRowClickable:!0,handleRowClick:v,columns:k,data:s||[],rowsPerPage:10})})]})]})})})}export{_ as default};
