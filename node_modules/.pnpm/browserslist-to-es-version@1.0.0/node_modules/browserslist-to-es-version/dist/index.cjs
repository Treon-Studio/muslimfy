"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  browserslistToESVersion: () => browserslistToESVersion
});
module.exports = __toCommonJS(src_exports);
var import_browserslist = __toESM(require("browserslist"), 1);
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
  const projectBrowsers = (0, import_browserslist.default)(browsers, {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  browserslistToESVersion
});
