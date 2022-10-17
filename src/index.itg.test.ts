import os from "node:os"
import path from "node:path"
import fs from "node:fs/promises"
import {run} from "./index"
import expected from "@akromio/expected"
import plugin from "@akromio/expected-fs"
import {SkynetClient} from "@skynetlabs/skynet-nodejs"
expected.plugin(plugin)

suite("download file", () => {
  const portal = "https://web3portal.com"
  const localPath = path.join(os.tmpdir(), "downloaded.txt")

  setup(async () => {
    await fs.unlink(localPath)
  })

  test("if file exists, this must be uploaded and output set", async () => {
    // (1) arrange
    const uploadLocalPath = path.join(__dirname, "../../tests/data/hello-world.txt")
    const skynet = new SkynetClient(portal)
    const skylink = await skynet.uploadFile(uploadLocalPath)

    process.env.INPUT_PORTAL = portal
    process.env.INPUT_PATH = localPath
    process.env.INPUT_SKYLINK = skylink

    // (2) act
    await run()

    // (3) assessment
    expected.file(localPath).equalToFile(uploadLocalPath)
  })

  test("if skylink doesn't exist, process.exitCode must be set to 1", async () => {
    // (1) arrange
    process.env.INPUT_PORTAL = portal
    process.env.INPUT_PATH = localPath
    process.env.INPUT_SKYLINK = "sia://unknown"

    // (2) act
    await run()

    // (3) assessment
    expected(process.exitCode).equalTo(1)
  })
})
