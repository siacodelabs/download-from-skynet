import * as core from "@actions/core"
import {SkynetClient} from "@skynetlabs/skynet-nodejs"

/**
 * Runs the action.
 */
export async function run(): Promise<void> {
  try {
    // (1) get parameters
    const portal = core.getInput("portal")
    const skylink = core.getInput("skylink")
    const localPath = core.getInput("path")

    // (2) download
    const skynet = new SkynetClient(portal)
    await skynet.downloadFile(localPath, skylink)
  } catch (err: any) {
    core.setFailed(err)
  }
}
