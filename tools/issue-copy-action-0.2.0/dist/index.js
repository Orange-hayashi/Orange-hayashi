module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(104);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, __unusedexports, __webpack_require__) {

const Octokit = __webpack_require__(529);

const CORE_PLUGINS = [
  __webpack_require__(372),
  __webpack_require__(19), // deprecated: remove in v17
  __webpack_require__(190),
  __webpack_require__(148),
  __webpack_require__(248),
  __webpack_require__(586),
  __webpack_require__(430),

  __webpack_require__(850) // deprecated: remove in v17
];

module.exports = Octokit.plugin(CORE_PLUGINS);


/***/ }),

/***/ 2:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);
const macosRelease = __webpack_require__(118);
const winRelease = __webpack_require__(49);

const osName = (platform, release) => {
	if (!platform && release) {
		throw new Error('You can\'t specify a `release` without specifying `platform`');
	}

	platform = platform || os.platform();

	let id;

	if (platform === 'darwin') {
		if (!release && os.platform() === 'darwin') {
			release = os.release();
		}

		const prefix = release ? (Number(release.split('.')[0]) > 15 ? 'macOS' : 'OS X') : 'macOS';
		id = release ? macosRelease(release).name : '';
		return prefix + (id ? ' ' + id : '');
	}

	if (platform === 'linux') {
		if (!release && os.platform() === 'linux') {
			release = os.release();
		}

		id = release ? release.replace(/^(\d+\.\d+).*/, '$1') : '';
		return 'Linux' + (id ? ' ' + id : '');
	}

	if (platform === 'win32') {
		if (!release && os.platform() === 'win32') {
			release = os.release();
		}

		id = release ? winRelease(release) : '';
		return 'Windows' + (id ? ' ' + id : '');
	}

	return platform;
};

module.exports = osName;


/***/ }),

/***/ 5:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var iconvLite = __webpack_require__(864);
// Load Iconv from an external file to be able to disable Iconv for webpack
// Add /\/iconv-loader$/ to webpack.IgnorePlugin to ignore it
var Iconv = __webpack_require__(999);

// Expose to the world
module.exports.convert = convert;

/**
 * Convert encoding of an UTF-8 string or a buffer
 *
 * @param {String|Buffer} str String to be converted
 * @param {String} to Encoding to be converted to
 * @param {String} [from='UTF-8'] Encoding to be converted from
 * @param {Boolean} useLite If set to ture, force to use iconvLite
 * @return {Buffer} Encoded string
 */
function convert(str, to, from, useLite) {
    from = checkEncoding(from || 'UTF-8');
    to = checkEncoding(to || 'UTF-8');
    str = str || '';

    var result;

    if (from !== 'UTF-8' && typeof str === 'string') {
        str = new Buffer(str, 'binary');
    }

    if (from === to) {
        if (typeof str === 'string') {
            result = new Buffer(str);
        } else {
            result = str;
        }
    } else if (Iconv && !useLite) {
        try {
            result = convertIconv(str, to, from);
        } catch (E) {
            console.error(E);
            try {
                result = convertIconvLite(str, to, from);
            } catch (E) {
                console.error(E);
                result = str;
            }
        }
    } else {
        try {
            result = convertIconvLite(str, to, from);
        } catch (E) {
            console.error(E);
            result = str;
        }
    }


    if (typeof result === 'string') {
        result = new Buffer(result, 'utf-8');
    }

    return result;
}

/**
 * Convert encoding of a string with node-iconv (if available)
 *
 * @param {String|Buffer} str String to be converted
 * @param {String} to Encoding to be converted to
 * @param {String} [from='UTF-8'] Encoding to be converted from
 * @return {Buffer} Encoded string
 */
function convertIconv(str, to, from) {
    var response, iconv;
    iconv = new Iconv(from, to + '//TRANSLIT//IGNORE');
    response = iconv.convert(str);
    return response.slice(0, response.length);
}

/**
 * Convert encoding of astring with iconv-lite
 *
 * @param {String|Buffer} str String to be converted
 * @param {String} to Encoding to be converted to
 * @param {String} [from='UTF-8'] Encoding to be converted from
 * @return {Buffer} Encoded string
 */
function convertIconvLite(str, to, from) {
    if (to === 'UTF-8') {
        return iconvLite.decode(str, from);
    } else if (from === 'UTF-8') {
        return iconvLite.encode(str, to);
    } else {
        return iconvLite.encode(iconvLite.decode(str, from), to);
    }
}

/**
 * Converts charset name if needed
 *
 * @param {String} name Character set
 * @return {String} Character set name
 */
function checkEncoding(name) {
    return (name || '').toString().trim().
    replace(/^latin[\-_]?(\d+)$/i, 'ISO-8859-$1').
    replace(/^win(?:dows)?[\-_]?(\d+)$/i, 'WINDOWS-$1').
    replace(/^utf[\-_]?(\d+)$/i, 'UTF-$1').
    replace(/^ks_c_5601\-1987$/i, 'CP949').
    replace(/^us[\-_]?ascii$/i, 'ASCII').
    toUpperCase();
}


/***/ }),

/***/ 8:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = iterator;

const normalizePaginatedListResponse = __webpack_require__(301);

function iterator(octokit, options) {
  const headers = options.headers;
  let url = octokit.request.endpoint(options).url;

  return {
    [Symbol.asyncIterator]: () => ({
      next() {
        if (!url) {
          return Promise.resolve({ done: true });
        }

        return octokit
          .request({ url, headers })

          .then(response => {
            normalizePaginatedListResponse(octokit, url, response);

            // `response.headers.link` format:
            // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
            // sets `url` to undefined if "next" URL is not present or `link` header is not set
            url = ((response.headers.link || "").match(
              /<([^>]+)>;\s*rel="next"/
            ) || [])[1];

            return { value: response };
          });
      }
    })
  };
}


/***/ }),

/***/ 9:
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(969);

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		process.nextTick(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;


/***/ }),

/***/ 11:
/***/ (function(module) {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 19:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationPlugin;

const { Deprecation } = __webpack_require__(692);
const once = __webpack_require__(969);

const deprecateAuthenticate = once((log, deprecation) => log.warn(deprecation));

const authenticate = __webpack_require__(674);
const beforeRequest = __webpack_require__(471);
const requestError = __webpack_require__(349);

function authenticationPlugin(octokit, options) {
  if (options.auth) {
    octokit.authenticate = () => {
      deprecateAuthenticate(
        octokit.log,
        new Deprecation(
          '[@octokit/rest] octokit.authenticate() is deprecated and has no effect when "auth" option is set on Octokit constructor'
        )
      );
    };
    return;
  }
  const state = {
    octokit,
    auth: false
  };
  octokit.authenticate = authenticate.bind(null, state);
  octokit.hook.before("request", beforeRequest.bind(null, state));
  octokit.hook.error("request", requestError.bind(null, state));
}


/***/ }),

/***/ 20:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const cp = __webpack_require__(129);
const parse = __webpack_require__(568);
const enoent = __webpack_require__(881);

function spawn(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

module.exports = spawn;
module.exports.spawn = spawn;
module.exports.sync = spawnSync;

module.exports._parse = parse;
module.exports._enoent = enoent;


/***/ }),

/***/ 39:
/***/ (function(module) {

"use strict";

module.exports = opts => {
	opts = opts || {};

	const env = opts.env || process.env;
	const platform = opts.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(env).find(x => x.toUpperCase() === 'PATH') || 'Path';
};


/***/ }),

/***/ 47:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = factory;

const Octokit = __webpack_require__(402);
const registerPlugin = __webpack_require__(855);

function factory(plugins) {
  const Api = Octokit.bind(null, plugins || []);
  Api.plugin = registerPlugin.bind(null, plugins || []);
  return Api;
}


/***/ }),

/***/ 49:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);
const execa = __webpack_require__(955);

// Reference: https://www.gaijin.at/en/lstwinver.php
const names = new Map([
	['10.0', '10'],
	['6.3', '8.1'],
	['6.2', '8'],
	['6.1', '7'],
	['6.0', 'Vista'],
	['5.2', 'Server 2003'],
	['5.1', 'XP'],
	['5.0', '2000'],
	['4.9', 'ME'],
	['4.1', '98'],
	['4.0', '95']
]);

const windowsRelease = release => {
	const version = /\d+\.\d/.exec(release || os.release());

	if (release && !version) {
		throw new Error('`release` argument doesn\'t match `n.n`');
	}

	const ver = (version || [])[0];

	// Server 2008, 2012 and 2016 versions are ambiguous with desktop versions and must be detected at runtime.
	// If `release` is omitted or we're on a Windows system, and the version number is an ambiguous version
	// then use `wmic` to get the OS caption: https://msdn.microsoft.com/en-us/library/aa394531(v=vs.85).aspx
	// If the resulting caption contains the year 2008, 2012 or 2016, it is a server version, so return a server OS name.
	if ((!release || release === os.release()) && ['6.1', '6.2', '6.3', '10.0'].includes(ver)) {
		const stdout = execa.sync('wmic', ['os', 'get', 'Caption']).stdout || '';
		const year = (stdout.match(/2008|2012|2016/) || [])[0];
		if (year) {
			return `Server ${year}`;
		}
	}

	return names.get(ver);
};

module.exports = windowsRelease;


/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 91:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

var Buffer = __webpack_require__(293).Buffer;

// Export Node.js internal encodings.

module.exports = {
    // Encodings
    utf8:   { type: "_internal", bomAware: true},
    cesu8:  { type: "_internal", bomAware: true},
    unicode11utf8: "utf8",

    ucs2:   { type: "_internal", bomAware: true},
    utf16le: "ucs2",

    binary: { type: "_internal" },
    base64: { type: "_internal" },
    hex:    { type: "_internal" },

    // Codec.
    _internal: InternalCodec,
};

//------------------------------------------------------------------------------

function InternalCodec(codecOptions, iconv) {
    this.enc = codecOptions.encodingName;
    this.bomAware = codecOptions.bomAware;

    if (this.enc === "base64")
        this.encoder = InternalEncoderBase64;
    else if (this.enc === "cesu8") {
        this.enc = "utf8"; // Use utf8 for decoding.
        this.encoder = InternalEncoderCesu8;

        // Add decoder for versions of Node not supporting CESU-8
        if (new Buffer('eda0bdedb2a9', 'hex').toString() !== '　') {
            this.decoder = InternalDecoderCesu8;
            this.defaultCharUnicode = iconv.defaultCharUnicode;
        }
    }
}

InternalCodec.prototype.encoder = InternalEncoder;
InternalCodec.prototype.decoder = InternalDecoder;

//------------------------------------------------------------------------------

// We use node.js internal decoder. Its signature is the same as ours.
var StringDecoder = __webpack_require__(304).StringDecoder;

if (!StringDecoder.prototype.end) // Node v0.8 doesn't have this method.
    StringDecoder.prototype.end = function() {};


function InternalDecoder(options, codec) {
    StringDecoder.call(this, codec.enc);
}

InternalDecoder.prototype = StringDecoder.prototype;


//------------------------------------------------------------------------------
// Encoder is mostly trivial

function InternalEncoder(options, codec) {
    this.enc = codec.enc;
}

InternalEncoder.prototype.write = function(str) {
    return new Buffer(str, this.enc);
}

InternalEncoder.prototype.end = function() {
}


//------------------------------------------------------------------------------
// Except base64 encoder, which must keep its state.

function InternalEncoderBase64(options, codec) {
    this.prevStr = '';
}

InternalEncoderBase64.prototype.write = function(str) {
    str = this.prevStr + str;
    var completeQuads = str.length - (str.length % 4);
    this.prevStr = str.slice(completeQuads);
    str = str.slice(0, completeQuads);

    return new Buffer(str, "base64");
}

InternalEncoderBase64.prototype.end = function() {
    return new Buffer(this.prevStr, "base64");
}


//------------------------------------------------------------------------------
// CESU-8 encoder is also special.

function InternalEncoderCesu8(options, codec) {
}

InternalEncoderCesu8.prototype.write = function(str) {
    var buf = new Buffer(str.length * 3), bufIdx = 0;
    for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        // Naive implementation, but it works because CESU-8 is especially easy
        // to convert from UTF-16 (which all JS strings are encoded in).
        if (charCode < 0x80)
            buf[bufIdx++] = charCode;
        else if (charCode < 0x800) {
            buf[bufIdx++] = 0xC0 + (charCode >>> 6);
            buf[bufIdx++] = 0x80 + (charCode & 0x3f);
        }
        else { // charCode will always be < 0x10000 in javascript.
            buf[bufIdx++] = 0xE0 + (charCode >>> 12);
            buf[bufIdx++] = 0x80 + ((charCode >>> 6) & 0x3f);
            buf[bufIdx++] = 0x80 + (charCode & 0x3f);
        }
    }
    return buf.slice(0, bufIdx);
}

InternalEncoderCesu8.prototype.end = function() {
}

//------------------------------------------------------------------------------
// CESU-8 decoder is not implemented in Node v4.0+

function InternalDecoderCesu8(options, codec) {
    this.acc = 0;
    this.contBytes = 0;
    this.accBytes = 0;
    this.defaultCharUnicode = codec.defaultCharUnicode;
}

InternalDecoderCesu8.prototype.write = function(buf) {
    var acc = this.acc, contBytes = this.contBytes, accBytes = this.accBytes, 
        res = '';
    for (var i = 0; i < buf.length; i++) {
        var curByte = buf[i];
        if ((curByte & 0xC0) !== 0x80) { // Leading byte
            if (contBytes > 0) { // Previous code is invalid
                res += this.defaultCharUnicode;
                contBytes = 0;
            }

            if (curByte < 0x80) { // Single-byte code
                res += String.fromCharCode(curByte);
            } else if (curByte < 0xE0) { // Two-byte code
                acc = curByte & 0x1F;
                contBytes = 1; accBytes = 1;
            } else if (curByte < 0xF0) { // Three-byte code
                acc = curByte & 0x0F;
                contBytes = 2; accBytes = 1;
            } else { // Four or more are not supported for CESU-8.
                res += this.defaultCharUnicode;
            }
        } else { // Continuation byte
            if (contBytes > 0) { // We're waiting for it.
                acc = (acc << 6) | (curByte & 0x3f);
                contBytes--; accBytes++;
                if (contBytes === 0) {
                    // Check for overlong encoding, but support Modified UTF-8 (encoding NULL as C0 80)
                    if (accBytes === 2 && acc < 0x80 && acc > 0)
                        res += this.defaultCharUnicode;
                    else if (accBytes === 3 && acc < 0x800)
                        res += this.defaultCharUnicode;
                    else
                        // Actually add character.
                        res += String.fromCharCode(acc);
                }
            } else { // Unexpected continuation byte
                res += this.defaultCharUnicode;
            }
        }
    }
    this.acc = acc; this.contBytes = contBytes; this.accBytes = accBytes;
    return res;
}

InternalDecoderCesu8.prototype.end = function() {
    var res = 0;
    if (this.contBytes > 0)
        res += this.defaultCharUnicode;
    return res;
}


/***/ }),

/***/ 104:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(470);
const lib = __webpack_require__(703);

async function run() {
  try {
    const keyword = core.getInput('keyword', {required: true});
    const repo = core.getInput('targetRepository', {required: true}); // format: $OWNER/$REPO_NAME
    const contentOfNewIssue = core.getInput('contentOfNewIssue', {require: true});

    const splitted = repo.split('/');
    const owner = splitted[0];
    const repoName = splitted[1];

    const token = core.getInput('githubToken');
    const issue = await lib.getIssueFromContext(token);

    if (!lib.checkKeywords([keyword], lib.getIssueCommentFromContext().body)){
      console.log(`Keyword not included. keyword: ${keyword}, ${issue.data.body}`);
      return;
    }

/**    const created = await lib.createNewIssue(token, owner, repoName, issue.data.title, contentOfNewIssue, ['soichisumi'], [], issue.data.html_url);
**/
       const created = await lib.createNewIssue(token, owner, repoName, issue.data.title, contentOfNewIssue, ['Orange-hayashi'], [], issue.data.html_url);
    core.setOutput('created', created);
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run();

/***/ }),

/***/ 118:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);

const nameMap = new Map([
	[19, 'Catalina'],
	[18, 'Mojave'],
	[17, 'High Sierra'],
	[16, 'Sierra'],
	[15, 'El Capitan'],
	[14, 'Yosemite'],
	[13, 'Mavericks'],
	[12, 'Mountain Lion'],
	[11, 'Lion'],
	[10, 'Snow Leopard'],
	[9, 'Leopard'],
	[8, 'Tiger'],
	[7, 'Panther'],
	[6, 'Jaguar'],
	[5, 'Puma']
]);

const macosRelease = release => {
	release = Number((release || os.release()).split('.')[0]);
	return {
		name: nameMap.get(release),
		version: '10.' + (release - 4)
	};
};

module.exports = macosRelease;
// TODO: remove this in the next major version
module.exports.default = macosRelease;


/***/ }),

/***/ 126:
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    Set = getNative(root, 'Set'),
    nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each
 * element is kept.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length)
    ? baseUniq(array)
    : [];
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = uniq;


/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 143:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = withAuthorizationPrefix;

const atob = __webpack_require__(368);

const REGEX_IS_BASIC_AUTH = /^[\w-]+:/;

function withAuthorizationPrefix(authorization) {
  if (/^(basic|bearer|token) /i.test(authorization)) {
    return authorization;
  }

  try {
    if (REGEX_IS_BASIC_AUTH.test(atob(authorization))) {
      return `basic ${authorization}`;
    }
  } catch (error) {}

  if (authorization.split(/\./).length === 3) {
    return `bearer ${authorization}`;
  }

  return `token ${authorization}`;
}


/***/ }),

/***/ 145:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const pump = __webpack_require__(453);
const bufferStream = __webpack_require__(966);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = Object.assign({maxBuffer: Infinity}, options);

	const {maxBuffer} = options;

	let stream;
	return new Promise((resolve, reject) => {
		const rejectPromise = error => {
			if (error) { // A null check
				error.bufferedData = stream.getBufferedValue();
			}
			reject(error);
		};

		stream = pump(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	}).then(() => stream.getBufferedValue());
}

module.exports = getStream;
module.exports.buffer = (stream, options) => getStream(stream, Object.assign({}, options, {encoding: 'buffer'}));
module.exports.array = (stream, options) => getStream(stream, Object.assign({}, options, {array: true}));
module.exports.MaxBufferError = MaxBufferError;


/***/ }),

/***/ 148:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = paginatePlugin;

const iterator = __webpack_require__(8);
const paginate = __webpack_require__(807);

function paginatePlugin(octokit) {
  octokit.paginate = paginate.bind(null, octokit);
  octokit.paginate.iterator = iterator.bind(null, octokit);
}


/***/ }),

/***/ 168:
/***/ (function(module) {

"use strict";

const alias = ['stdin', 'stdout', 'stderr'];

const hasAlias = opts => alias.some(x => Boolean(opts[x]));

module.exports = opts => {
	if (!opts) {
		return null;
	}

	if (opts.stdio && hasAlias(opts)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${alias.map(x => `\`${x}\``).join(', ')}`);
	}

	if (typeof opts.stdio === 'string') {
		return opts.stdio;
	}

	const stdio = opts.stdio || [];

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const result = [];
	const len = Math.max(stdio.length, alias.length);

	for (let i = 0; i < len; i++) {
		let value = null;

		if (stdio[i] !== undefined) {
			value = stdio[i];
		} else if (opts[alias[i]] !== undefined) {
			value = opts[alias[i]];
		}

		result[i] = value;
	}

	return result;
};


/***/ }),

/***/ 190:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationPlugin;

const beforeRequest = __webpack_require__(863);
const requestError = __webpack_require__(991);
const validate = __webpack_require__(954);

function authenticationPlugin(octokit, options) {
  if (!options.auth) {
    return;
  }

  validate(options.auth);

  const state = {
    octokit,
    auth: options.auth
  };

  octokit.hook.before("request", beforeRequest.bind(null, state));
  octokit.hook.error("request", requestError.bind(null, state));
}


/***/ }),

/***/ 197:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(747)

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode
  var uid = stat.uid
  var gid = stat.gid

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid()
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid()

  var u = parseInt('100', 8)
  var g = parseInt('010', 8)
  var o = parseInt('001', 8)
  var ug = u | g

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret
}


/***/ }),

/***/ 211:
/***/ (function(module) {

module.exports = require("https");

/***/ }),

/***/ 215:
/***/ (function(module) {

module.exports = {"name":"@octokit/rest","version":"16.35.2","publishConfig":{"access":"public"},"description":"GitHub REST API client for Node.js","keywords":["octokit","github","rest","api-client"],"author":"Gregor Martynus (https://github.com/gr2m)","contributors":[{"name":"Mike de Boer","email":"info@mikedeboer.nl"},{"name":"Fabian Jakobs","email":"fabian@c9.io"},{"name":"Joe Gallo","email":"joe@brassafrax.com"},{"name":"Gregor Martynus","url":"https://github.com/gr2m"}],"repository":"https://github.com/octokit/rest.js","dependencies":{"@octokit/request":"^5.2.0","@octokit/request-error":"^1.0.2","atob-lite":"^2.0.0","before-after-hook":"^2.0.0","btoa-lite":"^1.0.0","deprecation":"^2.0.0","lodash.get":"^4.4.2","lodash.set":"^4.3.2","lodash.uniq":"^4.5.0","octokit-pagination-methods":"^1.1.0","once":"^1.4.0","universal-user-agent":"^4.0.0"},"devDependencies":{"@gimenete/type-writer":"^0.1.3","@octokit/fixtures-server":"^5.0.6","@octokit/graphql":"^4.2.0","@types/node":"^12.0.0","bundlesize":"^0.18.0","chai":"^4.1.2","compression-webpack-plugin":"^3.0.0","cypress":"^3.0.0","glob":"^7.1.2","http-proxy-agent":"^2.1.0","lodash.camelcase":"^4.3.0","lodash.merge":"^4.6.1","lodash.upperfirst":"^4.3.1","mkdirp":"^0.5.1","mocha":"^6.0.0","mustache":"^3.0.0","nock":"^11.3.3","npm-run-all":"^4.1.2","nyc":"^14.0.0","prettier":"^1.14.2","proxy":"^1.0.0","semantic-release":"^15.0.0","sinon":"^7.2.4","sinon-chai":"^3.0.0","sort-keys":"^4.0.0","string-to-arraybuffer":"^1.0.0","string-to-jsdoc-comment":"^1.0.0","typescript":"^3.3.1","webpack":"^4.0.0","webpack-bundle-analyzer":"^3.0.0","webpack-cli":"^3.0.0"},"types":"index.d.ts","scripts":{"coverage":"nyc report --reporter=html && open coverage/index.html","lint":"prettier --check '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json","lint:fix":"prettier --write '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json","pretest":"npm run -s lint","test":"nyc mocha test/mocha-node-setup.js \"test/*/**/*-test.js\"","test:browser":"cypress run --browser chrome","build":"npm-run-all build:*","build:ts":"npm run -s update-endpoints:typescript","prebuild:browser":"mkdirp dist/","build:browser":"npm-run-all build:browser:*","build:browser:development":"webpack --mode development --entry . --output-library=Octokit --output=./dist/octokit-rest.js --profile --json > dist/bundle-stats.json","build:browser:production":"webpack --mode production --entry . --plugin=compression-webpack-plugin --output-library=Octokit --output-path=./dist --output-filename=octokit-rest.min.js --devtool source-map","generate-bundle-report":"webpack-bundle-analyzer dist/bundle-stats.json --mode=static --no-open --report dist/bundle-report.html","update-endpoints":"npm-run-all update-endpoints:*","update-endpoints:fetch-json":"node scripts/update-endpoints/fetch-json","update-endpoints:code":"node scripts/update-endpoints/code","update-endpoints:typescript":"node scripts/update-endpoints/typescript","prevalidate:ts":"npm run -s build:ts","validate:ts":"tsc --target es6 --noImplicitAny index.d.ts","postvalidate:ts":"tsc --noEmit --target es6 test/typescript-validate.ts","start-fixtures-server":"octokit-fixtures-server"},"license":"MIT","files":["index.js","index.d.ts","lib","plugins"],"nyc":{"ignore":["test"]},"release":{"publish":["@semantic-release/npm",{"path":"@semantic-release/github","assets":["dist/*","!dist/*.map.gz"]}]},"bundlesize":[{"path":"./dist/octokit-rest.min.js.gz","maxSize":"33 kB"}],"_resolved":"https://registry.npmjs.org/@octokit/rest/-/rest-16.35.2.tgz","_integrity":"sha512-iijaNZpn9hBpUdh8YdXqNiWazmq4R1vCUsmxpBB0kCQ0asHZpCx+HNs22eiHuwYKRhO31ZSAGBJLi0c+3XHaKQ==","_from":"@octokit/rest@16.35.2"};

/***/ }),

/***/ 248:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = octokitRegisterEndpoints;

const registerEndpoints = __webpack_require__(899);

function octokitRegisterEndpoints(octokit) {
  octokit.registerEndpoints = registerEndpoints.bind(null, octokit);
}


/***/ }),

/***/ 256:
/***/ (function() {

eval("require")("iconv");


/***/ }),

/***/ 258:
/***/ (function(__unusedmodule, exports) {

"use strict";


var BOMChar = '\uFEFF';

exports.PrependBOM = PrependBOMWrapper
function PrependBOMWrapper(encoder, options) {
    this.encoder = encoder;
    this.addBOM = true;
}

PrependBOMWrapper.prototype.write = function(str) {
    if (this.addBOM) {
        str = BOMChar + str;
        this.addBOM = false;
    }

    return this.encoder.write(str);
}

PrependBOMWrapper.prototype.end = function() {
    return this.encoder.end();
}


//------------------------------------------------------------------------------

exports.StripBOM = StripBOMWrapper;
function StripBOMWrapper(decoder, options) {
    this.decoder = decoder;
    this.pass = false;
    this.options = options || {};
}

StripBOMWrapper.prototype.write = function(buf) {
    var res = this.decoder.write(buf);
    if (this.pass || !res)
        return res;

    if (res[0] === BOMChar) {
        res = res.slice(1);
        if (typeof this.options.stripBOM === 'function')
            this.options.stripBOM();
    }

    this.pass = true;
    return res;
}

StripBOMWrapper.prototype.end = function() {
    return this.decoder.end();
}



/***/ }),

/***/ 260:
/***/ (function(module, __unusedexports, __webpack_require__) {

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
var assert = __webpack_require__(357)
var signals = __webpack_require__(654)

var EE = __webpack_require__(614)
/* istanbul ignore if */
if (typeof EE !== 'function') {
  EE = EE.EventEmitter
}

var emitter
if (process.__signal_exit_emitter__) {
  emitter = process.__signal_exit_emitter__
} else {
  emitter = process.__signal_exit_emitter__ = new EE()
  emitter.count = 0
  emitter.emitted = {}
}

// Because this emitter is a global, we have to check to see if a
// previous version of this library failed to enable infinite listeners.
// I know what you're about to say.  But literally everything about
// signal-exit is a compromise with evil.  Get used to it.
if (!emitter.infinite) {
  emitter.setMaxListeners(Infinity)
  emitter.infinite = true
}

module.exports = function (cb, opts) {
  assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler')

  if (loaded === false) {
    load()
  }

  var ev = 'exit'
  if (opts && opts.alwaysLast) {
    ev = 'afterexit'
  }

  var remove = function () {
    emitter.removeListener(ev, cb)
    if (emitter.listeners('exit').length === 0 &&
        emitter.listeners('afterexit').length === 0) {
      unload()
    }
  }
  emitter.on(ev, cb)

  return remove
}

module.exports.unload = unload
function unload () {
  if (!loaded) {
    return
  }
  loaded = false

  signals.forEach(function (sig) {
    try {
      process.removeListener(sig, sigListeners[sig])
    } catch (er) {}
  })
  process.emit = originalProcessEmit
  process.reallyExit = originalProcessReallyExit
  emitter.count -= 1
}

function emit (event, code, signal) {
  if (emitter.emitted[event]) {
    return
  }
  emitter.emitted[event] = true
  emitter.emit(event, code, signal)
}

// { <signal>: <listener fn>, ... }
var sigListeners = {}
signals.forEach(function (sig) {
  sigListeners[sig] = function listener () {
    // If there are no other listeners, an exit is coming!
    // Simplest way: remove us and then re-send the signal.
    // We know that this will kill the process, so we can
    // safely emit now.
    var listeners = process.listeners(sig)
    if (listeners.length === emitter.count) {
      unload()
      emit('exit', null, sig)
      /* istanbul ignore next */
      emit('afterexit', null, sig)
      /* istanbul ignore next */
      process.kill(process.pid, sig)
    }
  }
})

module.exports.signals = function () {
  return signals
}

module.exports.load = load

var loaded = false

function load () {
  if (loaded) {
    return
  }
  loaded = true

  // This is the number of onSignalExit's that are in play.
  // It's important so that we can count the correct number of
  // listeners on signals, and don't wait for the other one to
  // handle it instead of us.
  emitter.count += 1

  signals = signals.filter(function (sig) {
    try {
      process.on(sig, sigListeners[sig])
      return true
    } catch (er) {
      return false
    }
  })

  process.emit = processEmit
  process.reallyExit = processReallyExit
}

var originalProcessReallyExit = process.reallyExit
function processReallyExit (code) {
  process.exitCode = code || 0
  emit('exit', process.exitCode, null)
  /* istanbul ignore next */
  emit('afterexit', process.exitCode, null)
  /* istanbul ignore next */
  originalProcessReallyExit.call(process, process.exitCode)
}

var originalProcessEmit = process.emit
function processEmit (ev, arg) {
  if (ev === 'exit') {
    if (arg !== undefined) {
      process.exitCode = arg
    }
    var ret = originalProcessEmit.apply(this, arguments)
    emit('exit', process.exitCode, null)
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null)
    return ret
  } else {
    return originalProcessEmit.apply(this, arguments)
  }
}


/***/ }),

/***/ 262:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __webpack_require__(747);
const os_1 = __webpack_require__(87);
class Context {
    /**
     * Hydrate the context from the environment
     */
    constructor() {
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
            if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
                this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            }
            else {
                const path = process.env.GITHUB_EVENT_PATH;
                process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${os_1.EOL}`);
            }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
    }
    get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pullRequest || payload).number });
    }
    get repo() {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner, repo };
        }
        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map

/***/ }),

/***/ 265:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)
const HttpError = __webpack_require__(297)

function getPage (octokit, link, which, headers) {
  deprecate(`octokit.get${which.charAt(0).toUpperCase() + which.slice(1)}Page() ? You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  const url = getPageLinks(link)[which]

  if (!url) {
    const urlError = new HttpError(`No ${which} page found`, 404)
    return Promise.reject(urlError)
  }

  const requestOptions = {
    url,
    headers: applyAcceptHeader(link, headers)
  }

  const promise = octokit.request(requestOptions)

  return promise
}

function applyAcceptHeader (res, headers) {
  const previous = res.headers && res.headers['x-github-media-type']

  if (!previous || (headers && headers.accept)) {
    return headers
  }
  headers = headers || {}
  headers.accept = 'application/vnd.' + previous
    .replace('; param=', '.')
    .replace('; format=', '+')

  return headers
}


/***/ }),

/***/ 277:
/***/ (function(module) {

module.exports = [["0","\u0000",127],["8ea1","｡",62],["a1a1","　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",9,"＋－±×÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇"],["a2a1","◆□■△▲▽▼※〒→←↑↓〓"],["a2ba","∈∋⊆⊇⊂⊃∪∩"],["a2ca","∧∨￢⇒⇔∀∃"],["a2dc","∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"],["a2f2","Å‰♯♭♪†‡¶"],["a2fe","◯"],["a3b0","０",9],["a3c1","Ａ",25],["a3e1","ａ",25],["a4a1","ぁ",82],["a5a1","ァ",85],["a6a1","Α",16,"Σ",6],["a6c1","α",16,"σ",6],["a7a1","А",5,"ЁЖ",25],["a7d1","а",5,"ёж",25],["a8a1","─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"],["ada1","①",19,"Ⅰ",9],["adc0","㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"],["addf","㍻〝〟№㏍℡㊤",4,"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"],["b0a1","亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"],["b1a1","院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応"],["b2a1","押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"],["b3a1","魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱"],["b4a1","粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"],["b5a1","機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京"],["b6a1","供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"],["b7a1","掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲"],["b8a1","検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"],["b9a1","后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込"],["baa1","此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"],["bba1","察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時"],["bca1","次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"],["bda1","宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償"],["bea1","勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"],["bfa1","拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾"],["c0a1","澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"],["c1a1","繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎"],["c2a1","臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"],["c3a1","叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵"],["c4a1","帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"],["c5a1","邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到"],["c6a1","董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"],["c7a1","如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦"],["c8a1","函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"],["c9a1","鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服"],["caa1","福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"],["cba1","法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満"],["cca1","漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"],["cda1","諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃"],["cea1","痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"],["cfa1","蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"],["d0a1","弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"],["d1a1","僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨"],["d2a1","辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"],["d3a1","咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉"],["d4a1","圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"],["d5a1","奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓"],["d6a1","屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"],["d7a1","廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚"],["d8a1","悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"],["d9a1","戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼"],["daa1","據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"],["dba1","曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍"],["dca1","棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"],["dda1","檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾"],["dea1","沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"],["dfa1","漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼"],["e0a1","燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"],["e1a1","瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰"],["e2a1","癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"],["e3a1","磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐"],["e4a1","筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"],["e5a1","紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺"],["e6a1","罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"],["e7a1","隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙"],["e8a1","茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"],["e9a1","蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙"],["eaa1","蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"],["eba1","襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫"],["eca1","譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"],["eda1","蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸"],["eea1","遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"],["efa1","錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞"],["f0a1","陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"],["f1a1","顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷"],["f2a1","髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"],["f3a1","鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠"],["f4a1","堯槇遙瑤凜熙"],["f9a1","纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德"],["faa1","忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"],["fba1","犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚"],["fca1","釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"],["fcf1","ⅰ",9,"￢￤＇＂"],["8fa2af","??，??￣??～??"],["8fa2c2","!|?"],["8fa2eb","oacR??№"],["8fa6e1","?????"],["8fa6e7","?"],["8fa6e9","??"],["8fa6ec","?"],["8fa6f1","????????????"],["8fa7c2","?",10,"??"],["8fa7f2","?",10,"??"],["8fa9a1","A?"],["8fa9a4","?"],["8fa9a6","?"],["8fa9a8","??"],["8fa9ab","?O?"],["8fa9af","?T"],["8fa9c1","a?d????????o?s?t"],["8faaa1","AAAA????AA???C??EEEE????"],["8faaba","?????IIII?????????????NOOOO???O?????????UUUU????????????Y?????"],["8faba1","aaaa????aa???c??eeee???????"],["8fabbd","??iiii?"],["8fabc5","???????????noooo???o?????????uuuu????????????yy????"],["8fb0a1","????????丨??????????????????????????????仡?????????伀?伃??????????????伹??????????佖????????????????"],["8fb1a1","??侊???侒?侔??侚??????????????俉??俍?????????俿??????????????倞倢??????偀?偂?偆????????????????偰??????????"],["8fb2a1","??傔????",4,"???????????????僘??????????????????????????????????????????兊??????兤???????冝??????冾??"],["8fb3a1","????????????????????刕??????????????????????????????????劜??劦?劯???????勀????????勛????????????匀???"],["8fb4a1","???????????????????????????????卲??????厓????????厲?????????????叝????????????????????????????????"],["8fb5a1","?????????咜????咩????????????????????哿???????????????????????????????????喆??????????????????????"],["8fb6a1","?????????????",5,"?????????????????????????????????????????????????????????????????????",4,"???"],["8fb7a1","?????????????????????????????????坥????",4,"?????????????????????????垬??埇埈??????????????????????"],["8fb8a1","?????????????????????????????????????????????墲??????????????????夋???????????????????奓?奛奝???奣??"],["8fb9a1","??????????????妤???????妺???????????????????????????????????????????????????????????????????????"],["8fbaa1","?????????????????????????????孖????????????????????????????寀????",4,"???????尞???????????????????"],["8fbba1","??????????????????岦????岺?????????????????崧?????嵂?????????????嵭?????????????????????嶸嶹???巐?????"],["8fbca1","????????????????????????????",4,"???????????????????????????????????弡????????弴??????彅?????????彧"],["8fbda1","?????????????????????????????",4,"忞????????????????????????????????????恝????????悊??????????????"],["8fbea1","???????????惕???惞??惲?????????",4,"????????愰???愷??????????????????????憘??????????????????????????"],["8fbfa1","???????戓????????????????????????????????抦?????????????????????????????????????????????????????"],["8fc0a1","???????????????????????????????????揵???????????????????????????????摠???????????????撝??????????"],["8fc1a1","?????擎??????????????????????????????????????????????????????????????????????????????昀??昉???昕??"],["8fc2a1","昞???昤?????昮?昱??????????晗?晙????曻????晳?????????????暙????暠???暲??暿??????????????曺??朎??????????????"],["8fc3a1","杦???????????????????枻???柀???????????????桒??????????????桄?????????",4,"??????????????????????棈?棏"],["8fc4a1","???????????????????????????????????????????楨????????????榘????????????????槢??????????????????樰?"],["8fc5a1","??????橆?????????????橳橾??????????????????????????????櫤?????????????????????????????????????????"],["8fc6a1","???????????????????????毖??????????????????????????????氿????????汜??汯??????沆????????????????????"],["8fc7a1","泚?????????洄???????????????????????浯???涇???涖???涬?????????淏????????????淼????渧??渹?渼???????????湜??"],["8fc8a1","????????????????溿???????????????????????????????????????????????????澈??????????????????澵??????"],["8fc9a1","?????濵????瀅?瀇????????????????????????????炅??",4,"??炫???????????????",4,"??焏??????????煆煇??????煜??"],["8fcaa1","??????????????????燁?????????燾?????????????????????????????????????????????????犱?犾?????????????"],["8fcba1","?????????????猤???????????????????????????獷???????????????????????????玽???珉???珒?珖???珣????珵?????"],["8fcca1","????琇?????琦?",9,"????????????瑢?????????????璉????????璟?????????????????????????????????????"],["8fcda1","?????????甯????????????????畯??",5,"????????????????????????????????????????????????????????????"],["8fcea1","?????????????????????????皛皜????",6,"????????????????????????????????????????????睆????????????"],["8fcfa1","????????????????????????????????????????????????????砡????????????硎??????硤???硺?????????????????"],["8fd0a1","????????????????????????????????????????????????????????????????????禔???禛?????????????????????"],["8fd1a1","???????????????????????????????????????????????????????????????????????竑???竫??????????????????"],["8fd2a1","??????????????????????????箞??????????????????????????????????????????????????????????????",5],["8fd3a1","????????????????????????????????????????????????????????????????絈??????絜??????????????????????"],["8fd4a1","??????綷??",4,"??????????????????????????????????????繒??????????????纊??????????????罇????????????"],["8fd5a1","?????????????羡????????????????????????????????????????????????????????????????????????????????"],["8fd6a1","??????????????????????????????????????????????????????????????????????????????????????????????"],["8fd7a1","?????????????????????????????????????????????????????????????茁????????????????????????????????"],["8fd8a1","?荿????????????????????菇?????????菶???????????????葈??????????????????????????????????蒴??????????"],["8fd9a1","蓜?????????????????????????????????",4,"?蕙?",6,"?蕫?????????????????????????????????????????????"],["8fdaa1","????????????????????????????????",4,"??????????????????????????????????????????????????????????"],["8fdba1","????????????????????????",6,"????????????????????????????????????????????????????????????????"],["8fdca1","?????????????????????????????????????",4,"?????????裵???????????褜???????????????????????????????"],["8fdda1","????????????????????",4,"???????????????訒???????????訷?????????????????????詹???????????????誧????"],["8fdea1","???誾???????????諟????諶???????????????",4,"??譓???????????????????????????????????????????????????"],["8fdfa1","????????????????????????賰?????????贒???????????????????????????????????????????????????????????"],["8fe0a1","????????????????????????????????????????????????????????軏?????????????????????????????????????"],["8fe1a1","????",4,"?????????????????????????????????????????????????????????遧????????????????????????????"],["8fe2a1","??????????????????????????????????????鄧???????????????????????????????????????????????????????"],["8fe3a1","?????釗?釚釞釤釥???",5,"????????鈆??鈊?鈐??????????????????鈹鈺鈼?鉀??????鉎?鉑?鉙?????鉧??????",4,"????銈??????"],["8fe4a1","?????銧???????????",4,"????????鋐鋓鋕鋗?鋙???鋠???鋧????鋹鋻鋿?錂??????錝錞?錡?錥????????鍈?????鍗??????????鍰????"],["8fe5a1","??????????????????鎤???????????鏆??",4,"???鏞??????鏸?????????????????鐱???????鑅鑈???????????????????"],["8fe6a1","???????????????????????????????????????????????????????????????????????隝??????隯???????????????"],["8fe7a1","???????????霳?靃??靏靕????????????????????????????????????????????????????????????????????????????"],["8fe8a1","????????????????顗????顥??????????????????????????????????????餧??",4,"???????????????????????????"],["8fe9a1","????????????????????????????????????????????????驎???????????????????????????髜?????????????",4],["8feaa1","???????????????????????????????????????",4,"?魵?????????????鮏??????????鮱???鮻????????????????????"],["8feba1","????鰀?????????????",4,"???????????????????????????????????????????????????????????????????鵫鵰???"],["8feca1","?????????????????????????????????????????????????????鸙????????????????????????????????????????"],["8feda1","????????????????????????????????",4,"???????????",4,"????????????????"]];

/***/ }),

/***/ 278:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var Buffer = __webpack_require__(293).Buffer;

// UTF-7 codec, according to https://tools.ietf.org/html/rfc2152
// See also below a UTF-7-IMAP codec, according to http://tools.ietf.org/html/rfc3501#section-5.1.3

exports.utf7 = Utf7Codec;
exports.unicode11utf7 = 'utf7'; // Alias UNICODE-1-1-UTF-7
function Utf7Codec(codecOptions, iconv) {
    this.iconv = iconv;
};

Utf7Codec.prototype.encoder = Utf7Encoder;
Utf7Codec.prototype.decoder = Utf7Decoder;
Utf7Codec.prototype.bomAware = true;


// -- Encoding

var nonDirectChars = /[^A-Za-z0-9'\(\),-\.\/:\? \n\r\t]+/g;

function Utf7Encoder(options, codec) {
    this.iconv = codec.iconv;
}

Utf7Encoder.prototype.write = function(str) {
    // Naive implementation.
    // Non-direct chars are encoded as "+<base64>-"; single "+" char is encoded as "+-".
    return new Buffer(str.replace(nonDirectChars, function(chunk) {
        return "+" + (chunk === '+' ? '' : 
            this.iconv.encode(chunk, 'utf16-be').toString('base64').replace(/=+$/, '')) 
            + "-";
    }.bind(this)));
}

Utf7Encoder.prototype.end = function() {
}


// -- Decoding

function Utf7Decoder(options, codec) {
    this.iconv = codec.iconv;
    this.inBase64 = false;
    this.base64Accum = '';
}

var base64Regex = /[A-Za-z0-9\/+]/;
var base64Chars = [];
for (var i = 0; i < 256; i++)
    base64Chars[i] = base64Regex.test(String.fromCharCode(i));

var plusChar = '+'.charCodeAt(0), 
    minusChar = '-'.charCodeAt(0),
    andChar = '&'.charCodeAt(0);

Utf7Decoder.prototype.write = function(buf) {
    var res = "", lastI = 0,
        inBase64 = this.inBase64,
        base64Accum = this.base64Accum;

    // The decoder is more involved as we must handle chunks in stream.

    for (var i = 0; i < buf.length; i++) {
        if (!inBase64) { // We're in direct mode.
            // Write direct chars until '+'
            if (buf[i] == plusChar) {
                res += this.iconv.decode(buf.slice(lastI, i), "ascii"); // Write direct chars.
                lastI = i+1;
                inBase64 = true;
            }
        } else { // We decode base64.
            if (!base64Chars[buf[i]]) { // Base64 ended.
                if (i == lastI && buf[i] == minusChar) {// "+-" -> "+"
                    res += "+";
                } else {
                    var b64str = base64Accum + buf.slice(lastI, i).toString();
                    res += this.iconv.decode(new Buffer(b64str, 'base64'), "utf16-be");
                }

                if (buf[i] != minusChar) // Minus is absorbed after base64.
                    i--;

                lastI = i+1;
                inBase64 = false;
                base64Accum = '';
            }
        }
    }

    if (!inBase64) {
        res += this.iconv.decode(buf.slice(lastI), "ascii"); // Write direct chars.
    } else {
        var b64str = base64Accum + buf.slice(lastI).toString();

        var canBeDecoded = b64str.length - (b64str.length % 8); // Minimal chunk: 2 quads -> 2x3 bytes -> 3 chars.
        base64Accum = b64str.slice(canBeDecoded); // The rest will be decoded in future.
        b64str = b64str.slice(0, canBeDecoded);

        res += this.iconv.decode(new Buffer(b64str, 'base64'), "utf16-be");
    }

    this.inBase64 = inBase64;
    this.base64Accum = base64Accum;

    return res;
}

Utf7Decoder.prototype.end = function() {
    var res = "";
    if (this.inBase64 && this.base64Accum.length > 0)
        res = this.iconv.decode(new Buffer(this.base64Accum, 'base64'), "utf16-be");

    this.inBase64 = false;
    this.base64Accum = '';
    return res;
}


// UTF-7-IMAP codec.
// RFC3501 Sec. 5.1.3 Modified UTF-7 (http://tools.ietf.org/html/rfc3501#section-5.1.3)
// Differences:
//  * Base64 part is started by "&" instead of "+"
//  * Direct characters are 0x20-0x7E, except "&" (0x26)
//  * In Base64, "," is used instead of "/"
//  * Base64 must not be used to represent direct characters.
//  * No implicit shift back from Base64 (should always end with '-')
//  * String must end in non-shifted position.
//  * "-&" while in base64 is not allowed.


exports.utf7imap = Utf7IMAPCodec;
function Utf7IMAPCodec(codecOptions, iconv) {
    this.iconv = iconv;
};

Utf7IMAPCodec.prototype.encoder = Utf7IMAPEncoder;
Utf7IMAPCodec.prototype.decoder = Utf7IMAPDecoder;
Utf7IMAPCodec.prototype.bomAware = true;


// -- Encoding

function Utf7IMAPEncoder(options, codec) {
    this.iconv = codec.iconv;
    this.inBase64 = false;
    this.base64Accum = new Buffer(6);
    this.base64AccumIdx = 0;
}

Utf7IMAPEncoder.prototype.write = function(str) {
    var inBase64 = this.inBase64,
        base64Accum = this.base64Accum,
        base64AccumIdx = this.base64AccumIdx,
        buf = new Buffer(str.length*5 + 10), bufIdx = 0;

    for (var i = 0; i < str.length; i++) {
        var uChar = str.charCodeAt(i);
        if (0x20 <= uChar && uChar <= 0x7E) { // Direct character or '&'.
            if (inBase64) {
                if (base64AccumIdx > 0) {
                    bufIdx += buf.write(base64Accum.slice(0, base64AccumIdx).toString('base64').replace(/\//g, ',').replace(/=+$/, ''), bufIdx);
                    base64AccumIdx = 0;
                }

                buf[bufIdx++] = minusChar; // Write '-', then go to direct mode.
                inBase64 = false;
            }

            if (!inBase64) {
                buf[bufIdx++] = uChar; // Write direct character

                if (uChar === andChar)  // Ampersand -> '&-'
                    buf[bufIdx++] = minusChar;
            }

        } else { // Non-direct character
            if (!inBase64) {
                buf[bufIdx++] = andChar; // Write '&', then go to base64 mode.
                inBase64 = true;
            }
            if (inBase64) {
                base64Accum[base64AccumIdx++] = uChar >> 8;
                base64Accum[base64AccumIdx++] = uChar & 0xFF;

                if (base64AccumIdx == base64Accum.length) {
                    bufIdx += buf.write(base64Accum.toString('base64').replace(/\//g, ','), bufIdx);
                    base64AccumIdx = 0;
                }
            }
        }
    }

    this.inBase64 = inBase64;
    this.base64AccumIdx = base64AccumIdx;

    return buf.slice(0, bufIdx);
}

Utf7IMAPEncoder.prototype.end = function() {
    var buf = new Buffer(10), bufIdx = 0;
    if (this.inBase64) {
        if (this.base64AccumIdx > 0) {
            bufIdx += buf.write(this.base64Accum.slice(0, this.base64AccumIdx).toString('base64').replace(/\//g, ',').replace(/=+$/, ''), bufIdx);
            this.base64AccumIdx = 0;
        }

        buf[bufIdx++] = minusChar; // Write '-', then go to direct mode.
        this.inBase64 = false;
    }

    return buf.slice(0, bufIdx);
}


// -- Decoding

function Utf7IMAPDecoder(options, codec) {
    this.iconv = codec.iconv;
    this.inBase64 = false;
    this.base64Accum = '';
}

var base64IMAPChars = base64Chars.slice();
base64IMAPChars[','.charCodeAt(0)] = true;

Utf7IMAPDecoder.prototype.write = function(buf) {
    var res = "", lastI = 0,
        inBase64 = this.inBase64,
        base64Accum = this.base64Accum;

    // The decoder is more involved as we must handle chunks in stream.
    // It is forgiving, closer to standard UTF-7 (for example, '-' is optional at the end).

    for (var i = 0; i < buf.length; i++) {
        if (!inBase64) { // We're in direct mode.
            // Write direct chars until '&'
            if (buf[i] == andChar) {
                res += this.iconv.decode(buf.slice(lastI, i), "ascii"); // Write direct chars.
                lastI = i+1;
                inBase64 = true;
            }
        } else { // We decode base64.
            if (!base64IMAPChars[buf[i]]) { // Base64 ended.
                if (i == lastI && buf[i] == minusChar) { // "&-" -> "&"
                    res += "&";
                } else {
                    var b64str = base64Accum + buf.slice(lastI, i).toString().replace(/,/g, '/');
                    res += this.iconv.decode(new Buffer(b64str, 'base64'), "utf16-be");
                }

                if (buf[i] != minusChar) // Minus may be absorbed after base64.
                    i--;

                lastI = i+1;
                inBase64 = false;
                base64Accum = '';
            }
        }
    }

    if (!inBase64) {
        res += this.iconv.decode(buf.slice(lastI), "ascii"); // Write direct chars.
    } else {
        var b64str = base64Accum + buf.slice(lastI).toString().replace(/,/g, '/');

        var canBeDecoded = b64str.length - (b64str.length % 8); // Minimal chunk: 2 quads -> 2x3 bytes -> 3 chars.
        base64Accum = b64str.slice(canBeDecoded); // The rest will be decoded in future.
        b64str = b64str.slice(0, canBeDecoded);

        res += this.iconv.decode(new Buffer(b64str, 'base64'), "utf16-be");
    }

    this.inBase64 = inBase64;
    this.base64Accum = base64Accum;

    return res;
}

Utf7IMAPDecoder.prototype.end = function() {
    var res = "";
    if (this.inBase64 && this.base64Accum.length > 0)
        res = this.iconv.decode(new Buffer(this.base64Accum, 'base64'), "utf16-be");

    this.inBase64 = false;
    this.base64Accum = '';
    return res;
}




/***/ }),

/***/ 280:
/***/ (function(module, exports) {

exports = module.exports = SemVer

var debug
/* istanbul ignore next */
if (typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift('SEMVER')
    console.log.apply(console, args)
  }
} else {
  debug = function () {}
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0'

var MAX_LENGTH = 256
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16

// The actual regexps go on exports.re
var re = exports.re = []
var src = exports.src = []
var R = 0

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

var NUMERICIDENTIFIER = R++
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*'
var NUMERICIDENTIFIERLOOSE = R++
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+'

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

var NONNUMERICIDENTIFIER = R++
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'

// ## Main Version
// Three dot-separated numeric identifiers.

var MAINVERSION = R++
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')'

var MAINVERSIONLOOSE = R++
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')'

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

var PRERELEASEIDENTIFIER = R++
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                            '|' + src[NONNUMERICIDENTIFIER] + ')'

var PRERELEASEIDENTIFIERLOOSE = R++
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[NONNUMERICIDENTIFIER] + ')'

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

var PRERELEASE = R++
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))'

var PRERELEASELOOSE = R++
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))'

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

var BUILDIDENTIFIER = R++
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+'

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

var BUILD = R++
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))'

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

var FULL = R++
var FULLPLAIN = 'v?' + src[MAINVERSION] +
                src[PRERELEASE] + '?' +
                src[BUILD] + '?'

src[FULL] = '^' + FULLPLAIN + '$'

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                 src[PRERELEASELOOSE] + '?' +
                 src[BUILD] + '?'

var LOOSE = R++
src[LOOSE] = '^' + LOOSEPLAIN + '$'

var GTLT = R++
src[GTLT] = '((?:<|>)?=?)'

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
var XRANGEIDENTIFIERLOOSE = R++
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
var XRANGEIDENTIFIER = R++
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*'

var XRANGEPLAIN = R++
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[PRERELEASE] + ')?' +
                   src[BUILD] + '?' +
                   ')?)?'

var XRANGEPLAINLOOSE = R++
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[PRERELEASELOOSE] + ')?' +
                        src[BUILD] + '?' +
                        ')?)?'

var XRANGE = R++
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$'
var XRANGELOOSE = R++
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$'

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
var COERCE = R++
src[COERCE] = '(?:^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])'

// Tilde ranges.
// Meaning is "reasonably at or greater than"
var LONETILDE = R++
src[LONETILDE] = '(?:~>?)'

var TILDETRIM = R++
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+'
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g')
var tildeTrimReplace = '$1~'

var TILDE = R++
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$'
var TILDELOOSE = R++
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$'

// Caret ranges.
// Meaning is "at least and backwards compatible with"
var LONECARET = R++
src[LONECARET] = '(?:\\^)'

var CARETTRIM = R++
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+'
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g')
var caretTrimReplace = '$1^'

var CARET = R++
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$'
var CARETLOOSE = R++
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$'

// A simple gt/lt/eq thing, or just "" to indicate "any version"
var COMPARATORLOOSE = R++
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$'
var COMPARATOR = R++
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$'

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
var COMPARATORTRIM = R++
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')'

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g')
var comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
var HYPHENRANGE = R++
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[XRANGEPLAIN] + ')' +
                   '\\s*$'

var HYPHENRANGELOOSE = R++
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s*$'

// Star ranges basically just allow anything at all.
var STAR = R++
src[STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i])
  if (!re[i]) {
    re[i] = new RegExp(src[i])
  }
}

exports.parse = parse
function parse (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  var r = options.loose ? re[LOOSE] : re[FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

exports.valid = valid
function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}

exports.clean = clean
function clean (version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}

exports.SemVer = SemVer

function SemVer (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }
  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version
    } else {
      version = version.version
    }
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version)
  }

  if (version.length > MAX_LENGTH) {
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
  }

  if (!(this instanceof SemVer)) {
    return new SemVer(version, options)
  }

  debug('SemVer', version, options)
  this.options = options
  this.loose = !!options.loose

  var m = version.trim().match(options.loose ? re[LOOSE] : re[FULL])

  if (!m) {
    throw new TypeError('Invalid Version: ' + version)
  }

  this.raw = version

  // these are actually numbers
  this.major = +m[1]
  this.minor = +m[2]
  this.patch = +m[3]

  if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version')
  }

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version')
  }

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version')
  }

  // numberify any prerelease numeric ids
  if (!m[4]) {
    this.prerelease = []
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id
        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num
        }
      }
      return id
    })
  }

  this.build = m[5] ? m[5].split('.') : []
  this.format()
}

SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch
  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.')
  }
  return this.version
}

SemVer.prototype.toString = function () {
  return this.version
}

SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other)
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return this.compareMain(other) || this.comparePre(other)
}

SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch)
}

SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length) {
    return -1
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0
  }

  var i = 0
  do {
    var a = this.prerelease[i]
    var b = other.prerelease[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor = 0
      this.major++
      this.inc('pre', identifier)
      break
    case 'preminor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor++
      this.inc('pre', identifier)
      break
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0
      this.inc('patch', identifier)
      this.inc('pre', identifier)
      break
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier)
      }
      this.inc('pre', identifier)
      break

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0) {
        this.major++
      }
      this.minor = 0
      this.patch = 0
      this.prerelease = []
      break
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++
      }
      this.patch = 0
      this.prerelease = []
      break
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++
      }
      this.prerelease = []
      break
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0]
      } else {
        var i = this.prerelease.length
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++
            i = -2
          }
        }
        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0)
        }
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0]
          }
        } else {
          this.prerelease = [identifier, 0]
        }
      }
      break

    default:
      throw new Error('invalid increment argument: ' + release)
  }
  this.format()
  this.raw = this.version
  return this
}

exports.inc = inc
function inc (version, release, loose, identifier) {
  if (typeof (loose) === 'string') {
    identifier = loose
    loose = undefined
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version
  } catch (er) {
    return null
  }
}

exports.diff = diff
function diff (version1, version2) {
  if (eq(version1, version2)) {
    return null
  } else {
    var v1 = parse(version1)
    var v2 = parse(version2)
    var prefix = ''
    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre'
      var defaultResult = 'prerelease'
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}

exports.compareIdentifiers = compareIdentifiers

var numeric = /^[0-9]+$/
function compareIdentifiers (a, b) {
  var anum = numeric.test(a)
  var bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

exports.rcompareIdentifiers = rcompareIdentifiers
function rcompareIdentifiers (a, b) {
  return compareIdentifiers(b, a)
}

exports.major = major
function major (a, loose) {
  return new SemVer(a, loose).major
}

exports.minor = minor
function minor (a, loose) {
  return new SemVer(a, loose).minor
}

exports.patch = patch
function patch (a, loose) {
  return new SemVer(a, loose).patch
}

exports.compare = compare
function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}

exports.compareLoose = compareLoose
function compareLoose (a, b) {
  return compare(a, b, true)
}

exports.rcompare = rcompare
function rcompare (a, b, loose) {
  return compare(b, a, loose)
}

exports.sort = sort
function sort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compare(a, b, loose)
  })
}

exports.rsort = rsort
function rsort (list, loose) {
  return list.sort(function (a, b) {
    return exports.rcompare(a, b, loose)
  })
}

exports.gt = gt
function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}

exports.lt = lt
function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}

exports.eq = eq
function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}

exports.neq = neq
function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}

exports.gte = gte
function gte (a, b, loose) {
  return compare(a, b, loose) >= 0
}

exports.lte = lte
function lte (a, b, loose) {
  return compare(a, b, loose) <= 0
}

exports.cmp = cmp
function cmp (a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError('Invalid operator: ' + op)
  }
}

exports.Comparator = Comparator
function Comparator (comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp
    } else {
      comp = comp.value
    }
  }

  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options)
  }

  debug('comparator', comp, options)
  this.options = options
  this.loose = !!options.loose
  this.parse(comp)

  if (this.semver === ANY) {
    this.value = ''
  } else {
    this.value = this.operator + this.semver.version
  }

  debug('comp', this)
}

var ANY = {}
Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
  var m = comp.match(r)

  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp)
  }

  this.operator = m[1]
  if (this.operator === '=') {
    this.operator = ''
  }

  // if it literally is just '>' or '' then allow anything.
  if (!m[2]) {
    this.semver = ANY
  } else {
    this.semver = new SemVer(m[2], this.options.loose)
  }
}

Comparator.prototype.toString = function () {
  return this.value
}

Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose)

  if (this.semver === ANY) {
    return true
  }

  if (typeof version === 'string') {
    version = new SemVer(version, this.options)
  }

  return cmp(version, this.operator, this.semver, this.options)
}

Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required')
  }

  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  var rangeTmp

  if (this.operator === '') {
    rangeTmp = new Range(comp.value, options)
    return satisfies(this.value, rangeTmp, options)
  } else if (comp.operator === '') {
    rangeTmp = new Range(this.value, options)
    return satisfies(comp.semver, rangeTmp, options)
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>')
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<')
  var sameSemVer = this.semver.version === comp.semver.version
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=')
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, options) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'))
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, options) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'))

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
}

exports.Range = Range
function Range (range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (range instanceof Range) {
    if (range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease) {
      return range
    } else {
      return new Range(range.raw, options)
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, options)
  }

  if (!(this instanceof Range)) {
    return new Range(range, options)
  }

  this.options = options
  this.loose = !!options.loose
  this.includePrerelease = !!options.includePrerelease

  // First, split based on boolean or ||
  this.raw = range
  this.set = range.split(/\s*\|\|\s*/).map(function (range) {
    return this.parseRange(range.trim())
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length
  })

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range)
  }

  this.format()
}

Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim()
  }).join('||').trim()
  return this.range
}

Range.prototype.toString = function () {
  return this.range
}

Range.prototype.parseRange = function (range) {
  var loose = this.options.loose
  range = range.trim()
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE]
  range = range.replace(hr, hyphenReplace)
  debug('hyphen replace', range)
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace)
  debug('comparator trim', range, re[COMPARATORTRIM])

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[TILDETRIM], tildeTrimReplace)

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[CARETTRIM], caretTrimReplace)

  // normalize spaces
  range = range.split(/\s+/).join(' ')

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options)
  }, this).join(' ').split(/\s+/)
  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe)
    })
  }
  set = set.map(function (comp) {
    return new Comparator(comp, this.options)
  }, this)

  return set
}

Range.prototype.intersects = function (range, options) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required')
  }

  return this.set.some(function (thisComparators) {
    return thisComparators.every(function (thisComparator) {
      return range.set.some(function (rangeComparators) {
        return rangeComparators.every(function (rangeComparator) {
          return thisComparator.intersects(rangeComparator, options)
        })
      })
    })
  })
}

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators
function toComparators (range, options) {
  return new Range(range, options).set.map(function (comp) {
    return comp.map(function (c) {
      return c.value
    }).join(' ').trim().split(' ')
  })
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator (comp, options) {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

function isX (id) {
  return !id || id.toLowerCase() === 'x' || id === '*'
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceTilde(comp, options)
  }).join(' ')
}

function replaceTilde (comp, options) {
  var r = options.loose ? re[TILDELOOSE] : re[TILDE]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
            ' <' + M + '.' + (+m + 1) + '.0'
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0'
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceCaret(comp, options)
  }).join(' ')
}

function replaceCaret (comp, options) {
  debug('caret', comp, options)
  var r = options.loose ? re[CARETLOOSE] : re[CARET]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + (+M + 1) + '.0.0'
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0'
      }
    }

    debug('caret return', ret)
    return ret
  })
}

function replaceXRanges (comp, options) {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options)
  }).join(' ')
}

function replaceXRange (comp, options) {
  comp = comp.trim()
  var r = options.loose ? re[XRANGELOOSE] : re[XRANGE]
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    var xM = isX(M)
    var xm = xM || isX(m)
    var xp = xm || isX(p)
    var anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      ret = gtlt + M + '.' + m + '.' + p
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars (comp, options) {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[STAR], '')
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0'
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0'
  } else {
    from = '>=' + from
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0'
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0'
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
  } else {
    to = '<=' + to
  }

  return (from + ' ' + to).trim()
}

// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function (version) {
  if (!version) {
    return false
  }

  if (typeof version === 'string') {
    version = new SemVer(version, this.options)
  }

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version, this.options)) {
      return true
    }
  }
  return false
}

function testSet (set, version, options) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}

exports.satisfies = satisfies
function satisfies (version, range, options) {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}

exports.maxSatisfying = maxSatisfying
function maxSatisfying (versions, range, options) {
  var max = null
  var maxSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}

exports.minSatisfying = minSatisfying
function minSatisfying (versions, range, options) {
  var min = null
  var minSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}

exports.minVersion = minVersion
function minVersion (range, loose) {
  range = new Range(range, loose)

  var minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error('Unexpected operation: ' + comparator.operator)
      }
    })
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}

exports.validRange = validRange
function validRange (range, options) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr
function ltr (version, range, options) {
  return outside(version, range, '<', options)
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr
function gtr (version, range, options) {
  return outside(version, range, '>', options)
}

exports.outside = outside
function outside (version, range, hilo, options) {
  version = new SemVer(version, options)
  range = new Range(range, options)

  var gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    var high = null
    var low = null

    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

exports.prerelease = prerelease
function prerelease (version, options) {
  var parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}

exports.intersects = intersects
function intersects (r1, r2, options) {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}

exports.coerce = coerce
function coerce (version) {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  var match = version.match(re[COERCE])

  if (match == null) {
    return null
  }

  return parse(match[1] +
    '.' + (match[2] || '0') +
    '.' + (match[3] || '0'))
}


/***/ }),

/***/ 293:
/***/ (function(module) {

module.exports = require("buffer");

/***/ }),

/***/ 294:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = parseOptions;

const { Deprecation } = __webpack_require__(692);
const { getUserAgent } = __webpack_require__(796);
const once = __webpack_require__(969);

const pkg = __webpack_require__(215);

const deprecateOptionsTimeout = once((log, deprecation) =>
  log.warn(deprecation)
);
const deprecateOptionsAgent = once((log, deprecation) => log.warn(deprecation));
const deprecateOptionsHeaders = once((log, deprecation) =>
  log.warn(deprecation)
);

function parseOptions(options, log, hook) {
  if (options.headers) {
    options.headers = Object.keys(options.headers).reduce((newObj, key) => {
      newObj[key.toLowerCase()] = options.headers[key];
      return newObj;
    }, {});
  }

  const clientDefaults = {
    headers: options.headers || {},
    request: options.request || {},
    mediaType: {
      previews: [],
      format: ""
    }
  };

  if (options.baseUrl) {
    clientDefaults.baseUrl = options.baseUrl;
  }

  if (options.userAgent) {
    clientDefaults.headers["user-agent"] = options.userAgent;
  }

  if (options.previews) {
    clientDefaults.mediaType.previews = options.previews;
  }

  if (options.timeZone) {
    clientDefaults.headers["time-zone"] = options.timeZone;
  }

  if (options.timeout) {
    deprecateOptionsTimeout(
      log,
      new Deprecation(
        "[@octokit/rest] new Octokit({timeout}) is deprecated. Use {request: {timeout}} instead. See https://github.com/octokit/request.js#request"
      )
    );
    clientDefaults.request.timeout = options.timeout;
  }

  if (options.agent) {
    deprecateOptionsAgent(
      log,
      new Deprecation(
        "[@octokit/rest] new Octokit({agent}) is deprecated. Use {request: {agent}} instead. See https://github.com/octokit/request.js#request"
      )
    );
    clientDefaults.request.agent = options.agent;
  }

  if (options.headers) {
    deprecateOptionsHeaders(
      log,
      new Deprecation(
        "[@octokit/rest] new Octokit({headers}) is deprecated. Use {userAgent, previews} instead. See https://github.com/octokit/request.js#request"
      )
    );
  }

  const userAgentOption = clientDefaults.headers["user-agent"];
  const defaultUserAgent = `octokit.js/${pkg.version} ${getUserAgent()}`;

  clientDefaults.headers["user-agent"] = [userAgentOption, defaultUserAgent]
    .filter(Boolean)
    .join(" ");

  clientDefaults.request.hook = hook.bind(null, "request");

  return clientDefaults;
}


/***/ }),

/***/ 297:
/***/ (function(module) {

module.exports = class HttpError extends Error {
  constructor (message, code, headers) {
    super(message)

    // Maintains proper stack trace (only available on V8)
    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    this.name = 'HttpError'
    this.code = code
    this.headers = headers
  }
}


/***/ }),

/***/ 301:
/***/ (function(module, __unusedexports, __webpack_require__) {

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint:
 *
 * - https://developer.github.com/v3/search/#example (key `items`)
 * - https://developer.github.com/v3/checks/runs/#response-3 (key: `check_runs`)
 * - https://developer.github.com/v3/checks/suites/#response-1 (key: `check_suites`)
 * - https://developer.github.com/v3/apps/installations/#list-repositories (key: `repositories`)
 * - https://developer.github.com/v3/apps/installations/#list-installations-for-a-user (key `installations`)
 * - https://developer.github.com/v3/orgs/#list-installations-for-an-organization (key `installations`)
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not. For the exceptions with the namespace, a fallback check for the route
 * paths has to be added in order to normalize the response. We cannot check for the total_count
 * property because it also exists in the response of Get the combined status for a specific ref.
 */

module.exports = normalizePaginatedListResponse;

const { Deprecation } = __webpack_require__(692);
const once = __webpack_require__(969);

const deprecateIncompleteResults = once((log, deprecation) =>
  log.warn(deprecation)
);
const deprecateTotalCount = once((log, deprecation) => log.warn(deprecation));
const deprecateNamespace = once((log, deprecation) => log.warn(deprecation));

const REGEX_IS_SEARCH_PATH = /^\/search\//;
const REGEX_IS_CHECKS_PATH = /^\/repos\/[^/]+\/[^/]+\/commits\/[^/]+\/(check-runs|check-suites)/;
const REGEX_IS_INSTALLATION_REPOSITORIES_PATH = /^\/installation\/repositories/;
const REGEX_IS_USER_INSTALLATIONS_PATH = /^\/user\/installations/;
const REGEX_IS_ORG_INSTALLATIONS_PATH = /^\/orgs\/[^/]+\/installations/;

function normalizePaginatedListResponse(octokit, url, response) {
  const path = url.replace(octokit.request.endpoint.DEFAULTS.baseUrl, "");
  if (
    !REGEX_IS_SEARCH_PATH.test(path) &&
    !REGEX_IS_CHECKS_PATH.test(path) &&
    !REGEX_IS_INSTALLATION_REPOSITORIES_PATH.test(path) &&
    !REGEX_IS_USER_INSTALLATIONS_PATH.test(path) &&
    !REGEX_IS_ORG_INSTALLATIONS_PATH.test(path)
  ) {
    return;
  }

  // keep the additional properties intact to avoid a breaking change,
  // but log a deprecation warning when accessed
  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;

  const namespaceKey = Object.keys(response.data)[0];

  response.data = response.data[namespaceKey];

  Object.defineProperty(response.data, namespaceKey, {
    get() {
      deprecateNamespace(
        octokit.log,
        new Deprecation(
          `[@octokit/rest] "result.data.${namespaceKey}" is deprecated. Use "result.data" instead`
        )
      );
      return response.data;
    }
  });

  if (typeof incompleteResults !== "undefined") {
    Object.defineProperty(response.data, "incomplete_results", {
      get() {
        deprecateIncompleteResults(
          octokit.log,
          new Deprecation(
            '[@octokit/rest] "result.data.incomplete_results" is deprecated.'
          )
        );
        return incompleteResults;
      }
    });
  }

  if (typeof repositorySelection !== "undefined") {
    Object.defineProperty(response.data, "repository_selection", {
      get() {
        deprecateTotalCount(
          octokit.log,
          new Deprecation(
            '[@octokit/rest] "result.data.repository_selection" is deprecated.'
          )
        );
        return repositorySelection;
      }
    });
  }

  Object.defineProperty(response.data, "total_count", {
    get() {
      deprecateTotalCount(
        octokit.log,
        new Deprecation(
          '[@octokit/rest] "result.data.total_count" is deprecated.'
        )
      );
      return totalCount;
    }
  });
}


/***/ }),

/***/ 304:
/***/ (function(module) {

module.exports = require("string_decoder");

/***/ }),

/***/ 323:
/***/ (function(module) {

"use strict";


var isStream = module.exports = function (stream) {
	return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
};

isStream.writable = function (stream) {
	return isStream(stream) && stream.writable !== false && typeof stream._write === 'function' && typeof stream._writableState === 'object';
};

isStream.readable = function (stream) {
	return isStream(stream) && stream.readable !== false && typeof stream._read === 'function' && typeof stream._readableState === 'object';
};

isStream.duplex = function (stream) {
	return isStream.writable(stream) && isStream.readable(stream);
};

isStream.transform = function (stream) {
	return isStream.duplex(stream) && typeof stream._transform === 'function' && typeof stream._transformState === 'object';
};


/***/ }),

/***/ 336:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasLastPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)

function hasLastPage (link) {
  deprecate(`octokit.hasLastPage() ? You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).last
}


/***/ }),

/***/ 348:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


module.exports = validate;

const { RequestError } = __webpack_require__(463);
const get = __webpack_require__(854);
const set = __webpack_require__(883);

function validate(octokit, options) {
  if (!options.request.validate) {
    return;
  }
  const { validate: params } = options.request;

  Object.keys(params).forEach(parameterName => {
    const parameter = get(params, parameterName);

    const expectedType = parameter.type;
    let parentParameterName;
    let parentValue;
    let parentParamIsPresent = true;
    let parentParameterIsArray = false;

    if (/\./.test(parameterName)) {
      parentParameterName = parameterName.replace(/\.[^.]+$/, "");
      parentParameterIsArray = parentParameterName.slice(-2) === "[]";
      if (parentParameterIsArray) {
        parentParameterName = parentParameterName.slice(0, -2);
      }
      parentValue = get(options, parentParameterName);
      parentParamIsPresent =
        parentParameterName === "headers" ||
        (typeof parentValue === "object" && parentValue !== null);
    }

    const values = parentParameterIsArray
      ? (get(options, parentParameterName) || []).map(
          value => value[parameterName.split(/\./).pop()]
        )
      : [get(options, parameterName)];

    values.forEach((value, i) => {
      const valueIsPresent = typeof value !== "undefined";
      const valueIsNull = value === null;
      const currentParameterName = parentParameterIsArray
        ? parameterName.replace(/\[\]/, `[${i}]`)
        : parameterName;

      if (!parameter.required && !valueIsPresent) {
        return;
      }

      // if the parent parameter is of type object but allows null
      // then the child parameters can be ignored
      if (!parentParamIsPresent) {
        return;
      }

      if (parameter.allowNull && valueIsNull) {
        return;
      }

      if (!parameter.allowNull && valueIsNull) {
        throw new RequestError(
          `'${currentParameterName}' cannot be null`,
          400,
          {
            request: options
          }
        );
      }

      if (parameter.required && !valueIsPresent) {
        throw new RequestError(
          `Empty value for parameter '${currentParameterName}': ${JSON.stringify(
            value
          )}`,
          400,
          {
            request: options
          }
        );
      }

      // parse to integer before checking for enum
      // so that string "1" will match enum with number 1
      if (expectedType === "integer") {
        const unparsedValue = value;
        value = parseInt(value, 10);
        if (isNaN(value)) {
          throw new RequestError(
            `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
              unparsedValue
            )} is NaN`,
            400,
            {
              request: options
            }
          );
        }
      }

      if (parameter.enum && parameter.enum.indexOf(String(value)) === -1) {
        throw new RequestError(
          `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
            value
          )}`,
          400,
          {
            request: options
          }
        );
      }

      if (parameter.validation) {
        const regex = new RegExp(parameter.validation);
        if (!regex.test(value)) {
          throw new RequestError(
            `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
              value
            )}`,
            400,
            {
              request: options
            }
          );
        }
      }

      if (expectedType === "object" && typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch (exception) {
          throw new RequestError(
            `JSON parse error of value for parameter '${currentParameterName}': ${JSON.stringify(
              value
            )}`,
            400,
            {
              request: options
            }
          );
        }
      }

      set(options, parameter.mapTo || currentParameterName, value);
    });
  });

  return options;
}


/***/ }),

/***/ 349:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationRequestError;

const { RequestError } = __webpack_require__(463);

function authenticationRequestError(state, error, options) {
  /* istanbul ignore next */
  if (!error.headers) throw error;

  const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error;
  }

  if (
    error.status === 401 &&
    otpRequired &&
    error.request &&
    error.request.headers["x-github-otp"]
  ) {
    throw new RequestError(
      "Invalid one-time password for two-factor authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  if (typeof state.auth.on2fa !== "function") {
    throw new RequestError(
      "2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa();
    })
    .then(oneTimePassword => {
      const newOptions = Object.assign(options, {
        headers: Object.assign(
          { "x-github-otp": oneTimePassword },
          options.headers
        )
      });
      return state.octokit.request(newOptions);
    });
}


/***/ }),

/***/ 357:
/***/ (function(module) {

module.exports = require("assert");

/***/ }),

/***/ 363:
/***/ (function(module) {

module.exports = register

function register (state, name, method, options) {
  if (typeof method !== 'function') {
    throw new Error('method for before hook must be a function')
  }

  if (!options) {
    options = {}
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options)
    }, method)()
  }

  return Promise.resolve()
    .then(function () {
      if (!state.registry[name]) {
        return method(options)
      }

      return (state.registry[name]).reduce(function (method, registered) {
        return registered.hook.bind(null, method, options)
      }, method)()
    })
}


/***/ }),

/***/ 368:
/***/ (function(module) {

module.exports = function atob(str) {
  return Buffer.from(str, 'base64').toString('binary')
}


/***/ }),

/***/ 370:
/***/ (function(module) {

module.exports = deprecate

const loggedMessages = {}

function deprecate (message) {
  if (loggedMessages[message]) {
    return
  }

  console.warn(`DEPRECATED (@octokit/rest): ${message}`)
  loggedMessages[message] = 1
}


/***/ }),

/***/ 372:
/***/ (function(module) {

module.exports = octokitDebug;

function octokitDebug(octokit) {
  octokit.hook.wrap("request", (request, options) => {
    octokit.log.debug("request", options);
    const start = Date.now();
    const requestOptions = octokit.request.endpoint.parse(options);
    const path = requestOptions.url.replace(options.baseUrl, "");

    return request(options)
      .then(response => {
        octokit.log.info(
          `${requestOptions.method} ${path} - ${
            response.status
          } in ${Date.now() - start}ms`
        );
        return response;
      })

      .catch(error => {
        octokit.log.info(
          `${requestOptions.method} ${path} - ${error.status} in ${Date.now() -
            start}ms`
        );
        throw error;
      });
  });
}


/***/ }),

/***/ 385:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isPlainObject = _interopDefault(__webpack_require__(696));
var universalUserAgent = __webpack_require__(796);

function lowercaseKeys(object) {
  if (!object) {
    return {};
  }

  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach(key => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, {
        [key]: options[key]
      });else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, {
        [key]: options[key]
      });
    }
  });
  return result;
}

function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? {
      method,
      url
    } : {
      url: method
    }, options);
  } else {
    options = Object.assign({}, route);
  } // lowercase header names before merging with defaults to avoid duplicates


  options.headers = lowercaseKeys(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options); // mediaType.previews arrays are merged, instead of overwritten

  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview => preview.replace(/-preview/, ""));
  return mergedOptions;
}

function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  return url + separator + names.map(name => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }

    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

const urlVariableRegex = /\{[^}]+\}/g;

function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}

function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);

  if (!matches) {
    return [];
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
  return Object.keys(object).filter(option => !keysToOmit.includes(option)).reduce((obj, key) => {
    obj[key] = object[key];
    return obj;
  }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/* istanbul ignore file */
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }

    return part;
  }).join("");
}

function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);

  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}

function getValues(context, operator, key, modifier) {
  var value = context[key],
      result = [];

  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();

      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }

  return result;
}

function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}

function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
    if (expression) {
      let operator = "";
      const values = [];

      if (operators.indexOf(expression.charAt(0)) !== -1) {
        operator = expression.charAt(0);
        expression = expression.substr(1);
      }

      expression.split(/,/g).forEach(function (variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
      });

      if (operator && operator !== "+") {
        var separator = ",";

        if (operator === "?") {
          separator = "&";
        } else if (operator !== "#") {
          separator = operator;
        }

        return (values.length !== 0 ? operator : "") + values.join(separator);
      } else {
        return values.join(",");
      }
    } else {
      return encodeReserved(literal);
    }
  });
}

function parse(options) {
  // https://fetch.spec.whatwg.org/#methods
  let method = options.method.toUpperCase(); // replace :varname with {varname} to make it RFC 6570 compatible

  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{+$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]); // extract variable names from URL to calculate remaining variables later

  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);

  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }

  const omittedParameters = Object.keys(options).filter(option => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequset = /application\/octet-stream/i.test(headers.accept);

  if (!isBinaryRequset) {
    if (options.mediaType.format) {
      // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
      headers.accept = headers.accept.split(/,/).map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
    }

    if (options.mediaType.previews.length) {
      const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
      headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map(preview => {
        const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
        return `application/vnd.github.${preview}-preview${format}`;
      }).join(",");
    }
  } // for GET/HEAD requests, set URL query parameters from remaining parameters
  // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters


  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      } else {
        headers["content-length"] = 0;
      }
    }
  } // default content-type for JSON if body is set


  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  } // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
  // fetch does not allow to set `content-length` header, but we can set body to an empty string


  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  } // Only return body/request keys if present


  return Object.assign({
    method,
    url,
    headers
  }, typeof body !== "undefined" ? {
    body
  } : null, options.request ? {
    request: options.request
  } : null);
}

function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  });
}

const VERSION = "5.5.1";

const userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`; // DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.

const DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: []
  }
};

const endpoint = withDefaults(null, DEFAULTS);

exports.endpoint = endpoint;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 389:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(747);
const shebangCommand = __webpack_require__(866);

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    let buffer;

    if (Buffer.alloc) {
        // Node.js v4.5+ / v5.10+
        buffer = Buffer.alloc(size);
    } else {
        // Old Node.js API
        buffer = new Buffer(size);
        buffer.fill(0); // zero-fill
    }

    let fd;

    try {
        fd = fs.openSync(command, 'r');
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

module.exports = readShebang;


/***/ }),

/***/ 402:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = Octokit;

const { request } = __webpack_require__(753);
const Hook = __webpack_require__(523);

const parseClientOptions = __webpack_require__(294);

function Octokit(plugins, options) {
  options = options || {};
  const hook = new Hook.Collection();
  const log = Object.assign(
    {
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error
    },
    options && options.log
  );
  const api = {
    hook,
    log,
    request: request.defaults(parseClientOptions(options, log, hook))
  };

  plugins.forEach(pluginFunction => pluginFunction(api, options));

  return api;
}


/***/ }),

/***/ 413:
/***/ (function(module) {

module.exports = require("stream");

/***/ }),

/***/ 427:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

// Older verions of Node.js might not have `util.getSystemErrorName()`.
// In that case, fall back to a deprecated internal.
const util = __webpack_require__(669);

let uv;

if (typeof util.getSystemErrorName === 'function') {
	module.exports = util.getSystemErrorName;
} else {
	try {
		uv = process.binding('uv');

		if (typeof uv.errname !== 'function') {
			throw new TypeError('uv.errname is not a function');
		}
	} catch (err) {
		console.error('execa/lib/errname: unable to establish process.binding(\'uv\')', err);
		uv = null;
	}

	module.exports = code => errname(uv, code);
}

// Used for testing the fallback behavior
module.exports.__test__ = errname;

function errname(uv, code) {
	if (uv) {
		return uv.errname(code);
	}

	if (!(code < 0)) {
		throw new Error('err >= 0');
	}

	return `Unknown system error ${code}`;
}



/***/ }),

/***/ 430:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = octokitValidate;

const validate = __webpack_require__(348);

function octokitValidate(octokit) {
  octokit.hook.before("request", validate.bind(null, octokit));
}


/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const os = __webpack_require__(87);
/**
 * Commands
 *
 * Command Format:
 *   ##[name key=value;key=value]message
 *
 * Examples:
 *   ##[warning]This is the user warning message
 *   ##[set-secret name=mypassword]definitelyNotAPassword!
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        // safely append the val - avoid blowing up when attempting to
                        // call .replace() if message is not a string for some reason
                        cmdStr += `${key}=${escape(`${val || ''}`)},`;
                    }
                }
            }
        }
        cmdStr += CMD_STRING;
        // safely append the message - avoid blowing up when attempting to
        // call .replace() if message is not a string for some reason
        const message = `${this.message || ''}`;
        cmdStr += escapeData(message);
        return cmdStr;
    }
}
function escapeData(s) {
    return s.replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}
function escape(s) {
    return s
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/]/g, '%5D')
        .replace(/;/g, '%3B');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 453:
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(969)
var eos = __webpack_require__(9)
var fs = __webpack_require__(747) // we only need fs to get the ReadStream and WriteStream prototypes

var noop = function () {}
var ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump


/***/ }),

/***/ 454:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Stream = _interopDefault(__webpack_require__(413));
var http = _interopDefault(__webpack_require__(605));
var Url = _interopDefault(__webpack_require__(835));
var https = _interopDefault(__webpack_require__(211));
var zlib = _interopDefault(__webpack_require__(761));

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = __webpack_require__(5).convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

module.exports = exports = fetch;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports;
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.FetchError = FetchError;


/***/ }),

/***/ 462:
/***/ (function(module) {

"use strict";


// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

module.exports.command = escapeCommand;
module.exports.argument = escapeArgument;


/***/ }),

/***/ 463:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __webpack_require__(692);
var once = _interopDefault(__webpack_require__(969));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers || {}; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 469:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Originally pulled from https://github.com/JasonEtco/actions-toolkit/blob/master/src/github.ts
const graphql_1 = __webpack_require__(898);
const rest_1 = __importDefault(__webpack_require__(0));
const Context = __importStar(__webpack_require__(262));
// We need this in order to extend Octokit
rest_1.default.prototype = new rest_1.default();
exports.context = new Context.Context();
class GitHub extends rest_1.default {
    constructor(token, opts = {}) {
        super(Object.assign(Object.assign({}, opts), { auth: `token ${token}` }));
        this.graphql = graphql_1.graphql.defaults({
            headers: { authorization: `token ${token}` }
        });
    }
}
exports.GitHub = GitHub;
//# sourceMappingURL=github.js.map

/***/ }),

/***/ 470:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const os = __webpack_require__(87);
const path = __webpack_require__(622);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable
 */
function exportVariable(name, val) {
    process.env[name] = val;
    command_1.issueCommand('set-env', { name }, val);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store
 */
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message
 */
function error(message) {
    command_1.issue('error', message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message
 */
function warning(message) {
    command_1.issue('warning', message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store
 */
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 471:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationBeforeRequest;

const btoa = __webpack_require__(675);
const uniq = __webpack_require__(126);

function authenticationBeforeRequest(state, options) {
  if (!state.auth.type) {
    return;
  }

  if (state.auth.type === "basic") {
    const hash = btoa(`${state.auth.username}:${state.auth.password}`);
    options.headers.authorization = `Basic ${hash}`;
    return;
  }

  if (state.auth.type === "token") {
    options.headers.authorization = `token ${state.auth.token}`;
    return;
  }

  if (state.auth.type === "app") {
    options.headers.authorization = `Bearer ${state.auth.token}`;
    const acceptHeaders = options.headers.accept
      .split(",")
      .concat("application/vnd.github.machine-man-preview+json");
    options.headers.accept = uniq(acceptHeaders)
      .filter(Boolean)
      .join(",");
    return;
  }

  options.url += options.url.indexOf("?") === -1 ? "?" : "&";

  if (state.auth.token) {
    options.url += `access_token=${encodeURIComponent(state.auth.token)}`;
    return;
  }

  const key = encodeURIComponent(state.auth.key);
  const secret = encodeURIComponent(state.auth.secret);
  options.url += `client_id=${key}&client_secret=${secret}`;
}


/***/ }),

/***/ 489:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const which = __webpack_require__(814);
const pathKey = __webpack_require__(39)();

function resolveCommandAttempt(parsed, withoutPathExt) {
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (hasCustomCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which.sync(parsed.command, {
            path: (parsed.options.env || process.env)[pathKey],
            pathExt: withoutPathExt ? path.delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        process.chdir(cwd);
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

module.exports = resolveCommand;


/***/ }),

/***/ 495:
/***/ (function(module) {

module.exports = {"uChars":[128,165,169,178,184,216,226,235,238,244,248,251,253,258,276,284,300,325,329,334,364,463,465,467,469,471,473,475,477,506,594,610,712,716,730,930,938,962,970,1026,1104,1106,8209,8215,8218,8222,8231,8241,8244,8246,8252,8365,8452,8454,8458,8471,8482,8556,8570,8596,8602,8713,8720,8722,8726,8731,8737,8740,8742,8748,8751,8760,8766,8777,8781,8787,8802,8808,8816,8854,8858,8870,8896,8979,9322,9372,9548,9588,9616,9622,9634,9652,9662,9672,9676,9680,9702,9735,9738,9793,9795,11906,11909,11913,11917,11928,11944,11947,11951,11956,11960,11964,11979,12284,12292,12312,12319,12330,12351,12436,12447,12535,12543,12586,12842,12850,12964,13200,13215,13218,13253,13263,13267,13270,13384,13428,13727,13839,13851,14617,14703,14801,14816,14964,15183,15471,15585,16471,16736,17208,17325,17330,17374,17623,17997,18018,18212,18218,18301,18318,18760,18811,18814,18820,18823,18844,18848,18872,19576,19620,19738,19887,40870,59244,59336,59367,59413,59417,59423,59431,59437,59443,59452,59460,59478,59493,63789,63866,63894,63976,63986,64016,64018,64021,64025,64034,64037,64042,65074,65093,65107,65112,65127,65132,65375,65510,65536],"gbChars":[0,36,38,45,50,81,89,95,96,100,103,104,105,109,126,133,148,172,175,179,208,306,307,308,309,310,311,312,313,341,428,443,544,545,558,741,742,749,750,805,819,820,7922,7924,7925,7927,7934,7943,7944,7945,7950,8062,8148,8149,8152,8164,8174,8236,8240,8262,8264,8374,8380,8381,8384,8388,8390,8392,8393,8394,8396,8401,8406,8416,8419,8424,8437,8439,8445,8482,8485,8496,8521,8603,8936,8946,9046,9050,9063,9066,9076,9092,9100,9108,9111,9113,9131,9162,9164,9218,9219,11329,11331,11334,11336,11346,11361,11363,11366,11370,11372,11375,11389,11682,11686,11687,11692,11694,11714,11716,11723,11725,11730,11736,11982,11989,12102,12336,12348,12350,12384,12393,12395,12397,12510,12553,12851,12962,12973,13738,13823,13919,13933,14080,14298,14585,14698,15583,15847,16318,16434,16438,16481,16729,17102,17122,17315,17320,17402,17418,17859,17909,17911,17915,17916,17936,17939,17961,18664,18703,18814,18962,19043,33469,33470,33471,33484,33485,33490,33497,33501,33505,33513,33520,33536,33550,37845,37921,37948,38029,38038,38064,38065,38066,38069,38075,38076,38078,39108,39109,39113,39114,39115,39116,39265,39394,189000]};

/***/ }),

/***/ 510:
/***/ (function(module) {

module.exports = addHook

function addHook (state, kind, name, hook) {
  var orig = hook
  if (!state.registry[name]) {
    state.registry[name] = []
  }

  if (kind === 'before') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options))
    }
  }

  if (kind === 'after') {
    hook = function (method, options) {
      var result
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_
          return orig(result, options)
        })
        .then(function () {
          return result
        })
    }
  }

  if (kind === 'error') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options)
        })
    }
  }

  state.registry[name].push({
    hook: hook,
    orig: orig
  })
}


/***/ }),

/***/ 513:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


// Description of supported double byte encodings and aliases.
// Tables are not require()-d until they are needed to speed up library load.
// require()-s are direct to support Browserify.

module.exports = {
    
    // == Japanese/ShiftJIS ====================================================
    // All japanese encodings are based on JIS X set of standards:
    // JIS X 0201 - Single-byte encoding of ASCII + \ + Kana chars at 0xA1-0xDF.
    // JIS X 0208 - Main set of 6879 characters, placed in 94x94 plane, to be encoded by 2 bytes. 
    //              Has several variations in 1978, 1983, 1990 and 1997.
    // JIS X 0212 - Supplementary plane of 6067 chars in 94x94 plane. 1990. Effectively dead.
    // JIS X 0213 - Extension and modern replacement of 0208 and 0212. Total chars: 11233.
    //              2 planes, first is superset of 0208, second - revised 0212.
    //              Introduced in 2000, revised 2004. Some characters are in Unicode Plane 2 (0x2xxxx)

    // Byte encodings are:
    //  * Shift_JIS: Compatible with 0201, uses not defined chars in top half as lead bytes for double-byte
    //               encoding of 0208. Lead byte ranges: 0x81-0x9F, 0xE0-0xEF; Trail byte ranges: 0x40-0x7E, 0x80-0x9E, 0x9F-0xFC.
    //               Windows CP932 is a superset of Shift_JIS. Some companies added more chars, notably KDDI.
    //  * EUC-JP:    Up to 3 bytes per character. Used mostly on *nixes.
    //               0x00-0x7F       - lower part of 0201
    //               0x8E, 0xA1-0xDF - upper part of 0201
    //               (0xA1-0xFE)x2   - 0208 plane (94x94).
    //               0x8F, (0xA1-0xFE)x2 - 0212 plane (94x94).
    //  * JIS X 208: 7-bit, direct encoding of 0208. Byte ranges: 0x21-0x7E (94 values). Uncommon.
    //               Used as-is in ISO2022 family.
    //  * ISO2022-JP: Stateful encoding, with escape sequences to switch between ASCII, 
    //                0201-1976 Roman, 0208-1978, 0208-1983.
    //  * ISO2022-JP-1: Adds esc seq for 0212-1990.
    //  * ISO2022-JP-2: Adds esc seq for GB2313-1980, KSX1001-1992, ISO8859-1, ISO8859-7.
    //  * ISO2022-JP-3: Adds esc seq for 0201-1976 Kana set, 0213-2000 Planes 1, 2.
    //  * ISO2022-JP-2004: Adds 0213-2004 Plane 1.
    //
    // After JIS X 0213 appeared, Shift_JIS-2004, EUC-JISX0213 and ISO2022-JP-2004 followed, with just changing the planes.
    //
    // Overall, it seems that it's a mess :( http://www8.plala.or.jp/tkubota1/unicode-symbols-map2.html

    'shiftjis': {
        type: '_dbcs',
        table: function() { return __webpack_require__(874) },
        encodeAdd: {'\u00a5': 0x5C, '\u203E': 0x7E},
        encodeSkipVals: [{from: 0xED40, to: 0xF940}],
    },
    'csshiftjis': 'shiftjis',
    'mskanji': 'shiftjis',
    'sjis': 'shiftjis',
    'windows31j': 'shiftjis',
    'ms31j': 'shiftjis',
    'xsjis': 'shiftjis',
    'windows932': 'shiftjis',
    'ms932': 'shiftjis',
    '932': 'shiftjis',
    'cp932': 'shiftjis',

    'eucjp': {
        type: '_dbcs',
        table: function() { return __webpack_require__(277) },
        encodeAdd: {'\u00a5': 0x5C, '\u203E': 0x7E},
    },

    // TODO: KDDI extension to Shift_JIS
    // TODO: IBM CCSID 942 = CP932, but F0-F9 custom chars and other char changes.
    // TODO: IBM CCSID 943 = Shift_JIS = CP932 with original Shift_JIS lower 128 chars.


    // == Chinese/GBK ==========================================================
    // http://en.wikipedia.org/wiki/GBK
    // We mostly implement W3C recommendation: https://www.w3.org/TR/encoding/#gbk-encoder

    // Oldest GB2312 (1981, ~7600 chars) is a subset of CP936
    'gb2312': 'cp936',
    'gb231280': 'cp936',
    'gb23121980': 'cp936',
    'csgb2312': 'cp936',
    'csiso58gb231280': 'cp936',
    'euccn': 'cp936',

    // Microsoft's CP936 is a subset and approximation of GBK.
    'windows936': 'cp936',
    'ms936': 'cp936',
    '936': 'cp936',
    'cp936': {
        type: '_dbcs',
        table: function() { return __webpack_require__(663) },
    },

    // GBK (~22000 chars) is an extension of CP936 that added user-mapped chars and some other.
    'gbk': {
        type: '_dbcs',
        table: function() { return __webpack_require__(663).concat(__webpack_require__(632)) },
    },
    'xgbk': 'gbk',
    'isoir58': 'gbk',

    // GB18030 is an algorithmic extension of GBK.
    // Main source: https://www.w3.org/TR/encoding/#gbk-encoder
    // http://icu-project.org/docs/papers/gb18030.html
    // http://source.icu-project.org/repos/icu/data/trunk/charset/data/xml/gb-18030-2000.xml
    // http://www.khngai.com/chinese/charmap/tblgbk.php?page=0
    'gb18030': {
        type: '_dbcs',
        table: function() { return __webpack_require__(663).concat(__webpack_require__(632)) },
        gb18030: function() { return __webpack_require__(495) },
        encodeSkipVals: [0x80],
        encodeAdd: {'?': 0xA2E3},
    },

    'chinese': 'gb18030',


    // == Korean ===============================================================
    // EUC-KR, KS_C_5601 and KS X 1001 are exactly the same.
    'windows949': 'cp949',
    'ms949': 'cp949',
    '949': 'cp949',
    'cp949': {
        type: '_dbcs',
        table: function() { return __webpack_require__(903) },
    },

    'cseuckr': 'cp949',
    'csksc56011987': 'cp949',
    'euckr': 'cp949',
    'isoir149': 'cp949',
    'korean': 'cp949',
    'ksc56011987': 'cp949',
    'ksc56011989': 'cp949',
    'ksc5601': 'cp949',


    // == Big5/Taiwan/Hong Kong ================================================
    // There are lots of tables for Big5 and cp950. Please see the following links for history:
    // http://moztw.org/docs/big5/  http://www.haible.de/bruno/charsets/conversion-tables/Big5.html
    // Variations, in roughly number of defined chars:
    //  * Windows CP 950: Microsoft variant of Big5. Canonical: http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP950.TXT
    //  * Windows CP 951: Microsoft variant of Big5-HKSCS-2001. Seems to be never public. http://me.abelcheung.org/articles/research/what-is-cp951/
    //  * Big5-2003 (Taiwan standard) almost superset of cp950.
    //  * Unicode-at-on (UAO) / Mozilla 1.8. Falling out of use on the Web. Not supported by other browsers.
    //  * Big5-HKSCS (-2001, -2004, -2008). Hong Kong standard. 
    //    many unicode code points moved from PUA to Supplementary plane (U+2XXXX) over the years.
    //    Plus, it has 4 combining sequences.
    //    Seems that Mozilla refused to support it for 10 yrs. https://bugzilla.mozilla.org/show_bug.cgi?id=162431 https://bugzilla.mozilla.org/show_bug.cgi?id=310299
    //    because big5-hkscs is the only encoding to include astral characters in non-algorithmic way.
    //    Implementations are not consistent within browsers; sometimes labeled as just big5.
    //    MS Internet Explorer switches from big5 to big5-hkscs when a patch applied.
    //    Great discussion & recap of what's going on https://bugzilla.mozilla.org/show_bug.cgi?id=912470#c31
    //    In the encoder, it might make sense to support encoding old PUA mappings to Big5 bytes seq-s.
    //    Official spec: http://www.ogcio.gov.hk/en/business/tech_promotion/ccli/terms/doc/2003cmp_2008.txt
    //                   http://www.ogcio.gov.hk/tc/business/tech_promotion/ccli/terms/doc/hkscs-2008-big5-iso.txt
    // 
    // Current understanding of how to deal with Big5(-HKSCS) is in the Encoding Standard, http://encoding.spec.whatwg.org/#big5-encoder
    // Unicode mapping (http://www.unicode.org/Public/MAPPINGS/OBSOLETE/EASTASIA/OTHER/BIG5.TXT) is said to be wrong.

    'windows950': 'cp950',
    'ms950': 'cp950',
    '950': 'cp950',
    'cp950': {
        type: '_dbcs',
        table: function() { return __webpack_require__(785) },
    },

    // Big5 has many variations and is an extension of cp950. We use Encoding Standard's as a consensus.
    'big5': 'big5hkscs',
    'big5hkscs': {
        type: '_dbcs',
        table: function() { return __webpack_require__(785).concat(__webpack_require__(791)) },
        encodeSkipVals: [0xa2cc],
    },

    'cnbig5': 'big5hkscs',
    'csbig5': 'big5hkscs',
    'xxbig5': 'big5hkscs',
};


/***/ }),

/***/ 523:
/***/ (function(module, __unusedexports, __webpack_require__) {

var register = __webpack_require__(363)
var addHook = __webpack_require__(510)
var removeHook = __webpack_require__(763)

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind
var bindable = bind.bind(bind)

function bindApi (hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state])
  hook.api = { remove: removeHookRef }
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind]
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args)
  })
}

function HookSingular () {
  var singularHookName = 'h'
  var singularHookState = {
    registry: {}
  }
  var singularHook = register.bind(null, singularHookState, singularHookName)
  bindApi(singularHook, singularHookState, singularHookName)
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  return hook
}

var collectionHookDeprecationMessageDisplayed = false
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4')
    collectionHookDeprecationMessageDisplayed = true
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind()
Hook.Collection = HookCollection.bind()

module.exports = Hook
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook
module.exports.Singular = Hook.Singular
module.exports.Collection = Hook.Collection


/***/ }),

/***/ 529:
/***/ (function(module, __unusedexports, __webpack_require__) {

const factory = __webpack_require__(47);

module.exports = factory();


/***/ }),

/***/ 536:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasFirstPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)

function hasFirstPage (link) {
  deprecate(`octokit.hasFirstPage() ? You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).first
}


/***/ }),

/***/ 550:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getNextPage

const getPage = __webpack_require__(265)

function getNextPage (octokit, link, headers) {
  return getPage(octokit, link, 'next', headers)
}


/***/ }),

/***/ 558:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasPreviousPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)

function hasPreviousPage (link) {
  deprecate(`octokit.hasPreviousPage() ? You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).prev
}


/***/ }),

/***/ 563:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getPreviousPage

const getPage = __webpack_require__(265)

function getPreviousPage (octokit, link, headers) {
  return getPage(octokit, link, 'prev', headers)
}


/***/ }),

/***/ 568:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const niceTry = __webpack_require__(948);
const resolveCommand = __webpack_require__(489);
const escape = __webpack_require__(462);
const readShebang = __webpack_require__(389);
const semver = __webpack_require__(280);

const isWin = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

// `options.shell` is supported in Node ^4.8.0, ^5.7.0 and >= 6.0.0
const supportsShellOption = niceTry(() => semver.satisfies(process.version, '^4.8.0 || ^5.7.0 || >= 6.0.0', true)) || false;

function detectShebang(parsed) {
    parsed.file = resolveCommand(parsed);

    const shebang = parsed.file && readShebang(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path.normalize(parsed.command);

        // Escape command & arguments
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parseShell(parsed) {
    // If node supports the shell option, there's no need to mimic its behavior
    if (supportsShellOption) {
        return parsed;
    }

    // Mimic node shell option
    // See https://github.com/nodejs/node/blob/b9f6a2dc059a1062776133f3d4fd848c4da7d150/lib/child_process.js#L335
    const shellCommand = [parsed.command].concat(parsed.args).join(' ');

    if (isWin) {
        parsed.command = typeof parsed.options.shell === 'string' ? parsed.options.shell : process.env.comspec || 'cmd.exe';
        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    } else {
        if (typeof parsed.options.shell === 'string') {
            parsed.command = parsed.options.shell;
        } else if (process.platform === 'android') {
            parsed.command = '/system/bin/sh';
        } else {
            parsed.command = '/bin/sh';
        }

        parsed.args = ['-c', shellCommand];
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parseShell(parsed) : parseNonShell(parsed);
}

module.exports = parse;


/***/ }),

/***/ 577:
/***/ (function(module) {

module.exports = getPageLinks

function getPageLinks (link) {
  link = link.link || link.headers.link || ''

  const links = {}

  // link format:
  // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
  link.replace(/<([^>]*)>;\s*rel="([\w]*)"/g, (m, uri, type) => {
    links[type] = uri
  })

  return links
}


/***/ }),

/***/ 586:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = octokitRestApiEndpoints;

const ROUTES = __webpack_require__(705);

function octokitRestApiEndpoints(octokit) {
  // Aliasing scopes for backward compatibility
  // See https://github.com/octokit/rest.js/pull/1134
  ROUTES.gitdata = ROUTES.git;
  ROUTES.authorization = ROUTES.oauthAuthorizations;
  ROUTES.pullRequests = ROUTES.pulls;

  octokit.registerEndpoints(ROUTES);
}


/***/ }),

/***/ 605:
/***/ (function(module) {

module.exports = require("http");

/***/ }),

/***/ 614:
/***/ (function(module) {

module.exports = require("events");

/***/ }),

/***/ 621:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const path = __webpack_require__(622);
const pathKey = __webpack_require__(39);

module.exports = opts => {
	opts = Object.assign({
		cwd: process.cwd(),
		path: process.env[pathKey()]
	}, opts);

	let prev;
	let pth = path.resolve(opts.cwd);
	const ret = [];

	while (prev !== pth) {
		ret.push(path.join(pth, 'node_modules/.bin'));
		prev = pth;
		pth = path.resolve(pth, '..');
	}

	// ensure the running `node` binary is used
	ret.push(path.dirname(process.execPath));

	return ret.concat(opts.path).join(path.delimiter);
};

module.exports.env = opts => {
	opts = Object.assign({
		env: process.env
	}, opts);

	const env = Object.assign({}, opts.env);
	const path = pathKey({env});

	opts.path = env[path];
	env[path] = module.exports(opts);

	return env;
};


/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 632:
/***/ (function(module) {

module.exports = [["a140","",62],["a180","",32],["a240","",62],["a280","",32],["a2ab","?",5],["a2e3","??"],["a2ef","??"],["a2fd","??"],["a340","",62],["a380","",31,"　"],["a440","",62],["a480","",32],["a4f4","?",10],["a540","",62],["a580","",32],["a5f7","?",7],["a640","",62],["a680","",32],["a6b9","?",7],["a6d9","?",6],["a6ec","??"],["a6f3","?"],["a6f6","?",8],["a740","",62],["a780","",32],["a7c2","?",14],["a7f2","?",12],["a896","?",10],["a8bc","?"],["a8bf","?"],["a8c1","????"],["a8ea","?",20],["a958","?"],["a95b","?"],["a95d","???"],["a989","??",11],["a997","?",12],["a9f0","?",14],["aaa1","",93],["aba1","",93],["aca1","",93],["ada1","",93],["aea1","",93],["afa1","",93],["d7fa","?",4],["f8a1","",93],["f9a1","",93],["faa1","",93],["fba1","",93],["fca1","",93],["fda1","",93],["fe50","???????????????????????????????????????????????"],["fe80","?????????????????????????",6,"??",93]];

/***/ }),

/***/ 649:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getLastPage

const getPage = __webpack_require__(265)

function getLastPage (octokit, link, headers) {
  return getPage(octokit, link, 'last', headers)
}


/***/ }),

/***/ 654:
/***/ (function(module) {

// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
]

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  )
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  )
}


/***/ }),

/***/ 663:
/***/ (function(module) {

module.exports = [["0","\u0000",127,"?"],["8140","??????丗??両?並???丱???丼??乂????乕乗??乢??????",5,"??",9,"?",6,"?亊"],["8180","???亙亜?亞???亰??亶????????仏??????????仭仮??????仼?伀?",6,"???",4,"伜伝???????????伹??",4,"??佇",5,"??佖??????????併?????????來?侊???侒??侖侘?侚???価?"],["8240","?侫侭?",4,"侶",8,"??係???俉??俍?",4,"?俛??俤俥??????俵俶?????俿",11],["8280","個??們??倖???倞?倢倣値?倫?",10,"???偀?偂??偆偉???偐",4,"偖?????",7,"?",5,"?",8,"偸???偽???????????",20,"????傭",4,"傳",6,"?"],["8340","?",17,"?",5,"?僘??",10,"????????僴?",4,"?",9,"?"],["8380","儉??",5,"?",13,"?",28,"?兇兊兌兎?児兒??????",4,"?兤??兩兪???????円?冊??冏冐冑冓???冝????冦",4,"??冴???冾????凅??凍???",5],["8440","???凜?????",5,"凬?凱???凾刄??刋????刔刕??????別?刧刪????????剄",5,"剋?剏?????"],["8480","??剛????剣剤??????剰剱剳",9,"??劃",4,"劉",6,"劑劒劔",6,"劜??劦??劯?労",9,"勀勁??勅????勍?????動勗務",5,"勠?勢勣?",10,"?",7,"???匁匂??匇?????"],["8540","??????????匤???????匯",9,"??區??卆??卍?協単????????卲??卻???????????"],["8580","?",4,"厖?????厠??????厭?",6,"????????參",4,"収???????叝?叡叢??叺??????吋???????????吶??吽??呂???呉??呎?呑??",4,"????",7,"???????????咊?????咜????"],["8640","咢咥??咲?????咼咾?????哘??",4,"??????",5,"?????唄???",4,"???",5,"???????"],["8680","????????唸唹???啀?啅???",4,"??啓?啗",4,"啝????啣????",5,"?????喆?????????喚?喞?",6,"喨",8,"??営????",4,"?嗇????????",4,"????????????",4,"?????"],["8740","嘆?????",7,"??????????嘩???嘯????嘸?????",11,"?",4,"???噛?",4],["8780","??????????噴??噸?噺?",7,"嚇",6,"???嚔",14,"?",10,"?",6,"?????",12,"?",8,"??囘??団?",5,"?囮?囲図?????圀????國",6],["8840","園",9,"???????圦圧????",4,"????????????",4,"?坙??坥?????????????坿?"],["8880","??垈垉??",4,"?",6,"??????垪垬?垰?垳????",8,"?",6,"????埓埖??埜???埣?",7,"???????執?埼?????堅??堊?????????????堝????",4,"?",4,"報??場?",7],["8940","?",5,"?",6,"???塒???塗塙",4,"?",5,"?",4,"?",16,"?????????"],["8980","?",4,"?",4,"?墜??",7,"?",17,"?墾??????",10,"?壓??",13,"壥",5,"?壯壱売??壷?壺",7,"????",4,"?夐????夘夛????夢???夬?夲????"],["8a40","?夾????????奐?奓?奛",4,"?奣??",12,"????????????????????妛?妝?????"],["8a80","?妬????",5,"妺???",6,"??姉??????姙??",4,"?姦??姪姫?",11,"??????????????????娚??????????",6,"?娵?",4,"???婁",4,"???",9,"?????",5],["8b40","????婦???",8,"???????",17,"?",6,"?",13,"??"],["8b80","?",4,"????",4,"???",5,"?嫋?",4,"??嫗?????????????",4,"?",22,"?",11,"?",25,"??嬶?",7,"?",6],["8c40","?",7,"?孖?????孫???????學????????宍??????実?????宮???????寀?寃?寉?????"],["8c80","?寔",8,"?寢?實寧審",4,"??",6,"?対?専?尅將專尋?對導??尓???尞?尠???尨???尭??????????屆??屍?屓??????????層?",6,"??",6,"??????",4,"?????????",4,"?",4],["8d40","??????岶?岺岻岼岾???峅",5,"?",5,"?",5,"?",6,"???峩???峯?",9,"?",4],["8d80","????",5,"?",4,"崕崗崘崙崚??崟",4,"??????",4,"?",7,"?",7,"???",10,"??嵜?",10,"?嵭????嵳?",12,"?",21,"??????"],["8e40","?",21,"嶸",12,"?",6,"?",12,"???巣????"],["8e80","?巵??",4,"??????帋??????",7,"?",4,"帯帰?",4,"????幀?幃?",5,"?",6,"?",4,"??幟?幣",14,"幵?幹幾庁?広???????????????",4,"?",4,"??????",6],["8f40","??廈?",5,"?????廚?",11,"廩?",8,"?廸?廻廼????弉弌弍?弐?弔弖?????弡???"],["8f80","??????",6,"??弾?彁",14,"彑?彙??彜?????彧?彫??????????彿徃????徑従?????從?徠?",5,"復???",5,"??徹???",4,"??????????応忞?????????忰?????????"],["9040","????怐??????????????",4,"?",4,"????",6,"????????????恟恠?恥?????恵恷??"],["9080","悁?悅???悊悋??????悗????????悧悩悪??悳悵悶???悽",7,"惇???",4,"?惓?????惞惡",4,"?惱惲?惷?惻",4,"?愃???????",4,"????愛???愡??愨??愬",18,"?",6],["9140","慇?態慍???慓??",6,"?慟??慣?慥??",6,"慱?慳慴慶?",18,"???",4,"?"],["9180","憖",6,"?",8,"?憫?",9,"?",5,"???懃",4,"應懌",4,"??",16,"?",13,"懶",8,"戀",5,"?戉戓戔??戝戞??戦?????戯戰?戲??戸",4,"?????"],["9240","??払?????",6,"??扨扱?????????抂抃?????",5,"抔?抜?択?抦?????????????????"],["9280","??拏拑?拝?拠拡?????拵???????????挌?????????挙??挧???????",5,"??挾挿???????????",7,"????捨?捫???捲??????????掃???????????",6,"採??掫??掲掵??掻??揀"],["9340","??揃???????????",6,"???",4,"??揮????揵??揺?????搆",4,"損????",5,"?????"],["9380","??搨???",5,"?",4,"??搾?摂???",6,"?????",4,"?",7,"?????",9,"?",6,"撃?撈",8,"撓???撚??撝?",4,"撥????撫??撲???撹撻???擁???",6,"???擔???據"],["9440","????擠擡擣?擧",24,"?",7,"?",7,"?",4,"?",8],["9480","?攣攤?",4,"攬?????攷????",4,"????敍敎????敗敘????????????????敵?數",14,"斈斉??斎???????????????斬??",7,"?????????????????",7,"旡????"],["9540","??????旻",4,"???昇?昉??????????昜昞???昤?????昮????",4,"?昿?時晄",6,"?????"],["9580","晙??晝晞?晢?晥晧晩",4,"??晳????????暁暃??暈暉???暎??????暘",4,"?",8,"?",4,"?",4,"???暸??暼?暿",25,"曚?",7,"???",5,"?曵?書曺曻曽??會"],["9640","?????朎朏???朖????朞?",5,"朧?朮???朶朷朸????朿杁??????????",4,"?杢杣杤杦????東??"],["9680","????????枅???枌???????????枠枡?枦枩????枴枹",7,"??",9,"???????柤?柧????柮?柵",7,"柾栁栂栃栄???????",4,"栞??栢",6,"栫",6,"栴???????桍?桒?",5],["9740","桜桝?桟??",7,"??",8,"???",7,"???梔???",9,"????????梱??梶??"],["9780","梹",6,"??",5,"棊??棏???棔?棗??",4,"棡??",9,"棯棲?????????椀??椄?",4,"椌椏??",11,"椡椢椣椥",7,"??????椶?????????",16,"楕??楙?楜?"],["9840","楡楢???楨?楪?業楯??",4,"??楽楾?榁??榊??榎",5,"?????",9,"???榮??榲????????"],["9880","榾榿??",7,"構槍???槓?",5,"?槝槞?",11,"?????",9,"??",9,"樋",11,"標",5,"?樢",5,"権樫??樮樰???樶",6,"?",4,"?橆橈",7,"?",6,"?"],["9940","?",4,"橢??橦",10,"橲",6,"???橾橿????",8,"??",4,"?",7,"?",5],["9980","??檪?",114,"???",6],["9a40","???????欸??欽??????????",11,"?",7,"?歩?",13,"???歿殀??"],["9a80","??????殕?殘??",4,"?",7,"殫",7,"??",6,"毀??毆",4,"?毎??毘??",4,"?",7,"毬?????????????",6,"氈",4,"??気????氣???????氷????氾氿?????",4,"?????"],["9b40","?汚汢?????",4,"?汳???決????????沍??沒?沖??沚????沢????????沺?況????????????"],["9b80","泙泚?泝??????????????????????????????洟",5,"??洩?????洶?洸????浄????????????浤????浬???????浹???",4,"???涇??????涖",4,"涜??涬????????",5,"??????"],["9c40","??淏?淒??淕?????????淨?淪???淲?淵?淸淺?",7,"?渇済渉渋??渓渕?渙減??渟?渦渧??測渮????"],["9c80","??渹?",7,"?",7,"????????湜???",10,"??湯",14,"満?溂????",4,"?",6,"???溝???????????????????溿??滄滅??滉?滌?????????滝???",5],["9d40","??滲???滷滸?",7,"??????",4,"?漑??",9,"?漢漣????漬??漲???",6,"漿?潁?"],["9d80","??潅?????",9,"??潛?潟???潤??",5,"潯潰????????",6,"?澆????",12,"?????",4,"?",10,"?澵???",5,"濁濃",5,"?",6,"?",10,"濟??濤?"],["9e40","?",7,"?",32,"?",7,"?",6,"?",6],["9e80","?",9,"????",17,"???",13,"?",11,"?????????災???????????????????",12,"?????為???????烋",12,"?"],["9f40","?烝?????????",6,"?????",10,"?",4,"??焔??",10,"?",7,"???"],["9f80","??",13,"煆煇?煉???",12,"??",4,"煥煩",4,"???????????",5,"?",4,"????????熕???",4,"?",6,"????",5,"?????",8,"?",9,"?",4],["a040","?",9,"????燦?",5,"?",9,"?",11,"?",19],["a080","爛??",9,"??爭??爲??爺爼爾牀",6,"??牋????????牘???????????????牴?????牽犂??",4,"?????",11,"犠",11,"?犱犲???",6,"?狆?????????????狛"],["a1a1","　、。・??¨〃々?～?…‘’“”〔〕〈",7,"??【】±×÷?∧∨∑?∪∩∈?√⊥∥∠⌒?∫∮≡??∽∝≠????∞∵∴♂♀°′″℃＄?￠￡‰§№☆★○●◎◇◆□■△▲※→←↑↓〓"],["a2a1","ⅰ",9],["a2b1","?",19,"?",19,"①",9],["a2e5","?",9],["a2f1","Ⅰ",11],["a3a1","！＂＃￥％",88,"￣"],["a4a1","ぁ",82],["a5a1","ァ",85],["a6a1","Α",16,"Σ",6],["a6c1","α",16,"σ",6],["a6e0","????????????"],["a6ee","?????"],["a6f4","??"],["a7a1","А",5,"ЁЖ",25],["a7d1","а",5,"ёж",25],["a840","????―‥????????∟?≒≦≧⊿?",35,"?",6],["a880","?",7,"???▼▽??????〒〝?"],["a8a1","?a?a?e?e?i?i?o?o?u?u????ue?"],["a8bd","??"],["a8c0","?"],["a8c5","?",36],["a940","?",8,"?㎎㎏㎜㎝㎞㎡㏄?????￢￤"],["a959","℡㈱"],["a95c","‐"],["a960","ー゛゜ヽヾ〆ゝゞ?",9,"?????",8],["a980","?",4,"????"],["a996","〇"],["a9a4","─",75],["aa40","???狢",5,"????狹狽?????",5,"???????????猟??猤????猯????猶?????",8],["aa80","????獎獏??????",7,"?",10,"?獰?"],["ab40","獲",11,"?",4,"??????????????????????",5,"??????????玽????",4],["ab80","??珎珒",6,"???????珣???珪??珮??珱?",4],["ac40","珸",10,"?琇??????",8,"?",5,"???琩????琲?",4,"??琿??",11],["ac80","?",6,"???瑠",12,"?瑯?",4,"???"],["ad40","?????????璉?????",10,"?璟",7,"?",15,"?",12],["ad80","?",9,"?",8,"????瓧",6,"瓰瓱瓲"],["ae40","??瓸",6,"?甁?甃甅",7,"甎???甕????甞?",4,"甦??????甼?????畄畆?畉畊畍?畑??????"],["ae80","畝",7,"畧?畩畫",6,"畳?當畷?",4,"??疂??疇"],["af40","?疉疊??疎?????????",4,"?????????????????痙???????痩????痲痳????痺??痾????"],["af80","?瘉瘋瘍???????????瘡?瘧??????????瘻??療?"],["b040","?",6,"?",5,"??",4,"???癡癢?",6,"癬??癰",7,"?発發?皀?皃??????皐?????皚皛"],["b080","皜",7,"?",8,"?皰??",9,"??盃?阿埃挨??哀?癌?矮艾碍?隘鞍?安俺按暗岸?案?昂?凹敖熬??傲奥懊澳芭捌?叭?笆八?巴拔跋?把耙?霸??白柏百?佰?拜稗斑班搬?般?板版扮拌伴瓣半??邦??榜膀?棒磅蚌?傍?苞胞包褒剥"],["b140","?????????盜?盞?",4,"?",7,"??????盻????????県?",10,"眛??眞??眤眥???"],["b180","???",4,"????????睆?",7,"?",7,"?薄雹保堡?宝抱?暴豹?爆杯碑悲卑北?背??倍???焙被奔?本笨崩????迸逼鼻比鄙?彼碧蓖蔽??毖?庇??敝弊必辟壁臂避陛鞭???扁便?卞辨??遍?彪?表????彬斌????兵冰柄丙秉?炳"],["b240","?????????",11,"???????",5,"???",11,"??????瞭?????瞶",4],["b280","瞼??",12,"?",8,"??矚?",4,"?病并玻菠播??波博勃搏?箔伯帛舶?膊渤泊?捕卜哺?埠不布?簿部怖擦猜裁材才???采彩菜蔡餐参蚕残?惨?????藏操?槽曹草?策?册???插叉?茶???察岔差?拆柴豺??蝉???????昌猖"],["b340","???矯?????????矼?",5,"??????砕???砠砡????????砲????砿?????????????????"],["b380","???",11,"硯",7,"??硺??",6,"??常???厂敞?唱倡超抄?朝嘲潮??炒??撤掣?澈?臣辰?晨忱??趁??称城橙成呈乘程?澄?承逞?秤吃痴持匙池?弛?耻?侈尺赤翅斥?充冲虫崇?抽酬畴?稠愁?仇??丑臭初出?厨躇???除楚"],["b440","??碆???????碕?????????",7,"碵???確?碼??????磆??????磑?????磚",9],["b480","???磧????",4,"??????",5,"????",6,"??矗?触?揣川穿椽?船喘串?窗幢床??吹炊捶?垂春椿醇唇淳?蠢戳?疵茨磁雌辞慈瓷?此刺?次?葱?匆从??粗醋簇促???摧崔催脆瘁粹淬翠村存寸磋撮搓措挫?搭?答?打大呆歹?戴?殆代?袋待逮"],["b540","?",5,"?",9,"?",4,"?",14,"?",4,"??????祇?",8,"?祕????"],["b580","????????",6,"??",4,"????????禍禎???怠耽担丹???胆旦?但?淡??蛋当?党?档刀?蹈倒?祷?到稻悼道盗德得的?灯登等???堤低滴迪?笛狄??嫡抵底地蒂第帝弟??????点典???佃甸店?奠淀殿??雕凋?掉吊??跌??蝶迭??"],["b640","?",6,"禛",11,"?",10,"?",4,"?禿???????????????",5,"?秡????"],["b680","秬??",6,"?????????稈????",4,"??稘稙?稜丁?叮??鼎?定???冬董????恫?洞兜抖斗?豆逗痘都督毒?独?堵睹?杜?肚度渡?端短?段断?堆?????蹲敦???盾遁??多?????舵?惰堕蛾峨?俄??娥?厄扼遏鄂?恩而儿耳???二"],["b740","?稟???",14,"?????稾穀",5,"?",9,"?",4,"?",16],["b780","穩",6,"??????穽???????????窓??????????筏伐乏?法?藩帆番翻樊??繁凡?反返范?犯?泛坊芳方肪房防妨???放菲非??肥匪?吠肺?沸?芬?吩氛分??焚汾粉??忿???封?蜂峰???烽逢???奉?佛否夫敷?孵扶拂?幅?符伏俘服"],["b840","???窩窪?窮",4,"?",10,"?",10,"?",9,"??竚?竜竝竡竢?竧",5,"?竰???"],["b880","?",4,"?????笂???????????笘??????????浮?福袱弗甫??俯釜斧脯腑府腐赴副覆??傅付阜父腹?富?附??咐???改概?盖?干甘杆柑竿肝赶感?敢????缸肛??港杠?皋高膏羔???稿告哥歌?戈???割革葛格蛤?隔?个各?根跟耕更庚羹"],["b940","????笵笶?笹???",5,"筆筈?筍??????????",10,"?筰?筴??筺???????箆",6,"?箏"],["b980","?箒??箘箙箚?箞箟?????????????",7,"??範?耿梗工攻功恭?供躬公?弓?汞拱?共?勾?苟狗垢???辜菇?箍估沽孤姑鼓古?骨谷股故?固雇刮瓜?寡挂褂乖拐怪棺?官冠?管?罐?灌?光广?瑰?圭硅????鬼?癸桂?跪????棍?郭国果裹?哈"],["ba40","??築?篋??篏???",4,"????篠??篤??篩??篭???",4,"??????",7,"???簍??",5,"簗??"],["ba80","?",4,"?",5,"??簫",12,"?",5,"?骸孩海?亥害?酣?邯?含涵寒函喊罕翰撼捍旱憾悍?汗??杭航壕?豪毫?好耗号浩呵喝荷?核禾和何合盒貉?河涸赫褐???黑痕很狠恨?亨横衡恒?哄?虹?洪宏弘?喉侯猴吼厚候后呼乎忽瑚?葫胡蝴狐糊湖"],["bb40","籃",9,"?",36,"籵",5,"籾",9],["bb80","??",6,"?????粛?粡??粧粨?粫?粭???",4,"??弧虎??互??花??猾滑画?化?槐徊?淮坏??桓???患??豢??宦幻荒慌黄?蝗簧皇凰惶煌晃幌恍?灰??徽恢蛔回?悔慧卉惠晦??会??????昏婚魂?混豁活?火?或惑霍????基机畸稽?箕"],["bc40","?糀糂?????糎",6,"糘???糞?",6,"?",5,"?",7,"?糺?",13,"紋",5],["bc80","?",14,"紡???????紬?紮細",6,"肌?迹激?????吉?棘?籍集及急疾汲即嫉??几脊己?技冀季伎祭?悸?寄寂??既忌?妓??嘉枷?佳家加???甲?假稼价架?嫁???尖??煎兼肩?奸???柬??????剪?荐??践???箭件"],["bd40","?",54,"?",7],["bd80","?",32,"健??????建僵姜将?江疆蒋???匠?降蕉椒礁焦?交郊???嚼????脚狡角???剿教酵??叫窖?接皆?街?截劫?桔杰捷睫竭??解姐戒藉芥界借介疥?届巾筋斤金今津襟??????晋禁近?浸"],["be40","継",12,"?",6,"綯",42],["be80","線",32,"尽??兢茎睛晶?京?精粳?井警景?静境敬?径?靖竟??炯窘?究?玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居?菊局咀矩?沮聚拒据巨具距踞??句惧炬?捐?娟倦眷卷??攫抉掘倔爵?决??均菌??君峻"],["bf40","緻",62],["bf80","縺?",4,"?",4,"?",21,"俊竣浚郡?喀??咯?揩楷?慨刊堪勘坎?看康慷糠扛抗亢?考拷?靠?苛柯???科?咳可?克刻客?肯???坑吭空恐孔控?口扣寇枯哭窟苦酷??夸??跨胯???快?款匡筐狂框???况????葵奎魁傀"],["c040","繞",35,"纃",23,"纜??"],["c080","??????????????",6,"??",9,"???愧?坤昆?困括?廓??拉喇??辣?莱来??婪?????????????琅榔狼廊郎朗浪??牢老?姥酪烙?勒?雷?蕾磊累儡?擂肋?泪?楞冷厘梨犁黎?狸?漓理李里?礼莉?吏栗??励??利?例俐"],["c140","??????罠?",4,"罫???罰?罵?罷罸??????羂",7,"???",4,"?",4,"????羣??羨",6,"?"],["c180","?",4,"???????翆??????",4,"???",5,"??痢立粒?隶力璃哩?????廉怜?????恋??粮凉梁粱良??量?亮?撩聊僚?燎寥?潦了??廖料列裂烈劣?琳林?霖???淋凛?吝?玲菱零??伶羚凌?陵???令溜琉榴硫?留?瘤流柳六????窿"],["c240","????翫?????",6,"?????????????????耡???",5,"???????????????????聖?"],["c280","??",13,"?",5,"聲",11,"隆???楼???漏陋芦???炉????麓碌露路?鹿?禄??戮????旅履屡???律率??????卵乱掠略????????螺?????裸落洛???麻?????嘛?埋?麦??脉??蛮?蔓曼慢漫"],["c340","聾??肅???",5,"?????????肬?????????",4,"?",6,"?????????????????脅脇脈?"],["c380","????脛???",12,"???脳???脹",4,"??芒茫盲氓忙莽猫茅?毛矛?卯茂冒帽貌???枚梅??煤没眉媒??美昧寐妹媚???萌蒙檬盟?猛梦孟??靡糜迷?弥米秘?泌蜜密?棉眠?冕免勉娩?面苗描?藐秒渺?妙蔑?民?皿敏??明螟??名命?摸"],["c440","?",5,"???腎??????",4,"????腦??腫???????腸?膃",4,"???????",5,"?膚?",4,"膤?"],["c480","?膩?",7,"?",5,"?膽膾膿???臈臉?臍",6,"??模膜磨摩魔抹末莫墨默沫漠寞陌?牟某拇牡?姆母墓暮幕募慕木目睦牧穆拿???那娜??乃?耐奈南男?????????内嫩能?霓倪泥尼??匿?逆溺?拈年碾?捻念娘??尿捏?????涅???凝?"],["c540","?",14,"?臥?臨???",4,"?",5,"???與",4,"舎????",5,"??????舩舮?????"],["c580","艀???????????",7,"艙??艝??",7,"???牛??????弄奴努怒女暖虐??懦糯?哦欧?殴藕?偶???爬?怕琶拍排牌徘湃派攀潘?磐?畔判叛??旁?胖抛咆?炮袍?泡?胚培裴?陪配佩沛?盆??烹澎彭蓬棚硼篷膨朋?捧??砒霹批披劈琵?"],["c640","艪艫??艱?艶艷艸??????????????????????????芻?????苅????苙???苧????????苳???"],["c680","苺?",4,"??????茖茘??",9,"????茲????脾疲皮匹痞僻屁譬篇偏片??漂瓢票?瞥???品聘?坪苹萍平凭瓶?屏坡??婆破魄迫粕剖??仆?葡菩蒲埔朴圃普浦?曝瀑期欺栖戚妻七凄漆??其棋奇?畦崎??旗祈祁?起?乞企?契砌器气迄弃汽泣??"],["c740","?????荅?荊",4,"??",4,"?荢?",6,"???",6,"莇?莊????????莖??莚?莟?",6,"???"],["c780","?莵???????????菎???菓????????????菫??恰洽????千??仟?乾黔??前潜遣浅??嵌欠歉??腔羌????橇?敲悄????巧鞘??峭??切茄且怯窃?侵?秦琴勤芹擒禽寝沁青???卿清擎晴?情?????秋丘邱球求囚酋泅?区蛆曲躯屈?渠"],["c840","?華?",4,"?菻??????萇?????",5,"????",5,"萩",7,"?",5,"????",7,"?葈葉"],["c880","?",6,"?",4,"?????葢?",4,"?葮葯???葷葹??取娶?趣去圈???泉全痊拳犬券?缺??却???雀裙群然燃冉染?壤攘?????惹?壬仁人忍?任?刃妊??仍日戎茸蓉?融熔溶容?冗揉柔肉茹蠕儒孺如辱乳汝入褥?阮蕊瑞???若弱撒洒?腮?塞?三?"],["c940","?",4,"?蒄?????",7,"?????蒟??",12,"??????蒻蒼?????蓆??蓋???????"],["c980","?",4,"?????",4,"?蓮??",10,"??蔀???散桑?????嫂瑟色?森僧莎砂?刹沙?????晒珊苫杉山?煽衫??擅?膳善汕扇???商??上尚裳梢?稍?芍勺韶少哨邵?奢?蛇舌舍赦?射??社??申呻伸身深娠?神沈??甚?慎?声生甥牲升?"],["ca40","?",8,"?????蔔蔕?蔘???????",8,"蔭",9,"?",4,"????蕋",10],["ca80","蕗蕘蕚????",4,"???蕩",8,"???蕷????薀?省盛剩???失?施湿?尸虱十石拾?什食???史矢使屎?始式示士世柿事拭誓逝?是嗜噬?仕侍??氏市恃室??收手首守寿授售受??蔬枢梳殊抒?叔舒淑疏??孰熟薯暑曙署蜀黍鼠属?述?束戍?墅庶数漱"],["cb40","???薈",6,"薐",10,"?",6,"?薦?薩薫薬??",5,"?薺",6,"?",6,"?",4,"??"],["cb80","??",5,"藝",6,"藥???藪",14,"恕刷??衰??栓?霜双爽?水睡税吮瞬?舜??朔?斯撕嘶思私司?死肆寺嗣四伺似?巳松???送宋??搜艘?嗽?酥俗素速粟?塑溯宿??酸蒜算?隋随?髓碎?穗遂隧祟??笋蓑梭唆??索?所?他它?塔"],["cc40","藹藺??藾?",4,"蘆",10,"?蘓??蘗",15,"??",13,"?????蘿?"],["cc80","?",11,"??處",4,"?虜?號???",7,"???踏胎苔抬台泰?太?汰??????檀痰潭??坦毯袒?探?炭?塘?堂棠?唐糖??淌??掏涛滔?萄桃逃淘陶?套特藤?疼?梯剔??提?蹄啼体替嚏惕涕剃?天添填田甜恬?腆挑条迢眺跳??帖?听?"],["cd40","????",6,"?",6,"?",4,"??",5,"?",4,"??蚫????????",4,"??????蛍???????"],["cd80","???????????蛬蛯????蛻??????蜆?????蜑??汀廷停亭庭挺艇通桐?瞳同??童桶?筒?痛?投?透凸?突?徒途?屠土吐兔湍?推?腿?褪退?屯臀?托脱?陀???妥拓唾?哇蛙?娃瓦?歪外豌弯湾玩?丸?完碗挽?皖?宛婉万腕汪王亡枉网往旺望忘妄威"],["ce40","?????????????????????????",6,"?蝋??????蝕???",5,"??蝦",7,"?????"],["ce80","?蝸??蝿?????????",4,"????",6,"?",4,"巍微危????唯惟????萎委??尾?未蔚味畏胃?魏位渭?尉慰?瘟温蚊文??吻?紊??翁瓮????我斡?握沃巫?????屋无?梧吾?毋武五?午舞伍侮?戊?晤物勿?悟?昔熙析西??晰?吸??"],["cf40","??????????????螻????",4,"蟇???",4,"?",6,"???????????????蟯",9],["cf80","?蟻???????",5,"?",7,"??????",4,"蠣稀息希悉膝夕惜熄?溪汐犀檄?席??喜?洗系隙??瞎?匣霞?暇峡侠狭下厦夏?掀?先仙??咸??舷?涎弦嫌???献?腺?羡?陷限?相??香箱襄湘?翔祥?想?享?巷橡像向象?硝霄削哮??消宵淆?"],["d040","?",13,"?",5,"?蠻????衂?衆",5,"?",5,"????",6,"????????衵????"],["d080","????????????????袗",4,"?",4,"??",5,"小孝校肖?笑效楔些歇蝎鞋?挟携邪斜??写械卸蟹懈泄??屑薪芯?欣辛新忻心信?星腥猩惺?刑型形?行醒幸杏性姓兄凶胸匈?雄熊休修羞朽嗅?秀袖?墟戌需虚嘘?徐?蓄?叙旭序畜恤絮婿???喧宣?旋玄"],["d140","?袮?袰?",4,"??????袿?裃裄??????裏??????",4,"?裡???",6,"裲裵????製????",5],["d180","??",4,"??",4,"褜",4,"??????????????????眩?靴薛学穴雪血?熏循旬???巡殉????迅?押??呀?芽牙?崖衙涯雅???焉咽?烟淹??研蜒岩延言??炎沿奄掩眼衍演?堰燕??雁?彦?宴??殃央?秧??佯?羊洋??仰痒??漾邀腰妖瑶"],["d240","褸",8,"?襃?",24,"襠",5,"?",19,"?"],["d280","?襾????覇",26,"??遥??姚咬??要耀椰噎耶?野冶也?掖?叶曳腋夜液一壹医揖?依伊衣?夷?移??疑沂宜姨彝椅?倚已乙矣以?抑易邑屹?役臆逸肄疫亦裔意毅??益溢?????翼翌?茵?因殷音?姻吟?淫寅?尹引?"],["d340","?",30,"?????????觝?????觧?????????觴",6],["d380","?",4,"?",5,"計",21,"印英??????????迎?盈影?硬映?????庸雍踊蛹咏泳涌永?勇用幽?悠?尤由??犹油游酉有友右佑釉?又幼迂淤于盂?虞愚?余?逾?愉渝?隅予?雨与?禹宇?羽玉域芋郁吁遇?峪御愈欲?育誉"],["d440","?",31,"?",8,"?",21],["d480","?",25,"?",6,"浴寓裕?豫??渊冤元垣袁原援????猿源??苑愿怨院曰?越??岳粤月悦?耘云?匀?允????韵孕匝??栽哉?宰?再在??????葬遭糟?藻?早澡蚤躁噪造皂?燥?????怎增憎曾?扎?渣札?"],["d540","?",7,"?",7,"?",46],["d580","?",32,"?????咋乍炸?摘?宅窄?寨瞻?詹粘沾????展??占?站湛?樟章彰??掌?杖丈??仗?瘴障招昭找沼?照罩兆肇召遮折哲??者?蔗?浙珍斟真甄砧臻???枕疹?震振??蒸??征?争?整拯正政"],["d640","諤",34,"?",27],["d680","???",30,"?症??芝枝支?蜘知肢脂汁之??直植殖???址指止趾只旨?志??至致置?峙制智秩稚?炙痔滞治窒中?忠?衷???重仲?舟周州洲?粥?肘帚咒?宙昼?珠株蛛朱猪??逐竹?煮??嘱主著柱助???筑"],["d740","?",31,"?",4,"?",25],["d780","?",24,"????????住注祝?抓爪????撰?篆?庄装?撞壮状椎?追????准捉拙卓?琢茁酌啄着灼??咨?姿滋?孜紫仔?滓子自?字?棕踪宗????走奏?租足卒族祖?阻??纂嘴醉最罪尊遵昨左佐柞做作坐座"],["d840","?",8,"????豈豊??",7,"?????",5,"?",6,"豬",6,"?????",6,"????"],["d880","??貍",6,"????",20,"??兀丐廿卅丕亘丞鬲??丨禺丿匕?夭爻卮??胤馗毓睾?丶亟?????孛??仄???厥厮??匚?????卦??刈刎?刳??剌剞???剽????冂罔???仂?仡?仞???????伉?佞?攸佚佝"],["d940","貮",62],["d980","賭",32,"?佗?伽佶?侑?侃侏?佻?佼?侔????俚俣?俑俟俸倩?俳倬倏?倭俾??倥倨?偃偕偈?偬?????僖?僭??僮??仝???俎龠??兮巽?馘??勹匍?匐?夙?亠?亳?袤???禀??羸冫冱冽?"],["da40","?",14,"????????????赱??",8,"???????",4,"???",9,"??"],["da80","??",12,"????????跂???????????冖冢冥???????????????????????????????????????????????????????????卩???阡?阪??陂??陟?陬陲?隈隍隗隰??????????"],["db40","?????跡????????????跼?",6,"??踈???踐????",7,"???",4,"??踰??踴??????"],["db80","????蹌",4,"?",5,"?",11,"??????邸?????????郢??郛???????????????劬劭劾哿???叟燮矍廴凵?鬯厶弁畚????塾?壅壑????????圻坂坩??????????垤?????垓垠????埒?埴????"],["dc40","???",4,"?????躄??",6,"躑?躓?",6,"??",11,"??躰躱?",6,"?",7],["dc80","?",10,"軏",21,"堋???堀?堙????????馨?懿??????????芙芫芸????苣??????????芟???苡茉????苜苴苒??苻苓??茆????茜??????茴茱??茯荏???荀茗??????"],["dd40","?",62],["dd80","?",32,"???????????莠莪莓?莅荼????荻?莞莨??菁??菘??萋?菽菖?萸???菟?萃???菅??菰????????葺??萼葆葩???萱葭蓁蓍蓐???蓊蒿??蒡蒹蒴????甍???蔟?"],["de40","轅",32,"???????????辧??辭辮辯農???辷?辺辻込辿???"],["de80","?",4,"????迚?????迯??迴??迺???????逎逓逕???蓿蓼蕙蕈蕨????蕃??薤薨薇??薮薜?薹?薰?藁藜????蘖?廾????奕奚奘匏尢??????抻拊?拗拮?拶????揶?捺掎掴?掬?捩??????揄???揆掾??????搦?????"],["df40","這?連??逧",5,"?",4,"?逹?????遅??",4,"過達違遖遙?遜",5,"??遧適???遯",4,"遶",6,"?邁"],["df80","還??邇邉邊?",4,"????????????邨?????????摺????????擢???弋??弑?叱?叩叨?????????????????呷呱???咄呶????哂???????????????咩?咤??????哽唔???唏?????????????"],["e040","???????????????郞???郤?????????郵?郷?????????",19,"???"],["e080","?????",10,"鄰鄲",6,"?",8,"??啖???唳?啜喋?喃????喟啾??啻嗟???喙?嗷?????嗔??嗄????????嗤???????嗾???????????噌?嚆噤?噫??????囗????囹囿圄?圉圜?帙?帑???"],["e140","?????酔?酖酘??????????酳????",4,"??????",6,"醜",5,"醤",5,"醫???????醸??"],["e180","?",10,"釈釋釐?",9,"針",8,"帷幄幔??幡岌??岐????岑?????岬岫岱??岷???????崧?????崛????嵬?嵯??嵋?嵩?嶂?嶝?嶷?彳彷徂徇?後?徙?徨徭?徼衢彡?????狃?狎?狒??狩??狷????"],["e240","釦",62],["e280","?",32,"?猗??猊?猝???猥?????獗????舛夥??夂??",5,"????????????????庖?庠?庵?????廛廨?膺??忖?????忤?????忸怙?怦怛怏?怩怫??怡????恂"],["e340","?",45,"?",16],["e380","?",7,"?",24,"恪?悖悚??悃悒悌悛????惘惆惚悴愠?愕?惴愀愎?慊慵憬憔憧???忝?????????????????????????爿???汜???沐?沌汨???沆??????泱泗??????沱泓泯?"],["e440","?",5,"?",24,"?",31],["e480","鋩",32,"??洌???洄洙?洫??洵????洳?浯???涓?浜??浣渚淇淅淞????淦?淙????渫湮湎湫溲湟????渥???溘???溥?溽?溷???溏滂溟????漕????潴?漉????潸?潼潺?"],["e540","?",51,"?",10],["e580","?",31,"???澹?濂濡濮?濠濯瀚?瀛????宀?宕?宥宸甯?搴寤寮?寰蹇謇???迥??迩迦??逅?逋?逑逍逖逡逵逶???遑遒遐遨遘??暹?遽邂?邃??彗彖?尻咫屐?孱????弩弭?弼鬻屮妁妃妍??妣"],["e640","鍬",34,"?",27],["e680","鎬",29,"???????妤?妲??妾????????娉??娑??婀???娼婢???媛??媾??????嫣?嫖嫦??嬉?嬖嬲?孀??孚孥孳孑?????????????????????????????????"],["e740","?",7,"鏗",54],["e780","?",32,"??????????????????????????????????????????",6,"?????",4,"?幺畿巛????????珂??玳珀珉珈珥?????珞???琪瑛琦琥??琮?"],["e840","?",14,"?",43,"????"],["e880","鑰",20,"??????????????瑁瑜?瑕瑙??瑾?????璋璞???璧??????杓杞???枇杪杳??杵???枋杷杼??柘?柩????柚枳柝??枸柢?柁?栲???桎?桄?梃???桁桧桀???栩梵梏桴桷梓??楮???棹"],["e940","????????????長",7,"門",42],["e980","?",32,"??椋椁?棣??椹楠?楝?楫?榘楸椴槌??槎???楹榛榧榻???榱槁槊?榕??槿?槭樗??槲橄?檠??樵檎?樽?橘??檐?檗?猷????殄??殍???殪??????????????????"],["ea40","闌",27,"?????????",6,"???阯??????????陏?????"],["ea80","???陜陝陞?陣陥陦??",4,"陳陸",12,"??隊????????戛戟?戡???臧????甑甓攴???昊?杲昃昕昀炅曷?昴昱昶昵耆晟?晁晏??晗?暄??暝暾?曜曦曩????????????????????????牝??牾?????犒挈??"],["eb40","?階???隕??際隝",9,"隨",7,"隱隲隴?隷隸?隻?????雋?雑??雖",9,"?",6,"雫"],["eb80","???雰?雲????電??????霊???霑????",4,"????擘耄?毳?????????????氤??攵敕??牒?爰????肓???肱?肭肴?????胛?胄胙???胝?胱胴????胼朕?豚???????腓腴??腱????????膈膂?滕膣??朦??"],["ec40","?",8,"?????霳",4,"?霻?霽?",18,"?靕???靜???靤靦?靨?",7],["ec80","???",4,"?",7,"鞆",4,"??鞏鞐?????",4,"???欷欹歃?歙??????殳???斐??於旆旄旃旌?旒?????炻??炫?????????煜?????????熨?燠燔燧燹?爨??煦熹???扈扉?祀?祉??祓祚祢祗祠??祺禅禊?禧禳??"],["ed40","?????",6,"????鞳?",46],["ed80","???韮",4,"??",23,"?恝恚?恁恙恣?愆愍慝憩?懋???聿沓?淼???????斫????砺???砥???硎???砦?????碓碚碇??碣???磔??磬??磴?????黹黻黼?眄??眇眈????眦?眸??睇?睚睨"],["ee40","頏",62],["ee80","顎",32,"?睥睿????瞑?瞠瞰?瞽町??畋?畛???罘?罟詈罨??罹??盍盥???????????????????????????",4,"?????",6,"??????????????????"],["ef40","顯",5,"??????風",37,"?????飛飜??",4],["ef80","??飩",30,"??????????????????????",4,"??????????????????????????????????????????",8,"?????矧?雉秕?秣??????稔"],["f040","?",4,"???",28,"?",26],["f080","?",9,"?",12,"???????????稷?黏馥穰皈皎皓皙??瓠甬???",4,"???????????????????????????",6,"????疔??疝?疣疳?疸?疱?痃痂?痍痣???????痼痿??????????"],["f140","???",10,"???",47],["f180","?",32,"??瘢瘠??瘰????????癜癖??翊竦?穹??窈窕????????衲衽衿袂袢?袷????????裼裨裾???褓?褊?褫褶襁襦?疋胥?皴矜耒??耜??????耨?耋??聆?聒??覃???"],["f240","?",62],["f280","?",32,"?????????????虍虔?????虻??蚋???蚣蚪蚓蚩蚶蛄?蛎蚰??蚯蛉??蛩??蛭???蛞?蛟??蜃?蛸蜈蜊蜍蜉?蜻?蜥?蜚??蜴?蜩蜷蜿螂????蝠?蝌蝮?蝓蝣??蝙??螯?蟒"],["f340","驚",17,"??????????",6,"??????????髄?",4,"??髏??體???髙??髜"],["f380","?髞?髢髣?????髪?髮?",8,"??",6,"??鬆蟆?????螫???螳蟋?螽?蟀???蟠?蠖?蟾??蠡蠹?缶??罅舐竺?笈?笄?笊?笏???笙??笠笥?笳?笞??筅筵筌筝?筮???筱???箸?箝??箪箜??箴?篁篌篝?篥篦???????"],["f440","??",5,"????",10,"??鬢?",10,"?鬱?",7,"????????魎????",5],["f480","?",32,"簟簪?簸?籀臾舁舂??衄??????舫舸?舳??????艚艟艨衾?袈裘裟襞羝??羯?羲??????粢粲?粽?????糅??艮???翕?翡翦翩?翳糸??綮?纛麸?赳????赧赭??酊?酎??"],["f540","?",62],["f580","鮻",32,"酢??酩???酲????醐醍?醢?醪??醯醵醴醺豕??跫?蹙????趺?跖?跚??跏跛????跣???踉??踝踟???????踵??蹉?蹂??蹊?蹶蹼?蹴躅?躔???豸貂貊貅貘貔斛??觚觜"],["f640","?",62],["f680","鰛",32,"????謦????霆?霈霏霎霪?霰霾???",5,"????隹隼?雎?瞿???????????????????????????",5,"?",4,"????",7,"??????????"],["f740","?",62],["f780","?????????????????????",4,"?????????",4,"??????????靼鞅????鞫鞣?鞴?骰????骼?髀????髑魅魃???魍魑??餮饕?髟?髦髯髫髻髭????鬟鬣?麾縻??麈麋麒鏖麝麟黛黜黝黠????黥?黯?鼬????鼾?"],["f840","?",62],["f880","?",32],["f940","?",62],["f980","?",32],["fa40","?",62],["fa80","?",32],["fb40","?",27,"?????????????????????????",9,"?"],["fb80","麁??????麌",5,"?",8,"??",5,"??麩麪"],["fc40","?",8,"???麹麺麼麿",4,"??????黌黐黒????黙?點????黨?????",8,"?黽?",6],["fc80","?",4,"?????鼕???",5,"鼡?",8,"????"],["fd40","?",4,"????",4,"?",10,"齒",38],["fd80","?",5,"??龍",11,"龜龝??",4,"?????"],["fe40","??﨎﨏﨑﨓﨔礼﨟蘒﨡﨣﨤﨧﨨﨩"]];

/***/ }),

/***/ 669:
/***/ (function(module) {

module.exports = require("util");

/***/ }),

/***/ 673:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var Buffer = __webpack_require__(293).Buffer;

// Note: UTF16-LE (or UCS2) codec is Node.js native. See encodings/internal.js

// == UTF16-BE codec. ==========================================================

exports.utf16be = Utf16BECodec;
function Utf16BECodec() {
}

Utf16BECodec.prototype.encoder = Utf16BEEncoder;
Utf16BECodec.prototype.decoder = Utf16BEDecoder;
Utf16BECodec.prototype.bomAware = true;


// -- Encoding

function Utf16BEEncoder() {
}

Utf16BEEncoder.prototype.write = function(str) {
    var buf = new Buffer(str, 'ucs2');
    for (var i = 0; i < buf.length; i += 2) {
        var tmp = buf[i]; buf[i] = buf[i+1]; buf[i+1] = tmp;
    }
    return buf;
}

Utf16BEEncoder.prototype.end = function() {
}


// -- Decoding

function Utf16BEDecoder() {
    this.overflowByte = -1;
}

Utf16BEDecoder.prototype.write = function(buf) {
    if (buf.length == 0)
        return '';

    var buf2 = new Buffer(buf.length + 1),
        i = 0, j = 0;

    if (this.overflowByte !== -1) {
        buf2[0] = buf[0];
        buf2[1] = this.overflowByte;
        i = 1; j = 2;
    }

    for (; i < buf.length-1; i += 2, j+= 2) {
        buf2[j] = buf[i+1];
        buf2[j+1] = buf[i];
    }

    this.overflowByte = (i == buf.length-1) ? buf[buf.length-1] : -1;

    return buf2.slice(0, j).toString('ucs2');
}

Utf16BEDecoder.prototype.end = function() {
}


// == UTF-16 codec =============================================================
// Decoder chooses automatically from UTF-16LE and UTF-16BE using BOM and space-based heuristic.
// Defaults to UTF-16LE, as it's prevalent and default in Node.
// http://en.wikipedia.org/wiki/UTF-16 and http://encoding.spec.whatwg.org/#utf-16le
// Decoder default can be changed: iconv.decode(buf, 'utf16', {defaultEncoding: 'utf-16be'});

// Encoder uses UTF-16LE and prepends BOM (which can be overridden with addBOM: false).

exports.utf16 = Utf16Codec;
function Utf16Codec(codecOptions, iconv) {
    this.iconv = iconv;
}

Utf16Codec.prototype.encoder = Utf16Encoder;
Utf16Codec.prototype.decoder = Utf16Decoder;


// -- Encoding (pass-through)

function Utf16Encoder(options, codec) {
    options = options || {};
    if (options.addBOM === undefined)
        options.addBOM = true;
    this.encoder = codec.iconv.getEncoder('utf-16le', options);
}

Utf16Encoder.prototype.write = function(str) {
    return this.encoder.write(str);
}

Utf16Encoder.prototype.end = function() {
    return this.encoder.end();
}


// -- Decoding

function Utf16Decoder(options, codec) {
    this.decoder = null;
    this.initialBytes = [];
    this.initialBytesLen = 0;

    this.options = options || {};
    this.iconv = codec.iconv;
}

Utf16Decoder.prototype.write = function(buf) {
    if (!this.decoder) {
        // Codec is not chosen yet. Accumulate initial bytes.
        this.initialBytes.push(buf);
        this.initialBytesLen += buf.length;
        
        if (this.initialBytesLen < 16) // We need more bytes to use space heuristic (see below)
            return '';

        // We have enough bytes -> detect endianness.
        var buf = Buffer.concat(this.initialBytes),
            encoding = detectEncoding(buf, this.options.defaultEncoding);
        this.decoder = this.iconv.getDecoder(encoding, this.options);
        this.initialBytes.length = this.initialBytesLen = 0;
    }

    return this.decoder.write(buf);
}

Utf16Decoder.prototype.end = function() {
    if (!this.decoder) {
        var buf = Buffer.concat(this.initialBytes),
            encoding = detectEncoding(buf, this.options.defaultEncoding);
        this.decoder = this.iconv.getDecoder(encoding, this.options);

        var res = this.decoder.write(buf),
            trail = this.decoder.end();

        return trail ? (res + trail) : res;
    }
    return this.decoder.end();
}

function detectEncoding(buf, defaultEncoding) {
    var enc = defaultEncoding || 'utf-16le';

    if (buf.length >= 2) {
        // Check BOM.
        if (buf[0] == 0xFE && buf[1] == 0xFF) // UTF-16BE BOM
            enc = 'utf-16be';
        else if (buf[0] == 0xFF && buf[1] == 0xFE) // UTF-16LE BOM
            enc = 'utf-16le';
        else {
            // No BOM found. Try to deduce encoding from initial content.
            // Most of the time, the content has ASCII chars (U+00**), but the opposite (U+**00) is uncommon.
            // So, we count ASCII as if it was LE or BE, and decide from that.
            var asciiCharsLE = 0, asciiCharsBE = 0, // Counts of chars in both positions
                _len = Math.min(buf.length - (buf.length % 2), 64); // Len is always even.

            for (var i = 0; i < _len; i += 2) {
                if (buf[i] === 0 && buf[i+1] !== 0) asciiCharsBE++;
                if (buf[i] !== 0 && buf[i+1] === 0) asciiCharsLE++;
            }

            if (asciiCharsBE > asciiCharsLE)
                enc = 'utf-16be';
            else if (asciiCharsBE < asciiCharsLE)
                enc = 'utf-16le';
        }
    }

    return enc;
}




/***/ }),

/***/ 674:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticate;

const { Deprecation } = __webpack_require__(692);
const once = __webpack_require__(969);

const deprecateAuthenticate = once((log, deprecation) => log.warn(deprecation));

function authenticate(state, options) {
  deprecateAuthenticate(
    state.octokit.log,
    new Deprecation(
      '[@octokit/rest] octokit.authenticate() is deprecated. Use "auth" constructor option instead.'
    )
  );

  if (!options) {
    state.auth = false;
    return;
  }

  switch (options.type) {
    case "basic":
      if (!options.username || !options.password) {
        throw new Error(
          "Basic authentication requires both a username and password to be set"
        );
      }
      break;

    case "oauth":
      if (!options.token && !(options.key && options.secret)) {
        throw new Error(
          "OAuth2 authentication requires a token or key & secret to be set"
        );
      }
      break;

    case "token":
    case "app":
      if (!options.token) {
        throw new Error("Token authentication requires a token to be set");
      }
      break;

    default:
      throw new Error(
        "Invalid authentication type, must be 'basic', 'oauth', 'token' or 'app'"
      );
  }

  state.auth = options;
}


/***/ }),

/***/ 675:
/***/ (function(module) {

module.exports = function btoa(str) {
  return new Buffer(str).toString('base64')
}


/***/ }),

/***/ 692:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

exports.Deprecation = Deprecation;


/***/ }),

/***/ 696:
/***/ (function(module) {

"use strict";


/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

module.exports = isPlainObject;


/***/ }),

/***/ 697:
/***/ (function(module) {

"use strict";

module.exports = (promise, onFinally) => {
	onFinally = onFinally || (() => {});

	return promise.then(
		val => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => val),
		err => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => {
			throw err;
		})
	);
};


/***/ }),

/***/ 703:
/***/ (function(module, __unusedexports, __webpack_require__) {

// content of context: https://developer.github.com/v3/activity/events/types/
const github = __webpack_require__(469);

const getIssueNumber = () => {
    const issue = github.context.payload.issue;
    if (!issue) {
        throw new Error("No issue provided");
    }
    return issue.number;
};
module.exports.getIssueNumber = getIssueNumber;

const getIssueFromContext = async (token) => {
    let octocat = new github.GitHub(token);
    const issueNum = getIssueNumber();

    const repo = github.context.repo;
    const issue = await octocat.issues.get({
        owner: repo.owner,
        repo: repo.repo,
        issue_number: issueNum,
    });
    
    return issue;
};
module.exports.getIssueFromContext = getIssueFromContext;

const getIssueCommentFromContext = () => {
    const comment = github.context.payload.comment;
    if (!comment) {
        throw new Error("No issue provided");
    }
    return comment;
} 
module.exports.getIssueCommentFromContext = getIssueCommentFromContext;

const checkKeywords = (keywords, body) => {
    const lowerBody = body.toLowerCase();
    for(let k of keywords) {
        if (lowerBody.toLowerCase().includes(k.toLowerCase())){
            return true;
        }
    }
    return false;
};
module.exports.checkKeywords = checkKeywords;

const createNewIssue = async (token, owner, repoName, title, body, assignees, labels, fromIssue) => {
    const octokit = new github.GitHub(token);
    if (!fromIssue) {
        throw new Error('fromIssue is not provided')
    }
    if (typeof body === 'string' && body !== '') {
        body = body + `\n\ncopiedFrom: ${fromIssue}`;
    }else {
        body = `copiedFrom: ${fromIssue}`
    }

    const res = await octokit.issues.create(
        {
            owner: owner,
            repo: repoName,
            title: title,
            body: body,
            assignees: assignees,
            labels: labels,
        }
    );
    return [res.id, res.number].join(':');
};
module.exports.createNewIssue = createNewIssue;

/***/ }),

/***/ 705:
/***/ (function(module) {

module.exports = {"activity":{"checkStarringRepo":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/user/starred/:owner/:repo"},"deleteRepoSubscription":{"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/subscription"},"deleteThreadSubscription":{"method":"DELETE","params":{"thread_id":{"required":true,"type":"integer"}},"url":"/notifications/threads/:thread_id/subscription"},"getRepoSubscription":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/subscription"},"getThread":{"method":"GET","params":{"thread_id":{"required":true,"type":"integer"}},"url":"/notifications/threads/:thread_id"},"getThreadSubscription":{"method":"GET","params":{"thread_id":{"required":true,"type":"integer"}},"url":"/notifications/threads/:thread_id/subscription"},"listEventsForOrg":{"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/events/orgs/:org"},"listEventsForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/events"},"listFeeds":{"method":"GET","params":{},"url":"/feeds"},"listNotifications":{"method":"GET","params":{"all":{"type":"boolean"},"before":{"type":"string"},"page":{"type":"integer"},"participating":{"type":"boolean"},"per_page":{"type":"integer"},"since":{"type":"string"}},"url":"/notifications"},"listNotificationsForRepo":{"method":"GET","params":{"all":{"type":"boolean"},"before":{"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"participating":{"type":"boolean"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"since":{"type":"string"}},"url":"/repos/:owner/:repo/notifications"},"listPublicEvents":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/events"},"listPublicEventsForOrg":{"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/events"},"listPublicEventsForRepoNetwork":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/networks/:owner/:repo/events"},"listPublicEventsForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/events/public"},"listReceivedEventsForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/received_events"},"listReceivedPublicEventsForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/received_events/public"},"listRepoEvents":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/events"},"listReposStarredByAuthenticatedUser":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"sort":{"enum":["created","updated"],"type":"string"}},"url":"/user/starred"},"listReposStarredByUser":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"sort":{"enum":["created","updated"],"type":"string"},"username":{"required":true,"type":"string"}},"url":"/users/:username/starred"},"listReposWatchedByUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/subscriptions"},"listStargazersForRepo":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/stargazers"},"listWatchedReposForAuthenticatedUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/subscriptions"},"listWatchersForRepo":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/subscribers"},"markAsRead":{"method":"PUT","params":{"last_read_at":{"type":"string"}},"url":"/notifications"},"markNotificationsAsReadForRepo":{"method":"PUT","params":{"last_read_at":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/notifications"},"markThreadAsRead":{"method":"PATCH","params":{"thread_id":{"required":true,"type":"integer"}},"url":"/notifications/threads/:thread_id"},"setRepoSubscription":{"method":"PUT","params":{"ignored":{"type":"boolean"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"subscribed":{"type":"boolean"}},"url":"/repos/:owner/:repo/subscription"},"setThreadSubscription":{"method":"PUT","params":{"ignored":{"type":"boolean"},"thread_id":{"required":true,"type":"integer"}},"url":"/notifications/threads/:thread_id/subscription"},"starRepo":{"method":"PUT","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/user/starred/:owner/:repo"},"unstarRepo":{"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/user/starred/:owner/:repo"}},"apps":{"addRepoToInstallation":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"PUT","params":{"installation_id":{"required":true,"type":"integer"},"repository_id":{"required":true,"type":"integer"}},"url":"/user/installations/:installation_id/repositories/:repository_id"},"checkAccountIsAssociatedWithAny":{"method":"GET","params":{"account_id":{"required":true,"type":"integer"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/marketplace_listing/accounts/:account_id"},"checkAccountIsAssociatedWithAnyStubbed":{"method":"GET","params":{"account_id":{"required":true,"type":"integer"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/marketplace_listing/stubbed/accounts/:account_id"},"checkAuthorization":{"deprecated":"octokit.oauthAuthorizations.checkAuthorization() has been renamed to octokit.apps.checkAuthorization() (2019-11-05)","method":"GET","params":{"access_token":{"required":true,"type":"string"},"client_id":{"required":true,"type":"string"}},"url":"/applications/:client_id/tokens/:access_token"},"checkToken":{"headers":{"accept":"application/vnd.github.doctor-strange-preview+json"},"method":"POST","params":{"access_token":{"type":"string"},"client_id":{"required":true,"type":"string"}},"url":"/applications/:client_id/token"},"createContentAttachment":{"headers":{"accept":"application/vnd.github.corsair-preview+json"},"method":"POST","params":{"body":{"required":true,"type":"string"},"content_reference_id":{"required":true,"type":"integer"},"title":{"required":true,"type":"string"}},"url":"/content_references/:content_reference_id/attachments"},"createFromManifest":{"headers":{"accept":"application/vnd.github.fury-preview+json"},"method":"POST","params":{"code":{"required":true,"type":"string"}},"url":"/app-manifests/:code/conversions"},"createInstallationToken":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"POST","params":{"installation_id":{"required":true,"type":"integer"},"permissions":{"type":"object"},"repository_ids":{"type":"integer[]"}},"url":"/app/installations/:installation_id/access_tokens"},"deleteAuthorization":{"headers":{"accept":"application/vnd.github.doctor-strange-preview+json"},"method":"DELETE","params":{"access_token":{"type":"string"},"client_id":{"required":true,"type":"string"}},"url":"/applications/:client_id/grant"},"deleteInstallation":{"headers":{"accept":"application/vnd.github.gambit-preview+json,application/vnd.github.machine-man-preview+json"},"method":"DELETE","params":{"installation_id":{"required":true,"type":"integer"}},"url":"/app/installations/:installation_id"},"deleteToken":{"headers":{"accept":"application/vnd.github.doctor-strange-preview+json"},"method":"DELETE","params":{"access_token":{"type":"string"},"client_id":{"required":true,"type":"string"}},"url":"/applications/:client_id/token"},"findOrgInstallation":{"deprecated":"octokit.apps.findOrgInstallation() has been renamed to octokit.apps.getOrgInstallation() (2019-04-10)","headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"org":{"required":true,"type":"string"}},"url":"/orgs/:org/installation"},"findRepoInstallation":{"deprecated":"octokit.apps.findRepoInstallation() has been renamed to octokit.apps.getRepoInstallation() (2019-04-10)","headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/installation"},"findUserInstallation":{"deprecated":"octokit.apps.findUserInstallation() has been renamed to octokit.apps.getUserInstallation() (2019-04-10)","headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"username":{"required":true,"type":"string"}},"url":"/users/:username/installation"},"getAuthenticated":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{},"url":"/app"},"getBySlug":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"app_slug":{"required":true,"type":"string"}},"url":"/apps/:app_slug"},"getInstallation":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"installation_id":{"required":true,"type":"integer"}},"url":"/app/installations/:installation_id"},"getOrgInstallation":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"org":{"required":true,"type":"string"}},"url":"/orgs/:org/installation"},"getRepoInstallation":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/installation"},"getUserInstallation":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"username":{"required":true,"type":"string"}},"url":"/users/:username/installation"},"listAccountsUserOrOrgOnPlan":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"plan_id":{"required":true,"type":"integer"},"sort":{"enum":["created","updated"],"type":"string"}},"url":"/marketplace_listing/plans/:plan_id/accounts"},"listAccountsUserOrOrgOnPlanStubbed":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"plan_id":{"required":true,"type":"integer"},"sort":{"enum":["created","updated"],"type":"string"}},"url":"/marketplace_listing/stubbed/plans/:plan_id/accounts"},"listInstallationReposForAuthenticatedUser":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"installation_id":{"required":true,"type":"integer"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/installations/:installation_id/repositories"},"listInstallations":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/app/installations"},"listInstallationsForAuthenticatedUser":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/installations"},"listMarketplacePurchasesForAuthenticatedUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/marketplace_purchases"},"listMarketplacePurchasesForAuthenticatedUserStubbed":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/marketplace_purchases/stubbed"},"listPlans":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/marketplace_listing/plans"},"listPlansStubbed":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/marketplace_listing/stubbed/plans"},"listRepos":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/installation/repositories"},"removeRepoFromInstallation":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"DELETE","params":{"installation_id":{"required":true,"type":"integer"},"repository_id":{"required":true,"type":"integer"}},"url":"/user/installations/:installation_id/repositories/:repository_id"},"resetAuthorization":{"deprecated":"octokit.oauthAuthorizations.resetAuthorization() has been renamed to octokit.apps.resetAuthorization() (2019-11-05)","method":"POST","params":{"access_token":{"required":true,"type":"string"},"client_id":{"required":true,"type":"string"}},"url":"/applications/:client_id/tokens/:access_token"},"resetToken":{"headers":{"accept":"application/vnd.github.doctor-strange-preview+json"},"method":"PATCH","params":{"access_token":{"type":"string"},"client_id":{"required":true,"type":"string"}},"url":"/applications/:client_id/token"},"revokeAuthorizationForApplication":{"deprecated":"octokit.oauthAuthorizations.revokeAuthorizationForApplication() has been renamed to octokit.apps.revokeAuthorizationForApplication() (2019-11-05)","method":"DELETE","params":{"access_token":{"required":true,"type":"string"},"client_id":{"required":true,"type":"string"}},"url":"/applications/:client_id/tokens/:access_token"},"revokeGrantForApplication":{"deprecated":"octokit.oauthAuthorizations.revokeGrantForApplication() has been renamed to octokit.apps.revokeGrantForApplication() (2019-11-05)","method":"DELETE","params":{"access_token":{"required":true,"type":"string"},"client_id":{"required":true,"type":"string"}},"url":"/applications/:client_id/grants/:access_token"}},"checks":{"create":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"POST","params":{"actions":{"type":"object[]"},"actions[].description":{"required":true,"type":"string"},"actions[].identifier":{"required":true,"type":"string"},"actions[].label":{"required":true,"type":"string"},"completed_at":{"type":"string"},"conclusion":{"enum":["success","failure","neutral","cancelled","timed_out","action_required"],"type":"string"},"details_url":{"type":"string"},"external_id":{"type":"string"},"head_sha":{"required":true,"type":"string"},"name":{"required":true,"type":"string"},"output":{"type":"object"},"output.annotations":{"type":"object[]"},"output.annotations[].annotation_level":{"enum":["notice","warning","failure"],"required":true,"type":"string"},"output.annotations[].end_column":{"type":"integer"},"output.annotations[].end_line":{"required":true,"type":"integer"},"output.annotations[].message":{"required":true,"type":"string"},"output.annotations[].path":{"required":true,"type":"string"},"output.annotations[].raw_details":{"type":"string"},"output.annotations[].start_column":{"type":"integer"},"output.annotations[].start_line":{"required":true,"type":"integer"},"output.annotations[].title":{"type":"string"},"output.images":{"type":"object[]"},"output.images[].alt":{"required":true,"type":"string"},"output.images[].caption":{"type":"string"},"output.images[].image_url":{"required":true,"type":"string"},"output.summary":{"required":true,"type":"string"},"output.text":{"type":"string"},"output.title":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"started_at":{"type":"string"},"status":{"enum":["queued","in_progress","completed"],"type":"string"}},"url":"/repos/:owner/:repo/check-runs"},"createSuite":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"POST","params":{"head_sha":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/check-suites"},"get":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"GET","params":{"check_run_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/check-runs/:check_run_id"},"getSuite":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"GET","params":{"check_suite_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/check-suites/:check_suite_id"},"listAnnotations":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"GET","params":{"check_run_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/check-runs/:check_run_id/annotations"},"listForRef":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"GET","params":{"check_name":{"type":"string"},"filter":{"enum":["latest","all"],"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"status":{"enum":["queued","in_progress","completed"],"type":"string"}},"url":"/repos/:owner/:repo/commits/:ref/check-runs"},"listForSuite":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"GET","params":{"check_name":{"type":"string"},"check_suite_id":{"required":true,"type":"integer"},"filter":{"enum":["latest","all"],"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"status":{"enum":["queued","in_progress","completed"],"type":"string"}},"url":"/repos/:owner/:repo/check-suites/:check_suite_id/check-runs"},"listSuitesForRef":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"GET","params":{"app_id":{"type":"integer"},"check_name":{"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:ref/check-suites"},"rerequestSuite":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"POST","params":{"check_suite_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/check-suites/:check_suite_id/rerequest"},"setSuitesPreferences":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"PATCH","params":{"auto_trigger_checks":{"type":"object[]"},"auto_trigger_checks[].app_id":{"required":true,"type":"integer"},"auto_trigger_checks[].setting":{"required":true,"type":"boolean"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/check-suites/preferences"},"update":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"PATCH","params":{"actions":{"type":"object[]"},"actions[].description":{"required":true,"type":"string"},"actions[].identifier":{"required":true,"type":"string"},"actions[].label":{"required":true,"type":"string"},"check_run_id":{"required":true,"type":"integer"},"completed_at":{"type":"string"},"conclusion":{"enum":["success","failure","neutral","cancelled","timed_out","action_required"],"type":"string"},"details_url":{"type":"string"},"external_id":{"type":"string"},"name":{"type":"string"},"output":{"type":"object"},"output.annotations":{"type":"object[]"},"output.annotations[].annotation_level":{"enum":["notice","warning","failure"],"required":true,"type":"string"},"output.annotations[].end_column":{"type":"integer"},"output.annotations[].end_line":{"required":true,"type":"integer"},"output.annotations[].message":{"required":true,"type":"string"},"output.annotations[].path":{"required":true,"type":"string"},"output.annotations[].raw_details":{"type":"string"},"output.annotations[].start_column":{"type":"integer"},"output.annotations[].start_line":{"required":true,"type":"integer"},"output.annotations[].title":{"type":"string"},"output.images":{"type":"object[]"},"output.images[].alt":{"required":true,"type":"string"},"output.images[].caption":{"type":"string"},"output.images[].image_url":{"required":true,"type":"string"},"output.summary":{"required":true,"type":"string"},"output.text":{"type":"string"},"output.title":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"started_at":{"type":"string"},"status":{"enum":["queued","in_progress","completed"],"type":"string"}},"url":"/repos/:owner/:repo/check-runs/:check_run_id"}},"codesOfConduct":{"getConductCode":{"headers":{"accept":"application/vnd.github.scarlet-witch-preview+json"},"method":"GET","params":{"key":{"required":true,"type":"string"}},"url":"/codes_of_conduct/:key"},"getForRepo":{"headers":{"accept":"application/vnd.github.scarlet-witch-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/community/code_of_conduct"},"listConductCodes":{"headers":{"accept":"application/vnd.github.scarlet-witch-preview+json"},"method":"GET","params":{},"url":"/codes_of_conduct"}},"emojis":{"get":{"method":"GET","params":{},"url":"/emojis"}},"gists":{"checkIsStarred":{"method":"GET","params":{"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id/star"},"create":{"method":"POST","params":{"description":{"type":"string"},"files":{"required":true,"type":"object"},"files.content":{"type":"string"},"public":{"type":"boolean"}},"url":"/gists"},"createComment":{"method":"POST","params":{"body":{"required":true,"type":"string"},"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id/comments"},"delete":{"method":"DELETE","params":{"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id"},"deleteComment":{"method":"DELETE","params":{"comment_id":{"required":true,"type":"integer"},"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id/comments/:comment_id"},"fork":{"method":"POST","params":{"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id/forks"},"get":{"method":"GET","params":{"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id"},"getComment":{"method":"GET","params":{"comment_id":{"required":true,"type":"integer"},"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id/comments/:comment_id"},"getRevision":{"method":"GET","params":{"gist_id":{"required":true,"type":"string"},"sha":{"required":true,"type":"string"}},"url":"/gists/:gist_id/:sha"},"list":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"}},"url":"/gists"},"listComments":{"method":"GET","params":{"gist_id":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/gists/:gist_id/comments"},"listCommits":{"method":"GET","params":{"gist_id":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/gists/:gist_id/commits"},"listForks":{"method":"GET","params":{"gist_id":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/gists/:gist_id/forks"},"listPublic":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"}},"url":"/gists/public"},"listPublicForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"},"username":{"required":true,"type":"string"}},"url":"/users/:username/gists"},"listStarred":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"}},"url":"/gists/starred"},"star":{"method":"PUT","params":{"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id/star"},"unstar":{"method":"DELETE","params":{"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id/star"},"update":{"method":"PATCH","params":{"description":{"type":"string"},"files":{"type":"object"},"files.content":{"type":"string"},"files.filename":{"type":"string"},"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id"},"updateComment":{"method":"PATCH","params":{"body":{"required":true,"type":"string"},"comment_id":{"required":true,"type":"integer"},"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id/comments/:comment_id"}},"git":{"createBlob":{"method":"POST","params":{"content":{"required":true,"type":"string"},"encoding":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/blobs"},"createCommit":{"method":"POST","params":{"author":{"type":"object"},"author.date":{"type":"string"},"author.email":{"type":"string"},"author.name":{"type":"string"},"committer":{"type":"object"},"committer.date":{"type":"string"},"committer.email":{"type":"string"},"committer.name":{"type":"string"},"message":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"parents":{"required":true,"type":"string[]"},"repo":{"required":true,"type":"string"},"signature":{"type":"string"},"tree":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/commits"},"createRef":{"method":"POST","params":{"owner":{"required":true,"type":"string"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/refs"},"createTag":{"method":"POST","params":{"message":{"required":true,"type":"string"},"object":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"tag":{"required":true,"type":"string"},"tagger":{"type":"object"},"tagger.date":{"type":"string"},"tagger.email":{"type":"string"},"tagger.name":{"type":"string"},"type":{"enum":["commit","tree","blob"],"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/tags"},"createTree":{"method":"POST","params":{"base_tree":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"tree":{"required":true,"type":"object[]"},"tree[].content":{"type":"string"},"tree[].mode":{"enum":["100644","100755","040000","160000","120000"],"type":"string"},"tree[].path":{"type":"string"},"tree[].sha":{"allowNull":true,"type":"string"},"tree[].type":{"enum":["blob","tree","commit"],"type":"string"}},"url":"/repos/:owner/:repo/git/trees"},"deleteRef":{"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/refs/:ref"},"getBlob":{"method":"GET","params":{"file_sha":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/blobs/:file_sha"},"getCommit":{"method":"GET","params":{"commit_sha":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/commits/:commit_sha"},"getRef":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/ref/:ref"},"getTag":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"tag_sha":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/tags/:tag_sha"},"getTree":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"recursive":{"enum":["1"],"type":"integer"},"repo":{"required":true,"type":"string"},"tree_sha":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/trees/:tree_sha"},"listMatchingRefs":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/matching-refs/:ref"},"listRefs":{"method":"GET","params":{"namespace":{"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/refs/:namespace"},"updateRef":{"method":"PATCH","params":{"force":{"type":"boolean"},"owner":{"required":true,"type":"string"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/refs/:ref"}},"gitignore":{"getTemplate":{"method":"GET","params":{"name":{"required":true,"type":"string"}},"url":"/gitignore/templates/:name"},"listTemplates":{"method":"GET","params":{},"url":"/gitignore/templates"}},"interactions":{"addOrUpdateRestrictionsForOrg":{"headers":{"accept":"application/vnd.github.sombra-preview+json"},"method":"PUT","params":{"limit":{"enum":["existing_users","contributors_only","collaborators_only"],"required":true,"type":"string"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/interaction-limits"},"addOrUpdateRestrictionsForRepo":{"headers":{"accept":"application/vnd.github.sombra-preview+json"},"method":"PUT","params":{"limit":{"enum":["existing_users","contributors_only","collaborators_only"],"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/interaction-limits"},"getRestrictionsForOrg":{"headers":{"accept":"application/vnd.github.sombra-preview+json"},"method":"GET","params":{"org":{"required":true,"type":"string"}},"url":"/orgs/:org/interaction-limits"},"getRestrictionsForRepo":{"headers":{"accept":"application/vnd.github.sombra-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/interaction-limits"},"removeRestrictionsForOrg":{"headers":{"accept":"application/vnd.github.sombra-preview+json"},"method":"DELETE","params":{"org":{"required":true,"type":"string"}},"url":"/orgs/:org/interaction-limits"},"removeRestrictionsForRepo":{"headers":{"accept":"application/vnd.github.sombra-preview+json"},"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/interaction-limits"}},"issues":{"addAssignees":{"method":"POST","params":{"assignees":{"type":"string[]"},"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/assignees"},"addLabels":{"method":"POST","params":{"issue_number":{"required":true,"type":"integer"},"labels":{"required":true,"type":"string[]"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/labels"},"checkAssignee":{"method":"GET","params":{"assignee":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/assignees/:assignee"},"create":{"method":"POST","params":{"assignee":{"type":"string"},"assignees":{"type":"string[]"},"body":{"type":"string"},"labels":{"type":"string[]"},"milestone":{"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"title":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues"},"createComment":{"method":"POST","params":{"body":{"required":true,"type":"string"},"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/comments"},"createLabel":{"method":"POST","params":{"color":{"required":true,"type":"string"},"description":{"type":"string"},"name":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/labels"},"createMilestone":{"method":"POST","params":{"description":{"type":"string"},"due_on":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"state":{"enum":["open","closed"],"type":"string"},"title":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/milestones"},"deleteComment":{"method":"DELETE","params":{"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/comments/:comment_id"},"deleteLabel":{"method":"DELETE","params":{"name":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/labels/:name"},"deleteMilestone":{"method":"DELETE","params":{"milestone_number":{"required":true,"type":"integer"},"number":{"alias":"milestone_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/milestones/:milestone_number"},"get":{"method":"GET","params":{"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number"},"getComment":{"method":"GET","params":{"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/comments/:comment_id"},"getEvent":{"method":"GET","params":{"event_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/events/:event_id"},"getLabel":{"method":"GET","params":{"name":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/labels/:name"},"getMilestone":{"method":"GET","params":{"milestone_number":{"required":true,"type":"integer"},"number":{"alias":"milestone_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/milestones/:milestone_number"},"list":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"filter":{"enum":["assigned","created","mentioned","subscribed","all"],"type":"string"},"labels":{"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"},"sort":{"enum":["created","updated","comments"],"type":"string"},"state":{"enum":["open","closed","all"],"type":"string"}},"url":"/issues"},"listAssignees":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/assignees"},"listComments":{"method":"GET","params":{"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"since":{"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/comments"},"listCommentsForRepo":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"since":{"type":"string"},"sort":{"enum":["created","updated"],"type":"string"}},"url":"/repos/:owner/:repo/issues/comments"},"listEvents":{"method":"GET","params":{"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/events"},"listEventsForRepo":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/events"},"listEventsForTimeline":{"headers":{"accept":"application/vnd.github.mockingbird-preview+json"},"method":"GET","params":{"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/timeline"},"listForAuthenticatedUser":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"filter":{"enum":["assigned","created","mentioned","subscribed","all"],"type":"string"},"labels":{"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"},"sort":{"enum":["created","updated","comments"],"type":"string"},"state":{"enum":["open","closed","all"],"type":"string"}},"url":"/user/issues"},"listForOrg":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"filter":{"enum":["assigned","created","mentioned","subscribed","all"],"type":"string"},"labels":{"type":"string"},"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"},"sort":{"enum":["created","updated","comments"],"type":"string"},"state":{"enum":["open","closed","all"],"type":"string"}},"url":"/orgs/:org/issues"},"listForRepo":{"method":"GET","params":{"assignee":{"type":"string"},"creator":{"type":"string"},"direction":{"enum":["asc","desc"],"type":"string"},"labels":{"type":"string"},"mentioned":{"type":"string"},"milestone":{"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"since":{"type":"string"},"sort":{"enum":["created","updated","comments"],"type":"string"},"state":{"enum":["open","closed","all"],"type":"string"}},"url":"/repos/:owner/:repo/issues"},"listLabelsForMilestone":{"method":"GET","params":{"milestone_number":{"required":true,"type":"integer"},"number":{"alias":"milestone_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/milestones/:milestone_number/labels"},"listLabelsForRepo":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/labels"},"listLabelsOnIssue":{"method":"GET","params":{"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/labels"},"listMilestonesForRepo":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"sort":{"enum":["due_on","completeness"],"type":"string"},"state":{"enum":["open","closed","all"],"type":"string"}},"url":"/repos/:owner/:repo/milestones"},"lock":{"method":"PUT","params":{"issue_number":{"required":true,"type":"integer"},"lock_reason":{"enum":["off-topic","too heated","resolved","spam"],"type":"string"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/lock"},"removeAssignees":{"method":"DELETE","params":{"assignees":{"type":"string[]"},"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/assignees"},"removeLabel":{"method":"DELETE","params":{"issue_number":{"required":true,"type":"integer"},"name":{"required":true,"type":"string"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/labels/:name"},"removeLabels":{"method":"DELETE","params":{"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/labels"},"replaceLabels":{"method":"PUT","params":{"issue_number":{"required":true,"type":"integer"},"labels":{"type":"string[]"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/labels"},"unlock":{"method":"DELETE","params":{"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/lock"},"update":{"method":"PATCH","params":{"assignee":{"type":"string"},"assignees":{"type":"string[]"},"body":{"type":"string"},"issue_number":{"required":true,"type":"integer"},"labels":{"type":"string[]"},"milestone":{"allowNull":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"state":{"enum":["open","closed"],"type":"string"},"title":{"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number"},"updateComment":{"method":"PATCH","params":{"body":{"required":true,"type":"string"},"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/comments/:comment_id"},"updateLabel":{"method":"PATCH","params":{"color":{"type":"string"},"current_name":{"required":true,"type":"string"},"description":{"type":"string"},"name":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/labels/:current_name"},"updateMilestone":{"method":"PATCH","params":{"description":{"type":"string"},"due_on":{"type":"string"},"milestone_number":{"required":true,"type":"integer"},"number":{"alias":"milestone_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"state":{"enum":["open","closed"],"type":"string"},"title":{"type":"string"}},"url":"/repos/:owner/:repo/milestones/:milestone_number"}},"licenses":{"get":{"method":"GET","params":{"license":{"required":true,"type":"string"}},"url":"/licenses/:license"},"getForRepo":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/license"},"list":{"deprecated":"octokit.licenses.list() has been renamed to octokit.licenses.listCommonlyUsed() (2019-03-05)","method":"GET","params":{},"url":"/licenses"},"listCommonlyUsed":{"method":"GET","params":{},"url":"/licenses"}},"markdown":{"render":{"method":"POST","params":{"context":{"type":"string"},"mode":{"enum":["markdown","gfm"],"type":"string"},"text":{"required":true,"type":"string"}},"url":"/markdown"},"renderRaw":{"headers":{"content-type":"text/plain; charset=utf-8"},"method":"POST","params":{"data":{"mapTo":"data","required":true,"type":"string"}},"url":"/markdown/raw"}},"meta":{"get":{"method":"GET","params":{},"url":"/meta"}},"migrations":{"cancelImport":{"headers":{"accept":"application/vnd.github.barred-rock-preview+json"},"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/import"},"deleteArchiveForAuthenticatedUser":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"DELETE","params":{"migration_id":{"required":true,"type":"integer"}},"url":"/user/migrations/:migration_id/archive"},"deleteArchiveForOrg":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"DELETE","params":{"migration_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/migrations/:migration_id/archive"},"getArchiveForAuthenticatedUser":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"GET","params":{"migration_id":{"required":true,"type":"integer"}},"url":"/user/migrations/:migration_id/archive"},"getArchiveForOrg":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"GET","params":{"migration_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/migrations/:migration_id/archive"},"getCommitAuthors":{"headers":{"accept":"application/vnd.github.barred-rock-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"since":{"type":"string"}},"url":"/repos/:owner/:repo/import/authors"},"getImportProgress":{"headers":{"accept":"application/vnd.github.barred-rock-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/import"},"getLargeFiles":{"headers":{"accept":"application/vnd.github.barred-rock-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/import/large_files"},"getStatusForAuthenticatedUser":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"GET","params":{"migration_id":{"required":true,"type":"integer"}},"url":"/user/migrations/:migration_id"},"getStatusForOrg":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"GET","params":{"migration_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/migrations/:migration_id"},"listForAuthenticatedUser":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/migrations"},"listForOrg":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/migrations"},"mapCommitAuthor":{"headers":{"accept":"application/vnd.github.barred-rock-preview+json"},"method":"PATCH","params":{"author_id":{"required":true,"type":"integer"},"email":{"type":"string"},"name":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/import/authors/:author_id"},"setLfsPreference":{"headers":{"accept":"application/vnd.github.barred-rock-preview+json"},"method":"PATCH","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"use_lfs":{"enum":["opt_in","opt_out"],"required":true,"type":"string"}},"url":"/repos/:owner/:repo/import/lfs"},"startForAuthenticatedUser":{"method":"POST","params":{"exclude_attachments":{"type":"boolean"},"lock_repositories":{"type":"boolean"},"repositories":{"required":true,"type":"string[]"}},"url":"/user/migrations"},"startForOrg":{"method":"POST","params":{"exclude_attachments":{"type":"boolean"},"lock_repositories":{"type":"boolean"},"org":{"required":true,"type":"string"},"repositories":{"required":true,"type":"string[]"}},"url":"/orgs/:org/migrations"},"startImport":{"headers":{"accept":"application/vnd.github.barred-rock-preview+json"},"method":"PUT","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"tfvc_project":{"type":"string"},"vcs":{"enum":["subversion","git","mercurial","tfvc"],"type":"string"},"vcs_password":{"type":"string"},"vcs_url":{"required":true,"type":"string"},"vcs_username":{"type":"string"}},"url":"/repos/:owner/:repo/import"},"unlockRepoForAuthenticatedUser":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"DELETE","params":{"migration_id":{"required":true,"type":"integer"},"repo_name":{"required":true,"type":"string"}},"url":"/user/migrations/:migration_id/repos/:repo_name/lock"},"unlockRepoForOrg":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"DELETE","params":{"migration_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"},"repo_name":{"required":true,"type":"string"}},"url":"/orgs/:org/migrations/:migration_id/repos/:repo_name/lock"},"updateImport":{"headers":{"accept":"application/vnd.github.barred-rock-preview+json"},"method":"PATCH","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"vcs_password":{"type":"string"},"vcs_username":{"type":"string"}},"url":"/repos/:owner/:repo/import"}},"oauthAuthorizations":{"checkAuthorization":{"deprecated":"octokit.oauthAuthorizations.checkAuthorization() has been renamed to octokit.apps.checkAuthorization() (2019-11-05)","method":"GET","params":{"access_token":{"required":true,"type":"string"},"client_id":{"required":true,"type":"string"}},"url":"/applications/:client_id/tokens/:access_token"},"createAuthorization":{"deprecated":"octokit.oauthAuthorizations.createAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization","method":"POST","params":{"client_id":{"type":"string"},"client_secret":{"type":"string"},"fingerprint":{"type":"string"},"note":{"required":true,"type":"string"},"note_url":{"type":"string"},"scopes":{"type":"string[]"}},"url":"/authorizations"},"deleteAuthorization":{"deprecated":"octokit.oauthAuthorizations.deleteAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-an-authorization","method":"DELETE","params":{"authorization_id":{"required":true,"type":"integer"}},"url":"/authorizations/:authorization_id"},"deleteGrant":{"deprecated":"octokit.oauthAuthorizations.deleteGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-a-grant","method":"DELETE","params":{"grant_id":{"required":true,"type":"integer"}},"url":"/applications/grants/:grant_id"},"getAuthorization":{"deprecated":"octokit.oauthAuthorizations.getAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-authorization","method":"GET","params":{"authorization_id":{"required":true,"type":"integer"}},"url":"/authorizations/:authorization_id"},"getGrant":{"deprecated":"octokit.oauthAuthorizations.getGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-grant","method":"GET","params":{"grant_id":{"required":true,"type":"integer"}},"url":"/applications/grants/:grant_id"},"getOrCreateAuthorizationForApp":{"deprecated":"octokit.oauthAuthorizations.getOrCreateAuthorizationForApp() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app","method":"PUT","params":{"client_id":{"required":true,"type":"string"},"client_secret":{"required":true,"type":"string"},"fingerprint":{"type":"string"},"note":{"type":"string"},"note_url":{"type":"string"},"scopes":{"type":"string[]"}},"url":"/authorizations/clients/:client_id"},"getOrCreateAuthorizationForAppAndFingerprint":{"deprecated":"octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app-and-fingerprint","method":"PUT","params":{"client_id":{"required":true,"type":"string"},"client_secret":{"required":true,"type":"string"},"fingerprint":{"required":true,"type":"string"},"note":{"type":"string"},"note_url":{"type":"string"},"scopes":{"type":"string[]"}},"url":"/authorizations/clients/:client_id/:fingerprint"},"getOrCreateAuthorizationForAppFingerprint":{"deprecated":"octokit.oauthAuthorizations.getOrCreateAuthorizationForAppFingerprint() has been renamed to octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() (2018-12-27)","method":"PUT","params":{"client_id":{"required":true,"type":"string"},"client_secret":{"required":true,"type":"string"},"fingerprint":{"required":true,"type":"string"},"note":{"type":"string"},"note_url":{"type":"string"},"scopes":{"type":"string[]"}},"url":"/authorizations/clients/:client_id/:fingerprint"},"listAuthorizations":{"deprecated":"octokit.oauthAuthorizations.listAuthorizations() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-authorizations","method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/authorizations"},"listGrants":{"deprecated":"octokit.oauthAuthorizations.listGrants() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-grants","method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/applications/grants"},"resetAuthorization":{"deprecated":"octokit.oauthAuthorizations.resetAuthorization() has been renamed to octokit.apps.resetAuthorization() (2019-11-05)","method":"POST","params":{"access_token":{"required":true,"type":"string"},"client_id":{"required":true,"type":"string"}},"url":"/applications/:client_id/tokens/:access_token"},"revokeAuthorizationForApplication":{"deprecated":"octokit.oauthAuthorizations.revokeAuthorizationForApplication() has been renamed to octokit.apps.revokeAuthorizationForApplication() (2019-11-05)","method":"DELETE","params":{"access_token":{"required":true,"type":"string"},"client_id":{"required":true,"type":"string"}},"url":"/applications/:client_id/tokens/:access_token"},"revokeGrantForApplication":{"deprecated":"octokit.oauthAuthorizations.revokeGrantForApplication() has been renamed to octokit.apps.revokeGrantForApplication() (2019-11-05)","method":"DELETE","params":{"access_token":{"required":true,"type":"string"},"client_id":{"required":true,"type":"string"}},"url":"/applications/:client_id/grants/:access_token"},"updateAuthorization":{"deprecated":"octokit.oauthAuthorizations.updateAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#update-an-existing-authorization","method":"PATCH","params":{"add_scopes":{"type":"string[]"},"authorization_id":{"required":true,"type":"integer"},"fingerprint":{"type":"string"},"note":{"type":"string"},"note_url":{"type":"string"},"remove_scopes":{"type":"string[]"},"scopes":{"type":"string[]"}},"url":"/authorizations/:authorization_id"}},"orgs":{"addOrUpdateMembership":{"method":"PUT","params":{"org":{"required":true,"type":"string"},"role":{"enum":["admin","member"],"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/memberships/:username"},"blockUser":{"method":"PUT","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/blocks/:username"},"checkBlockedUser":{"method":"GET","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/blocks/:username"},"checkMembership":{"method":"GET","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/members/:username"},"checkPublicMembership":{"method":"GET","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/public_members/:username"},"concealMembership":{"method":"DELETE","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/public_members/:username"},"convertMemberToOutsideCollaborator":{"method":"PUT","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/outside_collaborators/:username"},"createHook":{"method":"POST","params":{"active":{"type":"boolean"},"config":{"required":true,"type":"object"},"config.content_type":{"type":"string"},"config.insecure_ssl":{"type":"string"},"config.secret":{"type":"string"},"config.url":{"required":true,"type":"string"},"events":{"type":"string[]"},"name":{"required":true,"type":"string"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/hooks"},"createInvitation":{"method":"POST","params":{"email":{"type":"string"},"invitee_id":{"type":"integer"},"org":{"required":true,"type":"string"},"role":{"enum":["admin","direct_member","billing_manager"],"type":"string"},"team_ids":{"type":"integer[]"}},"url":"/orgs/:org/invitations"},"deleteHook":{"method":"DELETE","params":{"hook_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/hooks/:hook_id"},"get":{"method":"GET","params":{"org":{"required":true,"type":"string"}},"url":"/orgs/:org"},"getHook":{"method":"GET","params":{"hook_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/hooks/:hook_id"},"getMembership":{"method":"GET","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/memberships/:username"},"getMembershipForAuthenticatedUser":{"method":"GET","params":{"org":{"required":true,"type":"string"}},"url":"/user/memberships/orgs/:org"},"list":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"}},"url":"/organizations"},"listBlockedUsers":{"method":"GET","params":{"org":{"required":true,"type":"string"}},"url":"/orgs/:org/blocks"},"listForAuthenticatedUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/orgs"},"listForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/orgs"},"listHooks":{"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/hooks"},"listInstallations":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/installations"},"listInvitationTeams":{"method":"GET","params":{"invitation_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/invitations/:invitation_id/teams"},"listMembers":{"method":"GET","params":{"filter":{"enum":["2fa_disabled","all"],"type":"string"},"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"role":{"enum":["all","admin","member"],"type":"string"}},"url":"/orgs/:org/members"},"listMemberships":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"state":{"enum":["active","pending"],"type":"string"}},"url":"/user/memberships/orgs"},"listOutsideCollaborators":{"method":"GET","params":{"filter":{"enum":["2fa_disabled","all"],"type":"string"},"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/outside_collaborators"},"listPendingInvitations":{"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/invitations"},"listPublicMembers":{"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/public_members"},"pingHook":{"method":"POST","params":{"hook_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/hooks/:hook_id/pings"},"publicizeMembership":{"method":"PUT","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/public_members/:username"},"removeMember":{"method":"DELETE","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/members/:username"},"removeMembership":{"method":"DELETE","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/memberships/:username"},"removeOutsideCollaborator":{"method":"DELETE","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/outside_collaborators/:username"},"unblockUser":{"method":"DELETE","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/blocks/:username"},"update":{"method":"PATCH","params":{"billing_email":{"type":"string"},"company":{"type":"string"},"default_repository_permission":{"enum":["read","write","admin","none"],"type":"string"},"description":{"type":"string"},"email":{"type":"string"},"has_organization_projects":{"type":"boolean"},"has_repository_projects":{"type":"boolean"},"location":{"type":"string"},"members_allowed_repository_creation_type":{"enum":["all","private","none"],"type":"string"},"members_can_create_repositories":{"type":"boolean"},"name":{"type":"string"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org"},"updateHook":{"method":"PATCH","params":{"active":{"type":"boolean"},"config":{"type":"object"},"config.content_type":{"type":"string"},"config.insecure_ssl":{"type":"string"},"config.secret":{"type":"string"},"config.url":{"required":true,"type":"string"},"events":{"type":"string[]"},"hook_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/hooks/:hook_id"},"updateMembership":{"method":"PATCH","params":{"org":{"required":true,"type":"string"},"state":{"enum":["active"],"required":true,"type":"string"}},"url":"/user/memberships/orgs/:org"}},"projects":{"addCollaborator":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"PUT","params":{"permission":{"enum":["read","write","admin"],"type":"string"},"project_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/projects/:project_id/collaborators/:username"},"createCard":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"POST","params":{"column_id":{"required":true,"type":"integer"},"content_id":{"type":"integer"},"content_type":{"type":"string"},"note":{"type":"string"}},"url":"/projects/columns/:column_id/cards"},"createColumn":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"POST","params":{"name":{"required":true,"type":"string"},"project_id":{"required":true,"type":"integer"}},"url":"/projects/:project_id/columns"},"createForAuthenticatedUser":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"POST","params":{"body":{"type":"string"},"name":{"required":true,"type":"string"}},"url":"/user/projects"},"createForOrg":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"POST","params":{"body":{"type":"string"},"name":{"required":true,"type":"string"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/projects"},"createForRepo":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"POST","params":{"body":{"type":"string"},"name":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/projects"},"delete":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"DELETE","params":{"project_id":{"required":true,"type":"integer"}},"url":"/projects/:project_id"},"deleteCard":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"DELETE","params":{"card_id":{"required":true,"type":"integer"}},"url":"/projects/columns/cards/:card_id"},"deleteColumn":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"DELETE","params":{"column_id":{"required":true,"type":"integer"}},"url":"/projects/columns/:column_id"},"get":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"project_id":{"required":true,"type":"integer"}},"url":"/projects/:project_id"},"getCard":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"card_id":{"required":true,"type":"integer"}},"url":"/projects/columns/cards/:card_id"},"getColumn":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"column_id":{"required":true,"type":"integer"}},"url":"/projects/columns/:column_id"},"listCards":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"archived_state":{"enum":["all","archived","not_archived"],"type":"string"},"column_id":{"required":true,"type":"integer"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/projects/columns/:column_id/cards"},"listCollaborators":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"affiliation":{"enum":["outside","direct","all"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"project_id":{"required":true,"type":"integer"}},"url":"/projects/:project_id/collaborators"},"listColumns":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"project_id":{"required":true,"type":"integer"}},"url":"/projects/:project_id/columns"},"listForOrg":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"state":{"enum":["open","closed","all"],"type":"string"}},"url":"/orgs/:org/projects"},"listForRepo":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"state":{"enum":["open","closed","all"],"type":"string"}},"url":"/repos/:owner/:repo/projects"},"listForUser":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"state":{"enum":["open","closed","all"],"type":"string"},"username":{"required":true,"type":"string"}},"url":"/users/:username/projects"},"moveCard":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"POST","params":{"card_id":{"required":true,"type":"integer"},"column_id":{"type":"integer"},"position":{"required":true,"type":"string","validation":"^(top|bottom|after:\\d+)$"}},"url":"/projects/columns/cards/:card_id/moves"},"moveColumn":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"POST","params":{"column_id":{"required":true,"type":"integer"},"position":{"required":true,"type":"string","validation":"^(first|last|after:\\d+)$"}},"url":"/projects/columns/:column_id/moves"},"removeCollaborator":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"DELETE","params":{"project_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/projects/:project_id/collaborators/:username"},"reviewUserPermissionLevel":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"project_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/projects/:project_id/collaborators/:username/permission"},"update":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"PATCH","params":{"body":{"type":"string"},"name":{"type":"string"},"organization_permission":{"type":"string"},"private":{"type":"boolean"},"project_id":{"required":true,"type":"integer"},"state":{"enum":["open","closed"],"type":"string"}},"url":"/projects/:project_id"},"updateCard":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"PATCH","params":{"archived":{"type":"boolean"},"card_id":{"required":true,"type":"integer"},"note":{"type":"string"}},"url":"/projects/columns/cards/:card_id"},"updateColumn":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"PATCH","params":{"column_id":{"required":true,"type":"integer"},"name":{"required":true,"type":"string"}},"url":"/projects/columns/:column_id"}},"pulls":{"checkIfMerged":{"method":"GET","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/merge"},"create":{"method":"POST","params":{"base":{"required":true,"type":"string"},"body":{"type":"string"},"draft":{"type":"boolean"},"head":{"required":true,"type":"string"},"maintainer_can_modify":{"type":"boolean"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"title":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls"},"createComment":{"method":"POST","params":{"body":{"required":true,"type":"string"},"commit_id":{"required":true,"type":"string"},"in_reply_to":{"deprecated":true,"description":"The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.","type":"integer"},"line":{"type":"integer"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"path":{"required":true,"type":"string"},"position":{"type":"integer"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"side":{"enum":["LEFT","RIGHT"],"type":"string"},"start_line":{"type":"integer"},"start_side":{"enum":["LEFT","RIGHT","side"],"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/comments"},"createCommentReply":{"deprecated":"octokit.pulls.createCommentReply() has been renamed to octokit.pulls.createComment() (2019-09-09)","method":"POST","params":{"body":{"required":true,"type":"string"},"commit_id":{"required":true,"type":"string"},"in_reply_to":{"deprecated":true,"description":"The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.","type":"integer"},"line":{"type":"integer"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"path":{"required":true,"type":"string"},"position":{"type":"integer"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"side":{"enum":["LEFT","RIGHT"],"type":"string"},"start_line":{"type":"integer"},"start_side":{"enum":["LEFT","RIGHT","side"],"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/comments"},"createFromIssue":{"deprecated":"octokit.pulls.createFromIssue() is deprecated, see https://developer.github.com/v3/pulls/#create-a-pull-request","method":"POST","params":{"base":{"required":true,"type":"string"},"draft":{"type":"boolean"},"head":{"required":true,"type":"string"},"issue":{"required":true,"type":"integer"},"maintainer_can_modify":{"type":"boolean"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls"},"createReview":{"method":"POST","params":{"body":{"type":"string"},"comments":{"type":"object[]"},"comments[].body":{"required":true,"type":"string"},"comments[].path":{"required":true,"type":"string"},"comments[].position":{"required":true,"type":"integer"},"commit_id":{"type":"string"},"event":{"enum":["APPROVE","REQUEST_CHANGES","COMMENT"],"type":"string"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/reviews"},"createReviewCommentReply":{"method":"POST","params":{"body":{"required":true,"type":"string"},"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/comments/:comment_id/replies"},"createReviewRequest":{"method":"POST","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"reviewers":{"type":"string[]"},"team_reviewers":{"type":"string[]"}},"url":"/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"},"deleteComment":{"method":"DELETE","params":{"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/comments/:comment_id"},"deletePendingReview":{"method":"DELETE","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"review_id":{"required":true,"type":"integer"}},"url":"/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"},"deleteReviewRequest":{"method":"DELETE","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"reviewers":{"type":"string[]"},"team_reviewers":{"type":"string[]"}},"url":"/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"},"dismissReview":{"method":"PUT","params":{"message":{"required":true,"type":"string"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"review_id":{"required":true,"type":"integer"}},"url":"/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/dismissals"},"get":{"method":"GET","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number"},"getComment":{"method":"GET","params":{"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/comments/:comment_id"},"getCommentsForReview":{"method":"GET","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"review_id":{"required":true,"type":"integer"}},"url":"/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/comments"},"getReview":{"method":"GET","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"review_id":{"required":true,"type":"integer"}},"url":"/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"},"list":{"method":"GET","params":{"base":{"type":"string"},"direction":{"enum":["asc","desc"],"type":"string"},"head":{"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"sort":{"enum":["created","updated","popularity","long-running"],"type":"string"},"state":{"enum":["open","closed","all"],"type":"string"}},"url":"/repos/:owner/:repo/pulls"},"listComments":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"since":{"type":"string"},"sort":{"enum":["created","updated"],"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/comments"},"listCommentsForRepo":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"since":{"type":"string"},"sort":{"enum":["created","updated"],"type":"string"}},"url":"/repos/:owner/:repo/pulls/comments"},"listCommits":{"method":"GET","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/commits"},"listFiles":{"method":"GET","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/files"},"listReviewRequests":{"method":"GET","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"},"listReviews":{"method":"GET","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/reviews"},"merge":{"method":"PUT","params":{"commit_message":{"type":"string"},"commit_title":{"type":"string"},"merge_method":{"enum":["merge","squash","rebase"],"type":"string"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"sha":{"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/merge"},"submitReview":{"method":"POST","params":{"body":{"type":"string"},"event":{"enum":["APPROVE","REQUEST_CHANGES","COMMENT"],"required":true,"type":"string"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"review_id":{"required":true,"type":"integer"}},"url":"/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/events"},"update":{"method":"PATCH","params":{"base":{"type":"string"},"body":{"type":"string"},"maintainer_can_modify":{"type":"boolean"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"state":{"enum":["open","closed"],"type":"string"},"title":{"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number"},"updateBranch":{"headers":{"accept":"application/vnd.github.lydian-preview+json"},"method":"PUT","params":{"expected_head_sha":{"type":"string"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/update-branch"},"updateComment":{"method":"PATCH","params":{"body":{"required":true,"type":"string"},"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/comments/:comment_id"},"updateReview":{"method":"PUT","params":{"body":{"required":true,"type":"string"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"review_id":{"required":true,"type":"integer"}},"url":"/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"}},"rateLimit":{"get":{"method":"GET","params":{},"url":"/rate_limit"}},"reactions":{"createForCommitComment":{"headers":{"accept":"application/vnd.github.squirrel-girl-preview+json"},"method":"POST","params":{"comment_id":{"required":true,"type":"integer"},"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/comments/:comment_id/reactions"},"createForIssue":{"headers":{"accept":"application/vnd.github.squirrel-girl-preview+json"},"method":"POST","params":{"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"required":true,"type":"string"},"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/reactions"},"createForIssueComment":{"headers":{"accept":"application/vnd.github.squirrel-girl-preview+json"},"method":"POST","params":{"comment_id":{"required":true,"type":"integer"},"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/comments/:comment_id/reactions"},"createForPullRequestReviewComment":{"headers":{"accept":"application/vnd.github.squirrel-girl-preview+json"},"method":"POST","params":{"comment_id":{"required":true,"type":"integer"},"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/comments/:comment_id/reactions"},"createForTeamDiscussion":{"headers":{"accept":"application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"},"method":"POST","params":{"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"required":true,"type":"string"},"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/reactions"},"createForTeamDiscussionComment":{"headers":{"accept":"application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"},"method":"POST","params":{"comment_number":{"required":true,"type":"integer"},"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"required":true,"type":"string"},"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"},"delete":{"headers":{"accept":"application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"},"method":"DELETE","params":{"reaction_id":{"required":true,"type":"integer"}},"url":"/reactions/:reaction_id"},"listForCommitComment":{"headers":{"accept":"application/vnd.github.squirrel-girl-preview+json"},"method":"GET","params":{"comment_id":{"required":true,"type":"integer"},"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/comments/:comment_id/reactions"},"listForIssue":{"headers":{"accept":"application/vnd.github.squirrel-girl-preview+json"},"method":"GET","params":{"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"type":"string"},"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/reactions"},"listForIssueComment":{"headers":{"accept":"application/vnd.github.squirrel-girl-preview+json"},"method":"GET","params":{"comment_id":{"required":true,"type":"integer"},"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/comments/:comment_id/reactions"},"listForPullRequestReviewComment":{"headers":{"accept":"application/vnd.github.squirrel-girl-preview+json"},"method":"GET","params":{"comment_id":{"required":true,"type":"integer"},"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/comments/:comment_id/reactions"},"listForTeamDiscussion":{"headers":{"accept":"application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"},"method":"GET","params":{"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"type":"string"},"discussion_number":{"required":true,"type":"integer"},"page":{"type":"integer"},"per_page":{"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/reactions"},"listForTeamDiscussionComment":{"headers":{"accept":"application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"},"method":"GET","params":{"comment_number":{"required":true,"type":"integer"},"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"type":"string"},"discussion_number":{"required":true,"type":"integer"},"page":{"type":"integer"},"per_page":{"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"}},"repos":{"acceptInvitation":{"method":"PATCH","params":{"invitation_id":{"required":true,"type":"integer"}},"url":"/user/repository_invitations/:invitation_id"},"addCollaborator":{"method":"PUT","params":{"owner":{"required":true,"type":"string"},"permission":{"enum":["pull","push","admin"],"type":"string"},"repo":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/collaborators/:username"},"addDeployKey":{"method":"POST","params":{"key":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"read_only":{"type":"boolean"},"repo":{"required":true,"type":"string"},"title":{"type":"string"}},"url":"/repos/:owner/:repo/keys"},"addProtectedBranchAdminEnforcement":{"method":"POST","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/enforce_admins"},"addProtectedBranchAppRestrictions":{"method":"POST","params":{"apps":{"mapTo":"data","required":true,"type":"string[]"},"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"},"addProtectedBranchRequiredSignatures":{"headers":{"accept":"application/vnd.github.zzzax-preview+json"},"method":"POST","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_signatures"},"addProtectedBranchRequiredStatusChecksContexts":{"method":"POST","params":{"branch":{"required":true,"type":"string"},"contexts":{"mapTo":"data","required":true,"type":"string[]"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"},"addProtectedBranchTeamRestrictions":{"method":"POST","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"teams":{"mapTo":"data","required":true,"type":"string[]"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"},"addProtectedBranchUserRestrictions":{"method":"POST","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"users":{"mapTo":"data","required":true,"type":"string[]"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/users"},"checkCollaborator":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/collaborators/:username"},"checkVulnerabilityAlerts":{"headers":{"accept":"application/vnd.github.dorian-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/vulnerability-alerts"},"compareCommits":{"method":"GET","params":{"base":{"required":true,"type":"string"},"head":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/compare/:base...:head"},"createCommitComment":{"method":"POST","params":{"body":{"required":true,"type":"string"},"commit_sha":{"required":true,"type":"string"},"line":{"type":"integer"},"owner":{"required":true,"type":"string"},"path":{"type":"string"},"position":{"type":"integer"},"repo":{"required":true,"type":"string"},"sha":{"alias":"commit_sha","deprecated":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:commit_sha/comments"},"createDeployment":{"method":"POST","params":{"auto_merge":{"type":"boolean"},"description":{"type":"string"},"environment":{"type":"string"},"owner":{"required":true,"type":"string"},"payload":{"type":"string"},"production_environment":{"type":"boolean"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"required_contexts":{"type":"string[]"},"task":{"type":"string"},"transient_environment":{"type":"boolean"}},"url":"/repos/:owner/:repo/deployments"},"createDeploymentStatus":{"method":"POST","params":{"auto_inactive":{"type":"boolean"},"deployment_id":{"required":true,"type":"integer"},"description":{"type":"string"},"environment":{"enum":["production","staging","qa"],"type":"string"},"environment_url":{"type":"string"},"log_url":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"state":{"enum":["error","failure","inactive","in_progress","queued","pending","success"],"required":true,"type":"string"},"target_url":{"type":"string"}},"url":"/repos/:owner/:repo/deployments/:deployment_id/statuses"},"createDispatchEvent":{"headers":{"accept":"application/vnd.github.everest-preview+json"},"method":"POST","params":{"client_payload":{"type":"object"},"event_type":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/dispatches"},"createFile":{"deprecated":"octokit.repos.createFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)","method":"PUT","params":{"author":{"type":"object"},"author.email":{"required":true,"type":"string"},"author.name":{"required":true,"type":"string"},"branch":{"type":"string"},"committer":{"type":"object"},"committer.email":{"required":true,"type":"string"},"committer.name":{"required":true,"type":"string"},"content":{"required":true,"type":"string"},"message":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"path":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"type":"string"}},"url":"/repos/:owner/:repo/contents/:path"},"createForAuthenticatedUser":{"method":"POST","params":{"allow_merge_commit":{"type":"boolean"},"allow_rebase_merge":{"type":"boolean"},"allow_squash_merge":{"type":"boolean"},"auto_init":{"type":"boolean"},"description":{"type":"string"},"gitignore_template":{"type":"string"},"has_issues":{"type":"boolean"},"has_projects":{"type":"boolean"},"has_wiki":{"type":"boolean"},"homepage":{"type":"string"},"is_template":{"type":"boolean"},"license_template":{"type":"string"},"name":{"required":true,"type":"string"},"private":{"type":"boolean"},"team_id":{"type":"integer"}},"url":"/user/repos"},"createFork":{"method":"POST","params":{"organization":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/forks"},"createHook":{"method":"POST","params":{"active":{"type":"boolean"},"config":{"required":true,"type":"object"},"config.content_type":{"type":"string"},"config.insecure_ssl":{"type":"string"},"config.secret":{"type":"string"},"config.url":{"required":true,"type":"string"},"events":{"type":"string[]"},"name":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/hooks"},"createInOrg":{"method":"POST","params":{"allow_merge_commit":{"type":"boolean"},"allow_rebase_merge":{"type":"boolean"},"allow_squash_merge":{"type":"boolean"},"auto_init":{"type":"boolean"},"description":{"type":"string"},"gitignore_template":{"type":"string"},"has_issues":{"type":"boolean"},"has_projects":{"type":"boolean"},"has_wiki":{"type":"boolean"},"homepage":{"type":"string"},"is_template":{"type":"boolean"},"license_template":{"type":"string"},"name":{"required":true,"type":"string"},"org":{"required":true,"type":"string"},"private":{"type":"boolean"},"team_id":{"type":"integer"}},"url":"/orgs/:org/repos"},"createOrUpdateFile":{"method":"PUT","params":{"author":{"type":"object"},"author.email":{"required":true,"type":"string"},"author.name":{"required":true,"type":"string"},"branch":{"type":"string"},"committer":{"type":"object"},"committer.email":{"required":true,"type":"string"},"committer.name":{"required":true,"type":"string"},"content":{"required":true,"type":"string"},"message":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"path":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"type":"string"}},"url":"/repos/:owner/:repo/contents/:path"},"createRelease":{"method":"POST","params":{"body":{"type":"string"},"draft":{"type":"boolean"},"name":{"type":"string"},"owner":{"required":true,"type":"string"},"prerelease":{"type":"boolean"},"repo":{"required":true,"type":"string"},"tag_name":{"required":true,"type":"string"},"target_commitish":{"type":"string"}},"url":"/repos/:owner/:repo/releases"},"createStatus":{"method":"POST","params":{"context":{"type":"string"},"description":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"required":true,"type":"string"},"state":{"enum":["error","failure","pending","success"],"required":true,"type":"string"},"target_url":{"type":"string"}},"url":"/repos/:owner/:repo/statuses/:sha"},"createUsingTemplate":{"headers":{"accept":"application/vnd.github.baptiste-preview+json"},"method":"POST","params":{"description":{"type":"string"},"name":{"required":true,"type":"string"},"owner":{"type":"string"},"private":{"type":"boolean"},"template_owner":{"required":true,"type":"string"},"template_repo":{"required":true,"type":"string"}},"url":"/repos/:template_owner/:template_repo/generate"},"declineInvitation":{"method":"DELETE","params":{"invitation_id":{"required":true,"type":"integer"}},"url":"/user/repository_invitations/:invitation_id"},"delete":{"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo"},"deleteCommitComment":{"method":"DELETE","params":{"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/comments/:comment_id"},"deleteDownload":{"method":"DELETE","params":{"download_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/downloads/:download_id"},"deleteFile":{"method":"DELETE","params":{"author":{"type":"object"},"author.email":{"type":"string"},"author.name":{"type":"string"},"branch":{"type":"string"},"committer":{"type":"object"},"committer.email":{"type":"string"},"committer.name":{"type":"string"},"message":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"path":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/contents/:path"},"deleteHook":{"method":"DELETE","params":{"hook_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/hooks/:hook_id"},"deleteInvitation":{"method":"DELETE","params":{"invitation_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/invitations/:invitation_id"},"deleteRelease":{"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"release_id":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases/:release_id"},"deleteReleaseAsset":{"method":"DELETE","params":{"asset_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases/assets/:asset_id"},"disableAutomatedSecurityFixes":{"headers":{"accept":"application/vnd.github.london-preview+json"},"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/automated-security-fixes"},"disablePagesSite":{"headers":{"accept":"application/vnd.github.switcheroo-preview+json"},"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pages"},"disableVulnerabilityAlerts":{"headers":{"accept":"application/vnd.github.dorian-preview+json"},"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/vulnerability-alerts"},"enableAutomatedSecurityFixes":{"headers":{"accept":"application/vnd.github.london-preview+json"},"method":"PUT","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/automated-security-fixes"},"enablePagesSite":{"headers":{"accept":"application/vnd.github.switcheroo-preview+json"},"method":"POST","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"source":{"type":"object"},"source.branch":{"enum":["master","gh-pages"],"type":"string"},"source.path":{"type":"string"}},"url":"/repos/:owner/:repo/pages"},"enableVulnerabilityAlerts":{"headers":{"accept":"application/vnd.github.dorian-preview+json"},"method":"PUT","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/vulnerability-alerts"},"get":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo"},"getAppsWithAccessToProtectedBranch":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"},"getArchiveLink":{"method":"GET","params":{"archive_format":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/:archive_format/:ref"},"getBranch":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch"},"getBranchProtection":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection"},"getClones":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"per":{"enum":["day","week"],"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/traffic/clones"},"getCodeFrequencyStats":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/stats/code_frequency"},"getCollaboratorPermissionLevel":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/collaborators/:username/permission"},"getCombinedStatusForRef":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:ref/status"},"getCommit":{"method":"GET","params":{"commit_sha":{"alias":"ref","deprecated":true,"type":"string"},"owner":{"required":true,"type":"string"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"alias":"ref","deprecated":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:ref"},"getCommitActivityStats":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/stats/commit_activity"},"getCommitComment":{"method":"GET","params":{"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/comments/:comment_id"},"getCommitRefSha":{"deprecated":"octokit.repos.getCommitRefSha() is deprecated, see https://developer.github.com/v3/repos/commits/#get-a-single-commit","headers":{"accept":"application/vnd.github.v3.sha"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:ref"},"getContents":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"path":{"required":true,"type":"string"},"ref":{"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/contents/:path"},"getContributorsStats":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/stats/contributors"},"getDeployKey":{"method":"GET","params":{"key_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/keys/:key_id"},"getDeployment":{"method":"GET","params":{"deployment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/deployments/:deployment_id"},"getDeploymentStatus":{"method":"GET","params":{"deployment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"status_id":{"required":true,"type":"integer"}},"url":"/repos/:owner/:repo/deployments/:deployment_id/statuses/:status_id"},"getDownload":{"method":"GET","params":{"download_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/downloads/:download_id"},"getHook":{"method":"GET","params":{"hook_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/hooks/:hook_id"},"getLatestPagesBuild":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pages/builds/latest"},"getLatestRelease":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases/latest"},"getPages":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pages"},"getPagesBuild":{"method":"GET","params":{"build_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pages/builds/:build_id"},"getParticipationStats":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/stats/participation"},"getProtectedBranchAdminEnforcement":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/enforce_admins"},"getProtectedBranchPullRequestReviewEnforcement":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"},"getProtectedBranchRequiredSignatures":{"headers":{"accept":"application/vnd.github.zzzax-preview+json"},"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_signatures"},"getProtectedBranchRequiredStatusChecks":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_status_checks"},"getProtectedBranchRestrictions":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions"},"getPunchCardStats":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/stats/punch_card"},"getReadme":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"ref":{"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/readme"},"getRelease":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"release_id":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases/:release_id"},"getReleaseAsset":{"method":"GET","params":{"asset_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases/assets/:asset_id"},"getReleaseByTag":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"tag":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases/tags/:tag"},"getTeamsWithAccessToProtectedBranch":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"},"getTopPaths":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/traffic/popular/paths"},"getTopReferrers":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/traffic/popular/referrers"},"getUsersWithAccessToProtectedBranch":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/users"},"getViews":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"per":{"enum":["day","week"],"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/traffic/views"},"list":{"method":"GET","params":{"affiliation":{"type":"string"},"direction":{"enum":["asc","desc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"sort":{"enum":["created","updated","pushed","full_name"],"type":"string"},"type":{"enum":["all","owner","public","private","member"],"type":"string"},"visibility":{"enum":["all","public","private"],"type":"string"}},"url":"/user/repos"},"listAppsWithAccessToProtectedBranch":{"deprecated":"octokit.repos.listAppsWithAccessToProtectedBranch() has been renamed to octokit.repos.getAppsWithAccessToProtectedBranch() (2019-09-13)","method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"},"listAssetsForRelease":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"release_id":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases/:release_id/assets"},"listBranches":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"protected":{"type":"boolean"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches"},"listBranchesForHeadCommit":{"headers":{"accept":"application/vnd.github.groot-preview+json"},"method":"GET","params":{"commit_sha":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:commit_sha/branches-where-head"},"listCollaborators":{"method":"GET","params":{"affiliation":{"enum":["outside","direct","all"],"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/collaborators"},"listCommentsForCommit":{"method":"GET","params":{"commit_sha":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"ref":{"alias":"commit_sha","deprecated":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:commit_sha/comments"},"listCommitComments":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/comments"},"listCommits":{"method":"GET","params":{"author":{"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"path":{"type":"string"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"sha":{"type":"string"},"since":{"type":"string"},"until":{"type":"string"}},"url":"/repos/:owner/:repo/commits"},"listContributors":{"method":"GET","params":{"anon":{"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/contributors"},"listDeployKeys":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/keys"},"listDeploymentStatuses":{"method":"GET","params":{"deployment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/deployments/:deployment_id/statuses"},"listDeployments":{"method":"GET","params":{"environment":{"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"ref":{"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"type":"string"},"task":{"type":"string"}},"url":"/repos/:owner/:repo/deployments"},"listDownloads":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/downloads"},"listForOrg":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"sort":{"enum":["created","updated","pushed","full_name"],"type":"string"},"type":{"enum":["all","public","private","forks","sources","member"],"type":"string"}},"url":"/orgs/:org/repos"},"listForUser":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"sort":{"enum":["created","updated","pushed","full_name"],"type":"string"},"type":{"enum":["all","owner","member"],"type":"string"},"username":{"required":true,"type":"string"}},"url":"/users/:username/repos"},"listForks":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"sort":{"enum":["newest","oldest","stargazers"],"type":"string"}},"url":"/repos/:owner/:repo/forks"},"listHooks":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/hooks"},"listInvitations":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/invitations"},"listInvitationsForAuthenticatedUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/repository_invitations"},"listLanguages":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/languages"},"listPagesBuilds":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pages/builds"},"listProtectedBranchRequiredStatusChecksContexts":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"},"listProtectedBranchTeamRestrictions":{"deprecated":"octokit.repos.listProtectedBranchTeamRestrictions() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-09)","method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"},"listProtectedBranchUserRestrictions":{"deprecated":"octokit.repos.listProtectedBranchUserRestrictions() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-09)","method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/users"},"listPublic":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"}},"url":"/repositories"},"listPullRequestsAssociatedWithCommit":{"headers":{"accept":"application/vnd.github.groot-preview+json"},"method":"GET","params":{"commit_sha":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:commit_sha/pulls"},"listReleases":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases"},"listStatusesForRef":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:ref/statuses"},"listTags":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/tags"},"listTeams":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/teams"},"listTeamsWithAccessToProtectedBranch":{"deprecated":"octokit.repos.listTeamsWithAccessToProtectedBranch() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-13)","method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"},"listTopics":{"headers":{"accept":"application/vnd.github.mercy-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/topics"},"listUsersWithAccessToProtectedBranch":{"deprecated":"octokit.repos.listUsersWithAccessToProtectedBranch() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-13)","method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/users"},"merge":{"method":"POST","params":{"base":{"required":true,"type":"string"},"commit_message":{"type":"string"},"head":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/merges"},"pingHook":{"method":"POST","params":{"hook_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/hooks/:hook_id/pings"},"removeBranchProtection":{"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection"},"removeCollaborator":{"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/collaborators/:username"},"removeDeployKey":{"method":"DELETE","params":{"key_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/keys/:key_id"},"removeProtectedBranchAdminEnforcement":{"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/enforce_admins"},"removeProtectedBranchAppRestrictions":{"method":"DELETE","params":{"apps":{"mapTo":"data","required":true,"type":"string[]"},"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"},"removeProtectedBranchPullRequestReviewEnforcement":{"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"},"removeProtectedBranchRequiredSignatures":{"headers":{"accept":"application/vnd.github.zzzax-preview+json"},"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_signatures"},"removeProtectedBranchRequiredStatusChecks":{"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_status_checks"},"removeProtectedBranchRequiredStatusChecksContexts":{"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"contexts":{"mapTo":"data","required":true,"type":"string[]"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"},"removeProtectedBranchRestrictions":{"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions"},"removeProtectedBranchTeamRestrictions":{"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"teams":{"mapTo":"data","required":true,"type":"string[]"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"},"removeProtectedBranchUserRestrictions":{"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"users":{"mapTo":"data","required":true,"type":"string[]"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/users"},"replaceProtectedBranchAppRestrictions":{"method":"PUT","params":{"apps":{"mapTo":"data","required":true,"type":"string[]"},"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"},"replaceProtectedBranchRequiredStatusChecksContexts":{"method":"PUT","params":{"branch":{"required":true,"type":"string"},"contexts":{"mapTo":"data","required":true,"type":"string[]"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"},"replaceProtectedBranchTeamRestrictions":{"method":"PUT","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"teams":{"mapTo":"data","required":true,"type":"string[]"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"},"replaceProtectedBranchUserRestrictions":{"method":"PUT","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"users":{"mapTo":"data","required":true,"type":"string[]"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/users"},"replaceTopics":{"headers":{"accept":"application/vnd.github.mercy-preview+json"},"method":"PUT","params":{"names":{"required":true,"type":"string[]"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/topics"},"requestPageBuild":{"method":"POST","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pages/builds"},"retrieveCommunityProfileMetrics":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/community/profile"},"testPushHook":{"method":"POST","params":{"hook_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/hooks/:hook_id/tests"},"transfer":{"headers":{"accept":"application/vnd.github.nightshade-preview+json"},"method":"POST","params":{"new_owner":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"team_ids":{"type":"integer[]"}},"url":"/repos/:owner/:repo/transfer"},"update":{"method":"PATCH","params":{"allow_merge_commit":{"type":"boolean"},"allow_rebase_merge":{"type":"boolean"},"allow_squash_merge":{"type":"boolean"},"archived":{"type":"boolean"},"default_branch":{"type":"string"},"description":{"type":"string"},"has_issues":{"type":"boolean"},"has_projects":{"type":"boolean"},"has_wiki":{"type":"boolean"},"homepage":{"type":"string"},"is_template":{"type":"boolean"},"name":{"type":"string"},"owner":{"required":true,"type":"string"},"private":{"type":"boolean"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo"},"updateBranchProtection":{"method":"PUT","params":{"branch":{"required":true,"type":"string"},"enforce_admins":{"allowNull":true,"required":true,"type":"boolean"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"required_pull_request_reviews":{"allowNull":true,"required":true,"type":"object"},"required_pull_request_reviews.dismiss_stale_reviews":{"type":"boolean"},"required_pull_request_reviews.dismissal_restrictions":{"type":"object"},"required_pull_request_reviews.dismissal_restrictions.teams":{"type":"string[]"},"required_pull_request_reviews.dismissal_restrictions.users":{"type":"string[]"},"required_pull_request_reviews.require_code_owner_reviews":{"type":"boolean"},"required_pull_request_reviews.required_approving_review_count":{"type":"integer"},"required_status_checks":{"allowNull":true,"required":true,"type":"object"},"required_status_checks.contexts":{"required":true,"type":"string[]"},"required_status_checks.strict":{"required":true,"type":"boolean"},"restrictions":{"allowNull":true,"required":true,"type":"object"},"restrictions.apps":{"type":"string[]"},"restrictions.teams":{"required":true,"type":"string[]"},"restrictions.users":{"required":true,"type":"string[]"}},"url":"/repos/:owner/:repo/branches/:branch/protection"},"updateCommitComment":{"method":"PATCH","params":{"body":{"required":true,"type":"string"},"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/comments/:comment_id"},"updateFile":{"deprecated":"octokit.repos.updateFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)","method":"PUT","params":{"author":{"type":"object"},"author.email":{"required":true,"type":"string"},"author.name":{"required":true,"type":"string"},"branch":{"type":"string"},"committer":{"type":"object"},"committer.email":{"required":true,"type":"string"},"committer.name":{"required":true,"type":"string"},"content":{"required":true,"type":"string"},"message":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"path":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"type":"string"}},"url":"/repos/:owner/:repo/contents/:path"},"updateHook":{"method":"PATCH","params":{"active":{"type":"boolean"},"add_events":{"type":"string[]"},"config":{"type":"object"},"config.content_type":{"type":"string"},"config.insecure_ssl":{"type":"string"},"config.secret":{"type":"string"},"config.url":{"required":true,"type":"string"},"events":{"type":"string[]"},"hook_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"remove_events":{"type":"string[]"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/hooks/:hook_id"},"updateInformationAboutPagesSite":{"method":"PUT","params":{"cname":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"source":{"enum":["\"gh-pages\"","\"master\"","\"master /docs\""],"type":"string"}},"url":"/repos/:owner/:repo/pages"},"updateInvitation":{"method":"PATCH","params":{"invitation_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"permissions":{"enum":["read","write","admin"],"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/invitations/:invitation_id"},"updateProtectedBranchPullRequestReviewEnforcement":{"method":"PATCH","params":{"branch":{"required":true,"type":"string"},"dismiss_stale_reviews":{"type":"boolean"},"dismissal_restrictions":{"type":"object"},"dismissal_restrictions.teams":{"type":"string[]"},"dismissal_restrictions.users":{"type":"string[]"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"require_code_owner_reviews":{"type":"boolean"},"required_approving_review_count":{"type":"integer"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"},"updateProtectedBranchRequiredStatusChecks":{"method":"PATCH","params":{"branch":{"required":true,"type":"string"},"contexts":{"type":"string[]"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"strict":{"type":"boolean"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_status_checks"},"updateRelease":{"method":"PATCH","params":{"body":{"type":"string"},"draft":{"type":"boolean"},"name":{"type":"string"},"owner":{"required":true,"type":"string"},"prerelease":{"type":"boolean"},"release_id":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"tag_name":{"type":"string"},"target_commitish":{"type":"string"}},"url":"/repos/:owner/:repo/releases/:release_id"},"updateReleaseAsset":{"method":"PATCH","params":{"asset_id":{"required":true,"type":"integer"},"label":{"type":"string"},"name":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases/assets/:asset_id"},"uploadReleaseAsset":{"method":"POST","params":{"file":{"mapTo":"data","required":true,"type":"string | object"},"headers":{"required":true,"type":"object"},"headers.content-length":{"required":true,"type":"integer"},"headers.content-type":{"required":true,"type":"string"},"label":{"type":"string"},"name":{"required":true,"type":"string"},"url":{"required":true,"type":"string"}},"url":":url"}},"search":{"code":{"method":"GET","params":{"order":{"enum":["desc","asc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"q":{"required":true,"type":"string"},"sort":{"enum":["indexed"],"type":"string"}},"url":"/search/code"},"commits":{"headers":{"accept":"application/vnd.github.cloak-preview+json"},"method":"GET","params":{"order":{"enum":["desc","asc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"q":{"required":true,"type":"string"},"sort":{"enum":["author-date","committer-date"],"type":"string"}},"url":"/search/commits"},"issues":{"deprecated":"octokit.search.issues() has been renamed to octokit.search.issuesAndPullRequests() (2018-12-27)","method":"GET","params":{"order":{"enum":["desc","asc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"q":{"required":true,"type":"string"},"sort":{"enum":["comments","reactions","reactions-+1","reactions--1","reactions-smile","reactions-thinking_face","reactions-heart","reactions-tada","interactions","created","updated"],"type":"string"}},"url":"/search/issues"},"issuesAndPullRequests":{"method":"GET","params":{"order":{"enum":["desc","asc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"q":{"required":true,"type":"string"},"sort":{"enum":["comments","reactions","reactions-+1","reactions--1","reactions-smile","reactions-thinking_face","reactions-heart","reactions-tada","interactions","created","updated"],"type":"string"}},"url":"/search/issues"},"labels":{"method":"GET","params":{"order":{"enum":["desc","asc"],"type":"string"},"q":{"required":true,"type":"string"},"repository_id":{"required":true,"type":"integer"},"sort":{"enum":["created","updated"],"type":"string"}},"url":"/search/labels"},"repos":{"method":"GET","params":{"order":{"enum":["desc","asc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"q":{"required":true,"type":"string"},"sort":{"enum":["stars","forks","help-wanted-issues","updated"],"type":"string"}},"url":"/search/repositories"},"topics":{"method":"GET","params":{"q":{"required":true,"type":"string"}},"url":"/search/topics"},"users":{"method":"GET","params":{"order":{"enum":["desc","asc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"q":{"required":true,"type":"string"},"sort":{"enum":["followers","repositories","joined"],"type":"string"}},"url":"/search/users"}},"teams":{"addMember":{"deprecated":"octokit.teams.addMember() is deprecated, see https://developer.github.com/v3/teams/members/#add-team-member","method":"PUT","params":{"team_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/teams/:team_id/members/:username"},"addOrUpdateMembership":{"method":"PUT","params":{"role":{"enum":["member","maintainer"],"type":"string"},"team_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/teams/:team_id/memberships/:username"},"addOrUpdateProject":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"PUT","params":{"permission":{"enum":["read","write","admin"],"type":"string"},"project_id":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/projects/:project_id"},"addOrUpdateRepo":{"method":"PUT","params":{"owner":{"required":true,"type":"string"},"permission":{"enum":["pull","push","admin"],"type":"string"},"repo":{"required":true,"type":"string"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/repos/:owner/:repo"},"checkManagesRepo":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/repos/:owner/:repo"},"create":{"method":"POST","params":{"description":{"type":"string"},"maintainers":{"type":"string[]"},"name":{"required":true,"type":"string"},"org":{"required":true,"type":"string"},"parent_team_id":{"type":"integer"},"permission":{"enum":["pull","push","admin"],"type":"string"},"privacy":{"enum":["secret","closed"],"type":"string"},"repo_names":{"type":"string[]"}},"url":"/orgs/:org/teams"},"createDiscussion":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"POST","params":{"body":{"required":true,"type":"string"},"private":{"type":"boolean"},"team_id":{"required":true,"type":"integer"},"title":{"required":true,"type":"string"}},"url":"/teams/:team_id/discussions"},"createDiscussionComment":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"POST","params":{"body":{"required":true,"type":"string"},"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/comments"},"delete":{"method":"DELETE","params":{"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id"},"deleteDiscussion":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"DELETE","params":{"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number"},"deleteDiscussionComment":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"DELETE","params":{"comment_number":{"required":true,"type":"integer"},"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/comments/:comment_number"},"get":{"method":"GET","params":{"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id"},"getByName":{"method":"GET","params":{"org":{"required":true,"type":"string"},"team_slug":{"required":true,"type":"string"}},"url":"/orgs/:org/teams/:team_slug"},"getDiscussion":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"GET","params":{"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number"},"getDiscussionComment":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"GET","params":{"comment_number":{"required":true,"type":"integer"},"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/comments/:comment_number"},"getMember":{"deprecated":"octokit.teams.getMember() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-member","method":"GET","params":{"team_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/teams/:team_id/members/:username"},"getMembership":{"method":"GET","params":{"team_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/teams/:team_id/memberships/:username"},"list":{"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/teams"},"listChild":{"headers":{"accept":"application/vnd.github.hellcat-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/teams"},"listDiscussionComments":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"discussion_number":{"required":true,"type":"integer"},"page":{"type":"integer"},"per_page":{"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/comments"},"listDiscussions":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions"},"listForAuthenticatedUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/teams"},"listMembers":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"role":{"enum":["member","maintainer","all"],"type":"string"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/members"},"listPendingInvitations":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/invitations"},"listProjects":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/projects"},"listRepos":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/repos"},"removeMember":{"deprecated":"octokit.teams.removeMember() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-member","method":"DELETE","params":{"team_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/teams/:team_id/members/:username"},"removeMembership":{"method":"DELETE","params":{"team_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/teams/:team_id/memberships/:username"},"removeProject":{"method":"DELETE","params":{"project_id":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/projects/:project_id"},"removeRepo":{"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/repos/:owner/:repo"},"reviewProject":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"project_id":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/projects/:project_id"},"update":{"method":"PATCH","params":{"description":{"type":"string"},"name":{"required":true,"type":"string"},"parent_team_id":{"type":"integer"},"permission":{"enum":["pull","push","admin"],"type":"string"},"privacy":{"enum":["secret","closed"],"type":"string"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id"},"updateDiscussion":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"PATCH","params":{"body":{"type":"string"},"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"},"title":{"type":"string"}},"url":"/teams/:team_id/discussions/:discussion_number"},"updateDiscussionComment":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"PATCH","params":{"body":{"required":true,"type":"string"},"comment_number":{"required":true,"type":"integer"},"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/comments/:comment_number"}},"users":{"addEmails":{"method":"POST","params":{"emails":{"required":true,"type":"string[]"}},"url":"/user/emails"},"block":{"method":"PUT","params":{"username":{"required":true,"type":"string"}},"url":"/user/blocks/:username"},"checkBlocked":{"method":"GET","params":{"username":{"required":true,"type":"string"}},"url":"/user/blocks/:username"},"checkFollowing":{"method":"GET","params":{"username":{"required":true,"type":"string"}},"url":"/user/following/:username"},"checkFollowingForUser":{"method":"GET","params":{"target_user":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/users/:username/following/:target_user"},"createGpgKey":{"method":"POST","params":{"armored_public_key":{"type":"string"}},"url":"/user/gpg_keys"},"createPublicKey":{"method":"POST","params":{"key":{"type":"string"},"title":{"type":"string"}},"url":"/user/keys"},"deleteEmails":{"method":"DELETE","params":{"emails":{"required":true,"type":"string[]"}},"url":"/user/emails"},"deleteGpgKey":{"method":"DELETE","params":{"gpg_key_id":{"required":true,"type":"integer"}},"url":"/user/gpg_keys/:gpg_key_id"},"deletePublicKey":{"method":"DELETE","params":{"key_id":{"required":true,"type":"integer"}},"url":"/user/keys/:key_id"},"follow":{"method":"PUT","params":{"username":{"required":true,"type":"string"}},"url":"/user/following/:username"},"getAuthenticated":{"method":"GET","params":{},"url":"/user"},"getByUsername":{"method":"GET","params":{"username":{"required":true,"type":"string"}},"url":"/users/:username"},"getContextForUser":{"headers":{"accept":"application/vnd.github.hagar-preview+json"},"method":"GET","params":{"subject_id":{"type":"string"},"subject_type":{"enum":["organization","repository","issue","pull_request"],"type":"string"},"username":{"required":true,"type":"string"}},"url":"/users/:username/hovercard"},"getGpgKey":{"method":"GET","params":{"gpg_key_id":{"required":true,"type":"integer"}},"url":"/user/gpg_keys/:gpg_key_id"},"getPublicKey":{"method":"GET","params":{"key_id":{"required":true,"type":"integer"}},"url":"/user/keys/:key_id"},"list":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"}},"url":"/users"},"listBlocked":{"method":"GET","params":{},"url":"/user/blocks"},"listEmails":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/emails"},"listFollowersForAuthenticatedUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/followers"},"listFollowersForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/followers"},"listFollowingForAuthenticatedUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/following"},"listFollowingForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/following"},"listGpgKeys":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/gpg_keys"},"listGpgKeysForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/gpg_keys"},"listPublicEmails":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/public_emails"},"listPublicKeys":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/keys"},"listPublicKeysForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/keys"},"togglePrimaryEmailVisibility":{"method":"PATCH","params":{"email":{"required":true,"type":"string"},"visibility":{"required":true,"type":"string"}},"url":"/user/email/visibility"},"unblock":{"method":"DELETE","params":{"username":{"required":true,"type":"string"}},"url":"/user/blocks/:username"},"unfollow":{"method":"DELETE","params":{"username":{"required":true,"type":"string"}},"url":"/user/following/:username"},"updateAuthenticated":{"method":"PATCH","params":{"bio":{"type":"string"},"blog":{"type":"string"},"company":{"type":"string"},"email":{"type":"string"},"hireable":{"type":"boolean"},"location":{"type":"string"},"name":{"type":"string"}},"url":"/user"}}};

/***/ }),

/***/ 742:
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747)
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = __webpack_require__(818)
} else {
  core = __webpack_require__(197)
}

module.exports = isexe
isexe.sync = sync

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er)
        } else {
          resolve(is)
        }
      })
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null
        is = false
      }
    }
    cb(er, is)
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 753:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var endpoint = __webpack_require__(385);
var universalUserAgent = __webpack_require__(796);
var isPlainObject = _interopDefault(__webpack_require__(696));
var nodeFetch = _interopDefault(__webpack_require__(454));
var requestError = __webpack_require__(463);

const VERSION = "5.3.1";

function getBufferResponse(response) {
  return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
  if (isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  let headers = {};
  let status;
  let url;
  const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
  return fetch(requestOptions.url, Object.assign({
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect: requestOptions.redirect
  }, requestOptions.request)).then(response => {
    url = response.url;
    status = response.status;

    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }

    if (status === 204 || status === 205) {
      return;
    } // GitHub API returns 200 for HEAD requsets


    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }

      throw new requestError.RequestError(response.statusText, status, {
        headers,
        request: requestOptions
      });
    }

    if (status === 304) {
      throw new requestError.RequestError("Not modified", status, {
        headers,
        request: requestOptions
      });
    }

    if (status >= 400) {
      return response.text().then(message => {
        const error = new requestError.RequestError(message, status, {
          headers,
          request: requestOptions
        });

        try {
          let responseBody = JSON.parse(error.message);
          Object.assign(error, responseBody);
          let errors = responseBody.errors; // Assumption `errors` would always be in Array Fotmat

          error.message = error.message + ": " + errors.map(JSON.stringify).join(", ");
        } catch (e) {// ignore, see octokit/rest.js#684
        }

        throw error;
      });
    }

    const contentType = response.headers.get("content-type");

    if (/application\/json/.test(contentType)) {
      return response.json();
    }

    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
      return response.text();
    }

    return getBufferResponse(response);
  }).then(data => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch(error => {
    if (error instanceof requestError.RequestError) {
      throw error;
    }

    throw new requestError.RequestError(error.message, 500, {
      headers,
      request: requestOptions
    });
  });
}

function withDefaults(oldEndpoint, newDefaults) {
  const endpoint = oldEndpoint.defaults(newDefaults);

  const newApi = function (route, parameters) {
    const endpointOptions = endpoint.merge(route, parameters);

    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint.parse(endpointOptions));
    }

    const request = (route, parameters) => {
      return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
    };

    Object.assign(request, {
      endpoint,
      defaults: withDefaults.bind(null, endpoint)
    });
    return endpointOptions.request.hook(request, endpointOptions);
  };

  return Object.assign(newApi, {
    endpoint,
    defaults: withDefaults.bind(null, endpoint)
  });
}

const request = withDefaults(endpoint.endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  }
});

exports.request = request;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 761:
/***/ (function(module) {

module.exports = require("zlib");

/***/ }),

/***/ 763:
/***/ (function(module) {

module.exports = removeHook

function removeHook (state, name, method) {
  if (!state.registry[name]) {
    return
  }

  var index = state.registry[name]
    .map(function (registered) { return registered.orig })
    .indexOf(method)

  if (index === -1) {
    return
  }

  state.registry[name].splice(index, 1)
}


/***/ }),

/***/ 768:
/***/ (function(module) {

"use strict";

module.exports = function (x) {
	var lf = typeof x === 'string' ? '\n' : '\n'.charCodeAt();
	var cr = typeof x === 'string' ? '\r' : '\r'.charCodeAt();

	if (x[x.length - 1] === lf) {
		x = x.slice(0, x.length - 1);
	}

	if (x[x.length - 1] === cr) {
		x = x.slice(0, x.length - 1);
	}

	return x;
};


/***/ }),

/***/ 769:
/***/ (function(module) {

"use strict";


// Manually added data to be used by sbcs codec in addition to generated one.

module.exports = {
    // Not supported by iconv, not sure why.
    "10029": "maccenteuro",
    "maccenteuro": {
        "type": "_sbcs",
        "chars": "A??E?OUa??a???e???i????o?ooou??u†°?￡§?¶sRc??¨≠????????∂∑??????????￢√???≪≫…???O????“”‘’÷????????????????A??I???OO??U?????Yy??????"
    },

    "808": "cp808",
    "ibm808": "cp808",
    "cp808": {
        "type": "_sbcs",
        "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп???│┤??????????┐└┴┬├─┼???????????????????┘┌?????рстуфхцчшщъыьэюяЁё??????°?・√№?■?"
    },

    // Aliases of generated encodings.
    "ascii8bit": "ascii",
    "usascii": "ascii",
    "ansix34": "ascii",
    "ansix341968": "ascii",
    "ansix341986": "ascii",
    "csascii": "ascii",
    "cp367": "ascii",
    "ibm367": "ascii",
    "isoir6": "ascii",
    "iso646us": "ascii",
    "iso646irv": "ascii",
    "us": "ascii",

    "latin1": "iso88591",
    "latin2": "iso88592",
    "latin3": "iso88593",
    "latin4": "iso88594",
    "latin5": "iso88599",
    "latin6": "iso885910",
    "latin7": "iso885913",
    "latin8": "iso885914",
    "latin9": "iso885915",
    "latin10": "iso885916",

    "csisolatin1": "iso88591",
    "csisolatin2": "iso88592",
    "csisolatin3": "iso88593",
    "csisolatin4": "iso88594",
    "csisolatincyrillic": "iso88595",
    "csisolatinarabic": "iso88596",
    "csisolatingreek" : "iso88597",
    "csisolatinhebrew": "iso88598",
    "csisolatin5": "iso88599",
    "csisolatin6": "iso885910",

    "l1": "iso88591",
    "l2": "iso88592",
    "l3": "iso88593",
    "l4": "iso88594",
    "l5": "iso88599",
    "l6": "iso885910",
    "l7": "iso885913",
    "l8": "iso885914",
    "l9": "iso885915",
    "l10": "iso885916",

    "isoir14": "iso646jp",
    "isoir57": "iso646cn",
    "isoir100": "iso88591",
    "isoir101": "iso88592",
    "isoir109": "iso88593",
    "isoir110": "iso88594",
    "isoir144": "iso88595",
    "isoir127": "iso88596",
    "isoir126": "iso88597",
    "isoir138": "iso88598",
    "isoir148": "iso88599",
    "isoir157": "iso885910",
    "isoir166": "tis620",
    "isoir179": "iso885913",
    "isoir199": "iso885914",
    "isoir203": "iso885915",
    "isoir226": "iso885916",

    "cp819": "iso88591",
    "ibm819": "iso88591",

    "cyrillic": "iso88595",

    "arabic": "iso88596",
    "arabic8": "iso88596",
    "ecma114": "iso88596",
    "asmo708": "iso88596",

    "greek" : "iso88597",
    "greek8" : "iso88597",
    "ecma118" : "iso88597",
    "elot928" : "iso88597",

    "hebrew": "iso88598",
    "hebrew8": "iso88598",

    "turkish": "iso88599",
    "turkish8": "iso88599",

    "thai": "iso885911",
    "thai8": "iso885911",

    "celtic": "iso885914",
    "celtic8": "iso885914",
    "isoceltic": "iso885914",

    "tis6200": "tis620",
    "tis62025291": "tis620",
    "tis62025330": "tis620",

    "10000": "macroman",
    "10006": "macgreek",
    "10007": "maccyrillic",
    "10079": "maciceland",
    "10081": "macturkish",

    "cspc8codepage437": "cp437",
    "cspc775baltic": "cp775",
    "cspc850multilingual": "cp850",
    "cspcp852": "cp852",
    "cspc862latinhebrew": "cp862",
    "cpgr": "cp869",

    "msee": "cp1250",
    "mscyrl": "cp1251",
    "msansi": "cp1252",
    "msgreek": "cp1253",
    "msturk": "cp1254",
    "mshebr": "cp1255",
    "msarab": "cp1256",
    "winbaltrim": "cp1257",

    "cp20866": "koi8r",
    "20866": "koi8r",
    "ibm878": "koi8r",
    "cskoi8r": "koi8r",

    "cp21866": "koi8u",
    "21866": "koi8u",
    "ibm1168": "koi8u",

    "strk10482002": "rk1048",

    "tcvn5712": "tcvn",
    "tcvn57121": "tcvn",

    "gb198880": "iso646cn",
    "cn": "iso646cn",

    "csiso14jisc6220ro": "iso646jp",
    "jisc62201969ro": "iso646jp",
    "jp": "iso646jp",

    "cshproman8": "hproman8",
    "r8": "hproman8",
    "roman8": "hproman8",
    "xroman8": "hproman8",
    "ibm1051": "hproman8",

    "mac": "macintosh",
    "csmacintosh": "macintosh",
};



/***/ }),

/***/ 777:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getFirstPage

const getPage = __webpack_require__(265)

function getFirstPage (octokit, link, headers) {
  return getPage(octokit, link, 'first', headers)
}


/***/ }),

/***/ 785:
/***/ (function(module) {

module.exports = [["0","\u0000",127],["a140","　，、。．?；：？！?…‥???・????｜???????（）??｛｝??〔〕??【】??《》??〈〉??「」??『』????"],["a1a1","????‘’“”〝??′＃＆＊※§〃○●△▲◎☆★◇◆□■▽▼??￣￣＿??????????＋－×÷±√＜＞＝≦≧≠∞≒≡?",4,"～∩∪⊥∠∟⊿??∫∮∵∴♀♂??↑↓←→????∥?／"],["a240","＼??＄￥〒￠￡％＠℃?????㎜㎝㎞?㎡㎎㎏㏄°???????瓩糎?",7,"???????┼┴┬┤├?─│?┌┐└┘?"],["a2a1","??????????????０",9,"Ⅰ",9,"?",8,"十?卅Ａ",25,"ａ",21],["a340","ｗｘｙｚΑ",16,"Σ",6,"α",16,"σ",6,"?",10],["a3a1","?",25,"?????"],["a3e1","?"],["a440","一乙丁七乃九了二人儿入八几刀?力匕十卜又三下丈上?丸凡久?也乞于亡兀刃勺千叉口土士夕大女子孑?寸小尢尸山川工己已巳巾干廾弋弓才"],["a4a1","丑丐不中?丹之尹予云井互五亢仁什?仆仇仍今介仄元允?六兮公冗凶分切刈?勾勿化匹午升卅卞厄友及反壬天夫太夭孔少尤尺屯巴幻廿弔引心戈?手扎支文斗斤方日曰月木欠止歹毋比毛氏水火爪父爻片牙牛犬王丙"],["a540","世丕且丘主乍乏乎以付仔仕他仗代令仙仞充兄冉冊冬凹出凸刊加功包匆北匝仟半卉?占卯卮去可古右召叮叩叨?司?叫?只史叱台句叭?四囚外"],["a5a1","央失奴?孕它尼巨巧左市布平幼弁弘弗必戊打???斥旦朮本未末札正母民?永汁汀氾犯玄玉瓜瓦甘生用?田由甲申疋白皮皿目矛矢石示禾穴立丞????亙交亦亥?伉?伊?伍伐休伏仲件任仰??企?光兇兆先全"],["a640","共再冰列刑?刎?劣匈匡匠印危吉吏同吊吐吁吋各向名合吃后??因回??地在圭???夙多夷夸妄奸妃好?如妁字存宇守宅安寺尖屹州帆并年"],["a6a1","式弛忙忖戎戌戍成扣扛托收早旨旬旭曲曳有朽朴朱?次此死?汝汗?江池汐汕???汎灰牟牝百竹米糸缶羊羽老考而耒耳聿肉肋肌臣自至臼舌舛舟艮色艾虫血行衣西阡串亨位住佇佗佞伴佛何估佐佑伽伺伸佃?似但?"],["a740","作?伯低伶余佝?佚兌克免兵冶冷別判利刪?劫助努劬匣即卵吝吭?吾否呎?呆??呈呂君吩告吹吻吸吮?吶吠吼呀?含吟听?困??坊坑址?"],["a7a1","均坎?坐坏圻壯夾妝?妨?妣妙妖妍妤妓妊妥孝孜孚孛完宋宏?局屁尿尾岐岑岔岌巫希序庇床廷弄弟?形彷役忘忌志忍忱快忸?戒我抄抗抖技扶抉?把扼找批?抒?折扮投抓抑?改攻攸旱更束李杏材村杜杖杞杉杆杠"],["a840","杓???求汞沙沁沈??沛汪決沐汰沌汨沖沒汽沃汲汾?沆?沍??沂?灼災灸牢牡?狄狂玖甬甫男甸皂?矣私秀禿究系罕肖肓肝肘肛肚育良芒"],["a8a1","芋芍見角言谷豆豕貝赤走足身車辛辰迂?迅迄巡邑?邪邦那酉釆里防阮?阪?並乖乳事些亞享京佯依侍佳使?供例來侃佰併侈佩佻侖?侏侑?兔兒?兩具其典冽函刻券刷刺到刮制?劾?卒協卓卑卦卷卸?取叔受味呵"],["a940","???咀呻呷咄咒咆呼咐呱呶和??周咋命咎固??坪坩坡坦坤?夜奉奇奈奄奔妾妻委妹?姑姆姐?始姓?????孟孤季宗定官宜宙宛尚屈居"],["a9a1","屆岷岡岸岩岫岱岳?帚帖?帛帑幸庚店府底庖延弦弧弩往征彿彼忝忠忽念忿怏?怯?怖怪怕怡性怩怫怛或?房?所承拉拌??拂抹拒招披拓拔?拈?抽押拐拙拇拍抵?抱拘?拗拆抬?放斧於旺昔易昌昆昂明昀昏昕昊"],["aa40","昇服朋杭枋枕東果杳杷枇枝林杯杰板枉松析杵枚?杼杪杲欣武?歿氓氛泣注泳沱泌泥河沽沾沼波沫法泓沸泄油況沮泗泅泱沿治泡泛泊?泯???"],["aaa1","?炎炒炊炙爬爭?版牧物?狎狙狗狐玩?????疝?疚的盂盲直知?社祀祁秉?空穹竺糾罔羌?者肺肥肢肱股?肩肴肪肯臥臾舍芳芝芙芭芽芟芹花芬芥芯芸????虎虱初表軋迎返近邵邸邱?采金長門阜陀阿阻附"],["ab40","陂隹雨青非亟亭亮信侵侯便?俑?保促侶俘俟俊俗侮俐俄係俚俎???冒冑冠?剃削前剌剋則勇勉勃勁匍南卻厚叛咬哀咨?哉咸?咳哇哂咽?品"],["aba1","哄哈咯咫??咩??囿垂型垠垣垢城?垓奕契奏奎奐姜?姿?姨娃姥姪姚姦威姻孩宣宦室客宥封屎屏屍屋峙?巷帝帥?幽庠度建?弭?很待徊律徇後?怒思怠急怎怨恍恰恨恢恆恃恬恫恪恤扁拜?按?拭持拮?指拱拷"],["ac40","拯括拾?挑挂政故斫施既春昭映昧是星昨昱昤曷柿染柱柔某柬架枯柵柩柯柄柑枴柚?枸柏柞柳??柢柝?歪殃殆段毒??泉洋洲洪流津洌?洞洗"],["aca1","活洽派洶洛???洸洩?洵?洫炫為炳炬炯炭炸炮?爰牲?牴狩狠狡?珊玻玲珍珀玳甚?畏界?畋疫?疥?疣癸皆皇皈盈盆盃?省?相眉看盾?眇矜砂研砌??祉祈祇禹禺科秒秋穿突竿??紂紅紀??約紆缸美?耄"],["ad40","耐??耶胖胥胚胃胄背胡胛胎胞胤胝致?苧范茅苣苛苦茄若茂茉苒苗英茁苜苔苑苞苓苟?茆虐虹虻?衍衫要?計訂訃貞負赴赳?軍軌述迦迢迪迥"],["ada1","迭迫??郊郎郁?酋酊重閂限陋陌降面革韋韭音頁風飛食首香乘亳?倍倣俯倦倥俸倩倖倆?借倚倒們俺?倔倨?倡個候?俳修倭倪俾倫倉兼冤冥冢凍凌准凋剖?剔剛?匪卿原?叟哨唐???哥哲唆哺唔哩哭員?哮?"],["ae40","哦?唇哽唏圃圄?埔埋埃?夏套奘奚娑娘娜娟???娠?娩娥?娉孫?宰害家宴宮宵容宸射屑展屐峭峽峻峪峨峰島??差席師庫庭座弱徒徑徐恙"],["aea1","恣恥恐恕恭恩息悄悟悚悍悔悌悅悖扇拳挈拿?挾振捕??捏捉挺捐挽?挫挨捍捌效?料旁旅時晉晏晃晒??晁書朔朕朗校核案框桓根桂桔栩梳栗?桑栽柴桐桀格桃株?栓?桁殊殉殷氣???氤泰浪涕消涇浦浸海浙涓"],["af40","浬?浮浚浴浩涌?浹涅?????烙烈烏?特狼狹狽狸狷?班琉珮珠珪珞畔畝畜畚留疾病症疲疳疽疼疹痂疸皋皰益盍?眩真眠?矩?砧??破?"],["afa1","砥?砠?砲祕祐祠祟祖神祝祗祚秤秣秧租秦秩秘窄窈站笆笑粉紡紗紋紊素索純紐紕級紜納紙紛缺罟羔翅翁耆耘耕耙耗耽耿胱脂?脅?胴脆胸?脈能脊胼胯臭??舐航舫?般芻茫荒?荊茸荐草茵茴荏茲茹茶茗荀茱茨?"],["b040","虔蚊蚪蚓蚤蚩蚌蚣?衰衷袁袂衽?記訐討訌?訊託訓訖??豈豺豹財貢起躬軒?軏辱送逆迷退迺迴逃追逅迸?郡?郢酒配酌釘針釗釜?閃院陣?"],["b0a1","陛陝除?陞隻飢馬骨高鬥鬲鬼乾?偽停假偃?做偉健偶?偕偵側?偏倏??兜冕凰剪副勒務勘動匐匏匙匿區?參曼商??啄????唱啖問?唯?唸售啜?啣唳?啗圈國圉域堅堊堆埠?基堂堵執培?奢娶婁婉婦婪婀"],["b140","娼婢婚婆?孰寇寅寄寂宿密尉專將屠??崇?崎崛崖崢崑崩崔崙?崧崗?常帶帳帷康庸庶庵?張強彗彬彩彫得徙從徘御徠??患悉悠??悴?悽"],["b1a1","情?悵惜悼惘惕惆惟悸惚惇戚戛扈掠控捲掖探接捷捧掘措?掩掉掃掛捫推?授?採掬排掏掀捻捩捨捺敝敖救教敗?敏敘敕?斜斛斬族旋旌?晝?晤晨晦晞曹勗望梁梯梢梓梵桿桶梱梧梗械梃棄梭?梅梔條梨梟??欲殺"],["b240","毫毬?涎涼淳淙液淡淌淤添淺清淇淋涯淑?淞淹涸混淵淅淒渚涵?淫淘淪深淮淨淆??淬?淦烹焉?烽?爽牽犁猜猛猖??率琅?球理現?瓠瓶"],["b2a1","瓷甜?略畦畢異疏痔痕疵痊痍皎?盒盛眷?眼?眸眺硫?硎祥票祭移窒窕笠笨笛第符笙笞?粒粗粕絆絃統紮紹??細紳組累終紲??羞羚翌?習耜聊聆脯?脣?脩??舂舵舷舶船莎莞??莢莖莽莫?莊莓莉莠荷荻荼"],["b340","??處彪蛇?蚶蛄?蛆蛋?蚯蛉術袞袈被袒袖袍袋覓規訪訝訣訥許設訟訛??豚販責貫貨貪貧赧赦趾趺軛軟這逍通逗連速逝逐逕逞造透逢逖?途"],["b3a1","部郭都?野釵釦釣釧釭?閉陪陵陳陸陰?陶陷陬雀雪?章竟頂頃魚鳥鹵鹿麥麻?傍傅備傑傀?傘傚最凱割剴創剩勞勝勛博厥啻喀喧啼喊喝喘?喜喪?喇喋喃?單喟唾?喚?喬?啾喉喫喙圍堯堪場堤堰報堡堝?壹壺奠"],["b440","?媚婿媒媛?孳孱寒富寓寐尊尋就嵌嵐??巽幅帽幀幃幾廊廁廂?弼彭復循徨惑惡悲悶惠??惺愕惰惻惴慨惱愎惶愉愀?戟扉掣掌描揀揩揉揆?"],["b4a1","插揣提握揖?揮捶援?換?揚?敞敦敢散斑斐斯普晰晴晶景暑智??曾替期朝棺棕棠棘棗椅棟?森棧棹棒棲棣棋棍植椒椎棉棚楮?款欺欽殘殖殼毯???港游?渡?湧湊渠渥渣減湛湘渤湖湮渭渦湯?湍渺測湃渝渾滋"],["b540","?渙湎??湲?湟焙焚焦?無然煮焜牌?犀猶猥猴猩琺琪琳琢琥琵琶琴??琦?甥甦畫番痢痛痣痙痘痞?登發皖皓皴盜?短硝硬硯稍稈程?稀窘"],["b5a1","窗窖童竣等策筆筐筒答筍筋筏筑粟粥絞結絨?紫絮絲絡給絢?絳善翔翕耋聒肅腕腔腋腑腎脹腆脾?腓腴舒舜菩萃?萍菠菅萋菁華菱菴著?菰萌菌菽菲菊萸萎萄菜萇?菟?蛟蛙蛭蛔蛛蛤?蛞街裁裂袱覃視註詠評詞証詁"],["b640","詔詛詐詆訴診訶?象貂貯貼貳貽賁費賀貴買貶貿貸越超趁?距跋跚?跌跛?軻軸軼辜逮逵週逸進逶鄂郵??酣酥量鈔鈕??鈞鈍鈐?鈑閔閏開閑"],["b6a1","間閒?隊階隋陽隅隆隍陲?雁雅雄集雇?雲?項順須??飯飩飲飭馮馭?黍黑亂傭債傲傳僅傾催傷???剿?剽募勦勤勢勣匯嗟????嗜嗇?嗣嗤?嗚?嗅???園圓塞塑塘塗塚塔填??塊塢塒塋奧嫁嫉嫌媾媽媼"],["b740","?嫂?嵩嵯幌幹廉廈?彙?微愚意慈感想愛惹愁愈慎慌慄慍愾愴愧愍愆愷戡?搓搾??搭?搬搏搜?損搶搖搗搆敬斟新暗暉暇暈暖暄暘?會榔業"],["b7a1","楚楷楠楔極椰概楊楨楫楞楓楹?楝??歇?毀殿毓?溢溯滓溶滂源溝?滅溥溘?溺?滑準溜滄滔溪??煎煙煩煤煉照煜煬煦煌煥?煆?煖爺牒猷獅猿猾瑯瑚瑕瑟瑞瑁琿瑙瑛瑜當畸?痰瘁痲?痺痿痴痳盞盟睛睫睦?督"],["b840","睹???睥睨?矮碎?碗?碌?硼碑碓?祺祿禁萬禽稜稚稠稔稟?窟??節?筮筧粱粳?經絹??綏絛置罩罪署義羨群聖聘肆肄腱腰腸腥腮?腫"],["b8a1","腹腺腦舅艇蒂葷落萱葵葦葫葉葬葛萼萵葡董葩葭葆虞虜號蛹?蜈?蜀蛾蛻蜂蜃蜆蜊衙裟裔裙補裘裝裡?裕??解詫該詳試詩詰誇詼詣誠話誅詭詢詮詬詹???豢貊貉賊資賈賄貲賃賂?跡跟跨路跳?跪???較載軾輊"],["b940","辟農運遊道遂達逼違遐遇遏過遍遑逾遁鄒?酬酪酩釉鈷鉗??鉀?鉛鉋鉤鉑鈴鉉?鉅鈹鈿鉚閘隘隔隕雍雋雉?雷電雹零靖靴?預頑頓?頒頌飼飴"],["b9a1","飽飾馳?馴?鳩?鼎鼓鼠僧僮僥僖僭僚僕像僑???兢?劃?匱厭嗾?嘛嘗嗽嘔嘆嘉??嗷嘖????團圖塵塾境墓?塹墅?壽夥夢?奪奩嫡嫦嫩嫗嫖?嫣孵寞寧寡寥實寨寢寤察對?嶄嶇?幣幕幗幔廓廖弊?彰徹慇"],["ba40","愿態慷慢慣慟慚慘慵截?摘?撤摸?摺?摧搴??敲斡旗?暢?暝榜?榕槁榮槓構榛?榻?榴槐槍?槌?槃?歉歌??演滾漓滴?漾漠漬漏漂漢"],["baa1","滿滯漆漱漸漲漣漕漫?澈?滬漁滲滌滷熔熙煽熊熄?爾犒犖獄?瑤瑣瑪瑰?甄疑瘧瘍瘋瘉?盡監??睿睡磁?碧?碩碣禎福禍種稱窪窩竭端管箕箋筵算箝箔箏箸箇?粹粽精綻綰綜綽綾綠緊綴網綱綺綢綿綵綸維緒緇綬"],["bb40","罰翠翡?聞聚肇腐膀膏膈膊腿膂臧臺與?舞?蓉蒿蓆蓄蒙?蒲蒜蓋蒸??蒐蒼蓑蓊蜿蜜蜻?蜥蜴蜘蝕蜷蜩裳褂裴裹裸製裨??誦誌語誣認誡誓誤"],["bba1","?誥誨誘誑誚誧豪貍貌賓賑?赫趙?跼輔輒輕輓辣遠遘遜遣遙遞???鄙??酵酸酷?鉸銀銅銘銖?銓銜??銑?閨?閣閥閤隙障際雌?需靼鞅韶頗領颯颱餃餅餌餉駁?骰髦魁魂鳴鳶鳳麼鼻齊億儀僻僵價儂?儉?凜"],["bc40","劇劈劉劍??厲???嘲?嘴嘩?噎?噴嘶嘯??墟增墳墜墮???嬉嫻嬋?嬌?寮寬審寫層履嶝?幢幟幡廢廚廟廝廣廠彈影德?慶慧慮慝慕憂"],["bca1","?慰慫慾憧憐憫憎憬憚憤憔憮戮摩摯?撞撲撈?撰撥撓撕撩撒撮播撫撚????敵敷數暮暫暴?樣樟槨?樞標槽模樓樊?樂樅槭?歐歎殤毅毆漿潼澄?潦潔澆潭潛潸潮澎潺潰潤澗潘滕潯?潟熟熬熱熨??獎獗瑩璋璃"],["bd40","瑾?畿瘠?瘟瘤?瘡瘢皚皺盤瞎??瞑瞋磋磅確磊碾?碼磐稿稼穀稽稷稻窯窮箭箱範箴篆篇篁?篌糊締練緯緻緘緬緝編?線緞緩??緲?罵罷羯"],["bda1","翩??膜膝膠膚?蔗蔽蔚蓮蔬蔭蔓蔑?蔡蔔蓬?蓿蔆螂蝴蝶蝠蝦蝸蝨蝙蝗蝌蝓衛衝褐複褒褓?褊誼諒談諄誕請諸課?諂調誰論諍?誹諛豌豎豬賠賞賦賤?賭賢賣賜質?赭?趣?踐踝?踏?踟?踞?輝輛輟輩輦輪輜?"],["be40","?適遮遨遭遷鄰鄭鄧?醇醉醋???銷鋪?鋤???鋒???閭?霄霆震?靠鞍鞋鞏頡???養餓餒餘駝駐駟駛駑駕駒??髮髯鬧魅魄?魯鴆鴉"],["bea1","鴃麩麾黎墨齒儒儘儔?儕冀冪凝劑?勳?噫??噤噸噪器???噬??壁墾壇壅奮??學寰導彊憲憑憩憊懍憶憾懊懈戰擅擁?撻撼據?擇擂操?擒擔?整?曉暹曄曇暸樽樸樺橙橫橘樹橄橢橡橋橇樵機橈歙??濂澱澡"],["bf40","濃澤濁?澳激澹????熾燉燐燒燈燕熹燎??燃?獨???璟璞瓢甌甍瘴??盧盥瞠瞞?瞥磨磚磬磧禦積穎穆??窺?簑築篤??篩篦?糖縊"],["bfa1","??縛縣縞?縉?罹羲翰??耨膳膩膨臻興艘艙蕊蕙蕈蕨蕩蕃蕉蕭蕪??螟?螢融衡褪?褥褫?親覦諦諺諫諱謀諜諧諮諾謁謂諷諭諳諶?豫??賴蹄?踴蹂?踵輻輯輸輳辨?遵?選遲遼遺?醒錠?鋸?錯錢鋼錫?錚"],["c040","錐錦錡?錮錙閻隧隨險雕霎霑霖霍霓霏?靜靦鞘?頸頻頷頭?頤餐館餞?餡?駭駢駱骸骼髻髭鬨鮑鴕鴣鴦鴨鴒鴛默黔龍龜優償儡儲勵?嚀??嚇"],["c0a1","嚏壕壓壑?嬰嬪?孺??嶼嶺嶽嶸?彌徽應?懇懦懋戲戴擎?擘擠?擦擬擱擢?斂斃曙曖檀?檄檢檜櫛檣橾檗檐檠???氈濘濱濟濠濛濤濫濯澀濬濡?濕濮?燧營燮燦燥燭燬?燠爵牆獰獲?環??癆療癌盪瞳?瞰瞬"],["c140","?瞭矯??磴磯礁禧禪穗窿簇簍?篷?篠糠糜糞糢糟??縮績繆縷縲繃縫總縱?繁?縹?縵???翳翼?聲聰聯聳臆?膺臂臀膿膽臉膾臨舉艱薪"],["c1a1","薄蕾薜薑薔薯薛薇薨薊虧蟀?螳蟒蟆螫螻螺?蟋褻褶襄褸?覬謎謗謙講?謠謝謄謐豁谿?賺賽購?賻趨蹉?蹈蹊轄輾轂轅輿避遽還邁邂邀???醜鍍?錨鍵??鍋錘鍾鍬鍛鍰?鍔闊?闌??隱隸雖霜霞鞠韓顆颶?騁"],["c240","駿鮮鮫鮪鮭鴻鴿麋黏點黜黝黛鼾齋叢?嚮壙壘?彝懣戳擴擲擾?擺??斷曜朦檳檬櫃檻檸櫂檮?歟歸殯瀉瀋濾?濺瀑瀏燻燼燾?獷獵璧?甕癖癘"],["c2a1","癒瞽瞿瞻瞼礎禮穡穢?竄竅簫簧簪?簣簡糧織繕繞繚?繒繙?翹翻職聶臍?舊藏薩藍藐藉薰薺薹薦蟯?蟲蟠覆覲觴謨謹謬謫豐贅蹙蹣?蹤蹟蹕?轉轍邇邃?醫?釐鎔?鎖??鎮鎬鎰?鎚鎗闔闖?闕離雜雙雛?霤鞣鞦"],["c340","鞭?額顏題顎??餾?餽餮馥騎??鬆魏魎魍鯊鯉??鯀鵑鵝鵠黠鼕鼬?嚥壞壟?寵?廬懲懷懶?攀?曠曝??櫚櫓瀛瀟瀨瀚瀝瀕瀘爆爍牘犢獸"],["c3a1","獺璽瓊瓣疇疆?癡矇礙?穫穩簾簿簸簽簷籀?繭繹繩繪羅?羶羹羸臘藩藝藪藕藤藥藷蟻蠅蠍蟹蟾襠襟襖襞譁譜識證譚譎譏??贈贊蹼蹲躇蹶??蹴?轎辭邊???鏡鏑?鏃鏈?鏝鏖??鏘鏤鏗鏨關隴難霪霧靡韜韻類"],["c440","願顛?饅饉?騙?鯨?鯖鯛鶉鵡鵲?鵬麒麗麓?勸??嚶嚴嚼壤孀孃?寶巉懸懺攘??曦朧?瀾瀰瀲爐獻瓏癢?礦礪礬礫竇競籌籃籍糯?辮繽繼"],["c4a1","纂罌耀臚艦藻藹?藺蘆蘋蘇蘊?蠕襤覺觸議譬警譯譟譫贏贍?躁躅?醴釋鐘鐃?闡霰飄饒饑馨騫騰騷?鰓鰍鹹?黨?齟齣齡儷?囁囀囂?屬巍懼懾攝攜?曩櫻欄櫺殲灌爛犧?瓔癩?籐纏續?蘗蘭蘚蠣蠢蠡?襪?覽譴"],["c540","護譽贓躊躍躋轟辯醺??鐵鐺鐸?鐫闢霸霹露響顧顥饗驅驃驀騾髏魔魑鰭鰥鶯鶴鷂鶸麝黯??齦齧儼儻囈????巒彎懿攤權歡灑灘??疊?癬"],["c5a1","禳籠籟聾聽臟襲襯?讀贖?躑躓轡?鑄鑑鑒霽霾韃?顫饕驕驍?鬚??鰾鰻鷓??齬齪??巖戀攣攫攪???竊籤?籥纓纖纔??蘿蠱變?邏?鑠?靨顯?驚驛驗髓體髑?鱗??麟黴囑?攬??癲矗罐羈蠶蠹衢讓讒"],["c640","讖艷?釀鑪靂靈靄韆顰驟鬢魘?鷹鷺?鹽鼇齷齲廳欖灣籬?蠻觀躡釁?鑰顱??鬣黌?矚讚鑷?驢驥纜?躪?鑽鑾鑼?鱸黷?鑿鸚爨驪鬱鸛鸞?"],["c940","乂?凵匚厂万???囗?屮彳??与??仂????????夬??旡殳?气爿丱丼???仡仝???????????尻??????戉??"],["c9a1","??氿???????伎?????伀价?伝???????冱???劦??卍???????????????孖???????幵庄???????扞?????扠??????朸?机朿?????汜????"],["ca40","?????????网艸????虍襾?????????佖???体???????????冏????劭???卲???????????"],["caa1","吽?????囮??????????????????????尨???????????????????????????????忤????忻???抃???抔?扱?????????攷???????"],["cb40","杙?????????????????汯?沚?????汳????????狃狆????????町?疔???????????????"],["cba1","???豸?辿???????阨阯??侘佼????佶???????侚?????侔?侒??????冾??刳??劼???????????????????????????囹?????????????"],["cc40","?????妺??妲?????????????孥?宕???????岨岬????????岶?岦??帙?????徂??忞??怦怙??"],["cca1","?????????怐?????怜戔???拑???拊???抻??????昉????旻昃????????枅??????????枌???????????殀???沓???泙???????沺????"],["cd40","?泝????????????????炅??????????????狒?????????????????????????矼???"],["cda1","???????籵???????肭???芫????????????????????????????????邯???????俍???俉??俔????俛??????剄?勀????厖?厘???咥?"],["ce40","?????????呰咼咢咾??????垤?????????????奓?????????姶???????????????????"],["cea1","???峇????????????????????????彖?????????????恂恟???????拏??拵?????挌?拶???????????昶??昵昜??????昴?昮朏?柁???"],["cf40","?枻?柘柀枷??柤???枳??柮??枹柎柧???柆???????柊?????殄?毖毘??????洟??洒?泚洳洄洙??????"],["cfa1","???????????????????????????????????????珂珈??????????????瓮???????眈?眄???盻?矧???砒????????????秕?????"],["d040","?竑???????粁???罘?????????????????胙???????????苙?苹?????苫?苴?苡???苻???"],["d0a1","??苺苳??????????????????????????????陏????倞倅??倢??俵???倬俶?????????党?冓?凄凅?????剞???勍???哢??????哿唄?????"],["d140","?????????????埒?埆?????埇?????????????????????????????????????彧恝恚?"],["d1a1","恁???悒悁?悃?悛悗??????????????????????????????捗????旆旃旄??晟???????栲????栖???栫??桎桄栴??????桍?????????????"],["d240","??????浣浤???????浯?????????????????????????????烝烋????????????????"],["d2a1","????????????珥珖??珣??珒????????????畛????????????眛??????????????????砡????????祓???秬????????????????"],["d340","笄??笏笈笊????????粍?????紘?????????罠?????????????????舁????????????茜?"],["d3a1","???????茖???茯??荅??????????????????蚋??????蚕??????衄?衵?衲??衿??衾??訒?????赶??????????????????????郛??郤?"],["d440","酎???釚陜陟隼?髟鬯?偰???????偲偈????????????偆偀??????????????????????????啅"],["d4a1","????唹???啀???????埜埴堀????堋????埣?????埼????????????????娵????婬????????????????????????寀??崋?崚???????"],["d540","???崟?????????弸???悊?????惓????????????????????????掫掎???据????????掟"],["d5a1","????????晥??晙?晢???????????????桴?梏桷???????桾梛??梠??????????欷欸??殍???淀????涬?????????????????????淕?淏?"],["d640","?淲?????????????焄????????????牾???猝猗???猊??????珸珵???琇????????畤??痒?"],["d6a1","???????????????眥????????砦硅????????????????笵??笥???笳笘???????????粘??紵???紺絅紬????紿??????羝?翊????????"],["d740","????????脛??????????舸舳??????莨??荳??????荵???????莪???????荿?莇??莚????"],["d7a1","????蚰???????????衒???袢???????袙?袗袤??????????????????????跂???????????逋逑??逡??????????酖酘????????釤??"],["d840","???釮????????????馗??傔???????????????????喨???????????????????????"],["d8a1","堙?????????????????????????????????????????????????寔?????????嵋???嵎???嵒???嵂????????幄????????????"],["d940","惲?????????愃??????????????揃撝???揶??揵??掾??揄?????????????????斌????旒"],["d9a1","?????????椌?椄?椪???椏????????棡??椈???棯棆??????椋???棈??????棔??椥?欹??????殕???毳?淼??渟??渼???渫???????????渮?"],["da40","?湜?????湫渹????渧????????????????????????牋???????????????????琮????"],["daa1","???????琩?琲?甯畯????????????睆睇??????????硤?????????????????????竦????筈筌???筅粢?粨粡??絣?絖??絏?絜??????絎???"],["db40","???羡??????????????????????????????????菶???菫?????菘???菎菖?????????"],["dba1","??菇??萓????菻???????????????蛬蛩??????????????袷?????覘覗觝觚??????????詒詈詑????????貰?????????跖?跏????????"],["dc40","????????軫???????????????????????酢??鈊????????釿?鈆???????????????隈"],["dca1","???????雰?????飫?黹??亶?????僊傴?僂?????僉???????????????嗔嗄????????????????????????塙??堽??壼??嫋?????????"],["dd40","?????????寘????????嵬??????幎??????????徭惷?慊???????????????????????"],["dda1","??????????搦?搨???????????????????????暙???????楢?椿?楪椹??楙??????椽??楸椴??楯????楴????楜?????????歃???????"],["de40","??????溏?溟???????溽??滉溷????溲??????????溿??????煇??????煢????????????"],["dea1","????????????????????????????????????畷?????痾痼????????皙???????睚??????碇碚???碕?碆????????????稘稙?稗???"],["df40","?????竫???筴??筥?筱筰????粲????????????????絽??罫罧罨??????耡?????????????"],["dfa1","?????艀??????葹????????????????????葺????萩????????葎??葯????????????葮?????????蛸?蜉??蜍???????????????"],["e040","???觜触??????誂誄???????豊?????貅???????????????????跣???跫?????輅????遒?"],["e0a1","?遉???????????鉈??鈺鉦??鉞銃???????鉧???????鉐?鉎???????????隗雎????????頏?????????骭????鳧?黽?????????????僣?"],["e140","?????????????????????嗹?????????????????????????????????????????"],["e1a1","??嶂??????????????????????????????愬愨??慱慳?慓???慴???慥????????????摶??????摎?????摠???????????暠????榱??"],["e240","榠槎????榑?榎榧??榾?榿?????槊???????槙?????????殞??????????滸???漉?????????"],["e2a1","???????????????????????????????熏?????????????瑢瑳???????甃?????????皸???????睾??碪????????????禊???禔?"],["e340","???????????????箜????箍????箘?箙???????綷?綣????????緋?綯???綟?綮????????"],["e3a1","?????膃???????蒡蒟??????蒹蒴蓁蓍???蓐??蒻?蒔??????蓖???????????????????????????????蜒????????蜚?蜑???裲?裾?裼??"],["e440","????覡??????????????????踉?跿??踊??????????????????????酲?酳???銛?????"],["e4a1","?銚????????銕??銈?????銧鉾??????????靺?????鞄鞁???????????????????髣???????????????????????????噂噌??????"],["e540","??????嘸???墫???????????????????????????嶢????????????廛?廡?????????"],["e5a1","?????????????????????????????????????暲?????樗??????槿?槢樛???槲?樔?槧???槻??槫???????????????????潁???濆?"],["e640","??????????澂????????????????????????????????????????????????????"],["e6a1","??璉????????????????????皜?皞皛????????磑?磔?????????禛??????篋???????糅????????緡?????????????翫??翦???膣?"],["e740","?膕???舖?????????蔀????蔟????????蓴??蔕???蓼?????????????蔦?????蔘??????"],["e7a1","?蝣?????????????蝪?蝎蝟????蝮??????????褌????????????????諏????????誾??????????????賚??????????????????"],["e840","?????????????????遯遧?????鄲??????醂??鋐???鋙?鋏???鋩鋗??????????鋕?鋠?鋧?鋓"],["e8a1","?????????????霈???????????????????餔???????????駘?????髫??髱?魃?魴???魵?????????鴇???鴈?????????儚???叡???"],["e940","???????圜?????墺??????????嬖?????嶬?????嶮??????????廩??廨??徼??憖??懆?懌憺"],["e9a1","???????????????????暾??????????橦?????????????????????????????橆?歔??殪殫???????澣???????????????澪???"],["ea40","?????????????燁?燔?????????????????獪?????????????????瘰???????????"],["eaa1","?????????????????窶???????篝?篥??????????糒????縒縡??縟??????縢縋???????????????????膵?膰???????????蕫?蕓?蕘"],["eb40","蕀??蕁????蕣???蕎??蕕????????????????????????????????褞?????????????諠"],["eba1","諢????謔諤諟??諞諡??????????賰??????????????踰??????輹??遶????????醐?醍??錞??錆錏????錣???????錝鋺錥?鋹??錂?鋿??錵???"],["ec40","????鋻?閼闍閾閹??????????????????餤?餧?馞駮???????????????髷????????鮓鮒???"],["eca1","?????????????鴟麈???麭???????????????嚆????????????嬲?嬬???????嶷????懃????????擯?擣????????檍??????????檎"],["ed40","?????橿?????歛?????濔??????????????????????????????甑????癈?癇??????瞶"],["eda1","?????磽??????????????????????簀?????篳?????????????????????????縻??縺罅???????????????艚??薀???????薤??"],["ee40","蕷?????蕗????薙????薈????薐?????????????????螯蟄?????螽??????襁????覯????"],["eea1","?謖???????謇?????謚??????貔?????蹐蹌蹇??????醢??????????鍖?鍼?鍜????鍠?????鍗?????????????闇??闃???隰?????霙??鞜"],["ef40","?????????????餬???????馘???????駸?駻???????????鮨????????鮠??鵁???????"],["efa1","???鴾???????????黻????齔龠????????????????????????????擽?????旛曚????????????????瀇??瀁瀅?????瀦????燿燹???"],["f040","?????????甓癜??????皦??????????礒礑???????簟?????????繖?????????????臑?"],["f0a1","?艟??????????????????????????????????????????????????襌???????謳?????謾???謦?????????貘??贄????蹠?????"],["f140","??????轆??????????醯醪?鎌?????鎧????????????鎤???????????????????鞨鞫??"],["f1a1","??????????????騏??????騅??髀髜???鬩?????鯆????????鮹?鵜?????鵙?????????麌???????????????????????????嬾???"],["f240","???????????????櫑??櫟?????櫞????瀧?????????????????????????????????"],["f2a1","????禰????????????繰????????羃羆??????艤????????????????藜?????????蟶蟷??????????????????覈???????譓譖???"],["f340","?????????贇??????????????????????鏞????鏐?????????????????????????"],["f3a1","鞳????????顗????????????????????????????????鯤?鯢鯰鯔??????鯡?????????????鵫??鵰?????鵯??鶇??麑?黼?????????"],["f440","???孅?????????????????櫪櫨????????????????????????????????矍???????"],["f4a1","???????????繻?????聹?臙?艨?蘢??藾??????????蠑??蠖?襦?????????????躄??轗???????醵???鐓???鐔??鐐?鐙????鐇?????鏸??"],["f540","????????????????????饐??饌饋??????????????????鰈??鰒????鰆?鰔鰉??鶤?????"],["f5a1","??????鶚?????鶩??????黥??????齠????儺???囃??????廱懽??????????????????癪????籔?糲纊?纈???罍?????????????????"],["f640","????????襭?????????贐贔????????????鐶?????????鐱闥????????飆???????驂??"],["f6a1","????鬘??????????鰤鰡???鷁??鷏???鶻???鶺???????鶲?????????齎?????????????????????????????????????穰??????"],["f740","糴???羇?艫????????????覿???????譿??躔??????轢???????鑅鑈?????????驎??????"],["f7a1","??????鬻??鱆鱈??鰹?????鰲????????????鷙????????????龕??????????????????欒????????癰?????????????????襴??"],["f840","讌讎?????轤轣?鑢???鑞??????鬟?鱒???????????鷯??鷸????鷦鷲??????鷭?黐????????齏"],["f8a1","????囓????????????????????????????????????????靆靃???????鱧???鱠??????????鷽??????齶???????????????糶?"],["f940","?纛?臠??????????讙????????靉?????????????????????????????鑵???????黶?"],["f9a1","?????????????顳顴???驤?????????????钁驩?鬮鸙???????驫????????碁銹裏墻恒粧嫺??????????????????????????????????"]];

/***/ }),

/***/ 791:
/***/ (function(module) {

module.exports = [["8740","?????　??　?　?????　　　　　?　???　???　?　　　　??"],["8767","??　??　寛　??　?????　???　　　?"],["87a1","　???　　　　　?蒄???蘓????稲?権?????剏???　??垳???　??　??　?　?　?　　　??　???　???"],["8840","?",4,"　?　　??　　?　????　???A?A?E?E?O?O?E???E??E?a?a??e?e?i?i?o?o?u?u???"],["88a1","?u?e???e??e???"],["8940","　　"],["8943","?"],["8946","?滝?釟"],["894c","　?会????????医????声??夲?学?実???斉柾栄?????????????????????"],["89a1","?????刧"],["89ab","????"],["89b0","贋?　"],["89b5","??????　　?　?"],["89c1","???"],["89c5","?????　　　　??亀????????????円?凛??争????厩?厰?参???????????????????"],["8a40","　?"],["8a43","　　　?　?　?　　?　?　??　　　?　　　　??　　　　　　"],["8a64","　　　?　　??　??　　　　??"],["8a76","?　??　　　?　"],["8aa1","　　　?　　?　　　"],["8aac","?　??　"],["8ab2","　　　　　???"],["8abb","?　　??　??　????"],["8ac9","　　　　"],["8ace","　　??　?　　?　　　??　"],["8adf","　　　　　　　　?　　　?　　　　?　　　　"],["8af6","　　　　　?　?　"],["8b40","　　　　　　　?　　　　　　　　????"],["8b55","　??　　????　???　?　　　　?　?　?　　　　　　　　　　　?　　　　?　"],["8ba1","　　　　　?　　　　　　　　???　????????　　???丨夂　　靑　????彑???攵???????　????　?"],["8bde","　??　　???　??????　?????　??黄歯??　???"],["8c40","??　???　?峵?　?　?　辧釶???　　?　????　??　??　?　　靕?匤　??　????????????　???　?"],["8ca1","　椙?　?"],["8ca7","?　??　??讃　　窓????薗??????????　　??娚"],["8cc9","????"],["8cce","?　?　?　?　　??????????　　??"],["8ce6","?　???　????　　???　　諌?　???　?"],["8d40","　"],["8d42","　　??　??　???　?　　??　???????　??????????嶹????弥徃?????愽????????????"],["8da1","???????崕??????????朖??????????????????????????????????????????渕?温?　?????????　澁??????瀬???灯?炉　??　"],["8e40","　?　?　??　?穉　　?穽　?窰?竃?　?竚竝竪?咲　笋??　　???　　??箒箸　?　????　?粃　??　??????糎"],["8ea1","繧?　?　?綉綫??緒　　緤??　?　?　　?纒?????罇?　??　羣　　?　?　?　者??耨?　　耻?聡　?　　　??　脇脚?　?　　擧　舘　?　　?舩　　　?　?荢　　　　　?椛　?"],["8f40","蕋??　　?　　??茘　　　　　???莅?　?菁菓?　?蕚?　　?　葱????　??　　　??????　?　???　????蘖"],["8fa1","　　藁　蘂　　　???　号　??　?　??蠏?????衆　　　衞??袴袵?装?　覇覊覦覩覧?　觧　　????　?　　?　?謌?　　?譌??　讐??　???　　　?　?　　贒?　賛??　?起"],["9040","?　　　?　　竧????輙?　　??　　??　　　廸　迹　　　　?　?　　遡　　邨　?　?都?????　　鈎??鉢　銹　　　　"],["90a1","　錬?　　??　　?鉄　　　?鑛????閠濶?　　　　?????隣　?隶?　?双?　　　　　　　　??????　???靜　??　???　　???????　韮?　響韵　　?頴?顋??　?　　"],["9140","　?????　　喰?????　?　　?????　?　　?髢　髴???　??　?　??　?　鮎　??鰌　?　　　　　　??　??"],["91a1","鷄　　　　　?　　?麕???麪?　??????　?鼈??　????嚊??　韲?齢?竜???　　?　　　?　　?　　??　???　　???穃?　　?　?　　?　　　?　　?　　　?　?　　　"],["9240","　　?　??　　　　　　?　　　?????　??　　　　　??　?　　　鏆　????　?　　?侊　?　　?　　??　　　諚　亘"],["92a1","働??伃　　??偬??俥??????湶　　　?　　冨?　?　　　?　　??　?鍮??　　　　?　???????　　???　?　?　??????坿???　　　　??????　　　　????　"],["9340","?　　??　???　??尞???　　　??　　?　?　??　　　　弌?　　?　??　??　　??　　　　?　　　憙憘恵　　　　"],["93a1","?　　?　　　　?　???　　?　????　　　　?　　　?　　??　　　　　　?　　　?　　　暎　???　　?　　昞　?　　?　　???　梶栞???　　???欅　??????　　?鋲　　"],["9440","?　　???　?　??　?渊????　　烱?犇?　　?　　?　　　　　??　　　悧??????　???　　???　??　　　?"],["94a1","?　?　　???　　?　　?　???　　?　???　　?　　?　?碍????　　?禛???　???　???　　　　　????　　竢?　　　?　??　?????　　　?　　??粮?緜??罎　"],["9540","　　?　?　　?　　?　　　??　　　?　????　?　　?　?　　???胆脉?　飃　艢?　?　?　??　?　?　?　　?　?"],["95a1","???袿??襍　?　　　　　　???????　??　???　???　?????踪?　?????　???　??　??????　?　?　　??閙閧?閖　??　　　?　随　　　?　　　????　"],["9640","??　　??　　　　?????　?靱?　?　　?　?　釥?　　　飜　??????　?????　　????　?　馼???塲　?　"],["96a1","　?　　?????　　?????鰐?鯏　鮟　　??　???　　　　??　　　??　　　萠?　　　?　　?　???鍈　?鉷?俤??　????　　　????瀞瀞?　???????　?　　?　　"],["9740","????　??　??　　?　　　　　?　　?　　　　　????　　?　????　　　　　　　?　?　???　?　　?　　?　?"],["97a1","　　?　　　??　?　　　???　　?　　　??　???　　??　??僴??　??　?　??　???　　???　畑?????????　　?埈?　?　　　　　梹?　　　　　　　　?　　???"],["9840","　　　　?　?　?　　　??　??　　??　????　??　樫　　　　?　　?　?　　　樌　　??　??　　?姫??彜　　??"],["98a1","?　　　?　　?　　?　???　　????　??　???　?燵　???県?沢国???????????畭??????????発　熈??塩???条?????属??売?点??????葈　?栃??"],["9940","???辻?込??????竏??両?筬?簒???????????　総???羮?????笹??????????猪??畠??????"],["99a1","?堺???膓???????芦艶??????榊???惣????????????????蛯????袮????　????????????仮?????躰??転???辷????駄??????????"],["9a40","??鋳????鎭??麿?匁???????関????枠???????惨??????冴??饂???駅???窃???鯱????　?鰺"],["9aa1","?噐???????????????竈?　　　椚?妬　塀??　　　　??　　　呪　　?　　　　　惧　噺　　　　　　楕鰯?　　　　　　尠　帋　　　朞　　　?　　　　?蒭　　　?　　　　?炻　　"],["9b40","　　　　　　?　　??　??　　　　　　?　　　?　?　?　??　"],["9b62","　　　　　　　　　　　　　　??暿　　　?　矗　　?　?朎"],["9ba1","?　　　　　　　??　　　　　　　　　?　?　?　　　垈　?　　　?　?　?　　　?　　奥　　　?　???　　　　?　　　??　　　?　　　　　??　惞　?　　　　　???　　遖　　?　　"],["9c40","?　?　　?　　　　?　　　?　??　??　　?　??　?襷　　　　營　?　　　?　??　?　?　　?　　?　?　?　画?　?"],["9ca1","?　　　?　　?　　?　　??　　蠧裵　　　?　　???秣??　　襃　　??　?　　　??　　??　　　　　　　??　澵　?　?　???　　　　　　?　　??　?　???　　?朶　　　　　"],["9d40","　　　　　　?　　??　??　?　?　　　?　?　　筑　　?　　???　　　　　　　　　　　　　?　　??　?　??　?　??"],["9da1","辺　?　?繿????　　??　　　　　　?　　　　?　　?　??　　?拐　　??　?　?　????　?　??　　　?鵞?瘻??瞹?????????祢??　????　??????　　廐　　　"],["9e40","　???　?靭?賍??????　?　??　??????　疱??????　??　??　?　　　　　　?　?　　　　?　?　　　?"],["9ea1","??　?　　　　恢　　"],["9ead","　　?纎鵐??????????　?　??垪　　"],["9ec5","?　?　??　　?　　　?　　　　??　　??????　??　硺　??????　?????　　"],["9ef5","?　?　　?　???"],["9f40","籖??　屓?　　　?　　　　"],["9f4f","凾　??　麁?????扨??篏鬪籾鬮??鰕???鰛　??寃???????偖??韈鶫轜?鞴???愰"],["9fa1","??鰊?????畆　?剳"],["9fae","???"],["9fb2","?　?　?????　獏?　　"],["9fc1","　盖?个　?衂"],["9fc9","届?僭??巵从?　伹咜????弌?"],["9fdb","???鮗???????"],["9fe7","??罸"],["9feb","?　??"],["9ff0","????抂　??竓　稾?泪??"],["a040","　???痃　?　?狢???瓱?　蘯???"],["a055","　　"],["a058","?　"],["a05b","?癧?鵄鍮鮏?"],["a063","蠏?????犲???　慙???"],["a073","?慯抦?????　?栂?"],["a0a1","?　迚　"],["a0a6","?　???　?"],["a0ae","?"],["a0b0","糂　?????甅瓲???聢　?瓰?眤?　?　??臈??貭??瓸蓚?榲?"],["a0d4","覩???　瓧?????煢恷"],["a0e2","?　?????　　　　　　　　　?　　　　　　??　?麦　"],["a3c0","?",31,"?"],["c6a1","①",9,"?",9,"ⅰ",9,"丶丿亅亠冂冖冫勹匸卩厶夊宀巛?广廴?彡攴无?癶?隶¨?ヽヾゝゞ〃仝々〆〇ー［］?ぁ",23],["c740","す",58,"ァアィイ"],["c7a1","ゥ",81,"А",5,"ЁЖ",4],["c840","Л",26,"ёж",25,"????　?　??"],["c8a1","???　"],["c8cd","￢￤＇＂㈱№℡゛゜????????????????????????????"],["c8f5","??????o???"],["f9fe","?"],["fa40","　?　　???况?　　鍄　?　???　　　　　侫　?　　　　　倩　?　　?　偽儁?????　　?　兪　　　　　　　??　　冲?"],["faa1","?凉????　决??凭??　?刋??劵?劔効勅??勠?　包　??　　　匳?　?　??恊??　???却　?卿　　?厓　厠?厮?　???????叙?　?　　叶　???晗??　　啝咏咤?　　?　"],["fb40","　　????喆喩?　　?　?　??　????????圀??　?　?　??坂?　?　?　　?　????壜　壻寿?　　???梦??"],["fba1","　?啓　?姉　　　　姙　　　?　　?　???　?????　　?　?　広??斈?　??　??　　　寳宝?尅　尓珎?　　???峩峯嶋　　?崘?　岺???　　　?????幵幺　　厦?廐厨　?廴　"],["fc40","?廻?廼??弍　　??　?　　?　??　??　???　　　　釖　　怱?　????　????悳　　　?????慂　　??　憇?　"],["fca1","　?　　懐?　　????　担　?　?　???　　??　?　　擡???携?敍?　　???　?　???　无??　?　　晄　　晋　晧　晳晴　　　　　?　??　　??　杞?杢　　??栢?鈼栁　　桝"],["fd40","　?樋　楳?　椁椀??　??楡　?椶榘?　??槹　　?　????　?欝　惞?歴　?　　　??　?　?氷　　　汚??　?　　　　"],["fda1","　??　鮃　　??　　　涖浜??　　　?　??渝?　港　?　???　???　?　　???潜?潴　??　?　　　　　　?　　　　???????烟????　????煮?　??　?　　　?　??"],["fe40","??????　?牀　????　??犂猪猫　　?　?献??　　珉?　　　??　　　???　?　?瑜　瑠　??瑶????????　"],["fea1","　　　?　　?　甎瓩甞　　?　?畍畊畧?　?　疎????????癶　皐??　　??皷?　葢　　　眞眦着?　?　?　　　??　　棊碯????　???　??　　　???禀　禝　礼??　??　?"]];

/***/ }),

/***/ 796:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var osName = _interopDefault(__webpack_require__(2));

function getUserAgent() {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return "Windows <version undetectable>";
    }

    throw error;
  }
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 807:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = paginate;

const iterator = __webpack_require__(8);

function paginate(octokit, route, options, mapFn) {
  if (typeof options === "function") {
    mapFn = options;
    options = undefined;
  }
  options = octokit.request.endpoint.merge(route, options);
  return gather(
    octokit,
    [],
    iterator(octokit, options)[Symbol.asyncIterator](),
    mapFn
  );
}

function gather(octokit, results, iterator, mapFn) {
  return iterator.next().then(result => {
    if (result.done) {
      return results;
    }

    let earlyExit = false;
    function done() {
      earlyExit = true;
    }

    results = results.concat(
      mapFn ? mapFn(result.value, done) : result.value.data
    );

    if (earlyExit) {
      return results;
    }

    return gather(octokit, results, iterator, mapFn);
  });
}


/***/ }),

/***/ 814:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = which
which.sync = whichSync

var isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

var path = __webpack_require__(622)
var COLON = isWindows ? ';' : ':'
var isexe = __webpack_require__(742)

function getNotFoundError (cmd) {
  var er = new Error('not found: ' + cmd)
  er.code = 'ENOENT'

  return er
}

function getPathInfo (cmd, opt) {
  var colon = opt.colon || COLON
  var pathEnv = opt.path || process.env.PATH || ''
  var pathExt = ['']

  pathEnv = pathEnv.split(colon)

  var pathExtExe = ''
  if (isWindows) {
    pathEnv.unshift(process.cwd())
    pathExtExe = (opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM')
    pathExt = pathExtExe.split(colon)


    // Always test the cmd itself first.  isexe will check to make sure
    // it's found in the pathExt set.
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  if (cmd.match(/\//) || isWindows && cmd.match(/\\/))
    pathEnv = ['']

  return {
    env: pathEnv,
    ext: pathExt,
    extExe: pathExtExe
  }
}

function which (cmd, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  ;(function F (i, l) {
    if (i === l) {
      if (opt.all && found.length)
        return cb(null, found)
      else
        return cb(getNotFoundError(cmd))
    }

    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && (/^\.[\\\/]/).test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    ;(function E (ii, ll) {
      if (ii === ll) return F(i + 1, l)
      var ext = pathExt[ii]
      isexe(p + ext, { pathExt: pathExtExe }, function (er, is) {
        if (!er && is) {
          if (opt.all)
            found.push(p + ext)
          else
            return cb(null, p + ext)
        }
        return E(ii + 1, ll)
      })
    })(0, pathExt.length)
  })(0, pathEnv.length)
}

function whichSync (cmd, opt) {
  opt = opt || {}

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  for (var i = 0, l = pathEnv.length; i < l; i ++) {
    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && /^\.[\\\/]/.test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    for (var j = 0, ll = pathExt.length; j < ll; j ++) {
      var cur = p + pathExt[j]
      var is
      try {
        is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}


/***/ }),

/***/ 816:
/***/ (function(module) {

"use strict";

module.exports = /^#!.*/;


/***/ }),

/***/ 818:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(747)

function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';')
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}


/***/ }),

/***/ 834:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var Buffer = __webpack_require__(293).Buffer;

// Multibyte codec. In this scheme, a character is represented by 1 or more bytes.
// Our codec supports UTF-16 surrogates, extensions for GB18030 and unicode sequences.
// To save memory and loading time, we read table files only when requested.

exports._dbcs = DBCSCodec;

var UNASSIGNED = -1,
    GB18030_CODE = -2,
    SEQ_START  = -10,
    NODE_START = -1000,
    UNASSIGNED_NODE = new Array(0x100),
    DEF_CHAR = -1;

for (var i = 0; i < 0x100; i++)
    UNASSIGNED_NODE[i] = UNASSIGNED;


// Class DBCSCodec reads and initializes mapping tables.
function DBCSCodec(codecOptions, iconv) {
    this.encodingName = codecOptions.encodingName;
    if (!codecOptions)
        throw new Error("DBCS codec is called without the data.")
    if (!codecOptions.table)
        throw new Error("Encoding '" + this.encodingName + "' has no data.");

    // Load tables.
    var mappingTable = codecOptions.table();


    // Decode tables: MBCS -> Unicode.

    // decodeTables is a trie, encoded as an array of arrays of integers. Internal arrays are trie nodes and all have len = 256.
    // Trie root is decodeTables[0].
    // Values: >=  0 -> unicode character code. can be > 0xFFFF
    //         == UNASSIGNED -> unknown/unassigned sequence.
    //         == GB18030_CODE -> this is the end of a GB18030 4-byte sequence.
    //         <= NODE_START -> index of the next node in our trie to process next byte.
    //         <= SEQ_START  -> index of the start of a character code sequence, in decodeTableSeq.
    this.decodeTables = [];
    this.decodeTables[0] = UNASSIGNED_NODE.slice(0); // Create root node.

    // Sometimes a MBCS char corresponds to a sequence of unicode chars. We store them as arrays of integers here. 
    this.decodeTableSeq = [];

    // Actual mapping tables consist of chunks. Use them to fill up decode tables.
    for (var i = 0; i < mappingTable.length; i++)
        this._addDecodeChunk(mappingTable[i]);

    this.defaultCharUnicode = iconv.defaultCharUnicode;

    
    // Encode tables: Unicode -> DBCS.

    // `encodeTable` is array mapping from unicode char to encoded char. All its values are integers for performance.
    // Because it can be sparse, it is represented as array of buckets by 256 chars each. Bucket can be null.
    // Values: >=  0 -> it is a normal char. Write the value (if <=256 then 1 byte, if <=65536 then 2 bytes, etc.).
    //         == UNASSIGNED -> no conversion found. Output a default char.
    //         <= SEQ_START  -> it's an index in encodeTableSeq, see below. The character starts a sequence.
    this.encodeTable = [];
    
    // `encodeTableSeq` is used when a sequence of unicode characters is encoded as a single code. We use a tree of
    // objects where keys correspond to characters in sequence and leafs are the encoded dbcs values. A special DEF_CHAR key
    // means end of sequence (needed when one sequence is a strict subsequence of another).
    // Objects are kept separately from encodeTable to increase performance.
    this.encodeTableSeq = [];

    // Some chars can be decoded, but need not be encoded.
    var skipEncodeChars = {};
    if (codecOptions.encodeSkipVals)
        for (var i = 0; i < codecOptions.encodeSkipVals.length; i++) {
            var val = codecOptions.encodeSkipVals[i];
            if (typeof val === 'number')
                skipEncodeChars[val] = true;
            else
                for (var j = val.from; j <= val.to; j++)
                    skipEncodeChars[j] = true;
        }
        
    // Use decode trie to recursively fill out encode tables.
    this._fillEncodeTable(0, 0, skipEncodeChars);

    // Add more encoding pairs when needed.
    if (codecOptions.encodeAdd) {
        for (var uChar in codecOptions.encodeAdd)
            if (Object.prototype.hasOwnProperty.call(codecOptions.encodeAdd, uChar))
                this._setEncodeChar(uChar.charCodeAt(0), codecOptions.encodeAdd[uChar]);
    }

    this.defCharSB  = this.encodeTable[0][iconv.defaultCharSingleByte.charCodeAt(0)];
    if (this.defCharSB === UNASSIGNED) this.defCharSB = this.encodeTable[0]['?'];
    if (this.defCharSB === UNASSIGNED) this.defCharSB = "?".charCodeAt(0);


    // Load & create GB18030 tables when needed.
    if (typeof codecOptions.gb18030 === 'function') {
        this.gb18030 = codecOptions.gb18030(); // Load GB18030 ranges.

        // Add GB18030 decode tables.
        var thirdByteNodeIdx = this.decodeTables.length;
        var thirdByteNode = this.decodeTables[thirdByteNodeIdx] = UNASSIGNED_NODE.slice(0);

        var fourthByteNodeIdx = this.decodeTables.length;
        var fourthByteNode = this.decodeTables[fourthByteNodeIdx] = UNASSIGNED_NODE.slice(0);

        for (var i = 0x81; i <= 0xFE; i++) {
            var secondByteNodeIdx = NODE_START - this.decodeTables[0][i];
            var secondByteNode = this.decodeTables[secondByteNodeIdx];
            for (var j = 0x30; j <= 0x39; j++)
                secondByteNode[j] = NODE_START - thirdByteNodeIdx;
        }
        for (var i = 0x81; i <= 0xFE; i++)
            thirdByteNode[i] = NODE_START - fourthByteNodeIdx;
        for (var i = 0x30; i <= 0x39; i++)
            fourthByteNode[i] = GB18030_CODE
    }        
}

DBCSCodec.prototype.encoder = DBCSEncoder;
DBCSCodec.prototype.decoder = DBCSDecoder;

// Decoder helpers
DBCSCodec.prototype._getDecodeTrieNode = function(addr) {
    var bytes = [];
    for (; addr > 0; addr >>= 8)
        bytes.push(addr & 0xFF);
    if (bytes.length == 0)
        bytes.push(0);

    var node = this.decodeTables[0];
    for (var i = bytes.length-1; i > 0; i--) { // Traverse nodes deeper into the trie.
        var val = node[bytes[i]];

        if (val == UNASSIGNED) { // Create new node.
            node[bytes[i]] = NODE_START - this.decodeTables.length;
            this.decodeTables.push(node = UNASSIGNED_NODE.slice(0));
        }
        else if (val <= NODE_START) { // Existing node.
            node = this.decodeTables[NODE_START - val];
        }
        else
            throw new Error("Overwrite byte in " + this.encodingName + ", addr: " + addr.toString(16));
    }
    return node;
}


DBCSCodec.prototype._addDecodeChunk = function(chunk) {
    // First element of chunk is the hex mbcs code where we start.
    var curAddr = parseInt(chunk[0], 16);

    // Choose the decoding node where we'll write our chars.
    var writeTable = this._getDecodeTrieNode(curAddr);
    curAddr = curAddr & 0xFF;

    // Write all other elements of the chunk to the table.
    for (var k = 1; k < chunk.length; k++) {
        var part = chunk[k];
        if (typeof part === "string") { // String, write as-is.
            for (var l = 0; l < part.length;) {
                var code = part.charCodeAt(l++);
                if (0xD800 <= code && code < 0xDC00) { // Decode surrogate
                    var codeTrail = part.charCodeAt(l++);
                    if (0xDC00 <= codeTrail && codeTrail < 0xE000)
                        writeTable[curAddr++] = 0x10000 + (code - 0xD800) * 0x400 + (codeTrail - 0xDC00);
                    else
                        throw new Error("Incorrect surrogate pair in "  + this.encodingName + " at chunk " + chunk[0]);
                }
                else if (0x0FF0 < code && code <= 0x0FFF) { // Character sequence (our own encoding used)
                    var len = 0xFFF - code + 2;
                    var seq = [];
                    for (var m = 0; m < len; m++)
                        seq.push(part.charCodeAt(l++)); // Simple variation: don't support surrogates or subsequences in seq.

                    writeTable[curAddr++] = SEQ_START - this.decodeTableSeq.length;
                    this.decodeTableSeq.push(seq);
                }
                else
                    writeTable[curAddr++] = code; // Basic char
            }
        } 
        else if (typeof part === "number") { // Integer, meaning increasing sequence starting with prev character.
            var charCode = writeTable[curAddr - 1] + 1;
            for (var l = 0; l < part; l++)
                writeTable[curAddr++] = charCode++;
        }
        else
            throw new Error("Incorrect type '" + typeof part + "' given in "  + this.encodingName + " at chunk " + chunk[0]);
    }
    if (curAddr > 0xFF)
        throw new Error("Incorrect chunk in "  + this.encodingName + " at addr " + chunk[0] + ": too long" + curAddr);
}

// Encoder helpers
DBCSCodec.prototype._getEncodeBucket = function(uCode) {
    var high = uCode >> 8; // This could be > 0xFF because of astral characters.
    if (this.encodeTable[high] === undefined)
        this.encodeTable[high] = UNASSIGNED_NODE.slice(0); // Create bucket on demand.
    return this.encodeTable[high];
}

DBCSCodec.prototype._setEncodeChar = function(uCode, dbcsCode) {
    var bucket = this._getEncodeBucket(uCode);
    var low = uCode & 0xFF;
    if (bucket[low] <= SEQ_START)
        this.encodeTableSeq[SEQ_START-bucket[low]][DEF_CHAR] = dbcsCode; // There's already a sequence, set a single-char subsequence of it.
    else if (bucket[low] == UNASSIGNED)
        bucket[low] = dbcsCode;
}

DBCSCodec.prototype._setEncodeSequence = function(seq, dbcsCode) {
    
    // Get the root of character tree according to first character of the sequence.
    var uCode = seq[0];
    var bucket = this._getEncodeBucket(uCode);
    var low = uCode & 0xFF;

    var node;
    if (bucket[low] <= SEQ_START) {
        // There's already a sequence with  - use it.
        node = this.encodeTableSeq[SEQ_START-bucket[low]];
    }
    else {
        // There was no sequence object - allocate a new one.
        node = {};
        if (bucket[low] !== UNASSIGNED) node[DEF_CHAR] = bucket[low]; // If a char was set before - make it a single-char subsequence.
        bucket[low] = SEQ_START - this.encodeTableSeq.length;
        this.encodeTableSeq.push(node);
    }

    // Traverse the character tree, allocating new nodes as needed.
    for (var j = 1; j < seq.length-1; j++) {
        var oldVal = node[uCode];
        if (typeof oldVal === 'object')
            node = oldVal;
        else {
            node = node[uCode] = {}
            if (oldVal !== undefined)
                node[DEF_CHAR] = oldVal
        }
    }

    // Set the leaf to given dbcsCode.
    uCode = seq[seq.length-1];
    node[uCode] = dbcsCode;
}

DBCSCodec.prototype._fillEncodeTable = function(nodeIdx, prefix, skipEncodeChars) {
    var node = this.decodeTables[nodeIdx];
    for (var i = 0; i < 0x100; i++) {
        var uCode = node[i];
        var mbCode = prefix + i;
        if (skipEncodeChars[mbCode])
            continue;

        if (uCode >= 0)
            this._setEncodeChar(uCode, mbCode);
        else if (uCode <= NODE_START)
            this._fillEncodeTable(NODE_START - uCode, mbCode << 8, skipEncodeChars);
        else if (uCode <= SEQ_START)
            this._setEncodeSequence(this.decodeTableSeq[SEQ_START - uCode], mbCode);
    }
}



// == Encoder ==================================================================

function DBCSEncoder(options, codec) {
    // Encoder state
    this.leadSurrogate = -1;
    this.seqObj = undefined;
    
    // Static data
    this.encodeTable = codec.encodeTable;
    this.encodeTableSeq = codec.encodeTableSeq;
    this.defaultCharSingleByte = codec.defCharSB;
    this.gb18030 = codec.gb18030;
}

DBCSEncoder.prototype.write = function(str) {
    var newBuf = new Buffer(str.length * (this.gb18030 ? 4 : 3)), 
        leadSurrogate = this.leadSurrogate,
        seqObj = this.seqObj, nextChar = -1,
        i = 0, j = 0;

    while (true) {
        // 0. Get next character.
        if (nextChar === -1) {
            if (i == str.length) break;
            var uCode = str.charCodeAt(i++);
        }
        else {
            var uCode = nextChar;
            nextChar = -1;    
        }

        // 1. Handle surrogates.
        if (0xD800 <= uCode && uCode < 0xE000) { // Char is one of surrogates.
            if (uCode < 0xDC00) { // We've got lead surrogate.
                if (leadSurrogate === -1) {
                    leadSurrogate = uCode;
                    continue;
                } else {
                    leadSurrogate = uCode;
                    // Double lead surrogate found.
                    uCode = UNASSIGNED;
                }
            } else { // We've got trail surrogate.
                if (leadSurrogate !== -1) {
                    uCode = 0x10000 + (leadSurrogate - 0xD800) * 0x400 + (uCode - 0xDC00);
                    leadSurrogate = -1;
                } else {
                    // Incomplete surrogate pair - only trail surrogate found.
                    uCode = UNASSIGNED;
                }
                
            }
        }
        else if (leadSurrogate !== -1) {
            // Incomplete surrogate pair - only lead surrogate found.
            nextChar = uCode; uCode = UNASSIGNED; // Write an error, then current char.
            leadSurrogate = -1;
        }

        // 2. Convert uCode character.
        var dbcsCode = UNASSIGNED;
        if (seqObj !== undefined && uCode != UNASSIGNED) { // We are in the middle of the sequence
            var resCode = seqObj[uCode];
            if (typeof resCode === 'object') { // Sequence continues.
                seqObj = resCode;
                continue;

            } else if (typeof resCode == 'number') { // Sequence finished. Write it.
                dbcsCode = resCode;

            } else if (resCode == undefined) { // Current character is not part of the sequence.

                // Try default character for this sequence
                resCode = seqObj[DEF_CHAR];
                if (resCode !== undefined) {
                    dbcsCode = resCode; // Found. Write it.
                    nextChar = uCode; // Current character will be written too in the next iteration.

                } else {
                    // TODO: What if we have no default? (resCode == undefined)
                    // Then, we should write first char of the sequence as-is and try the rest recursively.
                    // Didn't do it for now because no encoding has this situation yet.
                    // Currently, just skip the sequence and write current char.
                }
            }
            seqObj = undefined;
        }
        else if (uCode >= 0) {  // Regular character
            var subtable = this.encodeTable[uCode >> 8];
            if (subtable !== undefined)
                dbcsCode = subtable[uCode & 0xFF];
            
            if (dbcsCode <= SEQ_START) { // Sequence start
                seqObj = this.encodeTableSeq[SEQ_START-dbcsCode];
                continue;
            }

            if (dbcsCode == UNASSIGNED && this.gb18030) {
                // Use GB18030 algorithm to find character(s) to write.
                var idx = findIdx(this.gb18030.uChars, uCode);
                if (idx != -1) {
                    var dbcsCode = this.gb18030.gbChars[idx] + (uCode - this.gb18030.uChars[idx]);
                    newBuf[j++] = 0x81 + Math.floor(dbcsCode / 12600); dbcsCode = dbcsCode % 12600;
                    newBuf[j++] = 0x30 + Math.floor(dbcsCode / 1260); dbcsCode = dbcsCode % 1260;
                    newBuf[j++] = 0x81 + Math.floor(dbcsCode / 10); dbcsCode = dbcsCode % 10;
                    newBuf[j++] = 0x30 + dbcsCode;
                    continue;
                }
            }
        }

        // 3. Write dbcsCode character.
        if (dbcsCode === UNASSIGNED)
            dbcsCode = this.defaultCharSingleByte;
        
        if (dbcsCode < 0x100) {
            newBuf[j++] = dbcsCode;
        }
        else if (dbcsCode < 0x10000) {
            newBuf[j++] = dbcsCode >> 8;   // high byte
            newBuf[j++] = dbcsCode & 0xFF; // low byte
        }
        else {
            newBuf[j++] = dbcsCode >> 16;
            newBuf[j++] = (dbcsCode >> 8) & 0xFF;
            newBuf[j++] = dbcsCode & 0xFF;
        }
    }

    this.seqObj = seqObj;
    this.leadSurrogate = leadSurrogate;
    return newBuf.slice(0, j);
}

DBCSEncoder.prototype.end = function() {
    if (this.leadSurrogate === -1 && this.seqObj === undefined)
        return; // All clean. Most often case.

    var newBuf = new Buffer(10), j = 0;

    if (this.seqObj) { // We're in the sequence.
        var dbcsCode = this.seqObj[DEF_CHAR];
        if (dbcsCode !== undefined) { // Write beginning of the sequence.
            if (dbcsCode < 0x100) {
                newBuf[j++] = dbcsCode;
            }
            else {
                newBuf[j++] = dbcsCode >> 8;   // high byte
                newBuf[j++] = dbcsCode & 0xFF; // low byte
            }
        } else {
            // See todo above.
        }
        this.seqObj = undefined;
    }

    if (this.leadSurrogate !== -1) {
        // Incomplete surrogate pair - only lead surrogate found.
        newBuf[j++] = this.defaultCharSingleByte;
        this.leadSurrogate = -1;
    }
    
    return newBuf.slice(0, j);
}

// Export for testing
DBCSEncoder.prototype.findIdx = findIdx;


// == Decoder ==================================================================

function DBCSDecoder(options, codec) {
    // Decoder state
    this.nodeIdx = 0;
    this.prevBuf = new Buffer(0);

    // Static data
    this.decodeTables = codec.decodeTables;
    this.decodeTableSeq = codec.decodeTableSeq;
    this.defaultCharUnicode = codec.defaultCharUnicode;
    this.gb18030 = codec.gb18030;
}

DBCSDecoder.prototype.write = function(buf) {
    var newBuf = new Buffer(buf.length*2),
        nodeIdx = this.nodeIdx, 
        prevBuf = this.prevBuf, prevBufOffset = this.prevBuf.length,
        seqStart = -this.prevBuf.length, // idx of the start of current parsed sequence.
        uCode;

    if (prevBufOffset > 0) // Make prev buf overlap a little to make it easier to slice later.
        prevBuf = Buffer.concat([prevBuf, buf.slice(0, 10)]);
    
    for (var i = 0, j = 0; i < buf.length; i++) {
        var curByte = (i >= 0) ? buf[i] : prevBuf[i + prevBufOffset];

        // Lookup in current trie node.
        var uCode = this.decodeTables[nodeIdx][curByte];

        if (uCode >= 0) { 
            // Normal character, just use it.
        }
        else if (uCode === UNASSIGNED) { // Unknown char.
            // TODO: Callback with seq.
            //var curSeq = (seqStart >= 0) ? buf.slice(seqStart, i+1) : prevBuf.slice(seqStart + prevBufOffset, i+1 + prevBufOffset);
            i = seqStart; // Try to parse again, after skipping first byte of the sequence ('i' will be incremented by 'for' cycle).
            uCode = this.defaultCharUnicode.charCodeAt(0);
        }
        else if (uCode === GB18030_CODE) {
            var curSeq = (seqStart >= 0) ? buf.slice(seqStart, i+1) : prevBuf.slice(seqStart + prevBufOffset, i+1 + prevBufOffset);
            var ptr = (curSeq[0]-0x81)*12600 + (curSeq[1]-0x30)*1260 + (curSeq[2]-0x81)*10 + (curSeq[3]-0x30);
            var idx = findIdx(this.gb18030.gbChars, ptr);
            uCode = this.gb18030.uChars[idx] + ptr - this.gb18030.gbChars[idx];
        }
        else if (uCode <= NODE_START) { // Go to next trie node.
            nodeIdx = NODE_START - uCode;
            continue;
        }
        else if (uCode <= SEQ_START) { // Output a sequence of chars.
            var seq = this.decodeTableSeq[SEQ_START - uCode];
            for (var k = 0; k < seq.length - 1; k++) {
                uCode = seq[k];
                newBuf[j++] = uCode & 0xFF;
                newBuf[j++] = uCode >> 8;
            }
            uCode = seq[seq.length-1];
        }
        else
            throw new Error("iconv-lite internal error: invalid decoding table value " + uCode + " at " + nodeIdx + "/" + curByte);

        // Write the character to buffer, handling higher planes using surrogate pair.
        if (uCode > 0xFFFF) { 
            uCode -= 0x10000;
            var uCodeLead = 0xD800 + Math.floor(uCode / 0x400);
            newBuf[j++] = uCodeLead & 0xFF;
            newBuf[j++] = uCodeLead >> 8;

            uCode = 0xDC00 + uCode % 0x400;
        }
        newBuf[j++] = uCode & 0xFF;
        newBuf[j++] = uCode >> 8;

        // Reset trie node.
        nodeIdx = 0; seqStart = i+1;
    }

    this.nodeIdx = nodeIdx;
    this.prevBuf = (seqStart >= 0) ? buf.slice(seqStart) : prevBuf.slice(seqStart + prevBufOffset);
    return newBuf.slice(0, j).toString('ucs2');
}

DBCSDecoder.prototype.end = function() {
    var ret = '';

    // Try to parse all remaining chars.
    while (this.prevBuf.length > 0) {
        // Skip 1 character in the buffer.
        ret += this.defaultCharUnicode;
        var buf = this.prevBuf.slice(1);

        // Parse remaining as usual.
        this.prevBuf = new Buffer(0);
        this.nodeIdx = 0;
        if (buf.length > 0)
            ret += this.write(buf);
    }

    this.nodeIdx = 0;
    return ret;
}

// Binary search for GB18030. Returns largest i such that table[i] <= val.
function findIdx(table, val) {
    if (table[0] > val)
        return -1;

    var l = 0, r = table.length;
    while (l < r-1) { // always table[l] <= val < table[r]
        var mid = l + Math.floor((r-l+1)/2);
        if (table[mid] <= val)
            l = mid;
        else
            r = mid;
    }
    return l;
}



/***/ }),

/***/ 835:
/***/ (function(module) {

module.exports = require("url");

/***/ }),

/***/ 850:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = paginationMethodsPlugin

function paginationMethodsPlugin (octokit) {
  octokit.getFirstPage = __webpack_require__(777).bind(null, octokit)
  octokit.getLastPage = __webpack_require__(649).bind(null, octokit)
  octokit.getNextPage = __webpack_require__(550).bind(null, octokit)
  octokit.getPreviousPage = __webpack_require__(563).bind(null, octokit)
  octokit.hasFirstPage = __webpack_require__(536)
  octokit.hasLastPage = __webpack_require__(336)
  octokit.hasNextPage = __webpack_require__(929)
  octokit.hasPreviousPage = __webpack_require__(558)
}


/***/ }),

/***/ 854:
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),

/***/ 855:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = registerPlugin;

const factory = __webpack_require__(47);

function registerPlugin(plugins, pluginFunction) {
  return factory(
    plugins.includes(pluginFunction) ? plugins : plugins.concat(pluginFunction)
  );
}


/***/ }),

/***/ 863:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationBeforeRequest;

const btoa = __webpack_require__(675);

const withAuthorizationPrefix = __webpack_require__(143);

function authenticationBeforeRequest(state, options) {
  if (typeof state.auth === "string") {
    options.headers.authorization = withAuthorizationPrefix(state.auth);

    // https://developer.github.com/v3/previews/#integrations
    if (
      /^bearer /i.test(state.auth) &&
      !/machine-man/.test(options.headers.accept)
    ) {
      const acceptHeaders = options.headers.accept
        .split(",")
        .concat("application/vnd.github.machine-man-preview+json");
      options.headers.accept = acceptHeaders.filter(Boolean).join(",");
    }

    return;
  }

  if (state.auth.username) {
    const hash = btoa(`${state.auth.username}:${state.auth.password}`);
    options.headers.authorization = `Basic ${hash}`;
    if (state.otp) {
      options.headers["x-github-otp"] = state.otp;
    }
    return;
  }

  if (state.auth.clientId) {
    // There is a special case for OAuth applications, when `clientId` and `clientSecret` is passed as
    // Basic Authorization instead of query parameters. The only routes where that applies share the same
    // URL though: `/applications/:client_id/tokens/:access_token`.
    //
    //  1. [Check an authorization](https://developer.github.com/v3/oauth_authorizations/#check-an-authorization)
    //  2. [Reset an authorization](https://developer.github.com/v3/oauth_authorizations/#reset-an-authorization)
    //  3. [Revoke an authorization for an application](https://developer.github.com/v3/oauth_authorizations/#revoke-an-authorization-for-an-application)
    //
    // We identify by checking the URL. It must merge both "/applications/:client_id/tokens/:access_token"
    // as well as "/applications/123/tokens/token456"
    if (/\/applications\/:?[\w_]+\/tokens\/:?[\w_]+($|\?)/.test(options.url)) {
      const hash = btoa(`${state.auth.clientId}:${state.auth.clientSecret}`);
      options.headers.authorization = `Basic ${hash}`;
      return;
    }

    options.url += options.url.indexOf("?") === -1 ? "?" : "&";
    options.url += `client_id=${state.auth.clientId}&client_secret=${state.auth.clientSecret}`;
    return;
  }

  return Promise.resolve()

    .then(() => {
      return state.auth();
    })

    .then(authorization => {
      options.headers.authorization = withAuthorizationPrefix(authorization);
    });
}


/***/ }),

/***/ 864:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


// Some environments don't have global Buffer (e.g. React Native).
// Solution would be installing npm modules "buffer" and "stream" explicitly.
var Buffer = __webpack_require__(293).Buffer;

var bomHandling = __webpack_require__(258),
    iconv = module.exports;

// All codecs and aliases are kept here, keyed by encoding name/alias.
// They are lazy loaded in `iconv.getCodec` from `encodings/index.js`.
iconv.encodings = null;

// Characters emitted in case of error.
iconv.defaultCharUnicode = '?';
iconv.defaultCharSingleByte = '?';

// Public API.
iconv.encode = function encode(str, encoding, options) {
    str = "" + (str || ""); // Ensure string.

    var encoder = iconv.getEncoder(encoding, options);

    var res = encoder.write(str);
    var trail = encoder.end();
    
    return (trail && trail.length > 0) ? Buffer.concat([res, trail]) : res;
}

iconv.decode = function decode(buf, encoding, options) {
    if (typeof buf === 'string') {
        if (!iconv.skipDecodeWarning) {
            console.error('Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding');
            iconv.skipDecodeWarning = true;
        }

        buf = new Buffer("" + (buf || ""), "binary"); // Ensure buffer.
    }

    var decoder = iconv.getDecoder(encoding, options);

    var res = decoder.write(buf);
    var trail = decoder.end();

    return trail ? (res + trail) : res;
}

iconv.encodingExists = function encodingExists(enc) {
    try {
        iconv.getCodec(enc);
        return true;
    } catch (e) {
        return false;
    }
}

// Legacy aliases to convert functions
iconv.toEncoding = iconv.encode;
iconv.fromEncoding = iconv.decode;

// Search for a codec in iconv.encodings. Cache codec data in iconv._codecDataCache.
iconv._codecDataCache = {};
iconv.getCodec = function getCodec(encoding) {
    if (!iconv.encodings)
        iconv.encodings = __webpack_require__(930); // Lazy load all encoding definitions.
    
    // Canonicalize encoding name: strip all non-alphanumeric chars and appended year.
    var enc = (''+encoding).toLowerCase().replace(/[^0-9a-z]|:\d{4}$/g, "");

    // Traverse iconv.encodings to find actual codec.
    var codecOptions = {};
    while (true) {
        var codec = iconv._codecDataCache[enc];
        if (codec)
            return codec;

        var codecDef = iconv.encodings[enc];

        switch (typeof codecDef) {
            case "string": // Direct alias to other encoding.
                enc = codecDef;
                break;

            case "object": // Alias with options. Can be layered.
                for (var key in codecDef)
                    codecOptions[key] = codecDef[key];

                if (!codecOptions.encodingName)
                    codecOptions.encodingName = enc;
                
                enc = codecDef.type;
                break;

            case "function": // Codec itself.
                if (!codecOptions.encodingName)
                    codecOptions.encodingName = enc;

                // The codec function must load all tables and return object with .encoder and .decoder methods.
                // It'll be called only once (for each different options object).
                codec = new codecDef(codecOptions, iconv);

                iconv._codecDataCache[codecOptions.encodingName] = codec; // Save it to be reused later.
                return codec;

            default:
                throw new Error("Encoding not recognized: '" + encoding + "' (searched as: '"+enc+"')");
        }
    }
}

iconv.getEncoder = function getEncoder(encoding, options) {
    var codec = iconv.getCodec(encoding),
        encoder = new codec.encoder(options, codec);

    if (codec.bomAware && options && options.addBOM)
        encoder = new bomHandling.PrependBOM(encoder, options);

    return encoder;
}

iconv.getDecoder = function getDecoder(encoding, options) {
    var codec = iconv.getCodec(encoding),
        decoder = new codec.decoder(options, codec);

    if (codec.bomAware && !(options && options.stripBOM === false))
        decoder = new bomHandling.StripBOM(decoder, options);

    return decoder;
}


// Load extensions in Node. All of them are omitted in Browserify build via 'browser' field in package.json.
var nodeVer = typeof process !== 'undefined' && process.versions && process.versions.node;
if (nodeVer) {

    // Load streaming support in Node v0.10+
    var nodeVerArr = nodeVer.split(".").map(Number);
    if (nodeVerArr[0] > 0 || nodeVerArr[1] >= 10) {
        __webpack_require__(959)(iconv);
    }

    // Load Node primitive extensions.
    __webpack_require__(868)(iconv);
}

if (false) {}


/***/ }),

/***/ 866:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

var shebangRegex = __webpack_require__(816);

module.exports = function (str) {
	var match = str.match(shebangRegex);

	if (!match) {
		return null;
	}

	var arr = match[0].replace(/#! ?/, '').split(' ');
	var bin = arr[0].split('/').pop();
	var arg = arr[1];

	return (bin === 'env' ?
		arg :
		bin + (arg ? ' ' + arg : '')
	);
};


/***/ }),

/***/ 868:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

var Buffer = __webpack_require__(293).Buffer;

// == Extend Node primitives to use iconv-lite =================================

module.exports = function (iconv) {
    var original = undefined; // Place to keep original methods.

    // Node authors rewrote Buffer internals to make it compatible with
    // Uint8Array and we cannot patch key functions since then.
    iconv.supportsNodeEncodingsExtension = !(new Buffer(0) instanceof Uint8Array);

    iconv.extendNodeEncodings = function extendNodeEncodings() {
        if (original) return;
        original = {};

        if (!iconv.supportsNodeEncodingsExtension) {
            console.error("ACTION NEEDED: require('iconv-lite').extendNodeEncodings() is not supported in your version of Node");
            console.error("See more info at https://github.com/ashtuchkin/iconv-lite/wiki/Node-v4-compatibility");
            return;
        }

        var nodeNativeEncodings = {
            'hex': true, 'utf8': true, 'utf-8': true, 'ascii': true, 'binary': true, 
            'base64': true, 'ucs2': true, 'ucs-2': true, 'utf16le': true, 'utf-16le': true,
        };

        Buffer.isNativeEncoding = function(enc) {
            return enc && nodeNativeEncodings[enc.toLowerCase()];
        }

        // -- SlowBuffer -----------------------------------------------------------
        var SlowBuffer = __webpack_require__(293).SlowBuffer;

        original.SlowBufferToString = SlowBuffer.prototype.toString;
        SlowBuffer.prototype.toString = function(encoding, start, end) {
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.SlowBufferToString.call(this, encoding, start, end);

            // Otherwise, use our decoding method.
            if (typeof start == 'undefined') start = 0;
            if (typeof end == 'undefined') end = this.length;
            return iconv.decode(this.slice(start, end), encoding);
        }

        original.SlowBufferWrite = SlowBuffer.prototype.write;
        SlowBuffer.prototype.write = function(string, offset, length, encoding) {
            // Support both (string, offset, length, encoding)
            // and the legacy (string, encoding, offset, length)
            if (isFinite(offset)) {
                if (!isFinite(length)) {
                    encoding = length;
                    length = undefined;
                }
            } else {  // legacy
                var swap = encoding;
                encoding = offset;
                offset = length;
                length = swap;
            }

            offset = +offset || 0;
            var remaining = this.length - offset;
            if (!length) {
                length = remaining;
            } else {
                length = +length;
                if (length > remaining) {
                    length = remaining;
                }
            }
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.SlowBufferWrite.call(this, string, offset, length, encoding);

            if (string.length > 0 && (length < 0 || offset < 0))
                throw new RangeError('attempt to write beyond buffer bounds');

            // Otherwise, use our encoding method.
            var buf = iconv.encode(string, encoding);
            if (buf.length < length) length = buf.length;
            buf.copy(this, offset, 0, length);
            return length;
        }

        // -- Buffer ---------------------------------------------------------------

        original.BufferIsEncoding = Buffer.isEncoding;
        Buffer.isEncoding = function(encoding) {
            return Buffer.isNativeEncoding(encoding) || iconv.encodingExists(encoding);
        }

        original.BufferByteLength = Buffer.byteLength;
        Buffer.byteLength = SlowBuffer.byteLength = function(str, encoding) {
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.BufferByteLength.call(this, str, encoding);

            // Slow, I know, but we don't have a better way yet.
            return iconv.encode(str, encoding).length;
        }

        original.BufferToString = Buffer.prototype.toString;
        Buffer.prototype.toString = function(encoding, start, end) {
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.BufferToString.call(this, encoding, start, end);

            // Otherwise, use our decoding method.
            if (typeof start == 'undefined') start = 0;
            if (typeof end == 'undefined') end = this.length;
            return iconv.decode(this.slice(start, end), encoding);
        }

        original.BufferWrite = Buffer.prototype.write;
        Buffer.prototype.write = function(string, offset, length, encoding) {
            var _offset = offset, _length = length, _encoding = encoding;
            // Support both (string, offset, length, encoding)
            // and the legacy (string, encoding, offset, length)
            if (isFinite(offset)) {
                if (!isFinite(length)) {
                    encoding = length;
                    length = undefined;
                }
            } else {  // legacy
                var swap = encoding;
                encoding = offset;
                offset = length;
                length = swap;
            }

            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.BufferWrite.call(this, string, _offset, _length, _encoding);

            offset = +offset || 0;
            var remaining = this.length - offset;
            if (!length) {
                length = remaining;
            } else {
                length = +length;
                if (length > remaining) {
                    length = remaining;
                }
            }

            if (string.length > 0 && (length < 0 || offset < 0))
                throw new RangeError('attempt to write beyond buffer bounds');

            // Otherwise, use our encoding method.
            var buf = iconv.encode(string, encoding);
            if (buf.length < length) length = buf.length;
            buf.copy(this, offset, 0, length);
            return length;

            // TODO: Set _charsWritten.
        }


        // -- Readable -------------------------------------------------------------
        if (iconv.supportsStreams) {
            var Readable = __webpack_require__(413).Readable;

            original.ReadableSetEncoding = Readable.prototype.setEncoding;
            Readable.prototype.setEncoding = function setEncoding(enc, options) {
                // Use our own decoder, it has the same interface.
                // We cannot use original function as it doesn't handle BOM-s.
                this._readableState.decoder = iconv.getDecoder(enc, options);
                this._readableState.encoding = enc;
            }

            Readable.prototype.collect = iconv._collect;
        }
    }

    // Remove iconv-lite Node primitive extensions.
    iconv.undoExtendNodeEncodings = function undoExtendNodeEncodings() {
        if (!iconv.supportsNodeEncodingsExtension)
            return;
        if (!original)
            throw new Error("require('iconv-lite').undoExtendNodeEncodings(): Nothing to undo; extendNodeEncodings() is not called.")

        delete Buffer.isNativeEncoding;

        var SlowBuffer = __webpack_require__(293).SlowBuffer;

        SlowBuffer.prototype.toString = original.SlowBufferToString;
        SlowBuffer.prototype.write = original.SlowBufferWrite;

        Buffer.isEncoding = original.BufferIsEncoding;
        Buffer.byteLength = original.BufferByteLength;
        Buffer.prototype.toString = original.BufferToString;
        Buffer.prototype.write = original.BufferWrite;

        if (iconv.supportsStreams) {
            var Readable = __webpack_require__(413).Readable;

            Readable.prototype.setEncoding = original.ReadableSetEncoding;
            delete Readable.prototype.collect;
        }

        original = undefined;
    }
}


/***/ }),

/***/ 874:
/***/ (function(module) {

module.exports = [["0","\u0000",128],["a1","｡",62],["8140","　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",9,"＋－±×"],["8180","÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇◆□■△▲▽▼※〒→←↑↓〓"],["81b8","∈∋⊆⊇⊂⊃∪∩"],["81c8","∧∨￢⇒⇔∀∃"],["81da","∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"],["81f0","Å‰♯♭♪†‡¶"],["81fc","◯"],["824f","０",9],["8260","Ａ",25],["8281","ａ",25],["829f","ぁ",82],["8340","ァ",62],["8380","ム",22],["839f","Α",16,"Σ",6],["83bf","α",16,"σ",6],["8440","А",5,"ЁЖ",25],["8470","а",5,"ёж",7],["8480","о",17],["849f","─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"],["8740","①",19,"Ⅰ",9],["875f","㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"],["877e","㍻"],["8780","〝〟№㏍℡㊤",4,"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"],["889f","亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"],["8940","院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円"],["8980","園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"],["8a40","魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫"],["8a80","橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"],["8b40","機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救"],["8b80","朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"],["8c40","掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨"],["8c80","劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"],["8d40","后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降"],["8d80","項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"],["8e40","察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止"],["8e80","死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"],["8f40","宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳"],["8f80","準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"],["9040","拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨"],["9080","逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"],["9140","繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻"],["9180","操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"],["9240","叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄"],["9280","逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"],["9340","邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬"],["9380","凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"],["9440","如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅"],["9480","楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"],["9540","鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷"],["9580","斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"],["9640","法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆"],["9680","摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"],["9740","諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲"],["9780","沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"],["9840","蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"],["989f","弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"],["9940","僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭"],["9980","凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"],["9a40","咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸"],["9a80","噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"],["9b40","奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀"],["9b80","它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"],["9c40","廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠"],["9c80","怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"],["9d40","戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫"],["9d80","捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"],["9e40","曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎"],["9e80","梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"],["9f40","檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯"],["9f80","麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"],["e040","漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝"],["e080","烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"],["e140","瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿"],["e180","痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"],["e240","磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰"],["e280","窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"],["e340","紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷"],["e380","縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"],["e440","隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤"],["e480","艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"],["e540","蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬"],["e580","蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"],["e640","襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧"],["e680","諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"],["e740","蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜"],["e780","轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"],["e840","錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙"],["e880","閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"],["e940","顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃"],["e980","騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"],["ea40","鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯"],["ea80","黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠堯槇遙瑤凜熙"],["ed40","纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏"],["ed80","塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"],["ee40","犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙"],["ee80","蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"],["eeef","ⅰ",9,"￢￤＇＂"],["f040","",62],["f080","",124],["f140","",62],["f180","",124],["f240","",62],["f280","",124],["f340","",62],["f380","",124],["f440","",62],["f480","",124],["f540","",62],["f580","",124],["f640","",62],["f680","",124],["f740","",62],["f780","",124],["f840","",62],["f880","",124],["f940",""],["fa40","ⅰ",9,"Ⅰ",9,"￢￤＇＂㈱№℡∵纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊"],["fa80","兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯"],["fb40","涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神"],["fb80","祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙"],["fc40","髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"]];

/***/ }),

/***/ 881:
/***/ (function(module) {

"use strict";


const isWin = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed, 'spawn');

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

module.exports = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};


/***/ }),

/***/ 883:
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

module.exports = set;


/***/ }),

/***/ 898:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var request = __webpack_require__(753);
var universalUserAgent = __webpack_require__(796);

const VERSION = "4.3.1";

class GraphqlError extends Error {
  constructor(request, response) {
    const message = response.data.errors[0].message;
    super(message);
    Object.assign(this, response.data);
    this.name = "GraphqlError";
    this.request = request; // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

}

const NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query"];
function graphql(request, query, options) {
  options = typeof query === "string" ? options = Object.assign({
    query
  }, options) : options = query;
  const requestOptions = Object.keys(options).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = options[key];
      return result;
    }

    if (!result.variables) {
      result.variables = {};
    }

    result.variables[key] = options[key];
    return result;
  }, {});
  return request(requestOptions).then(response => {
    if (response.data.errors) {
      throw new GraphqlError(requestOptions, {
        data: response.data
      });
    }

    return response.data.data;
  });
}

function withDefaults(request$1, newDefaults) {
  const newRequest = request$1.defaults(newDefaults);

  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };

  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: request.request.endpoint
  });
}

const graphql$1 = withDefaults(request.request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

exports.graphql = graphql$1;
exports.withCustomRequest = withCustomRequest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 899:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = registerEndpoints;

const { Deprecation } = __webpack_require__(692);

function registerEndpoints(octokit, routes) {
  Object.keys(routes).forEach(namespaceName => {
    if (!octokit[namespaceName]) {
      octokit[namespaceName] = {};
    }

    Object.keys(routes[namespaceName]).forEach(apiName => {
      const apiOptions = routes[namespaceName][apiName];

      const endpointDefaults = ["method", "url", "headers"].reduce(
        (map, key) => {
          if (typeof apiOptions[key] !== "undefined") {
            map[key] = apiOptions[key];
          }

          return map;
        },
        {}
      );

      endpointDefaults.request = {
        validate: apiOptions.params
      };

      let request = octokit.request.defaults(endpointDefaults);

      // patch request & endpoint methods to support deprecated parameters.
      // Not the most elegant solution, but we don’t want to move deprecation
      // logic into octokit/endpoint.js as it’s out of scope
      const hasDeprecatedParam = Object.keys(apiOptions.params || {}).find(
        key => apiOptions.params[key].deprecated
      );
      if (hasDeprecatedParam) {
        const patch = patchForDeprecation.bind(null, octokit, apiOptions);
        request = patch(
          octokit.request.defaults(endpointDefaults),
          `.${namespaceName}.${apiName}()`
        );
        request.endpoint = patch(
          request.endpoint,
          `.${namespaceName}.${apiName}.endpoint()`
        );
        request.endpoint.merge = patch(
          request.endpoint.merge,
          `.${namespaceName}.${apiName}.endpoint.merge()`
        );
      }

      if (apiOptions.deprecated) {
        octokit[namespaceName][apiName] = function deprecatedEndpointMethod() {
          octokit.log.warn(
            new Deprecation(`[@octokit/rest] ${apiOptions.deprecated}`)
          );
          octokit[namespaceName][apiName] = request;
          return request.apply(null, arguments);
        };

        return;
      }

      octokit[namespaceName][apiName] = request;
    });
  });
}

function patchForDeprecation(octokit, apiOptions, method, methodName) {
  const patchedMethod = options => {
    options = Object.assign({}, options);

    Object.keys(options).forEach(key => {
      if (apiOptions.params[key] && apiOptions.params[key].deprecated) {
        const aliasKey = apiOptions.params[key].alias;

        octokit.log.warn(
          new Deprecation(
            `[@octokit/rest] "${key}" parameter is deprecated for "${methodName}". Use "${aliasKey}" instead`
          )
        );

        if (!(aliasKey in options)) {
          options[aliasKey] = options[key];
        }
        delete options[key];
      }
    });

    return method(options);
  };
  Object.keys(method).forEach(key => {
    patchedMethod[key] = method[key];
  });

  return patchedMethod;
}


/***/ }),

/***/ 903:
/***/ (function(module) {

module.exports = [["0","\u0000",127],["8141","?????",4,"???????",6,"????"],["8161","?????????",9,"??",5,"?"],["8181","??????",18,"??????",4,"??????????",6,"??",5,"????",6,"?????????????",7,"??",7,"???????????",4,"???????",4,"????"],["8241","???????????",7,"???",5],["8261","??????",6,"???",5,"??????"],["8281","?",7,"??",7,"???????????",4,"??????",10,"?",5,"?",17,"?",7,"??????",6,"??",7,"???????",18],["8341","?????",5,"???",5,"?",7],["8361","?",18,"???????"],["8381","???????????????",4,"????????????",6,"??",5,"?",5,"?",46,"?????",6,"??",5,"???",8],["8441","??????",5,"???????",8],["8461","????????",18],["8481","?",7,"?????",6,"???????",5,"?",10,"?",5,"?",18,"?",5,"???????",6,"????",5,"?",26,"????"],["8541","??",5,"???",4,"?",6,"?",4],["8561","?",5,"?",5,"??????",6,"??"],["8581","?",6,"???????",6,"?",9,"?",26,"???????????????",29,"??????",6,"???",5,"?????"],["8641","????????????",6,"??",5,"?"],["8661","?????",6,"?????",10],["8681","?",22,"???????????",4,"??????",6,"??",5,"??????",6,"???????????",22,"???????",4,"?????????????"],["8741","?",9,"?",15],["8761","?",18,"???????"],["8781","?",5,"??",7,"??????",7,"???",5,"?????",6,"???",5,"?",18,"?",6,"?",26,"???????",6,"?",4],["8841","?",4,"?",5,"?",6,"????",4],["8861","???????",4,"???????????????"],["8881","?",15,"???????",4,"???????????????????????",6,"??",5,"?",54,"????????"],["8941","????????????",6,"??",5,"?"],["8961","??????",10,"?",5,"????"],["8981","?",21,"??????????????????????",18,"?",18,"?",6,"???????",6,"??",7,"?",15],["8a41","?",10,"??????",6,"???"],["8a61","?",4,"?",18,"??"],["8a81","?",4,"?",19,"?",5,"???????",7,"???",5,"???????",6,"?????",5,"??????",4,"???",5,"?",26,"?????"],["8b41","?",5,"??",4,"??????",6,"??"],["8b61","??????????",6,"??",8],["8b81","?",52,"????????????",4,"??????",6,"??",5,"?",18,"?",18],["8c41","?",15,"??????",4],["8c61","?",6,"?",5,"?",6,"?",5],["8c81","?",12,"?",26,"????",50,"??????",5,"?????",16],["8d41","?",16,"?",8],["8d61","?",17,"????????"],["8d81","?",4,"????",33,"?????",6,"??",7,"???????",6,"?",9,"???????",6,"???",5,"??????",6,"????????"],["8e41","??",6,"??",5,"???",8],["8e61","?",4,"??",19],["8e81","?",13,"??????",6,"??",4,"??????",6,"???",5,"??????",6,"??",5,"????",11,"??",7,"??????",6,"???",5,"????",7],["8f41","?",7,"?",17],["8f61","?",7,"?",6,"???????",4],["8f81","?????",5,"???????",7,"???",5,"??????",6,"???",5,"?",18,"?",6,"?",26,"??????",6,"????",5],["9041","??????",6,"???",5,"??????"],["9061","?",5,"?????",15],["9081","?",12,"??????",6,"???",5,"????",4,"???????????",6,"??",4,"?",5,"?",11,"?",33,"??????????"],["9141","?????????????",6,"??",5],["9161","??????",9,"??????",5],["9181","?",20,"??????",4,"???",5,"????",14,"?",33,"???????",7,"???",5,"???????",6],["9241","???",7,"????",4,"????????"],["9261","?????",7,"??",7,"?",4],["9281","?",21,"???????",18,"???????",6,"???",7,"???????",6,"???",35,"?????"],["9341","?",4,"?????????????????????"],["9361","???",6,"?????????",8],["9381","????",37,"??????",4,"???",4,"?????",6,"??",5,"??????",7,"??????????",22,"?????"],["9441","?",5,"???",5,"????",8],["9461","?",5,"?",6,"?",12],["9481","?",5,"?",6,"??????",6,"?",9,"????",22,"?????",4,"???????",6,"?",10,"?",6,"?",24],["9541","????????",11,"?",5,"?"],["9561","??????",6,"????",5,"?????"],["9581","?",6,"??",35,"???????",4,"?????????????",4,"??",4,"??????",6,"??",5,"?",13,"?",14],["9641","?",23,"??"],["9661","???",6,"???",5,"?",8],["9681","?",10,"?",5,"?",13,"??",33,"??????",6,"????",44],["9741","?",16,"?",8],["9761","?",17,"?",7],["9781","?",11,"?",5,"??????",6,"????",89,"???"],["9841","?",16,"?",5,"???"],["9861","????",6,"?",15],["9881","?",21,"??????",6,"???",5,"????",4,"????????????",6,"??",5,"??????",6,"???",5,"???????",6,"?????",5,"????????"],["9941","???????????",6,"??",5,"??"],["9961","????",6,"??",5,"?????????"],["9981","?",8,"?",5,"??????",4,"?????????????",11,"?",5,"???????",6,"???",6,"???????",6,"??",7,"??????",6,"???",5,"???????"],["9a41","??????????",16],["9a61","???",6,"??????",6,"?????"],["9a81","?",4,"??????",6,"???",5,"?",5,"?",6,"????",5,"??????",5,"???",33,"?????",5,"????????????",6,"????"],["9b41","?????????",6,"???",8],["9b61","?",17,"?",7],["9b81","?",25,"???????",4,"???",5,"???????",50,"?",22,"?"],["9c41","?????",4,"????",5,"???",5],["9c61","?",8,"?",6,"?",9],["9c81","?",8,"?",6,"???????",6,"?",9,"?",26,"??????",6,"????",5,"?",18,"?",6,"?",12],["9d41","?",13,"????",8],["9d61","?",25],["9d81","?",8,"?",5,"???????????",9,"???????",6,"?",10,"??????",6,"???",5,"??????????????????",6,"??",5,"????????????????"],["9e41","????????",7,"?",9,"?"],["9e61","???",4,"?????????",6,"????"],["9e81","???????????????????????",6,"??",6,"?????????????????????",6,"??",5,"???",10,"????",5,"??????",6,"???",5,"??????",6,"?"],["9f41","??",5,"??????",4,"???",5,"?"],["9f61","?????",6,"???",5,"???????"],["9f81","?",4,"????",5,"??????",6,"???",5,"??????",6,"?????????????",4,"??????????",6,"???",7,"???????????????????",4,"??",4,"????????"],["a041","??????",5,"?????",6,"????"],["a061","?",5,"???????",13],["a081","?",4,"???????",4,"???",4,"??????",6,"???",5,"???????",6,"???",5,"?",26,"???????",4,"??????",5,"?",7,"?????"],["a141","????",18,"????"],["a161","?????????",6,"???",5,"???"],["a181","?",14,"?",5,"??????",4,"?　、。・‥…¨〃-―∥＼?‘’“”〔〕〈",9,"±×÷≠??∞∴°′″℃Å￠￡￥♂♀∠⊥⌒∂∇≡≒§※☆★○●◎◇◆□■△▲▽▼→←↑↓?〓≪≫√∽∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢"],["a241","??",5,"?",18],["a261","?",6,"?",18],["a281","?",7,"??????",6,"??",7,"???⇒⇔∀∃´～?????，?!??∮∑???‰???????????????????????????¶†‡?????♭?♪???№????℡?R"],["a341","????",6,"?",10,"?????"],["a361","?",6,"???",16],["a381","?",16,"??????",4,"?????！",58,"?］",32,"￣"],["a441","????????????",5,"?????????"],["a461","?????",5,"????",12],["a481","????",28,"?",93],["a541","?",4,"??????",6,"??",5,"??"],["a561","?",17,"?",5,"??"],["a581","?",16,"?",14,"ⅰ",9],["a5b0","Ⅰ",9],["a5c1","Α",16,"Σ",6],["a5e1","α",16,"σ",6],["a641","?",19,"??????"],["a661","?",5,"????????",5,"?",6],["a681","?????",6,"?",18,"??─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂?????????????????????????????",7],["a741","?",4,"???????",6,"?",7],["a761","?",22,"???"],["a781","?????????",6,"????",5,"?",7,"?????㏄?????",9,"??㎎㎏???????",9,"?",4,"?",5,"?",4,"???????????????????????"],["a841","?",10,"?",14],["a861","?",18,"?",6],["a881","?",19,"?",11,"ADa?"],["a8a6","?"],["a8a8","??O?oT??"],["a8b1","?",27,"?",25,"①",14,"?????????"],["a941","?",14,"?",10],["a961","????????",18],["a981","?",14,"??????",6,"?????a?d??????o?st????",27,"?",25,"?",14,"123??????"],["aa41","???????",6,"??",4,"???????"],["aa61","?",4,"??",5,"??????",6,"??"],["aa81","???",29,"ぁ",82],["ab41","??????????",6,"??",5,"???"],["ab61","???",6,"???",5,"????",5],["ab81","?",8,"?",6,"????",12,"ァ",85],["ac41","????",5,"??????",6,"?????"],["ac61","??????????",11,"?",4],["ac81","?",28,"???А",5,"ЁЖ",25],["acd1","а",5,"ёж",25],["ad41","????",6,"???",5,"?",7],["ad61","?",6,"?",10,"????????"],["ad81","???????",5,"?",18,"?"],["ae41","?",5,"????",16],["ae61","?",5,"???????",6,"???",4],["ae81","????????",6,"?????",5,"????????"],["af41","???????",19],["af61","?",13,"?????",5,"??"],["af81","?",5,"??????",6,"???",5,"??????"],["b041","?",5,"??",5,"?",12],["b061","?",5,"?",19],["b081","?",13,"?????",6,"??",5,"????????",7,"?",4,"??????????????????????????????????????????????????????????????????????????"],["b141","??????",6,"???",5,"??????"],["b161","?",6,"??",5,"?",11],["b181","?",14,"??????",6,"???????????????????????????????????????????????????????????????????????????????????????????????????"],["b241","?????????",6,"?????",5,"?"],["b261","?",18,"?",5,"?"],["b281","?",5,"?",18,"?",6,"??????????????????????????????????????????????????????????????????????????????????????????????"],["b341","?",19,"??????"],["b361","?",5,"???",5,"???????",5],["b381","?",5,"?",5,"?",19,"????????????????????",4,"??????????????????????????????????????????????????????????????????????"],["b441","?",5,"??????",6,"???",5],["b461","???????",6,"?",10,"??"],["b481","????",6,"????",18,"?????????????????????????????????????????????????????????????",4,"????",4,"?????????????????????"],["b541","?",14,"??????",5],["b561","????",5,"??????",5,"??",4],["b581","???????",6,"??",5,"?",11,"??????????????????????????????????????????????????????????????????????????????????????????????"],["b641","?",7,"?",17],["b661","?",15,"??????????"],["b681","???",5,"??????",6,"???",5,"??????????????????????????????????????????????????????????????????????????????????????????????????"],["b741","?",13,"?",6,"?????"],["b761","?",20,"?????"],["b781","?",6,"???????????",14,"??????????????????????????????????????????????????????????????????????????????????????????????"],["b841","?",7,"?",17],["b861","?",8,"????",13],["b881","??",5,"?",24,"?????????????????????????",4,"?????????????????????????????????????????????????????????????????"],["b941","????????",6,"???",5,"????"],["b961","?",14,"?",6,"????"],["b981","?",22,"??????????????????????????????????????????????????????????????????",4,"?",4,"????????????????????????????"],["ba41","???????",5,"???????",6,"?"],["ba61","????",5,"??????",4,"??",5],["ba81","?????????",6,"?",9,"?????????????????????????????????????????????????????????????????????????????????????????????????????"],["bb41","?",4,"???",5,"??????",4,"???"],["bb61","?????????",6,"??",5,"????"],["bb81","?",31,"??????????????????????????????????????????????????????????????????????????????????????????????"],["bc41","?",17,"????????"],["bc61","??????",5,"??????",6,"???"],["bc81","?",4,"???????",6,"???",5,"?",5,"?????????????",4,"?????????????????????????????????????????????????????????????????????????????"],["bd41","??",7,"??",7,"????????"],["bd61","???????",5,"?",13],["bd81","?",5,"?",25,"??????????????????????????????????????????????????????????????????????????????????????????????"],["be41","?",7,"????",14],["be61","?",7,"???????",7,"????"],["be81","?",4,"??????",4,"???",5,"?",8,"??????????????????????????????????????????????????????????????????????????????????????",6,"??"],["bf41","?",10,"?",14],["bf61","?",18,"???????"],["bf81","?",5,"???",7,"???????",6,"???????????????????",5,"?????????????????????????????????????????????????????????????????????????"],["c041","?",5,"???????",6,"??",5],["c061","?",25],["c081","??????????",6,"???",5,"????????????????????????????????????????",7,"???????????????????????????????????????????????????????"],["c141","??????",5,"??????",6,"???"],["c161","?????",19,"??"],["c181","?",31,"??????????????????????????????????????????????????????????????????????????????????????????????"],["c241","???????",4,"???",5,"???????"],["c261","?",4,"???",5,"??????",6,"?"],["c281","?",5,"???????",7,"?",9,"????????????????????????????????????????????????????????????????????????????????????????????????"],["c341","??????????????????????",4],["c361","?",4,"??",5,"???",11],["c381","????",5,"??????",7,"???",5,"????????????????????????????????????????????????????????????????????????????????????????????????"],["c441","?????",7,"??",7,"?????"],["c461","??????????",5,"???????",4],["c481","???????",5,"??????",11,"?????????????????????????????????????????????????????????????????????????????????????????????????"],["c541","?????????",6,"???",5,"???"],["c561","???",6,"????",5,"????",4],["c581","???????????????",6,"????",5,"????????????????????????????????????????????????????????????????????????????????????????????????"],["c641","????",6,"???",5],["c6a1","??????????????????????????????????????????????????????????????????????????????????????????????"],["c7a1","??????????????????????????????????????????????????????????????????????????????????????????????"],["c8a1","??????????????????????????????????????????????????????????????????????????????????????????????"],["caa1","伽佳假價加可呵哥嘉嫁家暇架枷柯歌珂痂稼苛茄街袈訶賈跏軻迦駕刻却各恪?殼?脚覺角閣侃刊墾奸姦干幹懇揀杆柬桿澗?看?稈竿簡肝艮艱諫間?喝曷?碣竭葛褐蝎鞨勘坎堪嵌感憾戡敢柑橄減甘疳監瞰紺邯鑑鑒龕"],["cba1","匣岬甲胛鉀閘剛?姜岡崗康?彊慷江?疆糠絳綱羌腔?薑襁講鋼降鱇介价個凱?愷愾慨改?漑疥皆盖箇芥蓋?鎧開喀客坑?粳羹醵倨去居巨拒据據擧渠炬?距踞?遽鉅鋸乾件健巾建愆?腱虔蹇鍵騫乞傑杰桀儉劍劒檢"],["cca1","瞼鈐黔劫怯?偈憩??格檄激膈覡隔堅牽犬甄絹繭肩見譴遣鵑抉決潔結缺訣兼慊箝謙鉗鎌京?倞傾?勁勍卿?境庚徑慶憬擎敬景?更梗涇炅烱璟?瓊痙硬磬竟競絅經耕耿脛莖警輕逕鏡頃頸驚鯨係啓堺契季屆悸戒桂械"],["cda1","?溪界癸?稽系?繼計誡谿階鷄古叩告呱固姑孤尻庫拷攷故敲暠枯槁沽痼皐睾稿羔考股膏苦?菰藁蠱袴誥?辜錮雇顧高鼓哭斛曲梏穀谷鵠困坤崑昆梱棍滾?袞鯤汨?骨供公共功孔工恐恭拱控攻?空蚣貢鞏串寡戈果瓜"],["cea1","科菓誇課跨過鍋顆廓槨?郭?冠官寬慣棺款灌??管罐菅觀貫關館刮恝括?侊光匡壙廣曠洸?狂珖筐胱鑛卦掛罫乖傀塊壞怪愧拐槐魁宏紘肱轟交僑咬喬嬌?巧攪敎校橋狡皎矯絞翹膠蕎蛟較轎郊餃驕鮫丘久九仇?具勾"],["cfa1","區口句咎嘔?垢寇嶇廐懼拘救枸柩構歐毆毬求溝灸狗玖球瞿矩究??臼舅舊苟衢謳購?逑邱鉤?駒驅鳩?龜國局菊鞠鞫?君窘群裙軍郡堀屈掘窟宮弓穹窮?躬倦券勸卷圈拳捲權?眷厥獗蕨蹶闕机櫃潰詭軌饋??歸貴"],["d0a1","鬼?叫圭奎揆槻珪硅窺竅糾葵規赳逵閨?均??菌鈞?橘克剋劇戟棘極隙僅?勤懃斤根槿瑾筋芹菫覲謹近饉?今?擒?檎琴禁禽?衾衿襟?錦?及急扱汲級給亘兢矜肯企伎其冀嗜器圻基埼?奇妓寄岐崎己幾忌技旗?"],["d1a1","朞期杞棋棄機欺氣汽沂淇?琦琪??畸畿碁磯祁祇祈祺箕紀綺羈耆?肌記譏豈起錡?飢饑騎騏驥麒緊佶吉拮桔金喫儺??娜懦?拏拿?",5,"那?",4,"諾????暖?煖??難?捏捺南??楠??男???"],["d2a1","納??衲?娘?",4,"乃??奈?耐?女年撚?念恬拈捻寧?努?奴弩怒???瑙?",5,"駑?",10,"濃??膿農惱??腦??尿?",7,"嫩訥?紐?",5,"能??尼泥匿溺多茶"],["d3a1","丹亶但單團壇彖斷旦檀段湍短端?緞蛋袒鄲鍛撻?獺疸達啖?憺擔曇淡湛潭澹痰?膽蕁覃談譚?沓?答踏?唐堂塘幢?撞棠當糖螳黨代垈?大對岱帶待戴擡玳臺袋貸隊黛宅德悳倒刀到圖堵塗導屠島嶋度徒悼挑掉搗桃"],["d4a1","棹櫂淘渡滔濤燾盜睹?稻萄覩賭跳蹈逃途道都鍍陶韜毒?牘犢獨督禿篤纛讀?惇敦?暾沌?燉豚頓?突仝冬凍動同憧東桐棟洞潼疼瞳童胴董銅兜斗杜?痘竇荳?豆逗頭屯臀?遁遯鈍得嶝橙燈登等藤謄鄧騰喇懶?癩羅"],["d5a1","蘿螺裸邏?洛烙珞絡落?酪駱?亂卵欄欒瀾爛蘭鸞剌辣嵐?攬欖濫籃纜藍襤覽拉臘?廊朗浪狼琅瑯螂郞來?徠?冷掠略亮倆兩凉梁?粮粱糧良諒輛量侶儷勵呂廬慮?旅櫚濾礪藜蠣閭驢驪麗黎力??瀝礫轢靂憐戀攣漣"],["d6a1","煉璉練聯蓮輦連?冽列劣洌烈裂廉斂?濂簾獵令伶囹?岺嶺怜玲?羚?聆逞鈴零靈領齡例?禮醴隷勞?撈?櫓?瀘爐盧老蘆虜路輅露魯鷺鹵碌祿綠??鹿麓論壟弄朧瀧瓏籠聾儡瀨牢磊賂賚賴雷了僚寮廖料燎療瞭聊蓼"],["d7a1","遼鬧龍壘婁?樓?漏瘻累縷?褸鏤陋劉旒柳榴流溜瀏琉瑠留瘤硫謬類六戮陸侖倫崙淪綸輪律慄栗?隆勒肋凜凌楞稜綾菱陵俚利厘吏?履悧李梨浬犁狸理璃?痢籬罹羸莉裏裡里釐離鯉吝?燐?藺躪隣鱗麟林淋琳臨霖?"],["d8a1","立笠粒摩瑪痲碼磨馬魔麻寞幕漠膜莫?万卍娩巒彎慢挽晩曼滿漫灣瞞萬蔓蠻輓饅鰻?抹末沫茉襪靺亡妄忘忙望網罔芒茫莽??埋妹媒寐昧枚梅?煤罵買賣邁魅脈貊陌驀麥孟氓猛盲盟萌冪覓免冕勉棉?眄眠綿緬面?滅"],["d9a1","蔑冥名命明暝?溟皿瞑茗?螟酩銘鳴袂侮冒募姆帽慕摸?暮某模母毛牟牡瑁眸矛耗?茅謀謨貌木沐牧目睦穆鶩歿沒夢朦蒙卯墓妙廟描昴杳渺猫?苗錨務巫憮懋戊拇撫无楙武毋無?畝繆舞茂蕪誣貿霧鵡墨默們刎吻問文"],["daa1","?紊紋聞蚊門?勿?物味媚尾嵋彌微未梶?渼?眉米美薇謎迷靡黴岷悶愍憫敏旻?民泯?珉緡閔密蜜謐?博拍搏撲朴樸泊珀璞箔粕縛膊舶薄迫雹駁伴半反叛拌搬攀斑槃?潘班畔瘢盤?磐?礬絆般蟠返頒飯勃拔撥渤?"],["dba1","發跋?鉢髮魃倣傍坊妨尨幇彷房放方旁昉枋榜滂磅紡肪膀舫芳蒡蚌訪謗邦防?倍俳?培徘拜排杯湃焙盃背胚裴裵?賠輩配陪伯佰帛柏栢白百魄幡樊煩燔番?繁蕃藩飜伐筏罰閥凡帆梵氾汎泛犯範范法琺僻劈壁擘檗璧癖"],["dca1","碧蘗闢霹?卞弁變辨辯邊別瞥?鼈丙?兵??昞?柄?炳甁病秉竝?餠?保堡報寶普?????甫菩補褓譜輔伏僕匐卜?復服福腹茯蔔複覆輹輻馥鰒本?俸奉封峯峰捧棒烽??縫蓬蜂逢鋒鳳不付俯傅剖副否咐埠夫婦"],["dda1","孚孵富府?扶敷斧浮溥父符簿缶腐腑膚艀芙?訃負賦賻赴趺部釜阜附?鳧北分吩噴墳奔奮忿憤扮?汾焚盆粉糞紛芬賁雰?佛弗彿拂崩朋棚硼繃鵬丕備匕匪卑妃婢庇悲憊扉批斐枇榧比毖?毘沸?琵痺砒碑秕秘粃緋翡肥"],["dea1","脾臂菲蜚裨誹譬費鄙非飛鼻?嬪彬斌檳殯浜濱瀕牝?貧賓頻憑氷聘騁乍事些仕伺似使俟?史司唆嗣四士奢娑寫寺射巳師徙思捨斜斯?査梭死沙泗渣瀉獅砂社祀祠私篩紗絲肆舍莎蓑蛇裟詐詞謝賜赦辭邪飼駟麝削?朔?"],["dfa1","傘刪山散汕珊産疝算蒜酸霰?撒殺?薩三?杉森?芟蔘衫?澁?颯上傷像償商喪嘗孀?峠常床庠廂想桑橡湘爽牀?相祥箱翔裳觴詳象賞霜塞璽賽嗇?穡索色牲生甥?笙墅壻嶼序庶徐恕抒?敍暑曙書栖棲犀瑞筮絮緖署"],["e0a1","胥舒薯西誓逝鋤黍鼠夕?席惜昔晳析汐淅潟石碩蓆釋錫仙僊先善嬋宣扇?旋?煽????癬禪線繕羨腺膳船蘚??跣選銑??鮮?屑楔泄洩渫舌薛褻設?雪齧?暹殲纖蟾贍閃陝攝?燮?城姓?性惺成星晟猩?盛省筬"],["e1a1","聖聲腥誠醒世勢?洗?笹細?貰召嘯塑宵小少?所掃?昭梳沼消溯瀟?燒甦疏疎?笑篠簫素紹蔬蕭蘇訴逍遡邵銷韶騷俗屬束?粟續謖贖速孫巽損?遜?率宋悚松淞訟誦送頌刷?灑碎鎖衰釗修受嗽囚垂壽嫂守岫?帥愁"],["e2a1","戍手授搜收數樹殊水洙漱燧狩獸琇??睡秀穗竪粹綏綬?羞脩茱蒐蓚藪袖誰讐輸遂邃酬銖銹隋隧隨雖需須首髓鬚叔塾夙孰宿淑?熟??肅菽巡徇循恂旬?楯?殉洵淳珣盾瞬筍純脣舜荀蓴蕣詢諄醇錞順馴戌術述?崇崧"],["e3a1","嵩瑟膝蝨濕拾習褶襲丞乘僧勝升承昇繩蠅陞侍匙嘶始?尸屎屍市弑恃施是時?柴猜矢示翅蒔蓍視試詩諡豕豺埴寔式息拭植殖湜熄?蝕識軾食飾伸?信呻娠宸愼新晨燼申神紳腎臣?薪?蜃訊身辛?迅失室實悉審尋心沁"],["e4a1","?深瀋甚芯諶什十?雙氏亞俄兒?娥峨我牙芽莪蛾衙訝阿雅餓鴉鵝堊岳嶽幄惡愕握樂渥鄂鍔顎鰐齷安岸按晏案眼雁鞍顔鮟斡謁軋閼?岩巖庵暗癌菴闇壓押狎鴨仰央怏昻殃秧鴦厓哀埃崖愛曖涯碍艾隘靄厄扼掖液縊腋額"],["e5a1","櫻罌鶯鸚也?冶夜惹揶椰爺耶?野弱??約若葯蒻藥躍?佯??壤孃恙揚攘?暘?楊樣洋瀁煬痒瘍禳穰?羊?襄?讓釀陽?養圄御於漁?禦語馭魚齬億憶抑檍臆偃堰彦焉言諺?蘖俺儼嚴奄掩淹?業円予余???如?"],["e6a1","?歟汝????與?茹輿??餘???亦?域役易??疫繹譯?逆驛嚥??娟宴?延??捐??椽?沿涎涓淵演?烟然煙?燃燕??硯?筵????衍軟???鉛?鳶???悅涅?熱???厭???染?炎??艶苒"],["e7a1","?閻?鹽曄?燁葉??塋??嶸影?映暎楹榮永泳?潁?瀛??營獰?瑛?瓔盈穎纓??英詠迎?鍈?霙??乂倪?刈叡曳??猊睿穢?藝蘂?裔詣譽豫???霓預五伍俉傲午吾?嗚塢墺奧?寤悟?懊敖?晤梧汚澳"],["e8a1","烏熬??蜈誤鰲鼇屋沃獄玉鈺??瘟穩?蘊兀壅擁瓮甕癰翁?雍?渦瓦窩窪臥蛙蝸訛婉完宛?椀浣玩??碗緩翫?腕莞豌阮頑曰往旺枉汪王倭娃歪矮外嵬巍猥畏??僥凹堯夭妖姚寥??嶢拗搖撓擾?曜?橈?燿瑤?"],["e9a1","窈窯?繞耀腰?蟯要謠遙?邀饒慾欲浴縟褥辱俑傭冗勇埇?容庸慂榕涌湧溶熔瑢用甬聳茸蓉踊鎔鏞?于佑偶優又友右宇寓尤愚憂?牛??盂祐?禹紆羽芋藕虞迂遇郵?隅雨??彧旭昱?煜?郁?云??殞??耘芸蕓"],["eaa1","運隕雲韻蔚鬱?熊雄元原員圓園垣媛?寃怨愿援??湲源爰猿?苑袁轅遠?院願鴛月越鉞位偉僞危圍委威尉慰?渭爲?緯胃萎葦?蝟衛?謂違韋魏乳侑儒兪?唯喩孺宥幼幽?悠惟愈愉揄攸有?柔柚?楡楢油??游?"],["eba1","濡猶猷?瑜由?癒??維臾萸裕誘諛諭踰蹂遊逾遺酉釉鍮????毓肉育??允?尹??潤?胤贇??閏????聿戎?絨融隆垠恩慇殷誾銀隱乙吟淫蔭陰音飮揖泣邑凝應膺鷹依倚儀宜意懿擬椅毅疑矣義艤?蟻衣誼"],["eca1","議醫二以伊??夷姨?已弛?怡????爾珥?異痍?移?而耳肄苡???貽貳邇??飴餌???益翊翌翼謚人仁刃印?咽因姻寅引忍湮???茵?蚓認?靭???一佚?壹日溢逸鎰?任壬妊姙恁??稔?荏賃入?"],["eda1","???仍剩孕?仔刺咨姉姿子字孜恣慈滋炙煮?瓷疵磁紫者自茨蔗藉諮資雌作勺嚼斫昨灼炸爵綽芍酌雀鵲孱棧殘潺盞岑暫潛箴簪蠶雜丈仗匠場墻壯奬將帳庄張掌暲杖樟檣?漿牆??璋章粧腸臟臧莊葬?薔藏裝贓?長"],["eea1","障再哉在宰才材栽梓?滓災縡裁財載齋齎爭箏諍錚佇低儲咀姐底抵杵楮樗沮渚狙猪疽箸紵苧?著藷詛貯躇這邸雎齟勣吊嫡寂摘敵滴狄?的積笛籍績?荻謫賊赤跡蹟迪迹適鏑佃?傳全典前剪??奠專展廛悛戰栓殿氈澱"],["efa1","煎?田甸畑癲筌箋箭篆纏詮輾轉鈿銓錢鐫電?顫餞切截折浙?竊節絶占岾店漸点粘霑鮎點接摺蝶丁井亭停偵呈?定幀庭廷征情挺政整旌晶?柾楨?正汀淀淨渟?瀞???町睛碇禎程穽精?艇訂?貞鄭酊釘鉦?錠霆靖"],["f0a1","靜頂鼎制劑啼堤帝弟悌提梯濟祭第臍薺製諸蹄醍除際霽題齊俎兆凋助嘲弔彫措操早晁曺曹朝條棗槽漕潮照燥爪?眺祖祚租稠窕粗糟組繰肇藻蚤詔調趙躁造遭釣阻雕鳥族簇足鏃存尊卒拙猝?宗從?慫棕淙琮種終綜縱腫"],["f1a1","踪踵鍾鐘佐坐左座挫罪主住侏做?胄呪周嗾奏宙州廚晝朱柱株注洲湊??珠疇籌紂紬綢舟蛛註誅走躊輳週酎酒鑄駐竹粥俊儁准埈?峻晙樽浚準濬?畯竣蠢逡遵雋駿茁中仲衆重?櫛楫汁葺增憎曾拯烝甑症繒蒸證贈之只"],["f2a1","咫地址志持指摯支旨智枝枳止池沚漬知砥祉祗紙肢脂至芝?蜘誌?贄趾遲直稙稷織職唇嗔塵振?晉晋?榛殄津?珍??畛疹盡眞瞋秦縉?臻?袗診賑軫辰進鎭陣陳震?叱姪嫉帙桎?疾秩窒膣蛭質跌迭斟朕?執?緝輯"],["f3a1","?集?懲澄且侘借叉嗟嵯差次此磋箚?蹉車遮捉搾着窄錯鑿齪撰?燦??竄簒纂粲?讚贊鑽餐饌刹察擦札紮僭參塹慘慙懺斬站讒讖倉倡創唱娼廠彰愴敞昌昶暢槍滄漲猖瘡窓脹艙菖蒼債?寀寨彩採砦綵菜蔡采釵冊柵策"],["f4a1","責凄妻悽處??剔尺?戚拓擲斥滌瘠脊蹠陟隻仟千喘天川擅泉淺?穿舛薦賤踐遷釧闡阡韆凸哲喆徹撤澈綴輟轍鐵僉尖沾添?瞻簽籤詹諂?妾帖捷牒疊睫諜貼輒廳晴淸聽菁請靑鯖?剃替涕滯締諦逮遞體初剿哨憔抄招梢"],["f5a1","椒楚樵炒焦硝礁礎秒稍肖艸?草蕉貂超酢醋?促囑燭矗蜀觸寸忖村邨叢塚寵??摠總聰?銃撮催崔最墜抽推椎楸樞湫皺秋芻萩諏趨追鄒酋醜錐錘鎚雛?鰍丑畜祝竺筑築縮蓄蹙蹴軸逐春椿?出朮黜充忠沖蟲衝衷悴膵萃"],["f6a1","贅取吹嘴娶就炊翠聚脆臭趣醉驟鷲側仄厠惻測層侈値嗤峙幟恥梔治?熾痔痴癡稚穉緇緻置致蚩輜雉馳齒則勅飭親七?漆侵寢枕沈浸?砧針鍼蟄秤稱快他咤唾墮妥惰打?朶楕舵陀?駝倬卓啄??托?擢?柝濁濯琢?託"],["f7a1","鐸呑嘆坦彈憚歎灘炭綻誕奪?探眈耽貪塔搭榻宕帑湯?蕩兌台太怠態殆汰泰笞胎苔??颱?擇澤??兎吐土討慟桶?痛筒統通堆槌腿褪退?偸套妬投透鬪慝特闖坡婆巴把播擺杷波派爬琶破罷芭跛頗判坂板版瓣販?鈑"],["f8a1","阪八叭捌佩唄悖敗沛?牌狽稗覇貝彭澎烹膨愎便偏扁片篇編翩遍鞭騙貶坪平?萍評吠嬖幣廢弊斃肺蔽閉陛?包匍匏咆哺圃布怖抛抱捕?泡浦疱砲胞脯苞葡蒲袍褒逋鋪飽鮑幅暴曝瀑爆?俵剽彪慓杓標漂瓢票表豹?飄驃"],["f9a1","品稟楓諷豊風馮彼披疲皮被避陂匹弼必泌?畢疋筆??乏逼下何厦夏廈?河瑕荷蝦賀遐霞鰕壑學虐謔鶴寒恨悍旱汗漢澣瀚罕翰閑閒限韓割轄函含咸啣喊檻涵緘艦銜陷鹹合哈盒蛤閤闔陜亢伉?嫦巷恒抗杭桁沆港缸肛航"],["faa1","??項亥偕咳垓奚孩害懈楷海?蟹解該諧邂駭骸劾核倖幸杏?行享向嚮?鄕響餉饗香?墟?許憲?獻軒歇險驗奕?赫革俔?弦懸??炫玄?現眩?絃絢縣舷衒?賢鉉顯孑穴血頁嫌?協夾峽挾浹狹脅脇莢鋏?亨兄刑型"],["fba1","形??瀅?炯??瑩荊螢衡???馨兮彗惠慧?蕙蹊醯鞋乎互呼壕壺好?弧?扈昊晧毫浩淏湖滸?濠??狐琥瑚瓠皓?糊縞胡芦葫蒿虎號蝴護豪鎬?顥惑或酷婚昏混渾琿魂忽惚笏哄弘汞泓洪?紅虹訌鴻化和?樺火?"],["fca1","禍禾花華話譁貨靴?擴攫確?穫丸喚奐宦幻患換歡晥桓渙煥環?還驩鰥活滑猾豁闊凰幌徨恍惶愰慌晃晄?況湟滉?煌?皇篁簧荒蝗遑隍?匯回廻徊恢悔懷晦會檜淮?灰獪繪膾茴蛔誨賄劃獲?橫?哮嚆孝效?曉梟?淆"],["fda1","爻肴酵驍侯候厚后吼喉嗅?後朽煦?逅勛勳??焄熏燻薰訓暈薨喧暄?萱卉喙?彙徽揮暉煇諱輝麾休携烋畦虧恤譎鷸兇凶匈洶胸黑昕欣?痕吃屹?訖欠欽?吸恰洽翕興僖?喜噫??嬉希憙憘?晞曦熙熹?犧禧稀羲詰"]];

/***/ }),

/***/ 923:
/***/ (function(module) {

"use strict";


// Generated data for sbcs codec. Don't edit manually. Regenerate using generation/gen-sbcs.js script.
module.exports = {
  "437": "cp437",
  "737": "cp737",
  "775": "cp775",
  "850": "cp850",
  "852": "cp852",
  "855": "cp855",
  "856": "cp856",
  "857": "cp857",
  "858": "cp858",
  "860": "cp860",
  "861": "cp861",
  "862": "cp862",
  "863": "cp863",
  "864": "cp864",
  "865": "cp865",
  "866": "cp866",
  "869": "cp869",
  "874": "windows874",
  "922": "cp922",
  "1046": "cp1046",
  "1124": "cp1124",
  "1125": "cp1125",
  "1129": "cp1129",
  "1133": "cp1133",
  "1161": "cp1161",
  "1162": "cp1162",
  "1163": "cp1163",
  "1250": "windows1250",
  "1251": "windows1251",
  "1252": "windows1252",
  "1253": "windows1253",
  "1254": "windows1254",
  "1255": "windows1255",
  "1256": "windows1256",
  "1257": "windows1257",
  "1258": "windows1258",
  "28591": "iso88591",
  "28592": "iso88592",
  "28593": "iso88593",
  "28594": "iso88594",
  "28595": "iso88595",
  "28596": "iso88596",
  "28597": "iso88597",
  "28598": "iso88598",
  "28599": "iso88599",
  "28600": "iso885910",
  "28601": "iso885911",
  "28603": "iso885913",
  "28604": "iso885914",
  "28605": "iso885915",
  "28606": "iso885916",
  "windows874": {
    "type": "_sbcs",
    "chars": "?????…???????????‘’“”???????????????????????????????????????????????????????????????????????????????????????????????????????????"
  },
  "win874": "windows874",
  "cp874": "windows874",
  "windows1250": {
    "type": "_sbcs",
    "chars": "?????…†‡?‰???????‘’“”?????????????????|§¨c?≪￢-R?°±??´μ¶・，??≫?????AA?A??C?E?E?II????OO?O×??U?UY?s?aa?a??c?e?e?ii????oo?o÷??u?uy??"
  },
  "win1250": "windows1250",
  "cp1250": "windows1250",
  "windows1251": {
    "type": "_sbcs",
    "chars": "?????…†‡?‰???????‘’“”?????????????????|§Ёc?≪￢-R?°±???μ¶・ё№?≫????АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
  },
  "win1251": "windows1251",
  "cp1251": "windows1251",
  "windows1252": {
    "type": "_sbcs",
    "chars": "?????…†‡?‰???????‘’“”????????????!￠￡?\|§¨ca≪￢-R￣°±23´μ¶・，1o≫????AAAAAAACEEEEIIIIDNOOOOO×OUUUUYTsaaaaaaaceeeeiiiidnooooo÷ouuuuyty"
  },
  "win1252": "windows1252",
  "cp1252": "windows1252",
  "windows1253": {
    "type": "_sbcs",
    "chars": "?????…†‡?‰???????‘’“”??????????????￡?\|§¨c?≪￢-R―°±23?μ¶・???≫?????ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ?ΣΤΥΦΧΨΩ???????αβγδεζηθικλμνξοπρ?στυφχψω??????"
  },
  "win1253": "windows1253",
  "cp1253": "windows1253",
  "windows1254": {
    "type": "_sbcs",
    "chars": "?????…†‡?‰???????‘’“”????????????!￠￡?\|§¨ca≪￢-R￣°±23´μ¶・，1o≫????AAAAAAACEEEEIIII?NOOOOO×OUUUU??saaaaaaaceeeeiiii?nooooo÷ouuuu??y"
  },
  "win1254": "windows1254",
  "cp1254": "windows1254",
  "windows1255": {
    "type": "_sbcs",
    "chars": "?????…†‡?‰???????‘’“”????????????!￠￡?\|§¨c×≪￢-R￣°±23´μ¶・，1÷≫????????????????????????????????????????????????????????????????????"
  },
  "win1255": "windows1255",
  "cp1255": "windows1255",
  "windows1256": {
    "type": "_sbcs",
    "chars": "?????…†‡?‰???????‘’“”?????????????￠￡?\|§¨c?≪￢-R￣°±23´μ¶・，1?≫???????????????????????????×????????a?a????ceeee??ii????o??÷?u?uu???"
  },
  "win1256": "windows1256",
  "cp1256": "windows1256",
  "windows1257": {
    "type": "_sbcs",
    "chars": "?????…†‡?‰???¨?，?‘’“”????????￣????￠￡??|§Oc?≪￢-RA°±23´μ¶・o1?≫???a????AA???E?????????O?OO×????U??s????aa???e?????????o?oo÷????u???"
  },
  "win1257": "windows1257",
  "cp1257": "windows1257",
  "windows1258": {
    "type": "_sbcs",
    "chars": "?????…†‡?‰???????‘’“”????????????!￠￡?\|§¨ca≪￢-R￣°±23´μ¶・，1o≫????AAA?AAACEEEE?III?N?OO?O×OUUUU??saaa?aaaceeee?iii?n?oo?o÷ouuuu??y"
  },
  "win1258": "windows1258",
  "cp1258": "windows1258",
  "iso88591": {
    "type": "_sbcs",
    "chars": "????????????????????????????????!￠￡?\|§¨ca≪￢-R￣°±23´μ¶・，1o≫????AAAAAAACEEEEIIIIDNOOOOO×OUUUUYTsaaaaaaaceeeeiiiidnooooo÷ouuuuyty"
  },
  "cp28591": "iso88591",
  "iso88592": {
    "type": "_sbcs",
    "chars": "??????????????????????????????????????§¨????-??°???´???，????????AA?A??C?E?E?II????OO?O×??U?UY?s?aa?a??c?e?e?ii????oo?o÷??u?uy??"
  },
  "cp28592": "iso88592",
  "iso88593": {
    "type": "_sbcs",
    "chars": "??????????????????????????????????￡???§¨????-??°?23´μ?・，???????AAA?A??CEEEEIIII?NOOO?O×?UUUU??saaa?a??ceeeeiiii?nooo?o÷?uuuu???"
  },
  "cp28593": "iso88593",
  "iso88594": {
    "type": "_sbcs",
    "chars": "??????????????????????????????????????§¨????-?￣°???´???，????????AAAAAA??E?E?II?????OOO×O?UUU??s?aaaaaa??e?e?ii?????ooo÷o?uuu???"
  },
  "cp28594": "iso88594",
  "iso88595": {
    "type": "_sbcs",
    "chars": "????????????????????????????????Ё???????????-??АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ё???????????§??"
  },
  "cp28595": "iso88595",
  "iso88596": {
    "type": "_sbcs",
    "chars": "????????????????????????????????????????????-??????????????????????????????????????????????????????????????????????????????????"
  },
  "cp28596": "iso88596",
  "iso88597": {
    "type": "_sbcs",
    "chars": "????????????????????????????????‘’￡??|§¨c?≪￢-?―°±23???・???≫?????ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ?ΣΤΥΦΧΨΩ???????αβγδεζηθικλμνξοπρ?στυφχψω??????"
  },
  "cp28597": "iso88597",
  "iso88598": {
    "type": "_sbcs",
    "chars": "?????????????????????????????????￠￡?\|§¨c×≪￢-R￣°±23´μ¶・，1÷≫????????????????????????????????????????????????????????????????????"
  },
  "cp28598": "iso88598",
  "iso88599": {
    "type": "_sbcs",
    "chars": "????????????????????????????????!￠￡?\|§¨ca≪￢-R￣°±23´μ¶・，1o≫????AAAAAAACEEEEIIII?NOOOOO×OUUUU??saaaaaaaceeeeiiii?nooooo÷ouuuu??y"
  },
  "cp28599": "iso88599",
  "iso885910": {
    "type": "_sbcs",
    "chars": "??????????????????????????????????????§?????-??°??????・?????―???AAAAAA??E?E?IIID??OOOO?O?UUUYTs?aaaaaa??e?e?iiid??oooo?o?uuuyt?"
  },
  "cp28600": "iso885910",
  "iso885911": {
    "type": "_sbcs",
    "chars": "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????"
  },
  "cp28601": "iso885911",
  "iso885913": {
    "type": "_sbcs",
    "chars": "????????????????????????????????”￠￡??|§Oc?≪￢-RA°±23“μ¶・o1?≫???a????AA???E?????????O?OO×????U??s????aa???e?????????o?oo÷????u??’"
  },
  "cp28603": "iso885913",
  "iso885914": {
    "type": "_sbcs",
    "chars": "??????????????????????????????????￡???§?c???-R???????¶?????????AAAAAAACEEEEIIII?NOOOOO?OUUUUY?saaaaaaaceeeeiiii?nooooo?ouuuuy?y"
  },
  "cp28604": "iso885914",
  "iso885915": {
    "type": "_sbcs",
    "chars": "????????????????????????????????!￠￡?\?§?ca≪￢-R￣°±23?μ¶・?1o≫????AAAAAAACEEEEIIIIDNOOOOO×OUUUUYTsaaaaaaaceeeeiiiidnooooo÷ouuuuyty"
  },
  "cp28605": "iso885915",
  "iso885916": {
    "type": "_sbcs",
    "chars": "??????????????????????????????????????§?c?≪?-??°±???”¶・???≫????AAA?A?ACEEEEIIII??OOO?O??UUUU??saaa?a?aceeeeiiii??ooo?o??uuuu??y"
  },
  "cp28606": "iso885916",
  "cp437": {
    "type": "_sbcs",
    "chars": "CueaaaaceeeiiiAAEaAooouuyOU￠￡\??aiounNao??￢??!≪≫???│┤??????????┐└┴┬├─┼???????????????????┘┌?????αsΓπΣσμτΦΘΩδ∞φε∩≡±????÷?°?・√?2■?"
  },
  "ibm437": "cp437",
  "csibm437": "cp437",
  "cp737": {
    "type": "_sbcs",
    "chars": "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσ?τυφχψ???│┤??????????┐└┴┬├─┼???????????????????┘┌?????ω????????????????±????÷?°?・√?2■?"
  },
  "ibm737": "cp737",
  "csibm737": "cp737",
  "cp775": {
    "type": "_sbcs",
    "chars": "?ue?a?a???????AAEaA?o?￠??OUo￡O×???o???”|cR￢???≪≫???│┤??????????┐└┴┬├─┼???????????????????┘┌?????Os??oOμ????????’-±“?¶§÷?°?・132■?"
  },
  "ibm775": "cp775",
  "csibm775": "cp775",
  "cp850": {
    "type": "_sbcs",
    "chars": "CueaaaaceeeiiiAAEaAooouuyOUo￡O×?aiounNao?R￢??!≪≫???│┤AAAc????￠\┐└┴┬├─┼aA????????dDEEE?III┘┌??|I?OsOOoOμtTUUUyY￣´-±??¶§÷，°¨・132■?"
  },
  "ibm850": "cp850",
  "csibm850": "cp850",
  "cp852": {
    "type": "_sbcs",
    "chars": "Cueaa??c?e??i?A?E??oo????OU???×?aiou??????￢???≪≫???│┤AA????????┐└┴┬├─┼?????????????E??II?┘┌?????OsO??????U??yY?´-????§÷，°¨????■?"
  },
  "ibm852": "cp852",
  "csibm852": "cp852",
  "cp855": {
    "type": "_sbcs",
    "chars": "????ёЁ??????????????????????юЮъЪаАбБцЦдДеЕфФгГ≪≫???│┤хХиИ????йЙ┐└┴┬├─┼кК????????лЛмМнНоОп┘┌??Пя?ЯрРсСтТуУжЖвВьЬ№-ыЫзЗшШэЭщЩчЧ§■?"
  },
  "ibm855": "cp855",
  "csibm855": "cp855",
  "cp856": {
    "type": "_sbcs",
    "chars": "????????????????????????????￡?×??????????R￢???≪≫???│┤???c????￠\┐└┴┬├─┼???????????????????┘┌??|????????μ???????￣´-±??¶§÷，°¨・132■?"
  },
  "ibm856": "cp856",
  "csibm856": "cp856",
  "cp857": {
    "type": "_sbcs",
    "chars": "Cueaaaaceeeii?AAEaAooouu?OUo￡O??aiounN???R￢??!≪≫???│┤AAAc????￠\┐└┴┬├─┼aA????????oaEEE?III┘┌??|I?OsOOoOμ?×UUUiy￣´-±??¶§÷，°¨・132■?"
  },
  "ibm857": "cp857",
  "csibm857": "cp857",
  "cp858": {
    "type": "_sbcs",
    "chars": "CueaaaaceeeiiiAAEaAooouuyOUo￡O×?aiounNao?R￢??!≪≫???│┤AAAc????￠\┐└┴┬├─┼aA????????dDEEE?III┘┌??|I?OsOOoOμtTUUUyY￣´-±??¶§÷，°¨・132■?"
  },
  "ibm858": "cp858",
  "csibm858": "cp858",
  "cp860": {
    "type": "_sbcs",
    "chars": "CueaaaAceEeIOiAAEAEoooUuIOU￠￡U?OaiounNao?O￢??!≪≫???│┤??????????┐└┴┬├─┼???????????????????┘┌?????αsΓπΣσμτΦΘΩδ∞φε∩≡±????÷?°?・√?2■?"
  },
  "ibm860": "cp860",
  "csibm860": "cp860",
  "cp861": {
    "type": "_sbcs",
    "chars": "CueaaaaceeeDdTAAEaAootuYyOUo￡O??aiouAIOU??￢??!≪≫???│┤??????????┐└┴┬├─┼???????????????????┘┌?????αsΓπΣσμτΦΘΩδ∞φε∩≡±????÷?°?・√?2■?"
  },
  "ibm861": "cp861",
  "csibm861": "cp861",
  "cp862": {
    "type": "_sbcs",
    "chars": "???????????????????????????￠￡\??aiounNao??￢??!≪≫???│┤??????????┐└┴┬├─┼???????????????????┘┌?????αsΓπΣσμτΦΘΩδ∞φε∩≡±????÷?°?・√?2■?"
  },
  "ibm862": "cp862",
  "csibm862": "cp862",
  "cp863": {
    "type": "_sbcs",
    "chars": "CueaAa¶ceeeii?A§EEEoEIuu?OU￠￡UU?|´ou¨，3￣I?￢???≪≫???│┤??????????┐└┴┬├─┼???????????????????┘┌?????αsΓπΣσμτΦΘΩδ∞φε∩≡±????÷?°?・√?2■?"
  },
  "ibm863": "cp863",
  "csibm863": "cp863",
  "cp864": {
    "type": "_sbcs",
    "chars": "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#$?&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°・?√?─│┼┤┬├┴┐┌└┘β∞φ±???≪≫????????-?￡????????????????????????????￠??????????????????????????|￢÷×???????????????????????????????■?"
  },
  "ibm864": "cp864",
  "csibm864": "cp864",
  "cp865": {
    "type": "_sbcs",
    "chars": "CueaaaaceeeiiiAAEaAooouuyOUo￡O??aiounNao??￢??!≪????│┤??????????┐└┴┬├─┼???????????????????┘┌?????αsΓπΣσμτΦΘΩδ∞φε∩≡±????÷?°?・√?2■?"
  },
  "ibm865": "cp865",
  "csibm865": "cp865",
  "cp866": {
    "type": "_sbcs",
    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп???│┤??????????┐└┴┬├─┼???????????????????┘┌?????рстуфхцчшщъыьэюяЁё??????°?・√№?■?"
  },
  "ibm866": "cp866",
  "csibm866": "cp866",
  "cp869": {
    "type": "_sbcs",
    "chars": "????????・￢|‘’?―????????c?23?￡???????ΑΒΓΔΕΖΗ?ΘΙ≪≫???│┤ΚΛΜΝ????ΞΟ┐└┴┬├─┼ΠΡ???????ΣΤΥΦΧΨΩαβγ┘┌??δε?ζηθικλμνξοπρσ?τ?-±υφχ§ψ?°¨ω???■?"
  },
  "ibm869": "cp869",
  "csibm869": "cp869",
  "cp922": {
    "type": "_sbcs",
    "chars": "????????????????????????????????!￠￡?\|§¨ca≪￢-R?°±23´μ¶・，1o≫????AAAAAAACEEEEIIII?NOOOOO×OUUUUY?saaaaaaaceeeeiiii?nooooo÷ouuuuy?y"
  },
  "ibm922": "cp922",
  "csibm922": "cp922",
  "cp1046": {
    "type": "_sbcs",
    "chars": "?×÷??????■│─┐┌└┘?????????????????????????????-??????????????????????????????????????????????????????????????????????????????????"
  },
  "ibm1046": "cp1046",
  "csibm1046": "cp1046",
  "cp1124": {
    "type": "_sbcs",
    "chars": "????????????????????????????????Ё???????????-??АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ё???????????§??"
  },
  "ibm1124": "cp1124",
  "csibm1124": "cp1124",
  "cp1125": {
    "type": "_sbcs",
    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп???│┤??????????┐└┴┬├─┼???????????????????┘┌?????рстуфхцчшщъыьэюяЁё????????・√№?■?"
  },
  "ibm1125": "cp1125",
  "csibm1125": "cp1125",
  "cp1129": {
    "type": "_sbcs",
    "chars": "????????????????????????????????!￠￡?\|§?ca≪￢-R￣°±23?μ¶・?1o≫????AAA?AAACEEEE?III?N?OO?O×OUUUU??saaa?aaaceeee?iii?n?oo?o÷ouuuu??y"
  },
  "ibm1129": "cp1129",
  "csibm1129": "cp1129",
  "cp1133": {
    "type": "_sbcs",
    "chars": "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????￠￢|?"
  },
  "ibm1133": "cp1133",
  "csibm1133": "cp1133",
  "cp1161": {
    "type": "_sbcs",
    "chars": "????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????￠￢|?"
  },
  "ibm1161": "cp1161",
  "csibm1161": "cp1161",
  "cp1162": {
    "type": "_sbcs",
    "chars": "?????…???????????‘’“”???????????????????????????????????????????????????????????????????????????????????????????????????????????"
  },
  "ibm1162": "cp1162",
  "csibm1162": "cp1162",
  "cp1163": {
    "type": "_sbcs",
    "chars": "????????????????????????????????!￠￡?\|§?ca≪￢-R￣°±23?μ¶・?1o≫????AAA?AAACEEEE?III?N?OO?O×OUUUU??saaa?aaaceeee?iii?n?oo?o÷ouuuu??y"
  },
  "ibm1163": "cp1163",
  "csibm1163": "cp1163",
  "maccroatian": {
    "type": "_sbcs",
    "chars": "AACENOUaaaaaaceeeeiiiinooooouuuu†°￠￡§?¶sR??´¨≠?O∞±???μ∂∑??∫ao??o?!￢√???≪?…?AAO????“”‘’÷??c????A≫?・??‰A?A?EIIIIOO?OUUU???￣πE?，Ea?"
  },
  "maccyrillic": {
    "type": "_sbcs",
    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°￠￡§?¶?Rc???≠??∞±???μ∂???????????￢√???≪≫…????????“”‘’÷?????№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю?"
  },
  "macgreek": {
    "type": "_sbcs",
    "chars": "A12E3OU?aaa?¨ceeee￡?ii??‰oo|-uuu†ΓΔΘΛΞΠsRcΣ?§≠°?Α±??\ΒΕΖΗΙΚΜΦ?ΨΩ?Ν￢ΟΡ?Τ≪≫…?ΥΧ????―“”‘’÷??????????αβψδεφγηιξκλμνοπ?ρστθω?χυζ?????"
  },
  "maciceland": {
    "type": "_sbcs",
    "chars": "AACENOUaaaaaaceeeeiiiinooooouuuuY°￠￡§?¶sRc?´¨≠AO∞±??\μ∂∑?π∫ao?ao?!￢√???≪≫…?AAO????“”‘’÷?y???DdTty・??‰AEAEEIIIIOO?OUUU???￣???，???"
  },
  "macroman": {
    "type": "_sbcs",
    "chars": "AACENOUaaaaaaceeeeiiiinooooouuuu†°￠￡§?¶sRc?´¨≠AO∞±??\μ∂∑?π∫ao?ao?!￢√???≪≫…?AAO????“”‘’÷?y???????‡・??‰AEAEEIIIIOO?OUUU???￣???，???"
  },
  "macromania": {
    "type": "_sbcs",
    "chars": "AACENOUaaaaaaceeeeiiiinooooouuuu†°￠￡§?¶sRc?´¨≠??∞±??\μ∂∑?π∫ao????!￢√???≪≫…?AAO????“”‘’÷?y???????‡・??‰AEAEEIIIIOO?OUUU???￣???，???"
  },
  "macthai": {
    "type": "_sbcs",
    "chars": "≪≫…??????????“”??????????????‘’???????????????????????????????????????????????????????????????????????????????????????????Rc????"
  },
  "macturkish": {
    "type": "_sbcs",
    "chars": "AACENOUaaaaaaceeeeiiiinooooouuuu†°￠￡§?¶sRc?´¨≠AO∞±??\μ∂∑?π∫ao?ao?!￢√???≪≫…?AAO????“”‘’÷?y???????‡・??‰AEAEEIIIIOO?OUUU???￣???，???"
  },
  "macukraine": {
    "type": "_sbcs",
    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°?￡§?¶?Rc???≠??∞±???μ????????????￢√???≪≫…????????“”‘’÷?????№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю?"
  },
  "koi8r": {
    "type": "_sbcs",
    "chars": "─│┌┐└┘├┤┬┴┼?????????■?√?????°2・÷???ё???????????????Ё???????????cюабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
  },
  "koi8u": {
    "type": "_sbcs",
    "chars": "─│┌┐└┘├┤┬┴┼?????????■?√?????°2・÷???ё???????????????Ё???????????cюабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
  },
  "koi8ru": {
    "type": "_sbcs",
    "chars": "─│┌┐└┘├┤┬┴┼?????????■?√?????°2・÷???ё???????????????Ё???????????cюабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
  },
  "koi8t": {
    "type": "_sbcs",
    "chars": "?????…†‡?‰???????‘’“”??????????????ё??|§???≪￢-R?°±2Ё??¶・?№?≫???cюабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
  },
  "armscii8": {
    "type": "_sbcs",
    "chars": "???????????????????????????????????)(≫≪?.?,-?…?????????????????????????????????????????????????????????????????????????????????"
  },
  "rk1048": {
    "type": "_sbcs",
    "chars": "?????…†‡?‰???????‘’“”?????????????????|§Ёc?≪￢-R?°±???μ¶・ё№?≫????АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
  },
  "tcvn": {
    "type": "_sbcs",
    "chars": "\u0000U?\u0003???\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010?????Y?\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~A?AA???E??E??I??I?O?OO???????U????AEO????aeo?????????a?aa???????????????????e???e??????i?????i?o??oo???????????u???u?????????y??"
  },
  "georgianacademy": {
    "type": "_sbcs",
    "chars": "????…†‡?‰???????‘’“”????????????!￠￡?\|§¨ca≪￢-R￣°±23´μ¶・，1o≫???????????????????????????????????????????ceeeeiiiidnooooo÷ouuuuyty"
  },
  "georgianps": {
    "type": "_sbcs",
    "chars": "????…†‡?‰???????‘’“”????????????!￠￡?\|§¨ca≪￢-R￣°±23´μ¶・，1o≫??????????????????????????????????????????aceeeeiiiidnooooo÷ouuuuyty"
  },
  "pt154": {
    "type": "_sbcs",
    "chars": "?????…???????????‘’“”??????????????????§Ёc?≪￢?R?°?????¶・ё№?≫????АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
  },
  "viscii": {
    "type": "_sbcs",
    "chars": "\u0000\u0001?\u0003\u0004??\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013?\u0015\u0016\u0017\u0018?\u001a\u001b\u001c\u001d?\u001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~????????????????????????????????O???????????????????????????????AAAA????EEE?II????OOO????UU??Y??aaaa????eee?ii????oooo???uu??y??"
  },
  "iso646cn": {
    "type": "_sbcs",
    "chars": "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#\%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????"
  },
  "iso646jp": {
    "type": "_sbcs",
    "chars": "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????"
  },
  "hproman8": {
    "type": "_sbcs",
    "chars": "????????????????????????????????AAEEEII´??¨?UU?￣Yy°CcNn!??￡\§?￠aeouaeouaeouaeouAiOAaioaAiOUEisOAAaDdIIOOOo??U?yTt・μ¶????ao≪■≫±?"
  },
  "macintosh": {
    "type": "_sbcs",
    "chars": "AACENOUaaaaaaceeeeiiiinooooouuuu†°￠￡§?¶sRc?´¨≠AO∞±??\μ∂∑?π∫ao?ao?!￢√???≪≫…?AAO????“”‘’÷?y???????‡・??‰AEAEEIIIIOO?OUUU???￣???，???"
  },
  "ascii": {
    "type": "_sbcs",
    "chars": "????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????"
  },
  "tis620": {
    "type": "_sbcs",
    "chars": "????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????"
  }
}

/***/ }),

/***/ 929:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasNextPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)

function hasNextPage (link) {
  deprecate(`octokit.hasNextPage() ? You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).next
}


/***/ }),

/***/ 930:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


// Update this array if you add/rename/remove files in this directory.
// We support Browserify by skipping automatic module discovery and requiring modules directly.
var modules = [
    __webpack_require__(91),
    __webpack_require__(673),
    __webpack_require__(278),
    __webpack_require__(964),
    __webpack_require__(769),
    __webpack_require__(923),
    __webpack_require__(834),
    __webpack_require__(513),
];

// Put all encoding/alias/codec definitions to single object and export it. 
for (var i = 0; i < modules.length; i++) {
    var module = modules[i];
    for (var enc in module)
        if (Object.prototype.hasOwnProperty.call(module, enc))
            exports[enc] = module[enc];
}


/***/ }),

/***/ 948:
/***/ (function(module) {

"use strict";


/**
 * Tries to execute a function and discards any error that occurs.
 * @param {Function} fn - Function that might or might not throw an error.
 * @returns {?*} Return-value of the function when no error occurred.
 */
module.exports = function(fn) {

	try { return fn() } catch (e) {}

}

/***/ }),

/***/ 954:
/***/ (function(module) {

module.exports = validateAuth;

function validateAuth(auth) {
  if (typeof auth === "string") {
    return;
  }

  if (typeof auth === "function") {
    return;
  }

  if (auth.username && auth.password) {
    return;
  }

  if (auth.clientId && auth.clientSecret) {
    return;
  }

  throw new Error(`Invalid "auth" option: ${JSON.stringify(auth)}`);
}


/***/ }),

/***/ 955:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const path = __webpack_require__(622);
const childProcess = __webpack_require__(129);
const crossSpawn = __webpack_require__(20);
const stripEof = __webpack_require__(768);
const npmRunPath = __webpack_require__(621);
const isStream = __webpack_require__(323);
const _getStream = __webpack_require__(145);
const pFinally = __webpack_require__(697);
const onExit = __webpack_require__(260);
const errname = __webpack_require__(427);
const stdio = __webpack_require__(168);

const TEN_MEGABYTES = 1000 * 1000 * 10;

function handleArgs(cmd, args, opts) {
	let parsed;

	opts = Object.assign({
		extendEnv: true,
		env: {}
	}, opts);

	if (opts.extendEnv) {
		opts.env = Object.assign({}, process.env, opts.env);
	}

	if (opts.__winShell === true) {
		delete opts.__winShell;
		parsed = {
			command: cmd,
			args,
			options: opts,
			file: cmd,
			original: {
				cmd,
				args
			}
		};
	} else {
		parsed = crossSpawn._parse(cmd, args, opts);
	}

	opts = Object.assign({
		maxBuffer: TEN_MEGABYTES,
		buffer: true,
		stripEof: true,
		preferLocal: true,
		localDir: parsed.options.cwd || process.cwd(),
		encoding: 'utf8',
		reject: true,
		cleanup: true
	}, parsed.options);

	opts.stdio = stdio(opts);

	if (opts.preferLocal) {
		opts.env = npmRunPath.env(Object.assign({}, opts, {cwd: opts.localDir}));
	}

	if (opts.detached) {
		// #115
		opts.cleanup = false;
	}

	if (process.platform === 'win32' && path.basename(parsed.command) === 'cmd.exe') {
		// #116
		parsed.args.unshift('/q');
	}

	return {
		cmd: parsed.command,
		args: parsed.args,
		opts,
		parsed
	};
}

function handleInput(spawned, input) {
	if (input === null || input === undefined) {
		return;
	}

	if (isStream(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
}

function handleOutput(opts, val) {
	if (val && opts.stripEof) {
		val = stripEof(val);
	}

	return val;
}

function handleShell(fn, cmd, opts) {
	let file = '/bin/sh';
	let args = ['-c', cmd];

	opts = Object.assign({}, opts);

	if (process.platform === 'win32') {
		opts.__winShell = true;
		file = process.env.comspec || 'cmd.exe';
		args = ['/s', '/c', `"${cmd}"`];
		opts.windowsVerbatimArguments = true;
	}

	if (opts.shell) {
		file = opts.shell;
		delete opts.shell;
	}

	return fn(file, args, opts);
}

function getStream(process, stream, {encoding, buffer, maxBuffer}) {
	if (!process[stream]) {
		return null;
	}

	let ret;

	if (!buffer) {
		// TODO: Use `ret = util.promisify(stream.finished)(process[stream]);` when targeting Node.js 10
		ret = new Promise((resolve, reject) => {
			process[stream]
				.once('end', resolve)
				.once('error', reject);
		});
	} else if (encoding) {
		ret = _getStream(process[stream], {
			encoding,
			maxBuffer
		});
	} else {
		ret = _getStream.buffer(process[stream], {maxBuffer});
	}

	return ret.catch(err => {
		err.stream = stream;
		err.message = `${stream} ${err.message}`;
		throw err;
	});
}

function makeError(result, options) {
	const {stdout, stderr} = result;

	let err = result.error;
	const {code, signal} = result;

	const {parsed, joinedCmd} = options;
	const timedOut = options.timedOut || false;

	if (!err) {
		let output = '';

		if (Array.isArray(parsed.opts.stdio)) {
			if (parsed.opts.stdio[2] !== 'inherit') {
				output += output.length > 0 ? stderr : `\n${stderr}`;
			}

			if (parsed.opts.stdio[1] !== 'inherit') {
				output += `\n${stdout}`;
			}
		} else if (parsed.opts.stdio !== 'inherit') {
			output = `\n${stderr}${stdout}`;
		}

		err = new Error(`Command failed: ${joinedCmd}${output}`);
		err.code = code < 0 ? errname(code) : code;
	}

	err.stdout = stdout;
	err.stderr = stderr;
	err.failed = true;
	err.signal = signal || null;
	err.cmd = joinedCmd;
	err.timedOut = timedOut;

	return err;
}

function joinCmd(cmd, args) {
	let joinedCmd = cmd;

	if (Array.isArray(args) && args.length > 0) {
		joinedCmd += ' ' + args.join(' ');
	}

	return joinedCmd;
}

module.exports = (cmd, args, opts) => {
	const parsed = handleArgs(cmd, args, opts);
	const {encoding, buffer, maxBuffer} = parsed.opts;
	const joinedCmd = joinCmd(cmd, args);

	let spawned;
	try {
		spawned = childProcess.spawn(parsed.cmd, parsed.args, parsed.opts);
	} catch (err) {
		return Promise.reject(err);
	}

	let removeExitHandler;
	if (parsed.opts.cleanup) {
		removeExitHandler = onExit(() => {
			spawned.kill();
		});
	}

	let timeoutId = null;
	let timedOut = false;

	const cleanup = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}

		if (removeExitHandler) {
			removeExitHandler();
		}
	};

	if (parsed.opts.timeout > 0) {
		timeoutId = setTimeout(() => {
			timeoutId = null;
			timedOut = true;
			spawned.kill(parsed.opts.killSignal);
		}, parsed.opts.timeout);
	}

	const processDone = new Promise(resolve => {
		spawned.on('exit', (code, signal) => {
			cleanup();
			resolve({code, signal});
		});

		spawned.on('error', err => {
			cleanup();
			resolve({error: err});
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', err => {
				cleanup();
				resolve({error: err});
			});
		}
	});

	function destroy() {
		if (spawned.stdout) {
			spawned.stdout.destroy();
		}

		if (spawned.stderr) {
			spawned.stderr.destroy();
		}
	}

	const handlePromise = () => pFinally(Promise.all([
		processDone,
		getStream(spawned, 'stdout', {encoding, buffer, maxBuffer}),
		getStream(spawned, 'stderr', {encoding, buffer, maxBuffer})
	]).then(arr => {
		const result = arr[0];
		result.stdout = arr[1];
		result.stderr = arr[2];

		if (result.error || result.code !== 0 || result.signal !== null) {
			const err = makeError(result, {
				joinedCmd,
				parsed,
				timedOut
			});

			// TODO: missing some timeout logic for killed
			// https://github.com/nodejs/node/blob/master/lib/child_process.js#L203
			// err.killed = spawned.killed || killed;
			err.killed = err.killed || spawned.killed;

			if (!parsed.opts.reject) {
				return err;
			}

			throw err;
		}

		return {
			stdout: handleOutput(parsed.opts, result.stdout),
			stderr: handleOutput(parsed.opts, result.stderr),
			code: 0,
			failed: false,
			killed: false,
			signal: null,
			cmd: joinedCmd,
			timedOut: false
		};
	}), destroy);

	crossSpawn._enoent.hookChildProcess(spawned, parsed.parsed);

	handleInput(spawned, parsed.opts.input);

	spawned.then = (onfulfilled, onrejected) => handlePromise().then(onfulfilled, onrejected);
	spawned.catch = onrejected => handlePromise().catch(onrejected);

	return spawned;
};

// TODO: set `stderr: 'ignore'` when that option is implemented
module.exports.stdout = (...args) => module.exports(...args).then(x => x.stdout);

// TODO: set `stdout: 'ignore'` when that option is implemented
module.exports.stderr = (...args) => module.exports(...args).then(x => x.stderr);

module.exports.shell = (cmd, opts) => handleShell(module.exports, cmd, opts);

module.exports.sync = (cmd, args, opts) => {
	const parsed = handleArgs(cmd, args, opts);
	const joinedCmd = joinCmd(cmd, args);

	if (isStream(parsed.opts.input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}

	const result = childProcess.spawnSync(parsed.cmd, parsed.args, parsed.opts);
	result.code = result.status;

	if (result.error || result.status !== 0 || result.signal !== null) {
		const err = makeError(result, {
			joinedCmd,
			parsed
		});

		if (!parsed.opts.reject) {
			return err;
		}

		throw err;
	}

	return {
		stdout: handleOutput(parsed.opts, result.stdout),
		stderr: handleOutput(parsed.opts, result.stderr),
		code: 0,
		failed: false,
		signal: null,
		cmd: joinedCmd,
		timedOut: false
	};
};

module.exports.shellSync = (cmd, opts) => handleShell(module.exports.sync, cmd, opts);


/***/ }),

/***/ 959:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(293).Buffer,
    Transform = __webpack_require__(413).Transform;


// == Exports ==================================================================
module.exports = function(iconv) {
    
    // Additional Public API.
    iconv.encodeStream = function encodeStream(encoding, options) {
        return new IconvLiteEncoderStream(iconv.getEncoder(encoding, options), options);
    }

    iconv.decodeStream = function decodeStream(encoding, options) {
        return new IconvLiteDecoderStream(iconv.getDecoder(encoding, options), options);
    }

    iconv.supportsStreams = true;


    // Not published yet.
    iconv.IconvLiteEncoderStream = IconvLiteEncoderStream;
    iconv.IconvLiteDecoderStream = IconvLiteDecoderStream;
    iconv._collect = IconvLiteDecoderStream.prototype.collect;
};


// == Encoder stream =======================================================
function IconvLiteEncoderStream(conv, options) {
    this.conv = conv;
    options = options || {};
    options.decodeStrings = false; // We accept only strings, so we don't need to decode them.
    Transform.call(this, options);
}

IconvLiteEncoderStream.prototype = Object.create(Transform.prototype, {
    constructor: { value: IconvLiteEncoderStream }
});

IconvLiteEncoderStream.prototype._transform = function(chunk, encoding, done) {
    if (typeof chunk != 'string')
        return done(new Error("Iconv encoding stream needs strings as its input."));
    try {
        var res = this.conv.write(chunk);
        if (res && res.length) this.push(res);
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteEncoderStream.prototype._flush = function(done) {
    try {
        var res = this.conv.end();
        if (res && res.length) this.push(res);
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteEncoderStream.prototype.collect = function(cb) {
    var chunks = [];
    this.on('error', cb);
    this.on('data', function(chunk) { chunks.push(chunk); });
    this.on('end', function() {
        cb(null, Buffer.concat(chunks));
    });
    return this;
}


// == Decoder stream =======================================================
function IconvLiteDecoderStream(conv, options) {
    this.conv = conv;
    options = options || {};
    options.encoding = this.encoding = 'utf8'; // We output strings.
    Transform.call(this, options);
}

IconvLiteDecoderStream.prototype = Object.create(Transform.prototype, {
    constructor: { value: IconvLiteDecoderStream }
});

IconvLiteDecoderStream.prototype._transform = function(chunk, encoding, done) {
    if (!Buffer.isBuffer(chunk))
        return done(new Error("Iconv decoding stream needs buffers as its input."));
    try {
        var res = this.conv.write(chunk);
        if (res && res.length) this.push(res, this.encoding);
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteDecoderStream.prototype._flush = function(done) {
    try {
        var res = this.conv.end();
        if (res && res.length) this.push(res, this.encoding);                
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteDecoderStream.prototype.collect = function(cb) {
    var res = '';
    this.on('error', cb);
    this.on('data', function(chunk) { res += chunk; });
    this.on('end', function() {
        cb(null, res);
    });
    return this;
}



/***/ }),

/***/ 964:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var Buffer = __webpack_require__(293).Buffer;

// Single-byte codec. Needs a 'chars' string parameter that contains 256 or 128 chars that
// correspond to encoded bytes (if 128 - then lower half is ASCII). 

exports._sbcs = SBCSCodec;
function SBCSCodec(codecOptions, iconv) {
    if (!codecOptions)
        throw new Error("SBCS codec is called without the data.")
    
    // Prepare char buffer for decoding.
    if (!codecOptions.chars || (codecOptions.chars.length !== 128 && codecOptions.chars.length !== 256))
        throw new Error("Encoding '"+codecOptions.type+"' has incorrect 'chars' (must be of len 128 or 256)");
    
    if (codecOptions.chars.length === 128) {
        var asciiString = "";
        for (var i = 0; i < 128; i++)
            asciiString += String.fromCharCode(i);
        codecOptions.chars = asciiString + codecOptions.chars;
    }

    this.decodeBuf = new Buffer(codecOptions.chars, 'ucs2');
    
    // Encoding buffer.
    var encodeBuf = new Buffer(65536);
    encodeBuf.fill(iconv.defaultCharSingleByte.charCodeAt(0));

    for (var i = 0; i < codecOptions.chars.length; i++)
        encodeBuf[codecOptions.chars.charCodeAt(i)] = i;

    this.encodeBuf = encodeBuf;
}

SBCSCodec.prototype.encoder = SBCSEncoder;
SBCSCodec.prototype.decoder = SBCSDecoder;


function SBCSEncoder(options, codec) {
    this.encodeBuf = codec.encodeBuf;
}

SBCSEncoder.prototype.write = function(str) {
    var buf = new Buffer(str.length);
    for (var i = 0; i < str.length; i++)
        buf[i] = this.encodeBuf[str.charCodeAt(i)];
    
    return buf;
}

SBCSEncoder.prototype.end = function() {
}


function SBCSDecoder(options, codec) {
    this.decodeBuf = codec.decodeBuf;
}

SBCSDecoder.prototype.write = function(buf) {
    // Strings are immutable in JS -> we use ucs2 buffer to speed up computations.
    var decodeBuf = this.decodeBuf;
    var newBuf = new Buffer(buf.length*2);
    var idx1 = 0, idx2 = 0;
    for (var i = 0; i < buf.length; i++) {
        idx1 = buf[i]*2; idx2 = i*2;
        newBuf[idx2] = decodeBuf[idx1];
        newBuf[idx2+1] = decodeBuf[idx1+1];
    }
    return newBuf.toString('ucs2');
}

SBCSDecoder.prototype.end = function() {
}


/***/ }),

/***/ 966:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {PassThrough} = __webpack_require__(413);

module.exports = options => {
	options = Object.assign({}, options);

	const {array} = options;
	let {encoding} = options;
	const buffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || buffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (buffer) {
		encoding = null;
	}

	let len = 0;
	const ret = [];
	const stream = new PassThrough({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	stream.on('data', chunk => {
		ret.push(chunk);

		if (objectMode) {
			len = ret.length;
		} else {
			len += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return ret;
		}

		return buffer ? Buffer.concat(ret, len) : ret.join('');
	};

	stream.getBufferedLength = () => len;

	return stream;
};


/***/ }),

/***/ 969:
/***/ (function(module, __unusedexports, __webpack_require__) {

var wrappy = __webpack_require__(11)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 991:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationRequestError;

const { RequestError } = __webpack_require__(463);

function authenticationRequestError(state, error, options) {
  if (!error.headers) throw error;

  const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error;
  }

  if (
    error.status === 401 &&
    otpRequired &&
    error.request &&
    error.request.headers["x-github-otp"]
  ) {
    if (state.otp) {
      delete state.otp; // no longer valid, request again
    } else {
      throw new RequestError(
        "Invalid one-time password for two-factor authentication",
        401,
        {
          headers: error.headers,
          request: options
        }
      );
    }
  }

  if (typeof state.auth.on2fa !== "function") {
    throw new RequestError(
      "2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa();
    })
    .then(oneTimePassword => {
      const newOptions = Object.assign(options, {
        headers: Object.assign(options.headers, {
          "x-github-otp": oneTimePassword
        })
      });
      return state.octokit.request(newOptions).then(response => {
        // If OTP still valid, then persist it for following requests
        state.otp = oneTimePassword;
        return response;
      });
    });
}


/***/ }),

/***/ 999:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var iconv_package;
var Iconv;

try {
    // this is to fool browserify so it doesn't try (in vain) to install iconv.
    iconv_package = 'iconv';
    Iconv = __webpack_require__(256).Iconv;
} catch (E) {
    // node-iconv not present
}

module.exports = Iconv;


/***/ })

/******/ });