var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/netlify/entry.js
__export(exports, {
  handler: () => handler
});

// node_modules/.pnpm/@sveltejs+kit@1.0.0-next.174_svelte@3.43.0/node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var dataUriToBuffer$1 = src;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var Blob$1 = fetchBlob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error2 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error2;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new Blob$1([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
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
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error2) {
                reject(error2);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
        reject(error2);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
          reject(error2);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error2) => {
              reject(error2);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error2) => {
              reject(error2);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}

// .svelte-kit/output/server/app.js
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _map;
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler2 = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler2) {
    return;
  }
  const params = route.params(match);
  const response = await handler2({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page && page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page && page.path)},
						query: new URLSearchParams(${page ? s$1(page.query.toString()) : ""}),
						params: ${page && s$1(page.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(coalesce_to_error(err));
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  if (loaded.context) {
    throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  stuff,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let set_cookie_headers = [];
  let loaded;
  const page_proxy = new Proxy(page, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = {
            ...opts.headers
          };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 === "set-cookie") {
                    set_cookie_headers = set_cookie_headers.concat(value);
                  } else if (key2 !== "etag") {
                    headers[key2] = value;
                  }
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape$1(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      stuff: { ...stuff }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    stuff: loaded.stuff || stuff,
    fetched,
    set_cookie_headers,
    uses_credentials
  };
}
var escaped$2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape$1(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$2) {
      result += escaped$2[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    stuff: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      stuff: loaded ? loaded.stuff : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  let set_cookie_headers = [];
  ssr:
    if (page_config.ssr) {
      let stuff = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              stuff,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
            if (loaded.loaded.redirect) {
              return with_cookies({
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              }, set_cookie_headers);
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    stuff: node_loaded.stuff,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return with_cookies(await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            }), set_cookie_headers);
          }
        }
        if (loaded && loaded.loaded.stuff) {
          stuff = {
            ...stuff,
            ...loaded.loaded.stuff
          };
        }
      }
    }
  try {
    return with_cookies(await render_response({
      ...opts,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    }), set_cookie_headers);
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return with_cookies(await respond_with_error({
      ...opts,
      status: 500,
      error: error3
    }), set_cookie_headers);
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    response.headers["set-cookie"] = set_cookie_headers;
  }
  return response;
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  constructor(map) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map))
      yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
