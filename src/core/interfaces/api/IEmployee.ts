export interface IEmployeeSummary {
  ItemId: string;
  FirstName?: string;
  LastName?: string;
  DisplayName: string;
  Email: string;
  Phone: string;
  Address: string;
  Active: boolean;
  TotalEarned: number;
  TotalPaid: number;
  Balance: number;
}

export interface IEmployeeInput {
  FirstName: string;
  LastName: string;
  DisplayName?: string;
  Email: string;
  Phone: string;
  Address: string;
  Password: string;
  Active?: boolean;
}

export interface IWorkEntry {
  ItemId: string;
  EmployeeId: string;
  WorkDate: string;
  Description: string;
  Amount: number;
  BatchId?: string;
}

export interface IPaymentEntry {
  ItemId: string;
  EmployeeId: string;
  PaymentDate: string;
  Amount: number;
  Note?: string;
  Reference?: string;
}

export type FeedbackStatus = 'pending' | 'accepted' | 'declined';
export interface IEmployeeFeedback {
  ItemId: string;
  EmployeeId: string;
  EmployeeName?: string;
  TargetType: 'work' | 'payment';
  TargetId: string;
  Explanation: string;
  Status: FeedbackStatus;
  ResolutionNote?: string;
  CreatedDate: string;
  AdminReadAt?: string;
}

export interface IEmployeeOverview {
  Employee: Pick<IEmployeeSummary, 'ItemId' | 'DisplayName' | 'Email' | 'Phone' | 'Address' | 'Active'>;
  Summary: {
    TotalEarned: number;
    TotalPaid: number;
    Balance: number;
    BalanceDirection: 'business_owes_employee' | 'employee_owes_business' | 'settled';
  };
  DailyWork: {WorkDate: string; Amount: number}[];
  WorkEntries: IWorkEntry[];
  PaymentEntries: IPaymentEntry[];
  Feedback: IEmployeeFeedback[];
}

export interface ICommandResponse<T = {ItemId: string}> {
  IsSuccess: boolean;
  Data: T;
  ErrorMessage?: string;
}

export interface IPaginatedEmployeeResponse<T> {
  IsSuccess: boolean;
  Data: T[];
  TotalCount: number;
}
