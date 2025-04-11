import * as Yup from "yup";

export const invoiceValidationSchema = Yup.object({
    WholeSalerId: Yup.string(),
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
          SellingDate: Yup.string().required("Selling Date is required"),
        })
      )
      .min(1, "At least one product is required"),
  });