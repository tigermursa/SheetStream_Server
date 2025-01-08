export interface IFile {
  userID: string;
  imageOne?: string;
  imageTwo?: string;
  title?: string;
  description?: string;
  fileName: string;
  filePath: string;
  htmlContent?: string;
  isOnline: boolean;
  uploadDate: Date;
}
