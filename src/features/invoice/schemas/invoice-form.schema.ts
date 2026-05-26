import * as Yup from "yup";

export const invoiceValidationSchema = Yup.object({
    InvoiceType: Yup.string().oneOf(['WHOLESALE', 'CONSUMER', 'DUE_PAYMENT']).required('Invoice type is required'),
    PaymentAmount: Yup.number().required("Payment Amount is required").positive("Amount must be positive"),
    ProductSellInfo: Yup.array()
      .of(
        Yup.object({
          ProductId: Yup.string().required("Product ID is required"),
          SellingPrice: Yup.number()
            .required("Selling Price is required")
            .positive("Selling Price must be positive"),
          Quantity: Yup.number()
            .required("Quantity is required")
            .positive("Quantity must be positive")
            .integer("Quantity must be an integer"),
        })
      )
      .when('InvoiceType', {
        is: (invoiceType: string) => invoiceType !== 'DUE_PAYMENT',
        then: schema => schema.min(1, "At least one product is required"),
        otherwise: schema => schema,
      }),
    // Due payment invoices must be tied to a wholesaler.
    WholeSalerId: Yup.string().when('InvoiceType', {
      is: 'DUE_PAYMENT',
      then: schema => schema.required('Wholesaler is required for due payment'),
      otherwise: schema => schema,
    }),
  });
