import * as Yup from "yup";

export const addProductionValidationSchema = Yup.object({
    ProductionInfo: Yup.array()
        .of(
            Yup.object({
                ProductId: Yup.string().required("Product ID is required"),
                // Current quantity is display-only and zero is a valid stock state.
                CurrentQuantity: Yup.number().min(0),
                    ProductionAmount: Yup.number()
                    .required("ProductionAmount is required")
                    .positive("ProductionAmount must be positive")
                    .integer("ProductionAmount must be an integer")
            })
        )
        .min(1, "At least one product is required"),
});
