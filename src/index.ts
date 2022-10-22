import * as core from "@actions/core"
import {SkynetClient} from "@skynetlabs/skynet-nodejs"

console.log("::log::loaded!")

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
    console.log(`::log::Downloading ${skylink} to ${localPath}`)
    const skynet = new SkynetClient(portal)
    await skynet.downloadFile(localPath, skylink)
    console.log(`::log::Downloaded ${skylink} to ${localPath}`)
  } catch (err: any) {
    core.setFailed(err)
  }
}
