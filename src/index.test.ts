import os from "node:os"
import path from "node:path"
import expected from "@akromio/expected"
import {constructor, interceptor, method, monitor, simulator} from "@akromio/doubles"

suite(__filename, () => {
  const portal = "https://web3portal.com"

  suite("run()", () => {
    const skynetModulePath = require.resolve("@skynetlabs/skynet-nodejs")
    const actionsCoreModulePath = require.resolve("@actions/core")
    const actionModulePath = require.resolve("./index")

    setup(() => {
      delete require.cache[skynetModulePath]
      delete require.cache[actionsCoreModulePath]
      delete require.cache[actionModulePath]
    })

    teardown(() => {
      interceptor.clear(skynetModulePath)
      interceptor.clear(actionsCoreModulePath)
    })

    test("when skylink exists, downloadFile() must be called and file saved", async () => {
      const {SkynetClient} = await import("@skynetlabs/skynet-nodejs")
      await import("@actions/core")

      // (1) arrange
      const localPath = path.join(os.tmpdir(), "downloaded.txt")
      const skylink = "sia://AAAFCzW_tyQKKJZL_xHXHWE-XwusklwWBSv9HFFtZhtecA"
      const downloadFile = monitor(method.returns())

      interceptor.module(skynetModulePath, {
        SkynetClient: constructor.returns(simulator(SkynetClient, {downloadFile}))
      })

      const getInput = monitor(
        method([
          {args: ["portal"], returns: portal},
          {args: ["skylink"], returns: skylink},
          {args: ["path"], returns: localPath}
        ])
      )

      interceptor.module(actionsCoreModulePath, {getInput})

      // (2) act
      const {run} = await import("./index")
      await run()

      // (3) assessment
      let log = monitor.log(getInput, {clear: true})
      expected(log.calls).equalTo(3)

      log = monitor.log(downloadFile, {clear: true})
      expected(log.calls).equalTo(1)
      expected(log.call.args).equalTo([localPath, skylink])
    })

    test("when skylink doesn't exist, error must be returned", async () => {
      const {SkynetClient} = await import("@skynetlabs/skynet-nodejs")
      await import("@actions/core")

      // (1) arrange
      const downloadFile = monitor(
        method.raises(new Error("Request failed with status code 404"))
      )
      const skynet = simulator(SkynetClient, {downloadFile})

      interceptor.module(skynetModulePath, {
        SkynetClient: constructor.returns(skynet)
      })

      const localPath = path.join(os.tmpdir(), "unknown.txt")
      const skylink = "sia://unknown.txt"
      const getInput = monitor(
        method([
          {args: ["portal"], returns: portal},
          {args: ["skylink"], returns: skylink},
          {args: ["path"], returns: localPath}
        ])
      )
      const setFailed = monitor(method())
      interceptor.module(actionsCoreModulePath, {getInput, setFailed})

      // (2) act
      const {run} = await import("./index")
      await run()

      // (3) assessment
      let log = monitor.log(getInput, {clear: true})
      expected(log.calls).equalTo(3)

      log = monitor.log(downloadFile, {clear: true})
      expected(log.calls).equalTo(1)
      expected(log.call.args).equalTo([localPath, skylink])

      log = monitor.log(setFailed, {clear: true})
      expected(log.calls).equalTo(1)
      expected(log.call.args).it(0).like("status code 404")
    })
  })
})
