import * as Yup from "yup";

export const addProductionValidationSchema = Yup.object({
    ProductionInfo: Yup.array()
        .of(
            Yup.object({
                ProductId: Yup.string().required("Product ID is required"),
                CurrentQuantity: Yup.number()
                    .required("CurrentQuantity is required")
                    .positive("CurrentQuantity must be positive")
                    .integer("CurrentQuantity must be an integer"),
                    ProductionAmount: Yup.number()
                    .required("ProductionAmount is required")
                    .positive("ProductionAmount must be positive")
                    .integer("ProductionAmount must be an integer")
            })
        )
        .min(1, "At least one product is required"),
});