# `siacodelabs/download-from-skynet`

This action allows to download a file from a Skynet platform.

## Usage

See [action.yaml](action.yaml)

### Basic

```yaml
steps:
  - name: Download file from Skynet platform
    uses: siacodelabs/download-from-skynet@v1
    with:
      portal: https://web3portal.com
      skylink: sia://AAAFCzW_tyQKKJZL_xHXHWE-XwusklwWBSv9HFFtZhtecA
      path: ${{ github.workspace }}/hello-world.txt
```