_map = new WeakMap();
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        const decoded = decodeURI(request2.path);
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(decoded);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                const etag = `"${hash(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function null_to_empty(value) {
  return value == null ? "" : value;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
Promise.resolve();
var escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var css$7 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AAsDC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$7);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
var base = "";
var assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.ico" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		<meta name="theme-color" \n      content="#9a702a">\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-9a4cd4a3.js",
      css: [assets + "/_app/assets/start-61d1577b.css"],
      js: [assets + "/_app/start-9a4cd4a3.js", assets + "/_app/chunks/vendor-0c5331f5.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var d = (s2) => s2.replace(/%23/g, "#").replace(/%3[Bb]/g, ";").replace(/%2[Cc]/g, ",").replace(/%2[Ff]/g, "/").replace(/%3[Ff]/g, "?").replace(/%3[Aa]/g, ":").replace(/%40/g, "@").replace(/%26/g, "&").replace(/%3[Dd]/g, "=").replace(/%2[Bb]/g, "+").replace(/%24/g, "$");
var empty = () => ({});
var manifest = {
  assets: [{ "file": ".DS_Store", "size": 6148, "type": null }, { "file": "back_arrow.svg", "size": 475, "type": "image/svg+xml" }, { "file": "blathers.webp", "size": 15354, "type": "image/webp" }, { "file": "bugs/Agrias_Butterfly.png", "size": 4590, "type": "image/png" }, { "file": "bugs/Agrias_Butterfly.webp", "size": 1378, "type": "image/webp" }, { "file": "bugs/Ant.png", "size": 3080, "type": "image/png" }, { "file": "bugs/Atlas_Moth.png", "size": 6860, "type": "image/png" }, { "file": "bugs/Bagworm.png", "size": 3362, "type": "image/png" }, { "file": "bugs/Banded_Dragonfly.png", "size": 5132, "type": "image/png" }, { "file": "bugs/Bell_Cricket.png", "size": 4656, "type": "image/png" }, { "file": "bugs/Bitterling.webp", "size": 1406, "type": "image/webp" }, { "file": "bugs/Blue_Weevil_Beetle.png", "size": 3823, "type": "image/png" }, { "file": "bugs/Brown_Cicada.png", "size": 4725, "type": "image/png" }, { "file": "bugs/Centipede.png", "size": 4087, "type": "image/png" }, { "file": "bugs/Cicada_Shell.png", "size": 3998, "type": "image/png" }, { "file": "bugs/Citrus_Long_Horned_Beetle.png", "size": 4995, "type": "image/png" }, { "file": "bugs/Common_Bluebottle.png", "size": 4456, "type": "image/png" }, { "file": "bugs/Common_Butterfly.png", "size": 4228, "type": "image/png" }, { "file": "bugs/Cricket.png", "size": 4313, "type": "image/png" }, { "file": "bugs/Cyclommatus_Stag.png", "size": 5818, "type": "image/png" }, { "file": "bugs/Damselfly.png", "size": 4895, "type": "image/png" }, { "file": "bugs/Darner_Dragonfly.png", "size": 4481, "type": "image/png" }, { "file": "bugs/Diving_Beetle.png", "size": 4207, "type": "image/png" }, { "file": "bugs/Drone_Beetle.png", "size": 3714, "type": "image/png" }, { "file": "bugs/Dung_Beetle.png", "size": 4633, "type": "image/png" }, { "file": "bugs/Earth_Boring_Dung_Beetle.png", "size": 2980, "type": "image/png" }, { "file": "bugs/Emperor_Butterfly.png", "size": 5167, "type": "image/png" }, { "file": "bugs/Evening_Cicada.png", "size": 4449, "type": "image/png" }, { "file": "bugs/Firefly.png", "size": 3153, "type": "image/png" }, { "file": "bugs/Flea.png", "size": 2249, "type": "image/png" }, { "file": "bugs/Fly.png", "size": 2571, "type": "image/png" }, { "file": "bugs/Giant_Cicada.png", "size": 5156, "type": "image/png" }, { "file": "bugs/Giant_Stag.png", "size": 5446, "type": "image/png" }, { "file": "bugs/Giant_Waterbug.png", "size": 4641, "type": "image/png" }, { "file": "bugs/Giraffe_Stag.png", "size": 5286, "type": "image/png" }, { "file": "bugs/Golden_Stag.png", "size": 4992, "type": "image/png" }, { "file": "bugs/Goliath_Beetle.png", "size": 6267, "type": "image/png" }, { "file": "bugs/Grasshopper.png", "size": 4623, "type": "image/png" }, { "file": "bugs/Great_Purple_Emperor.png", "size": 5029, "type": "image/png" }, { "file": "bugs/Hermit_Crab.png", "size": 5012, "type": "image/png" }, { "file": "bugs/Honey_Bee.png", "size": 3149, "type": "image/png" }, { "file": "bugs/Horned_Atlas.png", "size": 5613, "type": "image/png" }, { "file": "bugs/Horned_Dynastid.png", "size": 4668, "type": "image/png" }, { "file": "bugs/Horned_Elephant.png", "size": 5746, "type": "image/png" }, { "file": "bugs/Horned_Hercules.png", "size": 5322, "type": "image/png" }, { "file": "bugs/Jewel_Beetle.png", "size": 3959, "type": "image/png" }, { "file": "bugs/Ladybug.png", "size": 2753, "type": "image/png" }, { "file": "bugs/Long_Locust.png", "size": 4380, "type": "image/png" }, { "file": "bugs/Madagascan_Sunset_Moth.png", "size": 4614, "type": "image/png" }, { "file": "bugs/Man_Faced_Stinkbug.png", "size": 5168, "type": "image/png" }, { "file": "bugs/Mantis.png", "size": 4876, "type": "image/png" }, { "file": "bugs/Migratory_Locust.png", "size": 4608, "type": "image/png" }, { "file": "bugs/Miyama_Stag.png", "size": 5051, "type": "image/png" }, { "file": "bugs/Mole_Cricket.png", "size": 4326, "type": "image/png" }, { "file": "bugs/Monarch_Butterfly.png", "size": 4590, "type": "image/png" }, { "file": "bugs/Mosquito.png", "size": 2627, "type": "image/png" }, { "file": "bugs/Moth.png", "size": 4324, "type": "image/png" }, { "file": "bugs/Orchid_Mantis.png", "size": 6204, "type": "image/png" }, { "file": "bugs/Paper_Kite_Butterfly.png", "size": 6188, "type": "image/png" }, { "file": "bugs/Peacock_Butterfly.png", "size": 4835, "type": "image/png" }, { "file": "bugs/Pillbug.png", "size": 2395, "type": "image/png" }, { "file": "bugs/Pondskater.png", "size": 3161, "type": "image/png" }, { "file": "bugs/Queen_Alexandras_Birdwing.png", "size": 7801, "type": "image/png" }, { "file": "bugs/Rainbow_Stag.png", "size": 4834, "type": "image/png" }, { "file": "bugs/Rajah_Brookes_Birdwing.png", "size": 4020, "type": "image/png" }, { "file": "bugs/Red_Dragonfly.png", "size": 4265, "type": "image/png" }, { "file": "bugs/Rice_Grasshopper.png", "size": 3521, "type": "image/png" }, { "file": "bugs/Robust_Cicada.png", "size": 4914, "type": "image/png" }, { "file": "bugs/Rosalia_Batesi_Beetle.png", "size": 4950, "type": "image/png" }, { "file": "bugs/Saw_Stag.png", "size": 4979, "type": "image/png" }, { "file": "bugs/Scarab_Beetle.png", "size": 3438, "type": "image/png" }, { "file": "bugs/Scorpion.png", "size": 5700, "type": "image/png" }, { "file": "bugs/Snail.png", "size": 4490, "type": "image/png" }, { "file": "bugs/Spider.png", "size": 5805, "type": "image/png" }, { "file": "bugs/Stinkbug.png", "size": 4393, "type": "image/png" }, { "file": "bugs/Tarantula.png", "size": 7176, "type": "image/png" }, { "file": "bugs/Tiger_Beetle.png", "size": 3809, "type": "image/png" }, { "file": "bugs/Tiger_Butterfly.png", "size": 6143, "type": "image/png" }, { "file": "bugs/Violin_Beetle.png", "size": 4303, "type": "image/png" }, { "file": "bugs/Walker_Cicada.png", "size": 4116, "type": "image/png" }, { "file": "bugs/Walking_Leaf.png", "size": 4788, "type": "image/png" }, { "file": "bugs/Walking_Stick.png", "size": 4807, "type": "image/png" }, { "file": "bugs/Wasp.png", "size": 5020, "type": "image/png" }, { "file": "bugs/Wharf_Roach.png", "size": 3518, "type": "image/png" }, { "file": "bugs/Yellow_Butterfly.png", "size": 4129, "type": "image/png" }, { "file": "bugs-detailed/agrias_butterfly.png", "size": 122330, "type": "image/png" }, { "file": "bugs-detailed/ant.png", "size": 8774, "type": "image/png" }, { "file": "bugs-detailed/atlas_moth.png", "size": 307692, "type": "image/png" }, { "file": "bugs-detailed/bagworm.png", "size": 29043, "type": "image/png" }, { "file": "bugs-detailed/banded_dragonfly.png", "size": 134911, "type": "image/png" }, { "file": "bugs-detailed/bell_cricket.png", "size": 25550, "type": "image/png" }, { "file": "bugs-detailed/blue_weevil_beetle.png", "size": 47362, "type": "image/png" }, { "file": "bugs-detailed/brown_cicada.png", "size": 97374, "type": "image/png" }, { "file": "bugs-detailed/centipede.png", "size": 56607, "type": "image/png" }, { "file": "bugs-detailed/cicada_shell.png", "size": 59934, "type": "image/png" }, { "file": "bugs-detailed/citrus_long-horned_beetle.png", "size": 52593, "type": "image/png" }, { "file": "bugs-detailed/common_bluebottle.png", "size": 75362, "type": "image/png" }, { "file": "bugs-detailed/common_butterfly.png", "size": 57687, "type": "image/png" }, { "file": "bugs-detailed/cricket.png", "size": 28195, "type": "image/png" }, { "file": "bugs-detailed/cyclommatus_stag.png", "size": 87098, "type": "image/png" }, { "file": "bugs-detailed/damselfly.png", "size": 60696, "type": "image/png" }, { "file": "bugs-detailed/darner_dragonfly.png", "size": 130043, "type": "image/png" }, { "file": "bugs-detailed/diving_beetle.png", "size": 66758, "type": "image/png" }, { "file": "bugs-detailed/drone_beetle.png", "size": 76800, "type": "image/png" }, { "file": "bugs-detailed/dung_beetle.png", "size": 86969, "type": "image/png" }, { "file": "bugs-detailed/earth-boring_dung_beetle.png", "size": 48575, "type": "image/png" }, { "file": "bugs-detailed/emperor_butterfly.png", "size": 171344, "type": "image/png" }, { "file": "bugs-detailed/evening_cicada.png", "size": 60241, "type": "image/png" }, { "file": "bugs-detailed/firefly.png", "size": 30038, "type": "image/png" }, { "file": "bugs-detailed/flea.png", "size": 10813, "type": "image/png" }, { "file": "bugs-detailed/fly.png", "size": 18340, "type": "image/png" }, { "file": "bugs-detailed/giant_cicada.png", "size": 113597, "type": "image/png" }, { "file": "bugs-detailed/giant_stag.png", "size": 95870, "type": "image/png" }, { "file": "bugs-detailed/giant_water_bug.png", "size": 149396, "type": "image/png" }, { "file": "bugs-detailed/giraffe_stag.png", "size": 98036, "type": "image/png" }, { "file": "bugs-detailed/golden_stag.png", "size": 96838, "type": "image/png" }, { "file": "bugs-detailed/goliath_beetle.png", "size": 155818, "type": "image/png" }, { "file": "bugs-detailed/grasshopper.png", "size": 73138, "type": "image/png" }, { "file": "bugs-detailed/great_purple_emperor.png", "size": 158916, "type": "image/png" }, { "file": "bugs-detailed/hermit_crab.png", "size": 136969, "type": "image/png" }, { "file": "bugs-detailed/honeybee.png", "size": 28137, "type": "image/png" }, { "file": "bugs-detailed/horned_atlas.png", "size": 120763, "type": "image/png" }, { "file": "bugs-detailed/horned_dynastid.png", "size": 73799, "type": "image/png" }, { "file": "bugs-detailed/horned_elephant.png", "size": 153279, "type": "image/png" }, { "file": "bugs-detailed/horned_hercules.png", "size": 142036, "type": "image/png" }, { "file": "bugs-detailed/jewel_beetle.png", "size": 57319, "type": "image/png" }, { "file": "bugs-detailed/ladybug.png", "size": 17670, "type": "image/png" }, { "file": "bugs-detailed/long_locust.png", "size": 54344, "type": "image/png" }, { "file": "bugs-detailed/madagascan_sunset_moth.png", "size": 119375, "type": "image/png" }, { "file": "bugs-detailed/man-faced_stink_bug.png", "size": 69590, "type": "image/png" }, { "file": "bugs-detailed/mantis.png", "size": 67563, "type": "image/png" }, { "file": "bugs-detailed/migratory_locust.png", "size": 75421, "type": "image/png" }, { "file": "bugs-detailed/miyama_stag.png", "size": 81268, "type": "image/png" }, { "file": "bugs-detailed/mole_cricket.png", "size": 45621, "type": "image/png" }, { "file": "bugs-detailed/monarch_butterfly.png", "size": 127709, "type": "image/png" }, { "file": "bugs-detailed/mosquito.png", "size": 8301, "type": "image/png" }, { "file": "bugs-detailed/moth.png", "size": 62753, "type": "image/png" }, { "file": "bugs-detailed/orchid_mantis.png", "size": 80603, "type": "image/png" }, { "file": "bugs-detailed/paper_kite_butterfly.png", "size": 194411, "type": "image/png" }, { "file": "bugs-detailed/peacock_butterfly.png", "size": 133328, "type": "image/png" }, { "file": "bugs-detailed/pill_bug.png", "size": 12692, "type": "image/png" }, { "file": "bugs-detailed/pondskater.png", "size": 16791, "type": "image/png" }, { "file": "bugs-detailed/queen_alexandras_birdwing.png", "size": 296169, "type": "image/png" }, { "file": "bugs-detailed/rainbow_stag.png", "size": 81623, "type": "image/png" }, { "file": "bugs-detailed/rajah_brookes_birdwing.png", "size": 124854, "type": "image/png" }, { "file": "bugs-detailed/red_dragonfly.png", "size": 43993, "type": "image/png" }, { "file": "bugs-detailed/rice_grasshopper.png", "size": 35126, "type": "image/png" }, { "file": "bugs-detailed/robust_cicada.png", "size": 87808, "type": "image/png" }, { "file": "bugs-detailed/rosalia_batesi_beetle.png", "size": 78391, "type": "image/png" }, { "file": "bugs-detailed/saw_stag.png", "size": 69553, "type": "image/png" }, { "file": "bugs-detailed/scarab_beetle.png", "size": 60774, "type": "image/png" }, { "file": "bugs-detailed/scorpion.png", "size": 167930, "type": "image/png" }, { "file": "bugs-detailed/snail.png", "size": 37480, "type": "image/png" }, { "file": "bugs-detailed/spider.png", "size": 54443, "type": "image/png" }, { "file": "bugs-detailed/stinkbug.png", "size": 48613, "type": "image/png" }, { "file": "bugs-detailed/tarantula.png", "size": 179420, "type": "image/png" }, { "file": "bugs-detailed/tiger_beetle.png", "size": 34719, "type": "image/png" }, { "file": "bugs-detailed/tiger_butterfly.png", "size": 116813, "type": "image/png" }, { "file": "bugs-detailed/violin_beetle.png", "size": 79354, "type": "image/png" }, { "file": "bugs-detailed/walker_cicada.png", "size": 52173, "type": "image/png" }, { "file": "bugs-detailed/walking_leaf.png", "size": 241985, "type": "image/png" }, { "file": "bugs-detailed/walking_stick.png", "size": 47882, "type": "image/png" }, { "file": "bugs-detailed/wasp.png", "size": 65339, "type": "image/png" }, { "file": "bugs-detailed/wharf_roach.png", "size": 21660, "type": "image/png" }, { "file": "bugs-detailed/yellow_butterfly.png", "size": 62048, "type": "image/png" }, { "file": "favicon.ico", "size": 15406, "type": "image/vnd.microsoft.icon" }, { "file": "fish/Anchovy.png", "size": 3720, "type": "image/png" }, { "file": "fish/Angelfish.png", "size": 3282, "type": "image/png" }, { "file": "fish/Arapaima.png", "size": 5892, "type": "image/png" }, { "file": "fish/Arowana.png", "size": 5163, "type": "image/png" }, { "file": "fish/Barred_Knifejaw.png", "size": 5779, "type": "image/png" }, { "file": "fish/Barreleye.png", "size": 4819, "type": "image/png" }, { "file": "fish/Betta.png", "size": 5056, "type": "image/png" }, { "file": "fish/Bitterling.png", "size": 4287, "type": "image/png" }, { "file": "fish/Black_Bass.png", "size": 5045, "type": "image/png" }, { "file": "fish/Blowfish.png", "size": 4518, "type": "image/png" }, { "file": "fish/Blue_Marlin.png", "size": 5232, "type": "image/png" }, { "file": "fish/Bluegill.png", "size": 4929, "type": "image/png" }, { "file": "fish/Butterfly_Fish.png", "size": 3818, "type": "image/png" }, { "file": "fish/Carp.png", "size": 5600, "type": "image/png" }, { "file": "fish/Catfish.png", "size": 5084, "type": "image/png" }, { "file": "fish/Char.png", "size": 4482, "type": "image/png" }, { "file": "fish/Cherry_Salmon.png", "size": 4628, "type": "image/png" }, { "file": "fish/Clownfish.png", "size": 3191, "type": "image/png" }, { "file": "fish/Coelacanth.png", "size": 6469, "type": "image/png" }, { "file": "fish/Crawfish.png", "size": 4502, "type": "image/png" }, { "file": "fish/Crucian_Carp.png", "size": 4823, "type": "image/png" }, { "file": "fish/Dab.png", "size": 4408, "type": "image/png" }, { "file": "fish/Dace.png", "size": 4936, "type": "image/png" }, { "file": "fish/Dorado.png", "size": 6017, "type": "image/png" }, { "file": "fish/Football_Fish.png", "size": 5387, "type": "image/png" }, { "file": "fish/Freshwater_Goby.png", "size": 4457, "type": "image/png" }, { "file": "fish/Frog.png", "size": 3758, "type": "image/png" }, { "file": "fish/Gar.png", "size": 4783, "type": "image/png" }, { "file": "fish/Giant_Snakehead.png", "size": 4869, "type": "image/png" }, { "file": "fish/Giant_Trevally.png", "size": 5752, "type": "image/png" }, { "file": "fish/Golden_Trout.png", "size": 4649, "type": "image/png" }, { "file": "fish/Goldfish.png", "size": 3542, "type": "image/png" }, { "file": "fish/Great_White_Shark.png", "size": 5283, "type": "image/png" }, { "file": "fish/Guppy.png", "size": 3782, "type": "image/png" }, { "file": "fish/Hammerhead_Shark.png", "size": 4660, "type": "image/png" }, { "file": "fish/Horse_Mackerel.png", "size": 4020, "type": "image/png" }, { "file": "fish/Killifish.png", "size": 2818, "type": "image/png" }, { "file": "fish/King_Salmon.png", "size": 6226, "type": "image/png" }, { "file": "fish/Koi.png", "size": 5700, "type": "image/png" }, { "file": "fish/Loach.png", "size": 4268, "type": "image/png" }, { "file": "fish/Mahi_Mahi.png", "size": 6787, "type": "image/png" }, { "file": "fish/Mitten_Crab.png", "size": 5259, "type": "image/png" }, { "file": "fish/Moray_Eel.png", "size": 5022, "type": "image/png" }, { "file": "fish/Napoleonfish.png", "size": 6404, "type": "image/png" }, { "file": "fish/Neon_Tetra.png", "size": 2935, "type": "image/png" }, { "file": "fish/Nibble_Fish.png", "size": 3587, "type": "image/png" }, { "file": "fish/Oarfish.png", "size": 7606, "type": "image/png" }, { "file": "fish/Ocean_Sunfish.png", "size": 6701, "type": "image/png" }, { "file": "fish/Olive_Flounder.png", "size": 5567, "type": "image/png" }, { "file": "fish/Pale_Chub.png", "size": 4418, "type": "image/png" }, { "file": "fish/Pike.png", "size": 5582, "type": "image/png" }, { "file": "fish/Piranha.png", "size": 4082, "type": "image/png" }, { "file": "fish/Pond_Smelt.png", "size": 3958, "type": "image/png" }, { "file": "fish/Popeyed_Goldfish.png", "size": 3515, "type": "image/png" }, { "file": "fish/Puffer_Fish.png", "size": 5883, "type": "image/png" }, { "file": "fish/Rainbowfish.png", "size": 3274, "type": "image/png" }, { "file": "fish/Ranchu_Goldfish.png", "size": 4793, "type": "image/png" }, { "file": "fish/Ray.png", "size": 5760, "type": "image/png" }, { "file": "fish/Red_Snapper.png", "size": 5655, "type": "image/png" }, { "file": "fish/Ribbon_Eel.png", "size": 7127, "type": "image/png" }, { "file": "fish/Saddled_Bichir.png", "size": 4456, "type": "image/png" }, { "file": "fish/Salmon.png", "size": 5096, "type": "image/png" }, { "file": "fish/Saw_Shark.png", "size": 6318, "type": "image/png" }, { "file": "fish/Sea_Bass.png", "size": 5851, "type": "image/png" }, { "file": "fish/Sea_Butterfly.png", "size": 2844, "type": "image/png" }, { "file": "fish/Seahorse.png", "size": 3218, "type": "image/png" }, { "file": "fish/Snapping_Turtle.png", "size": 6019, "type": "image/png" }, { "file": "fish/Soft_Shelled_Turtle.png", "size": 4855, "type": "image/png" }, { "file": "fish/Squid.png", "size": 4481, "type": "image/png" }, { "file": "fish/Stringfish.png", "size": 5453, "type": "image/png" }, { "file": "fish/Sturgeon.png", "size": 4759, "type": "image/png" }, { "file": "fish/Suckerfish.png", "size": 3938, "type": "image/png" }, { "file": "fish/Surgeonfish.png", "size": 4131, "type": "image/png" }, { "file": "fish/Sweetfish.png", "size": 4692, "type": "image/png" }, { "file": "fish/Tadpole.png", "size": 2415, "type": "image/png" }, { "file": "fish/Tilapia.png", "size": 5749, "type": "image/png" }, { "file": "fish/Tuna.png", "size": 5796, "type": "image/png" }, { "file": "fish/Whale_Shark.png", "size": 4823, "type": "image/png" }, { "file": "fish/Yellow_Perch.png", "size": 4326, "type": "image/png" }, { "file": "fish/Zebra_Turkeyfish.png", "size": 5358, "type": "image/png" }, { "file": "fish-detailed/anchovy.png", "size": 35363, "type": "image/png" }, { "file": "fish-detailed/angelfish.png", "size": 67974, "type": "image/png" }, { "file": "fish-detailed/arapaima.png", "size": 406669, "type": "image/png" }, { "file": "fish-detailed/arowana.png", "size": 181628, "type": "image/png" }, { "file": "fish-detailed/barred_knifejaw.png", "size": 136016, "type": "image/png" }, { "file": "fish-detailed/barreleye.png", "size": 52569, "type": "image/png" }, { "file": "fish-detailed/betta.png", "size": 110619, "type": "image/png" }, { "file": "fish-detailed/bitterling.png", "size": 52068, "type": "image/png" }, { "file": "fish-detailed/black_bass.png", "size": 156971, "type": "image/png" }, { "file": "fish-detailed/blowfish.png", "size": 59406, "type": "image/png" }, { "file": "fish-detailed/blue_marlin.png", "size": 213863, "type": "image/png" }, { "file": "fish-detailed/bluegill.png", "size": 98984, "type": "image/png" }, { "file": "fish-detailed/butterfly_fish.png", "size": 86573, "type": "image/png" }, { "file": "fish-detailed/carp.png", "size": 213679, "type": "image/png" }, { "file": "fish-detailed/catfish.png", "size": 131250, "type": "image/png" }, { "file": "fish-detailed/char.png", "size": 178407, "type": "image/png" }, { "file": "fish-detailed/cherry_salmon.png", "size": 115195, "type": "image/png" }, { "file": "fish-detailed/clownfish.png", "size": 39333, "type": "image/png" }, { "file": "fish-detailed/coelacanth.png", "size": 260518, "type": "image/png" }, { "file": "fish-detailed/crawfish.png", "size": 63281, "type": "image/png" }, { "file": "fish-detailed/crucian_carp.png", "size": 99400, "type": "image/png" }, { "file": "fish-detailed/dab.png", "size": 115585, "type": "image/png" }, { "file": "fish-detailed/dace.png", "size": 62558, "type": "image/png" }, { "file": "fish-detailed/dorado.png", "size": 239105, "type": "image/png" }, { "file": "fish-detailed/football_fish.png", "size": 127710, "type": "image/png" }, { "file": "fish-detailed/freshwater_goby.png", "size": 113474, "type": "image/png" }, { "file": "fish-detailed/frog.png", "size": 35106, "type": "image/png" }, { "file": "fish-detailed/gar.png", "size": 153565, "type": "image/png" }, { "file": "fish-detailed/giant_snakehead.png", "size": 181414, "type": "image/png" }, { "file": "fish-detailed/giant_trevally.png", "size": 129399, "type": "image/png" }, { "file": "fish-detailed/golden_trout.png", "size": 132851, "type": "image/png" }, { "file": "fish-detailed/goldfish.png", "size": 44022, "type": "image/png" }, { "file": "fish-detailed/great_white_shark.png", "size": 263569, "type": "image/png" }, { "file": "fish-detailed/guppy.png", "size": 36491, "type": "image/png" }, { "file": "fish-detailed/hammerhead_shark.png", "size": 148440, "type": "image/png" }, { "file": "fish-detailed/horse_mackerel.png", "size": 61907, "type": "image/png" }, { "file": "fish-detailed/killifish.png", "size": 24728, "type": "image/png" }, { "file": "fish-detailed/king_salmon.png", "size": 272307, "type": "image/png" }, { "file": "fish-detailed/koi.png", "size": 206988, "type": "image/png" }, { "file": "fish-detailed/loach.png", "size": 43144, "type": "image/png" }, { "file": "fish-detailed/mahi-mahi.png", "size": 232425, "type": "image/png" }, { "file": "fish-detailed/mitten_crab.png", "size": 80662, "type": "image/png" }, { "file": "fish-detailed/moray_eel.png", "size": 151757, "type": "image/png" }, { "file": "fish-detailed/napoleonfish.png", "size": 470867, "type": "image/png" }, { "file": "fish-detailed/neon_tetra.png", "size": 20115, "type": "image/png" }, { "file": "fish-detailed/nibble_fish.png", "size": 33018, "type": "image/png" }, { "file": "fish-detailed/oarfish.png", "size": 245247, "type": "image/png" }, { "file": "fish-detailed/ocean_sunfish.png", "size": 238150, "type": "image/png" }, { "file": "fish-detailed/olive_flounder.png", "size": 279858, "type": "image/png" }, { "file": "fish-detailed/pale_chub.png", "size": 34046, "type": "image/png" }, { "file": "fish-detailed/pike.png", "size": 218892, "type": "image/png" }, { "file": "fish-detailed/piranha.png", "size": 78393, "type": "image/png" }, { "file": "fish-detailed/pond_smelt.png", "size": 38505, "type": "image/png" }, { "file": "fish-detailed/pop-eyed_goldfish.png", "size": 40751, "type": "image/png" }, { "file": "fish-detailed/puffer_fish.png", "size": 84924, "type": "image/png" }, { "file": "fish-detailed/rainbowfish.png", "size": 28806, "type": "image/png" }, { "file": "fish-detailed/ranchu_goldfish.png", "size": 65926, "type": "image/png" }, { "file": "fish-detailed/ray.png", "size": 136191, "type": "image/png" }, { "file": "fish-detailed/red_snapper.png", "size": 173808, "type": "image/png" }, { "file": "fish-detailed/ribbon_eel.png", "size": 81897, "type": "image/png" }, { "file": "fish-detailed/saddled_bichir.png", "size": 114324, "type": "image/png" }, { "file": "fish-detailed/salmon.png", "size": 184452, "type": "image/png" }, { "file": "fish-detailed/saw_shark.png", "size": 60422, "type": "image/png" }, { "file": "fish-detailed/sea_bass.png", "size": 192283, "type": "image/png" }, { "file": "fish-detailed/sea_butterfly.png", "size": 27097, "type": "image/png" }, { "file": "fish-detailed/sea_horse.png", "size": 37409, "type": "image/png" }, { "file": "fish-detailed/snapping_turtle.png", "size": 167204, "type": "image/png" }, { "file": "fish-detailed/soft-shelled_turtle.png", "size": 146408, "type": "image/png" }, { "file": "fish-detailed/squid.png", "size": 70211, "type": "image/png" }, { "file": "fish-detailed/stringfish.png", "size": 227112, "type": "image/png" }, { "file": "fish-detailed/sturgeon.png", "size": 200178, "type": "image/png" }, { "file": "fish-detailed/suckerfish.png", "size": 29755, "type": "image/png" }, { "file": "fish-detailed/surgeonfish.png", "size": 79345, "type": "image/png" }, { "file": "fish-detailed/sweetfish.png", "size": 107792, "type": "image/png" }, { "file": "fish-detailed/tadpole.png", "size": 12918, "type": "image/png" }, { "file": "fish-detailed/tilapia.png", "size": 147465, "type": "image/png" }, { "file": "fish-detailed/tuna.png", "size": 251107, "type": "image/png" }, { "file": "fish-detailed/whale_shark.png", "size": 269396, "type": "image/png" }, { "file": "fish-detailed/yellow_perch.png", "size": 82042, "type": "image/png" }, { "file": "fish-detailed/zebra_turkeyfish.png", "size": 159331, "type": "image/png" }, { "file": "green-triangles.png", "size": 55191, "type": "image/png" }, { "file": "hamburger.svg", "size": 278, "type": "image/svg+xml" }, { "file": "leaf-tile-yellow.svg", "size": 2504, "type": "image/svg+xml" }, { "file": "leafs-blue.svg", "size": 105484, "type": "image/svg+xml" }, { "file": "leafs-gold.svg", "size": 105484, "type": "image/svg+xml" }, { "file": "leafs-green.svg", "size": 105484, "type": "image/svg+xml" }, { "file": "leafs-purple.svg", "size": 105484, "type": "image/svg+xml" }, { "file": "leafs.svg", "size": 105493, "type": "image/svg+xml" }, { "file": "play-dots.png", "size": 210, "type": "image/png" }],
  layout: "src/routes/__layout.svelte",
  error: "src/routes/__error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/bugs\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/bugs/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/bugs\/([^/]+?)\/?$/,
      params: (m) => ({ slug: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/bugs/[slug].svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/fish\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/fish/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/fish\/([^/]+?)\/?$/,
      params: (m) => ({ slug: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/fish/[slug].svelte"],
      b: ["src/routes/__error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  "src/routes/__error.svelte": () => Promise.resolve().then(function() {
    return __error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index$2;
  }),
  "src/routes/bugs/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/bugs/[slug].svelte": () => Promise.resolve().then(function() {
    return _slug_$1;
  }),
  "src/routes/fish/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/fish/[slug].svelte": () => Promise.resolve().then(function() {
    return _slug_;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-36303a63.js", "css": ["assets/pages/__layout.svelte-1299d7ed.css"], "js": ["pages/__layout.svelte-36303a63.js", "chunks/vendor-0c5331f5.js"], "styles": [] }, "src/routes/__error.svelte": { "entry": "pages/__error.svelte-7aff17fb.js", "css": ["assets/pages/__error.svelte-e7cb422c.css"], "js": ["pages/__error.svelte-7aff17fb.js", "chunks/vendor-0c5331f5.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-d55afdec.js", "css": ["assets/pages/index.svelte-62232318.css"], "js": ["pages/index.svelte-d55afdec.js", "chunks/vendor-0c5331f5.js"], "styles": [] }, "src/routes/bugs/index.svelte": { "entry": "pages/bugs/index.svelte-1d3c2bc3.js", "css": ["assets/CritterList-cb2f84d8.css"], "js": ["pages/bugs/index.svelte-1d3c2bc3.js", "chunks/vendor-0c5331f5.js", "chunks/bugs-157ae0c9.js", "chunks/CritterList-1e5cf0a0.js"], "styles": [] }, "src/routes/bugs/[slug].svelte": { "entry": "pages/bugs/[slug].svelte-eb798cf3.js", "css": ["assets/CritterPage-6d489c8c.css"], "js": ["pages/bugs/[slug].svelte-eb798cf3.js", "chunks/vendor-0c5331f5.js", "chunks/bugs-157ae0c9.js", "chunks/CritterPage-ad4d6b92.js"], "styles": [] }, "src/routes/fish/index.svelte": { "entry": "pages/fish/index.svelte-73fbeb90.js", "css": ["assets/CritterList-cb2f84d8.css"], "js": ["pages/fish/index.svelte-73fbeb90.js", "chunks/vendor-0c5331f5.js", "chunks/fish-2b1b804d.js", "chunks/CritterList-1e5cf0a0.js"], "styles": [] }, "src/routes/fish/[slug].svelte": { "entry": "pages/fish/[slug].svelte-51e3e9d2.js", "css": ["assets/CritterPage-6d489c8c.css"], "js": ["pages/fish/[slug].svelte-51e3e9d2.js", "chunks/vendor-0c5331f5.js", "chunks/fish-2b1b804d.js", "chunks/CritterPage-ad4d6b92.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var css$6 = {
  code: 'nav.svelte-ve07b4.svelte-ve07b4{font-size:1.6rem;background-color:var(--brown);background-image:url("/play-dots.png");background-size:var(--dot-size);padding:1.5rem;position:fixed;inset:0;z-index:19;display:flex;flex-direction:column;justify-content:center;color:var(--gold);transform:translateY(-100%);transition:all 300ms}nav.svelte-ve07b4 a.svelte-ve07b4{display:block;font-size:5rem;font-weight:bold;text-align:center;text-decoration:none;color:var(--gold);padding:2rem}nav.isOpenNav.svelte-ve07b4.svelte-ve07b4{transform:translateY(0)}button.svelte-ve07b4.svelte-ve07b4{position:fixed;bottom:2rem;right:2rem;width:70px;height:70px;background:var(--gold);box-shadow:3px 3px 0 var(--dbrown);z-index:20;border-radius:100%;padding:1.5rem;border:none;cursor:pointer}#bar-1.svelte-ve07b4.svelte-ve07b4,#bar-2.svelte-ve07b4.svelte-ve07b4,#bar-3.svelte-ve07b4.svelte-ve07b4{transform-origin:center;transition:transform 250ms}.crossMode.svelte-ve07b4 #bar-1.svelte-ve07b4{transform:translate(-5px, 7px) rotate(45deg)}.crossMode.svelte-ve07b4 #bar-2.svelte-ve07b4{transform:scaleX(0)}.crossMode.svelte-ve07b4 #bar-3.svelte-ve07b4{transform:translate(-6px, -6px) rotate(-45deg)}',
  map: '{"version":3,"file":"Header.svelte","sources":["Header.svelte"],"sourcesContent":["<script>\\n\\tlet isOpenNav\\n<\/script>\\n\\n<nav class:isOpenNav>\\n\\t<a href=\\"/\\" sveltekit:prefetch on:click={() => isOpenNav = false}>Home</a>\\n\\t<a href=\\"/bugs\\" sveltekit:prefetch on:click={() => isOpenNav = false}>Bugs</a>\\n\\t<a href=\\"/fish\\" sveltekit:prefetch on:click={() => isOpenNav = false}>Fish</a>\\n</nav>\\n\\n<button on:click=\\"{() => isOpenNav = !isOpenNav}\\">\\n\\t<svg width=\\"100%\\" height=\\"100%\\" viewBox=\\"0 0 30 21\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\" class:crossMode={isOpenNav}>\\n\\t\\t<rect width=\\"30\\" height=\\"3\\" rx=\\"1.5\\" fill=\\"var(--brown)\\" id=\\"bar-1\\" />\\n\\t\\t<rect y=\\"9\\" width=\\"30\\" height=\\"3\\" rx=\\"1.5\\" fill=\\"var(--brown)\\" id=\\"bar-2\\" />\\n\\t\\t<rect y=\\"18\\" width=\\"30\\" height=\\"3\\" rx=\\"1.5\\" fill=\\"var(--brown)\\" id=\\"bar-3\\" />\\n\\t</svg>\\n</button>\\n\\n<style lang=\\"scss\\">nav {\\n  font-size: 1.6rem;\\n  background-color: var(--brown);\\n  background-image: url(\\"/play-dots.png\\");\\n  background-size: var(--dot-size);\\n  padding: 1.5rem;\\n  position: fixed;\\n  inset: 0;\\n  z-index: 19;\\n  display: flex;\\n  flex-direction: column;\\n  justify-content: center;\\n  color: var(--gold);\\n  transform: translateY(-100%);\\n  transition: all 300ms;\\n}\\nnav a {\\n  display: block;\\n  font-size: 5rem;\\n  font-weight: bold;\\n  text-align: center;\\n  text-decoration: none;\\n  color: var(--gold);\\n  padding: 2rem;\\n}\\n\\nnav.isOpenNav {\\n  transform: translateY(0);\\n}\\n\\nbutton {\\n  position: fixed;\\n  bottom: 2rem;\\n  right: 2rem;\\n  width: 70px;\\n  height: 70px;\\n  background: var(--gold);\\n  box-shadow: 3px 3px 0 var(--dbrown);\\n  z-index: 20;\\n  border-radius: 100%;\\n  padding: 1.5rem;\\n  border: none;\\n  cursor: pointer;\\n}\\n\\n#bar-1, #bar-2, #bar-3 {\\n  transform-origin: center;\\n  transition: transform 250ms;\\n}\\n\\n.crossMode #bar-1 {\\n  transform: translate(-5px, 7px) rotate(45deg);\\n}\\n.crossMode #bar-2 {\\n  transform: scaleX(0);\\n}\\n.crossMode #bar-3 {\\n  transform: translate(-6px, -6px) rotate(-45deg);\\n}</style>"],"names":[],"mappings":"AAkBmB,GAAG,4BAAC,CAAC,AACtB,SAAS,CAAE,MAAM,CACjB,gBAAgB,CAAE,IAAI,OAAO,CAAC,CAC9B,gBAAgB,CAAE,IAAI,gBAAgB,CAAC,CACvC,eAAe,CAAE,IAAI,UAAU,CAAC,CAChC,OAAO,CAAE,MAAM,CACf,QAAQ,CAAE,KAAK,CACf,KAAK,CAAE,CAAC,CACR,OAAO,CAAE,EAAE,CACX,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,eAAe,CAAE,MAAM,CACvB,KAAK,CAAE,IAAI,MAAM,CAAC,CAClB,SAAS,CAAE,WAAW,KAAK,CAAC,CAC5B,UAAU,CAAE,GAAG,CAAC,KAAK,AACvB,CAAC,AACD,iBAAG,CAAC,CAAC,cAAC,CAAC,AACL,OAAO,CAAE,KAAK,CACd,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,IAAI,CACjB,UAAU,CAAE,MAAM,CAClB,eAAe,CAAE,IAAI,CACrB,KAAK,CAAE,IAAI,MAAM,CAAC,CAClB,OAAO,CAAE,IAAI,AACf,CAAC,AAED,GAAG,UAAU,4BAAC,CAAC,AACb,SAAS,CAAE,WAAW,CAAC,CAAC,AAC1B,CAAC,AAED,MAAM,4BAAC,CAAC,AACN,QAAQ,CAAE,KAAK,CACf,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,IAAI,MAAM,CAAC,CACvB,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,IAAI,QAAQ,CAAC,CACnC,OAAO,CAAE,EAAE,CACX,aAAa,CAAE,IAAI,CACnB,OAAO,CAAE,MAAM,CACf,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,OAAO,AACjB,CAAC,AAED,kCAAM,CAAE,kCAAM,CAAE,MAAM,4BAAC,CAAC,AACtB,gBAAgB,CAAE,MAAM,CACxB,UAAU,CAAE,SAAS,CAAC,KAAK,AAC7B,CAAC,AAED,wBAAU,CAAC,MAAM,cAAC,CAAC,AACjB,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,GAAG,CAAC,CAAC,OAAO,KAAK,CAAC,AAC/C,CAAC,AACD,wBAAU,CAAC,MAAM,cAAC,CAAC,AACjB,SAAS,CAAE,OAAO,CAAC,CAAC,AACtB,CAAC,AACD,wBAAU,CAAC,MAAM,cAAC,CAAC,AACjB,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,OAAO,MAAM,CAAC,AACjD,CAAC"}'
};
var Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$6);
  return `<nav class="${["svelte-ve07b4", ""].join(" ").trim()}"><a href="${"/"}" sveltekit:prefetch class="${"svelte-ve07b4"}">Home</a>
	<a href="${"/bugs"}" sveltekit:prefetch class="${"svelte-ve07b4"}">Bugs</a>
	<a href="${"/fish"}" sveltekit:prefetch class="${"svelte-ve07b4"}">Fish</a></nav>

