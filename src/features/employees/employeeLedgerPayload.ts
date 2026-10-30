export type LedgerFormValue = {
  date: string;
  amount: string;
  description: string;
  reference: string;
};

const workFields = (form: LedgerFormValue) => ({
  WorkDate: form.date,
  Description: form.description,
  Amount: Number(form.amount),
  BatchId: form.reference || undefined,
});

const paymentFields = (form: LedgerFormValue) => ({
  PaymentDate: form.date,
  Amount: Number(form.amount),
  Note: form.description,
  Reference: form.reference || undefined,
});

export const buildCreateWorkPayload = (employeeId: string, form: LedgerFormValue) => ({
  EmployeeId: employeeId,
  ...workFields(form),
});

export const buildUpdateWorkPayload = (itemId: string, form: LedgerFormValue) => ({
  ItemId: itemId,
  ...workFields(form),
});

export const buildCreatePaymentPayload = (employeeId: string, form: LedgerFormValue) => ({
  EmployeeId: employeeId,
  ...paymentFields(form),
});

export const buildUpdatePaymentPayload = (itemId: string, form: LedgerFormValue) => ({
  ItemId: itemId,
  ...paymentFields(form),
});
