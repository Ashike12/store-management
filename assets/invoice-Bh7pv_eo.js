import{K as r,I as m,r as d,j as e,C as u}from"./index-CyTrnyqj.js";import{C as I}from"./CustomTable-BmR0qkzk.js";const v=[{altKey:"",key:"InvoiceNumber",label:"INVOICE_NUMBER"},{altKey:"InvoiceType",key:"WholeSalerName",label:"WHOLE_SLAER_NAME"},{altKey:"",key:"TotalAmount",label:"TOTAL_BILL"},{altKey:"",key:"PaymentAmount",label:"PAID_AMOUNT"},{altKey:"",key:"ProfitMargin",label:"YOUR_PROFIT"}];function N(){const{data:a,isLoading:l,refetch:s}=r({pageNumber:1,pageSize:10,itemId:""}),i=m();let t=(a==null?void 0:a.Data)||[];const o=async c=>{i(`/invoice/details/${c.ItemId}`)},n=()=>{i("/invoice/add/new?isUpdate=false")};return d.useEffect(()=>{s()},[s]),e.jsx(e.Fragment,{children:e.jsxs("div",{className:"w-full",children:[e.jsx(u,{onClick:()=>n(),className:"fixed bottom-4 right-4 ml-4 my-3 cursor-pointer",text:"ADD_INVOICE",variant:"primary"}),a&&a&&t.length>0&&e.jsx("div",{className:"p-10 w-full",children:e.jsx(I,{isRowClickable:!0,handleRowClick:o,columns:v,data:t||[],rowsPerPage:10})}),!l&&t&&t.length==0&&e.jsx("div",{className:"p-10 w-full",children:"No data found"}),l&&e.jsx("div",{className:"p-10 w-full",children:"Loading..."})]})})}export{v as InvoiceColumns,N as default};
