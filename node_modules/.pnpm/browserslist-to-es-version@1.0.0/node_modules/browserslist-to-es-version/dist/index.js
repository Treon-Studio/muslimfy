// src/index.ts
import browserslist from "browserslist";
var ES_VERSIONS_MAP = {
  chrome: [51, 52, 57, 64],
  edge: [15, 15, 15, 79],
  safari: [10, 10.3, 11, 16.4],
  firefox: [54, 54, 54, 78],
  opera: [38, 39, 44, 51],
  samsung: [5, 6.2, 6.2, 8.2]
};
var renameBrowser = (name) => {
  return name === "ios_saf" ? "safari" : name;
};
function browserslistToESVersion(browsers) {
  const projectBrowsers = browserslist(browsers, {
    ignoreUnknownVersions: true
  });
  let esVersion = 2018;
  for (const item of projectBrowsers) {
    const pairs = item.split(" ");
    if (pairs.length < 2) {
      continue;
    }
    const browser = renameBrowser(pairs[0]);
    const version = Number(pairs[1].split("-")[0]);
    if (Number.isNaN(version)) {
      continue;
    }
    if (browser === "ie" || browser === "android" && version < 6) {
      esVersion = 5;
      break;
    }
    const versions = ES_VERSIONS_MAP[browser];
    if (!versions) {
      continue;
    }
    if (version < versions[0]) {
      esVersion = Math.min(5, esVersion);
    } else if (version < versions[1]) {
      esVersion = Math.min(2015, esVersion);
    } else if (version < versions[2]) {
      esVersion = Math.min(2016, esVersion);
    } else if (version < versions[3]) {
      esVersion = Math.min(2017, esVersion);
    }
  }
  return esVersion;
}
export {
  browserslistToESVersion
};