<button class="${"svelte-ve07b4"}"><svg width="${"100%"}" height="${"100%"}" viewBox="${"0 0 30 21"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${["svelte-ve07b4", ""].join(" ").trim()}"><rect width="${"30"}" height="${"3"}" rx="${"1.5"}" fill="${"var(--brown)"}" id="${"bar-1"}" class="${"svelte-ve07b4"}"></rect><rect y="${"9"}" width="${"30"}" height="${"3"}" rx="${"1.5"}" fill="${"var(--brown)"}" id="${"bar-2"}" class="${"svelte-ve07b4"}"></rect><rect y="${"18"}" width="${"30"}" height="${"3"}" rx="${"1.5"}" fill="${"var(--brown)"}" id="${"bar-3"}" class="${"svelte-ve07b4"}"></rect></svg>
</button>`;
});
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Header, "Header").$$render($$result, {}, {}, {})}
${slots.default ? slots.default({}) : ``}`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
var css$5 = {
  code: "h1.svelte-ydre6y{font-size:6rem;text-align:center;color:var(--green)}",
  map: '{"version":3,"file":"__error.svelte","sources":["__error.svelte"],"sourcesContent":["<script context=\\"module\\">\\n\\texport function load({ error, status }) {\\n\\t\\treturn {\\n\\t\\t\\tprops: {\\n\\t\\t\\t\\ttitle: `${status}: ${error.message}`\\n\\t\\t\\t}\\n\\t\\t};\\n\\t}\\n<\/script>\\n\\n<script>\\n\\texport let title\\n<\/script>\\n\\n<h1>UH OH! FUCKIN SPAGHETTI-O\'s</h1>\\n<h2>{ title }</h2>\\n\\n<style>\\n\\th1{\\n\\t\\tfont-size: 6rem;\\n\\t\\ttext-align: center;\\n\\t\\tcolor: var(--green);\\n\\t}\\n</style>"],"names":[],"mappings":"AAkBC,gBAAE,CAAC,AACF,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,MAAM,CAClB,KAAK,CAAE,IAAI,OAAO,CAAC,AACpB,CAAC"}'
};
function load$2({ error: error2, status }) {
  return {
    props: { title: `${status}: ${error2.message}` }
  };
}
var _error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$5);
  return `<h1 class="${"svelte-ydre6y"}">UH OH! FUCKIN SPAGHETTI-O&#39;s</h1>
<h2>${escape(title)}</h2>`;
});
var __error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _error,
  load: load$2
});
var butterflyImg = "/_app/assets/rajah_brookes_birdwing-80456e78.png?format=webp";
var css$4 = {
  code: '.intro.svelte-16v0328{min-height:70vh;width:100%;background:linear-gradient(to bottom, var(--blue), hsl(var(--blueHS) calc(var(--blueL) + 30%)))}.bug-section.svelte-16v0328{min-height:70vh;width:100%;background-color:var(--green);background-image:url("/green-triangles.png");background-size:156px 154.5px;position:relative;overflow:hidden}.bug-section.svelte-16v0328:after{content:"";position:absolute;top:0;left:-150%;width:400%;height:3000px;border-top-left-radius:50%;border-top-right-radius:50%;background-color:var(--green);background-image:url("/green-triangles.png");background-size:156px 154.5px;background-position:50% 28%;z-index:-1}',
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<script>\\n\\tlet butterfly = ''\\n\\timport butterflyImg from \\"$lib/img/rajah_brookes_birdwing.png?format=webp\\"\\n\\n<\/script>\\n\\n<section class=\\"intro\\">\\n\\t<img src={butterflyImg} type=\\"image/webp\\" alt=\\"bug\\">\\n</section>\\n\\n<section class=\\"bug-section\\"></section>\\n\\n\\n<style lang=\\"scss\\">.intro {\\n  min-height: 70vh;\\n  width: 100%;\\n  /* background: linear-gradient(to bottom, var(--blue), var(--tan)); */\\n  background: linear-gradient(to bottom, var(--blue), hsl(var(--blueHS) calc(var(--blueL) + 30%)));\\n}\\n\\n.bug-section {\\n  min-height: 70vh;\\n  width: 100%;\\n  background-color: var(--green);\\n  background-image: url(\\"/green-triangles.png\\");\\n  background-size: 156px 154.5px;\\n  position: relative;\\n  overflow: hidden;\\n}\\n.bug-section:after {\\n  content: \\"\\";\\n  position: absolute;\\n  top: 0;\\n  left: -150%;\\n  width: 400%;\\n  height: 3000px;\\n  border-top-left-radius: 50%;\\n  border-top-right-radius: 50%;\\n  background-color: var(--green);\\n  background-image: url(\\"/green-triangles.png\\");\\n  background-size: 156px 154.5px;\\n  background-position: 50% 28%;\\n  z-index: -1;\\n}</style>"],"names":[],"mappings":"AAamB,MAAM,eAAC,CAAC,AACzB,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,IAAI,CAEX,UAAU,CAAE,gBAAgB,EAAE,CAAC,MAAM,CAAC,CAAC,IAAI,MAAM,CAAC,CAAC,CAAC,IAAI,IAAI,QAAQ,CAAC,CAAC,KAAK,IAAI,OAAO,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,AAClG,CAAC,AAED,YAAY,eAAC,CAAC,AACZ,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,IAAI,CACX,gBAAgB,CAAE,IAAI,OAAO,CAAC,CAC9B,gBAAgB,CAAE,IAAI,sBAAsB,CAAC,CAC7C,eAAe,CAAE,KAAK,CAAC,OAAO,CAC9B,QAAQ,CAAE,QAAQ,CAClB,QAAQ,CAAE,MAAM,AAClB,CAAC,AACD,2BAAY,MAAM,AAAC,CAAC,AAClB,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CACX,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,MAAM,CACd,sBAAsB,CAAE,GAAG,CAC3B,uBAAuB,CAAE,GAAG,CAC5B,gBAAgB,CAAE,IAAI,OAAO,CAAC,CAC9B,gBAAgB,CAAE,IAAI,sBAAsB,CAAC,CAC7C,eAAe,CAAE,KAAK,CAAC,OAAO,CAC9B,mBAAmB,CAAE,GAAG,CAAC,GAAG,CAC5B,OAAO,CAAE,EAAE,AACb,CAAC"}`
};
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$4);
  return `<section class="${"intro svelte-16v0328"}"><img${add_attribute("src", butterflyImg, 0)} type="${"image/webp"}" alt="${"bug"}"></section>

<section class="${"bug-section svelte-16v0328"}"></section>`;
});
var index$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var bugs = [
  {
    name: "Agrias Butterfly",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    start: 8,
    end: 17,
    price: 3e3,
    flickPrice: 4500,
    location: "flying",
    img: "Agrias_Butterfly",
    detailedImg: "agrias_butterfly",
    slug: "agrias_butterfly",
    rarity: "uncommon",
    phrase: "I caught an agrias butterfly! I wonder if it finds me disagrias-able?",
    blathers: "Some say the agrias butterfly is one of the most beautiful butterflies in the world. Bah, I say! BAH! They may have brightly colored wings, but the way they flutter and flitter...SO FOUL! In fact, the agrias butterfly flies so fast, it is quite a feat to catch one. I suppose I should congratulate you on your good fortune... But catching any bug seems a misfortune to me."
  },
  {
    name: "Ant",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    start: 0,
    end: 24,
    price: 80,
    flickPrice: 120,
    location: "rotten food",
    img: "Ant",
    detailedImg: "ant",
    slug: "ant",
    rarity: "common",
    phrase: "I caught an ant! TELL ME WHERE THE QUEEN IS!",
    blathers: "I warn you, the ant may be a small bug, but it finds scary strength in numbers. You see, the ant itself is the strongest creature in the world in relation to its size. One of these diminutive fiends can carry 50 times its own bodyweight! And if it wants to lift something even larger... Why, it simply calls on its ant friends to join the effort. Creepy cooperation, I say..."
  },
  {
    name: "Atlas Moth",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    start: 19,
    end: 4,
    price: 3e3,
    flickPrice: 4500,
    location: "trees",
    img: "Atlas_Moth",
    detailedImg: "atlas_moth",
    slug: "atlas_moth",
    rarity: "uncommon",
    phrase: "I caught an Atlas moth! I bet it never gets lost!",
    blathers: "The Atlas moth is a monstrous thing! Not only is it one of the largest moths in the world... The tips of its wings look rather like the heads of venomous snakes! Despite its largeness and loathsome looks, the adult Atlas moth lives only for a few days. It emerges from its cocoon without a mouth, you see...and so cannot eat. I feel for the poor thing...but it is still foul!"
  },
  {
    name: "Bagworm",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    start: 0,
    end: 24,
    price: 600,
    flickPrice: 900,
    location: "shaking trees",
    img: "Bagworm",
    detailedImg: "bagworm",
    slug: "bagworm",
    rarity: "common",
    phrase: "I caught a bagworm! Guess I'm a bragworm!",
    blathers: "The bagworm is, in fact, not a worm at all, but a caterpillar instead. The filthy fraud uses silk and leaves to spin a cozy bag for it to hide inside\u2014hence the name. Some find it cute the way bagworms dangle from trees. But the truth is they're gluttonous monsters. These beasts love to stuff their bug- gullets full of leaves, devouring the very trees they hang upon. Wretched villains is what they are."
  },
  {
    name: "Banded Dragonfly",
    months: [
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct"
    ],
    start: 8,
    end: 17,
    price: 4500,
    flickPrice: 6750,
    location: "flying",
    img: "Banded_Dragonfly",
    detailedImg: "banded_dragonfly",
    slug: "banded_dragonfly",
    rarity: "rare",
    phrase: "I did it! Did you see that? I caught a banded dragonfly!",
    blathers: "The banded dragonfly is known for its black-and-yellow-striped body, as well as for its piercing green eyes. And it is those very eyes that help make dragonflies master hunters, you see. Alas, when one looks at me, I can't help but feel it is sizing me up for a meal! Hoot! The horrors! Look away, fiend!"
  },
  {
    name: "Bell Cricket",
    months: [
      "sept",
      "oct"
    ],
    start: 0,
    end: 24,
    price: 430,
    flickPrice: 645,
    location: "ground",
    img: "Bell_Cricket",
    detailedImg: "bell_cricket",
    slug: "bell_cricket",
    rarity: "common",
    phrase: "I found a bell cricket! It would make a great bellhop!",
    blathers: "The call of the bell cricket heralds the arrival of autumn. And I concede it is a rather pleasant sound. What I do NOT find pleasant is the way these things rub their strange wings together to make their song! Ick and blech! And to make matters worse, bell crickets have been known to shed two of their four wings! And they simply leave these wings where they fall, as if it were litter! I simply cannot abide such odious behavior."
  },
  {
    name: "Blue Weevil Beetle",
    months: [
      "jul",
      "aug"
    ],
    start: 0,
    end: 24,
    price: 800,
    flickPrice: 1200,
    location: "palm trees",
    img: "Blue_Weevil_Beetle",
    detailedImg: "blue_weevil_beetle",
    slug: "blue_weevil_beetle",
    rarity: "common",
    phrase: "I caught a blue weevil b\u2026lesser of blue weevils!",
    blathers: "Yes, yes. The blue weevil beetle does come in beautiful shades of blue and green. The colors are so bright, some say it looks like a living jewel. But I say it looks like a weevil...and weevil rhymes with EVIL. Draw your own conclusions from there. Hoot! I certainly have!"
  },
  {
    name: "Brown Cicada",
    months: [
      "jul",
      "aug"
    ],
    start: 8,
    end: 17,
    price: 250,
    flickPrice: 375,
    location: "Hardwood/Cedar Trees",
    img: "Brown_Cicada",
    detailedImg: "brown_cicada",
    slug: "brown_cicada",
    rarity: "common",
    phrase: "I caught a brown cicada! Now it probably feels blue, cicada.",
    blathers: "Cicadas are obnoxious insects. And not just brown cicadas, mind you...but all cicadas! They flex ribbed membranes on their torso called tymbals to make a loud snapping sound. So rude! Hoo! Yes, it is only the males who make the noise. Sometimes at a volume that can produce pain at close range! Appallingly inconsiderate, I must say..."
  },
  {
    name: "Centipede",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    start: 17,
    end: 23,
    price: 300,
    flickPrice: 450,
    location: "rocks",
    img: "Centipede",
    detailedImg: "centipede",
    slug: "centipede",
    rarity: "common",
    phrase: "I caught a centipede! 99 more and I'll have a dollarpede!",
    blathers: `The centipede's name means "100 legs." But I tell you now, that's a lie! These ugly bugs can have as few as 15 pairs of legs...or as many as 171. But because of how their bodies are segmented, they never have exactly 100! Hoo! It's true! You know what else is true? Centipedes are carnivorous, aggressive, and venomous! And their bite is quite painful too! HOO-rrible things, I say.`
  },
  {
    name: "Cicada Shell",
    months: [
      "jul",
      "aug"
    ],
    start: 0,
    end: 24,
    price: 10,
    flickPrice: 15,
    location: "shaking trees",
    img: "Cicada_Shell",
    detailedImg: "cicada_shell",
    slug: "cicada_shell",
    rarity: "rare",
    phrase: "I found a cicada shell! I'm glad the little guy came out of it!",
    blathers: "Cicadas! The nerve! Not only are they loud, they leave their cicada shells lying about! When it's time for a cicada nymph to turn into an adult, you see, it clings to a tree and sheds its exoskeleton. Then it just leaves this shell of its former self hanging right there! Awful manners, really...and awfully terrifying too."
  },
  {
    name: "Citrus Long-Horned Beetle",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    start: 0,
    end: 24,
    price: 350,
    flickPrice: 525,
    location: "tree stump",
    img: "Citrus_Long_Horned_Beetle",
    detailedImg: "citrus_long-horned_beetle",
    slug: "citrus_long_horned_beetle",
    rarity: "common",
    phrase: "I caught a citrus long-horned beetle! Orange you happy for me?",
    blathers: "The citrus long-horned beetle is a putrid pest and a grave threat to trees. Hoo! It's true! Adults possess powerful jaws and use them to chomp through hard wood and plant fibers with ease. The little larvae are no better, boring bullet-like holes into innocent trees with gusto\u2014citrus trees especially. Voracious and vile, indeed!"
  },
  {
    name: "Common Bluebottle",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19
    ],
    start: 4,
    end: 19,
    price: 300,
    flickPrice: 450,
    location: "flying",
    img: "Common_Bluebottle",
    detailedImg: "common_bluebottle",
    slug: "common_bluebottle",
    rarity: "common",
    phrase: "I caught a common bluebottle! I'll put it in a rare green jar!",
    blathers: "The common bluebottle is a type of swallowtail butterfly with a bright blue line running down its wings. They fly quite nimbly, it seems, and are thus quite difficult to catch. But seeing how they've been known to slurp nutrients from MUD puddles... I simply CAN'T imagine wanting to catch one myself. What awful breath!"
  },
  {
    name: "Common Butterfly",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    start: 4,
    end: 19,
    price: 160,
    flickPrice: 240,
    location: "flying",
    img: "Common_Butterfly",
    detailedImg: "common_butterfly",
    slug: "common_butterfly",
    rarity: "common",
    phrase: "I caught a common butterfly! They often flutter by!",
    blathers: "The common butterfly would have you believe it is but a beautiful friend flitting prettily about the flowers. Bah, I say! They may seem innocent things with their pretty white wings, but they hide a dark side! The common butterfly caterpillar is called a cabbage worm, you see, and it's a most voracious pest. The ravenous beasts chew through cabbage, broccoli, kale and the like with a devastating gusto. And my feathers! Their green coloring is truly GROSS! A hoo-rrific hue, I say."
  },
  {
    name: "Cricket",
    months: [
      "sept",
      "oct",
      "nov"
    ],
    start: 17,
    end: 8,
    price: 130,
    flickPrice: 195,
    location: "ground",
    img: "Cricket",
    detailedImg: "cricket",
    slug: "cricket",
    rarity: "common",
    phrase: "I caught a cricket! What a chirp thrill!",
    blathers: "I say, where shall I start with the cricket? Well, to begin with, they are mostly nocturnal creatures. And for that you day-loving diurnal types should be grateful! Hoo! It means you don't have to lay eyes upon their prickly legs or overly long antennae like us night owls! Of course, crickets are best known for the chirping sound they make by rubbing their wings together. Some find the noise lovely to listen to. Alas, it only serves to remind me of another unpleasant fact... Which is to say...you will find a cricket's ears right next to its knees! I've gone weak in the knees at the mention of it!"
  },
  {
    name: "Cyclommatus Stag",
    months: [
      "jul",
      "aug"
    ],
    start: 17,
    end: 8,
    price: 8e3,
    flickPrice: 12e3,
    location: "coconut trees",
    img: "Cyclommatus_Stag",
    detailedImg: "cyclommatus_stag",
    slug: "cyclommatus_stag",
    rarity: "ultra-rare",
    phrase: "I caught a cyclommatus stag! Those mandibles are a mouthful!",
    blathers: "The cyclommatus stag is known for its giant jaws, which can be even larger than its body. Its round eyes and silver color make it a beloved beetle. Though how one could love a beetle is beyond me. Imagine being pinched by those long jaws, and the pain it would cause! Ouch and ewww!"
  },
  {
    name: "Damselfly",
    months: [
      "jan",
      "feb",
      "nov",
      "dec"
    ],
    start: 0,
    end: 24,
    price: 500,
    flickPrice: 750,
    location: "flying",
    img: "Damselfly",
    detailedImg: "damselfly",
    slug: "damselfly",
    rarity: "common",
    phrase: "I caught a damselfly! Now it's a damselfly in distress!",
    blathers: "The colorful damselfly is similar to its cousin, the dragonfly, though it tends to be smaller and thinner. But don't let the delicate looks fool you! Much like the dragonfly, the damselfly is a ruthless predator. It loves to catch flies midair and eat them, and has been known to snack on spiders it plucks from the web! In short, it is not a dinner guest I would recommend... And it is not a menu I could keep down."
  },
  {
    name: "Darner Dragonfly",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct"
    ],
    start: 8,
    end: 17,
    price: 230,
    flickPrice: 345,
    location: "flying",
    img: "Darner_Dragonfly",
    detailedImg: "darner_dragonfly",
    slug: "darner_dragonfly",
    rarity: "common",
    phrase: "I caught a darner dragonfly! It better watch its mouth!",
    blathers: "The darner dragonfly is the fastest dragonfly there is, flying at speeds up to 40 miles per hour! They all have a distinctive green hue, but the males have blue underbellies while females have yellow ones. It all sounds pleasant enough, no? Well, did you know their young eat tadpoles...and even some small fish! Worse, these creepy carnivores will eat each other in a pinch! Grotesque does not describe it..."
  },
  {
    name: "Diving Beetle",
    months: [
      "may",
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    start: 8,
    end: 19,
    price: 800,
    flickPrice: 1200,
    location: "river/pond",
    img: "Diving_Beetle",
    detailedImg: "diving_beetle",
    slug: "diving_beetle",
    rarity: "common",
    phrase: "I caught a diving beetle! Now I'm making a splash!",
    blathers: "Ah, the dastardly diving beetle! Famous for its distinctive round shape...and its voracious appetite. This powerful predator uses thick back legs covered in hairs to paddle after its prey. And it uses suction cups on its front legs to grip its quarry for good. My own legs have gone weak thinking about it..."
  },
  {
    name: "Drone Beetle",
    months: [
      "jun",
      "jul",
      "aug"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 200,
    flickPrice: 300,
    location: "trees",
    img: "Drone_Beetle",
    detailedImg: "drone_beetle",
    slug: "drone_beetle",
    rarity: "common",
    phrase: "I caught a drone beetle! Shouldn't you have more propellers?",
    blathers: "I must say, the drone beetle is like that boorish acquaintance who is much too loud for polite company. That is, it is a large bug with a square head and is so named for the droning noise it makes when it flies. Furthermore, it has hooks on its feet that help it to cling tightly to trees. HOOK FEET... How gauche!"
  },
  {
    name: "Dung Beetle",
    months: [
      "jan",
      "feb",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 3e3,
    flickPrice: 4500,
    location: "snowballs",
    img: "Dung_Beetle",
    detailedImg: "dung_beetle",
    slug: "dung_beetle",
    rarity: "common",
    phrase: "I caught a dung beetle! This species likes feces!",
    blathers: "What can I say? The aptly-named dung beetle feeds on the feces of animals. Hoo! You heard right! This putrid pest rolls up balls of dung...and then rolls them away to dine on at a later date. As if that weren't atrocious enough, some dung beetles lay their eggs in the feces too! What a dreadful place to raise the young."
  },
  {
    name: "Earth-Boring Dung Beetle",
    months: [
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 300,
    flickPrice: 450,
    location: "trees",
    img: "Earth_Boring_Dung_Beetle",
    detailedImg: "earth-boring_dung_beetle",
    slug: "earth_boring_dung_beetle",
    rarity: "common",
    phrase: "I caught an earth-boring dung beetle! It's not boring at all!",
    blathers: "Earth-boring dung beetles are considered quite handsome by some, thanks to their metallic luster. In fact, some even think them to be good omens and bringers of favorable fortune. But I must protest! These field- ravaging pests love to burrow under piles of dung and lay their eggs. They raise their young under DUNG! Need I say more? Ick. I think not."
  },
  {
    name: "Emperor Butterfly",
    months: [
      "jan",
      "feb",
      "mar",
      "jun",
      "jul",
      "aug",
      "sept",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 17,
    end: 8,
    price: 4e3,
    flickPrice: 6e3,
    location: "flying",
    img: "Emperor_Butterfly",
    detailedImg: "emperor_butterfly",
    slug: "emperor_butterfly",
    rarity: "uncommon",
    phrase: "I caught an emperor butterfly! It's not your average monarch!",
    blathers: "The emperor butterfly is called the jewel of the forest. But its vivid blue hue... Ewww, let me tell you! The color does not come from a dye, but rather from light reflecting off layers of translucent scales. Yes, butterfly wings are covered in tiny scales! SCALES! Butterfly? Bah! More like snake of the sky!"
  },
  {
    name: "Evening Cicada",
    months: [
      "jul",
      "aug"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      16,
      17,
      18,
      19
    ],
    start: [
      4,
      16
    ],
    end: [
      8,
      19
    ],
    price: 550,
    flickPrice: 825,
    location: "hardwood/cedar trees",
    img: "Evening_Cicada",
    detailedImg: "evening_cicada",
    slug: "evening_cicada",
    rarity: "common",
    phrase: "I caught an evening cicada! Better than an odding cicada...",
    blathers: "The evening cicada certainly knows how to ruin a quiet moment. As the sun sets, it strikes up a sad song so sonorous, one can't hear one's own thoughts! I'd feel sorry for its melancholy moods if it weren't so very vocal about how it feels. Ugh, please pipe down..."
  },
  {
    name: "Firefly",
    months: [
      "jun"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 19,
    end: 4,
    price: 300,
    flickPrice: 450,
    location: "flying",
    img: "Firefly",
    detailedImg: "firefly",
    slug: "firefly",
    rarity: "common",
    phrase: "I caught a firefly! I'm on fire now!",
    blathers: `The firefly isn't a fly at all! It is a beetle, you see\u2014and one known for its ghastly glowing backside. This light is called "bioluminescence" and it is caused by...by...a chemical reaction in the rump. Males flash about in the night sky to attract females, while their larvae turn on the glow to put off predators. Speaking of their yucky young, firefly larvae love to dine on snails! Hoo! Ewwww!`
  },
  {
    name: "Flea",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 70,
    flickPrice: 105,
    location: "on a villager",
    img: "Flea",
    detailedImg: "flea",
    slug: "flea",
    rarity: "common",
    phrase: "I caught a flea! The curse is lifted.",
    blathers: "Allow me to be blunt. The flea is foul! It is also disgusting, repugnant, and vile! Hoo! But I digress... This horrid pest sucks the blood of humans and animals. In fact, it is the flea's own saliva that makes us itch! And did you know their legs are so strong, they can jump more than 50 times their body length? So you see, it's all too easy for a flea to jump from you to me! I itch at the very thought."
  },
  {
    name: "Fly",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 60,
    flickPrice: 90,
    location: "garbage",
    img: "Fly",
    detailedImg: "fly",
    slug: "fly",
    rarity: "common",
    phrase: "I caught a fly! I was just wingin' it...",
    blathers: "The foul fly is quite the disquieting creature. I tell you, it tastes its food with its feet! Yeep! In fact, when flies rub their legs together, they do so to get rid of debris blocking their taste receptors. And did you know, their hairy toes release a sticky goo so they can walk on any surface? Even your ceiling! This gross goo gets on your food too!"
  },
  {
    name: "Giant Cicada",
    months: [
      "jul",
      "aug"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17
    ],
    start: 8,
    end: 17,
    price: 500,
    flickPrice: 750,
    location: "hardwood/cedar trees",
    img: "Giant_Cicada",
    detailedImg: "giant_cicada",
    slug: "giant_cicada",
    rarity: "uncommon",
    phrase: "I caught a giant cicada! I guess it's PRETTY big...",
    blathers: "The giant cicada is rather aptly named. That is, it's a truly enormous bug. Ugh! These beasts spend most of their lives underground where they gorge on tree roots. But once they emerge, they make an awful racket. In fact, some say their song sounds like a shrieking siren. I would rather listen to nails on a chalkboard."
  },
  {
    name: "Giant Stag",
    months: [
      "jul",
      "aug"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      23,
      24
    ],
    start: 23,
    end: 8,
    price: 1e4,
    flickPrice: 15e3,
    location: "trees",
    img: "Giant_Stag",
    detailedImg: "giant_stag",
    slug: "giant_stag",
    rarity: "rare",
    phrase: "Whoaaa! I caught a giant stag! I'm gonna need way bigger pockets...",
    blathers: "It is said the giant stag is a popular pet among bug enthusiasts. Though how one might consider oneself enthusiastic about bugs is quite beyond me... But I digress. Giant stags look fearsome with their enormous curved mandibles. But in truth, they're really quite cowardly. Oh how they love to hide away in rotting wood, only to reveal themselves under the cover of dark. Hoot! I shall never turn off the lights again!"
  },
  {
    name: "Giant Water Bug",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 19,
    end: 8,
    price: 2e3,
    flickPrice: 3e3,
    location: "river/pond",
    img: "Giant_Waterbug",
    detailedImg: "giant_water_bug",
    slug: "giant_waterbug",
    rarity: "rare",
    phrase: "I caught a giant water bug! It should've stayed in the water!",
    blathers: 'How to put this gently? Ah yes... BEWARE the giant water bug! I tell you, this vicious predator has been known to attack fish, frogs, and even snakes! SNAKES! Truth be told, no one is safe! Its nickname is "the toe-biter," for goodness sakes! Now, one final fact before I faint... The gruesome bug uses its nose...to inject its prey...with digestive juices. Hoo... Must stop thinking about...the unthinkable.'
  },
  {
    name: "Giraffe Stag",
    months: [
      "jul",
      "aug"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 17,
    end: 8,
    price: 12e3,
    flickPrice: 18e3,
    location: "coconut trees",
    img: "Giraffe_Stag",
    detailedImg: "giraffe_stag",
    slug: "giraffe_stag",
    rarity: "ultra-rare",
    phrase: "I caught a giraffe stag! Does that make it a longhorn?",
    blathers: "The giraffe stag beetle is a bug of preposterous proportions. Not only is its body rather large, it has two long, jagged jaws that can put it over five inches in size! The giraffe stag beetle's long jaws have been compared to the long neck of the giraffe...hence the name. But I say such comparisons are a stretch. Giraffe necks are NOT lined with spikes! If I were a giraffe, I would protest."
  },
  {
    name: "Golden Stag",
    months: [
      "jul",
      "aug"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 17,
    end: 8,
    price: 12e3,
    flickPrice: 18e3,
    location: "coconut trees",
    img: "Golden_Stag",
    detailedImg: "golden_stag",
    slug: "golden_stag",
    rarity: "ultra-rare",
    phrase: "Wooooow! I caught a golden stag! Does this mean I can retire?",
    blathers: "Yes. Yes. The golden stag beetle is quite the prize thanks to its metallic gold coloring. But let me speak plainly... The golden stag is NOT made of gold. It is made of BUG, through and through. And thus it is vile! Golden stag? Bah! Gross stag is more like it."
  },
  {
    name: "Goliath Beetle",
    months: [
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 17,
    end: 8,
    price: 8e3,
    flickPrice: 12e3,
    location: "coconut trees",
    img: "Goliath_Beetle",
    detailedImg: "goliath_beetle",
    slug: "goliath_beetle",
    rarity: "ultra-rare",
    phrase: "I caught a goliath beetle! Am I a legend or what?",
    blathers: "Hoo! Ewww! The goliath beetle is a colossal creature that can grow up to four-inches long. Yes, they love to sup on sap and pollen, and frolic among the flowers. But did you know, the goliath beetle has a horn upon its head that it uses to fight its foes? And picture this... Each one of this behemoth's legs ends in pincers! Deep...calming...breaths..."
  },
  {
    name: "Grasshopper",
    months: [
      "jul",
      "aug",
      "sept"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17
    ],
    start: 8,
    end: 17,
    price: 160,
    flickPrice: 240,
    location: "ground",
    img: "Grasshopper",
    detailedImg: "grasshopper",
    slug: "grasshopper",
    rarity: "common",
    phrase: "I caught a grasshopper! They're a grass act!",
    blathers: `Grasshoppers are known for making a "chirping" sound. Though it doesn't sound like chirping to me... They make this rude racket by rubbing their hind legs against their wings. And though they eat seeds and pollen, they sometimes prey on smaller insects too. I say! Such violent table manners should not be tolerated! Horrible hoppers.`
  },
  {
    name: "Great Purple Emperor",
    months: [
      "may",
      "jun",
      "jul",
      "aug"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19
    ],
    start: 4,
    end: 19,
    price: 3e3,
    flickPrice: 4500,
    location: "flying",
    img: "Great_Purple_Emperor",
    detailedImg: "great_purple_emperor",
    slug: "great_purple_emperor",
    rarity: "rare",
    phrase: "I caught a great purple emperor! Its purple reign is over now!",
    blathers: "The great purple emperor lives high in the treetops and is renowned for its pretty purple-hued wings. Its impressive bird-like wingspan and elusive nature have made it a favorite among butterfly aficionados. But truth be told, the so-called great purple emperor has some not-so-great personal peculiarities. For one...it has two horrid HORNS upon its head when it is in its caterpillar form. For two...it has been known to dine on feces and animal carcasses! Hoo! That's why I call it the Emperor of EWWW!"
  },
  {
    name: "Hermit Crab",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 19,
    end: 8,
    price: 1e3,
    flickPrice: 1500,
    location: "beach",
    img: "Hermit_Crab",
    detailedImg: "hermit_crab",
    slug: "hermit_crab",
    phrase: "I caught a hermit crab! I think it wanted to be left alone!",
    blathers: "The hermit crab is not an insect... Though it most certainly resembles one. Blech! It looks much like a spider\u2014what with its creepy eyes and crawly legs\u2014but is, in fact, a crustacean. As such, the hermit crab has 10 legs and also wears a shell. But it doesn't grow this shell itself. It slips its soft body into shells left behind by snails, you see, and moves into ever-larger ones as it grows. Talk about a strange way to make a home."
  },
  {
    name: "Honeybee",
    months: [
      "mar",
      "apr",
      "may",
      "jun",
      "jul"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17
    ],
    start: 8,
    end: 17,
    price: 200,
    flickPrice: 300,
    location: "near flowers",
    img: "Honey_Bee",
    detailedImg: "honeybee",
    slug: "honey_bee",
    rarity: "common",
    phrase: "I caught a honeybee! Ah, sweet success!",
    blathers: `Did you know it takes a team of honeybees working together to transform flower nectar into honey? Indeed, forager bees suck nectar from flowers into their "honey stomachs" and then fly it to the hive. Hive bees then chew the substance and spit it into the honeycomb, fluttering their wings to dry it out. Yes, you could say honey is a tasty tribute to the hard work of the humble honeybee. Oh! Oh my! You mustn't confuse my lengthy description for admiration! At the end of the day, honeybees are still insects, and thus still ghastly! A wee bit less ghastly than most, I admit.`
  },
  {
    name: "Horned Atlas",
    months: [
      "jul",
      "aug"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 17,
    end: 8,
    price: 8e3,
    flickPrice: 12e3,
    location: "coconut trees",
    img: "Horned_Atlas",
    detailedImg: "horned_atlas",
    slug: "horned_atlas",
    rarity: "ultra-rare",
    phrase: "I caught a horned atlas! I didn't even need a map!",
    blathers: "Beware the horned atlas! I tell you, this rhinoceros beetle is known for its violent temperament! The males use the three large horns on their heads to fight amongst each other for dominance. But it is their young that truly give me the cold sweats. You see, their larvae grow quite large and, worst of all...they bite! It is the stuff of nightmares, I say."
  },
  {
    name: "Horned Dynastid",
    months: [
      "jul",
      "aug"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 17,
    end: 8,
    price: 1350,
    flickPrice: 2025,
    location: "trees",
    img: "Horned_Dynastid",
    detailedImg: "horned_dynastid",
    slug: "horned_dynastid",
    rarity: "common",
    phrase: "I caught a horned dynastid! I'd hate to hear it honk that schnoz!",
    blathers: "The horned dynastid's head is shaped like a samurai warrior's helmet, hootie-hoo! It would be a most impressive fact if their large size wasn't so horrifying! Adult males use their huge horned heads for fighting and digging, while the females have no such need. As for their larvae and pupae, they too are quite large and feed on rotting wood at a tremendous pace. A foul feast, indeed!"
  },
  {
    name: "Horned Elephant",
    months: [
      "jul",
      "aug"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 17,
    end: 8,
    price: 8e3,
    flickPrice: 12e3,
    location: "coconut trees",
    img: "Horned_Elephant",
    detailedImg: "horned_elephant",
    slug: "horned_elephant",
    rarity: "ultra-rare",
    phrase: "I caught a horned elephant! I think it's too small to ride...",
    blathers: "The horned elephant beetle certainly lives up to its namesake. Not only does the horn on its head resemble the trunk of an elephant... It is also one of the heaviest beetles in the world! Size aside, allow me to reveal the real reason I find horned elephant beetles so repugnant... Their backs are covered in a fine coat of hair! Hirsute beetles! Hoot! The horror!"
  },
  {
    name: "Horned Hercules",
    months: [
      "jul",
      "aug"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 12e3,
    flickPrice: 18e3,
    location: "coconut trees",
    img: "Horned_Hercules",
    detailedImg: "horned_hercules",
    slug: "horned_hercules",
    rarity: "ultra-rare",
    phrase: "I caught a horned hercules! Guess I was stronger!",
    blathers: "The horned hercules is not only known for its tremendous strength, but for its size as well. It can grow up to seven-inches long and has powerful pincers covered in hair that help with gripping! As if this weren't ghastly enough, these behemoth beetles let loose a foul odor that fends off enemies... And offends my sense of smell."
  },
  {
    name: "Jewel Beetle",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 2400,
    flickPrice: 3600,
    location: "tree stump",
    img: "Jewel_Beetle",
    detailedImg: "jewel_beetle",
    slug: "jewel_beetle",
    rarity: "uncommon",
    phrase: "I caught a jewel beetle! It's a real gem!",
    blathers: "The green shimmer of the jewel beetle's wings is nothing short of nauseating...yes? No? Well, so says you. Though...jewel beetles were once prized by collectors who turned their iridescent wings into pretty jewelry. Why anyone would want to wear bug parts on their body is beyond me. Fashion foul indeed."
  },
  {
    name: "Ladybug",
    months: [
      "mar",
      "apr",
      "may",
      "jun",
      "oct"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17
    ],
    start: 8,
    end: 17,
    price: 200,
    flickPrice: 300,
    location: "flowers",
    img: "Ladybug",
    detailedImg: "ladybug",
    slug: "ladybug",
    rarity: "common",
    phrase: "I caught a ladybug! Sorry to disturb you, ma'am.",
    blathers: "Yes. Yes. Ladybugs are quite beloved thanks to their tiny round shape and adorable spots. To that I say BAH! The fact of the matter is, some have stripes instead of spots. And SOME have no markings at all! No, I shall never understand why it is said that when a ladybug lands on you...you'll have good luck. I shall only have a fainting spell."
  },
  {
    name: "Long Locust",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ],
    start: 8,
    end: 16,
    price: 200,
    flickPrice: 300,
    location: "ground",
    img: "Long_Locust",
    detailedImg: "long_locust",
    slug: "long_locust",
    rarity: "common",
    phrase: "I caught a long locust! Or, as I call it, a looooocust.",
    blathers: "As if the average locust weren't large enough...we must suffer the long locust too! The wretched beasts are known for their unusually long hind legs as well as their elongated heads. But that is hardly the long locusts' worst trait... I tell you, they spit brown goo when they're scared!"
  },
  {
    name: "Madagascan Sunset Moth",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ],
    start: 8,
    end: 16,
    price: 2500,
    flickPrice: 3750,
    location: "flying",
    img: "Madagascan_Sunset_Moth",
    detailedImg: "madagascan_sunset_moth",
    slug: "madagascan_sunset_moth",
    rarity: "uncommon",
    phrase: "I caught a Madagascan sunset moth! Wow, you're not from around here!",
    blathers: "The Madagascan sunset moth is said to be the most beautiful moth in the world...a sentiment even I can't deny. While most moths are nocturnal, this one flutters about during the day, making good use of the light. That is, when the daylight reflects off its wings, a kaleidoscope of colors are revealed! Oh! Eh...too bad it has such startling red feet as a caterpillar. I might have found it almost tolerable otherwise. Almost, but not quite."
  },
  {
    name: "Man-Faced Stinkbug",
    months: [
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 1e3,
    flickPrice: 1500,
    location: "flowers",
    img: "Man_Faced_Stinkbug",
    detailedImg: "man-faced_stink_bug",
    slug: "man_faced_stinkbug",
    rarity: "uncommon",
    phrase: "I caught a man-faced stink bug! Reminds me of my uncle!",
    blathers: "Never mind this stink bug's smell. What you have here is a bug...with a FACE...on its BACK!! Wot-wot! Simply put, the man-faced stink bug has markings on its shell that resemble a human face. Once you notice this face, you cannot UN-notice it. Indeed, this face might haunt you forever. At least the face will distract you from the stink."
  },
  {
    name: "Mantis",
    months: [
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17
    ],
    start: 8,
    end: 17,
    price: 430,
    flickPrice: 645,
    location: "flowers",
    img: "Mantis",
    detailedImg: "mantis",
    slug: "mantis",
    rarity: "common",
    phrase: "I caught a mantis! Man, 'tis so cool!",
    blathers: "Hoo! Don't let the mantis's angelic pose fool you...for it is truly monstrous. The mantis is known for its large size and tremendous strength...and for sickle-like arms that pack a punch. And though they tend to eat bugs and spiders...mantises have been known to dine on small animals too! And those eerie eyes! Oh my! Did you know it has five of them! Two big ones and three small! I shall faint if I think on it further..."
  },
  {
    name: "Migratory Locust",
    months: [
      "feb",
      "mar",
      "apr",
      "may"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19
    ],
    start: 8,
    end: 19,
    price: 600,
    location: "ground",
    img: "Migratory_Locust",
    detailedImg: "migratory_locust",
    slug: "migratory_locust",
    rarity: "uncommon",
    phrase: "I caught a migratory locust! Things just went south for this guy!",
    blathers: `Ah yes, the lone migratory locust. It seems like such a harmless hopper as it bounces about in the grass. But beware! When these pests band together and travel in swarms, they leave devastation in their wake! Migratory locusts have gathered by the millions throughout history, wiping out crops and causing famine. That's why I always say, "Never let a locust hang out with its friends!". That is precisely how a plague begins.`
  },
  {
    name: "Miyama Stag",
    months: [
      "jul",
      "aug"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 1e3,
    location: "trees",
    img: "Miyama_Stag",
    detailedImg: "miyama_stag",
    slug: "miyama_stag",
    rarity: "common",
    phrase: "I caught a miyama stag! Its mandibles are jaw-dropping!",
    blathers: 'The miyama stag has protrusions on its head that resemble ears... And yet, the ugly lumps are not ears! It is, however, called a "stag" beetle because of the large, deer-like horns upon its head. And the word "miyama" in its name means "deep mountain" in Japanese. Feel free to call it what you like. I will simply call it DISGUSTING. "Disgusting stag beetle" does have a ring.'
  },
  {
    name: "Mole Cricket",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 500,
    location: "underground",
    img: "Mole_Cricket",
    detailedImg: "mole_cricket",
    slug: "mole_cricket",
    rarity: "common",
    phrase: "I caught a mole cricket! I really dug it!",
    blathers: "Be warned, there is nowhere one might hide from the mole cricket. This plump pest has powerful front claws made for digging holes, and oh how it loves to burrow underground! A cousin to the grasshopper, it also has wings and can easily take to the air. And I swear this on my pinfeathers... Some have even been seen walking on water! Oh mercy, I may need a moment. This is making me feel rather woozy..."
  },
  {
    name: "Monarch Butterfly",
    months: [
      "sept",
      "oct",
      "nov"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17
    ],
    start: 4,
    end: 17,
    price: 140,
    location: "flying",
    img: "Monarch_Butterfly",
    detailedImg: "monarch_butterfly",
    slug: "monarch_butterfly",
    rarity: "common",
    phrase: "I caught a monarch butterfly! Guess the butterflies are a democracy now!",
    blathers: "Did you know the monarch butterfly migrates south for the winter and returns north for the summer? Indeed, these horrid orange beasties do not tolerate the cold and travel 3,000 miles to escape the winter. During the journey, they cluster together in trees by the thousands just to stay warm. Imagine! Hordes of the foul flittering fiends huddled together in one place! If only they'd put on tiny coats instead."
  },
  {
    name: "Mosquito",
    months: [
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 17,
    end: 4,
    price: 130,
    location: "flying",
    img: "Mosquito",
    detailedImg: "mosquito",
    slug: "mosquito",
    rarity: "common",
    phrase: "I caught a mosquito! It's itching for a fight!",
    blathers: "As everyone knows, the mosquito is a vampiric pest that sucks blood from innocent bystanders. But did you know that only the females suck blood? Hoo! It's true! They need it to make their eggs. When they sink their snout into our skin, they inject us with a saliva that helps them slurp up their meal. It's that saliva that makes us itch and scratch, you know. Hoo! So rude!"
  },
  {
    name: "Moth",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 19,
    end: 4,
    price: 130,
    location: "flying by light",
    img: "Moth",
    detailedImg: "moth",
    slug: "moth",
    rarity: "common",
    phrase: "I caught a moth! And I had a ball doing it!",
    blathers: "Many think the moth is strictly a nocturnal creature. Alas, no! These frightful fluttering beasts have been known to haunt the daylight and twilight hours too. Thus, there is no time of day one might escape the moth trait I dislike most of all\u2014those feathery antennae! The mere thought of them gives my feathers goosebumps. And I'm no goose."
  },
  {
    name: "Orchid Mantis",
    months: [
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17
    ],
    start: 8,
    end: 17,
    price: 2400,
    location: "white flowers",
    img: "Orchid_Mantis",
    detailedImg: "orchid_mantis",
    slug: "orchid_mantis",
    rarity: "uncommon",
    phrase: "I caught an orchid mantis! Our friendship is blooming!",
    blathers: "The orchid mantis is a bug whose brilliant colors and petal-shaped limbs give it the look of a flower. This masterful mimicry allows it to hide from predators in among the orchids. But oh this fraudulent flower! It lures other insects in to drink its nectar... And makes a meal of them instead! Imagine! To behold a beautiful bud... only to discover it's a bug instead! A repulsive revelation indeed!"
  },
  {
    name: "Paper Kite Butterfly",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17
    ],
    start: 8,
    end: 17,
    price: 1e3,
    location: "flying",
    img: "Paper_Kite_Butterfly",
    detailedImg: "paper_kite_butterfly",
    slug: "paper_kite_butterfly",
    rarity: "common",
    phrase: "I caught a paper kite butterfly! Do I read it, fly it, or spreadit on toast?",
    blathers: "With its black-and-white-striped wing pattern, the paper kite butterfly is both elegant and pretty... PRETTY POISONOUS I MEAN! Hoo dear! Where was I? Oh yes... Even this butterfly's black-and-white-striped larva and little golden pupae are toxic to predators. Indeed, the paper kite butterfly's foul flavor is famous, and thus birds, in particular, steer clear of the fiends. THIS bird most of all!"
  },
  {
    name: "Peacock Butterfly",
    months: [
      "mar",
      "apr",
      "may",
      "jun"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19
    ],
    start: 4,
    end: 19,
    price: 2500,
    location: "flying by hybrid flowers",
    img: "Peacock_Butterfly",
    detailedImg: "peacock_butterfly",
    slug: "peacock_butterfly",
    rarity: "uncommon",
    phrase: "I caught a peacock butterfly! Now it's my turn to strut my stuff!",
    blathers: "Pretty as a peacock? Bah, I say! The wings of the peacock butterfly may have a pattern similar to that of the beautiful bird... But its forewings are also often covered in a dark, velvety hair! You heard right! HAIRY wings! A hair-raising revelation indeed!"
  },
  {
    name: "Pillbug",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 250,
    location: "under rocks",
    img: "Pillbug",
    detailedImg: "pill_bug",
    slug: "pillbug",
    rarity: "common",
    phrase: "I caught a pill bug! That's a tough act to swallow!",
    blathers: "Blech, the pill bug! Children delight at the way these beasts roll into balls when poked... But the appeal is utterly lost on me. One look at their leggy undersides... Hoo! Ewww! How they wriggle! Young pill bugs shed their exo- skeletons as they grow, and in doing so, sprout another pair of legs. As if 12 appendages weren't alarming enough! Yuck, I say. Yuck!"
  },
  {
    name: "Pondskater",
    months: [
      "may",
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19
    ],
    start: 8,
    end: 19,
    price: 130,
    location: "river/pond",
    img: "Pondskater",
    detailedImg: "pondskater",
    slug: "pondskater",
    rarity: "common",
    phrase: "I caught a pondskater! Wonder if it can do a pond ollie...",
    blathers: "Putrid pondskaters! They walk on water, you know...which is most preposterous! It is a trick they perform by secreting oil onto the hairs of their feet. To which I say BLEEECH! And one must wonder... What will they do next? Walk on air? Walk through walls? Perish the thought..."
  },
  {
    name: "Queen Alexandra's Birdwing",
    months: [
      "may",
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17
    ],
    start: 8,
    end: 17,
    price: 4e3,
    location: "flying",
    img: "Queen_Alexandras_Birdwing",
    detailedImg: "queen_alexandras_birdwing",
    slug: "queen_alexandras_birdwing",
    rarity: "rare",
    phrase: "I caught a Queen Alexandra's birdwing! That's a feather in my cap!",
    blathers: "Hoo! The horror! This behemoth butterfly may be called a Queen Alexandra's birdwing... But I call it the Queen of My Nightmares! It is huge! Indeed, the world's hugest. No butterfly can best its foot-long wingspan. The larvae alone grow to more than 4 inches. As if that weren't appalling enough...they're poisonous! Murderous monsters, indeed!"
  },
  {
    name: "Rainbow Stag",
    months: [
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 6e3,
    location: "trees",
    img: "Rainbow_Stag",
    detailedImg: "rainbow_stag",
    slug: "rainbow_stag",
    rarity: "rare",
    phrase: "I caught a rainbow stag! Its rainbow armor is so shiny!",
    blathers: "Rainbows are beautiful things, I'm sure we all agree. But rainbow stag beetles? Bleech! Yes, yes, this beetle's back and belly shine with a pretty rainbow- colored luster. But that does not change the fact this bug has large pincers on its face and loves to pick a fight! If one can wish upon a rainbow, then I wish to stay far away from the rainbow stag. Perhaps I've picked the wrong profession."
  },
  {
    name: "Rajah Brooke's Birdwing",
    months: [
      "jan",
      "feb",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "dec"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17
    ],
    start: 8,
    end: 17,
    price: 2500,
    location: "flying by purple flowers",
    img: "Rajah_Brookes_Birdwing",
    detailedImg: "rajah_brookes_birdwing",
    slug: "rajah_brookes_birdwing",
    rarity: "uncommon",
    phrase: "I caught a Rajah Brooke's birdwing! Nothing else I'd rajah be doing!",
    blathers: "Did you know that the repulsive Rajah Brooke's birdwing loves to luxuriate in hot-springs water? It's true! Hoo! The males gather in groups to sip the moisture while the females hide in jungle trees. And though they dress to impress in red and green, these fluttering fiends are not just stylish... They're also quite malicious! Their little larvae pack a poisonous punch that's supposed to protect them from predators... But I suspect more diabolical designs."
  },
  {
    name: "Red Dragonfly",
    months: [
      "sept",
      "oct"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19
    ],
    start: 8,
    end: 19,
    price: 180,
    location: "flying",
    img: "Red_Dragonfly",
    detailedImg: "red_dragonfly",
    slug: "red_dragonfly",
    rarity: "common",
    phrase: "I caught a red dragonfly! Didn't even have to roll for initiative!",
    blathers: "I won't deny that the wretched red dragonfly is an elegant aeronaut. It manipulates its four wings quite uniquely so it can hover and maneuver through the air with ease. But the veins on its wings! What ghastly things! One can't help but gasp at the sight of them... Appalling aerodynamics, indeed!"
  },
  {
    name: "Rice Grasshopper",
    months: [
      "aug",
      "sept",
      "oct",
      "nov"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19
    ],
    start: 8,
    end: 19,
    price: 160,
    location: "ground",
    img: "Rice_Grasshopper",
    detailedImg: "rice_grasshopper",
    slug: "rice_grasshopper",
    rarity: "common",
    phrase: "I caught a rice grasshopper! I've been looking for agluten-free alternative...",
    blathers: "In point of fact, rice grasshoppers are an awful pest! They devour rice plants and wipe out the crucial crop. But revenge is sweet! These bugs are edible, you see, and so some folks eat them as way to get rid of them. When boiled in soy sauce, rice grasshoppers are quite tasty, it's said. Though why anyone would put an insect in their mouth is beyond me. The mere thought gives me the gags!"
  },
  {
    name: "Robust Cicada",
    months: [
      "jul",
      "aug"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17
    ],
    start: 8,
    end: 17,
    price: 300,
    location: "trees",
    img: "Robust_Cicada",
    detailedImg: "robust_cicada",
    slug: "robust_cicada",
    rarity: "common",
    phrase: "I caught a robust cicada! It DOES seem pretty lively!",
    altPhrase: [
      "I caught a robust cicada! Not so energetic in the rain, huh?"
    ],
    blathers: `The robust cicada got its name from the chirping sound it makes, which is said to be quite...well...robust. But "robust" hardly describes it. Abrasive! Bombastic! Cacophonous! That's more like it! Beside the horrid caterwauling, this bug is known for its long wings, short body, and green coloring. But looking at a robust cicada is just as unpleasant as listening to one. My eyes AND my ears are offended.`
  },
  {
    name: "Rosalia Batesi Beetle",
    months: [
      "may",
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 3e3,
    location: "tree stumps",
    img: "Rosalia_Batesi_Beetle",
    detailedImg: "rosalia_batesi_beetle",
    slug: "rosalia_batesi_beetle",
    rarity: "uncommon",
    phrase: "I caught a rosalia batesi beetle! That's easier to do than say!",
    blathers: "The rosalia batesi beetle is a type of longhorn beetle, so named for the long antenna upon its head. But did you know that longhorn beetles often grow antenna LONGER than their very own bodies, wot wot? As if this weren't odious enough, look closely and you will find these antenna...are covered in tufts of hair! Best not look closely, I say."
  },
  {
    name: "Saw Stag",
    months: [
      "jul",
      "aug"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 2e3,
    location: "trees",
    img: "Saw_Stag",
    detailedImg: "saw_stag",
    slug: "saw_stag",
    rarity: "common",
    phrase: "I caught a saw stag! Now I can't unsee it!",
    blathers: "The saw stag got its name from the shape of its pincers. That is, its pincers look like jagged saws! And I tell you, the bigger the beetle, the more saw-like teeth its giant jaws have. I say the saw stag seems more at home in a horror film than in nature. I have terrified myself just talking about it."
  },
  {
    name: "Scarab Beetle",
    months: [
      "jul",
      "aug"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      23,
      24
    ],
    start: 23,
    end: 8,
    price: 1e4,
    location: "trees",
    img: "Scarab_Beetle",
    detailedImg: "scarab_beetle",
    slug: "scarab_beetle",
    rarity: "rare",
    phrase: "I caught a scarab beetle! It's just a dung beetle with better hobbies.",
    blathers: "Collectors consider the scarab beetle quite the prize, thanks to its shiny metallic shell. But did you know this bug has no nose and uses its antenna to sense smells instead? In fact, the scarab beetle's plated antenna are quite unique and set it apart from other beetles. But ALL antennae are equally awful in my book."
  },
  {
    name: "Scorpion",
    months: [
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      9,
      20,
      21,
      22,
      23,
      24
    ],
    start: 20,
    end: 9,
    price: 8e3,
    location: "ground",
    img: "Scorpion",
    detailedImg: "scorpion",
    slug: "scorpion",
    rarity: "common",
    phrase: "I caught a scorpion! It was a sting operation!",
    blathers: "The scorpion...how should I put this? Those legs! Those pincers! That tail! And that venomous stinger! It's as if someone took all the most awful insect parts...and put them together to make the scorpion! All scorpions are venomous, you know! Though I understand that only a few kinds are truly deadly. I fear I might die just thinking about it."
  },
  {
    name: "Snail",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 250,
    location: "rocks (when raining)",
    img: "Snail",
    detailedImg: "snail",
    slug: "snail",
    rarity: "common",
    phrase: "I caught a snail! It's...not much to brag about.",
    blathers: "Snails are not insects, I'll admit. But they're just as revolting to me. Snails are mollusks, you see, and are born wearing shells they cannot remove. Instead, their shells get bigger and bigger as they grow. Hoo! They must get heavy, don't you know! I suppose that's why they need a trail of mucus to move about. A truly foul form of transportation."
  },
  {
    name: "Spider",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 19,
    end: 8,
    price: 480,
    location: "shaking trees",
    img: "Spider",
    detailedImg: "spider",
    slug: "spider",
    rarity: "common",
    phrase: "I caught a spider! I spied 'er first!",
    blathers: "The spider is renowned for having eight eyes and eight legs... WHICH IS SIX TOO MANY, I SAY! Oh dear. I do apologize. Now where was I? Most spiders are carnivorous. In fact, some will eat creatures several times larger than themselves. To catch their prey, many of these ruthless predators spin sticky webs of surprising strength. Worse yet, they've also been known to ambush their victims, and some even chase down their meals! All this talk about the feeding habits of spiders... I'm feeling quite queasy. Hoot! The horror!"
  },
  {
    name: "Stinkbug",
    months: [
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 120,
    location: "flowers",
    img: "Stinkbug",
    detailedImg: "stinkbug",
    slug: "stinkbug",
    rarity: "common",
    phrase: "I caught a stinkbug! It lives up to its name!",
    blathers: "I daresay the name says it all... Stinkbugs are known for their stench. Hoo! Peeyew! As it happens, these crop-eating pests use straw-like mouths to pierce plants and drink the juices. And when threatened, they use a smelly chemical in their belly to release their odious odor! Hoo! How DO they live with themselves?"
  },
  {
    name: "Tarantula",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 19,
    end: 4,
    price: 8e3,
    location: "ground",
    img: "Tarantula",
    detailedImg: "tarantula",
    slug: "tarantula",
    rarity: "common",
    phrase: "I caught a tarantula! This situation just got hairy!",
    blathers: "As giant spiders go, the tarantula is said to be quite docile. But have you ever seen such foul fuzziness?! It is a fact, tarantulas have barbed belly hair! I say again...BARBED. BELLY. HAIR! These awful arachnids let loose their spiky, itchy hairs to protect themselves from predators. But seeing how tarantulas also prey on frogs, mice, and even birds, one must ask... Who needs protecting from whom?! Hoo! Who indeed!"
  },
  {
    name: "Tiger Beetle",
    months: [
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 1500,
    location: "ground",
    img: "Tiger_Beetle",
    detailedImg: "tiger_beetle",
    slug: "tiger_beetle",
    rarity: "uncommon",
    phrase: "I caught a tiger beetle! I pounced first!",
    blathers: "The tiger beetle is extremely fleet of foot, though it runs in a rather peculiar way. That is, it sprints, then stops, then sprints again...using these speedy maneuvers to run down its prey. You see, the tiger beetle\u2014like a real tiger\u2014is a powerful predator. The mere thought of it giving chase gives me the willies. Tigers are terrifying at any size."
  },
  {
    name: "Tiger Butterfly",
    months: [
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19
    ],
    start: 4,
    end: 19,
    price: 240,
    location: "flying",
    img: "Tiger_Butterfly",
    detailedImg: "tiger_butterfly",
    slug: "tiger_butterfly",
    rarity: "common",
    phrase: "I caught a tiger butterfly! I've earned my stripes!",
    blathers: "Tiger butterflies are known for their majestic wings, which many consider quite beautiful. Truth be told, I find them monstrous! Those strange striped patterns... They give this owl the goose bumps! And while you may imagine young tiger butterfly larvae to look like lovely green caterpillars...it's not so! Why, when tiger butterflies are but babes, they're covered in unsightly white, brown, and black spots. In this way, they camouflage themselves as...as...bird droppings! Putrid pests, indeed!"
  },
  {
    name: "Violin Beetle",
    months: [
      "may",
      "jun",
      "sept",
      "oct",
      "nov"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 450,
    location: "tree stumps",
    img: "Violin_Beetle",
    detailedImg: "violin_beetle",
    slug: "violin_beetle",
    rarity: "common",
    phrase: "I caught a violin beetle! Apparently I'm as fit as a fiddle!",
    blathers: "The violin beetle gets its name from its shape. That is, SOME think it resembles the stringed instrument. If you ask me, this is an insult to violins! With its flat body and small head, the violin beetle looks like nothing but a repulsive bug, plain and simple. In fact it is so repulsive, it oozes a foul liquid when frightened! Ugh! This insect strikes a sour note indeed."
  },
  {
    name: "Walker Cicada",
    months: [
      "aug",
      "sept"
    ],
    times: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17
    ],
    start: 8,
    end: 17,
    price: 400,
    location: "trees",
    img: "Walker_Cicada",
    detailedImg: "walker_cicada",
    slug: "walker_cicada",
    rarity: "common",
    phrase: 'I caught a walker cicada! Pffft... I walk all the time and no one calls me "Walker ..."',
    altPhrase: [
      "I caught a walker cicada! It must hate getting its feet wet."
    ],
    blathers: "The walker cicada is quite the noisy thing. I tell you, this impolite pest simply canNOT abide the quiet. In the heat of summer, the male strikes up a strange rattling song, hoping to woo a mate. When other male cicadas hear this rhythmic racket, they join right in... As if it were a sing-along! My head aches at the thought of it."
  },
  {
    name: "Walking Leaf",
    months: [
      "jul",
      "aug"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 600,
    location: "near trees (furniture leaf)",
    img: "Walking_Leaf",
    detailedImg: "walking_leaf",
    slug: "walking_leaf",
    rarity: "uncommon",
    phrase: "I caught a walking leaf! It seems to be taking it in stride!",
    blathers: "What a fraud! What a phony! The walking leaf is, in fact, the very embodiment of a lie! This master mimic looks like a tree leaf all the way down to the tiniest details. In fact, this bug has been known to sway to and fro as it walks...just so it looks like a leaf blown by the wind! And the fakery works! These insects look so much like leaves that even leaf-eating insects nibble on them! Lying liars, indeed!"
  },
  {
    name: "Walking Stick",
    months: [
      "jul",
      "aug",
      "sept",
      "oct",
      "nov"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      17,
      18,
      19
    ],
    start: [
      4,
      17
    ],
    end: [
      8,
      19
    ],
    price: 600,
    location: "trees",
    img: "Walking_Stick",
    detailedImg: "walking_stick",
    slug: "walking_stick",
    rarity: "uncommon",
    phrase: "I caught a walking stick! Check out its walking schtick! Look, these are the jokes, OK?",
    blathers: "The walking stick looks just like a twig, does it not? Hoo! It even has knots like a real twig would! These bashful bugs mimic plants in this way to hide from predators. A noble goal, you might say. But though the deceptive wretches fool some, they do not fool me! I see these bugs for what they are... Monsters, plain and simple! I say, did you know that walking sticks can grow to two feet long?! Imagine running into one! Surely I would faint."
  },
  {
    name: "Wasp",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    start: 0,
    end: 24,
    price: 2500,
    location: "shaking trees",
    img: "Wasp",
    detailedImg: "wasp",
    slug: "wasp",
    rarity: "common",
    phrase: "I caught a wasp! That's gotta sting...",
    blathers: `Hoo! Allow me to share a fact with you! Wasps are sometimes called "meat bees" because... They. Eat. MEAT! MEAT! Of almost any sort! Surely you've seen what a menace they make of themselves at picnics. 'Tis hardly the worst of it, wot wot! Aggressive predators with venomous stingers, wasps not only hunt and eat other insects... they paralyze their prey, then drag their victims home ALIVE, leaving them for their larva to feed upon. Suddenly a simple sting seems quite tolerable.`
  },
  {
    name: "Wharf Roach",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19
    ],
    start: 4,
    end: 19,
    price: 200,
    location: "beach rocks",
    img: "Wharf_Roach",
    detailedImg: "wharf_roach",
    slug: "wharf_roach",
    rarity: "common",
    phrase: "I caught a wharf roach! This water-loving roach has no pier!",
    blathers: "The wharf roach is an omnivore, which is merely a polite way of saying it will eat almost anything. This skittering scavenger and its uncouth appetite help keep beaches clean, it's said. But I dare say, their long antenna and bulging eyes turn MY stomach. Unappetizing indeed..."
  },
  {
    name: "Yellow Butterfly",
    months: [
      "mar",
      "apr",
      "may",
      "jun",
      "sept",
      "oct"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19
    ],
    price: 160,
    location: "flying",
    img: "Yellow_Butterfly",
    detailedImg: "yellow_butterfly",
    slug: "yellow_butterfly",
    rarity: "common",
    phrase: "I caught a yellow butterfly! Shouldn't all BUTTERflies be yellow?",
    blathers: "Allow me to enlighten you... The yellow butterfly is named for its yellow wings. Need I say more? If I must, then allow me to note that the female yellow butterfly can lay up to 600 eggs at a time! Bleech! And their creepy crawly caterpillars just love to chomp on clover plants. A recipe for disaster, I say. Just imagine reaching for a four-leaf clover, only to touch a larva instead! Yuck! The worst of luck!"
  }
];
var css$3 = {
  code: 'ul.svelte-112l1t3.svelte-112l1t3{padding:1rem;list-style:none;max-width:1200px;margin:1rem auto;display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));grid-gap:1.6rem}a.svelte-112l1t3.svelte-112l1t3{background-color:var(--brown);background-image:url("/play-dots.png");background-size:var(--dot-size);box-shadow:2px 3px 4px rgba(0, 0, 0, 0.25);display:flex;width:100%;border-radius:1rem;align-items:center;font-size:2.2rem;padding:1rem 1.5rem;color:var(--gold);text-decoration:none;font-weight:bold;text-shadow:2px 2px 5px rgba(0, 0, 0, 0.2)}a.svelte-112l1t3 span.svelte-112l1t3{padding-left:1.5rem;display:block}a.svelte-112l1t3 img.svelte-112l1t3{width:64px;height:64px}',
  map: '{"version":3,"file":"CritterList.svelte","sources":["CritterList.svelte"],"sourcesContent":["<script>\\n\\texport let critters;\\n\\texport let dir;\\n<\/script>\\n\\n<ul class=\\"critter-list\\">\\n\\t{#each critters as critter}\\n\\t\\t<li id={critter.slug}>\\n\\t\\t\\t<a href={`${dir}/${critter.slug}`} sveltekit:prefetch>\\n\\t\\t\\t\\t<img src={`/${dir}/${critter.img}.png`} alt={critter.name} height=\\"64\\" width=\\"64\\">\\n\\t\\t\\t\\t<span>{critter.name}</span>\\n\\t\\t\\t</a>\\n\\t\\t</li>\\n\\t{/each}\\n</ul>\\n\\n<style lang=\\"scss\\">ul {\\n  padding: 1rem;\\n  list-style: none;\\n  max-width: 1200px;\\n  margin: 1rem auto;\\n  display: grid;\\n  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));\\n  grid-gap: 1.6rem;\\n}\\n\\na {\\n  background-color: var(--brown);\\n  background-image: url(\\"/play-dots.png\\");\\n  background-size: var(--dot-size);\\n  box-shadow: 2px 3px 4px rgba(0, 0, 0, 0.25);\\n  display: flex;\\n  width: 100%;\\n  border-radius: 1rem;\\n  align-items: center;\\n  font-size: 2.2rem;\\n  padding: 1rem 1.5rem;\\n  color: var(--gold);\\n  text-decoration: none;\\n  font-weight: bold;\\n  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);\\n}\\na span {\\n  padding-left: 1.5rem;\\n  display: block;\\n}\\na img {\\n  width: 64px;\\n  height: 64px;\\n}</style>"],"names":[],"mappings":"AAgBmB,EAAE,8BAAC,CAAC,AACrB,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IAAI,CAChB,SAAS,CAAE,MAAM,CACjB,MAAM,CAAE,IAAI,CAAC,IAAI,CACjB,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,OAAO,SAAS,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,GAAG,CAAC,CAAC,CAC5D,QAAQ,CAAE,MAAM,AAClB,CAAC,AAED,CAAC,8BAAC,CAAC,AACD,gBAAgB,CAAE,IAAI,OAAO,CAAC,CAC9B,gBAAgB,CAAE,IAAI,gBAAgB,CAAC,CACvC,eAAe,CAAE,IAAI,UAAU,CAAC,CAChC,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAC3C,OAAO,CAAE,IAAI,CACb,KAAK,CAAE,IAAI,CACX,aAAa,CAAE,IAAI,CACnB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,MAAM,CACjB,OAAO,CAAE,IAAI,CAAC,MAAM,CACpB,KAAK,CAAE,IAAI,MAAM,CAAC,CAClB,eAAe,CAAE,IAAI,CACrB,WAAW,CAAE,IAAI,CACjB,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,AAC7C,CAAC,AACD,gBAAC,CAAC,IAAI,eAAC,CAAC,AACN,YAAY,CAAE,MAAM,CACpB,OAAO,CAAE,KAAK,AAChB,CAAC,AACD,gBAAC,CAAC,GAAG,eAAC,CAAC,AACL,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,AACd,CAAC"}'
};
var CritterList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { critters } = $$props;
  let { dir } = $$props;
  if ($$props.critters === void 0 && $$bindings.critters && critters !== void 0)
    $$bindings.critters(critters);
  if ($$props.dir === void 0 && $$bindings.dir && dir !== void 0)
    $$bindings.dir(dir);
  $$result.css.add(css$3);
  return `<ul class="${"critter-list svelte-112l1t3"}">${each(critters, (critter) => `<li${add_attribute("id", critter.slug, 0)}><a${add_attribute("href", `${dir}/${critter.slug}`, 0)} sveltekit:prefetch class="${"svelte-112l1t3"}"><img${add_attribute("src", `/${dir}/${critter.img}.png`, 0)}${add_attribute("alt", critter.name, 0)} height="${"64"}" width="${"64"}" class="${"svelte-112l1t3"}">
				<span class="${"svelte-112l1t3"}">${escape(critter.name)}</span></a>
		</li>`)}
</ul>`;
});
var Bugs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Bugs | Critterpoo</title>`, ""}`, ""}


${validate_component(CritterList, "CritterList").$$render($$result, { critters: bugs, dir: "bugs" }, {}, {})}`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Bugs
});
var css$2 = {
  code: "img.svelte-1uxg65d{z-index:-1;position:relative;width:calc(100% - 20px);margin:0 auto;display:block;transform:translate3d(0, var(--translateY, 0), 0) scale(var(--scale, 1))}@media screen and (min-width: 767px){img.svelte-1uxg65d{transform:none}}@media screen and (min-width: 767px){div.svelte-1uxg65d{max-height:calc(100vh - 5rem);display:flex;align-items:center;position:sticky;top:5rem}}",
  map: `{"version":3,"file":"CritterImg.svelte","sources":["CritterImg.svelte"],"sourcesContent":["<script>\\n\\timport {parallaxImg} from '$lib/actions/parallaxImg'\\n\\texport let src, alt;\\n\\n\\t// const imgSrc = async () => {\\n\\t// \\tconst getImg = await import(src);\\n\\t// \\tconsole.log( getImg )\\n\\t// \\treturn 'boob.png'\\n\\t// }\\n\\n<\/script>\\n\\n<div>\\n\\t<picture>\\n\\t\\t<source srcset={\`\${src}?width=600&format=webp\`} type=\\"image/webp\\">\\n\\t\\t<img {src} {alt} use:parallaxImg loading=\\"eager\\" decoding=\\"async\\">\\n\\t</picture>\\n\\t<!-- <img src=\\"/bugs-detailed/brown_cicada.png?width=600&format=webp\\" alt=\\"dsf\\"> -->\\n</div>\\n\\n<style lang=\\"scss\\">img {\\n  z-index: -1;\\n  position: relative;\\n  width: calc(100% - 20px);\\n  margin: 0 auto;\\n  display: block;\\n  transform: translate3d(0, var(--translateY, 0), 0) scale(var(--scale, 1));\\n}\\n@media screen and (min-width: 767px) {\\n  img {\\n    transform: none;\\n  }\\n}\\n\\n@media screen and (min-width: 767px) {\\n  div {\\n    max-height: calc(100vh - 5rem);\\n    display: flex;\\n    align-items: center;\\n    position: sticky;\\n    top: 5rem;\\n  }\\n}</style>"],"names":[],"mappings":"AAoBmB,GAAG,eAAC,CAAC,AACtB,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,CACxB,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,OAAO,CAAE,KAAK,CACd,SAAS,CAAE,YAAY,CAAC,CAAC,CAAC,IAAI,YAAY,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,MAAM,IAAI,OAAO,CAAC,EAAE,CAAC,CAAC,AAC3E,CAAC,AACD,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACpC,GAAG,eAAC,CAAC,AACH,SAAS,CAAE,IAAI,AACjB,CAAC,AACH,CAAC,AAED,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACpC,GAAG,eAAC,CAAC,AACH,UAAU,CAAE,KAAK,KAAK,CAAC,CAAC,CAAC,IAAI,CAAC,CAC9B,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,QAAQ,CAAE,MAAM,CAChB,GAAG,CAAE,IAAI,AACX,CAAC,AACH,CAAC"}`
};
var CritterImg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { src: src2, alt } = $$props;
  if ($$props.src === void 0 && $$bindings.src && src2 !== void 0)
    $$bindings.src(src2);
  if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0)
    $$bindings.alt(alt);
  $$result.css.add(css$2);
  return `<div class="${"svelte-1uxg65d"}"><picture><source${add_attribute("srcset", `${src2}?width=600&format=webp`, 0)} type="${"image/webp"}">
		<img${add_attribute("src", src2, 0)}${add_attribute("alt", alt, 0)} loading="${"eager"}" decoding="${"async"}" class="${"svelte-1uxg65d"}"></picture>
	
</div>`;
});
var css$1 = {
  code: 'main.svelte-16km0i5.svelte-16km0i5{width:100%;background-color:var(--tan);background-image:url("/play-dots.png");background-size:var(--dot-size);border-radius:2rem 2rem 0 0;box-shadow:0 -3px 10px rgba(0, 0, 0, 0.2);z-index:2;position:relative;--bg:var(--lgreen);--color:var(--dgreen)}@media screen and (min-width: 767px){main.svelte-16km0i5.svelte-16km0i5{border-radius:2rem;margin:5rem 0}}main.blue.svelte-16km0i5.svelte-16km0i5{--bg:var(--blue);--color:var(--dblue) }main.purple.svelte-16km0i5.svelte-16km0i5{--bg:var(--purple);--color:var(--dpurple) }main.gold.svelte-16km0i5.svelte-16km0i5{--bg:var(--gold);--color:var(--dgold) }span.label.svelte-16km0i5.svelte-16km0i5{display:inline-block;background:var(--gold);color:var(--dbrown);text-align:center;border-radius:100px;padding:5px 10px;font-size:1.2rem;margin-bottom:5px;box-shadow:2px 2px 10px rgba(0, 0, 0, 0.2);border:solid 1px var(--dbrown)}.icon.svelte-16km0i5.svelte-16km0i5{position:absolute;left:50%;bottom:0;transform:translate(-50%, 50%);width:80px;height:80px;display:flex;justify-content:center;align-items:center;background-color:var(--bg);border-radius:50%;background-image:url("/play-dots.png");background-size:var(--dot-size);z-index:5;box-shadow:0 3px 10px rgba(0, 0, 0, 0.2);border:solid 4px var(--brown);transition:all 600ms}.atTop.svelte-16km0i5>.icon.svelte-16km0i5{transform:translate(-50%, 30%) scale(0.7)}.title-contain.svelte-16km0i5.svelte-16km0i5{position:sticky;top:-17px;z-index:50}h1.svelte-16km0i5.svelte-16km0i5{font-size:3.5rem;color:#fccc1f;padding:3rem 6rem 6.5rem;background:#9a702a;margin:0;text-shadow:2px 2px 5px #72531f;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAElBMVEX8/PxISEgkJCRqamqIiIizs7OpMFnZAAAABnRSTlMXFxcXFxfwQqWiAAAAaUlEQVRIx+2SsQ2AMAwEbwXjDbwBgg0SRmD/VZAiyuBvLZRrLkWq93EyMJ97p7+Pc+5GETbLTURuwnJj/ukiuNgCE1vg+QamgynC6mH1sHr4aw8dwUFOiyvbYnwQPXREDzfVe1DHkud+ACYQGu23NmkEAAAAAElFTkSuQmCC);background-size:36px 34.5px;grid-area:title;display:flex;justify-content:center;align-items:center;border-radius:2rem 2rem 0 0;text-align:center;transition:border-radius 300ms}.atTop.svelte-16km0i5>.name.svelte-16km0i5{box-shadow:0 3px 10px rgba(0, 0, 0, 0.2)}.phrase.svelte-16km0i5.svelte-16km0i5{width:100%;padding:3.5rem 1.6rem 3.5rem;font-size:2.5rem;text-align:center}blockquote.svelte-16km0i5.svelte-16km0i5{font-style:italic;color:var(--dark);font-weight:normal;text-shadow:1px 1px 2px rgba(0, 0, 0, 0.25)}.info-block.svelte-16km0i5.svelte-16km0i5{background-image:url("/play-dots.png");background-size:var(--dot-size);padding:2rem 1rem 2rem;color:var(--light);text-align:center;text-transform:capitalize}.info-block.svelte-16km0i5 p.svelte-16km0i5{font-size:3.2rem;font-weight:bold;text-align:center;text-shadow:1px 1px 0 #77770c}.price.svelte-16km0i5.svelte-16km0i5{background-color:var(--bg)}.price.flick.svelte-16km0i5.svelte-16km0i5{background-color:var(--color)}.location.svelte-16km0i5.svelte-16km0i5{background-color:var(--dbrown)}.size.svelte-16km0i5.svelte-16km0i5{background-color:var(--brown)}.time.svelte-16km0i5>p.svelte-16km0i5{color:var(--dark);text-shadow:1px 1px 2px rgba(0, 0, 0, 0.25)}p.month.svelte-16km0i5.svelte-16km0i5{font-style:italic;border:solid 2px var(--brown);background:transparent;color:var(--dbrown);border-radius:10rem;font-size:1.6em;padding:1rem;opacity:0.5}p.month.active.svelte-16km0i5.svelte-16km0i5{opacity:1;background:var(--gold);color:var(--brown);text-shadow:none}.rarity.svelte-16km0i5.svelte-16km0i5{background-color:var(--brown)}.rarity.common.svelte-16km0i5.svelte-16km0i5{background-color:var(--lgreen)}.rarity.uncommon.svelte-16km0i5.svelte-16km0i5{background-color:var(--blue)}.rarity.rare.svelte-16km0i5.svelte-16km0i5{background-color:var(--purple)}.rarity.ultra-rare.svelte-16km0i5.svelte-16km0i5{background-color:var(--gold)}.rarity.svelte-16km0i5 p.svelte-16km0i5{text-transform:capitalize}.blathers-fact.svelte-16km0i5 blockquote.svelte-16km0i5{font-size:1.6rem;padding:1.5rem;line-height:3.2rem}.btn-container.svelte-16km0i5.svelte-16km0i5{position:fixed;z-index:15;top:2.5rem;left:2rem}.btn-container.svelte-16km0i5 a.svelte-16km0i5{width:50px;height:50px;display:block;background-color:var(--gold);border:none;border-radius:100%;cursor:pointer;box-shadow:2px 3px 0 var(--dbrown);padding:1.5rem}',
  map: `{"version":3,"file":"CritterCard.svelte","sources":["CritterCard.svelte"],"sourcesContent":["<script>\\n\\timport { browser } from '$app/env'\\n\\texport let critter, dir, moneyBracket;\\n\\n\\tlet title;\\n\\tlet titleAtTop = false;\\n\\n\\tfunction handleScroll(e) {\\n\\t\\ttitleAtTop = title.getBoundingClientRect().top <= 10\\n\\t}\\n\\n\\tfunction timeConvert(time) {\\n\\t\\tif(time === 0){\\n\\t\\t\\treturn \`12am\`\\n\\t\\t}else{\\n\\t\\t\\treturn time > 12 ? \`\${time - 12}pm\` : \`\${time}am\`\\n\\t\\t}\\n\\t}\\n\\n\\t$: flickPrice = critter.price * 1.5\\n<\/script>\\n\\n<svelte:window on:scroll={handleScroll} />\\n\\n<main class=\\"{moneyBracket}\\">\\n\\t<section class=\\"title-contain\\" class:atTop={titleAtTop}>\\n\\t\\t<h1 class=\\"name\\" bind:this={title} >{ critter.name }</h1>\\n\\t\\t<div class=\\"icon\\"><img src={\`/\${dir}/\${critter.img}.png\`} alt={critter.name}></div>\\n\\t</section>\\n\\n\\t<div class=\\"grid col-2 gap-none\\">\\n\\t\\t<div class=\\"price info-block\\">\\n\\t\\t\\t<span class=\\"label\\">Price</span>\\n\\t\\t\\t<p>\${ Intl.NumberFormat('en-US').format(critter.price) }</p>\\n\\t\\t</div>\\n\\t\\t<div class=\\"price flick info-block\\">\\n\\t\\t\\t<span class=\\"label\\">{dir === 'bugs' ? 'Flick\\\\'s' : 'CJ\\\\'s'} Price</span>\\n\\t\\t\\t<p>\${ Intl.NumberFormat('en-US').format(flickPrice) }</p>\\n\\t\\t</div>\\n\\t</div>\\n\\n\\t<blockquote class=\\"phrase\\">\\n\\t\\t\\"{ critter.phrase }\\"\\n\\t</blockquote>\\n\\n\\t<div class=\\"grid {dir === 'fish' ? 'col-3' : 'col-1'} gap-none\\">\\n\\t\\t{#if dir === 'fish'}\\n\\t\\t\\t<div class=\\"size info-block\\">\\n\\t\\t\\t\\t<span class=\\"label\\">Size</span>\\n\\t\\t\\t\\t<p>{ critter.size }</p>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t\\n\\t\\t<div class=\\"location info-block {dir === 'fish' ? 'span-2' : ''}\\">\\n\\t\\t\\t<span class=\\"label\\">Location</span>\\n\\t\\t\\t<p>{ critter.location }</p>\\n\\t\\t</div>\\n\\t</div>\\n\\n\\t<div class=\\"info-block time\\">\\n\\t\\t<span class=\\"label\\">Time</span>\\n\\t\\t{#if Array.isArray(critter.start)}\\n\\t\\t\\t{#each critter.start as start, i}\\n\\t\\t\\t\\t<p>{ timeConvert(start) } - { timeConvert(critter.end[i]) }</p>\\n\\t\\t\\t{/each}\\n\\t\\t{:else if critter.start === 0 && critter.end === 24}\\n\\t\\t\\t<p>All Day</p>\\n\\t\\t{:else}\\n\\t\\t\\t<p>{ timeConvert(critter.start) } - { timeConvert(critter.end) }</p>\\n\\t\\t{/if}\\n\\t</div>\\n\\n\\t<div class=\\"info-block months\\">\\n\\t\\t<span class=\\"label\\">Months</span>\\n\\t\\t<div class=\\"grid col-4 gap-1\\">\\n\\t\\t\\t<p class=\\"month\\" class:active={critter.months.includes('jan')}>Jan</p>\\n\\t\\t\\t<p class=\\"month\\" class:active={critter.months.includes('feb')}>Feb</p>\\n\\t\\t\\t<p class=\\"month\\" class:active={critter.months.includes('mar')}>Mar</p>\\n\\t\\t\\t<p class=\\"month\\" class:active={critter.months.includes('apr')}>Apr</p>\\n\\t\\t\\t<p class=\\"month\\" class:active={critter.months.includes('may')}>May</p>\\n\\t\\t\\t<p class=\\"month\\" class:active={critter.months.includes('jun')}>Jun</p>\\n\\t\\t\\t<p class=\\"month\\" class:active={critter.months.includes('jul')}>Jul</p>\\n\\t\\t\\t<p class=\\"month\\" class:active={critter.months.includes('aug')}>Aug</p>\\n\\t\\t\\t<p class=\\"month\\" class:active={critter.months.includes('sept')}>Sept</p>\\n\\t\\t\\t<p class=\\"month\\" class:active={critter.months.includes('oct')}>Oct</p>\\n\\t\\t\\t<p class=\\"month\\" class:active={critter.months.includes('nov')}>Nov</p>\\n\\t\\t\\t<p class=\\"month\\" class:active={critter.months.includes('dec')}>Dec</p>\\n\\t\\t</div>\\n\\t</div>\\n\\n\\t<div class=\\"rarity info-block {critter.rarity}\\">\\n\\t\\t<span class=\\"label\\">Rarity</span>\\n\\t\\t<p>{ critter.rarity }</p>\\n\\t</div>\\n\\n\\t<div class=\\"blathers-fact info-block\\">\\n\\t\\t<blockquote>\\n\\t\\t\\t\\"{ critter.blathers }\\"\\n\\t\\t</blockquote>\\n\\n\\t\\t<img src=\\"/blathers.webp\\" alt=\\"blathers\\" width=\\"180\\" loading=\\"lazy\\">\\n\\t</div>\\n\\n</main>\\n\\n<div class=\\"btn-container\\">\\n\\t<a class=\\"back-btn\\" href={\`/\${dir}#\${critter.slug}\`}>\\n\\t\\t<svg width=\\"100%\\" height=\\"100%\\" viewBox=\\"0 0 44 38\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n\\t\\t\\t<path d=\\"M1.23223 17.2322C0.255922 18.2085 0.255922 19.7915 1.23223 20.7678L17.1421 36.6777C18.1184 37.654 19.7014 37.654 20.6777 36.6777C21.654 35.7014 21.654 34.1184 20.6777 33.1421L6.53553 19L20.6777 4.85786C21.654 3.88155 21.654 2.29864 20.6777 1.32233C19.7014 0.34602 18.1184 0.34602 17.1421 1.32233L1.23223 17.2322ZM44 16.5L3 16.5V21.5L44 21.5V16.5Z\\" fill=\\"var(--brown)\\"/>\\n\\t\\t</svg>\\n\\t</a>\\n</div>\\n\\n<style lang=\\"scss\\">main {\\n  width: 100%;\\n  background-color: var(--tan);\\n  background-image: url(\\"/play-dots.png\\");\\n  background-size: var(--dot-size);\\n  border-radius: 2rem 2rem 0 0;\\n  box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.2);\\n  z-index: 2;\\n  position: relative;\\n  --bg: var(--lgreen);\\n  --color: var(--dgreen);\\n}\\n@media screen and (min-width: 767px) {\\n  main {\\n    border-radius: 2rem;\\n    margin: 5rem 0;\\n  }\\n}\\nmain.blue {\\n  --bg: var(--blue);\\n  --color: var(--dblue) ;\\n}\\nmain.purple {\\n  --bg: var(--purple);\\n  --color: var(--dpurple) ;\\n}\\nmain.gold {\\n  --bg: var(--gold);\\n  --color: var(--dgold) ;\\n}\\n\\nspan.label {\\n  display: inline-block;\\n  background: var(--gold);\\n  color: var(--dbrown);\\n  text-align: center;\\n  border-radius: 100px;\\n  padding: 5px 10px;\\n  font-size: 1.2rem;\\n  margin-bottom: 5px;\\n  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);\\n  border: solid 1px var(--dbrown);\\n}\\n\\n.icon {\\n  position: absolute;\\n  left: 50%;\\n  bottom: 0;\\n  transform: translate(-50%, 50%);\\n  width: 80px;\\n  height: 80px;\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  background-color: var(--bg);\\n  border-radius: 50%;\\n  background-image: url(\\"/play-dots.png\\");\\n  background-size: var(--dot-size);\\n  z-index: 5;\\n  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);\\n  border: solid 4px var(--brown);\\n  transition: all 600ms;\\n}\\n\\n.atTop > .icon {\\n  transform: translate(-50%, 30%) scale(0.7);\\n}\\n\\n.title-contain {\\n  position: sticky;\\n  top: -17px;\\n  z-index: 50;\\n}\\n\\nh1 {\\n  font-size: 3.5rem;\\n  color: #fccc1f;\\n  padding: 3rem 6rem 6.5rem;\\n  background: #9a702a;\\n  margin: 0;\\n  text-shadow: 2px 2px 5px #72531f;\\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAElBMVEX8/PxISEgkJCRqamqIiIizs7OpMFnZAAAABnRSTlMXFxcXFxfwQqWiAAAAaUlEQVRIx+2SsQ2AMAwEbwXjDbwBgg0SRmD/VZAiyuBvLZRrLkWq93EyMJ97p7+Pc+5GETbLTURuwnJj/ukiuNgCE1vg+QamgynC6mH1sHr4aw8dwUFOiyvbYnwQPXREDzfVe1DHkud+ACYQGu23NmkEAAAAAElFTkSuQmCC);\\n  background-size: 36px 34.5px;\\n  grid-area: title;\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  border-radius: 2rem 2rem 0 0;\\n  text-align: center;\\n  transition: border-radius 300ms;\\n}\\n\\n.atTop > .name {\\n  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);\\n}\\n\\n.phrase {\\n  width: 100%;\\n  padding: 3.5rem 1.6rem 3.5rem;\\n  font-size: 2.5rem;\\n  text-align: center;\\n}\\n\\nblockquote {\\n  font-style: italic;\\n  color: var(--dark);\\n  font-weight: normal;\\n  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);\\n}\\n\\n.info-block {\\n  background-image: url(\\"/play-dots.png\\");\\n  background-size: var(--dot-size);\\n  padding: 2rem 1rem 2rem;\\n  color: var(--light);\\n  text-align: center;\\n  text-transform: capitalize;\\n}\\n.info-block p {\\n  font-size: 3.2rem;\\n  font-weight: bold;\\n  text-align: center;\\n  text-shadow: 1px 1px 0 #77770c;\\n}\\n\\n.price {\\n  background-color: var(--bg);\\n}\\n.price.flick {\\n  background-color: var(--color);\\n}\\n\\n.location {\\n  background-color: var(--dbrown);\\n}\\n\\n.size {\\n  background-color: var(--brown);\\n}\\n\\n.time > p {\\n  color: var(--dark);\\n  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);\\n}\\n\\np.month {\\n  font-style: italic;\\n  border: solid 2px var(--brown);\\n  background: transparent;\\n  color: var(--dbrown);\\n  border-radius: 10rem;\\n  font-size: 1.6em;\\n  padding: 1rem;\\n  opacity: 0.5;\\n}\\np.month.active {\\n  opacity: 1;\\n  background: var(--gold);\\n  color: var(--brown);\\n  text-shadow: none;\\n}\\n\\n.rarity {\\n  background-color: var(--brown);\\n}\\n.rarity.common {\\n  background-color: var(--lgreen);\\n}\\n.rarity.uncommon {\\n  background-color: var(--blue);\\n}\\n.rarity.rare {\\n  background-color: var(--purple);\\n}\\n.rarity.ultra-rare {\\n  background-color: var(--gold);\\n}\\n.rarity p {\\n  text-transform: capitalize;\\n}\\n\\n.blathers-fact blockquote {\\n  font-size: 1.6rem;\\n  padding: 1.5rem;\\n  line-height: 3.2rem;\\n}\\n\\n.btn-container {\\n  position: fixed;\\n  z-index: 15;\\n  top: 2.5rem;\\n  left: 2rem;\\n}\\n.btn-container a {\\n  width: 50px;\\n  height: 50px;\\n  display: block;\\n  background-color: var(--gold);\\n  border: none;\\n  border-radius: 100%;\\n  cursor: pointer;\\n  box-shadow: 2px 3px 0 var(--dbrown);\\n  padding: 1.5rem;\\n}</style>"],"names":[],"mappings":"AAiHmB,IAAI,8BAAC,CAAC,AACvB,KAAK,CAAE,IAAI,CACX,gBAAgB,CAAE,IAAI,KAAK,CAAC,CAC5B,gBAAgB,CAAE,IAAI,gBAAgB,CAAC,CACvC,eAAe,CAAE,IAAI,UAAU,CAAC,CAChC,aAAa,CAAE,IAAI,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAC5B,UAAU,CAAE,CAAC,CAAC,IAAI,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAC1C,OAAO,CAAE,CAAC,CACV,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,aAAa,CACnB,OAAO,CAAE,aAAa,AACxB,CAAC,AACD,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACpC,IAAI,8BAAC,CAAC,AACJ,aAAa,CAAE,IAAI,CACnB,MAAM,CAAE,IAAI,CAAC,CAAC,AAChB,CAAC,AACH,CAAC,AACD,IAAI,KAAK,8BAAC,CAAC,AACT,IAAI,CAAE,WAAW,CACjB,OAAO,CAAE,aAAa,AACxB,CAAC,AACD,IAAI,OAAO,8BAAC,CAAC,AACX,IAAI,CAAE,aAAa,CACnB,OAAO,CAAE,eAAe,AAC1B,CAAC,AACD,IAAI,KAAK,8BAAC,CAAC,AACT,IAAI,CAAE,WAAW,CACjB,OAAO,CAAE,aAAa,AACxB,CAAC,AAED,IAAI,MAAM,8BAAC,CAAC,AACV,OAAO,CAAE,YAAY,CACrB,UAAU,CAAE,IAAI,MAAM,CAAC,CACvB,KAAK,CAAE,IAAI,QAAQ,CAAC,CACpB,UAAU,CAAE,MAAM,CAClB,aAAa,CAAE,KAAK,CACpB,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,SAAS,CAAE,MAAM,CACjB,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAC3C,MAAM,CAAE,KAAK,CAAC,GAAG,CAAC,IAAI,QAAQ,CAAC,AACjC,CAAC,AAED,KAAK,8BAAC,CAAC,AACL,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,MAAM,CAAE,CAAC,CACT,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,GAAG,CAAC,CAC/B,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,gBAAgB,CAAE,IAAI,IAAI,CAAC,CAC3B,aAAa,CAAE,GAAG,CAClB,gBAAgB,CAAE,IAAI,gBAAgB,CAAC,CACvC,eAAe,CAAE,IAAI,UAAU,CAAC,CAChC,OAAO,CAAE,CAAC,CACV,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACzC,MAAM,CAAE,KAAK,CAAC,GAAG,CAAC,IAAI,OAAO,CAAC,CAC9B,UAAU,CAAE,GAAG,CAAC,KAAK,AACvB,CAAC,AAED,qBAAM,CAAG,KAAK,eAAC,CAAC,AACd,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,GAAG,CAAC,CAAC,MAAM,GAAG,CAAC,AAC5C,CAAC,AAED,cAAc,8BAAC,CAAC,AACd,QAAQ,CAAE,MAAM,CAChB,GAAG,CAAE,KAAK,CACV,OAAO,CAAE,EAAE,AACb,CAAC,AAED,EAAE,8BAAC,CAAC,AACF,SAAS,CAAE,MAAM,CACjB,KAAK,CAAE,OAAO,CACd,OAAO,CAAE,IAAI,CAAC,IAAI,CAAC,MAAM,CACzB,UAAU,CAAE,OAAO,CACnB,MAAM,CAAE,CAAC,CACT,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,OAAO,CAChC,gBAAgB,CAAE,IAAI,8SAA8S,CAAC,CACrU,eAAe,CAAE,IAAI,CAAC,MAAM,CAC5B,SAAS,CAAE,KAAK,CAChB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,aAAa,CAAE,IAAI,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAC5B,UAAU,CAAE,MAAM,CAClB,UAAU,CAAE,aAAa,CAAC,KAAK,AACjC,CAAC,AAED,qBAAM,CAAG,KAAK,eAAC,CAAC,AACd,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,AAC3C,CAAC,AAED,OAAO,8BAAC,CAAC,AACP,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,MAAM,CAAC,MAAM,CAAC,MAAM,CAC7B,SAAS,CAAE,MAAM,CACjB,UAAU,CAAE,MAAM,AACpB,CAAC,AAED,UAAU,8BAAC,CAAC,AACV,UAAU,CAAE,MAAM,CAClB,KAAK,CAAE,IAAI,MAAM,CAAC,CAClB,WAAW,CAAE,MAAM,CACnB,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAC9C,CAAC,AAED,WAAW,8BAAC,CAAC,AACX,gBAAgB,CAAE,IAAI,gBAAgB,CAAC,CACvC,eAAe,CAAE,IAAI,UAAU,CAAC,CAChC,OAAO,CAAE,IAAI,CAAC,IAAI,CAAC,IAAI,CACvB,KAAK,CAAE,IAAI,OAAO,CAAC,CACnB,UAAU,CAAE,MAAM,CAClB,cAAc,CAAE,UAAU,AAC5B,CAAC,AACD,0BAAW,CAAC,CAAC,eAAC,CAAC,AACb,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,IAAI,CACjB,UAAU,CAAE,MAAM,CAClB,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,OAAO,AAChC,CAAC,AAED,MAAM,8BAAC,CAAC,AACN,gBAAgB,CAAE,IAAI,IAAI,CAAC,AAC7B,CAAC,AACD,MAAM,MAAM,8BAAC,CAAC,AACZ,gBAAgB,CAAE,IAAI,OAAO,CAAC,AAChC,CAAC,AAED,SAAS,8BAAC,CAAC,AACT,gBAAgB,CAAE,IAAI,QAAQ,CAAC,AACjC,CAAC,AAED,KAAK,8BAAC,CAAC,AACL,gBAAgB,CAAE,IAAI,OAAO,CAAC,AAChC,CAAC,AAED,oBAAK,CAAG,CAAC,eAAC,CAAC,AACT,KAAK,CAAE,IAAI,MAAM,CAAC,CAClB,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAC9C,CAAC,AAED,CAAC,MAAM,8BAAC,CAAC,AACP,UAAU,CAAE,MAAM,CAClB,MAAM,CAAE,KAAK,CAAC,GAAG,CAAC,IAAI,OAAO,CAAC,CAC9B,UAAU,CAAE,WAAW,CACvB,KAAK,CAAE,IAAI,QAAQ,CAAC,CACpB,aAAa,CAAE,KAAK,CACpB,SAAS,CAAE,KAAK,CAChB,OAAO,CAAE,IAAI,CACb,OAAO,CAAE,GAAG,AACd,CAAC,AACD,CAAC,MAAM,OAAO,8BAAC,CAAC,AACd,OAAO,CAAE,CAAC,CACV,UAAU,CAAE,IAAI,MAAM,CAAC,CACvB,KAAK,CAAE,IAAI,OAAO,CAAC,CACnB,WAAW,CAAE,IAAI,AACnB,CAAC,AAED,OAAO,8BAAC,CAAC,AACP,gBAAgB,CAAE,IAAI,OAAO,CAAC,AAChC,CAAC,AACD,OAAO,OAAO,8BAAC,CAAC,AACd,gBAAgB,CAAE,IAAI,QAAQ,CAAC,AACjC,CAAC,AACD,OAAO,SAAS,8BAAC,CAAC,AAChB,gBAAgB,CAAE,IAAI,MAAM,CAAC,AAC/B,CAAC,AACD,OAAO,KAAK,8BAAC,CAAC,AACZ,gBAAgB,CAAE,IAAI,QAAQ,CAAC,AACjC,CAAC,AACD,OAAO,WAAW,8BAAC,CAAC,AAClB,gBAAgB,CAAE,IAAI,MAAM,CAAC,AAC/B,CAAC,AACD,sBAAO,CAAC,CAAC,eAAC,CAAC,AACT,cAAc,CAAE,UAAU,AAC5B,CAAC,AAED,6BAAc,CAAC,UAAU,eAAC,CAAC,AACzB,SAAS,CAAE,MAAM,CACjB,OAAO,CAAE,MAAM,CACf,WAAW,CAAE,MAAM,AACrB,CAAC,AAED,cAAc,8BAAC,CAAC,AACd,QAAQ,CAAE,KAAK,CACf,OAAO,CAAE,EAAE,CACX,GAAG,CAAE,MAAM,CACX,IAAI,CAAE,IAAI,AACZ,CAAC,AACD,6BAAc,CAAC,CAAC,eAAC,CAAC,AAChB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,KAAK,CACd,gBAAgB,CAAE,IAAI,MAAM,CAAC,CAC7B,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,IAAI,CACnB,MAAM,CAAE,OAAO,CACf,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,IAAI,QAAQ,CAAC,CACnC,OAAO,CAAE,MAAM,AACjB,CAAC"}`
};
function timeConvert(time) {
  if (time === 0) {
    return `12am`;
  } else {
    return time > 12 ? `${time - 12}pm` : `${time}am`;
  }
}
var CritterCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let flickPrice;
  let { critter, dir, moneyBracket } = $$props;
  let title;
  if ($$props.critter === void 0 && $$bindings.critter && critter !== void 0)
    $$bindings.critter(critter);
  if ($$props.dir === void 0 && $$bindings.dir && dir !== void 0)
    $$bindings.dir(dir);
  if ($$props.moneyBracket === void 0 && $$bindings.moneyBracket && moneyBracket !== void 0)
    $$bindings.moneyBracket(moneyBracket);
  $$result.css.add(css$1);
  flickPrice = critter.price * 1.5;
  return `

<main class="${escape(null_to_empty(moneyBracket)) + " svelte-16km0i5"}"><section class="${["title-contain svelte-16km0i5", ""].join(" ").trim()}"><h1 class="${"name svelte-16km0i5"}"${add_attribute("this", title, 0)}>${escape(critter.name)}</h1>
		<div class="${"icon svelte-16km0i5"}"><img${add_attribute("src", `/${dir}/${critter.img}.png`, 0)}${add_attribute("alt", critter.name, 0)}></div></section>

	<div class="${"grid col-2 gap-none"}"><div class="${"price info-block svelte-16km0i5"}"><span class="${"label svelte-16km0i5"}">Price</span>
			<p class="${"svelte-16km0i5"}">$${escape(Intl.NumberFormat("en-US").format(critter.price))}</p></div>
		<div class="${"price flick info-block svelte-16km0i5"}"><span class="${"label svelte-16km0i5"}">${escape(dir === "bugs" ? "Flick's" : "CJ's")} Price</span>
			<p class="${"svelte-16km0i5"}">$${escape(Intl.NumberFormat("en-US").format(flickPrice))}</p></div></div>

	<blockquote class="${"phrase svelte-16km0i5"}">&quot;${escape(critter.phrase)}&quot;
	</blockquote>

	<div class="${"grid " + escape(dir === "fish" ? "col-3" : "col-1") + " gap-none"}">${dir === "fish" ? `<div class="${"size info-block svelte-16km0i5"}"><span class="${"label svelte-16km0i5"}">Size</span>
				<p class="${"svelte-16km0i5"}">${escape(critter.size)}</p></div>` : ``}
		
		<div class="${"location info-block " + escape(dir === "fish" ? "span-2" : "") + " svelte-16km0i5"}"><span class="${"label svelte-16km0i5"}">Location</span>
			<p class="${"svelte-16km0i5"}">${escape(critter.location)}</p></div></div>

	<div class="${"info-block time svelte-16km0i5"}"><span class="${"label svelte-16km0i5"}">Time</span>
		${Array.isArray(critter.start) ? `${each(critter.start, (start, i) => `<p class="${"svelte-16km0i5"}">${escape(timeConvert(start))} - ${escape(timeConvert(critter.end[i]))}</p>`)}` : `${critter.start === 0 && critter.end === 24 ? `<p class="${"svelte-16km0i5"}">All Day</p>` : `<p class="${"svelte-16km0i5"}">${escape(timeConvert(critter.start))} - ${escape(timeConvert(critter.end))}</p>`}`}</div>

	<div class="${"info-block months svelte-16km0i5"}"><span class="${"label svelte-16km0i5"}">Months</span>
		<div class="${"grid col-4 gap-1"}"><p class="${["month svelte-16km0i5", critter.months.includes("jan") ? "active" : ""].join(" ").trim()}">Jan</p>
			<p class="${["month svelte-16km0i5", critter.months.includes("feb") ? "active" : ""].join(" ").trim()}">Feb</p>
			<p class="${["month svelte-16km0i5", critter.months.includes("mar") ? "active" : ""].join(" ").trim()}">Mar</p>
			<p class="${["month svelte-16km0i5", critter.months.includes("apr") ? "active" : ""].join(" ").trim()}">Apr</p>
			<p class="${["month svelte-16km0i5", critter.months.includes("may") ? "active" : ""].join(" ").trim()}">May</p>
			<p class="${["month svelte-16km0i5", critter.months.includes("jun") ? "active" : ""].join(" ").trim()}">Jun</p>
			<p class="${["month svelte-16km0i5", critter.months.includes("jul") ? "active" : ""].join(" ").trim()}">Jul</p>
			<p class="${["month svelte-16km0i5", critter.months.includes("aug") ? "active" : ""].join(" ").trim()}">Aug</p>
			<p class="${["month svelte-16km0i5", critter.months.includes("sept") ? "active" : ""].join(" ").trim()}">Sept</p>
			<p class="${["month svelte-16km0i5", critter.months.includes("oct") ? "active" : ""].join(" ").trim()}">Oct</p>
			<p class="${["month svelte-16km0i5", critter.months.includes("nov") ? "active" : ""].join(" ").trim()}">Nov</p>
			<p class="${["month svelte-16km0i5", critter.months.includes("dec") ? "active" : ""].join(" ").trim()}">Dec</p></div></div>

	<div class="${"rarity info-block " + escape(critter.rarity) + " svelte-16km0i5"}"><span class="${"label svelte-16km0i5"}">Rarity</span>
		<p class="${"svelte-16km0i5"}">${escape(critter.rarity)}</p></div>

	<div class="${"blathers-fact info-block svelte-16km0i5"}"><blockquote class="${"svelte-16km0i5"}">&quot;${escape(critter.blathers)}&quot;
		</blockquote>

		<img src="${"/blathers.webp"}" alt="${"blathers"}" width="${"180"}" loading="${"lazy"}"></div></main>

<div class="${"btn-container svelte-16km0i5"}"><a class="${"back-btn svelte-16km0i5"}"${add_attribute("href", `/${dir}#${critter.slug}`, 0)}><svg width="${"100%"}" height="${"100%"}" viewBox="${"0 0 44 38"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><path d="${"M1.23223 17.2322C0.255922 18.2085 0.255922 19.7915 1.23223 20.7678L17.1421 36.6777C18.1184 37.654 19.7014 37.654 20.6777 36.6777C21.654 35.7014 21.654 34.1184 20.6777 33.1421L6.53553 19L20.6777 4.85786C21.654 3.88155 21.654 2.29864 20.6777 1.32233C19.7014 0.34602 18.1184 0.34602 17.1421 1.32233L1.23223 17.2322ZM44 16.5L3 16.5V21.5L44 21.5V16.5Z"}" fill="${"var(--brown)"}"></path></svg></a>
</div>`;
});
var css = {
  code: 'div.body-bg.svelte-60v1sj{width:100%;min-height:100vh;background-color:var(--bg, var(--tan));background-image:var(--bgImage, url("/play-dots.png"));background-attachment:fixed}div.body-bg.gold.svelte-60v1sj{--bg:#f1e369;--bgImage:url("/leafs-gold.svg")}div.body-bg.purple.svelte-60v1sj{--bg:var(--purple);--bgImage:url("/leafs-purple.svg")}div.body-bg.blue.svelte-60v1sj{--bg:var(--blue);--bgImage:url("/leafs-blue.svg")}div.body-bg.green.svelte-60v1sj{--bg:var(--lgreen);--bgImage:url("/leafs-green.svg")}div.body-bg.dark.svelte-60v1sj{--bg:var(--dark);--bgImage:url("/play-dots.png")}@media screen and (min-width: 767px){div.body-bg.svelte-60v1sj{--bg:var(--dark)}}div.grid.svelte-60v1sj{max-width:1100px;margin:0 auto;isolation:isolate}@media screen and (min-width: 767px){div.grid.svelte-60v1sj{padding:0rem 2rem;position:relative}}',
  map: `{"version":3,"file":"CritterPage.svelte","sources":["CritterPage.svelte"],"sourcesContent":["<script>\\n\\timport CritterImg from '$lib/components/CritterImg.svelte'\\n\\timport CritterCard from '$lib/components/CritterCard.svelte'\\n\\texport let critter;\\n\\texport let dir;\\n\\n\\n\\tconst findMoneyBracket = () => {\\n\\t\\tif(critter.price >= 10000){\\n\\t\\t\\treturn 'gold';\\n\\t\\t}else if(critter.price >= 5000){\\n\\t\\t\\treturn 'purple';\\n\\t\\t}else if(critter.price >= 1000){\\n\\t\\t\\treturn 'blue';\\n\\t\\t}else{\\n\\t\\t\\treturn 'green';\\n\\t\\t}\\n\\t}\\n\\n\\tlet moneyBracket = findMoneyBracket()\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>{critter.name} | Critterpoo</title>\\n</svelte:head>\\n\\n\\n\\t<div class=\\"body-bg {moneyBracket}\\">\\n\\t\\t<div class=\\"grid col-2-md gap-3-md\\">\\n\\t\\t\\t<CritterImg src={\`/\${dir}-detailed/\${critter.detailedImg}.png\`} alt={critter.name} />\\n\\t\\t\\t<CritterCard {critter} {moneyBracket} {dir} />\\n\\t\\t</div>\\n\\t</div>\\n\\n\\n\\t<style lang=\\"scss\\">div.body-bg {\\n  width: 100%;\\n  min-height: 100vh;\\n  background-color: var(--bg, var(--tan));\\n  background-image: var(--bgImage, url(\\"/play-dots.png\\"));\\n  background-attachment: fixed;\\n}\\ndiv.body-bg.gold {\\n  --bg: #f1e369;\\n  --bgImage: url(\\"/leafs-gold.svg\\");\\n}\\ndiv.body-bg.purple {\\n  --bg: var(--purple);\\n  --bgImage: url(\\"/leafs-purple.svg\\");\\n}\\ndiv.body-bg.blue {\\n  --bg: var(--blue);\\n  --bgImage: url(\\"/leafs-blue.svg\\");\\n}\\ndiv.body-bg.green {\\n  --bg: var(--lgreen);\\n  --bgImage: url(\\"/leafs-green.svg\\");\\n}\\ndiv.body-bg.dark {\\n  --bg: var(--dark);\\n  --bgImage: url(\\"/play-dots.png\\");\\n}\\n@media screen and (min-width: 767px) {\\n  div.body-bg {\\n    --bg: var(--dark);\\n  }\\n}\\n\\ndiv.grid {\\n  max-width: 1100px;\\n  margin: 0 auto;\\n  isolation: isolate;\\n}\\n@media screen and (min-width: 767px) {\\n  div.grid {\\n    padding: 0rem 2rem;\\n    position: relative;\\n  }\\n}</style>"],"names":[],"mappings":"AAmCoB,GAAG,QAAQ,cAAC,CAAC,AAC/B,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,KAAK,CACjB,gBAAgB,CAAE,IAAI,IAAI,CAAC,WAAW,CAAC,CACvC,gBAAgB,CAAE,IAAI,SAAS,CAAC,sBAAsB,CAAC,CACvD,qBAAqB,CAAE,KAAK,AAC9B,CAAC,AACD,GAAG,QAAQ,KAAK,cAAC,CAAC,AAChB,IAAI,CAAE,OAAO,CACb,SAAS,CAAE,sBAAsB,AACnC,CAAC,AACD,GAAG,QAAQ,OAAO,cAAC,CAAC,AAClB,IAAI,CAAE,aAAa,CACnB,SAAS,CAAE,wBAAwB,AACrC,CAAC,AACD,GAAG,QAAQ,KAAK,cAAC,CAAC,AAChB,IAAI,CAAE,WAAW,CACjB,SAAS,CAAE,sBAAsB,AACnC,CAAC,AACD,GAAG,QAAQ,MAAM,cAAC,CAAC,AACjB,IAAI,CAAE,aAAa,CACnB,SAAS,CAAE,uBAAuB,AACpC,CAAC,AACD,GAAG,QAAQ,KAAK,cAAC,CAAC,AAChB,IAAI,CAAE,WAAW,CACjB,SAAS,CAAE,qBAAqB,AAClC,CAAC,AACD,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACpC,GAAG,QAAQ,cAAC,CAAC,AACX,IAAI,CAAE,WAAW,AACnB,CAAC,AACH,CAAC,AAED,GAAG,KAAK,cAAC,CAAC,AACR,SAAS,CAAE,MAAM,CACjB,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,SAAS,CAAE,OAAO,AACpB,CAAC,AACD,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACpC,GAAG,KAAK,cAAC,CAAC,AACR,OAAO,CAAE,IAAI,CAAC,IAAI,CAClB,QAAQ,CAAE,QAAQ,AACpB,CAAC,AACH,CAAC"}`
};
var CritterPage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { critter } = $$props;
  let { dir } = $$props;
  const findMoneyBracket = () => {
    if (critter.price >= 1e4) {
      return "gold";
    } else if (critter.price >= 5e3) {
      return "purple";
    } else if (critter.price >= 1e3) {
      return "blue";
    } else {
      return "green";
    }
  };
  let moneyBracket = findMoneyBracket();
  if ($$props.critter === void 0 && $$bindings.critter && critter !== void 0)
    $$bindings.critter(critter);
  if ($$props.dir === void 0 && $$bindings.dir && dir !== void 0)
    $$bindings.dir(dir);
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>${escape(critter.name)} | Critterpoo</title>`, ""}`, ""}


	<div class="${"body-bg " + escape(moneyBracket) + " svelte-60v1sj"}"><div class="${"grid col-2-md gap-3-md svelte-60v1sj"}">${validate_component(CritterImg, "CritterImg").$$render($$result, {
    src: `/${dir}-detailed/${critter.detailedImg}.png`,
    alt: critter.name
  }, {}, {})}
			${validate_component(CritterCard, "CritterCard").$$render($$result, { critter, moneyBracket, dir }, {}, {})}</div>
	</div>`;
});
function load$1({ page }) {
  const bug = bugs.find((bug2) => bug2.slug === page.params.slug);
  return { props: { critter: bug } };
}
var U5Bslugu5D$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { critter } = $$props;
  if ($$props.critter === void 0 && $$bindings.critter && critter !== void 0)
    $$bindings.critter(critter);
  return `${validate_component(CritterPage, "CritterPage").$$render($$result, { critter, dir: "bugs" }, {}, {})}`;
});
var _slug_$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bslugu5D$1,
  load: load$1
});
var fishies = [
  {
    name: "Anchovy",
    slug: "anchovy",
    detailedImg: "anchovy",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21
    ],
    price: 200,
    location: "ocean",
    size: 2,
    img: "Anchovy"
  },
  {
    name: "Angelfish",
    slug: "angelfish",
    detailedImg: "angelfish",
    months: [
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21
    ],
    price: 3e3,
    location: "river",
    size: 2,
    img: "Angelfish"
  },
  {
    name: "Arapaima",
    slug: "arapaima",
    detailedImg: "arapaima",
    months: [
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21
    ],
    price: 8e3,
    location: "river",
    size: 6,
    img: "Arapaima"
  },
  {
    name: "Arowana",
    slug: "arowana",
    detailedImg: "arowana",
    months: [
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21
    ],
    price: 1e4,
    location: "river",
    size: 4,
    img: "Arowana"
  },
  {
    name: "Barred Knifejaw",
    slug: "barred_knifejaw",
    detailedImg: "barred_knifejaw",
    months: [
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 5e3,
    location: "ocean",
    size: 3,
    img: "Barred_Knifejaw"
  },
  {
    name: "Barreleye",
    slug: "barreleye",
    detailedImg: "barreleye",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      21,
      22,
      23,
      24
    ],
    price: 15e3,
    location: "ocean",
    size: 3,
    img: "Barreleye"
  },
  {
    name: "Betta",
    slug: "betta",
    detailedImg: "betta",
    months: [
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct"
    ],
    times: [
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ],
    price: 2500,
    location: "river",
    size: 2,
    img: "Betta"
  },
  {
    name: "Bitterling",
    slug: "bitterling",
    detailedImg: "bitterling",
    months: [
      "jan",
      "feb",
      "mar",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 900,
    location: "river",
    size: 1,
    img: "Bitterling"
  },
  {
    name: "Black Bass",
    slug: "black_bass",
    detailedImg: "black_bass",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 400,
    location: "river",
    size: 4,
    img: "Black_Bass"
  },
  {
    name: "Blowfish",
    slug: "blowfish",
    detailedImg: "blowfish",
    months: [
      "jan",
      "feb",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      21,
      22,
      23,
      24
    ],
    price: 5e3,
    location: "ocean",
    size: 3,
    img: "Blowfish"
  },
  {
    name: "Blue Marlin",
    slug: "blue_marlin",
    detailedImg: "blue_marlin",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "jul",
      "aug",
      "sept",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 1e4,
    location: "pier",
    size: 6,
    img: "Blue_Marlin"
  },
  {
    name: "Bluegill",
    slug: "bluegill",
    detailedImg: "bluegill",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ],
    price: 180,
    location: "river",
    size: 2,
    img: "Bluegill"
  },
  {
    name: "Butterfly Fish",
    slug: "butterfly_fish",
    detailedImg: "butterfly_fish",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 1e3,
    location: "ocean",
    size: 2,
    img: "Butterfly_Fish"
  },
  {
    name: "Carp",
    slug: "carp",
    detailedImg: "carp",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 300,
    location: "river",
    size: 4,
    img: "Carp"
  },
  {
    name: "Catfish",
    slug: "catfish",
    detailedImg: "catfish",
    months: [
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 800,
    location: "pond",
    size: 4,
    img: "Catfish"
  },
  {
    name: "Char",
    slug: "char",
    detailedImg: "char",
    months: [
      "mar",
      "apr",
      "may",
      "jun",
      "sept",
      "oct",
      "nov"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 3800,
    location: "river",
    size: 3,
    img: "Char"
  },
  {
    name: "Cherry Salmon",
    slug: "cherry_salmon",
    detailedImg: "cherry_salmon",
    months: [
      "mar",
      "apr",
      "may",
      "jun",
      "sept",
      "oct",
      "nov"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 1e3,
    location: "river",
    locationNote: "cliftop",
    size: 3,
    img: "Cherry_Salmon"
  },
  {
    name: "Clownfish",
    slug: "clownfish",
    detailedImg: "clownfish",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 650,
    location: "ocean",
    size: 1,
    img: "Clownfish"
  },
  {
    name: "Coelacanth",
    slug: "coelacanth",
    detailedImg: "coelacanth",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 15e3,
    location: "ocean (rain)",
    locationNote: "rain",
    size: 6,
    img: "Coelacanth"
  },
  {
    name: "Crawfish",
    slug: "crawfish",
    detailedImg: "crawfish",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 200,
    location: "pond",
    size: 2,
    img: "Crawfish"
  },
  {
    name: "Crucian Carp",
    slug: "crucian_carp",
    detailedImg: "crucian_carp",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 160,
    location: "river",
    size: 2,
    img: "Crucian_Carp"
  },
  {
    name: "Dab",
    slug: "dab",
    detailedImg: "dab",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 300,
    location: "ocean",
    size: 3,
    img: "Dab"
  },
  {
    name: "Dace",
    slug: "dace",
    detailedImg: "dace",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 240,
    location: "river",
    size: 3,
    img: "Dace"
  },
  {
    name: "Dorado",
    slug: "dorado",
    detailedImg: "dorado",
    months: [
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21
    ],
    price: 1200,
    location: "river",
    size: 5,
    img: "Dorado"
  },
  {
    name: "Football Fish",
    slug: "football_fish",
    detailedImg: "football_fish",
    months: [
      "jan",
      "feb",
      "mar",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 2500,
    location: "ocean",
    size: 4,
    img: "Football_Fish"
  },
  {
    name: "Freshwater Goby",
    slug: "freshwater_goby",
    detailedImg: "freshwater_goby",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 400,
    location: "river",
    size: 2,
    img: "Freshwater_Goby"
  },
  {
    name: "Frog",
    slug: "frog",
    detailedImg: "frog",
    months: [
      "may",
      "jun",
      "jul",
      "aug"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 120,
    location: "pond",
    size: 2,
    img: "Frog"
  },
  {
    name: "Gar",
    slug: "gar",
    detailedImg: "gar",
    months: [
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 4800,
    location: "pond",
    size: 6,
    img: "Gar"
  },
  {
    name: "Giant Snakehead",
    slug: "giant_snakehead",
    detailedImg: "giant_snakehead",
    months: [
      "jun",
      "jul",
      "aug"
    ],
    times: [
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ],
    price: 5500,
    location: "pond",
    size: 5,
    img: "Giant_Snakehead"
  },
  {
    name: "Giant Trevally",
    slug: "giant_trevally",
    detailedImg: "giant_trevally",
    months: [
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 4500,
    location: "pier",
    size: 5,
    img: "Giant_Trevally"
  },
  {
    name: "Golden Trout",
    slug: "golden_trout",
    detailedImg: "golden_trout",
    months: [
      "mar",
      "apr",
      "may",
      "sept",
      "oct",
      "nov"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 15e3,
    location: "river",
    locationNote: "cliftop",
    size: 3,
    img: "Golden_Trout"
  },
  {
    name: "Goldfish",
    slug: "goldfish",
    detailedImg: "goldfish",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 1300,
    location: "pond",
    size: 1,
    img: "Goldfish"
  },
  {
    name: "Great White Shark",
    slug: "great_white_shark",
    detailedImg: "great_white_shark",
    months: [
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 15e3,
    location: "ocean",
    size: 6,
    img: "Great_White_Shark"
  },
  {
    name: "Guppy",
    slug: "guppy",
    detailedImg: "guppy",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov"
    ],
    times: [
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ],
    price: 1300,
    location: "river",
    size: 1,
    img: "Guppy"
  },
  {
    name: "Hammerhead Shark",
    slug: "hammerhead_shark",
    detailedImg: "hammerhead_shark",
    months: [
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 8e3,
    location: "ocean",
    size: 6,
    img: "Hammerhead_Shark"
  },
  {
    name: "Horse Mackerel",
    slug: "horse_mackerel",
    detailedImg: "horse_mackerel",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 150,
    location: "ocean",
    size: 2,
    img: "Horse_Mackerel"
  },
  {
    name: "Killifish",
    slug: "killifish",
    detailedImg: "killifish",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 200,
    location: "pond",
    size: 1,
    img: "Killifish"
  },
  {
    name: "King Salmon",
    slug: "king_salmon",
    detailedImg: "king_salmon",
    months: [
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 1800,
    location: "river",
    locationNote: "mouth",
    size: 6,
    img: "King_Salmon"
  },
  {
    name: "Koi",
    slug: "koi",
    detailedImg: "koi",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 4e3,
    location: "pond",
    size: 4,
    img: "Koi"
  },
  {
    name: "Loach",
    slug: "loach",
    detailedImg: "loach",
    months: [
      "mar",
      "apr",
      "may"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 400,
    location: "river",
    size: 2,
    img: "Loach"
  },
  {
    name: "Mahi Mahi",
    slug: "mahi_mahi",
    detailedImg: "mahi_mahi",
    months: [
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 6e3,
    location: "Pier",
    size: 5,
    img: "Mahi_Mahi"
  },
  {
    name: "Mitten Crab",
    slug: "mitten_crab",
    detailedImg: "mitten_crab",
    months: [
      "sept",
      "oct",
      "nov"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 2e3,
    location: "river",
    size: 2,
    img: "Mitten_Crab"
  },
  {
    name: "Moray Eel",
    slug: "moray_eel",
    detailedImg: "moray_eel",
    months: [
      "aug",
      "sept",
      "oct"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 2e3,
    location: "ocean",
    size: "narrow",
    img: "Moray_Eel"
  },
  {
    name: "Napoleonfish",
    slug: "napoleonfish",
    detailedImg: "napoleonfish",
    months: [
      "jul",
      "aug"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21
    ],
    price: 1e4,
    location: "ocean",
    size: 6,
    img: "Napoleonfish"
  },
  {
    name: "Neon Tetra",
    slug: "neon_tetra",
    detailedImg: "neon_tetra",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov"
    ],
    times: [
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ],
    price: 500,
    location: "river",
    size: 1,
    img: "Neon_Tetra"
  },
  {
    name: "Nibble Fish",
    slug: "nibble_fish",
    detailedImg: "nibble_fish",
    months: [
      "may",
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ],
    price: 1500,
    location: "river",
    size: 1,
    img: "Nibble_Fish"
  },
  {
    name: "Oarfish",
    slug: "oarfish",
    detailedImg: "oarfish",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 9e3,
    location: "ocean",
    size: 6,
    img: "Oarfish"
  },
  {
    name: "Ocean Sunfish",
    slug: "ocean_sunfish",
    detailedImg: "ocean_sunfish",
    months: [
      "jul",
      "aug",
      "sept"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21
    ],
    price: 4e3,
    location: "ocean",
    size: 6,
    img: "Ocean_Sunfish"
  },
  {
    name: "Olive Flounder",
    slug: "olive_flounder",
    detailedImg: "olive_flounder",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 800,
    location: "ocean",
    size: 5,
    img: "Olive_Flounder"
  },
  {
    name: "Pale Chub",
    slug: "pale_chub",
    detailedImg: "pale_chub",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ],
    price: 200,
    location: "river",
    size: 1,
    img: "Pale_Chub"
  },
  {
    name: "Pike",
    slug: "pike",
    detailedImg: "pike",
    months: [
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 1800,
    location: "river",
    size: 5,
    img: "Pike"
  },
  {
    name: "Piranha",
    slug: "piranha",
    detailedImg: "piranha",
    months: [
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      21,
      22,
      23,
      24
    ],
    price: 2500,
    location: "river",
    size: 2,
    img: "Piranha"
  },
  {
    name: "Pond Smelt",
    slug: "pond_smelt",
    detailedImg: "pond_smelt",
    months: [
      "jan",
      "feb",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 320,
    location: "river",
    size: 2,
    img: "Pond_Smelt"
  },
  {
    name: "Pop-eyed Goldfish",
    slug: "pop_eyed_goldfish",
    detailedImg: "pop_eyed_goldfish",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ],
    price: 1300,
    location: "pond",
    size: 1,
    img: "Popeyed_Goldfish"
  },
  {
    name: "Puffer Fish",
    slug: "puffer_fish",
    detailedImg: "puffer_fish",
    months: [
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 250,
    location: "ocean",
    size: 3,
    img: "Puffer_Fish"
  },
  {
    name: "Rainbowfish",
    slug: "rainbowfish",
    detailedImg: "rainbowfish",
    months: [
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct"
    ],
    times: [
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ],
    price: 800,
    location: "river",
    size: 1,
    img: "Rainbowfish"
  },
  {
    name: "Ranchu Goldfish",
    slug: "ranchu_goldfish",
    detailedImg: "ranchu_goldfish",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ],
    price: 4500,
    location: "pond",
    size: 2,
    img: "Ranchu_Goldfish"
  },
  {
    name: "Ray",
    slug: "ray",
    detailedImg: "ray",
    months: [
      "aug",
      "sept",
      "oct",
      "nov"
    ],
    times: [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21
    ],
    price: 3e3,
    location: "ocean",
    size: 5,
    img: "Ray"
  },
  {
    name: "Red Snapper",
    slug: "red_snapper",
    detailedImg: "red_snapper",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 3e3,
    location: "ocean",
    size: 4,
    img: "Red_Snapper"
  },
  {
    name: "Ribbon Eel",
    slug: "ribbon_eel",
    detailedImg: "ribbon_eel",
    months: [
      "jun",
      "jul",
      "aug",
      "sept",
      "oct"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 600,
    location: "ocean",
    size: "narrow",
    img: "Ribbon_Eel"
  },
  {
    name: "Saddled Bichir",
    slug: "saddled_bichir",
    detailedImg: "saddled_bichir",
    months: [
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      21,
      22,
      23,
      24
    ],
    price: 4e3,
    location: "river",
    size: 4,
    img: "Saddled_Bichir"
  },
  {
    name: "Salmon",
    slug: "salmon",
    detailedImg: "salmon",
    months: [
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 700,
    location: "river",
    locationNote: "mouth",
    size: 4,
    img: "Salmon"
  },
  {
    name: "Saw Shark",
    slug: "saw_shark",
    detailedImg: "saw_shark",
    months: [
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 12e3,
    location: "ocean",
    size: 6,
    img: "Saw_Shark"
  },
  {
    name: "Sea Bass",
    slug: "sea_bass",
    detailedImg: "sea_bass",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 400,
    location: "ocean",
    size: 5,
    img: "Sea_Bass"
  },
  {
    name: "Sea Butterfly",
    slug: "sea_butterfly",
    detailedImg: "sea_butterfly",
    months: [
      "jan",
      "feb",
      "mar",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 1e3,
    location: "ocean",
    size: 1,
    img: "Sea_Butterfly"
  },
  {
    name: "Sea Horse",
    slug: "sea_horse",
    detailedImg: "sea_horse",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 1100,
    location: "ocean",
    size: 1,
    img: "Seahorse"
  },
  {
    name: "Snapping Turtle",
    slug: "snapping_turtle",
    detailedImg: "snapping_turtle",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      21,
      22,
      23,
      24
    ],
    price: 5e3,
    location: "river",
    size: 5,
    img: "Snapping_Turtle"
  },
  {
    name: "Soft-shelled Turtle",
    slug: "soft_shelled_turtle",
    detailedImg: "soft_shelled_turtle",
    months: [
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 3750,
    location: "river",
    size: 4,
    img: "Soft_Shelled_Turtle"
  },
  {
    name: "Squid",
    slug: "squid",
    detailedImg: "squid",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 500,
    location: "ocean",
    size: 3,
    img: "Squid"
  },
  {
    name: "Stringfish",
    slug: "stringfish",
    detailedImg: "stringfish",
    months: [
      "jan",
      "feb",
      "mar",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 15e3,
    location: "river",
    locationNote: "cliftop",
    size: 5,
    img: "Stringfish"
  },
  {
    name: "Sturgeon",
    slug: "sturgeon",
    detailedImg: "sturgeon",
    months: [
      "jan",
      "feb",
      "mar",
      "sept",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 1e4,
    location: "River",
    locationNote: "mouth",
    size: 6,
    img: "Sturgeon"
  },
  {
    name: "Suckerfish",
    slug: "suckerfish",
    detailedImg: "suckerfish",
    months: [
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 1500,
    location: "Ocean",
    size: 4,
    img: "Suckerfish"
  },
  {
    name: "Surgeonfish",
    slug: "surgeonfish",
    detailedImg: "surgeonfish",
    months: [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 1e3,
    location: "ocean",
    size: 2,
    img: "Surgeonfish"
  },
  {
    name: "Sweetfish",
    slug: "sweetfish",
    detailedImg: "sweetfish",
    months: [
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 900,
    location: "river",
    size: 3,
    img: "Sweetfish"
  },
  {
    name: "Tadpole",
    slug: "tadpole",
    detailedImg: "tadpole",
    months: [
      "mar",
      "apr",
      "may",
      "jun",
      "jul"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 100,
    location: "pond",
    size: 1,
    img: "Tadpole"
  },
  {
    name: "Tilapia",
    slug: "tilapia",
    detailedImg: "tilapia",
    months: [
      "jun",
      "jul",
      "aug",
      "sept",
      "oct"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 800,
    location: "river",
    size: 3,
    img: "Tilapia"
  },
  {
    name: "Tuna",
    slug: "tuna",
    detailedImg: "tuna",
    months: [
      "jan",
      "feb",
      "mar",
      "apr",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 7e3,
    location: "pier",
    size: 6,
    img: "Tuna"
  },
  {
    name: "Whale Shark",
    slug: "whale_shark",
    detailedImg: "whale_shark",
    months: [
      "jun",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 13e3,
    location: "ocean",
    size: 6,
    img: "Whale_Shark"
  },
  {
    name: "Yellow Perch",
    slug: "yellow_perch",
    detailedImg: "yellow_perch",
    months: [
      "jan",
      "feb",
      "mar",
      "oct",
      "nov",
      "dec"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 300,
    location: "river",
    size: 3,
    img: "Yellow_Perch"
  },
  {
    name: "Zebra Turkeyfish",
    slug: "zebra_turkeyfish",
    detailedImg: "zebra_turkeyfish",
    months: [
      "apr",
      "may",
      "jul",
      "aug",
      "sept"
    ],
    times: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ],
    price: 500,
    location: "ocean",
    size: 3,
    img: "Zebra_Turkeyfish"
  }
];
var Fish = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Bugs | Critterpoo</title>`, ""}`, ""}


${validate_component(CritterList, "CritterList").$$render($$result, { critters: fishies, dir: "fish" }, {}, {})}`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Fish
});
function load({ page }) {
  const fish = fishies.find((fish2) => fish2.slug === page.params.slug);
  return { props: { critter: fish } };
}
var U5Bslugu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { critter } = $$props;
  if ($$props.critter === void 0 && $$bindings.critter && critter !== void 0)
    $$bindings.critter(critter);
  return `${validate_component(CritterPage, "CritterPage").$$render($$result, { critter, dir: "fish" }, {}, {})}`;
});
var _slug_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bslugu5D,
  load
});

// .svelte-kit/netlify/entry.js
init();
async function handler(event) {
  const { path, httpMethod, headers, rawQuery, body, isBase64Encoded } = event;
  const query = new URLSearchParams(rawQuery);
  const encoding = isBase64Encoded ? "base64" : headers["content-encoding"] || "utf-8";
  const rawBody = typeof body === "string" ? Buffer.from(body, encoding) : body;
  const rendered = await render({
    method: httpMethod,
    headers,
    path,
    query,
    rawBody
  });
  if (rendered) {
    return {
      isBase64Encoded: false,
      statusCode: rendered.status,
      ...splitHeaders(rendered.headers),
      body: rendered.body
    };
  }
  return {
    statusCode: 404,
    body: "Not found"
  };
}
function splitHeaders(headers) {
  const h = {};
  const m = {};
  for (const key in headers) {
    const value = headers[key];
    const target = Array.isArray(value) ? m : h;
    target[key] = value;
  }
  return {
    headers: h,
    multiValueHeaders: m
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
