declare module "mammoth" {
  export function convertToHtml(input: {
    buffer: Buffer;
  }): Promise<{ value: string }>;

  export interface Result {
    value: string;
    messages: string[];
  }

  export function extractRawText(input: { buffer: Buffer }): Promise<Result>;
}
