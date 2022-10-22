import { ensureUrl } from "./utils";

describe("ensureUrl", () => {
  const cases = [
    ["siasky.net", "https://siasky.net"],
    ["https://siasky.net", "https://siasky.net"],
    ["http://siasky.net", "http://siasky.net"],
  ];

  it.each(cases)("('%s') should result in '%s'", (input, expectedResult) => {
    const result = ensureUrl(input);
    expect(result).toEqual(expectedResult);
  });
});
