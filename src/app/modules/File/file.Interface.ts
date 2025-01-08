export interface IFile {
  userID: string;
  writer: string;
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
