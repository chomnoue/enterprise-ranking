import {XAWS} from "./aws";
import * as uuid from 'uuid'
import {Urls} from "../models/Urls";

export class FileAccess {

  constructor(
      private readonly s3 = new XAWS.S3({signatureVersion: 'v4'}),
      private readonly attachmentsBucket = process.env.ATTACHMENTS_BUCKET
  ) {
  }

  getGetSignedUrl(key: string): string {
    return this.getSignedUrl('getObject', key)
  }

  getPutSignedUrl(companyId: string): Urls {
    const key = companyId + "/" + uuid.v4()
    return {
      put: this.getSignedUrl('putObject', key),
      get: this.getGetSignedUrl(key)
    }
  }

  private getSignedUrl(action: string, key: string) {
    const signedUrlExpireSeconds = 60 * 5
    return this.s3.getSignedUrl(action, {
      Bucket: this.attachmentsBucket,
      Key: key,
      Expires: signedUrlExpireSeconds,
    });
  }
}
