declare module "@skynetlabs/skynet-nodejs" {
  export const defaultPortalUrl: string

  export class SkynetClient {
    constructor(portal: string)
    downloadFile(localPath: string, skylink: string): Promise<void>
    uploadFile(path: string): Promise<string>
    uploadDirectory(path: string): Promise<string>
  }
}
