export type TAppFetchingStatus = 'pending' | 'resolved' | 'rejected';

export interface IAppFetchingType {
  connectionClientUpdate?: TAppFetchingStatus;
  connectionDetect?: TAppFetchingStatus;
  connectionSupport?: TAppFetchingStatus;
  connectionApprove?: TAppFetchingStatus;
  providers?: TAppFetchingStatus;
  certificates?: TAppFetchingStatus;
}
