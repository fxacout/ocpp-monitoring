import * as crypto from 'crypto'

export const hash256 = (data: string) => {
  return crypto.createHash("sha256").update(data, "utf-8").digest("base64");
}