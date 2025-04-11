import{z as c,y as d,w as x,j as t,C as i,T as a}from"./index-B7I1Kzlq.js";import{C as m}from"./CustomTable-BkyXfwP2.js";const N=[{key:"ProductName",label:"PRODUCT_NAME"},{key:"SellingPrice",label:"SELLING_COST"},{key:"Quantity",label:"QUANTITY"}];function A(){const{id:s}=c(),{data:n,isLoading:u}=d({pageNumber:1,pageSize:10,itemId:s??""}),e=(n==null?void 0:n.Data)||{},l=x(),r=o=>{l(`/invoice/${o}/${s}?isUpdate=${o==="update"}`)};return t.jsx(t.Fragment,{children:t.jsxs("div",{className:"w-full",children:[t.jsx(i,{onClick:()=>r("add"),className:"fixed bottom-4 right-4 ml-4 my-3 cursor-pointer",text:"ADD_INVOICE",variant:"primary"}),t.jsx(i,{onClick:()=>r("update"),className:"fixed bottom-4 right-30 ml-4 my-3 cursor-pointer",text:"UPDATE_INVOICE",variant:"primary"}),t.jsxs("div",{className:"max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10",children:[t.jsx("h2",{className:"text-2xl font-bold text-gray-800 border-b pb-3",children:"Invoice Details"}),t.jsxs("div",{className:"mt-4 space-y-2",children:[t.jsxs("div",{children:[t.jsx(a,{variant:"H6",content:"INVOICE_NUMBER"}),t.jsx(a,{variant:"Body1",content:": "+(e.InvoiceNumber??"N/A")})]}),t.jsxs("div",{children:[t.jsx(a,{variant:"H6",content:"WHOLESALER_NAME"}),t.jsx(a,{variant:"Body1",content:": "+(e.WholeSalerName??"N/A")})]}),t.jsxs("div",{children:[t.jsx(a,{variant:"H6",content:"PAYMENT_AMOUNT"}),t.jsx(a,{variant:"Body1",content:": "+(e.PaymentAmount??"N/A")})]}),t.jsxs("div",{children:[t.jsx(a,{variant:"H6",content:"PROFIT_MARGIN"}),t.jsx(a,{variant:"Body1",content:": "+(e.ProfitMargin??"N/A")})]}),t.jsxs("div",{children:[t.jsx(a,{variant:"H6",content:"TOTAL_AMOUNT"}),t.jsx(a,{variant:"Body1",content:": "+(e.TotalAmount??"N/A")})]}),t.jsxs("div",{children:[t.jsx(a,{variant:"H6",content:"CREATED_DATE"}),t.jsx(a,{variant:"Body1",content:": "+(e.CreatedDate?new Date(e.CreatedDate).toLocaleDateString()??"N/A":"N/A")})]}),(e==null?void 0:e.ProductSellInfo)&&(e==null?void 0:e.ProductSellInfo.length)>0&&t.jsx("div",{className:"p-10 w-full",children:t.jsx(m,{isRowClickable:!1,columns:N,data:(e==null?void 0:e.ProductSellInfo)||[],rowsPerPage:10})})]})]})]})})}export{A as default};
