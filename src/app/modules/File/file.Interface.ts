export interface IFile {
  imageOne?: string;
  imageTwo?: string;
  title?: string;
  shortDescription?: string;
  fileName: string;
  filePath: string;
  htmlContent?: string;
  isOnline: boolean;
  uploadDate: Date;
}
