// eslint-disable-next-line import/no-cycle
import { sampleRUM } from "./lib-franklin.js";

// Core Web Vitals RUM collection
sampleRUM("cwv");

// add more delayed functionality here
import "./runtime-loader.js";
import "./ushell-runtime-manager.js";
import "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
