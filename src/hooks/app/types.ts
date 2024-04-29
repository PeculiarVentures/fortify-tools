export type AppFetchingStatus = "pending" | "resolved" | "rejected";

export interface AppFetchingType {
  connectionClientUpdate?: AppFetchingStatus;
  connectionDetect?: AppFetchingStatus;
  connectionSupport?: AppFetchingStatus;
  connectionApprove?: AppFetchingStatus;
  providers?: AppFetchingStatus;
  certificates?: AppFetchingStatus;
}
