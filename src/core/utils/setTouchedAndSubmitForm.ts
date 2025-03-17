export const validateAndSubmit = async (
  handleSubmit: () => void,
  validateForm: () => Promise<Record<string, string>>,
  setTouched: (fields: Record<string, boolean>) => void,
) => {
  // Validate the form
  const errors = await validateForm();

  if (Object.keys(errors).length > 0) {
    // If there are errors, mark all fields as touched
    const touchedFields = Object.keys(errors).reduce(
      (acc, field) => {
        acc[field] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    setTouched(touchedFields);
  } else {
    // No errors, submit the form
    handleSubmit();
  }
};
