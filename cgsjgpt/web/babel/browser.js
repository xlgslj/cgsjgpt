
(function (f) { if (typeof exports === "object" && typeof module !== "undefined") { module.exports = f() } else if (typeof define === "function" && define.amd) { define([], f) } else { var g; if (typeof window !== "undefined") { g = window } else if (typeof global !== "undefined") { g = global } else if (typeof self !== "undefined") { g = self } else { g = this } g.babel = f() } })(function () {
    var define, module, exports; return (function e(t, n, r) { function s(o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require == "function" && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = "MODULE_NOT_FOUND", f } var l = n[o] = { exports: {} }; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++)s(r[o]); return s })({
        1: [function (_dereq_, module, exports) {
            var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

            ; (function (exports) {
                'use strict';

                var Arr = (typeof Uint8Array !== 'undefined')
                    ? Uint8Array
                    : Array

                var PLUS = '+'.charCodeAt(0)
                var SLASH = '/'.charCodeAt(0)
                var NUMBER = '0'.charCodeAt(0)
                var LOWER = 'a'.charCodeAt(0)
                var UPPER = 'A'.charCodeAt(0)
                var PLUS_URL_SAFE = '-'.charCodeAt(0)
                var SLASH_URL_SAFE = '_'.charCodeAt(0)

                function decode(elt) {
                    var code = elt.charCodeAt(0)
                    if (code === PLUS ||
                        code === PLUS_URL_SAFE)
                        return 62 // '+'
                    if (code === SLASH ||
                        code === SLASH_URL_SAFE)
                        return 63 // '/'
                    if (code < NUMBER)
                        return -1 //no match
                    if (code < NUMBER + 10)
                        return code - NUMBER + 26 + 26
                    if (code < UPPER + 26)
                        return code - UPPER
                    if (code < LOWER + 26)
                        return code - LOWER + 26
                }

                function b64ToByteArray(b64) {
                    var i, j, l, tmp, placeHolders, arr

                    if (b64.length % 4 > 0) {
                        throw new Error('Invalid string. Length must be a multiple of 4')
                    }

                    // the number of equal signs (place holders)
                    // if there are two placeholders, than the two characters before it
                    // represent one byte
                    // if there is only one, then the three characters before it represent 2 bytes
                    // this is just a cheap hack to not do indexOf twice
                    var len = b64.length
                    placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

                    // base64 is 4/3 + up to two characters of the original data
                    arr = new Arr(b64.length * 3 / 4 - placeHolders)

                    // if there are placeholders, only get up to the last complete 4 chars
                    l = placeHolders > 0 ? b64.length - 4 : b64.length

                    var L = 0

                    function push(v) {
                        arr[L++] = v
                    }

                    for (i = 0, j = 0; i < l; i += 4, j += 3) {
                        tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
                        push((tmp & 0xFF0000) >> 16)
                        push((tmp & 0xFF00) >> 8)
                        push(tmp & 0xFF)
                    }

                    if (placeHolders === 2) {
                        tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
                        push(tmp & 0xFF)
                    } else if (placeHolders === 1) {
                        tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
                        push((tmp >> 8) & 0xFF)
                        push(tmp & 0xFF)
                    }

                    return arr
                }

                function uint8ToBase64(uint8) {
                    var i,
                        extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
                        output = "",
                        temp, length

                    function encode(num) {
                        return lookup.charAt(num)
                    }

                    function tripletToBase64(num) {
                        return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
                    }

                    // go through the array every three bytes, we'll deal with trailing stuff later
                    for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
                        temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
                        output += tripletToBase64(temp)
                    }

                    // pad the end with zeros, but make sure to not forget the extra bytes
                    switch (extraBytes) {
                        case 1:
                            temp = uint8[uint8.length - 1]
                            output += encode(temp >> 2)
                            output += encode((temp << 4) & 0x3F)
                            output += '=='
                            break
                        case 2:
                            temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
                            output += encode(temp >> 10)
                            output += encode((temp >> 4) & 0x3F)
                            output += encode((temp << 2) & 0x3F)
                            output += '='
                            break
                    }

                    return output
                }

                exports.toByteArray = b64ToByteArray
                exports.fromByteArray = uint8ToBase64
            }(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

        }, {}], 2: [function (_dereq_, module, exports) {

        }, {}], 3: [function (_dereq_, module, exports) {
            (function (global) {
                /*!
                 * The buffer module from node.js, for the browser.
                 *
                 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
                 * @license  MIT
                 */
                /* eslint-disable no-proto */

                var base64 = _dereq_(1)
                var ieee754 = _dereq_(4)
                var isArray = _dereq_(6)

                exports.Buffer = Buffer
                exports.SlowBuffer = SlowBuffer
                exports.INSPECT_MAX_BYTES = 50
                Buffer.poolSize = 8192 // not used by this implementation

                var rootParent = {}

                /**
                 * If `Buffer.TYPED_ARRAY_SUPPORT`:
                 *   === true    Use Uint8Array implementation (fastest)
                 *   === false   Use Object implementation (most compatible, even IE6)
                 *
                 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
                 * Opera 11.6+, iOS 4.2+.
                 *
                 * Due to various browser bugs, sometimes the Object implementation will be used even
                 * when the browser supports typed arrays.
                 *
                 * Note:
                 *
                 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
                 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
                 *
                 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
                 *     on objects.
                 *
                 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
                 *
                 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
                 *     incorrect length in some situations.
                
                 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
                 * get the Object implementation, which is slower but behaves correctly.
                 */
                Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
                    ? global.TYPED_ARRAY_SUPPORT
                    : typedArraySupport()

                function typedArraySupport() {
                    function Bar() { }
                    try {
                        var arr = new Uint8Array(1)
                        arr.foo = function () { return 42 }
                        arr.constructor = Bar
                        return arr.foo() === 42 && // typed array instances can be augmented
                            arr.constructor === Bar && // constructor can be set
                            typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
                            arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
                    } catch (e) {
                        return false
                    }
                }

                function kMaxLength() {
                    return Buffer.TYPED_ARRAY_SUPPORT
                        ? 0x7fffffff
                        : 0x3fffffff
                }

                /**
                 * Class: Buffer
                 * =============
                 *
                 * The Buffer constructor returns instances of `Uint8Array` that are augmented
                 * with function properties for all the node `Buffer` API functions. We use
                 * `Uint8Array` so that square bracket notation works as expected -- it returns
                 * a single octet.
                 *
                 * By augmenting the instances, we can avoid modifying the `Uint8Array`
                 * prototype.
                 */
                function Buffer(arg) {
                    if (!(this instanceof Buffer)) {
                        // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
                        if (arguments.length > 1) return new Buffer(arg, arguments[1])
                        return new Buffer(arg)
                    }

                    this.length = 0
                    this.parent = undefined

                    // Common case.
                    if (typeof arg === 'number') {
                        return fromNumber(this, arg)
                    }

                    // Slightly less common case.
                    if (typeof arg === 'string') {
                        return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
                    }

                    // Unusual.
                    return fromObject(this, arg)
                }

                function fromNumber(that, length) {
                    that = allocate(that, length < 0 ? 0 : checked(length) | 0)
                    if (!Buffer.TYPED_ARRAY_SUPPORT) {
                        for (var i = 0; i < length; i++) {
                            that[i] = 0
                        }
                    }
                    return that
                }

                function fromString(that, string, encoding) {
                    if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

                    // Assumption: byteLength() return value is always < kMaxLength.
                    var length = byteLength(string, encoding) | 0
                    that = allocate(that, length)

                    that.write(string, encoding)
                    return that
                }

                function fromObject(that, object) {
                    if (Buffer.isBuffer(object)) return fromBuffer(that, object)

                    if (isArray(object)) return fromArray(that, object)

                    if (object == null) {
                        throw new TypeError('must start with number, buffer, array or string')
                    }

                    if (typeof ArrayBuffer !== 'undefined') {
                        if (object.buffer instanceof ArrayBuffer) {
                            return fromTypedArray(that, object)
                        }
                        if (object instanceof ArrayBuffer) {
                            return fromArrayBuffer(that, object)
                        }
                    }

                    if (object.length) return fromArrayLike(that, object)

                    return fromJsonObject(that, object)
                }

                function fromBuffer(that, buffer) {
                    var length = checked(buffer.length) | 0
                    that = allocate(that, length)
                    buffer.copy(that, 0, 0, length)
                    return that
                }

                function fromArray(that, array) {
                    var length = checked(array.length) | 0
                    that = allocate(that, length)
                    for (var i = 0; i < length; i += 1) {
                        that[i] = array[i] & 255
                    }
                    return that
                }

                // Duplicate of fromArray() to keep fromArray() monomorphic.
                function fromTypedArray(that, array) {
                    var length = checked(array.length) | 0
                    that = allocate(that, length)
                    // Truncating the elements is probably not what people expect from typed
                    // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
                    // of the old Buffer constructor.
                    for (var i = 0; i < length; i += 1) {
                        that[i] = array[i] & 255
                    }
                    return that
                }

                function fromArrayBuffer(that, array) {
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        // Return an augmented `Uint8Array` instance, for best performance
                        array.byteLength
                        that = Buffer._augment(new Uint8Array(array))
                    } else {
                        // Fallback: Return an object instance of the Buffer class
                        that = fromTypedArray(that, new Uint8Array(array))
                    }
                    return that
                }

                function fromArrayLike(that, array) {
                    var length = checked(array.length) | 0
                    that = allocate(that, length)
                    for (var i = 0; i < length; i += 1) {
                        that[i] = array[i] & 255
                    }
                    return that
                }

                // Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
                // Returns a zero-length buffer for inputs that don't conform to the spec.
                function fromJsonObject(that, object) {
                    var array
                    var length = 0

                    if (object.type === 'Buffer' && isArray(object.data)) {
                        array = object.data
                        length = checked(array.length) | 0
                    }
                    that = allocate(that, length)

                    for (var i = 0; i < length; i += 1) {
                        that[i] = array[i] & 255
                    }
                    return that
                }

                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    Buffer.prototype.__proto__ = Uint8Array.prototype
                    Buffer.__proto__ = Uint8Array
                }

                function allocate(that, length) {
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        // Return an augmented `Uint8Array` instance, for best performance
                        that = Buffer._augment(new Uint8Array(length))
                        that.__proto__ = Buffer.prototype
                    } else {
                        // Fallback: Return an object instance of the Buffer class
                        that.length = length
                        that._isBuffer = true
                    }

                    var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
                    if (fromPool) that.parent = rootParent

                    return that
                }

                function checked(length) {
                    // Note: cannot use `length < kMaxLength` here because that fails when
                    // length is NaN (which is otherwise coerced to zero.)
                    if (length >= kMaxLength()) {
                        throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                            'size: 0x' + kMaxLength().toString(16) + ' bytes')
                    }
                    return length | 0
                }

                function SlowBuffer(subject, encoding) {
                    if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

                    var buf = new Buffer(subject, encoding)
                    delete buf.parent
                    return buf
                }

                Buffer.isBuffer = function isBuffer(b) {
                    return !!(b != null && b._isBuffer)
                }

                Buffer.compare = function compare(a, b) {
                    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
                        throw new TypeError('Arguments must be Buffers')
                    }

                    if (a === b) return 0

                    var x = a.length
                    var y = b.length

                    var i = 0
                    var len = Math.min(x, y)
                    while (i < len) {
                        if (a[i] !== b[i]) break

                        ++i
                    }

                    if (i !== len) {
                        x = a[i]
                        y = b[i]
                    }

                    if (x < y) return -1
                    if (y < x) return 1
                    return 0
                }

                Buffer.isEncoding = function isEncoding(encoding) {
                    switch (String(encoding).toLowerCase()) {
                        case 'hex':
                        case 'utf8':
                        case 'utf-8':
                        case 'ascii':
                        case 'binary':
                        case 'base64':
                        case 'raw':
                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                            return true
                        default:
                            return false
                    }
                }

                Buffer.concat = function concat(list, length) {
                    if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

                    if (list.length === 0) {
                        return new Buffer(0)
                    }

                    var i
                    if (length === undefined) {
                        length = 0
                        for (i = 0; i < list.length; i++) {
                            length += list[i].length
                        }
                    }

                    var buf = new Buffer(length)
                    var pos = 0
                    for (i = 0; i < list.length; i++) {
                        var item = list[i]
                        item.copy(buf, pos)
                        pos += item.length
                    }
                    return buf
                }

                function byteLength(string, encoding) {
                    if (typeof string !== 'string') string = '' + string

                    var len = string.length
                    if (len === 0) return 0

                    // Use a for loop to avoid recursion
                    var loweredCase = false
                    for (; ;) {
                        switch (encoding) {
                            case 'ascii':
                            case 'binary':
                            // Deprecated
                            case 'raw':
                            case 'raws':
                                return len
                            case 'utf8':
                            case 'utf-8':
                                return utf8ToBytes(string).length
                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                return len * 2
                            case 'hex':
                                return len >>> 1
                            case 'base64':
                                return base64ToBytes(string).length
                            default:
                                if (loweredCase) return utf8ToBytes(string).length // assume utf8
                                encoding = ('' + encoding).toLowerCase()
                                loweredCase = true
                        }
                    }
                }
                Buffer.byteLength = byteLength

                // pre-set for values that may exist in the future
                Buffer.prototype.length = undefined
                Buffer.prototype.parent = undefined

                function slowToString(encoding, start, end) {
                    var loweredCase = false

                    start = start | 0
                    end = end === undefined || end === Infinity ? this.length : end | 0

                    if (!encoding) encoding = 'utf8'
                    if (start < 0) start = 0
                    if (end > this.length) end = this.length
                    if (end <= start) return ''

                    while (true) {
                        switch (encoding) {
                            case 'hex':
                                return hexSlice(this, start, end)

                            case 'utf8':
                            case 'utf-8':
                                return utf8Slice(this, start, end)

                            case 'ascii':
                                return asciiSlice(this, start, end)

                            case 'binary':
                                return binarySlice(this, start, end)

                            case 'base64':
                                return base64Slice(this, start, end)

                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                return utf16leSlice(this, start, end)

                            default:
                                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                                encoding = (encoding + '').toLowerCase()
                                loweredCase = true
                        }
                    }
                }

                Buffer.prototype.toString = function toString() {
                    var length = this.length | 0
                    if (length === 0) return ''
                    if (arguments.length === 0) return utf8Slice(this, 0, length)
                    return slowToString.apply(this, arguments)
                }

                Buffer.prototype.equals = function equals(b) {
                    if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
                    if (this === b) return true
                    return Buffer.compare(this, b) === 0
                }

                Buffer.prototype.inspect = function inspect() {
                    var str = ''
                    var max = exports.INSPECT_MAX_BYTES
                    if (this.length > 0) {
                        str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
                        if (this.length > max) str += ' ... '
                    }
                    return '<Buffer ' + str + '>'
                }

                Buffer.prototype.compare = function compare(b) {
                    if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
                    if (this === b) return 0
                    return Buffer.compare(this, b)
                }

                Buffer.prototype.indexOf = function indexOf(val, byteOffset) {
                    if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
                    else if (byteOffset < -0x80000000) byteOffset = -0x80000000
                    byteOffset >>= 0

                    if (this.length === 0) return -1
                    if (byteOffset >= this.length) return -1

                    // Negative offsets start from the end of the buffer
                    if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

                    if (typeof val === 'string') {
                        if (val.length === 0) return -1 // special case: looking for empty string always fails
                        return String.prototype.indexOf.call(this, val, byteOffset)
                    }
                    if (Buffer.isBuffer(val)) {
                        return arrayIndexOf(this, val, byteOffset)
                    }
                    if (typeof val === 'number') {
                        if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
                            return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
                        }
                        return arrayIndexOf(this, [val], byteOffset)
                    }

                    function arrayIndexOf(arr, val, byteOffset) {
                        var foundIndex = -1
                        for (var i = 0; byteOffset + i < arr.length; i++) {
                            if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
                                if (foundIndex === -1) foundIndex = i
                                if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
                            } else {
                                foundIndex = -1
                            }
                        }
                        return -1
                    }

                    throw new TypeError('val must be string, number or Buffer')
                }

                // `get` is deprecated
                Buffer.prototype.get = function get(offset) {
                    console.log('.get() is deprecated. Access using array indexes instead.')
                    return this.readUInt8(offset)
                }

                // `set` is deprecated
                Buffer.prototype.set = function set(v, offset) {
                    console.log('.set() is deprecated. Access using array indexes instead.')
                    return this.writeUInt8(v, offset)
                }

                function hexWrite(buf, string, offset, length) {
                    offset = Number(offset) || 0
                    var remaining = buf.length - offset
                    if (!length) {
                        length = remaining
                    } else {
                        length = Number(length)
                        if (length > remaining) {
                            length = remaining
                        }
                    }

                    // must be an even number of digits
                    var strLen = string.length
                    if (strLen % 2 !== 0) throw new Error('Invalid hex string')

                    if (length > strLen / 2) {
                        length = strLen / 2
                    }
                    for (var i = 0; i < length; i++) {
                        var parsed = parseInt(string.substr(i * 2, 2), 16)
                        if (isNaN(parsed)) throw new Error('Invalid hex string')
                        buf[offset + i] = parsed
                    }
                    return i
                }

                function utf8Write(buf, string, offset, length) {
                    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
                }

                function asciiWrite(buf, string, offset, length) {
                    return blitBuffer(asciiToBytes(string), buf, offset, length)
                }

                function binaryWrite(buf, string, offset, length) {
                    return asciiWrite(buf, string, offset, length)
                }

                function base64Write(buf, string, offset, length) {
                    return blitBuffer(base64ToBytes(string), buf, offset, length)
                }

                function ucs2Write(buf, string, offset, length) {
                    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
                }

                Buffer.prototype.write = function write(string, offset, length, encoding) {
                    // Buffer#write(string)
                    if (offset === undefined) {
                        encoding = 'utf8'
                        length = this.length
                        offset = 0
                        // Buffer#write(string, encoding)
                    } else if (length === undefined && typeof offset === 'string') {
                        encoding = offset
                        length = this.length
                        offset = 0
                        // Buffer#write(string, offset[, length][, encoding])
                    } else if (isFinite(offset)) {
                        offset = offset | 0
                        if (isFinite(length)) {
                            length = length | 0
                            if (encoding === undefined) encoding = 'utf8'
                        } else {
                            encoding = length
                            length = undefined
                        }
                        // legacy write(string, encoding, offset, length) - remove in v0.13
                    } else {
                        var swap = encoding
                        encoding = offset
                        offset = length | 0
                        length = swap
                    }

                    var remaining = this.length - offset
                    if (length === undefined || length > remaining) length = remaining

                    if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
                        throw new RangeError('attempt to write outside buffer bounds')
                    }

                    if (!encoding) encoding = 'utf8'

                    var loweredCase = false
                    for (; ;) {
                        switch (encoding) {
                            case 'hex':
                                return hexWrite(this, string, offset, length)

                            case 'utf8':
                            case 'utf-8':
                                return utf8Write(this, string, offset, length)

                            case 'ascii':
                                return asciiWrite(this, string, offset, length)

                            case 'binary':
                                return binaryWrite(this, string, offset, length)

                            case 'base64':
                                // Warning: maxLength not taken into account in base64Write
                                return base64Write(this, string, offset, length)

                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                return ucs2Write(this, string, offset, length)

                            default:
                                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                                encoding = ('' + encoding).toLowerCase()
                                loweredCase = true
                        }
                    }
                }

                Buffer.prototype.toJSON = function toJSON() {
                    return {
                        type: 'Buffer',
                        data: Array.prototype.slice.call(this._arr || this, 0)
                    }
                }

                function base64Slice(buf, start, end) {
                    if (start === 0 && end === buf.length) {
                        return base64.fromByteArray(buf)
                    } else {
                        return base64.fromByteArray(buf.slice(start, end))
                    }
                }

                function utf8Slice(buf, start, end) {
                    end = Math.min(buf.length, end)
                    var res = []

                    var i = start
                    while (i < end) {
                        var firstByte = buf[i]
                        var codePoint = null
                        var bytesPerSequence = (firstByte > 0xEF) ? 4
                            : (firstByte > 0xDF) ? 3
                                : (firstByte > 0xBF) ? 2
                                    : 1

                        if (i + bytesPerSequence <= end) {
                            var secondByte, thirdByte, fourthByte, tempCodePoint

                            switch (bytesPerSequence) {
                                case 1:
                                    if (firstByte < 0x80) {
                                        codePoint = firstByte
                                    }
                                    break
                                case 2:
                                    secondByte = buf[i + 1]
                                    if ((secondByte & 0xC0) === 0x80) {
                                        tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
                                        if (tempCodePoint > 0x7F) {
                                            codePoint = tempCodePoint
                                        }
                                    }
                                    break
                                case 3:
                                    secondByte = buf[i + 1]
                                    thirdByte = buf[i + 2]
                                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                                        tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
                                        if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                                            codePoint = tempCodePoint
                                        }
                                    }
                                    break
                                case 4:
                                    secondByte = buf[i + 1]
                                    thirdByte = buf[i + 2]
                                    fourthByte = buf[i + 3]
                                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                                        tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
                                        if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                                            codePoint = tempCodePoint
                                        }
                                    }
                            }
                        }

                        if (codePoint === null) {
                            // we did not generate a valid codePoint so insert a
                            // replacement char (U+FFFD) and advance only 1 byte
                            codePoint = 0xFFFD
                            bytesPerSequence = 1
                        } else if (codePoint > 0xFFFF) {
                            // encode to utf16 (surrogate pair dance)
                            codePoint -= 0x10000
                            res.push(codePoint >>> 10 & 0x3FF | 0xD800)
                            codePoint = 0xDC00 | codePoint & 0x3FF
                        }

                        res.push(codePoint)
                        i += bytesPerSequence
                    }

                    return decodeCodePointsArray(res)
                }

                // Based on http://stackoverflow.com/a/22747272/680742, the browser with
                // the lowest limit is Chrome, with 0x10000 args.
                // We go 1 magnitude less, for safety
                var MAX_ARGUMENTS_LENGTH = 0x1000

                function decodeCodePointsArray(codePoints) {
                    var len = codePoints.length
                    if (len <= MAX_ARGUMENTS_LENGTH) {
                        return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
                    }

                    // Decode in chunks to avoid "call stack size exceeded".
                    var res = ''
                    var i = 0
                    while (i < len) {
                        res += String.fromCharCode.apply(
                            String,
                            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
                        )
                    }
                    return res
                }

                function asciiSlice(buf, start, end) {
                    var ret = ''
                    end = Math.min(buf.length, end)

                    for (var i = start; i < end; i++) {
                        ret += String.fromCharCode(buf[i] & 0x7F)
                    }
                    return ret
                }

                function binarySlice(buf, start, end) {
                    var ret = ''
                    end = Math.min(buf.length, end)

                    for (var i = start; i < end; i++) {
                        ret += String.fromCharCode(buf[i])
                    }
                    return ret
                }

                function hexSlice(buf, start, end) {
                    var len = buf.length

                    if (!start || start < 0) start = 0
                    if (!end || end < 0 || end > len) end = len

                    var out = ''
                    for (var i = start; i < end; i++) {
                        out += toHex(buf[i])
                    }
                    return out
                }

                function utf16leSlice(buf, start, end) {
                    var bytes = buf.slice(start, end)
                    var res = ''
                    for (var i = 0; i < bytes.length; i += 2) {
                        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
                    }
                    return res
                }

                Buffer.prototype.slice = function slice(start, end) {
                    var len = this.length
                    start = ~~start
                    end = end === undefined ? len : ~~end

                    if (start < 0) {
                        start += len
                        if (start < 0) start = 0
                    } else if (start > len) {
                        start = len
                    }

                    if (end < 0) {
                        end += len
                        if (end < 0) end = 0
                    } else if (end > len) {
                        end = len
                    }

                    if (end < start) end = start

                    var newBuf
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        newBuf = Buffer._augment(this.subarray(start, end))
                    } else {
                        var sliceLen = end - start
                        newBuf = new Buffer(sliceLen, undefined)
                        for (var i = 0; i < sliceLen; i++) {
                            newBuf[i] = this[i + start]
                        }
                    }

                    if (newBuf.length) newBuf.parent = this.parent || this

                    return newBuf
                }

                /*
                 * Need to make sure that buffer isn't trying to write out of bounds.
                 */
                function checkOffset(offset, ext, length) {
                    if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
                    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
                }

                Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
                    offset = offset | 0
                    byteLength = byteLength | 0
                    if (!noAssert) checkOffset(offset, byteLength, this.length)

                    var val = this[offset]
                    var mul = 1
                    var i = 0
                    while (++i < byteLength && (mul *= 0x100)) {
                        val += this[offset + i] * mul
                    }

                    return val
                }

                Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
                    offset = offset | 0
                    byteLength = byteLength | 0
                    if (!noAssert) {
                        checkOffset(offset, byteLength, this.length)
                    }

                    var val = this[offset + --byteLength]
                    var mul = 1
                    while (byteLength > 0 && (mul *= 0x100)) {
                        val += this[offset + --byteLength] * mul
                    }

                    return val
                }

                Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 1, this.length)
                    return this[offset]
                }

                Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 2, this.length)
                    return this[offset] | (this[offset + 1] << 8)
                }

                Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 2, this.length)
                    return (this[offset] << 8) | this[offset + 1]
                }

                Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 4, this.length)

                    return ((this[offset]) |
                        (this[offset + 1] << 8) |
                        (this[offset + 2] << 16)) +
                        (this[offset + 3] * 0x1000000)
                }

                Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 4, this.length)

                    return (this[offset] * 0x1000000) +
                        ((this[offset + 1] << 16) |
                            (this[offset + 2] << 8) |
                            this[offset + 3])
                }

                Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
                    offset = offset | 0
                    byteLength = byteLength | 0
                    if (!noAssert) checkOffset(offset, byteLength, this.length)

                    var val = this[offset]
                    var mul = 1
                    var i = 0
                    while (++i < byteLength && (mul *= 0x100)) {
                        val += this[offset + i] * mul
                    }
                    mul *= 0x80

                    if (val >= mul) val -= Math.pow(2, 8 * byteLength)

                    return val
                }

                Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
                    offset = offset | 0
                    byteLength = byteLength | 0
                    if (!noAssert) checkOffset(offset, byteLength, this.length)

                    var i = byteLength
                    var mul = 1
                    var val = this[offset + --i]
                    while (i > 0 && (mul *= 0x100)) {
                        val += this[offset + --i] * mul
                    }
                    mul *= 0x80

                    if (val >= mul) val -= Math.pow(2, 8 * byteLength)

                    return val
                }

                Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 1, this.length)
                    if (!(this[offset] & 0x80)) return (this[offset])
                    return ((0xff - this[offset] + 1) * -1)
                }

                Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 2, this.length)
                    var val = this[offset] | (this[offset + 1] << 8)
                    return (val & 0x8000) ? val | 0xFFFF0000 : val
                }

                Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 2, this.length)
                    var val = this[offset + 1] | (this[offset] << 8)
                    return (val & 0x8000) ? val | 0xFFFF0000 : val
                }

                Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 4, this.length)

                    return (this[offset]) |
                        (this[offset + 1] << 8) |
                        (this[offset + 2] << 16) |
                        (this[offset + 3] << 24)
                }

                Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 4, this.length)

                    return (this[offset] << 24) |
                        (this[offset + 1] << 16) |
                        (this[offset + 2] << 8) |
                        (this[offset + 3])
                }

                Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 4, this.length)
                    return ieee754.read(this, offset, true, 23, 4)
                }

                Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 4, this.length)
                    return ieee754.read(this, offset, false, 23, 4)
                }

                Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 8, this.length)
                    return ieee754.read(this, offset, true, 52, 8)
                }

                Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
                    if (!noAssert) checkOffset(offset, 8, this.length)
                    return ieee754.read(this, offset, false, 52, 8)
                }

                function checkInt(buf, value, offset, ext, max, min) {
                    if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
                    if (value > max || value < min) throw new RangeError('value is out of bounds')
                    if (offset + ext > buf.length) throw new RangeError('index out of range')
                }

                Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
                    value = +value
                    offset = offset | 0
                    byteLength = byteLength | 0
                    if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

                    var mul = 1
                    var i = 0
                    this[offset] = value & 0xFF
                    while (++i < byteLength && (mul *= 0x100)) {
                        this[offset + i] = (value / mul) & 0xFF
                    }

                    return offset + byteLength
                }

                Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
                    value = +value
                    offset = offset | 0
                    byteLength = byteLength | 0
                    if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

                    var i = byteLength - 1
                    var mul = 1
                    this[offset + i] = value & 0xFF
                    while (--i >= 0 && (mul *= 0x100)) {
                        this[offset + i] = (value / mul) & 0xFF
                    }

                    return offset + byteLength
                }

                Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
                    value = +value
                    offset = offset | 0
                    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
                    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
                    this[offset] = (value & 0xff)
                    return offset + 1
                }

                function objectWriteUInt16(buf, value, offset, littleEndian) {
                    if (value < 0) value = 0xffff + value + 1
                    for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
                        buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
                            (littleEndian ? i : 1 - i) * 8
                    }
                }

                Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
                    value = +value
                    offset = offset | 0
                    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = (value & 0xff)
                        this[offset + 1] = (value >>> 8)
                    } else {
                        objectWriteUInt16(this, value, offset, true)
                    }
                    return offset + 2
                }

                Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
                    value = +value
                    offset = offset | 0
                    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = (value >>> 8)
                        this[offset + 1] = (value & 0xff)
                    } else {
                        objectWriteUInt16(this, value, offset, false)
                    }
                    return offset + 2
                }

                function objectWriteUInt32(buf, value, offset, littleEndian) {
                    if (value < 0) value = 0xffffffff + value + 1
                    for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
                        buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
                    }
                }

                Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
                    value = +value
                    offset = offset | 0
                    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset + 3] = (value >>> 24)
                        this[offset + 2] = (value >>> 16)
                        this[offset + 1] = (value >>> 8)
                        this[offset] = (value & 0xff)
                    } else {
                        objectWriteUInt32(this, value, offset, true)
                    }
                    return offset + 4
                }

                Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
                    value = +value
                    offset = offset | 0
                    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = (value >>> 24)
                        this[offset + 1] = (value >>> 16)
                        this[offset + 2] = (value >>> 8)
                        this[offset + 3] = (value & 0xff)
                    } else {
                        objectWriteUInt32(this, value, offset, false)
                    }
                    return offset + 4
                }

                Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
                    value = +value
                    offset = offset | 0
                    if (!noAssert) {
                        var limit = Math.pow(2, 8 * byteLength - 1)

                        checkInt(this, value, offset, byteLength, limit - 1, -limit)
                    }

                    var i = 0
                    var mul = 1
                    var sub = value < 0 ? 1 : 0
                    this[offset] = value & 0xFF
                    while (++i < byteLength && (mul *= 0x100)) {
                        this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
                    }

                    return offset + byteLength
                }

                Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
                    value = +value
                    offset = offset | 0
                    if (!noAssert) {
                        var limit = Math.pow(2, 8 * byteLength - 1)

                        checkInt(this, value, offset, byteLength, limit - 1, -limit)
                    }

                    var i = byteLength - 1
                    var mul = 1
                    var sub = value < 0 ? 1 : 0
                    this[offset + i] = value & 0xFF
                    while (--i >= 0 && (mul *= 0x100)) {
                        this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
                    }

                    return offset + byteLength
                }

                Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
                    value = +value
                    offset = offset | 0
                    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
                    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
                    if (value < 0) value = 0xff + value + 1
                    this[offset] = (value & 0xff)
                    return offset + 1
                }

                Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
                    value = +value
                    offset = offset | 0
                    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = (value & 0xff)
                        this[offset + 1] = (value >>> 8)
                    } else {
                        objectWriteUInt16(this, value, offset, true)
                    }
                    return offset + 2
                }

                Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
                    value = +value
                    offset = offset | 0
                    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = (value >>> 8)
                        this[offset + 1] = (value & 0xff)
                    } else {
                        objectWriteUInt16(this, value, offset, false)
                    }
                    return offset + 2
                }

                Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
                    value = +value
                    offset = offset | 0
                    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = (value & 0xff)
                        this[offset + 1] = (value >>> 8)
                        this[offset + 2] = (value >>> 16)
                        this[offset + 3] = (value >>> 24)
                    } else {
                        objectWriteUInt32(this, value, offset, true)
                    }
                    return offset + 4
                }

                Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
                    value = +value
                    offset = offset | 0
                    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
                    if (value < 0) value = 0xffffffff + value + 1
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = (value >>> 24)
                        this[offset + 1] = (value >>> 16)
                        this[offset + 2] = (value >>> 8)
                        this[offset + 3] = (value & 0xff)
                    } else {
                        objectWriteUInt32(this, value, offset, false)
                    }
                    return offset + 4
                }

                function checkIEEE754(buf, value, offset, ext, max, min) {
                    if (value > max || value < min) throw new RangeError('value is out of bounds')
                    if (offset + ext > buf.length) throw new RangeError('index out of range')
                    if (offset < 0) throw new RangeError('index out of range')
                }

                function writeFloat(buf, value, offset, littleEndian, noAssert) {
                    if (!noAssert) {
                        checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
                    }
                    ieee754.write(buf, value, offset, littleEndian, 23, 4)
                    return offset + 4
                }

                Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
                    return writeFloat(this, value, offset, true, noAssert)
                }

                Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
                    return writeFloat(this, value, offset, false, noAssert)
                }

                function writeDouble(buf, value, offset, littleEndian, noAssert) {
                    if (!noAssert) {
                        checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
                    }
                    ieee754.write(buf, value, offset, littleEndian, 52, 8)
                    return offset + 8
                }

                Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
                    return writeDouble(this, value, offset, true, noAssert)
                }

                Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
                    return writeDouble(this, value, offset, false, noAssert)
                }

                // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
                Buffer.prototype.copy = function copy(target, targetStart, start, end) {
                    if (!start) start = 0
                    if (!end && end !== 0) end = this.length
                    if (targetStart >= target.length) targetStart = target.length
                    if (!targetStart) targetStart = 0
                    if (end > 0 && end < start) end = start

                    // Copy 0 bytes; we're done
                    if (end === start) return 0
                    if (target.length === 0 || this.length === 0) return 0

                    // Fatal error conditions
                    if (targetStart < 0) {
                        throw new RangeError('targetStart out of bounds')
                    }
                    if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
                    if (end < 0) throw new RangeError('sourceEnd out of bounds')

                    // Are we oob?
                    if (end > this.length) end = this.length
                    if (target.length - targetStart < end - start) {
                        end = target.length - targetStart + start
                    }

                    var len = end - start
                    var i

                    if (this === target && start < targetStart && targetStart < end) {
                        // descending copy from end
                        for (i = len - 1; i >= 0; i--) {
                            target[i + targetStart] = this[i + start]
                        }
                    } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
                        // ascending copy from start
                        for (i = 0; i < len; i++) {
                            target[i + targetStart] = this[i + start]
                        }
                    } else {
                        target._set(this.subarray(start, start + len), targetStart)
                    }

                    return len
                }

                // fill(value, start=0, end=buffer.length)
                Buffer.prototype.fill = function fill(value, start, end) {
                    if (!value) value = 0
                    if (!start) start = 0
                    if (!end) end = this.length

                    if (end < start) throw new RangeError('end < start')

                    // Fill 0 bytes; we're done
                    if (end === start) return
                    if (this.length === 0) return

                    if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
                    if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

                    var i
                    if (typeof value === 'number') {
                        for (i = start; i < end; i++) {
                            this[i] = value
                        }
                    } else {
                        var bytes = utf8ToBytes(value.toString())
                        var len = bytes.length
                        for (i = start; i < end; i++) {
                            this[i] = bytes[i % len]
                        }
                    }

                    return this
                }

                /**
                 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
                 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
                 */
                Buffer.prototype.toArrayBuffer = function toArrayBuffer() {
                    if (typeof Uint8Array !== 'undefined') {
                        if (Buffer.TYPED_ARRAY_SUPPORT) {
                            return (new Buffer(this)).buffer
                        } else {
                            var buf = new Uint8Array(this.length)
                            for (var i = 0, len = buf.length; i < len; i += 1) {
                                buf[i] = this[i]
                            }
                            return buf.buffer
                        }
                    } else {
                        throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
                    }
                }

                // HELPER FUNCTIONS
                // ================

                var BP = Buffer.prototype

                /**
                 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
                 */
                Buffer._augment = function _augment(arr) {
                    arr.constructor = Buffer
                    arr._isBuffer = true

                    // save reference to original Uint8Array set method before overwriting
                    arr._set = arr.set

                    // deprecated
                    arr.get = BP.get
                    arr.set = BP.set

                    arr.write = BP.write
                    arr.toString = BP.toString
                    arr.toLocaleString = BP.toString
                    arr.toJSON = BP.toJSON
                    arr.equals = BP.equals
                    arr.compare = BP.compare
                    arr.indexOf = BP.indexOf
                    arr.copy = BP.copy
                    arr.slice = BP.slice
                    arr.readUIntLE = BP.readUIntLE
                    arr.readUIntBE = BP.readUIntBE
                    arr.readUInt8 = BP.readUInt8
                    arr.readUInt16LE = BP.readUInt16LE
                    arr.readUInt16BE = BP.readUInt16BE
                    arr.readUInt32LE = BP.readUInt32LE
                    arr.readUInt32BE = BP.readUInt32BE
                    arr.readIntLE = BP.readIntLE
                    arr.readIntBE = BP.readIntBE
                    arr.readInt8 = BP.readInt8
                    arr.readInt16LE = BP.readInt16LE
                    arr.readInt16BE = BP.readInt16BE
                    arr.readInt32LE = BP.readInt32LE
                    arr.readInt32BE = BP.readInt32BE
                    arr.readFloatLE = BP.readFloatLE
                    arr.readFloatBE = BP.readFloatBE
                    arr.readDoubleLE = BP.readDoubleLE
                    arr.readDoubleBE = BP.readDoubleBE
                    arr.writeUInt8 = BP.writeUInt8
                    arr.writeUIntLE = BP.writeUIntLE
                    arr.writeUIntBE = BP.writeUIntBE
                    arr.writeUInt16LE = BP.writeUInt16LE
                    arr.writeUInt16BE = BP.writeUInt16BE
                    arr.writeUInt32LE = BP.writeUInt32LE
                    arr.writeUInt32BE = BP.writeUInt32BE
                    arr.writeIntLE = BP.writeIntLE
                    arr.writeIntBE = BP.writeIntBE
                    arr.writeInt8 = BP.writeInt8
                    arr.writeInt16LE = BP.writeInt16LE
                    arr.writeInt16BE = BP.writeInt16BE
                    arr.writeInt32LE = BP.writeInt32LE
                    arr.writeInt32BE = BP.writeInt32BE
                    arr.writeFloatLE = BP.writeFloatLE
                    arr.writeFloatBE = BP.writeFloatBE
                    arr.writeDoubleLE = BP.writeDoubleLE
                    arr.writeDoubleBE = BP.writeDoubleBE
                    arr.fill = BP.fill
                    arr.inspect = BP.inspect
                    arr.toArrayBuffer = BP.toArrayBuffer

                    return arr
                }

                var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

                function base64clean(str) {
                    // Node strips out invalid characters like \n and \t from the string, base64-js does not
                    str = stringtrim(str).replace(INVALID_BASE64_RE, '')
                    // Node converts strings with length < 2 to ''
                    if (str.length < 2) return ''
                    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
                    while (str.length % 4 !== 0) {
                        str = str + '='
                    }
                    return str
                }

                function stringtrim(str) {
                    if (str.trim) return str.trim()
                    return str.replace(/^\s+|\s+$/g, '')
                }

                function toHex(n) {
                    if (n < 16) return '0' + n.toString(16)
                    return n.toString(16)
                }

                function utf8ToBytes(string, units) {
                    units = units || Infinity
                    var codePoint
                    var length = string.length
                    var leadSurrogate = null
                    var bytes = []

                    for (var i = 0; i < length; i++) {
                        codePoint = string.charCodeAt(i)

                        // is surrogate component
                        if (codePoint > 0xD7FF && codePoint < 0xE000) {
                            // last char was a lead
                            if (!leadSurrogate) {
                                // no lead yet
                                if (codePoint > 0xDBFF) {
                                    // unexpected trail
                                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                                    continue
                                } else if (i + 1 === length) {
                                    // unpaired lead
                                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                                    continue
                                }

                                // valid lead
                                leadSurrogate = codePoint

                                continue
                            }

                            // 2 leads in a row
                            if (codePoint < 0xDC00) {
                                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                                leadSurrogate = codePoint
                                continue
                            }

                            // valid surrogate pair
                            codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
                        } else if (leadSurrogate) {
                            // valid bmp char, but last char was a lead
                            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                        }

                        leadSurrogate = null

                        // encode utf8
                        if (codePoint < 0x80) {
                            if ((units -= 1) < 0) break
                            bytes.push(codePoint)
                        } else if (codePoint < 0x800) {
                            if ((units -= 2) < 0) break
                            bytes.push(
                                codePoint >> 0x6 | 0xC0,
                                codePoint & 0x3F | 0x80
                            )
                        } else if (codePoint < 0x10000) {
                            if ((units -= 3) < 0) break
                            bytes.push(
                                codePoint >> 0xC | 0xE0,
                                codePoint >> 0x6 & 0x3F | 0x80,
                                codePoint & 0x3F | 0x80
                            )
                        } else if (codePoint < 0x110000) {
                            if ((units -= 4) < 0) break
                            bytes.push(
                                codePoint >> 0x12 | 0xF0,
                                codePoint >> 0xC & 0x3F | 0x80,
                                codePoint >> 0x6 & 0x3F | 0x80,
                                codePoint & 0x3F | 0x80
                            )
                        } else {
                            throw new Error('Invalid code point')
                        }
                    }

                    return bytes
                }

                function asciiToBytes(str) {
                    var byteArray = []
                    for (var i = 0; i < str.length; i++) {
                        // Node's code seems to be doing this and not & 0x7F..
                        byteArray.push(str.charCodeAt(i) & 0xFF)
                    }
                    return byteArray
                }

                function utf16leToBytes(str, units) {
                    var c, hi, lo
                    var byteArray = []
                    for (var i = 0; i < str.length; i++) {
                        if ((units -= 2) < 0) break

                        c = str.charCodeAt(i)
                        hi = c >> 8
                        lo = c % 256
                        byteArray.push(lo)
                        byteArray.push(hi)
                    }

                    return byteArray
                }

                function base64ToBytes(str) {
                    return base64.toByteArray(base64clean(str))
                }

                function blitBuffer(src, dst, offset, length) {
                    for (var i = 0; i < length; i++) {
                        if ((i + offset >= dst.length) || (i >= src.length)) break
                        dst[i + offset] = src[i]
                    }
                    return i
                }

            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, { "1": 1, "4": 4, "6": 6 }], 4: [function (_dereq_, module, exports) {
            exports.read = function (buffer, offset, isLE, mLen, nBytes) {
                var e, m
                var eLen = nBytes * 8 - mLen - 1
                var eMax = (1 << eLen) - 1
                var eBias = eMax >> 1
                var nBits = -7
                var i = isLE ? (nBytes - 1) : 0
                var d = isLE ? -1 : 1
                var s = buffer[offset + i]

                i += d

                e = s & ((1 << (-nBits)) - 1)
                s >>= (-nBits)
                nBits += eLen
                for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) { }

                m = e & ((1 << (-nBits)) - 1)
                e >>= (-nBits)
                nBits += mLen
                for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) { }

                if (e === 0) {
                    e = 1 - eBias
                } else if (e === eMax) {
                    return m ? NaN : ((s ? -1 : 1) * Infinity)
                } else {
                    m = m + Math.pow(2, mLen)
                    e = e - eBias
                }
                return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
            }

            exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
                var e, m, c
                var eLen = nBytes * 8 - mLen - 1
                var eMax = (1 << eLen) - 1
                var eBias = eMax >> 1
                var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
                var i = isLE ? 0 : (nBytes - 1)
                var d = isLE ? 1 : -1
                var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

                value = Math.abs(value)

                if (isNaN(value) || value === Infinity) {
                    m = isNaN(value) ? 1 : 0
                    e = eMax
                } else {
                    e = Math.floor(Math.log(value) / Math.LN2)
                    if (value * (c = Math.pow(2, -e)) < 1) {
                        e--
                        c *= 2
                    }
                    if (e + eBias >= 1) {
                        value += rt / c
                    } else {
                        value += rt * Math.pow(2, 1 - eBias)
                    }
                    if (value * c >= 2) {
                        e++
                        c /= 2
                    }

                    if (e + eBias >= eMax) {
                        m = 0
                        e = eMax
                    } else if (e + eBias >= 1) {
                        m = (value * c - 1) * Math.pow(2, mLen)
                        e = e + eBias
                    } else {
                        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
                        e = 0
                    }
                }

                for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) { }

                e = (e << mLen) | m
                eLen += mLen
                for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) { }

                buffer[offset + i - d] |= s * 128
            }

        }, {}], 5: [function (_dereq_, module, exports) {
            if (typeof Object.create === 'function') {
                // implementation from standard node.js 'util' module
                module.exports = function inherits(ctor, superCtor) {
                    ctor.super_ = superCtor
                    ctor.prototype = Object.create(superCtor.prototype, {
                        constructor: {
                            value: ctor,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                };
            } else {
                // old school shim for old browsers
                module.exports = function inherits(ctor, superCtor) {
                    ctor.super_ = superCtor
                    var TempCtor = function () { }
                    TempCtor.prototype = superCtor.prototype
                    ctor.prototype = new TempCtor()
                    ctor.prototype.constructor = ctor
                }
            }

        }, {}], 6: [function (_dereq_, module, exports) {

            /**
             * isArray
             */

            var isArray = Array.isArray;

            /**
             * toString
             */

            var str = Object.prototype.toString;

            /**
             * Whether or not the given `val`
             * is an array.
             *
             * example:
             *
             *        isArray([]);
             *        // > true
             *        isArray(arguments);
             *        // > false
             *        isArray('');
             *        // > false
             *
             * @param {mixed} val
             * @return {bool}
             */

            module.exports = isArray || function (val) {
                return !!val && '[object Array]' == str.call(val);
            };

        }, {}], 7: [function (_dereq_, module, exports) {
            (function (process) {
                // Copyright Joyent, Inc. and other Node contributors.
                //
                // Permission is hereby granted, free of charge, to any person obtaining a
                // copy of this software and associated documentation files (the
                // "Software"), to deal in the Software without restriction, including
                // without limitation the rights to use, copy, modify, merge, publish,
                // distribute, sublicense, and/or sell copies of the Software, and to permit
                // persons to whom the Software is furnished to do so, subject to the
                // following conditions:
                //
                // The above copyright notice and this permission notice shall be included
                // in all copies or substantial portions of the Software.
                //
                // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                // USE OR OTHER DEALINGS IN THE SOFTWARE.

                // resolves . and .. elements in a path array with directory names there
                // must be no slashes, empty elements, or device names (c:\) in the array
                // (so also no leading and trailing slashes - it does not distinguish
                // relative and absolute paths)
                function normalizeArray(parts, allowAboveRoot) {
                    // if the path tries to go above the root, `up` ends up > 0
                    var up = 0;
                    for (var i = parts.length - 1; i >= 0; i--) {
                        var last = parts[i];
                        if (last === '.') {
                            parts.splice(i, 1);
                        } else if (last === '..') {
                            parts.splice(i, 1);
                            up++;
                        } else if (up) {
                            parts.splice(i, 1);
                            up--;
                        }
                    }

                    // if the path is allowed to go above the root, restore leading ..s
                    if (allowAboveRoot) {
                        for (; up--; up) {
                            parts.unshift('..');
                        }
                    }

                    return parts;
                }

                // Split a filename into [root, dir, basename, ext], unix version
                // 'root' is just a slash, or nothing.
                var splitPathRe =
                    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                var splitPath = function (filename) {
                    return splitPathRe.exec(filename).slice(1);
                };

                // path.resolve([from ...], to)
                // posix version
                exports.resolve = function () {
                    var resolvedPath = '',
                        resolvedAbsolute = false;

                    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                        var path = (i >= 0) ? arguments[i] : process.cwd();

                        // Skip empty and invalid entries
                        if (typeof path !== 'string') {
                            throw new TypeError('Arguments to path.resolve must be strings');
                        } else if (!path) {
                            continue;
                        }

                        resolvedPath = path + '/' + resolvedPath;
                        resolvedAbsolute = path.charAt(0) === '/';
                    }

                    // At this point the path should be resolved to a full absolute path, but
                    // handle relative paths to be safe (might happen when process.cwd() fails)

                    // Normalize the path
                    resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
                        return !!p;
                    }), !resolvedAbsolute).join('/');

                    return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
                };

                // path.normalize(path)
                // posix version
                exports.normalize = function (path) {
                    var isAbsolute = exports.isAbsolute(path),
                        trailingSlash = substr(path, -1) === '/';

                    // Normalize the path
                    path = normalizeArray(filter(path.split('/'), function (p) {
                        return !!p;
                    }), !isAbsolute).join('/');

                    if (!path && !isAbsolute) {
                        path = '.';
                    }
                    if (path && trailingSlash) {
                        path += '/';
                    }

                    return (isAbsolute ? '/' : '') + path;
                };

                // posix version
                exports.isAbsolute = function (path) {
                    return path.charAt(0) === '/';
                };

                // posix version
                exports.join = function () {
                    var paths = Array.prototype.slice.call(arguments, 0);
                    return exports.normalize(filter(paths, function (p, index) {
                        if (typeof p !== 'string') {
                            throw new TypeError('Arguments to path.join must be strings');
                        }
                        return p;
                    }).join('/'));
                };


                // path.relative(from, to)
                // posix version
                exports.relative = function (from, to) {
                    from = exports.resolve(from).substr(1);
                    to = exports.resolve(to).substr(1);

                    function trim(arr) {
                        var start = 0;
                        for (; start < arr.length; start++) {
                            if (arr[start] !== '') break;
                        }

                        var end = arr.length - 1;
                        for (; end >= 0; end--) {
                            if (arr[end] !== '') break;
                        }

                        if (start > end) return [];
                        return arr.slice(start, end - start + 1);
                    }

                    var fromParts = trim(from.split('/'));
                    var toParts = trim(to.split('/'));

                    var length = Math.min(fromParts.length, toParts.length);
                    var samePartsLength = length;
                    for (var i = 0; i < length; i++) {
                        if (fromParts[i] !== toParts[i]) {
                            samePartsLength = i;
                            break;
                        }
                    }

                    var outputParts = [];
                    for (var i = samePartsLength; i < fromParts.length; i++) {
                        outputParts.push('..');
                    }

                    outputParts = outputParts.concat(toParts.slice(samePartsLength));

                    return outputParts.join('/');
                };

                exports.sep = '/';
                exports.delimiter = ':';

                exports.dirname = function (path) {
                    var result = splitPath(path),
                        root = result[0],
                        dir = result[1];

                    if (!root && !dir) {
                        // No dirname whatsoever
                        return '.';
                    }

                    if (dir) {
                        // It has a dirname, strip trailing slash
                        dir = dir.substr(0, dir.length - 1);
                    }

                    return root + dir;
                };


                exports.basename = function (path, ext) {
                    var f = splitPath(path)[2];
                    // TODO: make this comparison case-insensitive on windows?
                    if (ext && f.substr(-1 * ext.length) === ext) {
                        f = f.substr(0, f.length - ext.length);
                    }
                    return f;
                };


                exports.extname = function (path) {
                    return splitPath(path)[3];
                };

                function filter(xs, f) {
                    if (xs.filter) return xs.filter(f);
                    var res = [];
                    for (var i = 0; i < xs.length; i++) {
                        if (f(xs[i], i, xs)) res.push(xs[i]);
                    }
                    return res;
                }

                // String.prototype.substr - negative index don't work in IE8
                var substr = 'ab'.substr(-1) === 'b'
                    ? function (str, start, len) { return str.substr(start, len) }
                    : function (str, start, len) {
                        if (start < 0) start = str.length + start;
                        return str.substr(start, len);
                    }
                    ;

            }).call(this, _dereq_(8))
        }, { "8": 8 }], 8: [function (_dereq_, module, exports) {
            // shim for using process in browser

            var process = module.exports = {};
            var queue = [];
            var draining = false;
            var currentQueue;
            var queueIndex = -1;

            function cleanUpNextTick() {
                draining = false;
                if (currentQueue.length) {
                    queue = currentQueue.concat(queue);
                } else {
                    queueIndex = -1;
                }
                if (queue.length) {
                    drainQueue();
                }
            }

            function drainQueue() {
                if (draining) {
                    return;
                }
                var timeout = setTimeout(cleanUpNextTick);
                draining = true;

                var len = queue.length;
                while (len) {
                    currentQueue = queue;
                    queue = [];
                    while (++queueIndex < len) {
                        if (currentQueue) {
                            currentQueue[queueIndex].run();
                        }
                    }
                    queueIndex = -1;
                    len = queue.length;
                }
                currentQueue = null;
                draining = false;
                clearTimeout(timeout);
            }

            process.nextTick = function (fun) {
                var args = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for (var i = 1; i < arguments.length; i++) {
                        args[i - 1] = arguments[i];
                    }
                }
                queue.push(new Item(fun, args));
                if (queue.length === 1 && !draining) {
                    setTimeout(drainQueue, 0);
                }
            };

            // v8 likes predictible objects
            function Item(fun, array) {
                this.fun = fun;
                this.array = array;
            }
            Item.prototype.run = function () {
                this.fun.apply(null, this.array);
            };
            process.title = 'browser';
            process.browser = true;
            process.env = {};
            process.argv = [];
            process.version = ''; // empty string to avoid regexp issues
            process.versions = {};

            function noop() { }

            process.on = noop;
            process.addListener = noop;
            process.once = noop;
            process.off = noop;
            process.removeListener = noop;
            process.removeAllListeners = noop;
            process.emit = noop;

            process.binding = function (name) {
                throw new Error('process.binding is not supported');
            };

            process.cwd = function () { return '/' };
            process.chdir = function (dir) {
                throw new Error('process.chdir is not supported');
            };
            process.umask = function () { return 0; };

        }, {}], 9: [function (_dereq_, module, exports) {
            exports.isatty = function () { return false; };

            function ReadStream() {
                throw new Error('tty.ReadStream is not implemented');
            }
            exports.ReadStream = ReadStream;

            function WriteStream() {
                throw new Error('tty.ReadStream is not implemented');
            }
            exports.WriteStream = WriteStream;

        }, {}], 10: [function (_dereq_, module, exports) {
            module.exports = function isBuffer(arg) {
                return arg && typeof arg === 'object'
                    && typeof arg.copy === 'function'
                    && typeof arg.fill === 'function'
                    && typeof arg.readUInt8 === 'function';
            }
        }, {}], 11: [function (_dereq_, module, exports) {
            (function (process, global) {
                // Copyright Joyent, Inc. and other Node contributors.
                //
                // Permission is hereby granted, free of charge, to any person obtaining a
                // copy of this software and associated documentation files (the
                // "Software"), to deal in the Software without restriction, including
                // without limitation the rights to use, copy, modify, merge, publish,
                // distribute, sublicense, and/or sell copies of the Software, and to permit
                // persons to whom the Software is furnished to do so, subject to the
                // following conditions:
                //
                // The above copyright notice and this permission notice shall be included
                // in all copies or substantial portions of the Software.
                //
                // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                // USE OR OTHER DEALINGS IN THE SOFTWARE.

                var formatRegExp = /%[sdj%]/g;
                exports.format = function (f) {
                    if (!isString(f)) {
                        var objects = [];
                        for (var i = 0; i < arguments.length; i++) {
                            objects.push(inspect(arguments[i]));
                        }
                        return objects.join(' ');
                    }

                    var i = 1;
                    var args = arguments;
                    var len = args.length;
                    var str = String(f).replace(formatRegExp, function (x) {
                        if (x === '%%') return '%';
                        if (i >= len) return x;
                        switch (x) {
                            case '%s': return String(args[i++]);
                            case '%d': return Number(args[i++]);
                            case '%j':
                                try {
                                    return JSON.stringify(args[i++]);
                                } catch (_) {
                                    return '[Circular]';
                                }
                            default:
                                return x;
                        }
                    });
                    for (var x = args[i]; i < len; x = args[++i]) {
                        if (isNull(x) || !isObject(x)) {
                            str += ' ' + x;
                        } else {
                            str += ' ' + inspect(x);
                        }
                    }
                    return str;
                };


                // Mark that a method should not be used.
                // Returns a modified function which warns once by default.
                // If --no-deprecation is set, then it is a no-op.
                exports.deprecate = function (fn, msg) {
                    // Allow for deprecating things in the process of starting up.
                    if (isUndefined(global.process)) {
                        return function () {
                            return exports.deprecate(fn, msg).apply(this, arguments);
                        };
                    }

                    if (process.noDeprecation === true) {
                        return fn;
                    }

                    var warned = false;
                    function deprecated() {
                        if (!warned) {
                            if (process.throwDeprecation) {
                                throw new Error(msg);
                            } else if (process.traceDeprecation) {
                                console.trace(msg);
                            } else {
                                console.error(msg);
                            }
                            warned = true;
                        }
                        return fn.apply(this, arguments);
                    }

                    return deprecated;
                };


                var debugs = {};
                var debugEnviron;
                exports.debuglog = function (set) {
                    if (isUndefined(debugEnviron))
                        debugEnviron = process.env.NODE_DEBUG || '';
                    set = set.toUpperCase();
                    if (!debugs[set]) {
                        if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
                            var pid = process.pid;
                            debugs[set] = function () {
                                var msg = exports.format.apply(exports, arguments);
                                console.error('%s %d: %s', set, pid, msg);
                            };
                        } else {
                            debugs[set] = function () { };
                        }
                    }
                    return debugs[set];
                };


                /**
                 * Echos the value of a value. Trys to print the value out
                 * in the best way possible given the different types.
                 *
                 * @param {Object} obj The object to print out.
                 * @param {Object} opts Optional options object that alters the output.
                 */
                /* legacy: obj, showHidden, depth, colors*/
                function inspect(obj, opts) {
                    // default options
                    var ctx = {
                        seen: [],
                        stylize: stylizeNoColor
                    };
                    // legacy...
                    if (arguments.length >= 3) ctx.depth = arguments[2];
                    if (arguments.length >= 4) ctx.colors = arguments[3];
                    if (isBoolean(opts)) {
                        // legacy...
                        ctx.showHidden = opts;
                    } else if (opts) {
                        // got an "options" object
                        exports._extend(ctx, opts);
                    }
                    // set default options
                    if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
                    if (isUndefined(ctx.depth)) ctx.depth = 2;
                    if (isUndefined(ctx.colors)) ctx.colors = false;
                    if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
                    if (ctx.colors) ctx.stylize = stylizeWithColor;
                    return formatValue(ctx, obj, ctx.depth);
                }
                exports.inspect = inspect;


                // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
                inspect.colors = {
                    'bold': [1, 22],
                    'italic': [3, 23],
                    'underline': [4, 24],
                    'inverse': [7, 27],
                    'white': [37, 39],
                    'grey': [90, 39],
                    'black': [30, 39],
                    'blue': [34, 39],
                    'cyan': [36, 39],
                    'green': [32, 39],
                    'magenta': [35, 39],
                    'red': [31, 39],
                    'yellow': [33, 39]
                };

                // Don't use 'blue' not visible on cmd.exe
                inspect.styles = {
                    'special': 'cyan',
                    'number': 'yellow',
                    'boolean': 'yellow',
                    'undefined': 'grey',
                    'null': 'bold',
                    'string': 'green',
                    'date': 'magenta',
                    // "name": intentionally not styling
                    'regexp': 'red'
                };


                function stylizeWithColor(str, styleType) {
                    var style = inspect.styles[styleType];

                    if (style) {
                        return '\u001b[' + inspect.colors[style][0] + 'm' + str +
                            '\u001b[' + inspect.colors[style][1] + 'm';
                    } else {
                        return str;
                    }
                }


                function stylizeNoColor(str, styleType) {
                    return str;
                }


                function arrayToHash(array) {
                    var hash = {};

                    array.forEach(function (val, idx) {
                        hash[val] = true;
                    });

                    return hash;
                }


                function formatValue(ctx, value, recurseTimes) {
                    // Provide a hook for user-specified inspect functions.
                    // Check that value is an object with an inspect function on it
                    if (ctx.customInspect &&
                        value &&
                        isFunction(value.inspect) &&
                        // Filter out the util module, it's inspect function is special
                        value.inspect !== exports.inspect &&
                        // Also filter out any prototype objects using the circular check.
                        !(value.constructor && value.constructor.prototype === value)) {
                        var ret = value.inspect(recurseTimes, ctx);
                        if (!isString(ret)) {
                            ret = formatValue(ctx, ret, recurseTimes);
                        }
                        return ret;
                    }

                    // Primitive types cannot have properties
                    var primitive = formatPrimitive(ctx, value);
                    if (primitive) {
                        return primitive;
                    }

                    // Look up the keys of the object.
                    var keys = Object.keys(value);
                    var visibleKeys = arrayToHash(keys);

                    if (ctx.showHidden) {
                        keys = Object.getOwnPropertyNames(value);
                    }

                    // IE doesn't make error fields non-enumerable
                    // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
                    if (isError(value)
                        && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
                        return formatError(value);
                    }

                    // Some type of object without properties can be shortcutted.
                    if (keys.length === 0) {
                        if (isFunction(value)) {
                            var name = value.name ? ': ' + value.name : '';
                            return ctx.stylize('[Function' + name + ']', 'special');
                        }
                        if (isRegExp(value)) {
                            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                        }
                        if (isDate(value)) {
                            return ctx.stylize(Date.prototype.toString.call(value), 'date');
                        }
                        if (isError(value)) {
                            return formatError(value);
                        }
                    }

                    var base = '', array = false, braces = ['{', '}'];

                    // Make Array say that they are Array
                    if (isArray(value)) {
                        array = true;
                        braces = ['[', ']'];
                    }

                    // Make functions say that they are functions
                    if (isFunction(value)) {
                        var n = value.name ? ': ' + value.name : '';
                        base = ' [Function' + n + ']';
                    }

                    // Make RegExps say that they are RegExps
                    if (isRegExp(value)) {
                        base = ' ' + RegExp.prototype.toString.call(value);
                    }

                    // Make dates with properties first say the date
                    if (isDate(value)) {
                        base = ' ' + Date.prototype.toUTCString.call(value);
                    }

                    // Make error with message first say the error
                    if (isError(value)) {
                        base = ' ' + formatError(value);
                    }

                    if (keys.length === 0 && (!array || value.length == 0)) {
                        return braces[0] + base + braces[1];
                    }

                    if (recurseTimes < 0) {
                        if (isRegExp(value)) {
                            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                        } else {
                            return ctx.stylize('[Object]', 'special');
                        }
                    }

                    ctx.seen.push(value);

                    var output;
                    if (array) {
                        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
                    } else {
                        output = keys.map(function (key) {
                            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
                        });
                    }

                    ctx.seen.pop();

                    return reduceToSingleString(output, base, braces);
                }


                function formatPrimitive(ctx, value) {
                    if (isUndefined(value))
                        return ctx.stylize('undefined', 'undefined');
                    if (isString(value)) {
                        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                            .replace(/'/g, "\\'")
                            .replace(/\\"/g, '"') + '\'';
                        return ctx.stylize(simple, 'string');
                    }
                    if (isNumber(value))
                        return ctx.stylize('' + value, 'number');
                    if (isBoolean(value))
                        return ctx.stylize('' + value, 'boolean');
                    // For some reason typeof null is "object", so special case here.
                    if (isNull(value))
                        return ctx.stylize('null', 'null');
                }


                function formatError(value) {
                    return '[' + Error.prototype.toString.call(value) + ']';
                }


                function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
                    var output = [];
                    for (var i = 0, l = value.length; i < l; ++i) {
                        if (hasOwnProperty(value, String(i))) {
                            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
                                String(i), true));
                        } else {
                            output.push('');
                        }
                    }
                    keys.forEach(function (key) {
                        if (!key.match(/^\d+$/)) {
                            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
                                key, true));
                        }
                    });
                    return output;
                }


                function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
                    var name, str, desc;
                    desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
                    if (desc.get) {
                        if (desc.set) {
                            str = ctx.stylize('[Getter/Setter]', 'special');
                        } else {
                            str = ctx.stylize('[Getter]', 'special');
                        }
                    } else {
                        if (desc.set) {
                            str = ctx.stylize('[Setter]', 'special');
                        }
                    }
                    if (!hasOwnProperty(visibleKeys, key)) {
                        name = '[' + key + ']';
                    }
                    if (!str) {
                        if (ctx.seen.indexOf(desc.value) < 0) {
                            if (isNull(recurseTimes)) {
                                str = formatValue(ctx, desc.value, null);
                            } else {
                                str = formatValue(ctx, desc.value, recurseTimes - 1);
                            }
                            if (str.indexOf('\n') > -1) {
                                if (array) {
                                    str = str.split('\n').map(function (line) {
                                        return '  ' + line;
                                    }).join('\n').substr(2);
                                } else {
                                    str = '\n' + str.split('\n').map(function (line) {
                                        return '   ' + line;
                                    }).join('\n');
                                }
                            }
                        } else {
                            str = ctx.stylize('[Circular]', 'special');
                        }
                    }
                    if (isUndefined(name)) {
                        if (array && key.match(/^\d+$/)) {
                            return str;
                        }
                        name = JSON.stringify('' + key);
                        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                            name = name.substr(1, name.length - 2);
                            name = ctx.stylize(name, 'name');
                        } else {
                            name = name.replace(/'/g, "\\'")
                                .replace(/\\"/g, '"')
                                .replace(/(^"|"$)/g, "'");
                            name = ctx.stylize(name, 'string');
                        }
                    }

                    return name + ': ' + str;
                }


                function reduceToSingleString(output, base, braces) {
                    var numLinesEst = 0;
                    var length = output.reduce(function (prev, cur) {
                        numLinesEst++;
                        if (cur.indexOf('\n') >= 0) numLinesEst++;
                        return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
                    }, 0);

                    if (length > 60) {
                        return braces[0] +
                            (base === '' ? '' : base + '\n ') +
                            ' ' +
                            output.join(',\n  ') +
                            ' ' +
                            braces[1];
                    }

                    return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
                }


                // NOTE: These type checking functions intentionally don't use `instanceof`
                // because it is fragile and can be easily faked with `Object.create()`.
                function isArray(ar) {
                    return Array.isArray(ar);
                }
                exports.isArray = isArray;

                function isBoolean(arg) {
                    return typeof arg === 'boolean';
                }
                exports.isBoolean = isBoolean;

                function isNull(arg) {
                    return arg === null;
                }
                exports.isNull = isNull;

                function isNullOrUndefined(arg) {
                    return arg == null;
                }
                exports.isNullOrUndefined = isNullOrUndefined;

                function isNumber(arg) {
                    return typeof arg === 'number';
                }
                exports.isNumber = isNumber;

                function isString(arg) {
                    return typeof arg === 'string';
                }
                exports.isString = isString;

                function isSymbol(arg) {
                    return typeof arg === 'symbol';
                }
                exports.isSymbol = isSymbol;

                function isUndefined(arg) {
                    return arg === void 0;
                }
                exports.isUndefined = isUndefined;

                function isRegExp(re) {
                    return isObject(re) && objectToString(re) === '[object RegExp]';
                }
                exports.isRegExp = isRegExp;

                function isObject(arg) {
                    return typeof arg === 'object' && arg !== null;
                }
                exports.isObject = isObject;

                function isDate(d) {
                    return isObject(d) && objectToString(d) === '[object Date]';
                }
                exports.isDate = isDate;

                function isError(e) {
                    return isObject(e) &&
                        (objectToString(e) === '[object Error]' || e instanceof Error);
                }
                exports.isError = isError;

                function isFunction(arg) {
                    return typeof arg === 'function';
                }
                exports.isFunction = isFunction;

                function isPrimitive(arg) {
                    return arg === null ||
                        typeof arg === 'boolean' ||
                        typeof arg === 'number' ||
                        typeof arg === 'string' ||
                        typeof arg === 'symbol' ||  // ES6 symbol
                        typeof arg === 'undefined';
                }
                exports.isPrimitive = isPrimitive;

                exports.isBuffer = _dereq_(10);

                function objectToString(o) {
                    return Object.prototype.toString.call(o);
                }


                function pad(n) {
                    return n < 10 ? '0' + n.toString(10) : n.toString(10);
                }


                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                    'Oct', 'Nov', 'Dec'];

                // 26 Feb 16:19:34
                function timestamp() {
                    var d = new Date();
                    var time = [pad(d.getHours()),
                    pad(d.getMinutes()),
                    pad(d.getSeconds())].join(':');
                    return [d.getDate(), months[d.getMonth()], time].join(' ');
                }


                // log is just a thin wrapper to console.log that prepends a timestamp
                exports.log = function () {
                    console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
                };


                /**
                 * Inherit the prototype methods from one constructor into another.
                 *
                 * The Function.prototype.inherits from lang.js rewritten as a standalone
                 * function (not on Function.prototype). NOTE: If this file is to be loaded
                 * during bootstrapping this function needs to be rewritten using some native
                 * functions as prototype setup using normal JavaScript does not work as
                 * expected during bootstrapping (see mirror.js in r114903).
                 *
                 * @param {function} ctor Constructor function which needs to inherit the
                 *     prototype.
                 * @param {function} superCtor Constructor function to inherit prototype from.
                 */
                exports.inherits = _dereq_(5);

                exports._extend = function (origin, add) {
                    // Don't do anything if add isn't an object
                    if (!add || !isObject(add)) return origin;

                    var keys = Object.keys(add);
                    var i = keys.length;
                    while (i--) {
                        origin[keys[i]] = add[keys[i]];
                    }
                    return origin;
                };

                function hasOwnProperty(obj, prop) {
                    return Object.prototype.hasOwnProperty.call(obj, prop);
                }

            }).call(this, _dereq_(8), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, { "10": 10, "5": 5, "8": 8 }], 12: [function (_dereq_, module, exports) {
            /* @flow */

            "use strict";

            var _interopRequireDefault = _dereq_(15)["default"];

            exports.__esModule = true;

            var _lineNumbers = _dereq_(25);

            var _lineNumbers2 = _interopRequireDefault(_lineNumbers);

            var _repeating = _dereq_(26);

            var _repeating2 = _interopRequireDefault(_repeating);

            var _jsTokens = _dereq_(23);

            var _jsTokens2 = _interopRequireDefault(_jsTokens);

            var _esutils = _dereq_(21);

            var _esutils2 = _interopRequireDefault(_esutils);

            var _chalk = _dereq_(16);

            var _chalk2 = _interopRequireDefault(_chalk);

            /**
             * Chalk styles for token types.
             */

            var defs = {
                string: _chalk2["default"].red,
                punctuator: _chalk2["default"].bold,
                curly: _chalk2["default"].green,
                parens: _chalk2["default"].blue.bold,
                square: _chalk2["default"].yellow,
                keyword: _chalk2["default"].cyan,
                number: _chalk2["default"].magenta,
                regex: _chalk2["default"].magenta,
                comment: _chalk2["default"].grey,
                invalid: _chalk2["default"].inverse
            };

            /**
             * RegExp to test for newlines in terminal.
             */

            var NEWLINE = /\r\n|[\n\r\u2028\u2029]/;

            /**
             * Get the type of token, specifying punctuator type.
             */

            function getTokenType(match) {
                var token = _jsTokens2["default"].matchToToken(match);
                if (token.type === "name" && _esutils2["default"].keyword.isReservedWordES6(token.value)) {
                    return "keyword";
                }

                if (token.type === "punctuator") {
                    switch (token.value) {
                        case "{":
                        case "}":
                            return "curly";
                        case "(":
                        case ")":
                            return "parens";
                        case "[":
                        case "]":
                            return "square";
                    }
                }

                return token.type;
            }

            /**
             * Highlight `text`.
             */

            function highlight(text /*: string*/) {
                return text.replace(_jsTokens2["default"], function () {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    var type = getTokenType(args);
                    var colorize = defs[type];
                    if (colorize) {
                        return args[0].split(NEWLINE).map(function (str) {
                            return colorize(str);
                        }).join("\n");
                    } else {
                        return args[0];
                    }
                });
            }

            /**
             * Create a code frame, adding line numbers, code highlighting, and pointing to a given position.
             */

            exports["default"] = function (rawLines /*: string*/, lineNumber /*: number*/, colNumber /*: number*/) /*: string*/ {
                var opts /*: Object*/ = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

                colNumber = Math.max(colNumber, 0);

                var highlighted = opts.highlightCode && _chalk2["default"].supportsColor;
                if (highlighted) rawLines = highlight(rawLines);

                var lines = rawLines.split(NEWLINE);
                var start = Math.max(lineNumber - 3, 0);
                var end = Math.min(lines.length, lineNumber + 3);

                if (!lineNumber && !colNumber) {
                    start = 0;
                    end = lines.length;
                }

                var frame = _lineNumbers2["default"](lines.slice(start, end), {
                    start: start + 1,
                    before: "  ",
                    after: " | ",
                    transform: function transform(params) {
                        if (params.number !== lineNumber) {
                            return;
                        }

                        if (colNumber) {
                            params.line += "\n" + params.before + _repeating2["default"](" ", params.width) + params.after + _repeating2["default"](" ", colNumber - 1) + "^";
                        }

                        params.before = params.before.replace(/^./, ">");
                    }
                }).join("\n");

                if (highlighted) {
                    return _chalk2["default"].reset(frame);
                } else {
                    return frame;
                }
            };

            module.exports = exports["default"];
        }, { "15": 15, "16": 16, "21": 21, "23": 23, "25": 25, "26": 26 }], 13: [function (_dereq_, module, exports) {
            'use strict';
            module.exports = function () {
                return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
            };

        }, {}], 14: [function (_dereq_, module, exports) {
            'use strict';

            function assembleStyles() {
                var styles = {
                    modifiers: {
                        reset: [0, 0],
                        bold: [1, 22], // 21 isn't widely supported and 22 does the same thing
                        dim: [2, 22],
                        italic: [3, 23],
                        underline: [4, 24],
                        inverse: [7, 27],
                        hidden: [8, 28],
                        strikethrough: [9, 29]
                    },
                    colors: {
                        black: [30, 39],
                        red: [31, 39],
                        green: [32, 39],
                        yellow: [33, 39],
                        blue: [34, 39],
                        magenta: [35, 39],
                        cyan: [36, 39],
                        white: [37, 39],
                        gray: [90, 39]
                    },
                    bgColors: {
                        bgBlack: [40, 49],
                        bgRed: [41, 49],
                        bgGreen: [42, 49],
                        bgYellow: [43, 49],
                        bgBlue: [44, 49],
                        bgMagenta: [45, 49],
                        bgCyan: [46, 49],
                        bgWhite: [47, 49]
                    }
                };

                // fix humans
                styles.colors.grey = styles.colors.gray;

                Object.keys(styles).forEach(function (groupName) {
                    var group = styles[groupName];

                    Object.keys(group).forEach(function (styleName) {
                        var style = group[styleName];

                        styles[styleName] = group[styleName] = {
                            open: '\u001b[' + style[0] + 'm',
                            close: '\u001b[' + style[1] + 'm'
                        };
                    });

                    Object.defineProperty(styles, groupName, {
                        value: group,
                        enumerable: false
                    });
                });

                return styles;
            }

            Object.defineProperty(module, 'exports', {
                enumerable: true,
                get: assembleStyles
            });

        }, {}], 15: [function (_dereq_, module, exports) {
            "use strict";

            exports["default"] = function (obj) {
                return obj && obj.__esModule ? obj : {
                    "default": obj
                };
            };

            exports.__esModule = true;
        }, {}], 16: [function (_dereq_, module, exports) {
            (function (process) {
                'use strict';
                var escapeStringRegexp = _dereq_(17);
                var ansiStyles = _dereq_(14);
                var stripAnsi = _dereq_(29);
                var hasAnsi = _dereq_(22);
                var supportsColor = _dereq_(30);
                var defineProps = Object.defineProperties;
                var isSimpleWindowsTerm = process.platform === 'win32' && !/^xterm/i.test(process.env.TERM);

                function Chalk(options) {
                    // detect mode if not set manually
                    this.enabled = !options || options.enabled === undefined ? supportsColor : options.enabled;
                }

                // use bright blue on Windows as the normal blue color is illegible
                if (isSimpleWindowsTerm) {
                    ansiStyles.blue.open = '\u001b[94m';
                }

                var styles = (function () {
                    var ret = {};

                    Object.keys(ansiStyles).forEach(function (key) {
                        ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

                        ret[key] = {
                            get: function () {
                                return build.call(this, this._styles.concat(key));
                            }
                        };
                    });

                    return ret;
                })();

                var proto = defineProps(function chalk() { }, styles);

                function build(_styles) {
                    var builder = function () {
                        return applyStyle.apply(builder, arguments);
                    };

                    builder._styles = _styles;
                    builder.enabled = this.enabled;
                    // __proto__ is used because we must return a function, but there is
                    // no way to create a function with a different prototype.
                    /* eslint-disable no-proto */
                    builder.__proto__ = proto;

                    return builder;
                }

                function applyStyle() {
                    // support varags, but simply cast to string in case there's only one arg
                    var args = arguments;
                    var argsLen = args.length;
                    var str = argsLen !== 0 && String(arguments[0]);

                    if (argsLen > 1) {
                        // don't slice `arguments`, it prevents v8 optimizations
                        for (var a = 1; a < argsLen; a++) {
                            str += ' ' + args[a];
                        }
                    }

                    if (!this.enabled || !str) {
                        return str;
                    }

                    var nestedStyles = this._styles;
                    var i = nestedStyles.length;

                    // Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
                    // see https://github.com/chalk/chalk/issues/58
                    // If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
                    var originalDim = ansiStyles.dim.open;
                    if (isSimpleWindowsTerm && (nestedStyles.indexOf('gray') !== -1 || nestedStyles.indexOf('grey') !== -1)) {
                        ansiStyles.dim.open = '';
                    }

                    while (i--) {
                        var code = ansiStyles[nestedStyles[i]];

                        // Replace any instances already present with a re-opening code
                        // otherwise only the part of the string until said closing code
                        // will be colored, and the rest will simply be 'plain'.
                        str = code.open + str.replace(code.closeRe, code.open) + code.close;
                    }

                    // Reset the original 'dim' if we changed it to work around the Windows dimmed gray issue.
                    ansiStyles.dim.open = originalDim;

                    return str;
                }

                function init() {
                    var ret = {};

                    Object.keys(styles).forEach(function (name) {
                        ret[name] = {
                            get: function () {
                                return build.call(this, [name]);
                            }
                        };
                    });

                    return ret;
                }

                defineProps(Chalk.prototype, init());

                module.exports = new Chalk();
                module.exports.styles = ansiStyles;
                module.exports.hasColor = hasAnsi;
                module.exports.stripColor = stripAnsi;
                module.exports.supportsColor = supportsColor;

            }).call(this, _dereq_(8))
        }, { "14": 14, "17": 17, "22": 22, "29": 29, "30": 30, "8": 8 }], 17: [function (_dereq_, module, exports) {
            'use strict';

            var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

            module.exports = function (str) {
                if (typeof str !== 'string') {
                    throw new TypeError('Expected a string');
                }

                return str.replace(matchOperatorsRe, '\\$&');
            };

        }, {}], 18: [function (_dereq_, module, exports) {
            /*
              Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>
            
              Redistribution and use in source and binary forms, with or without
              modification, are permitted provided that the following conditions are met:
            
                * Redistributions of source code must retain the above copyright
                  notice, this list of conditions and the following disclaimer.
                * Redistributions in binary form must reproduce the above copyright
                  notice, this list of conditions and the following disclaimer in the
                  documentation and/or other materials provided with the distribution.
            
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS'
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
              IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
              ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
              DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
              (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
              LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
              ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
              (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
              THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
            */

            (function () {
                'use strict';

                function isExpression(node) {
                    if (node == null) { return false; }
                    switch (node.type) {
                        case 'ArrayExpression':
                        case 'AssignmentExpression':
                        case 'BinaryExpression':
                        case 'CallExpression':
                        case 'ConditionalExpression':
                        case 'FunctionExpression':
                        case 'Identifier':
                        case 'Literal':
                        case 'LogicalExpression':
                        case 'MemberExpression':
                        case 'NewExpression':
                        case 'ObjectExpression':
                        case 'SequenceExpression':
                        case 'ThisExpression':
                        case 'UnaryExpression':
                        case 'UpdateExpression':
                            return true;
                    }
                    return false;
                }

                function isIterationStatement(node) {
                    if (node == null) { return false; }
                    switch (node.type) {
                        case 'DoWhileStatement':
                        case 'ForInStatement':
                        case 'ForStatement':
                        case 'WhileStatement':
                            return true;
                    }
                    return false;
                }

                function isStatement(node) {
                    if (node == null) { return false; }
                    switch (node.type) {
                        case 'BlockStatement':
                        case 'BreakStatement':
                        case 'ContinueStatement':
                        case 'DebuggerStatement':
                        case 'DoWhileStatement':
                        case 'EmptyStatement':
                        case 'ExpressionStatement':
                        case 'ForInStatement':
                        case 'ForStatement':
                        case 'IfStatement':
                        case 'LabeledStatement':
                        case 'ReturnStatement':
                        case 'SwitchStatement':
                        case 'ThrowStatement':
                        case 'TryStatement':
                        case 'VariableDeclaration':
                        case 'WhileStatement':
                        case 'WithStatement':
                            return true;
                    }
                    return false;
                }

                function isSourceElement(node) {
                    return isStatement(node) || node != null && node.type === 'FunctionDeclaration';
                }

                function trailingStatement(node) {
                    switch (node.type) {
                        case 'IfStatement':
                            if (node.alternate != null) {
                                return node.alternate;
                            }
                            return node.consequent;

                        case 'LabeledStatement':
                        case 'ForStatement':
                        case 'ForInStatement':
                        case 'WhileStatement':
                        case 'WithStatement':
                            return node.body;
                    }
                    return null;
                }

                function isProblematicIfStatement(node) {
                    var current;

                    if (node.type !== 'IfStatement') {
                        return false;
                    }
                    if (node.alternate == null) {
                        return false;
                    }
                    current = node.consequent;
                    do {
                        if (current.type === 'IfStatement') {
                            if (current.alternate == null) {
                                return true;
                            }
                        }
                        current = trailingStatement(current);
                    } while (current);

                    return false;
                }

                module.exports = {
                    isExpression: isExpression,
                    isStatement: isStatement,
                    isIterationStatement: isIterationStatement,
                    isSourceElement: isSourceElement,
                    isProblematicIfStatement: isProblematicIfStatement,

                    trailingStatement: trailingStatement
                };
            }());
            /* vim: set sw=4 ts=4 et tw=80 : */

        }, {}], 19: [function (_dereq_, module, exports) {
            /*
              Copyright (C) 2013-2014 Yusuke Suzuki <utatane.tea@gmail.com>
              Copyright (C) 2014 Ivan Nikulin <ifaaan@gmail.com>
            
              Redistribution and use in source and binary forms, with or without
              modification, are permitted provided that the following conditions are met:
            
                * Redistributions of source code must retain the above copyright
                  notice, this list of conditions and the following disclaimer.
                * Redistributions in binary form must reproduce the above copyright
                  notice, this list of conditions and the following disclaimer in the
                  documentation and/or other materials provided with the distribution.
            
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
              IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
              ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
              DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
              (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
              LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
              ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
              (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
              THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
            */

            (function () {
                'use strict';

                var ES6Regex, ES5Regex, NON_ASCII_WHITESPACES, IDENTIFIER_START, IDENTIFIER_PART, ch;

                // See `tools/generate-identifier-regex.js`.
                ES5Regex = {
                    // ECMAScript 5.1/Unicode v7.0.0 NonAsciiIdentifierStart:
                    NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
                    // ECMAScript 5.1/Unicode v7.0.0 NonAsciiIdentifierPart:
                    NonAsciiIdentifierPart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/
                };

                ES6Regex = {
                    // ECMAScript 6/Unicode v7.0.0 NonAsciiIdentifierStart:
                    NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDE00-\uDE11\uDE13-\uDE2B\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDE00-\uDE2F\uDE44\uDE80-\uDEAA]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]/,
                    // ECMAScript 6/Unicode v7.0.0 NonAsciiIdentifierPart:
                    NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDD0-\uDDDA\uDE00-\uDE11\uDE13-\uDE37\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF01-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
                };

                function isDecimalDigit(ch) {
                    return 0x30 <= ch && ch <= 0x39;  // 0..9
                }

                function isHexDigit(ch) {
                    return 0x30 <= ch && ch <= 0x39 ||  // 0..9
                        0x61 <= ch && ch <= 0x66 ||     // a..f
                        0x41 <= ch && ch <= 0x46;       // A..F
                }

                function isOctalDigit(ch) {
                    return ch >= 0x30 && ch <= 0x37;  // 0..7
                }

                // 7.2 White Space

                NON_ASCII_WHITESPACES = [
                    0x1680, 0x180E,
                    0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A,
                    0x202F, 0x205F,
                    0x3000,
                    0xFEFF
                ];

                function isWhiteSpace(ch) {
                    return ch === 0x20 || ch === 0x09 || ch === 0x0B || ch === 0x0C || ch === 0xA0 ||
                        ch >= 0x1680 && NON_ASCII_WHITESPACES.indexOf(ch) >= 0;
                }

                // 7.3 Line Terminators

                function isLineTerminator(ch) {
                    return ch === 0x0A || ch === 0x0D || ch === 0x2028 || ch === 0x2029;
                }

                // 7.6 Identifier Names and Identifiers

                function fromCodePoint(cp) {
                    if (cp <= 0xFFFF) { return String.fromCharCode(cp); }
                    var cu1 = String.fromCharCode(Math.floor((cp - 0x10000) / 0x400) + 0xD800);
                    var cu2 = String.fromCharCode(((cp - 0x10000) % 0x400) + 0xDC00);
                    return cu1 + cu2;
                }

                IDENTIFIER_START = new Array(0x80);
                for (ch = 0; ch < 0x80; ++ch) {
                    IDENTIFIER_START[ch] =
                        ch >= 0x61 && ch <= 0x7A ||  // a..z
                        ch >= 0x41 && ch <= 0x5A ||  // A..Z
                        ch === 0x24 || ch === 0x5F;  // $ (dollar) and _ (underscore)
                }

                IDENTIFIER_PART = new Array(0x80);
                for (ch = 0; ch < 0x80; ++ch) {
                    IDENTIFIER_PART[ch] =
                        ch >= 0x61 && ch <= 0x7A ||  // a..z
                        ch >= 0x41 && ch <= 0x5A ||  // A..Z
                        ch >= 0x30 && ch <= 0x39 ||  // 0..9
                        ch === 0x24 || ch === 0x5F;  // $ (dollar) and _ (underscore)
                }

                function isIdentifierStartES5(ch) {
                    return ch < 0x80 ? IDENTIFIER_START[ch] : ES5Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
                }

                function isIdentifierPartES5(ch) {
                    return ch < 0x80 ? IDENTIFIER_PART[ch] : ES5Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
                }

                function isIdentifierStartES6(ch) {
                    return ch < 0x80 ? IDENTIFIER_START[ch] : ES6Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
                }

                function isIdentifierPartES6(ch) {
                    return ch < 0x80 ? IDENTIFIER_PART[ch] : ES6Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
                }

                module.exports = {
                    isDecimalDigit: isDecimalDigit,
                    isHexDigit: isHexDigit,
                    isOctalDigit: isOctalDigit,
                    isWhiteSpace: isWhiteSpace,
                    isLineTerminator: isLineTerminator,
                    isIdentifierStartES5: isIdentifierStartES5,
                    isIdentifierPartES5: isIdentifierPartES5,
                    isIdentifierStartES6: isIdentifierStartES6,
                    isIdentifierPartES6: isIdentifierPartES6
                };
            }());
            /* vim: set sw=4 ts=4 et tw=80 : */

        }, {}], 20: [function (_dereq_, module, exports) {
            /*
              Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>
            
              Redistribution and use in source and binary forms, with or without
              modification, are permitted provided that the following conditions are met:
            
                * Redistributions of source code must retain the above copyright
                  notice, this list of conditions and the following disclaimer.
                * Redistributions in binary form must reproduce the above copyright
                  notice, this list of conditions and the following disclaimer in the
                  documentation and/or other materials provided with the distribution.
            
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
              IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
              ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
              DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
              (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
              LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
              ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
              (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
              THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
            */

            (function () {
                'use strict';

                var code = _dereq_(19);

                function isStrictModeReservedWordES6(id) {
                    switch (id) {
                        case 'implements':
                        case 'interface':
                        case 'package':
                        case 'private':
                        case 'protected':
                        case 'public':
                        case 'static':
                        case 'let':
                            return true;
                        default:
                            return false;
                    }
                }

                function isKeywordES5(id, strict) {
                    // yield should not be treated as keyword under non-strict mode.
                    if (!strict && id === 'yield') {
                        return false;
                    }
                    return isKeywordES6(id, strict);
                }

                function isKeywordES6(id, strict) {
                    if (strict && isStrictModeReservedWordES6(id)) {
                        return true;
                    }

                    switch (id.length) {
                        case 2:
                            return (id === 'if') || (id === 'in') || (id === 'do');
                        case 3:
                            return (id === 'var') || (id === 'for') || (id === 'new') || (id === 'try');
                        case 4:
                            return (id === 'this') || (id === 'else') || (id === 'case') ||
                                (id === 'void') || (id === 'with') || (id === 'enum');
                        case 5:
                            return (id === 'while') || (id === 'break') || (id === 'catch') ||
                                (id === 'throw') || (id === 'const') || (id === 'yield') ||
                                (id === 'class') || (id === 'super');
                        case 6:
                            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
                                (id === 'switch') || (id === 'export') || (id === 'import');
                        case 7:
                            return (id === 'default') || (id === 'finally') || (id === 'extends');
                        case 8:
                            return (id === 'function') || (id === 'continue') || (id === 'debugger');
                        case 10:
                            return (id === 'instanceof');
                        default:
                            return false;
                    }
                }

                function isReservedWordES5(id, strict) {
                    return id === 'null' || id === 'true' || id === 'false' || isKeywordES5(id, strict);
                }

                function isReservedWordES6(id, strict) {
                    return id === 'null' || id === 'true' || id === 'false' || isKeywordES6(id, strict);
                }

                function isRestrictedWord(id) {
                    return id === 'eval' || id === 'arguments';
                }

                function isIdentifierNameES5(id) {
                    var i, iz, ch;

                    if (id.length === 0) { return false; }

                    ch = id.charCodeAt(0);
                    if (!code.isIdentifierStartES5(ch)) {
                        return false;
                    }

                    for (i = 1, iz = id.length; i < iz; ++i) {
                        ch = id.charCodeAt(i);
                        if (!code.isIdentifierPartES5(ch)) {
                            return false;
                        }
                    }
                    return true;
                }

                function decodeUtf16(lead, trail) {
                    return (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
                }

                function isIdentifierNameES6(id) {
                    var i, iz, ch, lowCh, check;

                    if (id.length === 0) { return false; }

                    check = code.isIdentifierStartES6;
                    for (i = 0, iz = id.length; i < iz; ++i) {
                        ch = id.charCodeAt(i);
                        if (0xD800 <= ch && ch <= 0xDBFF) {
                            ++i;
                            if (i >= iz) { return false; }
                            lowCh = id.charCodeAt(i);
                            if (!(0xDC00 <= lowCh && lowCh <= 0xDFFF)) {
                                return false;
                            }
                            ch = decodeUtf16(ch, lowCh);
                        }
                        if (!check(ch)) {
                            return false;
                        }
                        check = code.isIdentifierPartES6;
                    }
                    return true;
                }

                function isIdentifierES5(id, strict) {
                    return isIdentifierNameES5(id) && !isReservedWordES5(id, strict);
                }

                function isIdentifierES6(id, strict) {
                    return isIdentifierNameES6(id) && !isReservedWordES6(id, strict);
                }

                module.exports = {
                    isKeywordES5: isKeywordES5,
                    isKeywordES6: isKeywordES6,
                    isReservedWordES5: isReservedWordES5,
                    isReservedWordES6: isReservedWordES6,
                    isRestrictedWord: isRestrictedWord,
                    isIdentifierNameES5: isIdentifierNameES5,
                    isIdentifierNameES6: isIdentifierNameES6,
                    isIdentifierES5: isIdentifierES5,
                    isIdentifierES6: isIdentifierES6
                };
            }());
            /* vim: set sw=4 ts=4 et tw=80 : */

        }, { "19": 19 }], 21: [function (_dereq_, module, exports) {
            /*
              Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>
            
              Redistribution and use in source and binary forms, with or without
              modification, are permitted provided that the following conditions are met:
            
                * Redistributions of source code must retain the above copyright
                  notice, this list of conditions and the following disclaimer.
                * Redistributions in binary form must reproduce the above copyright
                  notice, this list of conditions and the following disclaimer in the
                  documentation and/or other materials provided with the distribution.
            
              THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
              AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
              IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
              ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
              DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
              (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
              LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
              ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
              (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
              THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
            */


            (function () {
                'use strict';

                exports.ast = _dereq_(18);
                exports.code = _dereq_(19);
                exports.keyword = _dereq_(20);
            }());
            /* vim: set sw=4 ts=4 et tw=80 : */

        }, { "18": 18, "19": 19, "20": 20 }], 22: [function (_dereq_, module, exports) {
            'use strict';
            var ansiRegex = _dereq_(13);
            var re = new RegExp(ansiRegex().source); // remove the `g` flag
            module.exports = re.test.bind(re);

        }, { "13": 13 }], 23: [function (_dereq_, module, exports) {
            // Copyright 2014, 2015 Simon Lydell
            // X11 (“MIT”) Licensed. (See LICENSE.)

            // This regex comes from regex.coffee, and is inserted here by generate-index.js
            // (run `npm run build`).
            module.exports = /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyu]{1,5}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|((?:0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?))|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]{1,6}\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-*\/%&|^]|<{1,2}|>{1,3}|!=?|={1,2})=?|[?:~]|[;,.[\](){}])|(\s+)|(^$|[\s\S])/g

            module.exports.matchToToken = function (match) {
                var token = { type: "invalid", value: match[0] }
                if (match[1]) token.type = "string", token.closed = !!(match[3] || match[4])
                else if (match[5]) token.type = "comment"
                else if (match[6]) token.type = "comment", token.closed = !!match[7]
                else if (match[8]) token.type = "regex"
                else if (match[9]) token.type = "number"
                else if (match[10]) token.type = "name"
                else if (match[11]) token.type = "punctuator"
                else if (match[12]) token.type = "whitespace"
                return token
            }

        }, {}], 24: [function (_dereq_, module, exports) {
            module.exports = leftpad;

            function leftpad(str, len, ch) {
                str = String(str);

                var i = -1;

                ch || (ch = ' ');
                len = len - str.length;


                while (++i < len) {
                    str = ch + str;
                }

                return str;
            }

        }, {}], 25: [function (_dereq_, module, exports) {
            // Copyright 2014, 2015 Simon Lydell
            // X11 (“MIT”) Licensed. (See LICENSE.)

            var leftPad = _dereq_(24)

            function get(options, key, defaultValue) {
                return (key in options ? options[key] : defaultValue)
            }

            function lineNumbers(code, options) {
                var getOption = get.bind(null, options || {})
                var transform = getOption("transform", Function.prototype)
                var padding = getOption("padding", " ")
                var before = getOption("before", " ")
                var after = getOption("after", " | ")
                var start = getOption("start", 1)
                var isArray = Array.isArray(code)
                var lines = (isArray ? code : code.split("\n"))
                var end = start + lines.length - 1
                var width = String(end).length
                var numbered = lines.map(function (line, index) {
                    var number = start + index
                    var params = {
                        before: before, number: number, width: width, after: after,
                        line: line
                    }
                    transform(params)
                    return params.before + leftPad(params.number, width, padding) +
                        params.after + params.line
                })
                return (isArray ? numbered : numbered.join("\n"))
            }

            module.exports = lineNumbers

        }, { "24": 24 }], 26: [function (_dereq_, module, exports) {
            'use strict';
            var isFinite = _dereq_(27);

            module.exports = function (str, n) {
                if (typeof str !== 'string') {
                    throw new TypeError('Expected a string as the first argument');
                }

                if (n < 0 || !isFinite(n)) {
                    throw new TypeError('Expected a finite positive number');
                }

                var ret = '';

                do {
                    if (n & 1) {
                        ret += str;
                    }

                    str += str;
                } while (n = n >> 1);

                return ret;
            };

        }, { "27": 27 }], 27: [function (_dereq_, module, exports) {
            'use strict';
            var numberIsNan = _dereq_(28);

            module.exports = Number.isFinite || function (val) {
                return !(typeof val !== 'number' || numberIsNan(val) || val === Infinity || val === -Infinity);
            };

        }, { "28": 28 }], 28: [function (_dereq_, module, exports) {
            'use strict';
            module.exports = Number.isNaN || function (x) {
                return x !== x;
            };

        }, {}], 29: [function (_dereq_, module, exports) {
            'use strict';
            var ansiRegex = _dereq_(13)();

            module.exports = function (str) {
                return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
            };

        }, { "13": 13 }], 30: [function (_dereq_, module, exports) {
            (function (process) {
                'use strict';
                var argv = process.argv;

                var terminator = argv.indexOf('--');
                var hasFlag = function (flag) {
                    flag = '--' + flag;
                    var pos = argv.indexOf(flag);
                    return pos !== -1 && (terminator !== -1 ? pos < terminator : true);
                };

                module.exports = (function () {
                    if ('FORCE_COLOR' in process.env) {
                        return true;
                    }

                    if (hasFlag('no-color') ||
                        hasFlag('no-colors') ||
                        hasFlag('color=false')) {
                        return false;
                    }

                    if (hasFlag('color') ||
                        hasFlag('colors') ||
                        hasFlag('color=true') ||
                        hasFlag('color=always')) {
                        return true;
                    }

                    if (process.stdout && !process.stdout.isTTY) {
                        return false;
                    }

                    if (process.platform === 'win32') {
                        return true;
                    }

                    if ('COLORTERM' in process.env) {
                        return true;
                    }

                    if (process.env.TERM === 'dumb') {
                        return false;
                    }

                    if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
                        return true;
                    }

                    return false;
                })();

            }).call(this, _dereq_(8))
        }, { "8": 8 }], 31: [function (_dereq_, module, exports) {
            (function (global) {
                /* @flow */

                /* eslint no-new-func: 0 */

                "use strict";

                var _defaults = _dereq_(63)["default"];

                var _interopExportWildcard = _dereq_(65)["default"];

                exports.__esModule = true;
                exports.run = run;
                exports.load = load;

                var _node = _dereq_(32);

                _defaults(exports, _interopExportWildcard(_node, _defaults));

                function run(code /*: string*/) /*: any*/ {
                    var opts /*: Object*/ = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                    return new Function(_node.transform(code, opts).code)();
                }

                function load(url /*: string*/, callback /*: Function*/, opts /*: Object*/, hold /*:: ?: boolean*/) {
                    if (opts === undefined) opts = {};

                    opts.filename = opts.filename || url;

                    var xhr = global.ActiveXObject ? new global.ActiveXObject("Microsoft.XMLHTTP") : new global.XMLHttpRequest();
                    xhr.open("GET", url, true);
                    if ("overrideMimeType" in xhr) xhr.overrideMimeType("text/plain");

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState !== 4) return;

                        var status = xhr.status;
                        if (status === 0 || status === 200) {
                            var param = [xhr.responseText, opts];
                            if (!hold) run(param);
                            if (callback) callback(param);
                        } else {
                            throw new Error("Could not load " + url);
                        }
                    };

                    xhr.send(null);
                }

                function runScripts() {
                    var scripts /*: Array<Array<any> | Object>*/ = [];
                    var types = ["text/ecmascript-6", "text/6to5", "text/babel", "module"];
                    var index = 0;

                    /**
                     * Transform and execute script. Ensures correct load order.
                     */

                    function exec() {
                        var param = scripts[index];
                        if (param instanceof Array) {
                            run(param, index);
                            index++;
                            exec();
                        }
                    }

                    /**
                     * Load, transform, and execute all scripts.
                     */

                    function run(script /*: Object*/, i /*: number*/) {
                        var opts = {};

                        if (script.src) {
                            load(script.src, function (param) {
                                scripts[i] = param;
                                exec();
                            }, opts, true);
                        } else {
                            opts.filename = "embedded";
                            scripts[i] = [script.innerHTML, opts];
                        }
                    }

                    // Collect scripts with Babel `types`.

                    var _scripts = global.document.getElementsByTagName("script");

                    for (var i = 0; i < _scripts.length; ++i) {
                        var _script = _scripts[i];
                        if (types.indexOf(_script.type) >= 0) scripts.push(_script);
                    }

                    for (var i = 0; i < scripts.length; i++) {
                        run(scripts[i], i);
                    }

                    exec();
                }

                /**
                 * Register load event to transform and execute scripts.
                 */

                if (global.addEventListener) {
                    global.addEventListener("DOMContentLoaded", runScripts, false);
                } else if (global.attachEvent) {
                    global.attachEvent("onload", runScripts);
                }
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, { "32": 32, "63": 63, "65": 65 }], 32: [function (_dereq_, module, exports) {
            /* @flow */

            "use strict";

            var _interopRequireDefault = _dereq_(66)["default"];

            var _interopRequireWildcard = _dereq_(67)["default"];

            var _interopRequire = _dereq_(68)["default"];

            exports.__esModule = true;
            exports.transformFile = transformFile;
            exports.transformFileSync = transformFileSync;

            var _lodashLangIsFunction = _dereq_(213);

            var _lodashLangIsFunction2 = _interopRequireDefault(_lodashLangIsFunction);

            var _fs = _dereq_(2);

            var _fs2 = _interopRequireDefault(_fs);

            //

            //

            var _util = _dereq_(50);

            var util = _interopRequireWildcard(_util);

            var _babelMessages = _dereq_(54);

            var messages = _interopRequireWildcard(_babelMessages);

            var _babelTypes = _dereq_(71);

            var t = _interopRequireWildcard(_babelTypes);

            var _babelTraverse = _dereq_(70);

            var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

            var _transformationFileOptionsOptionManager = _dereq_(43);

            var _transformationFileOptionsOptionManager2 = _interopRequireDefault(_transformationFileOptionsOptionManager);

            //

            var _transformationPipeline = _dereq_(47);

            var _transformationPipeline2 = _interopRequireDefault(_transformationPipeline);

            var _transformationFile = _dereq_(38);

            exports.File = _interopRequire(_transformationFile);

            var _transformationFileOptionsConfig = _dereq_(41);

            exports.options = _interopRequire(_transformationFileOptionsConfig);

            var _toolsBuildExternalHelpers = _dereq_(37);

            exports.buildExternalHelpers = _interopRequire(_toolsBuildExternalHelpers);

            var _babelTemplate = _dereq_(69);

            exports.template = _interopRequire(_babelTemplate);

            var _package = _dereq_(249);

            exports.version = _package.version;
            exports.util = util;
            exports.messages = messages;
            exports.types = t;
            exports.traverse = _babelTraverse2["default"];
            exports.OptionManager = _transformationFileOptionsOptionManager2["default"];
            exports.Pipeline = _transformationPipeline2["default"];

            var pipeline = new _transformationPipeline2["default"]();
            var transform = pipeline.transform.bind(pipeline);
            exports.transform = transform;
            var transformFromAst = pipeline.transformFromAst.bind(pipeline);

            exports.transformFromAst = transformFromAst;
            //

            function transformFile(filename /*: string*/, opts /*:: ?: Object*/, callback /*: Function*/) {
                if (_lodashLangIsFunction2["default"](opts)) {
                    callback = opts;
                    opts = {};
                }

                opts.filename = filename;

                _fs2["default"].readFile(filename, function (err, code) {
                    var result = undefined;

                    if (!err) {
                        try {
                            result = transform(code, opts);
                        } catch (_err) {
                            err = _err;
                        }
                    }

                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            }

            function transformFileSync(filename /*: string*/) /*: string*/ {
                var opts /*:: ?: Object*/ = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                opts.filename = filename;
                return transform(_fs2["default"].readFileSync(filename, "utf8"), opts);
            }
        }, { "2": 2, "213": 213, "249": 249, "37": 37, "38": 38, "41": 41, "43": 43, "47": 47, "50": 50, "54": 54, "66": 66, "67": 67, "68": 68, "69": 69, "70": 70, "71": 71 }], 33: [function (_dereq_, module, exports) {
            /* @flow */

            "use strict";

            var _getIterator = _dereq_(55)["default"];

            var _interopRequireDefault = _dereq_(66)["default"];

            exports.__esModule = true;

            var _lodashObjectMerge = _dereq_(225);

            var _lodashObjectMerge2 = _interopRequireDefault(_lodashObjectMerge);

            exports["default"] = function (dest /*:: ?: Object*/, src /*:: ?: Object*/) /*: ?Object*/ {
                if (!dest || !src) return;

                return _lodashObjectMerge2["default"](dest, src, function (a, b) {
                    if (b && Array.isArray(a)) {
                        var newArray = b.slice(0);

                        for (var _iterator = a, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator); ;) {
                            var _ref;

                            if (_isArray) {
                                if (_i >= _iterator.length) break;
                                _ref = _iterator[_i++];
                            } else {
                                _i = _iterator.next();
                                if (_i.done) break;
                                _ref = _i.value;
                            }

                            var item = _ref;

                            if (newArray.indexOf(item) < 0) {
                                newArray.push(item);
                            }
                        }

                        return newArray;
                    }
                });
            };

            module.exports = exports["default"];
        }, { "225": 225, "55": 55, "66": 66 }], 34: [function (_dereq_, module, exports) {
            /* @flow */

            "use strict";

            var _interopRequireWildcard = _dereq_(67)["default"];

            exports.__esModule = true;

            var _babelTypes = _dereq_(71);

            var t = _interopRequireWildcard(_babelTypes);

            /**
             * Normalize an AST.
             *
             * - Wrap `Program` node with a `File` node.
             */

            exports["default"] = function (ast /*: Object*/, comments /*:: ?: Array<Object>*/, tokens /*:: ?: Array<Object>*/) {
                if (ast) {
                    if (ast.type === "Program") {
                        return t.file(ast, comments || [], tokens || []);
                    } else if (ast.type === "File") {
                        return ast;
                    }
                }

                throw new Error("Not a valid ast?");
            };

            module.exports = exports["default"];
        }, { "67": 67, "71": 71 }], 35: [function (_dereq_, module, exports) {
            (function (process) {
                /* @flow */

                "use strict";

                var _interopRequireDefault = _dereq_(66)["default"];

                exports.__esModule = true;

                var _module2 = _dereq_(2);

                var _module3 = _interopRequireDefault(_module2);

                var relativeModules = {};

                exports["default"] = function (loc /*: string*/) /*: ?string*/ {
                    var relative /*: string*/ = arguments.length <= 1 || arguments[1] === undefined ? process.cwd() : arguments[1];

                    // we're in the browser, probably
                    if (typeof _module3["default"] === "object") return null;

                    var relativeMod = relativeModules[relative];

                    if (!relativeMod) {
                        relativeMod = new _module3["default"]();
                        relativeMod.paths = _module3["default"]._nodeModulePaths(relative);
                        relativeModules[relative] = relativeMod;
                    }

                    try {
                        return _module3["default"]._resolveFilename(loc, relativeMod);
                    } catch (err) {
                        return null;
                    }
                };

                module.exports = exports["default"];
            }).call(this, _dereq_(8))
        }, { "2": 2, "66": 66, "8": 8 }], 36: [function (_dereq_, module, exports) {
            /* @flow */

            "use strict";

            var _inherits = _dereq_(64)["default"];

            var _classCallCheck = _dereq_(62)["default"];

            var _Map2 = _dereq_(56)["default"];

            exports.__esModule = true;

            var Store = (function (_Map) {
                _inherits(Store, _Map);

                function Store() {
                    _classCallCheck(this, Store);

                    _Map.call(this);
                    this.dynamicData = {};
                }

                Store.prototype.setDynamic = function setDynamic(key, fn) {
                    this.dynamicData[key] = fn;
                };

                Store.prototype.get = function get(key /*: string*/) /*: any*/ {
                    if (this.has(key)) {
                        return _Map.prototype.get.call(this, key);
                    } else {
                        if (Object.prototype.hasOwnProperty.call(this.dynamicData, key)) {
                            var val = this.dynamicData[key]();
                            this.set(key, val);
                            return val;
                        }
                    }
                };

                return Store;
            })(_Map2);

            exports["default"] = Store;
            module.exports = exports["default"];
        }, { "56": 56, "62": 62, "64": 64 }], 37: [function (_dereq_, module, exports) {
            /* @flow */

            "use strict";

            var _interopRequireWildcard = _dereq_(67)["default"];

            var _interopRequireDefault = _dereq_(66)["default"];

            exports.__esModule = true;

            var _babelHelpers = _dereq_(53);

            var helpers = _interopRequireWildcard(_babelHelpers);

            var _babelGenerator = _dereq_(52);

            var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

            var _babelMessages = _dereq_(54);

            var messages = _interopRequireWildcard(_babelMessages);

            var _babelTemplate = _dereq_(69);

            var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

            var _lodashCollectionEach = _dereq_(144);

            var _lodashCollectionEach2 = _interopRequireDefault(_lodashCollectionEach);

            var _babelTypes = _dereq_(71);

            var t = _interopRequireWildcard(_babelTypes);

            var buildUmdWrapper = _babelTemplate2["default"]("\n  (function (root, factory) {\n    if (typeof define === \"function\" && define.amd) {\n      define(AMD_ARGUMENTS, factory);\n    } else if (typeof exports === \"object\") {\n      factory(COMMON_ARGUMENTS);\n    } else {\n      factory(BROWSER_ARGUMENTS);\n    }\n  })(UMD_ROOT, function (FACTORY_PARAMETERS) {\n    FACTORY_BODY\n  });\n");

            function buildGlobal(namespace, builder) {
                var body = [];
                var container = t.functionExpression(null, [t.identifier("global")], t.blockStatement(body));
                var tree = t.program([t.expressionStatement(t.callExpression(container, [helpers.get("selfGlobal")]))]);

                body.push(t.variableDeclaration("var", [t.variableDeclarator(namespace, t.assignmentExpression("=", t.memberExpression(t.identifier("global"), namespace), t.objectExpression([])))]));

                builder(body);

                return tree;
            }

            function buildUmd(namespace, builder) {
                var body = [];
                body.push(t.variableDeclaration("var", [t.variableDeclarator(namespace, t.identifier("global"))]));

                builder(body);

                return t.program([buildUmdWrapper({
                    FACTORY_PARAMETERS: t.identifier("global"),
                    BROWSER_ARGUMENTS: t.assignmentExpression("=", t.memberExpression(t.identifier("root"), namespace), t.objectExpression([])),
                    COMMON_ARGUMENTS: t.identifier("exports"),
                    AMD_ARGUMENTS: t.arrayExpression([t.stringLiteral("exports")]),
                    FACTORY_BODY: body,
                    UMD_ROOT: t.identifier("this")
                })]);
            }

            function buildVar(namespace, builder) {
                var body = [];
                body.push(t.variableDeclaration("var", [t.variableDeclarator(namespace, t.objectExpression([]))]));
                builder(body);
                body.push(t.expressionStatement(namespace));
                return t.program(body);
            }

            function buildHelpers(body, namespace, whitelist) {
                _lodashCollectionEach2["default"](helpers.list, function (name) {
                    if (whitelist && whitelist.indexOf(name) < 0) return;

                    var key = t.identifier(name);
                    body.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(namespace, key), helpers.get(name))));
                });
            }

            exports["default"] = function (whitelist /*:: ?: Array<string>*/) {
                var outputType /*: "global" | "umd" | "var"*/ = arguments.length <= 1 || arguments[1] === undefined ? "global" : arguments[1];

                var namespace = t.identifier("babelHelpers");

                var builder = function builder(body) {
                    return buildHelpers(body, namespace, whitelist);
                };

                var tree = undefined;

                var build = ({
                    global: buildGlobal,
                    umd: buildUmd,
                    "var": buildVar
                })[outputType];

                if (build) {
                    tree = build(namespace, builder);
                } else {
                    throw new Error(messages.get("unsupportedOutputType", outputType));
                }

                return _babelGenerator2["default"](tree).code;
            };

            module.exports = exports["default"];
        }, { "144": 144, "52": 52, "53": 53, "54": 54, "66": 66, "67": 67, "69": 69, "71": 71 }], 38: [function (_dereq_, module, exports) {
            (function (process) {
                /* @flow */
                /* global BabelParserOptions */
                /* global BabelFileMetadata */
                /* global BabelFileResult */

                "use strict";

                var _inherits = _dereq_(64)["default"];

                var _classCallCheck = _dereq_(62)["default"];

                var _getIterator = _dereq_(55)["default"];

                var _interopRequireDefault = _dereq_(66)["default"];

                var _interopRequireWildcard = _dereq_(67)["default"];

                exports.__esModule = true;

                var _babelHelpers = _dereq_(53);

                var _babelHelpers2 = _interopRequireDefault(_babelHelpers);

                var _metadata = _dereq_(40);

                var metadataVisitor = _interopRequireWildcard(_metadata);

                var _convertSourceMap = _dereq_(76);

                var _convertSourceMap2 = _interopRequireDefault(_convertSourceMap);

                var _optionsOptionManager = _dereq_(43);

                var _optionsOptionManager2 = _interopRequireDefault(_optionsOptionManager);

                var _pluginPass = _dereq_(48);

                var _pluginPass2 = _interopRequireDefault(_pluginPass);

                var _shebangRegex = _dereq_(236);

                var _shebangRegex2 = _interopRequireDefault(_shebangRegex);

                var _babelTraverse = _dereq_(70);

                var _sourceMap = _dereq_(248);

                var _sourceMap2 = _interopRequireDefault(_sourceMap);

                var _babelGenerator = _dereq_(52);

                var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

                var _babelCodeFrame = _dereq_(51);

                var _babelCodeFrame2 = _interopRequireDefault(_babelCodeFrame);

                var _lodashObjectDefaults = _dereq_(222);

                var _lodashObjectDefaults2 = _interopRequireDefault(_lodashObjectDefaults);

                var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

                var _logger = _dereq_(39);

                var _logger2 = _interopRequireDefault(_logger);

                var _store = _dereq_(36);

                var _store2 = _interopRequireDefault(_store);

                var _babylon = _dereq_(72);

                var _util = _dereq_(50);

                var util = _interopRequireWildcard(_util);

                var _path = _dereq_(7);

                var _path2 = _interopRequireDefault(_path);

                var _babelTypes = _dereq_(71);

                var t = _interopRequireWildcard(_babelTypes);

                var _internalPluginsBlockHoist = _dereq_(45);

                var _internalPluginsBlockHoist2 = _interopRequireDefault(_internalPluginsBlockHoist);

                var _internalPluginsShadowFunctions = _dereq_(46);

                var _internalPluginsShadowFunctions2 = _interopRequireDefault(_internalPluginsShadowFunctions);

                /*:: import type Pipeline from "../pipeline";*/
                /*:: import type Plugin from "../plugin";*/

                var INTERNAL_PLUGINS = [[_internalPluginsBlockHoist2["default"]], [_internalPluginsShadowFunctions2["default"]]];

                var errorVisitor = {
                    enter: function enter(path, state) {
                        var loc = path.node.loc;
                        if (loc) {
                            state.loc = loc;
                            path.stop();
                        }
                    }
                };

                var File = (function (_Store) {
                    _inherits(File, _Store);

                    function File(opts /*: Object*/, pipeline /*: Pipeline*/) {
                        if (opts === undefined) opts = {};

                        _classCallCheck(this, File);

                        _Store.call(this);

                        this.pipeline = pipeline;

                        this.log = new _logger2["default"](this, opts.filename || "unknown");
                        this.opts = this.initOptions(opts);

                        this.parserOpts = {
                            highlightCode: this.opts.highlightCode,
                            nonStandard: this.opts.nonStandard,
                            sourceType: this.opts.sourceType,
                            filename: this.opts.filename,
                            plugins: []
                        };

                        this.pluginVisitors = [];
                        this.pluginPasses = [];
                        this.pluginStack = [];
                        this.buildPlugins();

                        this.metadata = {
                            usedHelpers: [],
                            marked: [],
                            modules: {
                                imports: [],
                                exports: {
                                    exported: [],
                                    specifiers: []
                                }
                            }
                        };

                        this.dynamicImportTypes = {};
                        this.dynamicImportIds = {};
                        this.dynamicImports = [];
                        this.declarations = {};
                        this.usedHelpers = {};

                        this.path = null;
                        this.ast = {};

                        this.code = "";
                        this.shebang = "";

                        this.hub = new _babelTraverse.Hub(this);
                    }

                    File.prototype.getMetadata = function getMetadata() {
                        var has = false;
                        for (var _iterator = (this.ast.program.body /*: Array<Object>*/), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator); ;) {
                            var _ref;

                            if (_isArray) {
                                if (_i >= _iterator.length) break;
                                _ref = _iterator[_i++];
                            } else {
                                _i = _iterator.next();
                                if (_i.done) break;
                                _ref = _i.value;
                            }

                            var node = _ref;

                            if (t.isModuleDeclaration(node)) {
                                has = true;
                                break;
                            }
                        }
                        if (has) {
                            this.path.traverse(metadataVisitor, this);
                        }
                    };

                    File.prototype.initOptions = function initOptions(opts) {
                        opts = new _optionsOptionManager2["default"](this.log, this.pipeline).init(opts);

                        if (opts.inputSourceMap) {
                            opts.sourceMaps = true;
                        }

                        if (opts.moduleId) {
                            opts.moduleIds = true;
                        }

                        opts.basename = _path2["default"].basename(opts.filename, _path2["default"].extname(opts.filename));

                        opts.ignore = util.arrayify(opts.ignore, util.regexify);

                        if (opts.only) opts.only = util.arrayify(opts.only, util.regexify);

                        _lodashObjectDefaults2["default"](opts, {
                            moduleRoot: opts.sourceRoot
                        });

                        _lodashObjectDefaults2["default"](opts, {
                            sourceRoot: opts.moduleRoot
                        });

                        _lodashObjectDefaults2["default"](opts, {
                            filenameRelative: opts.filename
                        });

                        var basenameRelative = _path2["default"].basename(opts.filenameRelative);

                        _lodashObjectDefaults2["default"](opts, {
                            sourceFileName: basenameRelative,
                            sourceMapTarget: basenameRelative
                        });

                        return opts;
                    };

                    File.prototype.buildPlugins = function buildPlugins() {
                        var plugins /*: Array<[PluginPass, Object]>*/ = this.opts.plugins.concat(INTERNAL_PLUGINS);

                        // init plugins!
                        for (var _iterator2 = plugins, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _getIterator(_iterator2); ;) {
                            var _ref2;

                            if (_isArray2) {
                                if (_i2 >= _iterator2.length) break;
                                _ref2 = _iterator2[_i2++];
                            } else {
                                _i2 = _iterator2.next();
                                if (_i2.done) break;
                                _ref2 = _i2.value;
                            }

                            var ref = _ref2;
                            var plugin = ref[0];
                            var pluginOpts = ref[1];
                            // todo: fix - can't embed in loop head because of flow bug

                            this.pluginStack.push(plugin);
                            this.pluginVisitors.push(plugin.visitor);
                            this.pluginPasses.push(new _pluginPass2["default"](this, plugin, pluginOpts));

                            if (plugin.manipulateOptions) {
                                plugin.manipulateOptions(this.opts, this.parserOpts, this);
                            }
                        }
                    };

                    File.prototype.getModuleName = function getModuleName() /*: ?string*/ {
                        var opts = this.opts;
                        if (!opts.moduleIds) {
                            return null;
                        }

                        // moduleId is n/a if a `getModuleId()` is provided
                        if (opts.moduleId != null && !opts.getModuleId) {
                            return opts.moduleId;
                        }

                        var filenameRelative = opts.filenameRelative;
                        var moduleName = "";

                        if (opts.moduleRoot != null) {
                            moduleName = opts.moduleRoot + "/";
                        }

                        if (!opts.filenameRelative) {
                            return moduleName + opts.filename.replace(/^\//, "");
                        }

                        if (opts.sourceRoot != null) {
                            // remove sourceRoot from filename
                            var sourceRootRegEx = new RegExp("^" + opts.sourceRoot + "\/?");
                            filenameRelative = filenameRelative.replace(sourceRootRegEx, "");
                        }

                        // remove extension
                        filenameRelative = filenameRelative.replace(/\.(\w*?)$/, "");

                        moduleName += filenameRelative;

                        // normalize path separators
                        moduleName = moduleName.replace(/\\/g, "/");

                        if (opts.getModuleId) {
                            // If return is falsy, assume they want us to use our generated default name
                            return opts.getModuleId(moduleName) || moduleName;
                        } else {
                            return moduleName;
                        }
                    };

                    File.prototype.resolveModuleSource = function resolveModuleSource(source /*: string*/) /*: string*/ {
                        var resolveModuleSource = this.opts.resolveModuleSource;
                        if (resolveModuleSource) source = resolveModuleSource(source, this.opts.filename);
                        return source;
                    };

                    File.prototype.addImport = function addImport(source /*: string*/, imported /*: string*/) /*: Object*/ {
                        var name /*:: ?: string*/ = arguments.length <= 2 || arguments[2] === undefined ? imported : arguments[2];
                        return (function () {
                            var alias = source + ":" + imported;
                            var id = this.dynamicImportIds[alias];

                            if (!id) {
                                source = this.resolveModuleSource(source);
                                id = this.dynamicImportIds[alias] = this.scope.generateUidIdentifier(name);

                                var specifiers = [];

                                if (imported === "*") {
                                    specifiers.push(t.importNamespaceSpecifier(id));
                                } else if (imported === "default") {
                                    specifiers.push(t.importDefaultSpecifier(id));
                                } else {
                                    specifiers.push(t.importSpecifier(id, t.identifier(imported)));
                                }

                                var declar = t.importDeclaration(specifiers, t.stringLiteral(source));
                                declar._blockHoist = 3;

                                this.path.unshiftContainer("body", declar);
                            }

                            return id;
                        }).apply(this, arguments);
                    };

                    File.prototype.addHelper = function addHelper(name /*: string*/) /*: Object*/ {
                        var declar = this.declarations[name];
                        if (declar) return declar;

                        if (!this.usedHelpers[name]) {
                            this.metadata.usedHelpers.push(name);
                            this.usedHelpers[name] = true;
                        }

                        var generator = this.get("helperGenerator");
                        var runtime = this.get("helpersNamespace");
                        if (generator) {
                            var res = generator(name);
                            if (res) return res;
                        } else if (runtime) {
                            return t.memberExpression(runtime, t.identifier(name));
                        }

                        var ref = _babelHelpers2["default"](name);
                        var uid = this.declarations[name] = this.scope.generateUidIdentifier(name);

                        if (t.isFunctionExpression(ref) && !ref.id) {
                            ref.body._compact = true;
                            ref._generated = true;
                            ref.id = uid;
                            ref.type = "FunctionDeclaration";
                            this.path.unshiftContainer("body", ref);
                        } else {
                            ref._compact = true;
                            this.scope.push({
                                id: uid,
                                init: ref,
                                unique: true
                            });
                        }

                        return uid;
                    };

                    File.prototype.addTemplateObject = function addTemplateObject(helperName /*: string*/, strings /*: Array<Object>*/, raw /*: Object*/) /*: Object*/ {
                        // Generate a unique name based on the string literals so we dedupe
                        // identical strings used in the program.
                        var stringIds = raw.elements.map(function (string) {
                            return string.value;
                        });
                        var name = helperName + "_" + raw.elements.length + "_" + stringIds.join(",");

                        var declar = this.declarations[name];
                        if (declar) return declar;

                        var uid = this.declarations[name] = this.scope.generateUidIdentifier("templateObject");

                        var helperId = this.addHelper(helperName);
                        var init = t.callExpression(helperId, [strings, raw]);
                        init._compact = true;
                        this.scope.push({
                            id: uid,
                            init: init,
                            _blockHoist: 1.9 // This ensures that we don't fail if not using function expression helpers
                        });
                        return uid;
                    };

                    File.prototype.buildCodeFrameError = function buildCodeFrameError(node /*: Object*/, msg /*: string*/) /*: Error*/ {
                        var Error /*: typeof Error*/ = arguments.length <= 2 || arguments[2] === undefined ? SyntaxError : arguments[2];

                        var loc = node && (node.loc || node._loc);

                        var err = new Error(msg);

                        if (loc) {
                            err.loc = loc.start;
                        } else {
                            _babelTraverse2["default"](node, errorVisitor, this.scope, err);

                            err.message += " (This is an error on an internal node. Probably an internal error";

                            if (err.loc) {
                                err.message += ". Location has been estimated.";
                            }

                            err.message += ")";
                        }

                        return err;
                    };

                    File.prototype.mergeSourceMap = function mergeSourceMap(map /*: Object*/) {
                        var inputMap = this.opts.inputSourceMap;

                        if (inputMap) {
                            var _ret = (function () {
                                var inputMapConsumer = new _sourceMap2["default"].SourceMapConsumer(inputMap);
                                var outputMapConsumer = new _sourceMap2["default"].SourceMapConsumer(map);

                                var mergedGenerator = new _sourceMap2["default"].SourceMapGenerator({
                                    file: inputMapConsumer.file,
                                    sourceRoot: inputMapConsumer.sourceRoot
                                });

                                inputMapConsumer.eachMapping(function (mapping) {
                                    mergedGenerator.addMapping({
                                        source: inputMapConsumer.file,

                                        original: {
                                            line: mapping.originalLine,
                                            column: mapping.originalColumn
                                        },

                                        generated: outputMapConsumer.generatedPositionFor({
                                            line: mapping.generatedLine,
                                            column: mapping.generatedColumn,
                                            source: outputMapConsumer.file
                                        })
                                    });
                                });

                                var mergedMap = mergedGenerator.toJSON();
                                inputMap.mappings = mergedMap.mappings;
                                return {
                                    v: inputMap
                                };
                            })();

                            // istanbul ignore next
                            if (typeof _ret === "object") return _ret.v;
                        } else {
                            return map;
                        }
                    };

                    File.prototype.parse = function parse(code /*: string*/) {
                        this.log.debug("Parse start");
                        var ast = _babylon.parse(code, this.parserOpts);
                        this.log.debug("Parse stop");
                        return ast;
                    };

                    File.prototype._addAst = function _addAst(ast) {
                        this.path = _babelTraverse.NodePath.get({
                            hub: this.hub,
                            parentPath: null,
                            parent: ast,
                            container: ast,
                            key: "program"
                        }).setContext();
                        this.scope = this.path.scope;
                        this.ast = ast;
                        this.getMetadata();
                    };

                    File.prototype.addAst = function addAst(ast) {
                        this.log.debug("Start set AST");
                        this._addAst(ast);
                        this.log.debug("End set AST");
                    };

                    File.prototype.transform = function transform() /*: BabelFileResult*/ {
                        this.call("pre");
                        this.log.debug("Start transform traverse");
                        _babelTraverse2["default"](this.ast, _babelTraverse2["default"].visitors.merge(this.pluginVisitors, this.pluginPasses), this.scope);
                        this.log.debug("End transform traverse");
                        this.call("post");
                        return this.generate();
                    };

                    File.prototype.wrap = function wrap(code /*: string*/, callback /*: Function*/) /*: BabelFileResult*/ {
                        code = code + "";

                        try {
                            if (this.shouldIgnore()) {
                                return this.makeResult({ code: code, ignored: true });
                            } else {
                                return callback();
                            }
                        } catch (err) {
                            if (err._babel) {
                                throw err;
                            } else {
                                err._babel = true;
                            }

                            var message = err.message = this.opts.filename + ": " + err.message;

                            var loc = err.loc;
                            if (loc) {
                                err.codeFrame = _babelCodeFrame2["default"](code, loc.line, loc.column + 1, this.opts);
                                message += "\n" + err.codeFrame;
                            }

                            if (process.browser) {
                                // chrome has it's own pretty stringifier which doesn't use the stack property
                                // https://github.com/babel/babel/issues/2175
                                err.message = message;
                            }

                            if (err.stack) {
                                var newStack = err.stack.replace(err.message, message);
                                err.stack = newStack;
                            }

                            throw err;
                        }
                    };

                    File.prototype.addCode = function addCode(code /*: string*/) {
                        code = (code || "") + "";
                        code = this.parseInputSourceMap(code);
                        this.code = code;
                    };

                    File.prototype.parseCode = function parseCode() {
                        this.parseShebang();
                        var ast = this.parse(this.code);
                        this.addAst(ast);
                    };

                    File.prototype.shouldIgnore = function shouldIgnore() {
                        var opts = this.opts;
                        return util.shouldIgnore(opts.filename, opts.ignore, opts.only);
                    };

                    File.prototype.call = function call(key /*: "pre" | "post"*/) {
                        for (var _iterator3 = (this.pluginPasses /*: Array<PluginPass>*/), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _getIterator(_iterator3); ;) {
                            var _ref3;

                            if (_isArray3) {
                                if (_i3 >= _iterator3.length) break;
                                _ref3 = _iterator3[_i3++];
                            } else {
                                _i3 = _iterator3.next();
                                if (_i3.done) break;
                                _ref3 = _i3.value;
                            }

                            var pass = _ref3;

                            var plugin = pass.plugin;
                            var fn = plugin[key];
                            if (fn) fn.call(pass, this);
                        }
                    };

                    File.prototype.parseInputSourceMap = function parseInputSourceMap(code /*: string*/) /*: string*/ {
                        var opts = this.opts;

                        if (opts.inputSourceMap !== false) {
                            var inputMap = _convertSourceMap2["default"].fromSource(code);
                            if (inputMap) {
                                opts.inputSourceMap = inputMap.toObject();
                                code = _convertSourceMap2["default"].removeComments(code);
                            }
                        }

                        return code;
                    };

                    File.prototype.parseShebang = function parseShebang() {
                        var shebangMatch = _shebangRegex2["default"].exec(this.code);
                        if (shebangMatch) {
                            this.shebang = shebangMatch[0];
                            this.code = this.code.replace(_shebangRegex2["default"], "");
                        }
                    };

                    File.prototype.makeResult = function makeResult(_ref4 /*: BabelFileResult*/) /*: BabelFileResult*/ {
                        var code = _ref4.code;
                        var map = _ref4.map;
                        var ast = _ref4.ast;
                        var ignored = _ref4.ignored;

                        var result = {
                            metadata: null,
                            options: this.opts,
                            ignored: !!ignored,
                            code: null,
                            ast: null,
                            map: map || null
                        };

                        if (this.opts.code) {
                            result.code = code;
                        }

                        if (this.opts.ast) {
                            result.ast = ast;
                        }

                        if (this.opts.metadata) {
                            result.metadata = this.metadata;
                        }

                        return result;
                    };

                    File.prototype.generate = function generate() /*: BabelFileResult*/ {
                        var opts = this.opts;
                        var ast = this.ast;

                        var result /*: BabelFileResult*/ = { ast: ast };
                        if (!opts.code) return this.makeResult(result);

                        this.log.debug("Generation start");

                        var _result = _babelGenerator2["default"](ast, opts, this.code);
                        result.code = _result.code;
                        result.map = _result.map;

                        this.log.debug("Generation end");

                        if (this.shebang) {
                            // add back shebang
                            result.code = this.shebang + "\n" + result.code;
                        }

                        if (result.map) {
                            result.map = this.mergeSourceMap(result.map);
                        }

                        if (opts.sourceMaps === "inline" || opts.sourceMaps === "both") {
                            result.code += "\n" + _convertSourceMap2["default"].fromObject(result.map).toComment();
                        }

                        if (opts.sourceMaps === "inline") {
                            result.map = null;
                        }

                        return this.makeResult(result);
                    };

                    return File;
                })(_store2["default"]);

                exports["default"] = File;
                exports.File = File;
            }).call(this, _dereq_(8))
        }, { "222": 222, "236": 236, "248": 248, "36": 36, "39": 39, "40": 40, "43": 43, "45": 45, "46": 46, "48": 48, "50": 50, "51": 51, "52": 52, "53": 53, "55": 55, "62": 62, "64": 64, "66": 66, "67": 67, "7": 7, "70": 70, "71": 71, "72": 72, "76": 76, "8": 8 }], 39: [function (_dereq_, module, exports) {
            /* @flow */

            "use strict";

            var _classCallCheck = _dereq_(62)["default"];

            var _interopRequireDefault = _dereq_(66)["default"];

            exports.__esModule = true;

            var _debugNode = _dereq_(140);

            var _debugNode2 = _interopRequireDefault(_debugNode);

            /*:: import type File from "./index";*/

            var verboseDebug = _debugNode2["default"]("babel:verbose");
            var generalDebug = _debugNode2["default"]("babel");

            var seenDeprecatedMessages = [];

            var Logger = (function () {
                function Logger(file /*: File*/, filename /*: string*/) {
                    _classCallCheck(this, Logger);

                    this.filename = filename;
                    this.file = file;
                }

                Logger.prototype._buildMessage = function _buildMessage(msg /*: string*/) /*: string*/ {
                    var parts = "[BABEL] " + this.filename;
                    if (msg) parts += ": " + msg;
                    return parts;
                };

                Logger.prototype.warn = function warn(msg /*: string*/) {
                    console.warn(this._buildMessage(msg));
                };

                Logger.prototype.error = function error(msg /*: string*/) /*: Error*/ {
                    var Constructor /*: typeof Error*/ = arguments.length <= 1 || arguments[1] === undefined ? Error : arguments[1];

                    throw new Constructor(this._buildMessage(msg));
                };

                Logger.prototype.deprecate = function deprecate(msg /*: string*/) {
                    if (this.file.opts && this.file.opts.suppressDeprecationMessages) return;

                    msg = this._buildMessage(msg);

                    // already seen this message
                    if (seenDeprecatedMessages.indexOf(msg) >= 0) return;

                    // make sure we don't see it again
                    seenDeprecatedMessages.push(msg);

                    console.error(msg);
                };

                Logger.prototype.verbose = function verbose(msg /*: string*/) {
                    if (verboseDebug.enabled) verboseDebug(this._buildMessage(msg));
                };

                Logger.prototype.debug = function debug(msg /*: string*/) {
                    if (generalDebug.enabled) generalDebug(this._buildMessage(msg));
                };

                Logger.prototype.deopt = function deopt(node /*: Object*/, msg /*: string*/) {
                    this.debug(msg);
                };

                return Logger;
            })();

            exports["default"] = Logger;
            module.exports = exports["default"];
        }, { "140": 140, "62": 62, "66": 66 }], 40: [function (_dereq_, module, exports) {
            /* @flow */

            "use strict";

            var _getIterator = _dereq_(55)["default"];

            var _interopRequireWildcard = _dereq_(67)["default"];

            exports.__esModule = true;
            exports.ExportDeclaration = ExportDeclaration;
            exports.Scope = Scope;

            var _babelTypes = _dereq_(71);

            var t = _interopRequireWildcard(_babelTypes);

            var ModuleDeclaration = {
                enter: function enter(path, file) {
                    var node = path.node;

                    if (node.source) {
                        node.source.value = file.resolveModuleSource(node.source.value);
                    }
                }
            };

            exports.ModuleDeclaration = ModuleDeclaration;
            var ImportDeclaration = {
                exit: function exit(path, file) {
                    var node = path.node;

                    var specifiers = [];
                    var imported = [];
                    file.metadata.modules.imports.push({
                        source: node.source.value,
                        imported: imported,
                        specifiers: specifiers
                    });

                    for (var _iterator = (path.get("specifiers") /*: Array<Object>*/), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator); ;) {
                        var _ref;

                        if (_isArray) {
                            if (_i >= _iterator.length) break;
                            _ref = _iterator[_i++];
                        } else {
                            _i = _iterator.next();
                            if (_i.done) break;
                            _ref = _i.value;
                        }

                        var specifier = _ref;

                        var local = specifier.node.local.name;

                        if (specifier.isImportDefaultSpecifier()) {
                            imported.push("default");
                            specifiers.push({
                                kind: "named",
                                imported: "default",
                                local: local
                            });
                        }

                        if (specifier.isImportSpecifier()) {
                            var importedName = specifier.node.imported.name;
                            imported.push(importedName);
                            specifiers.push({
                                kind: "named",
                                imported: importedName,
                                local: local
                            });
                        }

                        if (specifier.isImportNamespaceSpecifier()) {
                            imported.push("*");
                            specifiers.push({
                                kind: "namespace",
                                local: local
                            });
                        }
                    }
                }
            };

            exports.ImportDeclaration = ImportDeclaration;

            function ExportDeclaration(path, file) {
                var node = path.node;

                var source = node.source ? node.source.value : null;
                var exports = file.metadata.modules.exports;

                // export function foo() {}
                // export let foo = "bar";
                var declar = path.get("declaration");
                if (declar.isStatement()) {
                    var bindings = declar.getBindingIdentifiers();

                    for (var _name in bindings) {
                        exports.exported.push(_name);
                        exports.specifiers.push({
                            kind: "local",
                            local: _name,
                            exported: path.isExportDefaultDeclaration() ? "default" : _name
                        });
                    }
                }

                if (path.isExportNamedDeclaration() && node.specifiers) {
                    for (var _iterator2 = (node.specifiers /*: Array<Object>*/), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _getIterator(_iterator2); ;) {
                        var _ref2;

                        if (_isArray2) {
                            if (_i2 >= _iterator2.length) break;
                            _ref2 = _iterator2[_i2++];
                        } else {
                            _i2 = _iterator2.next();
                            if (_i2.done) break;
                            _ref2 = _i2.value;
                        }

                        var specifier = _ref2;

                        var exported = specifier.exported.name;
                        exports.exported.push(exported);

                        // export foo from "bar";
                        if (t.isExportDefaultSpecifier(specifier)) {
                            exports.specifiers.push({
                                kind: "external",
                                local: exported,
                                exported: exported,
                                source: source
                            });
                        }

                        // export * as foo from "bar";
                        if (t.isExportNamespaceSpecifier(specifier)) {
                            exports.specifiers.push({
                                kind: "external-namespace",
                                exported: exported,
                                source: source
                            });
                        }

                        var local = specifier.local;
                        if (!local) continue;

                        // export { foo } from "bar";
                        // export { foo as bar } from "bar";
                        if (source) {
                            exports.specifiers.push({
                                kind: "external",
                                local: local.name,
                                exported: exported,
                                source: source
                            });
                        }

                        // export { foo };
                        // export { foo as bar };
                        if (!source) {
                            exports.specifiers.push({
                                kind: "local",
                                local: local.name,
                                exported: exported
                            });
                        }
                    }
                }

                // export * from "bar";
                if (path.isExportAllDeclaration()) {
                    exports.specifiers.push({
                        kind: "external-all",
                        source: source
                    });
                }
            }

            function Scope(path) {
                path.skip();
            }
        }, { "55": 55, "67": 67, "71": 71 }], 41: [function (_dereq_, module, exports) {
            "use strict";

            module.exports = {
                filename: {
                    type: "filename",
                    description: "filename to use when reading from stdin - this will be used in source-maps, errors etc",
                    "default": "unknown",
                    shorthand: "f"
                },

                filenameRelative: {
                    hidden: true,
                    type: "string"
                },

                inputSourceMap: {
                    hidden: true
                },

                env: {
                    hidden: true,
                    "default": {}
                },

                mode: {
                    description: "",
                    hidden: true
                },

                retainLines: {
                    type: "boolean",
                    "default": false,
                    description: "retain line numbers - will result in really ugly code"
                },

                highlightCode: {
                    description: "enable/disable ANSI syntax highlighting of code frames (on by default)",
                    type: "boolean",
                    "default": true
                },

                suppressDeprecationMessages: {
                    type: "boolean",
                    "default": false,
                    hidden: true
                },

                presets: {
                    type: "list",
                    description: "",
                    "default": []
                },

                plugins: {
                    type: "list",
                    "default": [],
                    description: ""
                },

                ignore: {
                    type: "list",
                    description: "list of glob paths to **not** compile",
                    "default": []
                },

                only: {
                    type: "list",
                    description: "list of glob paths to **only** compile"
                },

                code: {
                    hidden: true,
                    "default": true,
                    type: "boolean"
                },

                metadata: {
                    hidden: true,
                    "default": true,
                    type: "boolean"
                },

                ast: {
                    hidden: true,
                    "default": true,
                    type: "boolean"
                },

                "extends": {
                    type: "string",
                    hidden: true
                },

                comments: {
                    type: "boolean",
                    "default": true,
                    description: "strip/output comments in generated output (on by default)"
                },

                shouldPrintComment: {
                    hidden: true,
                    description: "optional callback to control whether a comment should be inserted, when this is used the comments option is ignored"
                },

                compact: {
                    type: "booleanString",
                    "default": "auto",
                    description: "do not include superfluous whitespace characters and line terminators [true|false|auto]"
                },

                sourceMap: {
                    alias: "sourceMaps",
                    hidden: true
                },

                sourceMaps: {
                    type: "booleanString",
                    description: "[true|false|inline]",
                    "default": false,
                    shorthand: "s"
                },

                sourceMapTarget: {
                    type: "string",
                    description: "set `file` on returned source map"
                },

                sourceFileName: {
                    type: "string",
                    description: "set `sources[0]` on returned source map"
                },

                sourceRoot: {
                    type: "filename",
                    description: "the root from which all sources are relative"
                },

                babelrc: {
                    description: "Whether or not to look up .babelrc and .babelignore files",
                    type: "boolean",
                    "default": true
                },

                sourceType: {
                    description: "",
                    "default": "module"
                },

                auxiliaryCommentBefore: {
                    type: "string",
                    description: "print a comment before any injected non-user code"
                },

                auxiliaryCommentAfter: {
                    type: "string",
                    description: "print a comment after any injected non-user code"
                },

                resolveModuleSource: {
                    hidden: true
                },

                getModuleId: {
                    hidden: true
                },

                moduleRoot: {
                    type: "filename",
                    description: "optional prefix for the AMD module formatter that will be prepend to the filename on module definitions"
                },

                moduleIds: {
                    type: "boolean",
                    "default": false,
                    shorthand: "M",
                    description: "insert an explicit id for modules"
                },

                moduleId: {
                    description: "specify a custom name for module ids",
                    type: "string"
                }
            };
        }, {}], 42: [function (_dereq_, module, exports) {
            /* @flow */

            "use strict";

            var _interopRequireWildcard = _dereq_(67)["default"];

            var _interopRequireDefault = _dereq_(66)["default"];

            exports.__esModule = true;
            exports.normaliseOptions = normaliseOptions;

            var _parsers = _dereq_(44);

            var parsers = _interopRequireWildcard(_parsers);

            var _config = _dereq_(41);

            var _config2 = _interopRequireDefault(_config);

            exports.config = _config2["default"];

            function normaliseOptions() /*: Object*/ {
                var options /*: Object*/ = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                for (var key in options) {
                    var val = options[key];
                    if (val == null) continue;

                    var opt = _config2["default"][key];
                    if (opt && opt.alias) opt = _config2["default"][opt.alias];
                    if (!opt) continue;

                    var parser = parsers[opt.type];
                    if (parser) val = parser(val);

                    options[key] = val;
                }

                return options;
            }
        }, { "41": 41, "44": 44, "66": 66, "67": 67 }], 43: [function (_dereq_, module, exports) {
            (function (process) {
                /* @flow */

                "use strict";

                var _classCallCheck = _dereq_(62)["default"];

                var _getIterator = _dereq_(55)["default"];

                var _interopRequireWildcard = _dereq_(67)["default"];

                var _interopRequireDefault = _dereq_(66)["default"];

                exports.__esModule = true;

                var _apiNode = _dereq_(32);

                var context = _interopRequireWildcard(_apiNode);

                var _plugin2 = _dereq_(49);

                var _plugin3 = _interopRequireDefault(_plugin2);

                var _babelMessages = _dereq_(54);

                var messages = _interopRequireWildcard(_babelMessages);

                var _index = _dereq_(42);

                var _helpersResolve = _dereq_(35);

                var _helpersResolve2 = _interopRequireDefault(_helpersResolve);

                var _json5 = _dereq_(141);

                var _json52 = _interopRequireDefault(_json5);

                var _pathIsAbsolute = _dereq_(235);

                var _pathIsAbsolute2 = _interopRequireDefault(_pathIsAbsolute);

                var _pathExists = _dereq_(234);

                var _pathExists2 = _interopRequireDefault(_pathExists);

                var _lodashLangCloneDeep = _dereq_(209);

                var _lodashLangCloneDeep2 = _interopRequireDefault(_lodashLangCloneDeep);

                var _lodashLangClone = _dereq_(208);

                var _lodashLangClone2 = _interopRequireDefault(_lodashLangClone);

                var _helpersMerge = _dereq_(33);

                var _helpersMerge2 = _interopRequireDefault(_helpersMerge);

                var _config = _dereq_(41);

                var _config2 = _interopRequireDefault(_config);

                var _path = _dereq_(7);

                var _path2 = _interopRequireDefault(_path);

                var _fs = _dereq_(2);

                var _fs2 = _interopRequireDefault(_fs);

                /*:: import type Logger from "../logger";*/

                var existsCache = {};
                var jsonCache = {};

                var BABELIGNORE_FILENAME = ".babelignore";
                var BABELRC_FILENAME = ".babelrc";
                var PACKAGE_FILENAME = "package.json";

                function exists(filename) {
                    var cached = existsCache[filename];
                    if (cached == null) {
                        return existsCache[filename] = _pathExists2["default"].sync(filename);
                    } else {
                        return cached;
                    }
                }

                var OptionManager = (function () {
                    function OptionManager(log /*:: ?: Logger*/) {
                        _classCallCheck(this, OptionManager);

                        this.resolvedConfigs = [];
                        this.options = OptionManager.createBareOptions();
                        this.log = log;
                    }

                    OptionManager.memoisePluginContainer = function memoisePluginContainer(fn, loc, i) {
                        for (var _iterator = (OptionManager.memoisedPlugins /*: Array<Object>*/), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator); ;) {
                            var _ref;

                            if (_isArray) {
                                if (_i >= _iterator.length) break;
                                _ref = _iterator[_i++];
                            } else {
                                _i = _iterator.next();
                                if (_i.done) break;
                                _ref = _i.value;
                            }

                            var cache = _ref;

                            if (cache.container === fn) return cache.plugin;
                        }

                        var obj = undefined;

                        if (typeof fn === "function") {
                            obj = fn(context);
                        } else {
                            obj = fn;
                        }

                        if (typeof obj === "object") {
                            var _plugin = new _plugin3["default"](obj);
                            OptionManager.memoisedPlugins.push({
                                container: fn,
                                plugin: _plugin
                            });
                            return _plugin;
                        } else {
                            throw new TypeError(messages.get("pluginNotObject", loc, i, typeof obj) + loc + i);
                        }
                    };

                    OptionManager.createBareOptions = function createBareOptions() {
                        var opts = {};

                        for (var key in _config2["default"]) {
                            var opt = _config2["default"][key];
                            opts[key] = _lodashLangClone2["default"](opt["default"]);
                        }

                        return opts;
                    };

                    OptionManager.normalisePlugin = function normalisePlugin(plugin, loc, i) {
                        plugin = plugin.__esModule ? plugin["default"] : plugin;

                        if (!(plugin instanceof _plugin3["default"])) {
                            // allow plugin containers to be specified so they don't have to manually require
                            if (typeof plugin === "function" || typeof plugin === "object") {
                                plugin = OptionManager.memoisePluginContainer(plugin, loc, i);
                            } else {
                                throw new TypeError(messages.get("pluginNotFunction", loc, i, typeof plugin));
                            }
                        }

                        plugin.init(loc, i);

                        return plugin;
                    };

                    OptionManager.normalisePlugins = function normalisePlugins(loc, dirname, plugins) {
                        return plugins.map(function (val, i) {
                            var plugin = undefined,
                                options = undefined;

                            // destructure plugins
                            if (Array.isArray(val)) {
                                plugin = val[0];
                                options = val[1];
                            } else {
                                plugin = val;
                            }

                            // allow plugins to be specified as strings
                            if (typeof plugin === "string") {
                                var pluginLoc = _helpersResolve2["default"]("babel-plugin-" + plugin, dirname) || _helpersResolve2["default"](plugin, dirname);
                                if (pluginLoc) {
                                    plugin = _dereq_(pluginLoc);
                                } else {
                                    throw new ReferenceError(messages.get("pluginUnknown", plugin, loc, i));
                                }
                            }

                            plugin = OptionManager.normalisePlugin(plugin, loc, i);

                            return [plugin, options];
                        });
                    };

                    OptionManager.prototype.addConfig = function addConfig(loc /*: string*/, key /*:: ?: string*/) /*: boolean*/ {
                        var json = arguments.length <= 2 || arguments[2] === undefined ? _json52["default"] : arguments[2];

                        if (this.resolvedConfigs.indexOf(loc) >= 0) {
                            return false;
                        }

                        var content = _fs2["default"].readFileSync(loc, "utf8");
                        var opts = undefined;

                        try {
                            opts = jsonCache[content] = jsonCache[content] || json.parse(content);
                            if (key) opts = opts[key];
                        } catch (err) {
                            err.message = loc + ": Error while parsing JSON - " + err.message;
                            throw err;
                        }

                        this.mergeOptions(opts, loc);
                        this.resolvedConfigs.push(loc);

                        return !!opts;
                    };

                    /**
                     * This is called when we want to merge the input `opts` into our
                     * base options.
                     *
                     *  - `alias` is used to output pretty traces back to the original source.
                     *  - `loc` is used to point to the original config.
                     *  - `dirname` is used to resolve plugins relative to it.
                     */

                    OptionManager.prototype.mergeOptions = function mergeOptions(rawOpts /*:: ?: Object*/, alias /*: string*/, loc /*:: ?: string*/, dirname /*:: ?: string*/) {
                        if (alias === undefined) alias = "foreign";

                        if (!rawOpts) return;

                        //
                        if (typeof rawOpts !== "object" || Array.isArray(rawOpts)) {
                            this.log.error("Invalid options type for " + alias, TypeError);
                        }

                        //
                        var opts = _lodashLangCloneDeep2["default"](rawOpts, function (val) {
                            if (val instanceof _plugin3["default"]) {
                                return val;
                            }
                        });

                        //
                        dirname = dirname || process.cwd();
                        loc = loc || alias;

                        for (var key in opts) {
                            var option = _config2["default"][key];

                            // check for an unknown option
                            if (!option && this.log) {
                                this.log.error("Unknown option: " + alias + "." + key, ReferenceError);
                            }
                        }

                        // normalise options
                        _index.normaliseOptions(opts);

                        // resolve plugins
                        if (opts.plugins) {
                            opts.plugins = OptionManager.normalisePlugins(loc, dirname, opts.plugins);
                        }

                        // add extends clause
                        if (opts["extends"]) {
                            var extendsLoc = _helpersResolve2["default"](opts["extends"], dirname);
                            if (extendsLoc) {
                                this.addConfig(extendsLoc);
                            } else {
                                if (this.log) this.log.error("Couldn't resolve extends clause of " + opts["extends"] + " in " + alias);
                            }
                            delete opts["extends"];
                        }

                        // resolve presets
                        if (opts.presets) {
                            this.mergePresets(opts.presets, dirname);
                            delete opts.presets;
                        }

                        // env
                        var envOpts = undefined;
                        var envKey = process.env.BABEL_ENV || process.env.NODE_ENV || "development";
                        if (opts.env) {
                            envOpts = opts.env[envKey];
                            delete opts.env;
                        }

                        // merge them into this current files options
                        _helpersMerge2["default"](this.options, opts);

                        // merge in env options
                        this.mergeOptions(envOpts, alias + ".env." + envKey);
                    };

                    OptionManager.prototype.mergePresets = function mergePresets(presets /*: Array<string | Object>*/, dirname /*: string*/) {
                        for (var _iterator2 = presets, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _getIterator(_iterator2); ;) {
                            var _ref2;

                            if (_isArray2) {
                                if (_i2 >= _iterator2.length) break;
                                _ref2 = _iterator2[_i2++];
                            } else {
                                _i2 = _iterator2.next();
                                if (_i2.done) break;
                                _ref2 = _i2.value;
                            }

                            var val = _ref2;

                            if (typeof val === "string") {
                                var presetLoc = _helpersResolve2["default"]("babel-preset-" + val, dirname) || _helpersResolve2["default"](val, dirname);
                                if (presetLoc) {
                                    var presetOpts = _dereq_(presetLoc);
                                    this.mergeOptions(presetOpts, presetLoc, presetLoc, _path2["default"].dirname(presetLoc));
                                } else {
                                    throw new Error("Couldn't find preset " + JSON.stringify(val));
                                }
                            } else if (typeof val === "object") {
                                this.mergeOptions(val);
                            } else {
                                throw new Error("todo");
                            }
                        }
                    };

                    OptionManager.prototype.addIgnoreConfig = function addIgnoreConfig(loc) {
                        var file = _fs2["default"].readFileSync(loc, "utf8");
                        var lines = file.split("\n");

                        lines = lines.map(function (line) {
                            return line.replace(/#(.*?)$/, "").trim();
                        }).filter(function (line) {
                            return !!line;
                        });

                        this.mergeOptions({ ignore: lines }, loc);
                    };

                    OptionManager.prototype.findConfigs = function findConfigs(loc) {
                        if (!loc) return;

                        if (!_pathIsAbsolute2["default"](loc)) {
                            loc = _path2["default"].join(process.cwd(), loc);
                        }

                        var foundConfig = false;
                        var foundIgnore = false;

                        while (loc !== (loc = _path2["default"].dirname(loc))) {
                            if (!foundConfig) {
                                var configLoc = _path2["default"].join(loc, BABELRC_FILENAME);
                                if (exists(configLoc)) {
                                    this.addConfig(configLoc);
                                    foundConfig = true;
                                }

                                var pkgLoc = _path2["default"].join(loc, PACKAGE_FILENAME);
                                if (!foundConfig && exists(pkgLoc)) {
                                    foundConfig = this.addConfig(pkgLoc, "babel", JSON);
                                }
                            }

                            if (!foundIgnore) {
                                var ignoreLoc = _path2["default"].join(loc, BABELIGNORE_FILENAME);
                                if (exists(ignoreLoc)) {
                                    this.addIgnoreConfig(ignoreLoc);
                                    foundIgnore = true;
                                }
                            }

                            if (foundIgnore && foundConfig) return;
                        }
                    };

                    OptionManager.prototype.normaliseOptions = function normaliseOptions() {
                        var opts = this.options;

                        for (var key in _config2["default"]) {
                            var option = _config2["default"][key];
                            var val = opts[key];

                            // optional
                            if (!val && option.optional) continue;

                            // aliases
                            if (option.alias) {
                                opts[option.alias] = opts[option.alias] || val;
                            } else {
                                opts[key] = val;
                            }
                        }
                    };

                    OptionManager.prototype.init = function init(opts /*: Object*/) /*: Object*/ {
                        // resolve all .babelrc files
                        if (opts.babelrc !== false) {
                            this.findConfigs(opts.filename);
                        }

                        // merge in base options
                        this.mergeOptions(opts, "base");

                        // normalise
                        this.normaliseOptions(opts);

                        return this.options;
                    };

                    return OptionManager;
                })();

                exports["default"] = OptionManager;

                OptionManager.memoisedPlugins = [];
                module.exports = exports["default"];
            }).call(this, _dereq_(8))
        }, { "141": 141, "2": 2, "208": 208, "209": 209, "234": 234, "235": 235, "32": 32, "33": 33, "35": 35, "41": 41, "42": 42, "49": 49, "54": 54, "55": 55, "62": 62, "66": 66, "67": 67, "7": 7, "8": 8 }], 44: [function (_dereq_, module, exports) {
            /* @flow */

            "use strict";

            var _interopRequireDefault = _dereq_(66)["default"];

            var _interopRequireWildcard = _dereq_(67)["default"];

            exports.__esModule = true;
            exports.boolean = boolean;
            exports.booleanString = booleanString;
            exports.list = list;

            var _slash = _dereq_(237);

            var _slash2 = _interopRequireDefault(_slash);

            var _util = _dereq_(50);

            var util = _interopRequireWildcard(_util);

            var filename = _slash2["default"];

            exports.filename = filename;

            function boolean(val /*: any*/) /*: boolean*/ {
                return !!val;
            }

            function booleanString(val /*: any*/) /*: boolean | any*/ {
                return util.booleanify(val);
            }

            function list(val /*: any*/) /*: Array<string>*/ {
                return util.list(val);
            }
        }, { "237": 237, "50": 50, "66": 66, "67": 67 }], 45: [function (_dereq_, module, exports) {
            /* @flow */

            "use strict";

            var _interopRequireDefault = _dereq_(66)["default"];

            exports.__esModule = true;

            var _plugin = _dereq_(49);

            var _plugin2 = _interopRequireDefault(_plugin);

            var _lodashCollectionSortBy = _dereq_(147);

            var _lodashCollectionSortBy2 = _interopRequireDefault(_lodashCollectionSortBy);

            exports["default"] = new _plugin2["default"]({
                /**
                 * [Please add a description.]
                 *
                 * Priority:
                 *
                 *  - 0 We want this to be at the **very** bottom
                 *  - 1 Default node position
                 *  - 2 Priority over normal nodes
                 *  - 3 We want this to be at the **very** top
                 */

                visitor: {
                    Block: {
                        exit: function exit(_ref) {
                            var node = _ref.node;

                            var hasChange = false;
                            for (var i = 0; i < node.body.length; i++) {
                                var bodyNode = node.body[i];
                                if (bodyNode && bodyNode._blockHoist != null) {
                                    hasChange = true;
                                    break;
                                }
                            }
                            if (!hasChange) return;

                            node.body = _lodashCollectionSortBy2["default"](node.body, function (bodyNode) {
                                var priority = bodyNode && bodyNode._blockHoist;
                                if (priority == null) priority = 1;
                                if (priority === true) priority = 2;

                                // Higher priorities should move toward the top.
                                return -1 * priority;
                            });
                        }
                    }
                }
            });
            module.exports = exports["default"];
        }, { "147": 147, "49": 49, "66": 66 }], 46: [function (_dereq_, module, exports) {
            /* @flow */

            "use strict";

            var _interopRequireDefault = _dereq_(66)["default"];

            var _interopRequireWildcard = _dereq_(67)["default"];

            exports.__esModule = true;

            var _plugin = _dereq_(49);

            var _plugin2 = _interopRequireDefault(_plugin);

            var _babelTypes = _dereq_(71);

            var t = _interopRequireWildcard(_babelTypes);

            exports["default"] = new _plugin2["default"]({
                visitor: {
                    ThisExpression: function ThisExpression(path) {
                        remap(path, "this", function () {
                            return t.thisExpression();
                        });
                    },

                    ReferencedIdentifier: function ReferencedIdentifier(path) {
                        if (path.node.name === "arguments") {
                            remap(path, "arguments", function () {
                                return t.identifier("arguments");
                            });
                        }
                    }
                }
            });

            function shouldShadow(path, shadowPath) {
                if (path.is("_forceShadow")) {
                    return true;
                } else {
                    return shadowPath && !shadowPath.isArrowFunctionExpression();
                }
            }

            function remap(path, key, create) {
                // ensure that we're shadowed
                var shadowPath = path.inShadow(key);
                if (!shouldShadow(path, shadowPath)) return;

                var shadowFunction = path.node._shadowedFunctionLiteral;
                var currentFunction = undefined;

                var fnPath = path.findParent(function (path) {
                    if (path.isProgram() || path.isFunction()) {
                        // catch current function in case this is the shadowed one and we can ignore it
                        currentFunction = currentFunction || path;
                    }

                    if (path.isProgram()) {
                        return true;
                    } else if (path.isFunction()) {
                        if (shadowFunction) {
                            return path === shadowFunction || path.node === shadowFunction.node;
                        } else {
                            return !path.is("shadow");
                        }
                    }

                    return false;
                });

                // no point in realiasing if we're in this function
                if (fnPath === currentFunction) return;

                var cached = fnPath.getData(key);
                if (cached) return path.replaceWith(cached);

                var init = create();
                var id = path.scope.generateUidIdentifier(key);

                fnPath.setData(key, id);
                fnPath.scope.push({ id: id, init: init });

                return path.replaceWith(id);
            }
            module.exports = exports["default"];
        }, { "49": 49, "66": 66, "67": 67, "71": 71 }], 47: [function (_dereq_, module, exports) {
            /* @flow */

            "use strict";

            var _classCallCheck = _dereq_(62)["default"];

            var _interopRequireDefault = _dereq_(66)["default"];

            exports.__esModule = true;

            var _helpersNormalizeAst = _dereq_(34);

            var _helpersNormalizeAst2 = _interopRequireDefault(_helpersNormalizeAst);

            var _file = _dereq_(38);

            var _file2 = _interopRequireDefault(_file);

            var Pipeline = (function () {
                function Pipeline() {
                    _classCallCheck(this, Pipeline);
                }

                Pipeline.prototype.lint = function lint(code /*: string*/) {
                    var opts /*:: ?: Object*/ = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                    opts.code = false;
                    opts.mode = "lint";
                    return this.transform(code, opts);
                };

                Pipeline.prototype.pretransform = function pretransform(code /*: string*/, opts /*:: ?: Object*/) {
                    var file = new _file2["default"](opts, this);
                    return file.wrap(code, function () {
                        file.addCode(code);
                        file.parseCode(code);
                        return file;
                    });
                };

                Pipeline.prototype.transform = function transform(code /*: string*/, opts /*:: ?: Object*/) {
                    var file = new _file2["default"](opts, this);
                    return file.wrap(code, function () {
                        file.addCode(code);
                        file.parseCode(code);
                        return file.transform();
                    });
                };

                Pipeline.prototype.transformFromAst = function transformFromAst(ast, code /*: string*/, opts /*: Object*/) {
                    ast = _helpersNormalizeAst2["default"](ast);

                    var file = new _file2["default"](opts, this);
                    return file.wrap(code, function () {
                        file.addCode(code);
                        file.addAst(ast);
                        return file.transform();
                    });
                };

                return Pipeline;
            })();

            exports["default"] = Pipeline;
            module.exports = exports["default"];
        }, { "34": 34, "38": 38, "62": 62, "66": 66 }], 48: [function (_dereq_, module, exports) {
            /* @flow */

            "use strict";

            var _inherits = _dereq_(64)["default"];

            var _classCallCheck = _dereq_(62)["default"];

            var _interopRequireDefault = _dereq_(66)["default"];

            exports.__esModule = true;

            var _store = _dereq_(36);

            var _store2 = _interopRequireDefault(_store);

            var _babelTraverse = _dereq_(70);

            var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

            var _file5 = _dereq_(38);

            var _file6 = _interopRequireDefault(_file5);

            /*:: import type Plugin from "./plugin";*/
            var PluginPass = (function (_Store) {
                _inherits(PluginPass, _Store);

                function PluginPass(file /*: File*/, plugin /*: Plugin*/) {
                    var options /*: Object*/ = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

                    _classCallCheck(this, PluginPass);

                    _Store.call(this);
                    this.plugin = plugin;
                    this.file = file;
                    this.opts = options;
                }

                PluginPass.prototype.transform = function transform() {
                    var file = this.file;
                    file.log.debug("Start transformer " + this.key);
                    _babelTraverse2["default"](file.ast, this.plugin.visitor, file.scope, file);
                    file.log.debug("Finish transformer " + this.key);
                };

                PluginPass.prototype.addHelper = function addHelper() {
                    // istanbul ignore next

                    var _file;

                    return (_file = this.file).addHelper.apply(_file, arguments);
                };

                PluginPass.prototype.addImport = function addImport() {
                    // istanbul ignore next

                    var _file2;

                    return (_file2 = this.file).addImport.apply(_file2, arguments);
                };

                PluginPass.prototype.getModuleName = function getModuleName() {
                    // istanbul ignore next

                    var _file3;

                    return (_file3 = this.file).getModuleName.apply(_file3, arguments);
                };

                PluginPass.prototype.buildCodeFrameError = function buildCodeFrameError() {
                    // istanbul ignore next

                    var _file4;

                    return (_file4 = this.file).buildCodeFrameError.apply(_file4, arguments);
                };

                return PluginPass;
            })(_store2["default"]);

            exports["default"] = PluginPass;
            module.exports = exports["default"];
        }, { "36": 36, "38": 38, "62": 62, "64": 64, "66": 66, "70": 70 }], 49: [function (_dereq_, module, exports) {
            /* @flow */

            "use strict";

            var _inherits = _dereq_(64)["default"];

            var _classCallCheck = _dereq_(62)["default"];

            var _getIterator = _dereq_(55)["default"];

            var _interopRequireDefault = _dereq_(66)["default"];

            var _interopRequireWildcard = _dereq_(67)["default"];

            exports.__esModule = true;

            var _fileOptionsOptionManager = _dereq_(43);

            var _fileOptionsOptionManager2 = _interopRequireDefault(_fileOptionsOptionManager);

            var _babelMessages = _dereq_(54);

            var messages = _interopRequireWildcard(_babelMessages);

            var _store = _dereq_(36);

            var _store2 = _interopRequireDefault(_store);

            var _babelTraverse = _dereq_(70);

            var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

            var _lodashObjectAssign = _dereq_(221);

            var _lodashObjectAssign2 = _interopRequireDefault(_lodashObjectAssign);

            var _lodashLangClone = _dereq_(208);

            var _lodashLangClone2 = _interopRequireDefault(_lodashLangClone);

            var GLOBAL_VISITOR_PROPS = ["enter", "exit"];

            var Plugin = (function (_Store) {
                _inherits(Plugin, _Store);

                function Plugin(plugin /*: Object*/) {
                    _classCallCheck(this, Plugin);

                    _Store.call(this);

                    this.initialized = false;
                    this.raw = _lodashObjectAssign2["default"]({}, plugin);

                    this.manipulateOptions = this.take("manipulateOptions");
                    this.post = this.take("post");
                    this.pre = this.take("pre");
                    this.visitor = this.normaliseVisitor(_lodashLangClone2["default"](this.take("visitor")) || {});
                }

                Plugin.prototype.take = function take(key) {
                    var val = this.raw[key];
                    delete this.raw[key];
                    return val;
                };

                Plugin.prototype.chain = function chain(target, key) {
                    if (!target[key]) return this[key];
                    if (!this[key]) return target[key];

                    var fns /*: Array<?Function>*/ = [target[key], this[key]];

                    return function () {
                        var val = undefined;

                        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                            args[_key] = arguments[_key];
                        }

                        for (var _iterator = fns, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator); ;) {
                            var _ref;

                            if (_isArray) {
                                if (_i >= _iterator.length) break;
                                _ref = _iterator[_i++];
                            } else {
                                _i = _iterator.next();
                                if (_i.done) break;
                                _ref = _i.value;
                            }

                            var fn = _ref;

                            if (fn) {
                                var ret = fn.apply(this, args);
                                if (ret != null) val = ret;
                            }
                        }
                        return val;
                    };
                };

                Plugin.prototype.maybeInherit = function maybeInherit(loc /*: string*/) {
                    var inherits = this.take("inherits");
                    if (!inherits) return;

                    inherits = _fileOptionsOptionManager2["default"].normalisePlugin(inherits, loc, "inherits");

                    this.manipulateOptions = this.chain(inherits, "manipulateOptions");
                    this.post = this.chain(inherits, "post");
                    this.pre = this.chain(inherits, "pre");
                    this.visitor = _babelTraverse2["default"].visitors.merge([inherits.visitor, this.visitor]);
                };

                /**
                 * We lazy initialise parts of a plugin that rely on contextual information such as
                 * position on disk and how it was specified.
                 */

                Plugin.prototype.init = function init(loc /*: string*/, i /*: number*/) {
                    if (this.initialized) return;
                    this.initialized = true;

                    this.maybeInherit(loc);

                    for (var key in this.raw) {
                        throw new Error(messages.get("pluginInvalidProperty", loc, i, key));
                    }
                };

                Plugin.prototype.normaliseVisitor = function normaliseVisitor(visitor /*: Object*/) /*: Object*/ {
                    for (var _iterator2 = GLOBAL_VISITOR_PROPS, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _getIterator(_iterator2); ;) {
                        var _ref2;

                        if (_isArray2) {
                            if (_i2 >= _iterator2.length) break;
                            _ref2 = _iterator2[_i2++];
                        } else {
                            _i2 = _iterator2.next();
                            if (_i2.done) break;
                            _ref2 = _i2.value;
                        }

                        var key = _ref2;

                        if (visitor[key]) {
                            throw new Error("Plugins aren't allowed to specify catch-all enter/exit handlers. Please target individual nodes.");
                        }
                    }

                    _babelTraverse2["default"].explode(visitor);
                    return visitor;
                };

                return Plugin;
            })(_store2["default"]);

            exports["default"] = Plugin;
            module.exports = exports["default"];
        }, { "208": 208, "221": 221, "36": 36, "43": 43, "54": 54, "55": 55, "62": 62, "64": 64, "66": 66, "67": 67, "70": 70 }], 50: [function (_dereq_, module, exports) {
            /* @flow */

            "use strict";

            var _getIterator = _dereq_(55)["default"];

            var _interopRequireDefault = _dereq_(66)["default"];

            exports.__esModule = true;
            exports.canCompile = canCompile;
            exports.list = list;
            exports.regexify = regexify;
            exports.arrayify = arrayify;
            exports.booleanify = booleanify;
            exports.shouldIgnore = shouldIgnore;

            var _lodashStringEscapeRegExp = _dereq_(228);

            var _lodashStringEscapeRegExp2 = _interopRequireDefault(_lodashStringEscapeRegExp);

            var _lodashStringStartsWith = _dereq_(229);

            var _lodashStringStartsWith2 = _interopRequireDefault(_lodashStringStartsWith);

            var _lodashLangIsBoolean = _dereq_(212);

            var _lodashLangIsBoolean2 = _interopRequireDefault(_lodashLangIsBoolean);

            var _minimatch = _dereq_(232);

            var _minimatch2 = _interopRequireDefault(_minimatch);

            var _lodashCollectionContains = _dereq_(143);

            var _lodashCollectionContains2 = _interopRequireDefault(_lodashCollectionContains);

            var _lodashLangIsString = _dereq_(218);

            var _lodashLangIsString2 = _interopRequireDefault(_lodashLangIsString);

            var _lodashLangIsRegExp = _dereq_(217);

            var _lodashLangIsRegExp2 = _interopRequireDefault(_lodashLangIsRegExp);

            var _path = _dereq_(7);

            var _path2 = _interopRequireDefault(_path);

            var _slash = _dereq_(237);

            var _slash2 = _interopRequireDefault(_slash);

            var _util = _dereq_(11);

            exports.inherits = _util.inherits;
            exports.inspect = _util.inspect;

            /**
             * Test if a filename ends with a compilable extension.
             */

            function canCompile(filename /*: string*/, altExts /*:: ?: Array<string>*/) {
                var exts = altExts || canCompile.EXTENSIONS;
                var ext = _path2["default"].extname(filename);
                return _lodashCollectionContains2["default"](exts, ext);
            }

            /**
             * Default set of compilable extensions.
             */

            canCompile.EXTENSIONS = [".js", ".jsx", ".es6", ".es"];

            /**
             * Create an array from any value, splitting strings by ",".
             */

            function list(val /*:: ?: string*/) /*: Array<string>*/ {
                if (!val) {
                    return [];
                } else if (Array.isArray(val)) {
                    return val;
                } else if (typeof val === "string") {
                    return val.split(",");
                } else {
                    return [val];
                }
            }

            /**
             * Create a RegExp from a string, array, or regexp.
             */

            function regexify(val /*: any*/) /*: RegExp*/ {
                if (!val) {
                    return new RegExp(/.^/);
                }

                if (Array.isArray(val)) {
                    val = new RegExp(val.map(_lodashStringEscapeRegExp2["default"]).join("|"), "i");
                }

                if (typeof val === "string") {
                    // normalise path separators
                    val = _slash2["default"](val);

                    // remove starting wildcards or relative separator if present
                    if (_lodashStringStartsWith2["default"](val, "./") || _lodashStringStartsWith2["default"](val, "*/")) val = val.slice(2);
                    if (_lodashStringStartsWith2["default"](val, "**/")) val = val.slice(3);

                    var regex = _minimatch2["default"].makeRe(val, { nocase: true });
                    return new RegExp(regex.source.slice(1, -1), "i");
                }

                if (_lodashLangIsRegExp2["default"](val)) {
                    return val;
                }

                throw new TypeError("illegal type for regexify");
            }

            /**
             * Create an array from a boolean, string, or array, mapped by and optional function.
             */

            function arrayify(val /*: any*/, mapFn /*:: ?: Function*/) /*: Array<any>*/ {
                if (!val) return [];
                if (_lodashLangIsBoolean2["default"](val)) return arrayify([val], mapFn);
                if (_lodashLangIsString2["default"](val)) return arrayify(list(val), mapFn);

                if (Array.isArray(val)) {
                    if (mapFn) val = val.map(mapFn);
                    return val;
                }

                return [val];
            }

            /**
             * Makes boolean-like strings into booleans.
             */

            function booleanify(val /*: any*/) /*: boolean | any*/ {
                if (val === "true" || val == 1) {
                    return true;
                }

                if (val === "false" || val == 0 || !val) {
                    return false;
                }

                return val;
            }

            /**
             * Tests if a filename should be ignored based on "ignore" and "only" options.
             */

            function shouldIgnore(filename /*: string*/, ignore /*: Array<RegExp | Function>*/, only /*:: ?: Array<RegExp | Function>*/) /*: boolean*/ {
                if (ignore === undefined) ignore = [];

                filename = _slash2["default"](filename);

                if (only) {
                    for (var _iterator = only, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator); ;) {
                        var _ref;

                        if (_isArray) {
                            if (_i >= _iterator.length) break;
                            _ref = _iterator[_i++];
                        } else {
                            _i = _iterator.next();
                            if (_i.done) break;
                            _ref = _i.value;
                        }

                        var pattern = _ref;

                        if (_shouldIgnore(pattern, filename)) return false;
                    }
                    return true;
                } else if (ignore.length) {
                    for (var _iterator2 = ignore, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _getIterator(_iterator2); ;) {
                        var _ref2;

                        if (_isArray2) {
                            if (_i2 >= _iterator2.length) break;
                            _ref2 = _iterator2[_i2++];
                        } else {
                            _i2 = _iterator2.next();
                            if (_i2.done) break;
                            _ref2 = _i2.value;
                        }

                        var pattern = _ref2;

                        if (_shouldIgnore(pattern, filename)) return true;
                    }
                }

                return false;
            }

            /**
             * Returns result of calling function with filename if pattern is a function.
             * Otherwise returns result of matching pattern Regex with filename.
             */

            function _shouldIgnore(pattern /*: Function | RegExp*/, filename /*: string*/) {
                if (typeof pattern === "function") {
                    return pattern(filename);
                } else {
                    return pattern.test(filename);
                }
            }
        }, { "11": 11, "143": 143, "212": 212, "217": 217, "218": 218, "228": 228, "229": 229, "232": 232, "237": 237, "55": 55, "66": 66, "7": 7 }], 51: [function (_dereq_, module, exports) {
            module.exports = _dereq_(12);
        }, { "12": 12 }], 52: [function (_dereq_, module, exports) {
            module.exports = _dereq_(261);
        }, { "261": 261 }], 53: [function (_dereq_, module, exports) {
            module.exports = _dereq_(403);
        }, { "403": 403 }], 54: [function (_dereq_, module, exports) {
            module.exports = _dereq_(418);
        }, { "418": 418 }], 55: [function (_dereq_, module, exports) {
            module.exports = { "default": _dereq_(77), __esModule: true };
        }, { "77": 77 }], 56: [function (_dereq_, module, exports) {
            module.exports = { "default": _dereq_(78), __esModule: true };
        }, { "78": 78 }], 57: [function (_dereq_, module, exports) {
            module.exports = { "default": _dereq_(79), __esModule: true };
        }, { "79": 79 }], 58: [function (_dereq_, module, exports) {
            module.exports = { "default": _dereq_(80), __esModule: true };
        }, { "80": 80 }], 59: [function (_dereq_, module, exports) {
            module.exports = { "default": _dereq_(81), __esModule: true };
        }, { "81": 81 }], 60: [function (_dereq_, module, exports) {
            module.exports = { "default": _dereq_(82), __esModule: true };
        }, { "82": 82 }], 61: [function (_dereq_, module, exports) {
            module.exports = { "default": _dereq_(83), __esModule: true };
        }, { "83": 83 }], 62: [function (_dereq_, module, exports) {
            "use strict";

            exports["default"] = function (instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            };

            exports.__esModule = true;
        }, {}], 63: [function (_dereq_, module, exports) {
            "use strict";

            var _Object$getOwnPropertyNames = _dereq_(60)["default"];

            var _Object$getOwnPropertyDescriptor = _dereq_(59)["default"];

            var _Object$defineProperty = _dereq_(58)["default"];

            exports["default"] = function (obj, defaults) {
                var keys = _Object$getOwnPropertyNames(defaults);

                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];

                    var value = _Object$getOwnPropertyDescriptor(defaults, key);

                    if (value && value.configurable && obj[key] === undefined) {
                        _Object$defineProperty(obj, key, value);
                    }
                }

                return obj;
            };

            exports.__esModule = true;
        }, { "58": 58, "59": 59, "60": 60 }], 64: [function (_dereq_, module, exports) {
            "use strict";

            var _Object$create = _dereq_(57)["default"];

            var _Object$setPrototypeOf = _dereq_(61)["default"];

            exports["default"] = function (subClass, superClass) {
                if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
                }

                subClass.prototype = _Object$create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            };

            exports.__esModule = true;
        }, { "57": 57, "61": 61 }], 65: [function (_dereq_, module, exports) {
            "use strict";

            exports["default"] = function (obj, defaults) {
                var newObj = defaults({}, obj);
                delete newObj["default"];
                return newObj;
            };

            exports.__esModule = true;
        }, {}], 66: [function (_dereq_, module, exports) {
            arguments[4][15][0].apply(exports, arguments)
        }, { "15": 15 }], 67: [function (_dereq_, module, exports) {
            "use strict";

            exports["default"] = function (obj) {
                if (obj && obj.__esModule) {
                    return obj;
                } else {
                    var newObj = {};

                    if (obj != null) {
                        for (var key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                        }
                    }

                    newObj["default"] = obj;
                    return newObj;
                }
            };

            exports.__esModule = true;
        }, {}], 68: [function (_dereq_, module, exports) {
            "use strict";

            exports["default"] = function (obj) {
                return obj && obj.__esModule ? obj["default"] : obj;
            };

            exports.__esModule = true;
        }, {}], 69: [function (_dereq_, module, exports) {
            module.exports = _dereq_(420);
        }, { "420": 420 }], 70: [function (_dereq_, module, exports) {
            module.exports = _dereq_(497);
        }, { "497": 497 }], 71: [function (_dereq_, module, exports) {
            module.exports = _dereq_(645);
        }, { "645": 645 }], 72: [function (_dereq_, module, exports) {
            module.exports = _dereq_(796);
        }, { "796": 796 }], 73: [function (_dereq_, module, exports) {
            module.exports = balanced;
            function balanced(a, b, str) {
                var bal = 0;
                var m = {};
                var ended = false;

                for (var i = 0; i < str.length; i++) {
                    if (a == str.substr(i, a.length)) {
                        if (!('start' in m)) m.start = i;
                        bal++;
                    }
                    else if (b == str.substr(i, b.length) && 'start' in m) {
                        ended = true;
                        bal--;
                        if (!bal) {
                            m.end = i;
                            m.pre = str.substr(0, m.start);
                            m.body = (m.end - m.start > 1)
                                ? str.substring(m.start + a.length, m.end)
                                : '';
                            m.post = str.slice(m.end + b.length);
                            return m;
                        }
                    }
                }

                // if we opened more than we closed, find the one we closed
                if (bal && ended) {
                    var start = m.start + a.length;
                    m = balanced(a, b, str.substr(start));
                    if (m) {
                        m.start += start;
                        m.end += start;
                        m.pre = str.slice(0, start) + m.pre;
                    }
                    return m;
                }
            }

        }, {}], 74: [function (_dereq_, module, exports) {
            var concatMap = _dereq_(75);
            var balanced = _dereq_(73);

            module.exports = expandTop;

            var escSlash = '\0SLASH' + Math.random() + '\0';
            var escOpen = '\0OPEN' + Math.random() + '\0';
            var escClose = '\0CLOSE' + Math.random() + '\0';
            var escComma = '\0COMMA' + Math.random() + '\0';
            var escPeriod = '\0PERIOD' + Math.random() + '\0';

            function numeric(str) {
                return parseInt(str, 10) == str
                    ? parseInt(str, 10)
                    : str.charCodeAt(0);
            }

            function escapeBraces(str) {
                return str.split('\\\\').join(escSlash)
                    .split('\\{').join(escOpen)
                    .split('\\}').join(escClose)
                    .split('\\,').join(escComma)
                    .split('\\.').join(escPeriod);
            }

            function unescapeBraces(str) {
                return str.split(escSlash).join('\\')
                    .split(escOpen).join('{')
                    .split(escClose).join('}')
                    .split(escComma).join(',')
                    .split(escPeriod).join('.');
            }


            // Basically just str.split(","), but handling cases
            // where we have nested braced sections, which should be
            // treated as individual members, like {a,{b,c},d}
            function parseCommaParts(str) {
                if (!str)
                    return [''];

                var parts = [];
                var m = balanced('{', '}', str);

                if (!m)
                    return str.split(',');

                var pre = m.pre;
                var body = m.body;
                var post = m.post;
                var p = pre.split(',');

                p[p.length - 1] += '{' + body + '}';
                var postParts = parseCommaParts(post);
                if (post.length) {
                    p[p.length - 1] += postParts.shift();
                    p.push.apply(p, postParts);
                }

                parts.push.apply(parts, p);

                return parts;
            }

            function expandTop(str) {
                if (!str)
                    return [];

                return expand(escapeBraces(str), true).map(unescapeBraces);
            }

            function identity(e) {
                return e;
            }

            function embrace(str) {
                return '{' + str + '}';
            }
            function isPadded(el) {
                return /^-?0\d/.test(el);
            }

            function lte(i, y) {
                return i <= y;
            }
            function gte(i, y) {
                return i >= y;
            }

            function expand(str, isTop) {
                var expansions = [];

                var m = balanced('{', '}', str);
                if (!m || /\$$/.test(m.pre)) return [str];

                var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
                var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
                var isSequence = isNumericSequence || isAlphaSequence;
                var isOptions = /^(.*,)+(.+)?$/.test(m.body);
                if (!isSequence && !isOptions) {
                    // {a},b}
                    if (m.post.match(/,.*}/)) {
                        str = m.pre + '{' + m.body + escClose + m.post;
                        return expand(str);
                    }
                    return [str];
                }

                var n;
                if (isSequence) {
                    n = m.body.split(/\.\./);
                } else {
                    n = parseCommaParts(m.body);
                    if (n.length === 1) {
                        // x{{a,b}}y ==> x{a}y x{b}y
                        n = expand(n[0], false).map(embrace);
                        if (n.length === 1) {
                            var post = m.post.length
                                ? expand(m.post, false)
                                : [''];
                            return post.map(function (p) {
                                return m.pre + n[0] + p;
                            });
                        }
                    }
                }

                // at this point, n is the parts, and we know it's not a comma set
                // with a single entry.

                // no need to expand pre, since it is guaranteed to be free of brace-sets
                var pre = m.pre;
                var post = m.post.length
                    ? expand(m.post, false)
                    : [''];

                var N;

                if (isSequence) {
                    var x = numeric(n[0]);
                    var y = numeric(n[1]);
                    var width = Math.max(n[0].length, n[1].length)
                    var incr = n.length == 3
                        ? Math.abs(numeric(n[2]))
                        : 1;
                    var test = lte;
                    var reverse = y < x;
                    if (reverse) {
                        incr *= -1;
                        test = gte;
                    }
                    var pad = n.some(isPadded);

                    N = [];

                    for (var i = x; test(i, y); i += incr) {
                        var c;
                        if (isAlphaSequence) {
                            c = String.fromCharCode(i);
                            if (c === '\\')
                                c = '';
                        } else {
                            c = String(i);
                            if (pad) {
                                var need = width - c.length;
                                if (need > 0) {
                                    var z = new Array(need + 1).join('0');
                                    if (i < 0)
                                        c = '-' + z + c.slice(1);
                                    else
                                        c = z + c;
                                }
                            }
                        }
                        N.push(c);
                    }
                } else {
                    N = concatMap(n, function (el) { return expand(el, false) });
                }

                for (var j = 0; j < N.length; j++) {
                    for (var k = 0; k < post.length; k++) {
                        var expansion = pre + N[j] + post[k];
                        if (!isTop || isSequence || expansion)
                            expansions.push(expansion);
                    }
                }

                return expansions;
            }


        }, { "73": 73, "75": 75 }], 75: [function (_dereq_, module, exports) {
            module.exports = function (xs, fn) {
                var res = [];
                for (var i = 0; i < xs.length; i++) {
                    var x = fn(xs[i], i);
                    if (isArray(x)) res.push.apply(res, x);
                    else res.push(x);
                }
                return res;
            };

            var isArray = Array.isArray || function (xs) {
                return Object.prototype.toString.call(xs) === '[object Array]';
            };

        }, {}], 76: [function (_dereq_, module, exports) {
            (function (Buffer) {
                'use strict';
                var fs = _dereq_(2);
                var path = _dereq_(7);

                var commentRx = /^\s*\/(?:\/|\*)[@#]\s+sourceMappingURL=data:(?:application|text)\/json;(?:charset[:=]\S+;)?base64,(.*)$/mg;
                var mapFileCommentRx =
                    // //# sourceMappingURL=foo.js.map                       
                    /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^\*]+?)[ \t]*(?:\*\/){1}[ \t]*$)/mg

                function decodeBase64(base64) {
                    return new Buffer(base64, 'base64').toString();
                }

                function stripComment(sm) {
                    return sm.split(',').pop();
                }

                function readFromFileMap(sm, dir) {
                    // NOTE: this will only work on the server since it attempts to read the map file

                    var r = mapFileCommentRx.exec(sm);
                    mapFileCommentRx.lastIndex = 0;

                    // for some odd reason //# .. captures in 1 and /* .. */ in 2
                    var filename = r[1] || r[2];
                    var filepath = path.join(dir, filename);

                    try {
                        return fs.readFileSync(filepath, 'utf8');
                    } catch (e) {
                        throw new Error('An error occurred while trying to read the map file at ' + filepath + '\n' + e);
                    }
                }

                function Converter(sm, opts) {
                    opts = opts || {};

                    if (opts.isFileComment) sm = readFromFileMap(sm, opts.commentFileDir);
                    if (opts.hasComment) sm = stripComment(sm);
                    if (opts.isEncoded) sm = decodeBase64(sm);
                    if (opts.isJSON || opts.isEncoded) sm = JSON.parse(sm);

                    this.sourcemap = sm;
                }

                function convertFromLargeSource(content) {
                    var lines = content.split('\n');
                    var line;
                    // find first line which contains a source map starting at end of content
                    for (var i = lines.length - 1; i > 0; i--) {
                        line = lines[i]
                        if (~line.indexOf('sourceMappingURL=data:')) return exports.fromComment(line);
                    }
                }

                Converter.prototype.toJSON = function (space) {
                    return JSON.stringify(this.sourcemap, null, space);
                };

                Converter.prototype.toBase64 = function () {
                    var json = this.toJSON();
                    return new Buffer(json).toString('base64');
                };

                Converter.prototype.toComment = function (options) {
                    var base64 = this.toBase64();
                    var data = 'sourceMappingURL=data:application/json;base64,' + base64;
                    return options && options.multiline ? '/*# ' + data + ' */' : '//# ' + data;
                };

                // returns copy instead of original
                Converter.prototype.toObject = function () {
                    return JSON.parse(this.toJSON());
                };

                Converter.prototype.addProperty = function (key, value) {
                    if (this.sourcemap.hasOwnProperty(key)) throw new Error('property %s already exists on the sourcemap, use set property instead');
                    return this.setProperty(key, value);
                };

                Converter.prototype.setProperty = function (key, value) {
                    this.sourcemap[key] = value;
                    return this;
                };

                Converter.prototype.getProperty = function (key) {
                    return this.sourcemap[key];
                };

                exports.fromObject = function (obj) {
                    return new Converter(obj);
                };

                exports.fromJSON = function (json) {
                    return new Converter(json, { isJSON: true });
                };

                exports.fromBase64 = function (base64) {
                    return new Converter(base64, { isEncoded: true });
                };

                exports.fromComment = function (comment) {
                    comment = comment
                        .replace(/^\/\*/g, '//')
                        .replace(/\*\/$/g, '');

                    return new Converter(comment, { isEncoded: true, hasComment: true });
                };

                exports.fromMapFileComment = function (comment, dir) {
                    return new Converter(comment, { commentFileDir: dir, isFileComment: true, isJSON: true });
                };

                // Finds last sourcemap comment in file or returns null if none was found
                exports.fromSource = function (content, largeSource) {
                    if (largeSource) {
                        var res = convertFromLargeSource(content);
                        return res ? res : null;
                    }

                    var m = content.match(commentRx);
                    commentRx.lastIndex = 0;
                    return m ? exports.fromComment(m.pop()) : null;
                };

                // Finds last sourcemap comment in file or returns null if none was found
                exports.fromMapFileSource = function (content, dir) {
                    var m = content.match(mapFileCommentRx);
                    mapFileCommentRx.lastIndex = 0;
                    return m ? exports.fromMapFileComment(m.pop(), dir) : null;
                };

                exports.removeComments = function (src) {
                    commentRx.lastIndex = 0;
                    return src.replace(commentRx, '');
                };

                exports.removeMapFileComments = function (src) {
                    mapFileCommentRx.lastIndex = 0;
                    return src.replace(mapFileCommentRx, '');
                };

                Object.defineProperty(exports, 'commentRegex', {
                    get: function getCommentRegex() {
                        commentRx.lastIndex = 0;
                        return commentRx;
                    }
                });

                Object.defineProperty(exports, 'mapFileCommentRegex', {
                    get: function getMapFileCommentRegex() {
                        mapFileCommentRx.lastIndex = 0;
                        return mapFileCommentRx;
                    }
                });

            }).call(this, _dereq_(3).Buffer)
        }, { "2": 2, "3": 3, "7": 7 }], 77: [function (_dereq_, module, exports) {
            _dereq_(138);
            _dereq_(136);
            module.exports = _dereq_(129);
        }, { "129": 129, "136": 136, "138": 138 }], 78: [function (_dereq_, module, exports) {
            _dereq_(135);
            _dereq_(136);
            _dereq_(138);
            _dereq_(131);
            _dereq_(137);
            module.exports = _dereq_(92).Map;
        }, { "131": 131, "135": 135, "136": 136, "137": 137, "138": 138, "92": 92 }], 79: [function (_dereq_, module, exports) {
            var $ = _dereq_(111);
            module.exports = function create(P, D) {
                return $.create(P, D);
            };
        }, { "111": 111 }], 80: [function (_dereq_, module, exports) {
            var $ = _dereq_(111);
            module.exports = function defineProperty(it, key, desc) {
                return $.setDesc(it, key, desc);
            };
        }, { "111": 111 }], 81: [function (_dereq_, module, exports) {
            var $ = _dereq_(111);
            _dereq_(132);
            module.exports = function getOwnPropertyDescriptor(it, key) {
                return $.getDesc(it, key);
            };
        }, { "111": 111, "132": 132 }], 82: [function (_dereq_, module, exports) {
            var $ = _dereq_(111);
            _dereq_(133);
            module.exports = function getOwnPropertyNames(it) {
                return $.getNames(it);
            };
        }, { "111": 111, "133": 133 }], 83: [function (_dereq_, module, exports) {
            _dereq_(134);
            module.exports = _dereq_(92).Object.setPrototypeOf;
        }, { "134": 134, "92": 92 }], 84: [function (_dereq_, module, exports) {
            module.exports = function (it) {
                if (typeof it != 'function') throw TypeError(it + ' is not a function!');
                return it;
            };
        }, {}], 85: [function (_dereq_, module, exports) {
            module.exports = function () { /* empty */ };
        }, {}], 86: [function (_dereq_, module, exports) {
            var isObject = _dereq_(105);
            module.exports = function (it) {
                if (!isObject(it)) throw TypeError(it + ' is not an object!');
                return it;
            };
        }, { "105": 105 }], 87: [function (_dereq_, module, exports) {
            // getting tag from 19.1.3.6 Object.prototype.toString()
            var cof = _dereq_(88)
                , TAG = _dereq_(127)('toStringTag')
                // ES3 wrong here
                , ARG = cof(function () { return arguments; }()) == 'Arguments';

            module.exports = function (it) {
                var O, T, B;
                return it === undefined ? 'Undefined' : it === null ? 'Null'
                    // @@toStringTag case
                    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
                        // builtinTag case
                        : ARG ? cof(O)
                            // ES3 arguments fallback
                            : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
            };
        }, { "127": 127, "88": 88 }], 88: [function (_dereq_, module, exports) {
            var toString = {}.toString;

            module.exports = function (it) {
                return toString.call(it).slice(8, -1);
            };
        }, {}], 89: [function (_dereq_, module, exports) {
            'use strict';
            var $ = _dereq_(111)
                , hide = _dereq_(102)
                , redefineAll = _dereq_(115)
                , ctx = _dereq_(93)
                , strictNew = _dereq_(121)
                , defined = _dereq_(94)
                , forOf = _dereq_(98)
                , $iterDefine = _dereq_(108)
                , step = _dereq_(109)
                , ID = _dereq_(126)('id')
                , $has = _dereq_(101)
                , isObject = _dereq_(105)
                , setSpecies = _dereq_(118)
                , DESCRIPTORS = _dereq_(95)
                , isExtensible = Object.isExtensible || isObject
                , SIZE = DESCRIPTORS ? '_s' : 'size'
                , id = 0;

            var fastKey = function (it, create) {
                // return primitive with prefix
                if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
                if (!$has(it, ID)) {
                    // can't set id to frozen object
                    if (!isExtensible(it)) return 'F';
                    // not necessary to add id
                    if (!create) return 'E';
                    // add missing object id
                    hide(it, ID, ++id);
                    // return object id with prefix
                } return 'O' + it[ID];
            };

            var getEntry = function (that, key) {
                // fast case
                var index = fastKey(key), entry;
                if (index !== 'F') return that._i[index];
                // frozen object case
                for (entry = that._f; entry; entry = entry.n) {
                    if (entry.k == key) return entry;
                }
            };

            module.exports = {
                getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
                    var C = wrapper(function (that, iterable) {
                        strictNew(that, C, NAME);
                        that._i = $.create(null); // index
                        that._f = undefined;      // first entry
                        that._l = undefined;      // last entry
                        that[SIZE] = 0;           // size
                        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
                    });
                    redefineAll(C.prototype, {
                        // 23.1.3.1 Map.prototype.clear()
                        // 23.2.3.2 Set.prototype.clear()
                        clear: function clear() {
                            for (var that = this, data = that._i, entry = that._f; entry; entry = entry.n) {
                                entry.r = true;
                                if (entry.p) entry.p = entry.p.n = undefined;
                                delete data[entry.i];
                            }
                            that._f = that._l = undefined;
                            that[SIZE] = 0;
                        },
                        // 23.1.3.3 Map.prototype.delete(key)
                        // 23.2.3.4 Set.prototype.delete(value)
                        'delete': function (key) {
                            var that = this
                                , entry = getEntry(that, key);
                            if (entry) {
                                var next = entry.n
                                    , prev = entry.p;
                                delete that._i[entry.i];
                                entry.r = true;
                                if (prev) prev.n = next;
                                if (next) next.p = prev;
                                if (that._f == entry) that._f = next;
                                if (that._l == entry) that._l = prev;
                                that[SIZE]--;
                            } return !!entry;
                        },
                        // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
                        // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
                        forEach: function forEach(callbackfn /*, that = undefined */) {
                            var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
                                , entry;
                            while (entry = entry ? entry.n : this._f) {
                                f(entry.v, entry.k, this);
                                // revert to the last existing entry
                                while (entry && entry.r) entry = entry.p;
                            }
                        },
                        // 23.1.3.7 Map.prototype.has(key)
                        // 23.2.3.7 Set.prototype.has(value)
                        has: function has(key) {
                            return !!getEntry(this, key);
                        }
                    });
                    if (DESCRIPTORS) $.setDesc(C.prototype, 'size', {
                        get: function () {
                            return defined(this[SIZE]);
                        }
                    });
                    return C;
                },
                def: function (that, key, value) {
                    var entry = getEntry(that, key)
                        , prev, index;
                    // change existing entry
                    if (entry) {
                        entry.v = value;
                        // create new entry
                    } else {
                        that._l = entry = {
                            i: index = fastKey(key, true), // <- index
                            k: key,                        // <- key
                            v: value,                      // <- value
                            p: prev = that._l,             // <- previous entry
                            n: undefined,                  // <- next entry
                            r: false                       // <- removed
                        };
                        if (!that._f) that._f = entry;
                        if (prev) prev.n = entry;
                        that[SIZE]++;
                        // add to index
                        if (index !== 'F') that._i[index] = entry;
                    } return that;
                },
                getEntry: getEntry,
                setStrong: function (C, NAME, IS_MAP) {
                    // add .keys, .values, .entries, [@@iterator]
                    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
                    $iterDefine(C, NAME, function (iterated, kind) {
                        this._t = iterated;  // target
                        this._k = kind;      // kind
                        this._l = undefined; // previous
                    }, function () {
                        var that = this
                            , kind = that._k
                            , entry = that._l;
                        // revert to the last existing entry
                        while (entry && entry.r) entry = entry.p;
                        // get next entry
                        if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
                            // or finish the iteration
                            that._t = undefined;
                            return step(1);
                        }
                        // return step by kind
                        if (kind == 'keys') return step(0, entry.k);
                        if (kind == 'values') return step(0, entry.v);
                        return step(0, [entry.k, entry.v]);
                    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

                    // add [@@species], 23.1.2.2, 23.2.2.2
                    setSpecies(NAME);
                }
            };
        }, { "101": 101, "102": 102, "105": 105, "108": 108, "109": 109, "111": 111, "115": 115, "118": 118, "121": 121, "126": 126, "93": 93, "94": 94, "95": 95, "98": 98 }], 90: [function (_dereq_, module, exports) {
            // https://github.com/DavidBruant/Map-Set.prototype.toJSON
            var forOf = _dereq_(98)
                , classof = _dereq_(87);
            module.exports = function (NAME) {
                return function toJSON() {
                    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
                    var arr = [];
                    forOf(this, false, arr.push, arr);
                    return arr;
                };
            };
        }, { "87": 87, "98": 98 }], 91: [function (_dereq_, module, exports) {
            'use strict';
            var $ = _dereq_(111)
                , global = _dereq_(100)
                , $export = _dereq_(96)
                , fails = _dereq_(97)
                , hide = _dereq_(102)
                , redefineAll = _dereq_(115)
                , forOf = _dereq_(98)
                , strictNew = _dereq_(121)
                , isObject = _dereq_(105)
                , setToStringTag = _dereq_(119)
                , DESCRIPTORS = _dereq_(95);

            module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
                var Base = global[NAME]
                    , C = Base
                    , ADDER = IS_MAP ? 'set' : 'add'
                    , proto = C && C.prototype
                    , O = {};
                if (!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
                    new C().entries().next();
                }))) {
                    // create collection constructor
                    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
                    redefineAll(C.prototype, methods);
                } else {
                    C = wrapper(function (target, iterable) {
                        strictNew(target, C, NAME);
                        target._c = new Base;
                        if (iterable != undefined) forOf(iterable, IS_MAP, target[ADDER], target);
                    });
                    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','), function (KEY) {
                        var IS_ADDER = KEY == 'add' || KEY == 'set';
                        if (KEY in proto && !(IS_WEAK && KEY == 'clear')) hide(C.prototype, KEY, function (a, b) {
                            if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
                            var result = this._c[KEY](a === 0 ? 0 : a, b);
                            return IS_ADDER ? this : result;
                        });
                    });
                    if ('size' in proto) $.setDesc(C.prototype, 'size', {
                        get: function () {
                            return this._c.size;
                        }
                    });
                }

                setToStringTag(C, NAME);

                O[NAME] = C;
                $export($export.G + $export.W + $export.F, O);

                if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

                return C;
            };
        }, { "100": 100, "102": 102, "105": 105, "111": 111, "115": 115, "119": 119, "121": 121, "95": 95, "96": 96, "97": 97, "98": 98 }], 92: [function (_dereq_, module, exports) {
            var core = module.exports = { version: '1.2.6' };
            if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
        }, {}], 93: [function (_dereq_, module, exports) {
            // optional / simple context binding
            var aFunction = _dereq_(84);
            module.exports = function (fn, that, length) {
                aFunction(fn);
                if (that === undefined) return fn;
                switch (length) {
                    case 1: return function (a) {
                        return fn.call(that, a);
                    };
                    case 2: return function (a, b) {
                        return fn.call(that, a, b);
                    };
                    case 3: return function (a, b, c) {
                        return fn.call(that, a, b, c);
                    };
                }
                return function (/* ...args */) {
                    return fn.apply(that, arguments);
                };
            };
        }, { "84": 84 }], 94: [function (_dereq_, module, exports) {
            // 7.2.1 RequireObjectCoercible(argument)
            module.exports = function (it) {
                if (it == undefined) throw TypeError("Can't call method on  " + it);
                return it;
            };
        }, {}], 95: [function (_dereq_, module, exports) {
            // Thank's IE8 for his funny defineProperty
            module.exports = !_dereq_(97)(function () {
                return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
            });
        }, { "97": 97 }], 96: [function (_dereq_, module, exports) {
            var global = _dereq_(100)
                , core = _dereq_(92)
                , ctx = _dereq_(93)
                , PROTOTYPE = 'prototype';

            var $export = function (type, name, source) {
                var IS_FORCED = type & $export.F
                    , IS_GLOBAL = type & $export.G
                    , IS_STATIC = type & $export.S
                    , IS_PROTO = type & $export.P
                    , IS_BIND = type & $export.B
                    , IS_WRAP = type & $export.W
                    , exports = IS_GLOBAL ? core : core[name] || (core[name] = {})
                    , target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
                    , key, own, out;
                if (IS_GLOBAL) source = name;
                for (key in source) {
                    // contains in native
                    own = !IS_FORCED && target && key in target;
                    if (own && key in exports) continue;
                    // export native or passed
                    out = own ? target[key] : source[key];
                    // prevent global pollution for namespaces
                    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
                        // bind timers to global for call from export context
                        : IS_BIND && own ? ctx(out, global)
                            // wrap global constructors for prevent change them in library
                            : IS_WRAP && target[key] == out ? (function (C) {
                                var F = function (param) {
                                    return this instanceof C ? new C(param) : C(param);
                                };
                                F[PROTOTYPE] = C[PROTOTYPE];
                                return F;
                                // make static versions for prototype methods
                            })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
                    if (IS_PROTO) (exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
                }
            };
            // type bitmap
            $export.F = 1;  // forced
            $export.G = 2;  // global
            $export.S = 4;  // static
            $export.P = 8;  // proto
            $export.B = 16; // bind
            $export.W = 32; // wrap
            module.exports = $export;
        }, { "100": 100, "92": 92, "93": 93 }], 97: [function (_dereq_, module, exports) {
            module.exports = function (exec) {
                try {
                    return !!exec();
                } catch (e) {
                    return true;
                }
            };
        }, {}], 98: [function (_dereq_, module, exports) {
            var ctx = _dereq_(93)
                , call = _dereq_(106)
                , isArrayIter = _dereq_(104)
                , anObject = _dereq_(86)
                , toLength = _dereq_(125)
                , getIterFn = _dereq_(128);
            module.exports = function (iterable, entries, fn, that) {
                var iterFn = getIterFn(iterable)
                    , f = ctx(fn, that, entries ? 2 : 1)
                    , index = 0
                    , length, step, iterator;
                if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
                // fast case for arrays with default iterator
                if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
                    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
                } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
                    call(iterator, f, step.value, entries);
                }
            };
        }, { "104": 104, "106": 106, "125": 125, "128": 128, "86": 86, "93": 93 }], 99: [function (_dereq_, module, exports) {
            // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
            var toIObject = _dereq_(124)
                , getNames = _dereq_(111).getNames
                , toString = {}.toString;

            var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
                ? Object.getOwnPropertyNames(window) : [];

            var getWindowNames = function (it) {
                try {
                    return getNames(it);
                } catch (e) {
                    return windowNames.slice();
                }
            };

            module.exports.get = function getOwnPropertyNames(it) {
                if (windowNames && toString.call(it) == '[object Window]') return getWindowNames(it);
                return getNames(toIObject(it));
            };
        }, { "111": 111, "124": 124 }], 100: [function (_dereq_, module, exports) {
            // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
            var global = module.exports = typeof window != 'undefined' && window.Math == Math
                ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
            if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
        }, {}], 101: [function (_dereq_, module, exports) {
            var hasOwnProperty = {}.hasOwnProperty;
            module.exports = function (it, key) {
                return hasOwnProperty.call(it, key);
            };
        }, {}], 102: [function (_dereq_, module, exports) {
            var $ = _dereq_(111)
                , createDesc = _dereq_(114);
            module.exports = _dereq_(95) ? function (object, key, value) {
                return $.setDesc(object, key, createDesc(1, value));
            } : function (object, key, value) {
                object[key] = value;
                return object;
            };
        }, { "111": 111, "114": 114, "95": 95 }], 103: [function (_dereq_, module, exports) {
            // fallback for non-array-like ES3 and non-enumerable old V8 strings
            var cof = _dereq_(88);
            module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
                return cof(it) == 'String' ? it.split('') : Object(it);
            };
        }, { "88": 88 }], 104: [function (_dereq_, module, exports) {
            // check on default Array iterator
            var Iterators = _dereq_(110)
                , ITERATOR = _dereq_(127)('iterator')
                , ArrayProto = Array.prototype;

            module.exports = function (it) {
                return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
            };
        }, { "110": 110, "127": 127 }], 105: [function (_dereq_, module, exports) {
            module.exports = function (it) {
                return typeof it === 'object' ? it !== null : typeof it === 'function';
            };
        }, {}], 106: [function (_dereq_, module, exports) {
            // call something on iterator step with safe closing on error
            var anObject = _dereq_(86);
            module.exports = function (iterator, fn, value, entries) {
                try {
                    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
                    // 7.4.6 IteratorClose(iterator, completion)
                } catch (e) {
                    var ret = iterator['return'];
                    if (ret !== undefined) anObject(ret.call(iterator));
                    throw e;
                }
            };
        }, { "86": 86 }], 107: [function (_dereq_, module, exports) {
            'use strict';
            var $ = _dereq_(111)
                , descriptor = _dereq_(114)
                , setToStringTag = _dereq_(119)
                , IteratorPrototype = {};

            // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
            _dereq_(102)(IteratorPrototype, _dereq_(127)('iterator'), function () { return this; });

            module.exports = function (Constructor, NAME, next) {
                Constructor.prototype = $.create(IteratorPrototype, { next: descriptor(1, next) });
                setToStringTag(Constructor, NAME + ' Iterator');
            };
        }, { "102": 102, "111": 111, "114": 114, "119": 119, "127": 127 }], 108: [function (_dereq_, module, exports) {
            'use strict';
            var LIBRARY = _dereq_(112)
                , $export = _dereq_(96)
                , redefine = _dereq_(116)
                , hide = _dereq_(102)
                , has = _dereq_(101)
                , Iterators = _dereq_(110)
                , $iterCreate = _dereq_(107)
                , setToStringTag = _dereq_(119)
                , getProto = _dereq_(111).getProto
                , ITERATOR = _dereq_(127)('iterator')
                , BUGGY = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
                , FF_ITERATOR = '@@iterator'
                , KEYS = 'keys'
                , VALUES = 'values';

            var returnThis = function () { return this; };

            module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
                $iterCreate(Constructor, NAME, next);
                var getMethod = function (kind) {
                    if (!BUGGY && kind in proto) return proto[kind];
                    switch (kind) {
                        case KEYS: return function keys() { return new Constructor(this, kind); };
                        case VALUES: return function values() { return new Constructor(this, kind); };
                    } return function entries() { return new Constructor(this, kind); };
                };
                var TAG = NAME + ' Iterator'
                    , DEF_VALUES = DEFAULT == VALUES
                    , VALUES_BUG = false
                    , proto = Base.prototype
                    , $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
                    , $default = $native || getMethod(DEFAULT)
                    , methods, key;
                // Fix native
                if ($native) {
                    var IteratorPrototype = getProto($default.call(new Base));
                    // Set @@toStringTag to native iterators
                    setToStringTag(IteratorPrototype, TAG, true);
                    // FF fix
                    if (!LIBRARY && has(proto, FF_ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
                    // fix Array#{values, @@iterator}.name in V8 / FF
                    if (DEF_VALUES && $native.name !== VALUES) {
                        VALUES_BUG = true;
                        $default = function values() { return $native.call(this); };
                    }
                }
                // Define iterator
                if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
                    hide(proto, ITERATOR, $default);
                }
                // Plug for library
                Iterators[NAME] = $default;
                Iterators[TAG] = returnThis;
                if (DEFAULT) {
                    methods = {
                        values: DEF_VALUES ? $default : getMethod(VALUES),
                        keys: IS_SET ? $default : getMethod(KEYS),
                        entries: !DEF_VALUES ? $default : getMethod('entries')
                    };
                    if (FORCED) for (key in methods) {
                        if (!(key in proto)) redefine(proto, key, methods[key]);
                    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
                }
                return methods;
            };
        }, { "101": 101, "102": 102, "107": 107, "110": 110, "111": 111, "112": 112, "116": 116, "119": 119, "127": 127, "96": 96 }], 109: [function (_dereq_, module, exports) {
            module.exports = function (done, value) {
                return { value: value, done: !!done };
            };
        }, {}], 110: [function (_dereq_, module, exports) {
            module.exports = {};
        }, {}], 111: [function (_dereq_, module, exports) {
            var $Object = Object;
            module.exports = {
                create: $Object.create,
                getProto: $Object.getPrototypeOf,
                isEnum: {}.propertyIsEnumerable,
                getDesc: $Object.getOwnPropertyDescriptor,
                setDesc: $Object.defineProperty,
                setDescs: $Object.defineProperties,
                getKeys: $Object.keys,
                getNames: $Object.getOwnPropertyNames,
                getSymbols: $Object.getOwnPropertySymbols,
                each: [].forEach
            };
        }, {}], 112: [function (_dereq_, module, exports) {
            module.exports = true;
        }, {}], 113: [function (_dereq_, module, exports) {
            // most Object methods by ES6 should accept primitives
            var $export = _dereq_(96)
                , core = _dereq_(92)
                , fails = _dereq_(97);
            module.exports = function (KEY, exec) {
                var fn = (core.Object || {})[KEY] || Object[KEY]
                    , exp = {};
                exp[KEY] = exec(fn);
                $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
            };
        }, { "92": 92, "96": 96, "97": 97 }], 114: [function (_dereq_, module, exports) {
            module.exports = function (bitmap, value) {
                return {
                    enumerable: !(bitmap & 1),
                    configurable: !(bitmap & 2),
                    writable: !(bitmap & 4),
                    value: value
                };
            };
        }, {}], 115: [function (_dereq_, module, exports) {
            var redefine = _dereq_(116);
            module.exports = function (target, src) {
                for (var key in src) redefine(target, key, src[key]);
                return target;
            };
        }, { "116": 116 }], 116: [function (_dereq_, module, exports) {
            module.exports = _dereq_(102);
        }, { "102": 102 }], 117: [function (_dereq_, module, exports) {
            // Works with __proto__ only. Old v8 can't work with null proto objects.
            /* eslint-disable no-proto */
            var getDesc = _dereq_(111).getDesc
                , isObject = _dereq_(105)
                , anObject = _dereq_(86);
            var check = function (O, proto) {
                anObject(O);
                if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
            };
            module.exports = {
                set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
                    function (test, buggy, set) {
                        try {
                            set = _dereq_(93)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
                            set(test, []);
                            buggy = !(test instanceof Array);
                        } catch (e) { buggy = true; }
                        return function setPrototypeOf(O, proto) {
                            check(O, proto);
                            if (buggy) O.__proto__ = proto;
                            else set(O, proto);
                            return O;
                        };
                    }({}, false) : undefined),
                check: check
            };
        }, { "105": 105, "111": 111, "86": 86, "93": 93 }], 118: [function (_dereq_, module, exports) {
            'use strict';
            var core = _dereq_(92)
                , $ = _dereq_(111)
                , DESCRIPTORS = _dereq_(95)
                , SPECIES = _dereq_(127)('species');

            module.exports = function (KEY) {
                var C = core[KEY];
                if (DESCRIPTORS && C && !C[SPECIES]) $.setDesc(C, SPECIES, {
                    configurable: true,
                    get: function () { return this; }
                });
            };
        }, { "111": 111, "127": 127, "92": 92, "95": 95 }], 119: [function (_dereq_, module, exports) {
            var def = _dereq_(111).setDesc
                , has = _dereq_(101)
                , TAG = _dereq_(127)('toStringTag');

            module.exports = function (it, tag, stat) {
                if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
            };
        }, { "101": 101, "111": 111, "127": 127 }], 120: [function (_dereq_, module, exports) {
            var global = _dereq_(100)
                , SHARED = '__core-js_shared__'
                , store = global[SHARED] || (global[SHARED] = {});
            module.exports = function (key) {
                return store[key] || (store[key] = {});
            };
        }, { "100": 100 }], 121: [function (_dereq_, module, exports) {
            module.exports = function (it, Constructor, name) {
                if (!(it instanceof Constructor)) throw TypeError(name + ": use the 'new' operator!");
                return it;
            };
        }, {}], 122: [function (_dereq_, module, exports) {
            var toInteger = _dereq_(123)
                , defined = _dereq_(94);
            // true  -> String#at
            // false -> String#codePointAt
            module.exports = function (TO_STRING) {
                return function (that, pos) {
                    var s = String(defined(that))
                        , i = toInteger(pos)
                        , l = s.length
                        , a, b;
                    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
                    a = s.charCodeAt(i);
                    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
                        ? TO_STRING ? s.charAt(i) : a
                        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
                };
            };
        }, { "123": 123, "94": 94 }], 123: [function (_dereq_, module, exports) {
            // 7.1.4 ToInteger
            var ceil = Math.ceil
                , floor = Math.floor;
            module.exports = function (it) {
                return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
            };
        }, {}], 124: [function (_dereq_, module, exports) {
            // to indexed object, toObject with fallback for non-array-like ES3 strings
            var IObject = _dereq_(103)
                , defined = _dereq_(94);
            module.exports = function (it) {
                return IObject(defined(it));
            };
        }, { "103": 103, "94": 94 }], 125: [function (_dereq_, module, exports) {
            // 7.1.15 ToLength
            var toInteger = _dereq_(123)
                , min = Math.min;
            module.exports = function (it) {
                return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
            };
        }, { "123": 123 }], 126: [function (_dereq_, module, exports) {
            var id = 0
                , px = Math.random();
            module.exports = function (key) {
                return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
            };
        }, {}], 127: [function (_dereq_, module, exports) {
            var store = _dereq_(120)('wks')
                , uid = _dereq_(126)
                , Symbol = _dereq_(100).Symbol;
            module.exports = function (name) {
                return store[name] || (store[name] =
                    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
            };
        }, { "100": 100, "120": 120, "126": 126 }], 128: [function (_dereq_, module, exports) {
            var classof = _dereq_(87)
                , ITERATOR = _dereq_(127)('iterator')
                , Iterators = _dereq_(110);
            module.exports = _dereq_(92).getIteratorMethod = function (it) {
                if (it != undefined) return it[ITERATOR]
                    || it['@@iterator']
                    || Iterators[classof(it)];
            };
        }, { "110": 110, "127": 127, "87": 87, "92": 92 }], 129: [function (_dereq_, module, exports) {
            var anObject = _dereq_(86)
                , get = _dereq_(128);
            module.exports = _dereq_(92).getIterator = function (it) {
                var iterFn = get(it);
                if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
                return anObject(iterFn.call(it));
            };
        }, { "128": 128, "86": 86, "92": 92 }], 130: [function (_dereq_, module, exports) {
            'use strict';
            var addToUnscopables = _dereq_(85)
                , step = _dereq_(109)
                , Iterators = _dereq_(110)
                , toIObject = _dereq_(124);

            // 22.1.3.4 Array.prototype.entries()
            // 22.1.3.13 Array.prototype.keys()
            // 22.1.3.29 Array.prototype.values()
            // 22.1.3.30 Array.prototype[@@iterator]()
            module.exports = _dereq_(108)(Array, 'Array', function (iterated, kind) {
                this._t = toIObject(iterated); // target
                this._i = 0;                   // next index
                this._k = kind;                // kind
                // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
            }, function () {
                var O = this._t
                    , kind = this._k
                    , index = this._i++;
                if (!O || index >= O.length) {
                    this._t = undefined;
                    return step(1);
                }
                if (kind == 'keys') return step(0, index);
                if (kind == 'values') return step(0, O[index]);
                return step(0, [index, O[index]]);
            }, 'values');

            // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
            Iterators.Arguments = Iterators.Array;

            addToUnscopables('keys');
            addToUnscopables('values');
            addToUnscopables('entries');
        }, { "108": 108, "109": 109, "110": 110, "124": 124, "85": 85 }], 131: [function (_dereq_, module, exports) {
            'use strict';
            var strong = _dereq_(89);

            // 23.1 Map Objects
            _dereq_(91)('Map', function (get) {
                return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
            }, {
                    // 23.1.3.6 Map.prototype.get(key)
                    get: function get(key) {
                        var entry = strong.getEntry(this, key);
                        return entry && entry.v;
                    },
                    // 23.1.3.9 Map.prototype.set(key, value)
                    set: function set(key, value) {
                        return strong.def(this, key === 0 ? 0 : key, value);
                    }
                }, strong, true);
        }, { "89": 89, "91": 91 }], 132: [function (_dereq_, module, exports) {
            // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
            var toIObject = _dereq_(124);

            _dereq_(113)('getOwnPropertyDescriptor', function ($getOwnPropertyDescriptor) {
                return function getOwnPropertyDescriptor(it, key) {
                    return $getOwnPropertyDescriptor(toIObject(it), key);
                };
            });
        }, { "113": 113, "124": 124 }], 133: [function (_dereq_, module, exports) {
            // 19.1.2.7 Object.getOwnPropertyNames(O)
            _dereq_(113)('getOwnPropertyNames', function () {
                return _dereq_(99).get;
            });
        }, { "113": 113, "99": 99 }], 134: [function (_dereq_, module, exports) {
            // 19.1.3.19 Object.setPrototypeOf(O, proto)
            var $export = _dereq_(96);
            $export($export.S, 'Object', { setPrototypeOf: _dereq_(117).set });
        }, { "117": 117, "96": 96 }], 135: [function (_dereq_, module, exports) {
            arguments[4][2][0].apply(exports, arguments)
        }, { "2": 2 }], 136: [function (_dereq_, module, exports) {
            'use strict';
            var $at = _dereq_(122)(true);

            // 21.1.3.27 String.prototype[@@iterator]()
            _dereq_(108)(String, 'String', function (iterated) {
                this._t = String(iterated); // target
                this._i = 0;                // next index
                // 21.1.5.2.1 %StringIteratorPrototype%.next()
            }, function () {
                var O = this._t
                    , index = this._i
                    , point;
                if (index >= O.length) return { value: undefined, done: true };
                point = $at(O, index);
                this._i += point.length;
                return { value: point, done: false };
            });
        }, { "108": 108, "122": 122 }], 137: [function (_dereq_, module, exports) {
            // https://github.com/DavidBruant/Map-Set.prototype.toJSON
            var $export = _dereq_(96);

            $export($export.P, 'Map', { toJSON: _dereq_(90)('Map') });
        }, { "90": 90, "96": 96 }], 138: [function (_dereq_, module, exports) {
            _dereq_(130);
            var Iterators = _dereq_(110);
            Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
        }, { "110": 110, "130": 130 }], 139: [function (_dereq_, module, exports) {

            /**
             * This is the common logic for both the Node.js and web browser
             * implementations of `debug()`.
             *
             * Expose `debug()` as the module.
             */

            exports = module.exports = debug;
            exports.coerce = coerce;
            exports.disable = disable;
            exports.enable = enable;
            exports.enabled = enabled;
            exports.humanize = _dereq_(233);

            /**
             * The currently active debug mode names, and names to skip.
             */

            exports.names = [];
            exports.skips = [];

            /**
             * Map of special "%n" handling functions, for the debug "format" argument.
             *
             * Valid key names are a single, lowercased letter, i.e. "n".
             */

            exports.formatters = {};

            /**
             * Previously assigned color.
             */

            var prevColor = 0;

            /**
             * Previous log timestamp.
             */

            var prevTime;

            /**
             * Select a color.
             *
             * @return {Number}
             * @api private
             */

            function selectColor() {
                return exports.colors[prevColor++ % exports.colors.length];
            }

            /**
             * Create a debugger with the given `namespace`.
             *
             * @param {String} namespace
             * @return {Function}
             * @api public
             */

            function debug(namespace) {

                // define the `disabled` version
                function disabled() {
                }
                disabled.enabled = false;

                // define the `enabled` version
                function enabled() {

                    var self = enabled;

                    // set `diff` timestamp
                    var curr = +new Date();
                    var ms = curr - (prevTime || curr);
                    self.diff = ms;
                    self.prev = prevTime;
                    self.curr = curr;
                    prevTime = curr;

                    // add the `color` if not set
                    if (null == self.useColors) self.useColors = exports.useColors();
                    if (null == self.color && self.useColors) self.color = selectColor();

                    var args = Array.prototype.slice.call(arguments);

                    args[0] = exports.coerce(args[0]);

                    if ('string' !== typeof args[0]) {
                        // anything else let's inspect with %o
                        args = ['%o'].concat(args);
                    }

                    // apply any `formatters` transformations
                    var index = 0;
                    args[0] = args[0].replace(/%([a-z%])/g, function (match, format) {
                        // if we encounter an escaped % then don't increase the array index
                        if (match === '%%') return match;
                        index++;
                        var formatter = exports.formatters[format];
                        if ('function' === typeof formatter) {
                            var val = args[index];
                            match = formatter.call(self, val);

                            // now we need to remove `args[index]` since it's inlined in the `format`
                            args.splice(index, 1);
                            index--;
                        }
                        return match;
                    });

                    if ('function' === typeof exports.formatArgs) {
                        args = exports.formatArgs.apply(self, args);
                    }
                    var logFn = enabled.log || exports.log || console.log.bind(console);
                    logFn.apply(self, args);
                }
                enabled.enabled = true;

                var fn = exports.enabled(namespace) ? enabled : disabled;

                fn.namespace = namespace;

                return fn;
            }

            /**
             * Enables a debug mode by namespaces. This can include modes
             * separated by a colon and wildcards.
             *
             * @param {String} namespaces
             * @api public
             */

            function enable(namespaces) {
                exports.save(namespaces);

                var split = (namespaces || '').split(/[\s,]+/);
                var len = split.length;

                for (var i = 0; i < len; i++) {
                    if (!split[i]) continue; // ignore empty strings
                    namespaces = split[i].replace(/\*/g, '.*?');
                    if (namespaces[0] === '-') {
                        exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
                    } else {
                        exports.names.push(new RegExp('^' + namespaces + '$'));
                    }
                }
            }

            /**
             * Disable debug output.
             *
             * @api public
             */

            function disable() {
                exports.enable('');
            }

            /**
             * Returns true if the given mode name is enabled, false otherwise.
             *
             * @param {String} name
             * @return {Boolean}
             * @api public
             */

            function enabled(name) {
                var i, len;
                for (i = 0, len = exports.skips.length; i < len; i++) {
                    if (exports.skips[i].test(name)) {
                        return false;
                    }
                }
                for (i = 0, len = exports.names.length; i < len; i++) {
                    if (exports.names[i].test(name)) {
                        return true;
                    }
                }
                return false;
            }

            /**
             * Coerce `val`.
             *
             * @param {Mixed} val
             * @return {Mixed}
             * @api private
             */

            function coerce(val) {
                if (val instanceof Error) return val.stack || val.message;
                return val;
            }

        }, { "233": 233 }], 140: [function (_dereq_, module, exports) {
            (function (process) {

                /**
                 * Module dependencies.
                 */

                var tty = _dereq_(9);
                var util = _dereq_(11);

                /**
                 * This is the Node.js implementation of `debug()`.
                 *
                 * Expose `debug()` as the module.
                 */

                exports = module.exports = _dereq_(139);
                exports.log = log;
                exports.formatArgs = formatArgs;
                exports.save = save;
                exports.load = load;
                exports.useColors = useColors;

                /**
                 * Colors.
                 */

                exports.colors = [6, 2, 3, 4, 5, 1];

                /**
                 * The file descriptor to write the `debug()` calls to.
                 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
                 *
                 *   $ DEBUG_FD=3 node script.js 3>debug.log
                 */

                var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
                var stream = 1 === fd ? process.stdout :
                    2 === fd ? process.stderr :
                        createWritableStdioStream(fd);

                /**
                 * Is stdout a TTY? Colored output is enabled when `true`.
                 */

                function useColors() {
                    var debugColors = (process.env.DEBUG_COLORS || '').trim().toLowerCase();
                    if (0 === debugColors.length) {
                        return tty.isatty(fd);
                    } else {
                        return '0' !== debugColors
                            && 'no' !== debugColors
                            && 'false' !== debugColors
                            && 'disabled' !== debugColors;
                    }
                }

                /**
                 * Map %o to `util.inspect()`, since Node doesn't do that out of the box.
                 */

                var inspect = (4 === util.inspect.length ?
                    // node <= 0.8.x
                    function (v, colors) {
                        return util.inspect(v, void 0, void 0, colors);
                    } :
                    // node > 0.8.x
                    function (v, colors) {
                        return util.inspect(v, { colors: colors });
                    }
                );

                exports.formatters.o = function (v) {
                    return inspect(v, this.useColors)
                        .replace(/\s*\n\s*/g, ' ');
                };

                /**
                 * Adds ANSI color escape codes if enabled.
                 *
                 * @api public
                 */

                function formatArgs() {
                    var args = arguments;
                    var useColors = this.useColors;
                    var name = this.namespace;

                    if (useColors) {
                        var c = this.color;

                        args[0] = '  \u001b[3' + c + ';1m' + name + ' '
                            + '\u001b[0m'
                            + args[0] + '\u001b[3' + c + 'm'
                            + ' +' + exports.humanize(this.diff) + '\u001b[0m';
                    } else {
                        args[0] = new Date().toUTCString()
                            + ' ' + name + ' ' + args[0];
                    }
                    return args;
                }

                /**
                 * Invokes `console.error()` with the specified arguments.
                 */

                function log() {
                    return stream.write(util.format.apply(this, arguments) + '\n');
                }

                /**
                 * Save `namespaces`.
                 *
                 * @param {String} namespaces
                 * @api private
                 */

                function save(namespaces) {
                    if (null == namespaces) {
                        // If you set a process.env field to null or undefined, it gets cast to the
                        // string 'null' or 'undefined'. Just delete instead.
                        delete process.env.DEBUG;
                    } else {
                        process.env.DEBUG = namespaces;
                    }
                }

                /**
                 * Load `namespaces`.
                 *
                 * @return {String} returns the previously persisted debug modes
                 * @api private
                 */

                function load() {
                    return process.env.DEBUG;
                }

                /**
                 * Copied from `node/src/node.js`.
                 *
                 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
                 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
                 */

                function createWritableStdioStream(fd) {
                    var stream;
                    var tty_wrap = process.binding('tty_wrap');

                    // Note stream._type is used for test-module-load-list.js

                    switch (tty_wrap.guessHandleType(fd)) {
                        case 'TTY':
                            stream = new tty.WriteStream(fd);
                            stream._type = 'tty';

                            // Hack to have stream not keep the event loop alive.
                            // See https://github.com/joyent/node/issues/1726
                            if (stream._handle && stream._handle.unref) {
                                stream._handle.unref();
                            }
                            break;

                        case 'FILE':
                            var fs = _dereq_(2);
                            stream = new fs.SyncWriteStream(fd, { autoClose: false });
                            stream._type = 'fs';
                            break;

                        case 'PIPE':
                        case 'TCP':
                            var net = _dereq_(2);
                            stream = new net.Socket({
                                fd: fd,
                                readable: false,
                                writable: true
                            });

                            // FIXME Should probably have an option in net.Socket to create a
                            // stream from an existing fd which is writable only. But for now
                            // we'll just add this hack and set the `readable` member to false.
                            // Test: ./node test/fixtures/echo.js < /etc/passwd
                            stream.readable = false;
                            stream.read = null;
                            stream._type = 'pipe';

                            // FIXME Hack to have stream not keep the event loop alive.
                            // See https://github.com/joyent/node/issues/1726
                            if (stream._handle && stream._handle.unref) {
                                stream._handle.unref();
                            }
                            break;

                        default:
                            // Probably an error on in uv_guess_handle()
                            throw new Error('Implement me. Unknown stream file type!');
                    }

                    // For supporting legacy API we put the FD here.
                    stream.fd = fd;

                    stream._isStdio = true;

                    return stream;
                }

                /**
                 * Enable namespaces listed in `process.env.DEBUG` initially.
                 */

                exports.enable(load());

            }).call(this, _dereq_(8))
        }, { "11": 11, "139": 139, "2": 2, "8": 8, "9": 9 }], 141: [function (_dereq_, module, exports) {
            // json5.js
            // Modern JSON. See README.md for details.
            //
            // This file is based directly off of Douglas Crockford's json_parse.js:
            // https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js

            var JSON5 = (typeof exports === 'object' ? exports : {});

            JSON5.parse = (function () {
                "use strict";

                // This is a function that can parse a JSON5 text, producing a JavaScript
                // data structure. It is a simple, recursive descent parser. It does not use
                // eval or regular expressions, so it can be used as a model for implementing
                // a JSON5 parser in other languages.

                // We are defining the function inside of another function to avoid creating
                // global variables.

                var at,     // The index of the current character
                    ch,     // The current character
                    escapee = {
                        "'": "'",
                        '"': '"',
                        '\\': '\\',
                        '/': '/',
                        '\n': '',       // Replace escaped newlines in strings w/ empty string
                        b: '\b',
                        f: '\f',
                        n: '\n',
                        r: '\r',
                        t: '\t'
                    },
                    ws = [
                        ' ',
                        '\t',
                        '\r',
                        '\n',
                        '\v',
                        '\f',
                        '\xA0',
                        '\uFEFF'
                    ],
                    text,

                    error = function (m) {

                        // Call error when something is wrong.

                        var error = new SyntaxError();
                        error.message = m;
                        error.at = at;
                        error.text = text;
                        throw error;
                    },

                    next = function (c) {

                        // If a c parameter is provided, verify that it matches the current character.

                        if (c && c !== ch) {
                            error("Expected '" + c + "' instead of '" + ch + "'");
                        }

                        // Get the next character. When there are no more characters,
                        // return the empty string.

                        ch = text.charAt(at);
                        at += 1;
                        return ch;
                    },

                    peek = function () {

                        // Get the next character without consuming it or
                        // assigning it to the ch varaible.

                        return text.charAt(at);
                    },

                    identifier = function () {

                        // Parse an identifier. Normally, reserved words are disallowed here, but we
                        // only use this for unquoted object keys, where reserved words are allowed,
                        // so we don't check for those here. References:
                        // - http://es5.github.com/#x7.6
                        // - https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Core_Language_Features#Variables
                        // - http://docstore.mik.ua/orelly/webprog/jscript/ch02_07.htm
                        // TODO Identifiers can have Unicode "letters" in them; add support for those.

                        var key = ch;

                        // Identifiers must start with a letter, _ or $.
                        if ((ch !== '_' && ch !== '$') &&
                            (ch < 'a' || ch > 'z') &&
                            (ch < 'A' || ch > 'Z')) {
                            error("Bad identifier");
                        }

                        // Subsequent characters can contain digits.
                        while (next() && (
                            ch === '_' || ch === '$' ||
                            (ch >= 'a' && ch <= 'z') ||
                            (ch >= 'A' && ch <= 'Z') ||
                            (ch >= '0' && ch <= '9'))) {
                            key += ch;
                        }

                        return key;
                    },

                    number = function () {

                        // Parse a number value.

                        var number,
                            sign = '',
                            string = '',
                            base = 10;

                        if (ch === '-' || ch === '+') {
                            sign = ch;
                            next(ch);
                        }

                        // support for Infinity (could tweak to allow other words):
                        if (ch === 'I') {
                            number = word();
                            if (typeof number !== 'number' || isNaN(number)) {
                                error('Unexpected word for number');
                            }
                            return (sign === '-') ? -number : number;
                        }

                        // support for NaN
                        if (ch === 'N') {
                            number = word();
                            if (!isNaN(number)) {
                                error('expected word to be NaN');
                            }
                            // ignore sign as -NaN also is NaN
                            return number;
                        }

                        if (ch === '0') {
                            string += ch;
                            next();
                            if (ch === 'x' || ch === 'X') {
                                string += ch;
                                next();
                                base = 16;
                            } else if (ch >= '0' && ch <= '9') {
                                error('Octal literal');
                            }
                        }

                        switch (base) {
                            case 10:
                                while (ch >= '0' && ch <= '9') {
                                    string += ch;
                                    next();
                                }
                                if (ch === '.') {
                                    string += '.';
                                    while (next() && ch >= '0' && ch <= '9') {
                                        string += ch;
                                    }
                                }
                                if (ch === 'e' || ch === 'E') {
                                    string += ch;
                                    next();
                                    if (ch === '-' || ch === '+') {
                                        string += ch;
                                        next();
                                    }
                                    while (ch >= '0' && ch <= '9') {
                                        string += ch;
                                        next();
                                    }
                                }
                                break;
                            case 16:
                                while (ch >= '0' && ch <= '9' || ch >= 'A' && ch <= 'F' || ch >= 'a' && ch <= 'f') {
                                    string += ch;
                                    next();
                                }
                                break;
                        }

                        if (sign === '-') {
                            number = -string;
                        } else {
                            number = +string;
                        }

                        if (!isFinite(number)) {
                            error("Bad number");
                        } else {
                            return number;
                        }
                    },

                    string = function () {

                        // Parse a string value.

                        var hex,
                            i,
                            string = '',
                            delim,      // double quote or single quote
                            uffff;

                        // When parsing for string values, we must look for ' or " and \ characters.

                        if (ch === '"' || ch === "'") {
                            delim = ch;
                            while (next()) {
                                if (ch === delim) {
                                    next();
                                    return string;
                                } else if (ch === '\\') {
                                    next();
                                    if (ch === 'u') {
                                        uffff = 0;
                                        for (i = 0; i < 4; i += 1) {
                                            hex = parseInt(next(), 16);
                                            if (!isFinite(hex)) {
                                                break;
                                            }
                                            uffff = uffff * 16 + hex;
                                        }
                                        string += String.fromCharCode(uffff);
                                    } else if (ch === '\r') {
                                        if (peek() === '\n') {
                                            next();
                                        }
                                    } else if (typeof escapee[ch] === 'string') {
                                        string += escapee[ch];
                                    } else {
                                        break;
                                    }
                                } else if (ch === '\n') {
                                    // unescaped newlines are invalid; see:
                                    // https://github.com/aseemk/json5/issues/24
                                    // TODO this feels special-cased; are there other
                                    // invalid unescaped chars?
                                    break;
                                } else {
                                    string += ch;
                                }
                            }
                        }
                        error("Bad string");
                    },

                    inlineComment = function () {

                        // Skip an inline comment, assuming this is one. The current character should
                        // be the second / character in the // pair that begins this inline comment.
                        // To finish the inline comment, we look for a newline or the end of the text.

                        if (ch !== '/') {
                            error("Not an inline comment");
                        }

                        do {
                            next();
                            if (ch === '\n' || ch === '\r') {
                                next();
                                return;
                            }
                        } while (ch);
                    },

                    blockComment = function () {

                        // Skip a block comment, assuming this is one. The current character should be
                        // the * character in the /* pair that begins this block comment.
                        // To finish the block comment, we look for an ending */ pair of characters,
                        // but we also watch for the end of text before the comment is terminated.

                        if (ch !== '*') {
                            error("Not a block comment");
                        }

                        do {
                            next();
                            while (ch === '*') {
                                next('*');
                                if (ch === '/') {
                                    next('/');
                                    return;
                                }
                            }
                        } while (ch);

                        error("Unterminated block comment");
                    },

                    comment = function () {

                        // Skip a comment, whether inline or block-level, assuming this is one.
                        // Comments always begin with a / character.

                        if (ch !== '/') {
                            error("Not a comment");
                        }

                        next('/');

                        if (ch === '/') {
                            inlineComment();
                        } else if (ch === '*') {
                            blockComment();
                        } else {
                            error("Unrecognized comment");
                        }
                    },

                    white = function () {

                        // Skip whitespace and comments.
                        // Note that we're detecting comments by only a single / character.
                        // This works since regular expressions are not valid JSON(5), but this will
                        // break if there are other valid values that begin with a / character!

                        while (ch) {
                            if (ch === '/') {
                                comment();
                            } else if (ws.indexOf(ch) >= 0) {
                                next();
                            } else {
                                return;
                            }
                        }
                    },

                    word = function () {

                        // true, false, or null.

                        switch (ch) {
                            case 't':
                                next('t');
                                next('r');
                                next('u');
                                next('e');
                                return true;
                            case 'f':
                                next('f');
                                next('a');
                                next('l');
                                next('s');
                                next('e');
                                return false;
                            case 'n':
                                next('n');
                                next('u');
                                next('l');
                                next('l');
                                return null;
                            case 'I':
                                next('I');
                                next('n');
                                next('f');
                                next('i');
                                next('n');
                                next('i');
                                next('t');
                                next('y');
                                return Infinity;
                            case 'N':
                                next('N');
                                next('a');
                                next('N');
                                return NaN;
                        }
                        error("Unexpected '" + ch + "'");
                    },

                    value,  // Place holder for the value function.

                    array = function () {

                        // Parse an array value.

                        var array = [];

                        if (ch === '[') {
                            next('[');
                            white();
                            while (ch) {
                                if (ch === ']') {
                                    next(']');
                                    return array;   // Potentially empty array
                                }
                                // ES5 allows omitting elements in arrays, e.g. [,] and
                                // [,null]. We don't allow this in JSON5.
                                if (ch === ',') {
                                    error("Missing array element");
                                } else {
                                    array.push(value());
                                }
                                white();
                                // If there's no comma after this value, this needs to
                                // be the end of the array.
                                if (ch !== ',') {
                                    next(']');
                                    return array;
                                }
                                next(',');
                                white();
                            }
                        }
                        error("Bad array");
                    },

                    object = function () {

                        // Parse an object value.

                        var key,
                            object = {};

                        if (ch === '{') {
                            next('{');
                            white();
                            while (ch) {
                                if (ch === '}') {
                                    next('}');
                                    return object;   // Potentially empty object
                                }

                                // Keys can be unquoted. If they are, they need to be
                                // valid JS identifiers.
                                if (ch === '"' || ch === "'") {
                                    key = string();
                                } else {
                                    key = identifier();
                                }

                                white();
                                next(':');
                                object[key] = value();
                                white();
                                // If there's no comma after this pair, this needs to be
                                // the end of the object.
                                if (ch !== ',') {
                                    next('}');
                                    return object;
                                }
                                next(',');
                                white();
                            }
                        }
                        error("Bad object");
                    };

                value = function () {

                    // Parse a JSON value. It could be an object, an array, a string, a number,
                    // or a word.

                    white();
                    switch (ch) {
                        case '{':
                            return object();
                        case '[':
                            return array();
                        case '"':
                        case "'":
                            return string();
                        case '-':
                        case '+':
                        case '.':
                            return number();
                        default:
                            return ch >= '0' && ch <= '9' ? number() : word();
                    }
                };

                // Return the json_parse function. It will have access to all of the above
                // functions and variables.

                return function (source, reviver) {
                    var result;

                    text = String(source);
                    at = 0;
                    ch = ' ';
                    result = value();
                    white();
                    if (ch) {
                        error("Syntax error");
                    }

                    // If there is a reviver function, we recursively walk the new structure,
                    // passing each name/value pair to the reviver function for possible
                    // transformation, starting with a temporary root object that holds the result
                    // in an empty key. If there is not a reviver function, we simply return the
                    // result.

                    return typeof reviver === 'function' ? (function walk(holder, key) {
                        var k, v, value = holder[key];
                        if (value && typeof value === 'object') {
                            for (k in value) {
                                if (Object.prototype.hasOwnProperty.call(value, k)) {
                                    v = walk(value, k);
                                    if (v !== undefined) {
                                        value[k] = v;
                                    } else {
                                        delete value[k];
                                    }
                                }
                            }
                        }
                        return reviver.call(holder, key, value);
                    }({ '': result }, '')) : result;
                };
            }());

            // JSON5 stringify will not quote keys where appropriate
            JSON5.stringify = function (obj, replacer, space) {
                if (replacer && (typeof (replacer) !== "function" && !isArray(replacer))) {
                    throw new Error('Replacer must be a function or an array');
                }
                var getReplacedValueOrUndefined = function (holder, key, isTopLevel) {
                    var value = holder[key];

                    // Replace the value with its toJSON value first, if possible
                    if (value && value.toJSON && typeof value.toJSON === "function") {
                        value = value.toJSON();
                    }

                    // If the user-supplied replacer if a function, call it. If it's an array, check objects' string keys for
                    // presence in the array (removing the key/value pair from the resulting JSON if the key is missing).
                    if (typeof (replacer) === "function") {
                        return replacer.call(holder, key, value);
                    } else if (replacer) {
                        if (isTopLevel || isArray(holder) || replacer.indexOf(key) >= 0) {
                            return value;
                        } else {
                            return undefined;
                        }
                    } else {
                        return value;
                    }
                };

                function isWordChar(char) {
                    return (char >= 'a' && char <= 'z') ||
                        (char >= 'A' && char <= 'Z') ||
                        (char >= '0' && char <= '9') ||
                        char === '_' || char === '$';
                }

                function isWordStart(char) {
                    return (char >= 'a' && char <= 'z') ||
                        (char >= 'A' && char <= 'Z') ||
                        char === '_' || char === '$';
                }

                function isWord(key) {
                    if (typeof key !== 'string') {
                        return false;
                    }
                    if (!isWordStart(key[0])) {
                        return false;
                    }
                    var i = 1, length = key.length;
                    while (i < length) {
                        if (!isWordChar(key[i])) {
                            return false;
                        }
                        i++;
                    }
                    return true;
                }

                // export for use in tests
                JSON5.isWord = isWord;

                // polyfills
                function isArray(obj) {
                    if (Array.isArray) {
                        return Array.isArray(obj);
                    } else {
                        return Object.prototype.toString.call(obj) === '[object Array]';
                    }
                }

                function isDate(obj) {
                    return Object.prototype.toString.call(obj) === '[object Date]';
                }

                isNaN = isNaN || function (val) {
                    return typeof val === 'number' && val !== val;
                };

                var objStack = [];
                function checkForCircular(obj) {
                    for (var i = 0; i < objStack.length; i++) {
                        if (objStack[i] === obj) {
                            throw new TypeError("Converting circular structure to JSON");
                        }
                    }
                }

                function makeIndent(str, num, noNewLine) {
                    if (!str) {
                        return "";
                    }
                    // indentation no more than 10 chars
                    if (str.length > 10) {
                        str = str.substring(0, 10);
                    }

                    var indent = noNewLine ? "" : "\n";
                    for (var i = 0; i < num; i++) {
                        indent += str;
                    }

                    return indent;
                }

                var indentStr;
                if (space) {
                    if (typeof space === "string") {
                        indentStr = space;
                    } else if (typeof space === "number" && space >= 0) {
                        indentStr = makeIndent(" ", space, true);
                    } else {
                        // ignore space parameter
                    }
                }

                // Copied from Crokford's implementation of JSON
                // See https://github.com/douglascrockford/JSON-js/blob/e39db4b7e6249f04a195e7dd0840e610cc9e941e/json2.js#L195
                // Begin
                var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    meta = { // table of character substitutions
                        '\b': '\\b',
                        '\t': '\\t',
                        '\n': '\\n',
                        '\f': '\\f',
                        '\r': '\\r',
                        '"': '\\"',
                        '\\': '\\\\'
                    };
                function escapeString(string) {

                    // If the string contains no control characters, no quote characters, and no
                    // backslash characters, then we can safely slap some quotes around it.
                    // Otherwise we must also replace the offending characters with safe escape
                    // sequences.
                    escapable.lastIndex = 0;
                    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                        var c = meta[a];
                        return typeof c === 'string' ?
                            c :
                            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    }) + '"' : '"' + string + '"';
                }
                // End

                function internalStringify(holder, key, isTopLevel) {
                    var buffer, res;

                    // Replace the value, if necessary
                    var obj_part = getReplacedValueOrUndefined(holder, key, isTopLevel);

                    if (obj_part && !isDate(obj_part)) {
                        // unbox objects
                        // don't unbox dates, since will turn it into number
                        obj_part = obj_part.valueOf();
                    }
                    switch (typeof obj_part) {
                        case "boolean":
                            return obj_part.toString();

                        case "number":
                            if (isNaN(obj_part) || !isFinite(obj_part)) {
                                return "null";
                            }
                            return obj_part.toString();

                        case "string":
                            return escapeString(obj_part.toString());

                        case "object":
                            if (obj_part === null) {
                                return "null";
                            } else if (isArray(obj_part)) {
                                checkForCircular(obj_part);
                                buffer = "[";
                                objStack.push(obj_part);

                                for (var i = 0; i < obj_part.length; i++) {
                                    res = internalStringify(obj_part, i, false);
                                    buffer += makeIndent(indentStr, objStack.length);
                                    if (res === null || typeof res === "undefined") {
                                        buffer += "null";
                                    } else {
                                        buffer += res;
                                    }
                                    if (i < obj_part.length - 1) {
                                        buffer += ",";
                                    } else if (indentStr) {
                                        buffer += "\n";
                                    }
                                }
                                objStack.pop();
                                buffer += makeIndent(indentStr, objStack.length, true) + "]";
                            } else {
                                checkForCircular(obj_part);
                                buffer = "{";
                                var nonEmpty = false;
                                objStack.push(obj_part);
                                for (var prop in obj_part) {
                                    if (obj_part.hasOwnProperty(prop)) {
                                        var value = internalStringify(obj_part, prop, false);
                                        isTopLevel = false;
                                        if (typeof value !== "undefined" && value !== null) {
                                            buffer += makeIndent(indentStr, objStack.length);
                                            nonEmpty = true;
                                            var key = isWord(prop) ? prop : escapeString(prop);
                                            buffer += key + ":" + (indentStr ? ' ' : '') + value + ",";
                                        }
                                    }
                                }
                                objStack.pop();
                                if (nonEmpty) {
                                    buffer = buffer.substring(0, buffer.length - 1) + makeIndent(indentStr, objStack.length) + "}";
                                } else {
                                    buffer = '{}';
                                }
                            }
                            return buffer;
                        default:
                            // functions and undefined should be ignored
                            return undefined;
                    }
                }

                // special case...when undefined is used inside of
                // a compound object/array, return null.
                // but when top-level, return undefined
                var topLevelHolder = { "": obj };
                if (obj === undefined) {
                    return getReplacedValueOrUndefined(topLevelHolder, '', true);
                }
                return internalStringify(topLevelHolder, '', true);
            };

        }, {}], 142: [function (_dereq_, module, exports) {
            /**
             * Gets the last element of `array`.
             *
             * @static
             * @memberOf _
             * @category Array
             * @param {Array} array The array to query.
             * @returns {*} Returns the last element of `array`.
             * @example
             *
             * _.last([1, 2, 3]);
             * // => 3
             */
            function last(array) {
                var length = array ? array.length : 0;
                return length ? array[length - 1] : undefined;
            }

            module.exports = last;

        }, {}], 143: [function (_dereq_, module, exports) {
            module.exports = _dereq_(146);

        }, { "146": 146 }], 144: [function (_dereq_, module, exports) {
            module.exports = _dereq_(145);

        }, { "145": 145 }], 145: [function (_dereq_, module, exports) {
            var arrayEach = _dereq_(150),
                baseEach = _dereq_(159),
                createForEach = _dereq_(186);

            /**
             * Iterates over elements of `collection` invoking `iteratee` for each element.
             * The `iteratee` is bound to `thisArg` and invoked with three arguments:
             * (value, index|key, collection). Iteratee functions may exit iteration early
             * by explicitly returning `false`.
             *
             * **Note:** As with other "Collections" methods, objects with a "length" property
             * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
             * may be used for object iteration.
             *
             * @static
             * @memberOf _
             * @alias each
             * @category Collection
             * @param {Array|Object|string} collection The collection to iterate over.
             * @param {Function} [iteratee=_.identity] The function invoked per iteration.
             * @param {*} [thisArg] The `this` binding of `iteratee`.
             * @returns {Array|Object|string} Returns `collection`.
             * @example
             *
             * _([1, 2]).forEach(function(n) {
             *   console.log(n);
             * }).value();
             * // => logs each value from left to right and returns the array
             *
             * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
             *   console.log(n, key);
             * });
             * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
             */
            var forEach = createForEach(arrayEach, baseEach);

            module.exports = forEach;

        }, { "150": 150, "159": 159, "186": 186 }], 146: [function (_dereq_, module, exports) {
            var baseIndexOf = _dereq_(164),
                getLength = _dereq_(191),
                isArray = _dereq_(211),
                isIterateeCall = _dereq_(200),
                isLength = _dereq_(202),
                isString = _dereq_(218),
                values = _dereq_(227);

            /* Native method references for those with the same name as other `lodash` methods. */
            var nativeMax = Math.max;

            /**
             * Checks if `target` is in `collection` using
             * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
             * for equality comparisons. If `fromIndex` is negative, it's used as the offset
             * from the end of `collection`.
             *
             * @static
             * @memberOf _
             * @alias contains, include
             * @category Collection
             * @param {Array|Object|string} collection The collection to search.
             * @param {*} target The value to search for.
             * @param {number} [fromIndex=0] The index to search from.
             * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
             * @returns {boolean} Returns `true` if a matching element is found, else `false`.
             * @example
             *
             * _.includes([1, 2, 3], 1);
             * // => true
             *
             * _.includes([1, 2, 3], 1, 2);
             * // => false
             *
             * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
             * // => true
             *
             * _.includes('pebbles', 'eb');
             * // => true
             */
            function includes(collection, target, fromIndex, guard) {
                var length = collection ? getLength(collection) : 0;
                if (!isLength(length)) {
                    collection = values(collection);
                    length = collection.length;
                }
                if (typeof fromIndex != 'number' || (guard && isIterateeCall(target, fromIndex, guard))) {
                    fromIndex = 0;
                } else {
                    fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
                }
                return (typeof collection == 'string' || !isArray(collection) && isString(collection))
                    ? (fromIndex <= length && collection.indexOf(target, fromIndex) > -1)
                    : (!!length && baseIndexOf(collection, target, fromIndex) > -1);
            }

            module.exports = includes;

        }, { "164": 164, "191": 191, "200": 200, "202": 202, "211": 211, "218": 218, "227": 227 }], 147: [function (_dereq_, module, exports) {
            var baseCallback = _dereq_(155),
                baseMap = _dereq_(168),
                baseSortBy = _dereq_(176),
                compareAscending = _dereq_(181),
                isIterateeCall = _dereq_(200);

            /**
             * Creates an array of elements, sorted in ascending order by the results of
             * running each element in a collection through `iteratee`. This method performs
             * a stable sort, that is, it preserves the original sort order of equal elements.
             * The `iteratee` is bound to `thisArg` and invoked with three arguments:
             * (value, index|key, collection).
             *
             * If a property name is provided for `iteratee` the created `_.property`
             * style callback returns the property value of the given element.
             *
             * If a value is also provided for `thisArg` the created `_.matchesProperty`
             * style callback returns `true` for elements that have a matching property
             * value, else `false`.
             *
             * If an object is provided for `iteratee` the created `_.matches` style
             * callback returns `true` for elements that have the properties of the given
             * object, else `false`.
             *
             * @static
             * @memberOf _
             * @category Collection
             * @param {Array|Object|string} collection The collection to iterate over.
             * @param {Function|Object|string} [iteratee=_.identity] The function invoked
             *  per iteration.
             * @param {*} [thisArg] The `this` binding of `iteratee`.
             * @returns {Array} Returns the new sorted array.
             * @example
             *
             * _.sortBy([1, 2, 3], function(n) {
             *   return Math.sin(n);
             * });
             * // => [3, 1, 2]
             *
             * _.sortBy([1, 2, 3], function(n) {
             *   return this.sin(n);
             * }, Math);
             * // => [3, 1, 2]
             *
             * var users = [
             *   { 'user': 'fred' },
             *   { 'user': 'pebbles' },
             *   { 'user': 'barney' }
             * ];
             *
             * // using the `_.property` callback shorthand
             * _.pluck(_.sortBy(users, 'user'), 'user');
             * // => ['barney', 'fred', 'pebbles']
             */
            function sortBy(collection, iteratee, thisArg) {
                if (collection == null) {
                    return [];
                }
                if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
                    iteratee = undefined;
                }
                var index = -1;
                iteratee = baseCallback(iteratee, thisArg, 3);

                var result = baseMap(collection, function (value, key, collection) {
                    return { 'criteria': iteratee(value, key, collection), 'index': ++index, 'value': value };
                });
                return baseSortBy(result, compareAscending);
            }

            module.exports = sortBy;

        }, { "155": 155, "168": 168, "176": 176, "181": 181, "200": 200 }], 148: [function (_dereq_, module, exports) {
            /** Used as the `TypeError` message for "Functions" methods. */
            var FUNC_ERROR_TEXT = 'Expected a function';

            /* Native method references for those with the same name as other `lodash` methods. */
            var nativeMax = Math.max;

            /**
             * Creates a function that invokes `func` with the `this` binding of the
             * created function and arguments from `start` and beyond provided as an array.
             *
             * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
             *
             * @static
             * @memberOf _
             * @category Function
             * @param {Function} func The function to apply a rest parameter to.
             * @param {number} [start=func.length-1] The start position of the rest parameter.
             * @returns {Function} Returns the new function.
             * @example
             *
             * var say = _.restParam(function(what, names) {
             *   return what + ' ' + _.initial(names).join(', ') +
             *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
             * });
             *
             * say('hello', 'fred', 'barney', 'pebbles');
             * // => 'hello fred, barney, & pebbles'
             */
            function restParam(func, start) {
                if (typeof func != 'function') {
                    throw new TypeError(FUNC_ERROR_TEXT);
                }
                start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
                return function () {
                    var args = arguments,
                        index = -1,
                        length = nativeMax(args.length - start, 0),
                        rest = Array(length);

                    while (++index < length) {
                        rest[index] = args[start + index];
                    }
                    switch (start) {
                        case 0: return func.call(this, rest);
                        case 1: return func.call(this, args[0], rest);
                        case 2: return func.call(this, args[0], args[1], rest);
                    }
                    var otherArgs = Array(start + 1);
                    index = -1;
                    while (++index < start) {
                        otherArgs[index] = args[index];
                    }
                    otherArgs[start] = rest;
                    return func.apply(this, otherArgs);
                };
            }

            module.exports = restParam;

        }, {}], 149: [function (_dereq_, module, exports) {
            /**
             * Copies the values of `source` to `array`.
             *
             * @private
             * @param {Array} source The array to copy values from.
             * @param {Array} [array=[]] The array to copy values to.
             * @returns {Array} Returns `array`.
             */
            function arrayCopy(source, array) {
                var index = -1,
                    length = source.length;

                array || (array = Array(length));
                while (++index < length) {
                    array[index] = source[index];
                }
                return array;
            }

            module.exports = arrayCopy;

        }, {}], 150: [function (_dereq_, module, exports) {
            /**
             * A specialized version of `_.forEach` for arrays without support for callback
             * shorthands and `this` binding.
             *
             * @private
             * @param {Array} array The array to iterate over.
             * @param {Function} iteratee The function invoked per iteration.
             * @returns {Array} Returns `array`.
             */
            function arrayEach(array, iteratee) {
                var index = -1,
                    length = array.length;

                while (++index < length) {
                    if (iteratee(array[index], index, array) === false) {
                        break;
                    }
                }
                return array;
            }

            module.exports = arrayEach;

        }, {}], 151: [function (_dereq_, module, exports) {
            /**
             * A specialized version of `_.some` for arrays without support for callback
             * shorthands and `this` binding.
             *
             * @private
             * @param {Array} array The array to iterate over.
             * @param {Function} predicate The function invoked per iteration.
             * @returns {boolean} Returns `true` if any element passes the predicate check,
             *  else `false`.
             */
            function arraySome(array, predicate) {
                var index = -1,
                    length = array.length;

                while (++index < length) {
                    if (predicate(array[index], index, array)) {
                        return true;
                    }
                }
                return false;
            }

            module.exports = arraySome;

        }, {}], 152: [function (_dereq_, module, exports) {
            /**
             * Used by `_.defaults` to customize its `_.assign` use.
             *
             * @private
             * @param {*} objectValue The destination object property value.
             * @param {*} sourceValue The source object property value.
             * @returns {*} Returns the value to assign to the destination object.
             */
            function assignDefaults(objectValue, sourceValue) {
                return objectValue === undefined ? sourceValue : objectValue;
            }

            module.exports = assignDefaults;

        }, {}], 153: [function (_dereq_, module, exports) {
            var keys = _dereq_(223);

            /**
             * A specialized version of `_.assign` for customizing assigned values without
             * support for argument juggling, multiple sources, and `this` binding `customizer`
             * functions.
             *
             * @private
             * @param {Object} object The destination object.
             * @param {Object} source The source object.
             * @param {Function} customizer The function to customize assigned values.
             * @returns {Object} Returns `object`.
             */
            function assignWith(object, source, customizer) {
                var index = -1,
                    props = keys(source),
                    length = props.length;

                while (++index < length) {
                    var key = props[index],
                        value = object[key],
                        result = customizer(value, source[key], key, object, source);

                    if ((result === result ? (result !== value) : (value === value)) ||
                        (value === undefined && !(key in object))) {
                        object[key] = result;
                    }
                }
                return object;
            }

            module.exports = assignWith;

        }, { "223": 223 }], 154: [function (_dereq_, module, exports) {
            var baseCopy = _dereq_(158),
                keys = _dereq_(223);

            /**
             * The base implementation of `_.assign` without support for argument juggling,
             * multiple sources, and `customizer` functions.
             *
             * @private
             * @param {Object} object The destination object.
             * @param {Object} source The source object.
             * @returns {Object} Returns `object`.
             */
            function baseAssign(object, source) {
                return source == null
                    ? object
                    : baseCopy(source, keys(source), object);
            }

            module.exports = baseAssign;

        }, { "158": 158, "223": 223 }], 155: [function (_dereq_, module, exports) {
            var baseMatches = _dereq_(169),
                baseMatchesProperty = _dereq_(170),
                bindCallback = _dereq_(179),
                identity = _dereq_(230),
                property = _dereq_(231);

            /**
             * The base implementation of `_.callback` which supports specifying the
             * number of arguments to provide to `func`.
             *
             * @private
             * @param {*} [func=_.identity] The value to convert to a callback.
             * @param {*} [thisArg] The `this` binding of `func`.
             * @param {number} [argCount] The number of arguments to provide to `func`.
             * @returns {Function} Returns the callback.
             */
            function baseCallback(func, thisArg, argCount) {
                var type = typeof func;
                if (type == 'function') {
                    return thisArg === undefined
                        ? func
                        : bindCallback(func, thisArg, argCount);
                }
                if (func == null) {
                    return identity;
                }
                if (type == 'object') {
                    return baseMatches(func);
                }
                return thisArg === undefined
                    ? property(func)
                    : baseMatchesProperty(func, thisArg);
            }

            module.exports = baseCallback;

        }, { "169": 169, "170": 170, "179": 179, "230": 230, "231": 231 }], 156: [function (_dereq_, module, exports) {
            var arrayCopy = _dereq_(149),
                arrayEach = _dereq_(150),
                baseAssign = _dereq_(154),
                baseForOwn = _dereq_(162),
                initCloneArray = _dereq_(195),
                initCloneByTag = _dereq_(196),
                initCloneObject = _dereq_(197),
                isArray = _dereq_(211),
                isObject = _dereq_(215);

            /** `Object#toString` result references. */
            var argsTag = '[object Arguments]',
                arrayTag = '[object Array]',
                boolTag = '[object Boolean]',
                dateTag = '[object Date]',
                errorTag = '[object Error]',
                funcTag = '[object Function]',
                mapTag = '[object Map]',
                numberTag = '[object Number]',
                objectTag = '[object Object]',
                regexpTag = '[object RegExp]',
                setTag = '[object Set]',
                stringTag = '[object String]',
                weakMapTag = '[object WeakMap]';

            var arrayBufferTag = '[object ArrayBuffer]',
                float32Tag = '[object Float32Array]',
                float64Tag = '[object Float64Array]',
                int8Tag = '[object Int8Array]',
                int16Tag = '[object Int16Array]',
                int32Tag = '[object Int32Array]',
                uint8Tag = '[object Uint8Array]',
                uint8ClampedTag = '[object Uint8ClampedArray]',
                uint16Tag = '[object Uint16Array]',
                uint32Tag = '[object Uint32Array]';

            /** Used to identify `toStringTag` values supported by `_.clone`. */
            var cloneableTags = {};
            cloneableTags[argsTag] = cloneableTags[arrayTag] =
                cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
                cloneableTags[dateTag] = cloneableTags[float32Tag] =
                cloneableTags[float64Tag] = cloneableTags[int8Tag] =
                cloneableTags[int16Tag] = cloneableTags[int32Tag] =
                cloneableTags[numberTag] = cloneableTags[objectTag] =
                cloneableTags[regexpTag] = cloneableTags[stringTag] =
                cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
                cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
            cloneableTags[errorTag] = cloneableTags[funcTag] =
                cloneableTags[mapTag] = cloneableTags[setTag] =
                cloneableTags[weakMapTag] = false;

            /** Used for native method references. */
            var objectProto = Object.prototype;

            /**
             * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
             * of values.
             */
            var objToString = objectProto.toString;

            /**
             * The base implementation of `_.clone` without support for argument juggling
             * and `this` binding `customizer` functions.
             *
             * @private
             * @param {*} value The value to clone.
             * @param {boolean} [isDeep] Specify a deep clone.
             * @param {Function} [customizer] The function to customize cloning values.
             * @param {string} [key] The key of `value`.
             * @param {Object} [object] The object `value` belongs to.
             * @param {Array} [stackA=[]] Tracks traversed source objects.
             * @param {Array} [stackB=[]] Associates clones with source counterparts.
             * @returns {*} Returns the cloned value.
             */
            function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
                var result;
                if (customizer) {
                    result = object ? customizer(value, key, object) : customizer(value);
                }
                if (result !== undefined) {
                    return result;
                }
                if (!isObject(value)) {
                    return value;
                }
                var isArr = isArray(value);
                if (isArr) {
                    result = initCloneArray(value);
                    if (!isDeep) {
                        return arrayCopy(value, result);
                    }
                } else {
                    var tag = objToString.call(value),
                        isFunc = tag == funcTag;

                    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
                        result = initCloneObject(isFunc ? {} : value);
                        if (!isDeep) {
                            return baseAssign(result, value);
                        }
                    } else {
                        return cloneableTags[tag]
                            ? initCloneByTag(value, tag, isDeep)
                            : (object ? value : {});
                    }
                }
                // Check for circular references and return its corresponding clone.
                stackA || (stackA = []);
                stackB || (stackB = []);

                var length = stackA.length;
                while (length--) {
                    if (stackA[length] == value) {
                        return stackB[length];
                    }
                }
                // Add the source value to the stack of traversed objects and associate it with its clone.
                stackA.push(value);
                stackB.push(result);

                // Recursively populate clone (susceptible to call stack limits).
                (isArr ? arrayEach : baseForOwn)(value, function (subValue, key) {
                    result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
                });
                return result;
            }

            module.exports = baseClone;

        }, { "149": 149, "150": 150, "154": 154, "162": 162, "195": 195, "196": 196, "197": 197, "211": 211, "215": 215 }], 157: [function (_dereq_, module, exports) {
            /**
             * The base implementation of `compareAscending` which compares values and
             * sorts them in ascending order without guaranteeing a stable sort.
             *
             * @private
             * @param {*} value The value to compare.
             * @param {*} other The other value to compare.
             * @returns {number} Returns the sort order indicator for `value`.
             */
            function baseCompareAscending(value, other) {
                if (value !== other) {
                    var valIsNull = value === null,
                        valIsUndef = value === undefined,
                        valIsReflexive = value === value;

                    var othIsNull = other === null,
                        othIsUndef = other === undefined,
                        othIsReflexive = other === other;

                    if ((value > other && !othIsNull) || !valIsReflexive ||
                        (valIsNull && !othIsUndef && othIsReflexive) ||
                        (valIsUndef && othIsReflexive)) {
                        return 1;
                    }
                    if ((value < other && !valIsNull) || !othIsReflexive ||
                        (othIsNull && !valIsUndef && valIsReflexive) ||
                        (othIsUndef && valIsReflexive)) {
                        return -1;
                    }
                }
                return 0;
            }

            module.exports = baseCompareAscending;

        }, {}], 158: [function (_dereq_, module, exports) {
            /**
             * Copies properties of `source` to `object`.
             *
             * @private
             * @param {Object} source The object to copy properties from.
             * @param {Array} props The property names to copy.
             * @param {Object} [object={}] The object to copy properties to.
             * @returns {Object} Returns `object`.
             */
            function baseCopy(source, props, object) {
                object || (object = {});

                var index = -1,
                    length = props.length;

                while (++index < length) {
                    var key = props[index];
                    object[key] = source[key];
                }
                return object;
            }

            module.exports = baseCopy;

        }, {}], 159: [function (_dereq_, module, exports) {
            var baseForOwn = _dereq_(162),
                createBaseEach = _dereq_(183);

            /**
             * The base implementation of `_.forEach` without support for callback
             * shorthands and `this` binding.
             *
             * @private
             * @param {Array|Object|string} collection The collection to iterate over.
             * @param {Function} iteratee The function invoked per iteration.
             * @returns {Array|Object|string} Returns `collection`.
             */
            var baseEach = createBaseEach(baseForOwn);

            module.exports = baseEach;

        }, { "162": 162, "183": 183 }], 160: [function (_dereq_, module, exports) {
            var createBaseFor = _dereq_(184);

            /**
             * The base implementation of `baseForIn` and `baseForOwn` which iterates
             * over `object` properties returned by `keysFunc` invoking `iteratee` for
             * each property. Iteratee functions may exit iteration early by explicitly
             * returning `false`.
             *
             * @private
             * @param {Object} object The object to iterate over.
             * @param {Function} iteratee The function invoked per iteration.
             * @param {Function} keysFunc The function to get the keys of `object`.
             * @returns {Object} Returns `object`.
             */
            var baseFor = createBaseFor();

            module.exports = baseFor;

        }, { "184": 184 }], 161: [function (_dereq_, module, exports) {
            var baseFor = _dereq_(160),
                keysIn = _dereq_(224);

            /**
             * The base implementation of `_.forIn` without support for callback
             * shorthands and `this` binding.
             *
             * @private
             * @param {Object} object The object to iterate over.
             * @param {Function} iteratee The function invoked per iteration.
             * @returns {Object} Returns `object`.
             */
            function baseForIn(object, iteratee) {
                return baseFor(object, iteratee, keysIn);
            }

            module.exports = baseForIn;

        }, { "160": 160, "224": 224 }], 162: [function (_dereq_, module, exports) {
            var baseFor = _dereq_(160),
                keys = _dereq_(223);

            /**
             * The base implementation of `_.forOwn` without support for callback
             * shorthands and `this` binding.
             *
             * @private
             * @param {Object} object The object to iterate over.
             * @param {Function} iteratee The function invoked per iteration.
             * @returns {Object} Returns `object`.
             */
            function baseForOwn(object, iteratee) {
                return baseFor(object, iteratee, keys);
            }

            module.exports = baseForOwn;

        }, { "160": 160, "223": 223 }], 163: [function (_dereq_, module, exports) {
            var toObject = _dereq_(206);

            /**
             * The base implementation of `get` without support for string paths
             * and default values.
             *
             * @private
             * @param {Object} object The object to query.
             * @param {Array} path The path of the property to get.
             * @param {string} [pathKey] The key representation of path.
             * @returns {*} Returns the resolved value.
             */
            function baseGet(object, path, pathKey) {
                if (object == null) {
                    return;
                }
                if (pathKey !== undefined && pathKey in toObject(object)) {
                    path = [pathKey];
                }
                var index = 0,
                    length = path.length;

                while (object != null && index < length) {
                    object = object[path[index++]];
                }
                return (index && index == length) ? object : undefined;
            }

            module.exports = baseGet;

        }, { "206": 206 }], 164: [function (_dereq_, module, exports) {
            var indexOfNaN = _dereq_(194);

            /**
             * The base implementation of `_.indexOf` without support for binary searches.
             *
             * @private
             * @param {Array} array The array to search.
             * @param {*} value The value to search for.
             * @param {number} fromIndex The index to search from.
             * @returns {number} Returns the index of the matched value, else `-1`.
             */
            function baseIndexOf(array, value, fromIndex) {
                if (value !== value) {
                    return indexOfNaN(array, fromIndex);
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

            module.exports = baseIndexOf;

        }, { "194": 194 }], 165: [function (_dereq_, module, exports) {
            var baseIsEqualDeep = _dereq_(166),
                isObject = _dereq_(215),
                isObjectLike = _dereq_(203);

            /**
             * The base implementation of `_.isEqual` without support for `this` binding
             * `customizer` functions.
             *
             * @private
             * @param {*} value The value to compare.
             * @param {*} other The other value to compare.
             * @param {Function} [customizer] The function to customize comparing values.
             * @param {boolean} [isLoose] Specify performing partial comparisons.
             * @param {Array} [stackA] Tracks traversed `value` objects.
             * @param {Array} [stackB] Tracks traversed `other` objects.
             * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
             */
            function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
                if (value === other) {
                    return true;
                }
                if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
                    return value !== value && other !== other;
                }
                return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
            }

            module.exports = baseIsEqual;

        }, { "166": 166, "203": 203, "215": 215 }], 166: [function (_dereq_, module, exports) {
            var equalArrays = _dereq_(187),
                equalByTag = _dereq_(188),
                equalObjects = _dereq_(189),
                isArray = _dereq_(211),
                isTypedArray = _dereq_(219);

            /** `Object#toString` result references. */
            var argsTag = '[object Arguments]',
                arrayTag = '[object Array]',
                objectTag = '[object Object]';

            /** Used for native method references. */
            var objectProto = Object.prototype;

            /** Used to check objects for own properties. */
            var hasOwnProperty = objectProto.hasOwnProperty;

            /**
             * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
             * of values.
             */
            var objToString = objectProto.toString;

            /**
             * A specialized version of `baseIsEqual` for arrays and objects which performs
             * deep comparisons and tracks traversed objects enabling objects with circular
             * references to be compared.
             *
             * @private
             * @param {Object} object The object to compare.
             * @param {Object} other The other object to compare.
             * @param {Function} equalFunc The function to determine equivalents of values.
             * @param {Function} [customizer] The function to customize comparing objects.
             * @param {boolean} [isLoose] Specify performing partial comparisons.
             * @param {Array} [stackA=[]] Tracks traversed `value` objects.
             * @param {Array} [stackB=[]] Tracks traversed `other` objects.
             * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
             */
            function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
                var objIsArr = isArray(object),
                    othIsArr = isArray(other),
                    objTag = arrayTag,
                    othTag = arrayTag;

                if (!objIsArr) {
                    objTag = objToString.call(object);
                    if (objTag == argsTag) {
                        objTag = objectTag;
                    } else if (objTag != objectTag) {
                        objIsArr = isTypedArray(object);
                    }
                }
                if (!othIsArr) {
                    othTag = objToString.call(other);
                    if (othTag == argsTag) {
                        othTag = objectTag;
                    } else if (othTag != objectTag) {
                        othIsArr = isTypedArray(other);
                    }
                }
                var objIsObj = objTag == objectTag,
                    othIsObj = othTag == objectTag,
                    isSameTag = objTag == othTag;

                if (isSameTag && !(objIsArr || objIsObj)) {
                    return equalByTag(object, other, objTag);
                }
                if (!isLoose) {
                    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
                        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

                    if (objIsWrapped || othIsWrapped) {
                        return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
                    }
                }
                if (!isSameTag) {
                    return false;
                }
                // Assume cyclic values are equal.
                // For more information on detecting circular references see https://es5.github.io/#JO.
                stackA || (stackA = []);
                stackB || (stackB = []);

                var length = stackA.length;
                while (length--) {
                    if (stackA[length] == object) {
                        return stackB[length] == other;
                    }
                }
                // Add `object` and `other` to the stack of traversed objects.
                stackA.push(object);
                stackB.push(other);

                var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

                stackA.pop();
                stackB.pop();

                return result;
            }

            module.exports = baseIsEqualDeep;

        }, { "187": 187, "188": 188, "189": 189, "211": 211, "219": 219 }], 167: [function (_dereq_, module, exports) {
            var baseIsEqual = _dereq_(165),
                toObject = _dereq_(206);

            /**
             * The base implementation of `_.isMatch` without support for callback
             * shorthands and `this` binding.
             *
             * @private
             * @param {Object} object The object to inspect.
             * @param {Array} matchData The propery names, values, and compare flags to match.
             * @param {Function} [customizer] The function to customize comparing objects.
             * @returns {boolean} Returns `true` if `object` is a match, else `false`.
             */
            function baseIsMatch(object, matchData, customizer) {
                var index = matchData.length,
                    length = index,
                    noCustomizer = !customizer;

                if (object == null) {
                    return !length;
                }
                object = toObject(object);
                while (index--) {
                    var data = matchData[index];
                    if ((noCustomizer && data[2])
                        ? data[1] !== object[data[0]]
                        : !(data[0] in object)
                    ) {
                        return false;
                    }
                }
                while (++index < length) {
                    data = matchData[index];
                    var key = data[0],
                        objValue = object[key],
                        srcValue = data[1];

                    if (noCustomizer && data[2]) {
                        if (objValue === undefined && !(key in object)) {
                            return false;
                        }
                    } else {
                        var result = customizer ? customizer(objValue, srcValue, key) : undefined;
                        if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
                            return false;
                        }
                    }
                }
                return true;
            }

            module.exports = baseIsMatch;

        }, { "165": 165, "206": 206 }], 168: [function (_dereq_, module, exports) {
            var baseEach = _dereq_(159),
                isArrayLike = _dereq_(198);

            /**
             * The base implementation of `_.map` without support for callback shorthands
             * and `this` binding.
             *
             * @private
             * @param {Array|Object|string} collection The collection to iterate over.
             * @param {Function} iteratee The function invoked per iteration.
             * @returns {Array} Returns the new mapped array.
             */
            function baseMap(collection, iteratee) {
                var index = -1,
                    result = isArrayLike(collection) ? Array(collection.length) : [];

                baseEach(collection, function (value, key, collection) {
                    result[++index] = iteratee(value, key, collection);
                });
                return result;
            }

            module.exports = baseMap;

        }, { "159": 159, "198": 198 }], 169: [function (_dereq_, module, exports) {
            var baseIsMatch = _dereq_(167),
                getMatchData = _dereq_(192),
                toObject = _dereq_(206);

            /**
             * The base implementation of `_.matches` which does not clone `source`.
             *
             * @private
             * @param {Object} source The object of property values to match.
             * @returns {Function} Returns the new function.
             */
            function baseMatches(source) {
                var matchData = getMatchData(source);
                if (matchData.length == 1 && matchData[0][2]) {
                    var key = matchData[0][0],
                        value = matchData[0][1];

                    return function (object) {
                        if (object == null) {
                            return false;
                        }
                        return object[key] === value && (value !== undefined || (key in toObject(object)));
                    };
                }
                return function (object) {
                    return baseIsMatch(object, matchData);
                };
            }

            module.exports = baseMatches;

        }, { "167": 167, "192": 192, "206": 206 }], 170: [function (_dereq_, module, exports) {
            var baseGet = _dereq_(163),
                baseIsEqual = _dereq_(165),
                baseSlice = _dereq_(175),
                isArray = _dereq_(211),
                isKey = _dereq_(201),
                isStrictComparable = _dereq_(204),
                last = _dereq_(142),
                toObject = _dereq_(206),
                toPath = _dereq_(207);

            /**
             * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
             *
             * @private
             * @param {string} path The path of the property to get.
             * @param {*} srcValue The value to compare.
             * @returns {Function} Returns the new function.
             */
            function baseMatchesProperty(path, srcValue) {
                var isArr = isArray(path),
                    isCommon = isKey(path) && isStrictComparable(srcValue),
                    pathKey = (path + '');

                path = toPath(path);
                return function (object) {
                    if (object == null) {
                        return false;
                    }
                    var key = pathKey;
                    object = toObject(object);
                    if ((isArr || !isCommon) && !(key in object)) {
                        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
                        if (object == null) {
                            return false;
                        }
                        key = last(path);
                        object = toObject(object);
                    }
                    return object[key] === srcValue
                        ? (srcValue !== undefined || (key in object))
                        : baseIsEqual(srcValue, object[key], undefined, true);
                };
            }

            module.exports = baseMatchesProperty;

        }, { "142": 142, "163": 163, "165": 165, "175": 175, "201": 201, "204": 204, "206": 206, "207": 207, "211": 211 }], 171: [function (_dereq_, module, exports) {
            var arrayEach = _dereq_(150),
                baseMergeDeep = _dereq_(172),
                isArray = _dereq_(211),
                isArrayLike = _dereq_(198),
                isObject = _dereq_(215),
                isObjectLike = _dereq_(203),
                isTypedArray = _dereq_(219),
                keys = _dereq_(223);

            /**
             * The base implementation of `_.merge` without support for argument juggling,
             * multiple sources, and `this` binding `customizer` functions.
             *
             * @private
             * @param {Object} object The destination object.
             * @param {Object} source The source object.
             * @param {Function} [customizer] The function to customize merged values.
             * @param {Array} [stackA=[]] Tracks traversed source objects.
             * @param {Array} [stackB=[]] Associates values with source counterparts.
             * @returns {Object} Returns `object`.
             */
            function baseMerge(object, source, customizer, stackA, stackB) {
                if (!isObject(object)) {
                    return object;
                }
                var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source)),
                    props = isSrcArr ? undefined : keys(source);

                arrayEach(props || source, function (srcValue, key) {
                    if (props) {
                        key = srcValue;
                        srcValue = source[key];
                    }
                    if (isObjectLike(srcValue)) {
                        stackA || (stackA = []);
                        stackB || (stackB = []);
                        baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
                    }
                    else {
                        var value = object[key],
                            result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
                            isCommon = result === undefined;

                        if (isCommon) {
                            result = srcValue;
                        }
                        if ((result !== undefined || (isSrcArr && !(key in object))) &&
                            (isCommon || (result === result ? (result !== value) : (value === value)))) {
                            object[key] = result;
                        }
                    }
                });
                return object;
            }

            module.exports = baseMerge;

        }, { "150": 150, "172": 172, "198": 198, "203": 203, "211": 211, "215": 215, "219": 219, "223": 223 }], 172: [function (_dereq_, module, exports) {
            var arrayCopy = _dereq_(149),
                isArguments = _dereq_(210),
                isArray = _dereq_(211),
                isArrayLike = _dereq_(198),
                isPlainObject = _dereq_(216),
                isTypedArray = _dereq_(219),
                toPlainObject = _dereq_(220);

            /**
             * A specialized version of `baseMerge` for arrays and objects which performs
             * deep merges and tracks traversed objects enabling objects with circular
             * references to be merged.
             *
             * @private
             * @param {Object} object The destination object.
             * @param {Object} source The source object.
             * @param {string} key The key of the value to merge.
             * @param {Function} mergeFunc The function to merge values.
             * @param {Function} [customizer] The function to customize merged values.
             * @param {Array} [stackA=[]] Tracks traversed source objects.
             * @param {Array} [stackB=[]] Associates values with source counterparts.
             * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
             */
            function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
                var length = stackA.length,
                    srcValue = source[key];

                while (length--) {
                    if (stackA[length] == srcValue) {
                        object[key] = stackB[length];
                        return;
                    }
                }
                var value = object[key],
                    result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
                    isCommon = result === undefined;

                if (isCommon) {
                    result = srcValue;
                    if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
                        result = isArray(value)
                            ? value
                            : (isArrayLike(value) ? arrayCopy(value) : []);
                    }
                    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
                        result = isArguments(value)
                            ? toPlainObject(value)
                            : (isPlainObject(value) ? value : {});
                    }
                    else {
                        isCommon = false;
                    }
                }
                // Add the source value to the stack of traversed objects and associate
                // it with its merged value.
                stackA.push(srcValue);
                stackB.push(result);

                if (isCommon) {
                    // Recursively merge objects and arrays (susceptible to call stack limits).
                    object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
                } else if (result === result ? (result !== value) : (value === value)) {
                    object[key] = result;
                }
            }

            module.exports = baseMergeDeep;

        }, { "149": 149, "198": 198, "210": 210, "211": 211, "216": 216, "219": 219, "220": 220 }], 173: [function (_dereq_, module, exports) {
            /**
             * The base implementation of `_.property` without support for deep paths.
             *
             * @private
             * @param {string} key The key of the property to get.
             * @returns {Function} Returns the new function.
             */
            function baseProperty(key) {
                return function (object) {
                    return object == null ? undefined : object[key];
                };
            }

            module.exports = baseProperty;

        }, {}], 174: [function (_dereq_, module, exports) {
            var baseGet = _dereq_(163),
                toPath = _dereq_(207);

            /**
             * A specialized version of `baseProperty` which supports deep paths.
             *
             * @private
             * @param {Array|string} path The path of the property to get.
             * @returns {Function} Returns the new function.
             */
            function basePropertyDeep(path) {
                var pathKey = (path + '');
                path = toPath(path);
                return function (object) {
                    return baseGet(object, path, pathKey);
                };
            }

            module.exports = basePropertyDeep;

        }, { "163": 163, "207": 207 }], 175: [function (_dereq_, module, exports) {
            /**
             * The base implementation of `_.slice` without an iteratee call guard.
             *
             * @private
             * @param {Array} array The array to slice.
             * @param {number} [start=0] The start position.
             * @param {number} [end=array.length] The end position.
             * @returns {Array} Returns the slice of `array`.
             */
            function baseSlice(array, start, end) {
                var index = -1,
                    length = array.length;

                start = start == null ? 0 : (+start || 0);
                if (start < 0) {
                    start = -start > length ? 0 : (length + start);
                }
                end = (end === undefined || end > length) ? length : (+end || 0);
                if (end < 0) {
                    end += length;
                }
                length = start > end ? 0 : ((end - start) >>> 0);
                start >>>= 0;

                var result = Array(length);
                while (++index < length) {
                    result[index] = array[index + start];
                }
                return result;
            }

            module.exports = baseSlice;

        }, {}], 176: [function (_dereq_, module, exports) {
            /**
             * The base implementation of `_.sortBy` which uses `comparer` to define
             * the sort order of `array` and replaces criteria objects with their
             * corresponding values.
             *
             * @private
             * @param {Array} array The array to sort.
             * @param {Function} comparer The function to define sort order.
             * @returns {Array} Returns `array`.
             */
            function baseSortBy(array, comparer) {
                var length = array.length;

                array.sort(comparer);
                while (length--) {
                    array[length] = array[length].value;
                }
                return array;
            }

            module.exports = baseSortBy;

        }, {}], 177: [function (_dereq_, module, exports) {
            /**
             * Converts `value` to a string if it's not one. An empty string is returned
             * for `null` or `undefined` values.
             *
             * @private
             * @param {*} value The value to process.
             * @returns {string} Returns the string.
             */
            function baseToString(value) {
                return value == null ? '' : (value + '');
            }

            module.exports = baseToString;

        }, {}], 178: [function (_dereq_, module, exports) {
            /**
             * The base implementation of `_.values` and `_.valuesIn` which creates an
             * array of `object` property values corresponding to the property names
             * of `props`.
             *
             * @private
             * @param {Object} object The object to query.
             * @param {Array} props The property names to get values for.
             * @returns {Object} Returns the array of property values.
             */
            function baseValues(object, props) {
                var index = -1,
                    length = props.length,
                    result = Array(length);

                while (++index < length) {
                    result[index] = object[props[index]];
                }
                return result;
            }

            module.exports = baseValues;

        }, {}], 179: [function (_dereq_, module, exports) {
            var identity = _dereq_(230);

            /**
             * A specialized version of `baseCallback` which only supports `this` binding
             * and specifying the number of arguments to provide to `func`.
             *
             * @private
             * @param {Function} func The function to bind.
             * @param {*} thisArg The `this` binding of `func`.
             * @param {number} [argCount] The number of arguments to provide to `func`.
             * @returns {Function} Returns the callback.
             */
            function bindCallback(func, thisArg, argCount) {
                if (typeof func != 'function') {
                    return identity;
                }
                if (thisArg === undefined) {
                    return func;
                }
                switch (argCount) {
                    case 1: return function (value) {
                        return func.call(thisArg, value);
                    };
                    case 3: return function (value, index, collection) {
                        return func.call(thisArg, value, index, collection);
                    };
                    case 4: return function (accumulator, value, index, collection) {
                        return func.call(thisArg, accumulator, value, index, collection);
                    };
                    case 5: return function (value, other, key, object, source) {
                        return func.call(thisArg, value, other, key, object, source);
                    };
                }
                return function () {
                    return func.apply(thisArg, arguments);
                };
            }

            module.exports = bindCallback;

        }, { "230": 230 }], 180: [function (_dereq_, module, exports) {
            (function (global) {
                /** Native method references. */
                var ArrayBuffer = global.ArrayBuffer,
                    Uint8Array = global.Uint8Array;

                /**
                 * Creates a clone of the given array buffer.
                 *
                 * @private
                 * @param {ArrayBuffer} buffer The array buffer to clone.
                 * @returns {ArrayBuffer} Returns the cloned array buffer.
                 */
                function bufferClone(buffer) {
                    var result = new ArrayBuffer(buffer.byteLength),
                        view = new Uint8Array(result);

                    view.set(new Uint8Array(buffer));
                    return result;
                }

                module.exports = bufferClone;

            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, {}], 181: [function (_dereq_, module, exports) {
            var baseCompareAscending = _dereq_(157);

            /**
             * Used by `_.sortBy` to compare transformed elements of a collection and stable
             * sort them in ascending order.
             *
             * @private
             * @param {Object} object The object to compare.
             * @param {Object} other The other object to compare.
             * @returns {number} Returns the sort order indicator for `object`.
             */
            function compareAscending(object, other) {
                return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
            }

            module.exports = compareAscending;

        }, { "157": 157 }], 182: [function (_dereq_, module, exports) {
            var bindCallback = _dereq_(179),
                isIterateeCall = _dereq_(200),
                restParam = _dereq_(148);

            /**
             * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
             *
             * @private
             * @param {Function} assigner The function to assign values.
             * @returns {Function} Returns the new assigner function.
             */
            function createAssigner(assigner) {
                return restParam(function (object, sources) {
                    var index = -1,
                        length = object == null ? 0 : sources.length,
                        customizer = length > 2 ? sources[length - 2] : undefined,
                        guard = length > 2 ? sources[2] : undefined,
                        thisArg = length > 1 ? sources[length - 1] : undefined;

                    if (typeof customizer == 'function') {
                        customizer = bindCallback(customizer, thisArg, 5);
                        length -= 2;
                    } else {
                        customizer = typeof thisArg == 'function' ? thisArg : undefined;
                        length -= (customizer ? 1 : 0);
                    }
                    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
                        customizer = length < 3 ? undefined : customizer;
                        length = 1;
                    }
                    while (++index < length) {
                        var source = sources[index];
                        if (source) {
                            assigner(object, source, customizer);
                        }
                    }
                    return object;
                });
            }

            module.exports = createAssigner;

        }, { "148": 148, "179": 179, "200": 200 }], 183: [function (_dereq_, module, exports) {
            var getLength = _dereq_(191),
                isLength = _dereq_(202),
                toObject = _dereq_(206);

            /**
             * Creates a `baseEach` or `baseEachRight` function.
             *
             * @private
             * @param {Function} eachFunc The function to iterate over a collection.
             * @param {boolean} [fromRight] Specify iterating from right to left.
             * @returns {Function} Returns the new base function.
             */
            function createBaseEach(eachFunc, fromRight) {
                return function (collection, iteratee) {
                    var length = collection ? getLength(collection) : 0;
                    if (!isLength(length)) {
                        return eachFunc(collection, iteratee);
                    }
                    var index = fromRight ? length : -1,
                        iterable = toObject(collection);

                    while ((fromRight ? index-- : ++index < length)) {
                        if (iteratee(iterable[index], index, iterable) === false) {
                            break;
                        }
                    }
                    return collection;
                };
            }

            module.exports = createBaseEach;

        }, { "191": 191, "202": 202, "206": 206 }], 184: [function (_dereq_, module, exports) {
            var toObject = _dereq_(206);

            /**
             * Creates a base function for `_.forIn` or `_.forInRight`.
             *
             * @private
             * @param {boolean} [fromRight] Specify iterating from right to left.
             * @returns {Function} Returns the new base function.
             */
            function createBaseFor(fromRight) {
                return function (object, iteratee, keysFunc) {
                    var iterable = toObject(object),
                        props = keysFunc(object),
                        length = props.length,
                        index = fromRight ? length : -1;

                    while ((fromRight ? index-- : ++index < length)) {
                        var key = props[index];
                        if (iteratee(iterable[key], key, iterable) === false) {
                            break;
                        }
                    }
                    return object;
                };
            }

            module.exports = createBaseFor;

        }, { "206": 206 }], 185: [function (_dereq_, module, exports) {
            var restParam = _dereq_(148);

            /**
             * Creates a `_.defaults` or `_.defaultsDeep` function.
             *
             * @private
             * @param {Function} assigner The function to assign values.
             * @param {Function} customizer The function to customize assigned values.
             * @returns {Function} Returns the new defaults function.
             */
            function createDefaults(assigner, customizer) {
                return restParam(function (args) {
                    var object = args[0];
                    if (object == null) {
                        return object;
                    }
                    args.push(customizer);
                    return assigner.apply(undefined, args);
                });
            }

            module.exports = createDefaults;

        }, { "148": 148 }], 186: [function (_dereq_, module, exports) {
            var bindCallback = _dereq_(179),
                isArray = _dereq_(211);

            /**
             * Creates a function for `_.forEach` or `_.forEachRight`.
             *
             * @private
             * @param {Function} arrayFunc The function to iterate over an array.
             * @param {Function} eachFunc The function to iterate over a collection.
             * @returns {Function} Returns the new each function.
             */
            function createForEach(arrayFunc, eachFunc) {
                return function (collection, iteratee, thisArg) {
                    return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
                        ? arrayFunc(collection, iteratee)
                        : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
                };
            }

            module.exports = createForEach;

        }, { "179": 179, "211": 211 }], 187: [function (_dereq_, module, exports) {
            var arraySome = _dereq_(151);

            /**
             * A specialized version of `baseIsEqualDeep` for arrays with support for
             * partial deep comparisons.
             *
             * @private
             * @param {Array} array The array to compare.
             * @param {Array} other The other array to compare.
             * @param {Function} equalFunc The function to determine equivalents of values.
             * @param {Function} [customizer] The function to customize comparing arrays.
             * @param {boolean} [isLoose] Specify performing partial comparisons.
             * @param {Array} [stackA] Tracks traversed `value` objects.
             * @param {Array} [stackB] Tracks traversed `other` objects.
             * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
             */
            function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
                var index = -1,
                    arrLength = array.length,
                    othLength = other.length;

                if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
                    return false;
                }
                // Ignore non-index properties.
                while (++index < arrLength) {
                    var arrValue = array[index],
                        othValue = other[index],
                        result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

                    if (result !== undefined) {
                        if (result) {
                            continue;
                        }
                        return false;
                    }
                    // Recursively compare arrays (susceptible to call stack limits).
                    if (isLoose) {
                        if (!arraySome(other, function (othValue) {
                            return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
                        })) {
                            return false;
                        }
                    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
                        return false;
                    }
                }
                return true;
            }

            module.exports = equalArrays;

        }, { "151": 151 }], 188: [function (_dereq_, module, exports) {
            /** `Object#toString` result references. */
            var boolTag = '[object Boolean]',
                dateTag = '[object Date]',
                errorTag = '[object Error]',
                numberTag = '[object Number]',
                regexpTag = '[object RegExp]',
                stringTag = '[object String]';

            /**
             * A specialized version of `baseIsEqualDeep` for comparing objects of
             * the same `toStringTag`.
             *
             * **Note:** This function only supports comparing values with tags of
             * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
             *
             * @private
             * @param {Object} object The object to compare.
             * @param {Object} other The other object to compare.
             * @param {string} tag The `toStringTag` of the objects to compare.
             * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
             */
            function equalByTag(object, other, tag) {
                switch (tag) {
                    case boolTag:
                    case dateTag:
                        // Coerce dates and booleans to numbers, dates to milliseconds and booleans
                        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
                        return +object == +other;

                    case errorTag:
                        return object.name == other.name && object.message == other.message;

                    case numberTag:
                        // Treat `NaN` vs. `NaN` as equal.
                        return (object != +object)
                            ? other != +other
                            : object == +other;

                    case regexpTag:
                    case stringTag:
                        // Coerce regexes to strings and treat strings primitives and string
                        // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
                        return object == (other + '');
                }
                return false;
            }

            module.exports = equalByTag;

        }, {}], 189: [function (_dereq_, module, exports) {
            var keys = _dereq_(223);

            /** Used for native method references. */
            var objectProto = Object.prototype;

            /** Used to check objects for own properties. */
            var hasOwnProperty = objectProto.hasOwnProperty;

            /**
             * A specialized version of `baseIsEqualDeep` for objects with support for
             * partial deep comparisons.
             *
             * @private
             * @param {Object} object The object to compare.
             * @param {Object} other The other object to compare.
             * @param {Function} equalFunc The function to determine equivalents of values.
             * @param {Function} [customizer] The function to customize comparing values.
             * @param {boolean} [isLoose] Specify performing partial comparisons.
             * @param {Array} [stackA] Tracks traversed `value` objects.
             * @param {Array} [stackB] Tracks traversed `other` objects.
             * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
             */
            function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
                var objProps = keys(object),
                    objLength = objProps.length,
                    othProps = keys(other),
                    othLength = othProps.length;

                if (objLength != othLength && !isLoose) {
                    return false;
                }
                var index = objLength;
                while (index--) {
                    var key = objProps[index];
                    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
                        return false;
                    }
                }
                var skipCtor = isLoose;
                while (++index < objLength) {
                    key = objProps[index];
                    var objValue = object[key],
                        othValue = other[key],
                        result = customizer ? customizer(isLoose ? othValue : objValue, isLoose ? objValue : othValue, key) : undefined;

                    // Recursively compare objects (susceptible to call stack limits).
                    if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
                        return false;
                    }
                    skipCtor || (skipCtor = key == 'constructor');
                }
                if (!skipCtor) {
                    var objCtor = object.constructor,
                        othCtor = other.constructor;

                    // Non `Object` object instances with different constructors are not equal.
                    if (objCtor != othCtor &&
                        ('constructor' in object && 'constructor' in other) &&
                        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
                            typeof othCtor == 'function' && othCtor instanceof othCtor)) {
                        return false;
                    }
                }
                return true;
            }

            module.exports = equalObjects;

        }, { "223": 223 }], 190: [function (_dereq_, module, exports) {
            /** Used to escape characters for inclusion in compiled regexes. */
            var regexpEscapes = {
                '0': 'x30', '1': 'x31', '2': 'x32', '3': 'x33', '4': 'x34',
                '5': 'x35', '6': 'x36', '7': 'x37', '8': 'x38', '9': 'x39',
                'A': 'x41', 'B': 'x42', 'C': 'x43', 'D': 'x44', 'E': 'x45', 'F': 'x46',
                'a': 'x61', 'b': 'x62', 'c': 'x63', 'd': 'x64', 'e': 'x65', 'f': 'x66',
                'n': 'x6e', 'r': 'x72', 't': 'x74', 'u': 'x75', 'v': 'x76', 'x': 'x78'
            };

            /** Used to escape characters for inclusion in compiled string literals. */
            var stringEscapes = {
                '\\': '\\',
                "'": "'",
                '\n': 'n',
                '\r': 'r',
                '\u2028': 'u2028',
                '\u2029': 'u2029'
            };

            /**
             * Used by `_.escapeRegExp` to escape characters for inclusion in compiled regexes.
             *
             * @private
             * @param {string} chr The matched character to escape.
             * @param {string} leadingChar The capture group for a leading character.
             * @param {string} whitespaceChar The capture group for a whitespace character.
             * @returns {string} Returns the escaped character.
             */
            function escapeRegExpChar(chr, leadingChar, whitespaceChar) {
                if (leadingChar) {
                    chr = regexpEscapes[chr];
                } else if (whitespaceChar) {
                    chr = stringEscapes[chr];
                }
                return '\\' + chr;
            }

            module.exports = escapeRegExpChar;

        }, {}], 191: [function (_dereq_, module, exports) {
            var baseProperty = _dereq_(173);

            /**
             * Gets the "length" property value of `object`.
             *
             * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
             * that affects Safari on at least iOS 8.1-8.3 ARM64.
             *
             * @private
             * @param {Object} object The object to query.
             * @returns {*} Returns the "length" value.
             */
            var getLength = baseProperty('length');

            module.exports = getLength;

        }, { "173": 173 }], 192: [function (_dereq_, module, exports) {
            var isStrictComparable = _dereq_(204),
                pairs = _dereq_(226);

            /**
             * Gets the propery names, values, and compare flags of `object`.
             *
             * @private
             * @param {Object} object The object to query.
             * @returns {Array} Returns the match data of `object`.
             */
            function getMatchData(object) {
                var result = pairs(object),
                    length = result.length;

                while (length--) {
                    result[length][2] = isStrictComparable(result[length][1]);
                }
                return result;
            }

            module.exports = getMatchData;

        }, { "204": 204, "226": 226 }], 193: [function (_dereq_, module, exports) {
            var isNative = _dereq_(214);

            /**
             * Gets the native function at `key` of `object`.
             *
             * @private
             * @param {Object} object The object to query.
             * @param {string} key The key of the method to get.
             * @returns {*} Returns the function if it's native, else `undefined`.
             */
            function getNative(object, key) {
                var value = object == null ? undefined : object[key];
                return isNative(value) ? value : undefined;
            }

            module.exports = getNative;

        }, { "214": 214 }], 194: [function (_dereq_, module, exports) {
            /**
             * Gets the index at which the first occurrence of `NaN` is found in `array`.
             *
             * @private
             * @param {Array} array The array to search.
             * @param {number} fromIndex The index to search from.
             * @param {boolean} [fromRight] Specify iterating from right to left.
             * @returns {number} Returns the index of the matched `NaN`, else `-1`.
             */
            function indexOfNaN(array, fromIndex, fromRight) {
                var length = array.length,
                    index = fromIndex + (fromRight ? 0 : -1);

                while ((fromRight ? index-- : ++index < length)) {
                    var other = array[index];
                    if (other !== other) {
                        return index;
                    }
                }
                return -1;
            }

            module.exports = indexOfNaN;

        }, {}], 195: [function (_dereq_, module, exports) {
            /** Used for native method references. */
            var objectProto = Object.prototype;

            /** Used to check objects for own properties. */
            var hasOwnProperty = objectProto.hasOwnProperty;

            /**
             * Initializes an array clone.
             *
             * @private
             * @param {Array} array The array to clone.
             * @returns {Array} Returns the initialized clone.
             */
            function initCloneArray(array) {
                var length = array.length,
                    result = new array.constructor(length);

                // Add array properties assigned by `RegExp#exec`.
                if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
                    result.index = array.index;
                    result.input = array.input;
                }
                return result;
            }

            module.exports = initCloneArray;

        }, {}], 196: [function (_dereq_, module, exports) {
            var bufferClone = _dereq_(180);

            /** `Object#toString` result references. */
            var boolTag = '[object Boolean]',
                dateTag = '[object Date]',
                numberTag = '[object Number]',
                regexpTag = '[object RegExp]',
                stringTag = '[object String]';

            var arrayBufferTag = '[object ArrayBuffer]',
                float32Tag = '[object Float32Array]',
                float64Tag = '[object Float64Array]',
                int8Tag = '[object Int8Array]',
                int16Tag = '[object Int16Array]',
                int32Tag = '[object Int32Array]',
                uint8Tag = '[object Uint8Array]',
                uint8ClampedTag = '[object Uint8ClampedArray]',
                uint16Tag = '[object Uint16Array]',
                uint32Tag = '[object Uint32Array]';

            /** Used to match `RegExp` flags from their coerced string values. */
            var reFlags = /\w*$/;

            /**
             * Initializes an object clone based on its `toStringTag`.
             *
             * **Note:** This function only supports cloning values with tags of
             * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
             *
             * @private
             * @param {Object} object The object to clone.
             * @param {string} tag The `toStringTag` of the object to clone.
             * @param {boolean} [isDeep] Specify a deep clone.
             * @returns {Object} Returns the initialized clone.
             */
            function initCloneByTag(object, tag, isDeep) {
                var Ctor = object.constructor;
                switch (tag) {
                    case arrayBufferTag:
                        return bufferClone(object);

                    case boolTag:
                    case dateTag:
                        return new Ctor(+object);

                    case float32Tag: case float64Tag:
                    case int8Tag: case int16Tag: case int32Tag:
                    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
                        var buffer = object.buffer;
                        return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

                    case numberTag:
                    case stringTag:
                        return new Ctor(object);

                    case regexpTag:
                        var result = new Ctor(object.source, reFlags.exec(object));
                        result.lastIndex = object.lastIndex;
                }
                return result;
            }

            module.exports = initCloneByTag;

        }, { "180": 180 }], 197: [function (_dereq_, module, exports) {
            /**
             * Initializes an object clone.
             *
             * @private
             * @param {Object} object The object to clone.
             * @returns {Object} Returns the initialized clone.
             */
            function initCloneObject(object) {
                var Ctor = object.constructor;
                if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
                    Ctor = Object;
                }
                return new Ctor;
            }

            module.exports = initCloneObject;

        }, {}], 198: [function (_dereq_, module, exports) {
            var getLength = _dereq_(191),
                isLength = _dereq_(202);

            /**
             * Checks if `value` is array-like.
             *
             * @private
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
             */
            function isArrayLike(value) {
                return value != null && isLength(getLength(value));
            }

            module.exports = isArrayLike;

        }, { "191": 191, "202": 202 }], 199: [function (_dereq_, module, exports) {
            /** Used to detect unsigned integer values. */
            var reIsUint = /^\d+$/;

            /**
             * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
             * of an array-like value.
             */
            var MAX_SAFE_INTEGER = 9007199254740991;

            /**
             * Checks if `value` is a valid array-like index.
             *
             * @private
             * @param {*} value The value to check.
             * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
             * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
             */
            function isIndex(value, length) {
                value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
                length = length == null ? MAX_SAFE_INTEGER : length;
                return value > -1 && value % 1 == 0 && value < length;
            }

            module.exports = isIndex;

        }, {}], 200: [function (_dereq_, module, exports) {
            var isArrayLike = _dereq_(198),
                isIndex = _dereq_(199),
                isObject = _dereq_(215);

            /**
             * Checks if the provided arguments are from an iteratee call.
             *
             * @private
             * @param {*} value The potential iteratee value argument.
             * @param {*} index The potential iteratee index or key argument.
             * @param {*} object The potential iteratee object argument.
             * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
             */
            function isIterateeCall(value, index, object) {
                if (!isObject(object)) {
                    return false;
                }
                var type = typeof index;
                if (type == 'number'
                    ? (isArrayLike(object) && isIndex(index, object.length))
                    : (type == 'string' && index in object)) {
                    var other = object[index];
                    return value === value ? (value === other) : (other !== other);
                }
                return false;
            }

            module.exports = isIterateeCall;

        }, { "198": 198, "199": 199, "215": 215 }], 201: [function (_dereq_, module, exports) {
            var isArray = _dereq_(211),
                toObject = _dereq_(206);

            /** Used to match property names within property paths. */
            var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
                reIsPlainProp = /^\w*$/;

            /**
             * Checks if `value` is a property name and not a property path.
             *
             * @private
             * @param {*} value The value to check.
             * @param {Object} [object] The object to query keys on.
             * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
             */
            function isKey(value, object) {
                var type = typeof value;
                if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
                    return true;
                }
                if (isArray(value)) {
                    return false;
                }
                var result = !reIsDeepProp.test(value);
                return result || (object != null && value in toObject(object));
            }

            module.exports = isKey;

        }, { "206": 206, "211": 211 }], 202: [function (_dereq_, module, exports) {
            /**
             * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
             * of an array-like value.
             */
            var MAX_SAFE_INTEGER = 9007199254740991;

            /**
             * Checks if `value` is a valid array-like length.
             *
             * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
             *
             * @private
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
             */
            function isLength(value) {
                return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
            }

            module.exports = isLength;

        }, {}], 203: [function (_dereq_, module, exports) {
            /**
             * Checks if `value` is object-like.
             *
             * @private
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
             */
            function isObjectLike(value) {
                return !!value && typeof value == 'object';
            }

            module.exports = isObjectLike;

        }, {}], 204: [function (_dereq_, module, exports) {
            var isObject = _dereq_(215);

            /**
             * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
             *
             * @private
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` if suitable for strict
             *  equality comparisons, else `false`.
             */
            function isStrictComparable(value) {
                return value === value && !isObject(value);
            }

            module.exports = isStrictComparable;

        }, { "215": 215 }], 205: [function (_dereq_, module, exports) {
            var isArguments = _dereq_(210),
                isArray = _dereq_(211),
                isIndex = _dereq_(199),
                isLength = _dereq_(202),
                keysIn = _dereq_(224);

            /** Used for native method references. */
            var objectProto = Object.prototype;

            /** Used to check objects for own properties. */
            var hasOwnProperty = objectProto.hasOwnProperty;

            /**
             * A fallback implementation of `Object.keys` which creates an array of the
             * own enumerable property names of `object`.
             *
             * @private
             * @param {Object} object The object to query.
             * @returns {Array} Returns the array of property names.
             */
            function shimKeys(object) {
                var props = keysIn(object),
                    propsLength = props.length,
                    length = propsLength && object.length;

                var allowIndexes = !!length && isLength(length) &&
                    (isArray(object) || isArguments(object));

                var index = -1,
                    result = [];

                while (++index < propsLength) {
                    var key = props[index];
                    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
                        result.push(key);
                    }
                }
                return result;
            }

            module.exports = shimKeys;

        }, { "199": 199, "202": 202, "210": 210, "211": 211, "224": 224 }], 206: [function (_dereq_, module, exports) {
            var isObject = _dereq_(215);

            /**
             * Converts `value` to an object if it's not one.
             *
             * @private
             * @param {*} value The value to process.
             * @returns {Object} Returns the object.
             */
            function toObject(value) {
                return isObject(value) ? value : Object(value);
            }

            module.exports = toObject;

        }, { "215": 215 }], 207: [function (_dereq_, module, exports) {
            var baseToString = _dereq_(177),
                isArray = _dereq_(211);

            /** Used to match property names within property paths. */
            var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

            /** Used to match backslashes in property paths. */
            var reEscapeChar = /\\(\\)?/g;

            /**
             * Converts `value` to property path array if it's not one.
             *
             * @private
             * @param {*} value The value to process.
             * @returns {Array} Returns the property path array.
             */
            function toPath(value) {
                if (isArray(value)) {
                    return value;
                }
                var result = [];
                baseToString(value).replace(rePropName, function (match, number, quote, string) {
                    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
                });
                return result;
            }

            module.exports = toPath;

        }, { "177": 177, "211": 211 }], 208: [function (_dereq_, module, exports) {
            var baseClone = _dereq_(156),
                bindCallback = _dereq_(179),
                isIterateeCall = _dereq_(200);

            /**
             * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
             * otherwise they are assigned by reference. If `customizer` is provided it's
             * invoked to produce the cloned values. If `customizer` returns `undefined`
             * cloning is handled by the method instead. The `customizer` is bound to
             * `thisArg` and invoked with up to three argument; (value [, index|key, object]).
             *
             * **Note:** This method is loosely based on the
             * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
             * The enumerable properties of `arguments` objects and objects created by
             * constructors other than `Object` are cloned to plain `Object` objects. An
             * empty object is returned for uncloneable values such as functions, DOM nodes,
             * Maps, Sets, and WeakMaps.
             *
             * @static
             * @memberOf _
             * @category Lang
             * @param {*} value The value to clone.
             * @param {boolean} [isDeep] Specify a deep clone.
             * @param {Function} [customizer] The function to customize cloning values.
             * @param {*} [thisArg] The `this` binding of `customizer`.
             * @returns {*} Returns the cloned value.
             * @example
             *
             * var users = [
             *   { 'user': 'barney' },
             *   { 'user': 'fred' }
             * ];
             *
             * var shallow = _.clone(users);
             * shallow[0] === users[0];
             * // => true
             *
             * var deep = _.clone(users, true);
             * deep[0] === users[0];
             * // => false
             *
             * // using a customizer callback
             * var el = _.clone(document.body, function(value) {
             *   if (_.isElement(value)) {
             *     return value.cloneNode(false);
             *   }
             * });
             *
             * el === document.body
             * // => false
             * el.nodeName
             * // => BODY
             * el.childNodes.length;
             * // => 0
             */
            function clone(value, isDeep, customizer, thisArg) {
                if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
                    isDeep = false;
                }
                else if (typeof isDeep == 'function') {
                    thisArg = customizer;
                    customizer = isDeep;
                    isDeep = false;
                }
                return typeof customizer == 'function'
                    ? baseClone(value, isDeep, bindCallback(customizer, thisArg, 3))
                    : baseClone(value, isDeep);
            }

            module.exports = clone;

        }, { "156": 156, "179": 179, "200": 200 }], 209: [function (_dereq_, module, exports) {
            var baseClone = _dereq_(156),
                bindCallback = _dereq_(179);

            /**
             * Creates a deep clone of `value`. If `customizer` is provided it's invoked
             * to produce the cloned values. If `customizer` returns `undefined` cloning
             * is handled by the method instead. The `customizer` is bound to `thisArg`
             * and invoked with up to three argument; (value [, index|key, object]).
             *
             * **Note:** This method is loosely based on the
             * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
             * The enumerable properties of `arguments` objects and objects created by
             * constructors other than `Object` are cloned to plain `Object` objects. An
             * empty object is returned for uncloneable values such as functions, DOM nodes,
             * Maps, Sets, and WeakMaps.
             *
             * @static
             * @memberOf _
             * @category Lang
             * @param {*} value The value to deep clone.
             * @param {Function} [customizer] The function to customize cloning values.
             * @param {*} [thisArg] The `this` binding of `customizer`.
             * @returns {*} Returns the deep cloned value.
             * @example
             *
             * var users = [
             *   { 'user': 'barney' },
             *   { 'user': 'fred' }
             * ];
             *
             * var deep = _.cloneDeep(users);
             * deep[0] === users[0];
             * // => false
             *
             * // using a customizer callback
             * var el = _.cloneDeep(document.body, function(value) {
             *   if (_.isElement(value)) {
             *     return value.cloneNode(true);
             *   }
             * });
             *
             * el === document.body
             * // => false
             * el.nodeName
             * // => BODY
             * el.childNodes.length;
             * // => 20
             */
            function cloneDeep(value, customizer, thisArg) {
                return typeof customizer == 'function'
                    ? baseClone(value, true, bindCallback(customizer, thisArg, 3))
                    : baseClone(value, true);
            }

            module.exports = cloneDeep;

        }, { "156": 156, "179": 179 }], 210: [function (_dereq_, module, exports) {
            var isArrayLike = _dereq_(198),
                isObjectLike = _dereq_(203);

            /** Used for native method references. */
            var objectProto = Object.prototype;

            /** Used to check objects for own properties. */
            var hasOwnProperty = objectProto.hasOwnProperty;

            /** Native method references. */
            var propertyIsEnumerable = objectProto.propertyIsEnumerable;

            /**
             * Checks if `value` is classified as an `arguments` object.
             *
             * @static
             * @memberOf _
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
             * @example
             *
             * _.isArguments(function() { return arguments; }());
             * // => true
             *
             * _.isArguments([1, 2, 3]);
             * // => false
             */
            function isArguments(value) {
                return isObjectLike(value) && isArrayLike(value) &&
                    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
            }

            module.exports = isArguments;

        }, { "198": 198, "203": 203 }], 211: [function (_dereq_, module, exports) {
            var getNative = _dereq_(193),
                isLength = _dereq_(202),
                isObjectLike = _dereq_(203);

            /** `Object#toString` result references. */
            var arrayTag = '[object Array]';

            /** Used for native method references. */
            var objectProto = Object.prototype;

            /**
             * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
             * of values.
             */
            var objToString = objectProto.toString;

            /* Native method references for those with the same name as other `lodash` methods. */
            var nativeIsArray = getNative(Array, 'isArray');

            /**
             * Checks if `value` is classified as an `Array` object.
             *
             * @static
             * @memberOf _
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
             * @example
             *
             * _.isArray([1, 2, 3]);
             * // => true
             *
             * _.isArray(function() { return arguments; }());
             * // => false
             */
            var isArray = nativeIsArray || function (value) {
                return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
            };

            module.exports = isArray;

        }, { "193": 193, "202": 202, "203": 203 }], 212: [function (_dereq_, module, exports) {
            var isObjectLike = _dereq_(203);

            /** `Object#toString` result references. */
            var boolTag = '[object Boolean]';

            /** Used for native method references. */
            var objectProto = Object.prototype;

            /**
             * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
             * of values.
             */
            var objToString = objectProto.toString;

            /**
             * Checks if `value` is classified as a boolean primitive or object.
             *
             * @static
             * @memberOf _
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
             * @example
             *
             * _.isBoolean(false);
             * // => true
             *
             * _.isBoolean(null);
             * // => false
             */
            function isBoolean(value) {
                return value === true || value === false || (isObjectLike(value) && objToString.call(value) == boolTag);
            }

            module.exports = isBoolean;

        }, { "203": 203 }], 213: [function (_dereq_, module, exports) {
            var isObject = _dereq_(215);

            /** `Object#toString` result references. */
            var funcTag = '[object Function]';

            /** Used for native method references. */
            var objectProto = Object.prototype;

            /**
             * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
             * of values.
             */
            var objToString = objectProto.toString;

            /**
             * Checks if `value` is classified as a `Function` object.
             *
             * @static
             * @memberOf _
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
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
                // in older versions of Chrome and Safari which return 'function' for regexes
                // and Safari 8 which returns 'object' for typed array constructors.
                return isObject(value) && objToString.call(value) == funcTag;
            }

            module.exports = isFunction;

        }, { "215": 215 }], 214: [function (_dereq_, module, exports) {
            var isFunction = _dereq_(213),
                isObjectLike = _dereq_(203);

            /** Used to detect host constructors (Safari > 5). */
            var reIsHostCtor = /^\[object .+?Constructor\]$/;

            /** Used for native method references. */
            var objectProto = Object.prototype;

            /** Used to resolve the decompiled source of functions. */
            var fnToString = Function.prototype.toString;

            /** Used to check objects for own properties. */
            var hasOwnProperty = objectProto.hasOwnProperty;

            /** Used to detect if a method is native. */
            var reIsNative = RegExp('^' +
                fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
                    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
            );

            /**
             * Checks if `value` is a native function.
             *
             * @static
             * @memberOf _
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
             * @example
             *
             * _.isNative(Array.prototype.push);
             * // => true
             *
             * _.isNative(_);
             * // => false
             */
            function isNative(value) {
                if (value == null) {
                    return false;
                }
                if (isFunction(value)) {
                    return reIsNative.test(fnToString.call(value));
                }
                return isObjectLike(value) && reIsHostCtor.test(value);
            }

            module.exports = isNative;

        }, { "203": 203, "213": 213 }], 215: [function (_dereq_, module, exports) {
            /**
             * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
             * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
             *
             * @static
             * @memberOf _
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
             * _.isObject(1);
             * // => false
             */
            function isObject(value) {
                // Avoid a V8 JIT bug in Chrome 19-20.
                // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
                var type = typeof value;
                return !!value && (type == 'object' || type == 'function');
            }

            module.exports = isObject;

        }, {}], 216: [function (_dereq_, module, exports) {
            var baseForIn = _dereq_(161),
                isArguments = _dereq_(210),
                isObjectLike = _dereq_(203);

            /** `Object#toString` result references. */
            var objectTag = '[object Object]';

            /** Used for native method references. */
            var objectProto = Object.prototype;

            /** Used to check objects for own properties. */
            var hasOwnProperty = objectProto.hasOwnProperty;

            /**
             * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
             * of values.
             */
            var objToString = objectProto.toString;

            /**
             * Checks if `value` is a plain object, that is, an object created by the
             * `Object` constructor or one with a `[[Prototype]]` of `null`.
             *
             * **Note:** This method assumes objects created by the `Object` constructor
             * have no inherited enumerable properties.
             *
             * @static
             * @memberOf _
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
             * @example
             *
             * function Foo() {
             *   this.a = 1;
             * }
             *
             * _.isPlainObject(new Foo);
             * // => false
             *
             * _.isPlainObject([1, 2, 3]);
             * // => false
             *
             * _.isPlainObject({ 'x': 0, 'y': 0 });
             * // => true
             *
             * _.isPlainObject(Object.create(null));
             * // => true
             */
            function isPlainObject(value) {
                var Ctor;

                // Exit early for non `Object` objects.
                if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
                    (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
                    return false;
                }
                // IE < 9 iterates inherited properties before own properties. If the first
                // iterated property is an object's own property then there are no inherited
                // enumerable properties.
                var result;
                // In most environments an object's own properties are iterated before
                // its inherited properties. If the last iterated property is an object's
                // own property then there are no inherited enumerable properties.
                baseForIn(value, function (subValue, key) {
                    result = key;
                });
                return result === undefined || hasOwnProperty.call(value, result);
            }

            module.exports = isPlainObject;

        }, { "161": 161, "203": 203, "210": 210 }], 217: [function (_dereq_, module, exports) {
            var isObject = _dereq_(215);

            /** `Object#toString` result references. */
            var regexpTag = '[object RegExp]';

            /** Used for native method references. */
            var objectProto = Object.prototype;

            /**
             * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
             * of values.
             */
            var objToString = objectProto.toString;

            /**
             * Checks if `value` is classified as a `RegExp` object.
             *
             * @static
             * @memberOf _
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
             * @example
             *
             * _.isRegExp(/abc/);
             * // => true
             *
             * _.isRegExp('/abc/');
             * // => false
             */
            function isRegExp(value) {
                return isObject(value) && objToString.call(value) == regexpTag;
            }

            module.exports = isRegExp;

        }, { "215": 215 }], 218: [function (_dereq_, module, exports) {
            var isObjectLike = _dereq_(203);

            /** `Object#toString` result references. */
            var stringTag = '[object String]';

            /** Used for native method references. */
            var objectProto = Object.prototype;

            /**
             * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
             * of values.
             */
            var objToString = objectProto.toString;

            /**
             * Checks if `value` is classified as a `String` primitive or object.
             *
             * @static
             * @memberOf _
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
             * @example
             *
             * _.isString('abc');
             * // => true
             *
             * _.isString(1);
             * // => false
             */
            function isString(value) {
                return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
            }

            module.exports = isString;

        }, { "203": 203 }], 219: [function (_dereq_, module, exports) {
            var isLength = _dereq_(202),
                isObjectLike = _dereq_(203);

            /** `Object#toString` result references. */
            var argsTag = '[object Arguments]',
                arrayTag = '[object Array]',
                boolTag = '[object Boolean]',
                dateTag = '[object Date]',
                errorTag = '[object Error]',
                funcTag = '[object Function]',
                mapTag = '[object Map]',
                numberTag = '[object Number]',
                objectTag = '[object Object]',
                regexpTag = '[object RegExp]',
                setTag = '[object Set]',
                stringTag = '[object String]',
                weakMapTag = '[object WeakMap]';

            var arrayBufferTag = '[object ArrayBuffer]',
                float32Tag = '[object Float32Array]',
                float64Tag = '[object Float64Array]',
                int8Tag = '[object Int8Array]',
                int16Tag = '[object Int16Array]',
                int32Tag = '[object Int32Array]',
                uint8Tag = '[object Uint8Array]',
                uint8ClampedTag = '[object Uint8ClampedArray]',
                uint16Tag = '[object Uint16Array]',
                uint32Tag = '[object Uint32Array]';

            /** Used to identify `toStringTag` values of typed arrays. */
            var typedArrayTags = {};
            typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
                typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
                typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
                typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
                typedArrayTags[uint32Tag] = true;
            typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
                typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
                typedArrayTags[dateTag] = typedArrayTags[errorTag] =
                typedArrayTags[funcTag] = typedArrayTags[mapTag] =
                typedArrayTags[numberTag] = typedArrayTags[objectTag] =
                typedArrayTags[regexpTag] = typedArrayTags[setTag] =
                typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

            /** Used for native method references. */
            var objectProto = Object.prototype;

            /**
             * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
             * of values.
             */
            var objToString = objectProto.toString;

            /**
             * Checks if `value` is classified as a typed array.
             *
             * @static
             * @memberOf _
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
             * @example
             *
             * _.isTypedArray(new Uint8Array);
             * // => true
             *
             * _.isTypedArray([]);
             * // => false
             */
            function isTypedArray(value) {
                return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
            }

            module.exports = isTypedArray;

        }, { "202": 202, "203": 203 }], 220: [function (_dereq_, module, exports) {
            var baseCopy = _dereq_(158),
                keysIn = _dereq_(224);

            /**
             * Converts `value` to a plain object flattening inherited enumerable
             * properties of `value` to own properties of the plain object.
             *
             * @static
             * @memberOf _
             * @category Lang
             * @param {*} value The value to convert.
             * @returns {Object} Returns the converted plain object.
             * @example
             *
             * function Foo() {
             *   this.b = 2;
             * }
             *
             * Foo.prototype.c = 3;
             *
             * _.assign({ 'a': 1 }, new Foo);
             * // => { 'a': 1, 'b': 2 }
             *
             * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
             * // => { 'a': 1, 'b': 2, 'c': 3 }
             */
            function toPlainObject(value) {
                return baseCopy(value, keysIn(value));
            }

            module.exports = toPlainObject;

        }, { "158": 158, "224": 224 }], 221: [function (_dereq_, module, exports) {
            var assignWith = _dereq_(153),
                baseAssign = _dereq_(154),
                createAssigner = _dereq_(182);

            /**
             * Assigns own enumerable properties of source object(s) to the destination
             * object. Subsequent sources overwrite property assignments of previous sources.
             * If `customizer` is provided it's invoked to produce the assigned values.
             * The `customizer` is bound to `thisArg` and invoked with five arguments:
             * (objectValue, sourceValue, key, object, source).
             *
             * **Note:** This method mutates `object` and is based on
             * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
             *
             * @static
             * @memberOf _
             * @alias extend
             * @category Object
             * @param {Object} object The destination object.
             * @param {...Object} [sources] The source objects.
             * @param {Function} [customizer] The function to customize assigned values.
             * @param {*} [thisArg] The `this` binding of `customizer`.
             * @returns {Object} Returns `object`.
             * @example
             *
             * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
             * // => { 'user': 'fred', 'age': 40 }
             *
             * // using a customizer callback
             * var defaults = _.partialRight(_.assign, function(value, other) {
             *   return _.isUndefined(value) ? other : value;
             * });
             *
             * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
             * // => { 'user': 'barney', 'age': 36 }
             */
            var assign = createAssigner(function (object, source, customizer) {
                return customizer
                    ? assignWith(object, source, customizer)
                    : baseAssign(object, source);
            });

            module.exports = assign;

        }, { "153": 153, "154": 154, "182": 182 }], 222: [function (_dereq_, module, exports) {
            var assign = _dereq_(221),
                assignDefaults = _dereq_(152),
                createDefaults = _dereq_(185);

            /**
             * Assigns own enumerable properties of source object(s) to the destination
             * object for all destination properties that resolve to `undefined`. Once a
             * property is set, additional values of the same property are ignored.
             *
             * **Note:** This method mutates `object`.
             *
             * @static
             * @memberOf _
             * @category Object
             * @param {Object} object The destination object.
             * @param {...Object} [sources] The source objects.
             * @returns {Object} Returns `object`.
             * @example
             *
             * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
             * // => { 'user': 'barney', 'age': 36 }
             */
            var defaults = createDefaults(assign, assignDefaults);

            module.exports = defaults;

        }, { "152": 152, "185": 185, "221": 221 }], 223: [function (_dereq_, module, exports) {
            var getNative = _dereq_(193),
                isArrayLike = _dereq_(198),
                isObject = _dereq_(215),
                shimKeys = _dereq_(205);

            /* Native method references for those with the same name as other `lodash` methods. */
            var nativeKeys = getNative(Object, 'keys');

            /**
             * Creates an array of the own enumerable property names of `object`.
             *
             * **Note:** Non-object values are coerced to objects. See the
             * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
             * for more details.
             *
             * @static
             * @memberOf _
             * @category Object
             * @param {Object} object The object to query.
             * @returns {Array} Returns the array of property names.
             * @example
             *
             * function Foo() {
             *   this.a = 1;
             *   this.b = 2;
             * }
             *
             * Foo.prototype.c = 3;
             *
             * _.keys(new Foo);
             * // => ['a', 'b'] (iteration order is not guaranteed)
             *
             * _.keys('hi');
             * // => ['0', '1']
             */
            var keys = !nativeKeys ? shimKeys : function (object) {
                var Ctor = object == null ? undefined : object.constructor;
                if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
                    (typeof object != 'function' && isArrayLike(object))) {
                    return shimKeys(object);
                }
                return isObject(object) ? nativeKeys(object) : [];
            };

            module.exports = keys;

        }, { "193": 193, "198": 198, "205": 205, "215": 215 }], 224: [function (_dereq_, module, exports) {
            var isArguments = _dereq_(210),
                isArray = _dereq_(211),
                isIndex = _dereq_(199),
                isLength = _dereq_(202),
                isObject = _dereq_(215);

            /** Used for native method references. */
            var objectProto = Object.prototype;

            /** Used to check objects for own properties. */
            var hasOwnProperty = objectProto.hasOwnProperty;

            /**
             * Creates an array of the own and inherited enumerable property names of `object`.
             *
             * **Note:** Non-object values are coerced to objects.
             *
             * @static
             * @memberOf _
             * @category Object
             * @param {Object} object The object to query.
             * @returns {Array} Returns the array of property names.
             * @example
             *
             * function Foo() {
             *   this.a = 1;
             *   this.b = 2;
             * }
             *
             * Foo.prototype.c = 3;
             *
             * _.keysIn(new Foo);
             * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
             */
            function keysIn(object) {
                if (object == null) {
                    return [];
                }
                if (!isObject(object)) {
                    object = Object(object);
                }
                var length = object.length;
                length = (length && isLength(length) &&
                    (isArray(object) || isArguments(object)) && length) || 0;

                var Ctor = object.constructor,
                    index = -1,
                    isProto = typeof Ctor == 'function' && Ctor.prototype === object,
                    result = Array(length),
                    skipIndexes = length > 0;

                while (++index < length) {
                    result[index] = (index + '');
                }
                for (var key in object) {
                    if (!(skipIndexes && isIndex(key, length)) &&
                        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
                        result.push(key);
                    }
                }
                return result;
            }

            module.exports = keysIn;

        }, { "199": 199, "202": 202, "210": 210, "211": 211, "215": 215 }], 225: [function (_dereq_, module, exports) {
            var baseMerge = _dereq_(171),
                createAssigner = _dereq_(182);

            /**
             * Recursively merges own enumerable properties of the source object(s), that
             * don't resolve to `undefined` into the destination object. Subsequent sources
             * overwrite property assignments of previous sources. If `customizer` is
             * provided it's invoked to produce the merged values of the destination and
             * source properties. If `customizer` returns `undefined` merging is handled
             * by the method instead. The `customizer` is bound to `thisArg` and invoked
             * with five arguments: (objectValue, sourceValue, key, object, source).
             *
             * @static
             * @memberOf _
             * @category Object
             * @param {Object} object The destination object.
             * @param {...Object} [sources] The source objects.
             * @param {Function} [customizer] The function to customize assigned values.
             * @param {*} [thisArg] The `this` binding of `customizer`.
             * @returns {Object} Returns `object`.
             * @example
             *
             * var users = {
             *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
             * };
             *
             * var ages = {
             *   'data': [{ 'age': 36 }, { 'age': 40 }]
             * };
             *
             * _.merge(users, ages);
             * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
             *
             * // using a customizer callback
             * var object = {
             *   'fruits': ['apple'],
             *   'vegetables': ['beet']
             * };
             *
             * var other = {
             *   'fruits': ['banana'],
             *   'vegetables': ['carrot']
             * };
             *
             * _.merge(object, other, function(a, b) {
             *   if (_.isArray(a)) {
             *     return a.concat(b);
             *   }
             * });
             * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
             */
            var merge = createAssigner(baseMerge);

            module.exports = merge;

        }, { "171": 171, "182": 182 }], 226: [function (_dereq_, module, exports) {
            var keys = _dereq_(223),
                toObject = _dereq_(206);

            /**
             * Creates a two dimensional array of the key-value pairs for `object`,
             * e.g. `[[key1, value1], [key2, value2]]`.
             *
             * @static
             * @memberOf _
             * @category Object
             * @param {Object} object The object to query.
             * @returns {Array} Returns the new array of key-value pairs.
             * @example
             *
             * _.pairs({ 'barney': 36, 'fred': 40 });
             * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
             */
            function pairs(object) {
                object = toObject(object);

                var index = -1,
                    props = keys(object),
                    length = props.length,
                    result = Array(length);

                while (++index < length) {
                    var key = props[index];
                    result[index] = [key, object[key]];
                }
                return result;
            }

            module.exports = pairs;

        }, { "206": 206, "223": 223 }], 227: [function (_dereq_, module, exports) {
            var baseValues = _dereq_(178),
                keys = _dereq_(223);

            /**
             * Creates an array of the own enumerable property values of `object`.
             *
             * **Note:** Non-object values are coerced to objects.
             *
             * @static
             * @memberOf _
             * @category Object
             * @param {Object} object The object to query.
             * @returns {Array} Returns the array of property values.
             * @example
             *
             * function Foo() {
             *   this.a = 1;
             *   this.b = 2;
             * }
             *
             * Foo.prototype.c = 3;
             *
             * _.values(new Foo);
             * // => [1, 2] (iteration order is not guaranteed)
             *
             * _.values('hi');
             * // => ['h', 'i']
             */
            function values(object) {
                return baseValues(object, keys(object));
            }

            module.exports = values;

        }, { "178": 178, "223": 223 }], 228: [function (_dereq_, module, exports) {
            var baseToString = _dereq_(177),
                escapeRegExpChar = _dereq_(190);

            /**
             * Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns)
             * and those outlined by [`EscapeRegExpPattern`](http://ecma-international.org/ecma-262/6.0/#sec-escaperegexppattern).
             */
            var reRegExpChars = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,
                reHasRegExpChars = RegExp(reRegExpChars.source);

            /**
             * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
             * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
             *
             * @static
             * @memberOf _
             * @category String
             * @param {string} [string=''] The string to escape.
             * @returns {string} Returns the escaped string.
             * @example
             *
             * _.escapeRegExp('[lodash](https://lodash.com/)');
             * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
             */
            function escapeRegExp(string) {
                string = baseToString(string);
                return (string && reHasRegExpChars.test(string))
                    ? string.replace(reRegExpChars, escapeRegExpChar)
                    : (string || '(?:)');
            }

            module.exports = escapeRegExp;

        }, { "177": 177, "190": 190 }], 229: [function (_dereq_, module, exports) {
            var baseToString = _dereq_(177);

            /* Native method references for those with the same name as other `lodash` methods. */
            var nativeMin = Math.min;

            /**
             * Checks if `string` starts with the given target string.
             *
             * @static
             * @memberOf _
             * @category String
             * @param {string} [string=''] The string to search.
             * @param {string} [target] The string to search for.
             * @param {number} [position=0] The position to search from.
             * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
             * @example
             *
             * _.startsWith('abc', 'a');
             * // => true
             *
             * _.startsWith('abc', 'b');
             * // => false
             *
             * _.startsWith('abc', 'b', 1);
             * // => true
             */
            function startsWith(string, target, position) {
                string = baseToString(string);
                position = position == null
                    ? 0
                    : nativeMin(position < 0 ? 0 : (+position || 0), string.length);

                return string.lastIndexOf(target, position) == position;
            }

            module.exports = startsWith;

        }, { "177": 177 }], 230: [function (_dereq_, module, exports) {
            /**
             * This method returns the first argument provided to it.
             *
             * @static
             * @memberOf _
             * @category Utility
             * @param {*} value Any value.
             * @returns {*} Returns `value`.
             * @example
             *
             * var object = { 'user': 'fred' };
             *
             * _.identity(object) === object;
             * // => true
             */
            function identity(value) {
                return value;
            }

            module.exports = identity;

        }, {}], 231: [function (_dereq_, module, exports) {
            var baseProperty = _dereq_(173),
                basePropertyDeep = _dereq_(174),
                isKey = _dereq_(201);

            /**
             * Creates a function that returns the property value at `path` on a
             * given object.
             *
             * @static
             * @memberOf _
             * @category Utility
             * @param {Array|string} path The path of the property to get.
             * @returns {Function} Returns the new function.
             * @example
             *
             * var objects = [
             *   { 'a': { 'b': { 'c': 2 } } },
             *   { 'a': { 'b': { 'c': 1 } } }
             * ];
             *
             * _.map(objects, _.property('a.b.c'));
             * // => [2, 1]
             *
             * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
             * // => [1, 2]
             */
            function property(path) {
                return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
            }

            module.exports = property;

        }, { "173": 173, "174": 174, "201": 201 }], 232: [function (_dereq_, module, exports) {
            module.exports = minimatch
            minimatch.Minimatch = Minimatch

            var path = { sep: '/' }
            try {
                path = _dereq_(7)
            } catch (er) { }

            var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
            var expand = _dereq_(74)

            // any single thing other than /
            // don't need to escape / when using new RegExp()
            var qmark = '[^/]'

            // * => any number of characters
            var star = qmark + '*?'

            // ** when dots are allowed.  Anything goes, except .. and .
            // not (^ or / followed by one or two dots followed by $ or /),
            // followed by anything, any number of times.
            var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

            // not a ^ or / followed by a dot,
            // followed by anything, any number of times.
            var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

            // characters that need to be escaped in RegExp.
            var reSpecials = charSet('().*{}+?[]^$\\!')

            // "abc" -> { a:true, b:true, c:true }
            function charSet(s) {
                return s.split('').reduce(function (set, c) {
                    set[c] = true
                    return set
                }, {})
            }

            // normalizes slashes.
            var slashSplit = /\/+/

            minimatch.filter = filter
            function filter(pattern, options) {
                options = options || {}
                return function (p, i, list) {
                    return minimatch(p, pattern, options)
                }
            }

            function ext(a, b) {
                a = a || {}
                b = b || {}
                var t = {}
                Object.keys(b).forEach(function (k) {
                    t[k] = b[k]
                })
                Object.keys(a).forEach(function (k) {
                    t[k] = a[k]
                })
                return t
            }

            minimatch.defaults = function (def) {
                if (!def || !Object.keys(def).length) return minimatch

                var orig = minimatch

                var m = function minimatch(p, pattern, options) {
                    return orig.minimatch(p, pattern, ext(def, options))
                }

                m.Minimatch = function Minimatch(pattern, options) {
                    return new orig.Minimatch(pattern, ext(def, options))
                }

                return m
            }

            Minimatch.defaults = function (def) {
                if (!def || !Object.keys(def).length) return Minimatch
                return minimatch.defaults(def).Minimatch
            }

            function minimatch(p, pattern, options) {
                if (typeof pattern !== 'string') {
                    throw new TypeError('glob pattern string required')
                }

                if (!options) options = {}

                // shortcut: comments match nothing.
                if (!options.nocomment && pattern.charAt(0) === '#') {
                    return false
                }

                // "" only matches ""
                if (pattern.trim() === '') return p === ''

                return new Minimatch(pattern, options).match(p)
            }

            function Minimatch(pattern, options) {
                if (!(this instanceof Minimatch)) {
                    return new Minimatch(pattern, options)
                }

                if (typeof pattern !== 'string') {
                    throw new TypeError('glob pattern string required')
                }

                if (!options) options = {}
                pattern = pattern.trim()

                // windows support: need to use /, not \
                if (path.sep !== '/') {
                    pattern = pattern.split(path.sep).join('/')
                }

                this.options = options
                this.set = []
                this.pattern = pattern
                this.regexp = null
                this.negate = false
                this.comment = false
                this.empty = false

                // make the set of regexps etc.
                this.make()
            }

            Minimatch.prototype.debug = function () { }

            Minimatch.prototype.make = make
            function make() {
                // don't do it more than once.
                if (this._made) return

                var pattern = this.pattern
                var options = this.options

                // empty patterns and comments match nothing.
                if (!options.nocomment && pattern.charAt(0) === '#') {
                    this.comment = true
                    return
                }
                if (!pattern) {
                    this.empty = true
                    return
                }

                // step 1: figure out negation, etc.
                this.parseNegate()

                // step 2: expand braces
                var set = this.globSet = this.braceExpand()

                if (options.debug) this.debug = console.error

                this.debug(this.pattern, set)

                // step 3: now we have a set, so turn each one into a series of path-portion
                // matching patterns.
                // These will be regexps, except in the case of "**", which is
                // set to the GLOBSTAR object for globstar behavior,
                // and will not contain any / characters
                set = this.globParts = set.map(function (s) {
                    return s.split(slashSplit)
                })

                this.debug(this.pattern, set)

                // glob --> regexps
                set = set.map(function (s, si, set) {
                    return s.map(this.parse, this)
                }, this)

                this.debug(this.pattern, set)

                // filter out everything that didn't compile properly.
                set = set.filter(function (s) {
                    return s.indexOf(false) === -1
                })

                this.debug(this.pattern, set)

                this.set = set
            }

            Minimatch.prototype.parseNegate = parseNegate
            function parseNegate() {
                var pattern = this.pattern
                var negate = false
                var options = this.options
                var negateOffset = 0

                if (options.nonegate) return

                for (var i = 0, l = pattern.length
                    ; i < l && pattern.charAt(i) === '!'
                    ; i++) {
                    negate = !negate
                    negateOffset++
                }

                if (negateOffset) this.pattern = pattern.substr(negateOffset)
                this.negate = negate
            }

            // Brace expansion:
            // a{b,c}d -> abd acd
            // a{b,}c -> abc ac
            // a{0..3}d -> a0d a1d a2d a3d
            // a{b,c{d,e}f}g -> abg acdfg acefg
            // a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
            //
            // Invalid sets are not expanded.
            // a{2..}b -> a{2..}b
            // a{b}c -> a{b}c
            minimatch.braceExpand = function (pattern, options) {
                return braceExpand(pattern, options)
            }

            Minimatch.prototype.braceExpand = braceExpand

            function braceExpand(pattern, options) {
                if (!options) {
                    if (this instanceof Minimatch) {
                        options = this.options
                    } else {
                        options = {}
                    }
                }

                pattern = typeof pattern === 'undefined'
                    ? this.pattern : pattern

                if (typeof pattern === 'undefined') {
                    throw new Error('undefined pattern')
                }

                if (options.nobrace ||
                    !pattern.match(/\{.*\}/)) {
                    // shortcut. no need to expand.
                    return [pattern]
                }

                return expand(pattern)
            }

            // parse a component of the expanded set.
            // At this point, no pattern may contain "/" in it
            // so we're going to return a 2d array, where each entry is the full
            // pattern, split on '/', and then turned into a regular expression.
            // A regexp is made at the end which joins each array with an
            // escaped /, and another full one which joins each regexp with |.
            //
            // Following the lead of Bash 4.1, note that "**" only has special meaning
            // when it is the *only* thing in a path portion.  Otherwise, any series
            // of * is equivalent to a single *.  Globstar behavior is enabled by
            // default, and can be disabled by setting options.noglobstar.
            Minimatch.prototype.parse = parse
            var SUBPARSE = {}
            function parse(pattern, isSub) {
                var options = this.options

                // shortcuts
                if (!options.noglobstar && pattern === '**') return GLOBSTAR
                if (pattern === '') return ''

                var re = ''
                var hasMagic = !!options.nocase
                var escaping = false
                // ? => one single character
                var patternListStack = []
                var negativeLists = []
                var plType
                var stateChar
                var inClass = false
                var reClassStart = -1
                var classStart = -1
                // . and .. never match anything that doesn't start with .,
                // even when options.dot is set.
                var patternStart = pattern.charAt(0) === '.' ? '' // anything
                    // not (start or / followed by . or .. followed by / or end)
                    : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
                        : '(?!\\.)'
                var self = this

                function clearStateChar() {
                    if (stateChar) {
                        // we had some state-tracking character
                        // that wasn't consumed by this pass.
                        switch (stateChar) {
                            case '*':
                                re += star
                                hasMagic = true
                                break
                            case '?':
                                re += qmark
                                hasMagic = true
                                break
                            default:
                                re += '\\' + stateChar
                                break
                        }
                        self.debug('clearStateChar %j %j', stateChar, re)
                        stateChar = false
                    }
                }

                for (var i = 0, len = pattern.length, c
                    ; (i < len) && (c = pattern.charAt(i))
                    ; i++) {
                    this.debug('%s\t%s %s %j', pattern, i, re, c)

                    // skip over any that are escaped.
                    if (escaping && reSpecials[c]) {
                        re += '\\' + c
                        escaping = false
                        continue
                    }

                    switch (c) {
                        case '/':
                            // completely not allowed, even escaped.
                            // Should already be path-split by now.
                            return false

                        case '\\':
                            clearStateChar()
                            escaping = true
                            continue

                        // the various stateChar values
                        // for the "extglob" stuff.
                        case '?':
                        case '*':
                        case '+':
                        case '@':
                        case '!':
                            this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

                            // all of those are literals inside a class, except that
                            // the glob [!a] means [^a] in regexp
                            if (inClass) {
                                this.debug('  in class')
                                if (c === '!' && i === classStart + 1) c = '^'
                                re += c
                                continue
                            }

                            // if we already have a stateChar, then it means
                            // that there was something like ** or +? in there.
                            // Handle the stateChar, then proceed with this one.
                            self.debug('call clearStateChar %j', stateChar)
                            clearStateChar()
                            stateChar = c
                            // if extglob is disabled, then +(asdf|foo) isn't a thing.
                            // just clear the statechar *now*, rather than even diving into
                            // the patternList stuff.
                            if (options.noext) clearStateChar()
                            continue

                        case '(':
                            if (inClass) {
                                re += '('
                                continue
                            }

                            if (!stateChar) {
                                re += '\\('
                                continue
                            }

                            plType = stateChar
                            patternListStack.push({
                                type: plType,
                                start: i - 1,
                                reStart: re.length
                            })
                            // negation is (?:(?!js)[^/]*)
                            re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
                            this.debug('plType %j %j', stateChar, re)
                            stateChar = false
                            continue

                        case ')':
                            if (inClass || !patternListStack.length) {
                                re += '\\)'
                                continue
                            }

                            clearStateChar()
                            hasMagic = true
                            re += ')'
                            var pl = patternListStack.pop()
                            plType = pl.type
                            // negation is (?:(?!js)[^/]*)
                            // The others are (?:<pattern>)<type>
                            switch (plType) {
                                case '!':
                                    negativeLists.push(pl)
                                    re += ')[^/]*?)'
                                    pl.reEnd = re.length
                                    break
                                case '?':
                                case '+':
                                case '*':
                                    re += plType
                                    break
                                case '@': break // the default anyway
                            }
                            continue

                        case '|':
                            if (inClass || !patternListStack.length || escaping) {
                                re += '\\|'
                                escaping = false
                                continue
                            }

                            clearStateChar()
                            re += '|'
                            continue

                        // these are mostly the same in regexp and glob
                        case '[':
                            // swallow any state-tracking char before the [
                            clearStateChar()

                            if (inClass) {
                                re += '\\' + c
                                continue
                            }

                            inClass = true
                            classStart = i
                            reClassStart = re.length
                            re += c
                            continue

                        case ']':
                            //  a right bracket shall lose its special
                            //  meaning and represent itself in
                            //  a bracket expression if it occurs
                            //  first in the list.  -- POSIX.2 2.8.3.2
                            if (i === classStart + 1 || !inClass) {
                                re += '\\' + c
                                escaping = false
                                continue
                            }

                            // handle the case where we left a class open.
                            // "[z-a]" is valid, equivalent to "\[z-a\]"
                            if (inClass) {
                                // split where the last [ was, make sure we don't have
                                // an invalid re. if so, re-walk the contents of the
                                // would-be class to re-translate any characters that
                                // were passed through as-is
                                // TODO: It would probably be faster to determine this
                                // without a try/catch and a new RegExp, but it's tricky
                                // to do safely.  For now, this is safe and works.
                                var cs = pattern.substring(classStart + 1, i)
                                try {
                                    RegExp('[' + cs + ']')
                                } catch (er) {
                                    // not a valid class!
                                    var sp = this.parse(cs, SUBPARSE)
                                    re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
                                    hasMagic = hasMagic || sp[1]
                                    inClass = false
                                    continue
                                }
                            }

                            // finish up the class.
                            hasMagic = true
                            inClass = false
                            re += c
                            continue

                        default:
                            // swallow any state char that wasn't consumed
                            clearStateChar()

                            if (escaping) {
                                // no need
                                escaping = false
                            } else if (reSpecials[c]
                                && !(c === '^' && inClass)) {
                                re += '\\'
                            }

                            re += c

                    } // switch
                } // for

                // handle the case where we left a class open.
                // "[abc" is valid, equivalent to "\[abc"
                if (inClass) {
                    // split where the last [ was, and escape it
                    // this is a huge pita.  We now have to re-walk
                    // the contents of the would-be class to re-translate
                    // any characters that were passed through as-is
                    cs = pattern.substr(classStart + 1)
                    sp = this.parse(cs, SUBPARSE)
                    re = re.substr(0, reClassStart) + '\\[' + sp[0]
                    hasMagic = hasMagic || sp[1]
                }

                // handle the case where we had a +( thing at the *end*
                // of the pattern.
                // each pattern list stack adds 3 chars, and we need to go through
                // and escape any | chars that were passed through as-is for the regexp.
                // Go through and escape them, taking care not to double-escape any
                // | chars that were already escaped.
                for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
                    var tail = re.slice(pl.reStart + 3)
                    // maybe some even number of \, then maybe 1 \, followed by a |
                    tail = tail.replace(/((?:\\{2})*)(\\?)\|/g, function (_, $1, $2) {
                        if (!$2) {
                            // the | isn't already escaped, so escape it.
                            $2 = '\\'
                        }

                        // need to escape all those slashes *again*, without escaping the
                        // one that we need for escaping the | character.  As it works out,
                        // escaping an even number of slashes can be done by simply repeating
                        // it exactly after itself.  That's why this trick works.
                        //
                        // I am sorry that you have to see this.
                        return $1 + $1 + $2 + '|'
                    })

                    this.debug('tail=%j\n   %s', tail, tail)
                    var t = pl.type === '*' ? star
                        : pl.type === '?' ? qmark
                            : '\\' + pl.type

                    hasMagic = true
                    re = re.slice(0, pl.reStart) + t + '\\(' + tail
                }

                // handle trailing things that only matter at the very end.
                clearStateChar()
                if (escaping) {
                    // trailing \\
                    re += '\\\\'
                }

                // only need to apply the nodot start if the re starts with
                // something that could conceivably capture a dot
                var addPatternStart = false
                switch (re.charAt(0)) {
                    case '.':
                    case '[':
                    case '(': addPatternStart = true
                }

                // Hack to work around lack of negative lookbehind in JS
                // A pattern like: *.!(x).!(y|z) needs to ensure that a name
                // like 'a.xyz.yz' doesn't match.  So, the first negative
                // lookahead, has to look ALL the way ahead, to the end of
                // the pattern.
                for (var n = negativeLists.length - 1; n > -1; n--) {
                    var nl = negativeLists[n]

                    var nlBefore = re.slice(0, nl.reStart)
                    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
                    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
                    var nlAfter = re.slice(nl.reEnd)

                    nlLast += nlAfter

                    // Handle nested stuff like *(*.js|!(*.json)), where open parens
                    // mean that we should *not* include the ) in the bit that is considered
                    // "after" the negated section.
                    var openParensBefore = nlBefore.split('(').length - 1
                    var cleanAfter = nlAfter
                    for (i = 0; i < openParensBefore; i++) {
                        cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
                    }
                    nlAfter = cleanAfter

                    var dollar = ''
                    if (nlAfter === '' && isSub !== SUBPARSE) {
                        dollar = '$'
                    }
                    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
                    re = newRe
                }

                // if the re is not "" at this point, then we need to make sure
                // it doesn't match against an empty path part.
                // Otherwise a/* will match a/, which it should not.
                if (re !== '' && hasMagic) {
                    re = '(?=.)' + re
                }

                if (addPatternStart) {
                    re = patternStart + re
                }

                // parsing just a piece of a larger pattern.
                if (isSub === SUBPARSE) {
                    return [re, hasMagic]
                }

                // skip the regexp for non-magical patterns
                // unescape anything in it, though, so that it'll be
                // an exact match against a file etc.
                if (!hasMagic) {
                    return globUnescape(pattern)
                }

                var flags = options.nocase ? 'i' : ''
                var regExp = new RegExp('^' + re + '$', flags)

                regExp._glob = pattern
                regExp._src = re

                return regExp
            }

            minimatch.makeRe = function (pattern, options) {
                return new Minimatch(pattern, options || {}).makeRe()
            }

            Minimatch.prototype.makeRe = makeRe
            function makeRe() {
                if (this.regexp || this.regexp === false) return this.regexp

                // at this point, this.set is a 2d array of partial
                // pattern strings, or "**".
                //
                // It's better to use .match().  This function shouldn't
                // be used, really, but it's pretty convenient sometimes,
                // when you just want to work with a regex.
                var set = this.set

                if (!set.length) {
                    this.regexp = false
                    return this.regexp
                }
                var options = this.options

                var twoStar = options.noglobstar ? star
                    : options.dot ? twoStarDot
                        : twoStarNoDot
                var flags = options.nocase ? 'i' : ''

                var re = set.map(function (pattern) {
                    return pattern.map(function (p) {
                        return (p === GLOBSTAR) ? twoStar
                            : (typeof p === 'string') ? regExpEscape(p)
                                : p._src
                    }).join('\\\/')
                }).join('|')

                // must match entire pattern
                // ending in a * or ** will make it less strict.
                re = '^(?:' + re + ')$'

                // can match anything, as long as it's not this.
                if (this.negate) re = '^(?!' + re + ').*$'

                try {
                    this.regexp = new RegExp(re, flags)
                } catch (ex) {
                    this.regexp = false
                }
                return this.regexp
            }

            minimatch.match = function (list, pattern, options) {
                options = options || {}
                var mm = new Minimatch(pattern, options)
                list = list.filter(function (f) {
                    return mm.match(f)
                })
                if (mm.options.nonull && !list.length) {
                    list.push(pattern)
                }
                return list
            }

            Minimatch.prototype.match = match
            function match(f, partial) {
                this.debug('match', f, this.pattern)
                // short-circuit in the case of busted things.
                // comments, etc.
                if (this.comment) return false
                if (this.empty) return f === ''

                if (f === '/' && partial) return true

                var options = this.options

                // windows: need to use /, not \
                if (path.sep !== '/') {
                    f = f.split(path.sep).join('/')
                }

                // treat the test path as a set of pathparts.
                f = f.split(slashSplit)
                this.debug(this.pattern, 'split', f)

                // just ONE of the pattern sets in this.set needs to match
                // in order for it to be valid.  If negating, then just one
                // match means that we have failed.
                // Either way, return on the first hit.

                var set = this.set
                this.debug(this.pattern, 'set', set)

                // Find the basename of the path by looking for the last non-empty segment
                var filename
                var i
                for (i = f.length - 1; i >= 0; i--) {
                    filename = f[i]
                    if (filename) break
                }

                for (i = 0; i < set.length; i++) {
                    var pattern = set[i]
                    var file = f
                    if (options.matchBase && pattern.length === 1) {
                        file = [filename]
                    }
                    var hit = this.matchOne(file, pattern, partial)
                    if (hit) {
                        if (options.flipNegate) return true
                        return !this.negate
                    }
                }

                // didn't get any hits.  this is success if it's a negative
                // pattern, failure otherwise.
                if (options.flipNegate) return false
                return this.negate
            }

            // set partial to true to test if, for example,
            // "/a/b" matches the start of "/*/b/*/d"
            // Partial means, if you run out of file before you run
            // out of pattern, then that's fine, as long as all
            // the parts match.
            Minimatch.prototype.matchOne = function (file, pattern, partial) {
                var options = this.options

                this.debug('matchOne',
                    { 'this': this, file: file, pattern: pattern })

                this.debug('matchOne', file.length, pattern.length)

                for (var fi = 0,
                    pi = 0,
                    fl = file.length,
                    pl = pattern.length
                    ; (fi < fl) && (pi < pl)
                    ; fi++ , pi++) {
                    this.debug('matchOne loop')
                    var p = pattern[pi]
                    var f = file[fi]

                    this.debug(pattern, p, f)

                    // should be impossible.
                    // some invalid regexp stuff in the set.
                    if (p === false) return false

                    if (p === GLOBSTAR) {
                        this.debug('GLOBSTAR', [pattern, p, f])

                        // "**"
                        // a/**/b/**/c would match the following:
                        // a/b/x/y/z/c
                        // a/x/y/z/b/c
                        // a/b/x/b/x/c
                        // a/b/c
                        // To do this, take the rest of the pattern after
                        // the **, and see if it would match the file remainder.
                        // If so, return success.
                        // If not, the ** "swallows" a segment, and try again.
                        // This is recursively awful.
                        //
                        // a/**/b/**/c matching a/b/x/y/z/c
                        // - a matches a
                        // - doublestar
                        //   - matchOne(b/x/y/z/c, b/**/c)
                        //     - b matches b
                        //     - doublestar
                        //       - matchOne(x/y/z/c, c) -> no
                        //       - matchOne(y/z/c, c) -> no
                        //       - matchOne(z/c, c) -> no
                        //       - matchOne(c, c) yes, hit
                        var fr = fi
                        var pr = pi + 1
                        if (pr === pl) {
                            this.debug('** at the end')
                            // a ** at the end will just swallow the rest.
                            // We have found a match.
                            // however, it will not swallow /.x, unless
                            // options.dot is set.
                            // . and .. are *never* matched by **, for explosively
                            // exponential reasons.
                            for (; fi < fl; fi++) {
                                if (file[fi] === '.' || file[fi] === '..' ||
                                    (!options.dot && file[fi].charAt(0) === '.')) return false
                            }
                            return true
                        }

                        // ok, let's see if we can swallow whatever we can.
                        while (fr < fl) {
                            var swallowee = file[fr]

                            this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

                            // XXX remove this slice.  Just pass the start index.
                            if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
                                this.debug('globstar found match!', fr, fl, swallowee)
                                // found a match.
                                return true
                            } else {
                                // can't swallow "." or ".." ever.
                                // can only swallow ".foo" when explicitly asked.
                                if (swallowee === '.' || swallowee === '..' ||
                                    (!options.dot && swallowee.charAt(0) === '.')) {
                                    this.debug('dot detected!', file, fr, pattern, pr)
                                    break
                                }

                                // ** swallows a segment, and continue.
                                this.debug('globstar swallow a segment, and continue')
                                fr++
                            }
                        }

                        // no match was found.
                        // However, in partial mode, we can't say this is necessarily over.
                        // If there's more *pattern* left, then
                        if (partial) {
                            // ran out of file
                            this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
                            if (fr === fl) return true
                        }
                        return false
                    }

                    // something other than **
                    // non-magic patterns just have to match exactly
                    // patterns with magic have been turned into regexps.
                    var hit
                    if (typeof p === 'string') {
                        if (options.nocase) {
                            hit = f.toLowerCase() === p.toLowerCase()
                        } else {
                            hit = f === p
                        }
                        this.debug('string match', p, f, hit)
                    } else {
                        hit = f.match(p)
                        this.debug('pattern match', p, f, hit)
                    }

                    if (!hit) return false
                }

                // Note: ending in / means that we'll get a final ""
                // at the end of the pattern.  This can only match a
                // corresponding "" at the end of the file.
                // If the file ends in /, then it can only match a
                // a pattern that ends in /, unless the pattern just
                // doesn't have any more for it. But, a/b/ should *not*
                // match "a/b/*", even though "" matches against the
                // [^/]*? pattern, except in partial mode, where it might
                // simply not be reached yet.
                // However, a/b/ should still satisfy a/*

                // now either we fell off the end of the pattern, or we're done.
                if (fi === fl && pi === pl) {
                    // ran out of pattern and filename at the same time.
                    // an exact hit!
                    return true
                } else if (fi === fl) {
                    // ran out of file, but still had pattern left.
                    // this is ok if we're doing the match as part of
                    // a glob fs traversal.
                    return partial
                } else if (pi === pl) {
                    // ran out of pattern, still have file left.
                    // this is only acceptable if we're on the very last
                    // empty segment of a file with a trailing slash.
                    // a/* should match a/b/
                    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
                    return emptyFileEnd
                }

                // should be unreachable.
                throw new Error('wtf?')
            }

            // replace stuff like \* with *
            function globUnescape(s) {
                return s.replace(/\\(.)/g, '$1')
            }

            function regExpEscape(s) {
                return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
            }

        }, { "7": 7, "74": 74 }], 233: [function (_dereq_, module, exports) {
            /**
             * Helpers.
             */

            var s = 1000;
            var m = s * 60;
            var h = m * 60;
            var d = h * 24;
            var y = d * 365.25;

            /**
             * Parse or format the given `val`.
             *
             * Options:
             *
             *  - `long` verbose formatting [false]
             *
             * @param {String|Number} val
             * @param {Object} options
             * @return {String|Number}
             * @api public
             */

            module.exports = function (val, options) {
                options = options || {};
                if ('string' == typeof val) return parse(val);
                return options.long
                    ? long(val)
                    : short(val);
            };

            /**
             * Parse the given `str` and return milliseconds.
             *
             * @param {String} str
             * @return {Number}
             * @api private
             */

            function parse(str) {
                str = '' + str;
                if (str.length > 10000) return;
                var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
                if (!match) return;
                var n = parseFloat(match[1]);
                var type = (match[2] || 'ms').toLowerCase();
                switch (type) {
                    case 'years':
                    case 'year':
                    case 'yrs':
                    case 'yr':
                    case 'y':
                        return n * y;
                    case 'days':
                    case 'day':
                    case 'd':
                        return n * d;
                    case 'hours':
                    case 'hour':
                    case 'hrs':
                    case 'hr':
                    case 'h':
                        return n * h;
                    case 'minutes':
                    case 'minute':
                    case 'mins':
                    case 'min':
                    case 'm':
                        return n * m;
                    case 'seconds':
                    case 'second':
                    case 'secs':
                    case 'sec':
                    case 's':
                        return n * s;
                    case 'milliseconds':
                    case 'millisecond':
                    case 'msecs':
                    case 'msec':
                    case 'ms':
                        return n;
                }
            }

            /**
             * Short format for `ms`.
             *
             * @param {Number} ms
             * @return {String}
             * @api private
             */

            function short(ms) {
                if (ms >= d) return Math.round(ms / d) + 'd';
                if (ms >= h) return Math.round(ms / h) + 'h';
                if (ms >= m) return Math.round(ms / m) + 'm';
                if (ms >= s) return Math.round(ms / s) + 's';
                return ms + 'ms';
            }

            /**
             * Long format for `ms`.
             *
             * @param {Number} ms
             * @return {String}
             * @api private
             */

            function long(ms) {
                return plural(ms, d, 'day')
                    || plural(ms, h, 'hour')
                    || plural(ms, m, 'minute')
                    || plural(ms, s, 'second')
                    || ms + ' ms';
            }

            /**
             * Pluralization helper.
             */

            function plural(ms, n, name) {
                if (ms < n) return;
                if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
                return Math.ceil(ms / n) + ' ' + name + 's';
            }

        }, {}], 234: [function (_dereq_, module, exports) {
            'use strict';
            var fs = _dereq_(2)

            module.exports = function (pth, cb) {
                var fn = typeof fs.access === 'function' ? fs.access : fs.stat;

                fn(pth, function (err) {
                    cb(null, !err);
                });
            };

            module.exports.sync = function (pth) {
                var fn = typeof fs.accessSync === 'function' ? fs.accessSync : fs.statSync;

                try {
                    fn(pth);
                    return true;
                } catch (err) {
                    return false;
                }
            };

        }, { "2": 2 }], 235: [function (_dereq_, module, exports) {
            (function (process) {
                'use strict';

                function posix(path) {
                    return path.charAt(0) === '/';
                };

                function win32(path) {
                    // https://github.com/joyent/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
                    var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
                    var result = splitDeviceRe.exec(path);
                    var device = result[1] || '';
                    var isUnc = !!device && device.charAt(1) !== ':';

                    // UNC paths are always absolute
                    return !!result[2] || isUnc;
                };

                module.exports = process.platform === 'win32' ? win32 : posix;
                module.exports.posix = posix;
                module.exports.win32 = win32;

            }).call(this, _dereq_(8))
        }, { "8": 8 }], 236: [function (_dereq_, module, exports) {
            'use strict';
            module.exports = /^#!.*/;

        }, {}], 237: [function (_dereq_, module, exports) {
            'use strict';
            module.exports = function (str) {
                var isExtendedLengthPath = /^\\\\\?\\/.test(str);
                var hasNonAscii = /[^\x00-\x80]+/.test(str);

                if (isExtendedLengthPath || hasNonAscii) {
                    return str;
                }

                return str.replace(/\\/g, '/');
            };

        }, {}], 238: [function (_dereq_, module, exports) {
            /* -*- Mode: js; js-indent-level: 2; -*- */
            /*
             * Copyright 2011 Mozilla Foundation and contributors
             * Licensed under the New BSD license. See LICENSE or:
             * http://opensource.org/licenses/BSD-3-Clause
             */
            {
                var util = _dereq_(247);

                /**
                 * A data structure which is a combination of an array and a set. Adding a new
                 * member is O(1), testing for membership is O(1), and finding the index of an
                 * element is O(1). Removing elements from the set is not supported. Only
                 * strings are supported for membership.
                 */
                function ArraySet() {
                    this._array = [];
                    this._set = {};
                }

                /**
                 * Static method for creating ArraySet instances from an existing array.
                 */
                ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
                    var set = new ArraySet();
                    for (var i = 0, len = aArray.length; i < len; i++) {
                        set.add(aArray[i], aAllowDuplicates);
                    }
                    return set;
                };

                /**
                 * Return how many unique items are in this ArraySet. If duplicates have been
                 * added, than those do not count towards the size.
                 *
                 * @returns Number
                 */
                ArraySet.prototype.size = function ArraySet_size() {
                    return Object.getOwnPropertyNames(this._set).length;
                };

                /**
                 * Add the given string to this set.
                 *
                 * @param String aStr
                 */
                ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
                    var sStr = util.toSetString(aStr);
                    var isDuplicate = this._set.hasOwnProperty(sStr);
                    var idx = this._array.length;
                    if (!isDuplicate || aAllowDuplicates) {
                        this._array.push(aStr);
                    }
                    if (!isDuplicate) {
                        this._set[sStr] = idx;
                    }
                };

                /**
                 * Is the given string a member of this set?
                 *
                 * @param String aStr
                 */
                ArraySet.prototype.has = function ArraySet_has(aStr) {
                    var sStr = util.toSetString(aStr);
                    return this._set.hasOwnProperty(sStr);
                };

                /**
                 * What is the index of the given string in the array?
                 *
                 * @param String aStr
                 */
                ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
                    var sStr = util.toSetString(aStr);
                    if (this._set.hasOwnProperty(sStr)) {
                        return this._set[sStr];
                    }
                    throw new Error('"' + aStr + '" is not in the set.');
                };

                /**
                 * What is the element at the given index?
                 *
                 * @param Number aIdx
                 */
                ArraySet.prototype.at = function ArraySet_at(aIdx) {
                    if (aIdx >= 0 && aIdx < this._array.length) {
                        return this._array[aIdx];
                    }
                    throw new Error('No element indexed by ' + aIdx);
                };

                /**
                 * Returns the array representation of this set (which has the proper indices
                 * indicated by indexOf). Note that this is a copy of the internal array used
                 * for storing the members so that no one can mess with internal state.
                 */
                ArraySet.prototype.toArray = function ArraySet_toArray() {
                    return this._array.slice();
                };

                exports.ArraySet = ArraySet;
            }

        }, { "247": 247 }], 239: [function (_dereq_, module, exports) {
            /* -*- Mode: js; js-indent-level: 2; -*- */
            /*
             * Copyright 2011 Mozilla Foundation and contributors
             * Licensed under the New BSD license. See LICENSE or:
             * http://opensource.org/licenses/BSD-3-Clause
             *
             * Based on the Base 64 VLQ implementation in Closure Compiler:
             * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
             *
             * Copyright 2011 The Closure Compiler Authors. All rights reserved.
             * Redistribution and use in source and binary forms, with or without
             * modification, are permitted provided that the following conditions are
             * met:
             *
             *  * Redistributions of source code must retain the above copyright
             *    notice, this list of conditions and the following disclaimer.
             *  * Redistributions in binary form must reproduce the above
             *    copyright notice, this list of conditions and the following
             *    disclaimer in the documentation and/or other materials provided
             *    with the distribution.
             *  * Neither the name of Google Inc. nor the names of its
             *    contributors may be used to endorse or promote products derived
             *    from this software without specific prior written permission.
             *
             * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
             * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
             * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
             * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
             * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
             * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
             * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
             * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
             * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
             * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
             * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
             */
            {
                var base64 = _dereq_(240);

                // A single base 64 digit can contain 6 bits of data. For the base 64 variable
                // length quantities we use in the source map spec, the first bit is the sign,
                // the next four bits are the actual value, and the 6th bit is the
                // continuation bit. The continuation bit tells us whether there are more
                // digits in this value following this digit.
                //
                //   Continuation
                //   |    Sign
                //   |    |
                //   V    V
                //   101011

                var VLQ_BASE_SHIFT = 5;

                // binary: 100000
                var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

                // binary: 011111
                var VLQ_BASE_MASK = VLQ_BASE - 1;

                // binary: 100000
                var VLQ_CONTINUATION_BIT = VLQ_BASE;

                /**
                 * Converts from a two-complement value to a value where the sign bit is
                 * placed in the least significant bit.  For example, as decimals:
                 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
                 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
                 */
                function toVLQSigned(aValue) {
                    return aValue < 0
                        ? ((-aValue) << 1) + 1
                        : (aValue << 1) + 0;
                }

                /**
                 * Converts to a two-complement value from a value where the sign bit is
                 * placed in the least significant bit.  For example, as decimals:
                 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
                 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
                 */
                function fromVLQSigned(aValue) {
                    var isNegative = (aValue & 1) === 1;
                    var shifted = aValue >> 1;
                    return isNegative
                        ? -shifted
                        : shifted;
                }

                /**
                 * Returns the base 64 VLQ encoded value.
                 */
                exports.encode = function base64VLQ_encode(aValue) {
                    var encoded = "";
                    var digit;

                    var vlq = toVLQSigned(aValue);

                    do {
                        digit = vlq & VLQ_BASE_MASK;
                        vlq >>>= VLQ_BASE_SHIFT;
                        if (vlq > 0) {
                            // There are still more digits in this value, so we must make sure the
                            // continuation bit is marked.
                            digit |= VLQ_CONTINUATION_BIT;
                        }
                        encoded += base64.encode(digit);
                    } while (vlq > 0);

                    return encoded;
                };

                /**
                 * Decodes the next base 64 VLQ value from the given string and returns the
                 * value and the rest of the string via the out parameter.
                 */
                exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
                    var strLen = aStr.length;
                    var result = 0;
                    var shift = 0;
                    var continuation, digit;

                    do {
                        if (aIndex >= strLen) {
                            throw new Error("Expected more digits in base 64 VLQ value.");
                        }

                        digit = base64.decode(aStr.charCodeAt(aIndex++));
                        if (digit === -1) {
                            throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
                        }

                        continuation = !!(digit & VLQ_CONTINUATION_BIT);
                        digit &= VLQ_BASE_MASK;
                        result = result + (digit << shift);
                        shift += VLQ_BASE_SHIFT;
                    } while (continuation);

                    aOutParam.value = fromVLQSigned(result);
                    aOutParam.rest = aIndex;
                };
            }

        }, { "240": 240 }], 240: [function (_dereq_, module, exports) {
            /* -*- Mode: js; js-indent-level: 2; -*- */
            /*
             * Copyright 2011 Mozilla Foundation and contributors
             * Licensed under the New BSD license. See LICENSE or:
             * http://opensource.org/licenses/BSD-3-Clause
             */
            {
                var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

                /**
                 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
                 */
                exports.encode = function (number) {
                    if (0 <= number && number < intToCharMap.length) {
                        return intToCharMap[number];
                    }
                    throw new TypeError("Must be between 0 and 63: " + number);
                };

                /**
                 * Decode a single base 64 character code digit to an integer. Returns -1 on
                 * failure.
                 */
                exports.decode = function (charCode) {
                    var bigA = 65;     // 'A'
                    var bigZ = 90;     // 'Z'

                    var littleA = 97;  // 'a'
                    var littleZ = 122; // 'z'

                    var zero = 48;     // '0'
                    var nine = 57;     // '9'

                    var plus = 43;     // '+'
                    var slash = 47;    // '/'

                    var littleOffset = 26;
                    var numberOffset = 52;

                    // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
                    if (bigA <= charCode && charCode <= bigZ) {
                        return (charCode - bigA);
                    }

                    // 26 - 51: abcdefghijklmnopqrstuvwxyz
                    if (littleA <= charCode && charCode <= littleZ) {
                        return (charCode - littleA + littleOffset);
                    }

                    // 52 - 61: 0123456789
                    if (zero <= charCode && charCode <= nine) {
                        return (charCode - zero + numberOffset);
                    }

                    // 62: +
                    if (charCode == plus) {
                        return 62;
                    }

                    // 63: /
                    if (charCode == slash) {
                        return 63;
                    }

                    // Invalid base64 digit.
                    return -1;
                };
            }

        }, {}], 241: [function (_dereq_, module, exports) {
            /* -*- Mode: js; js-indent-level: 2; -*- */
            /*
             * Copyright 2011 Mozilla Foundation and contributors
             * Licensed under the New BSD license. See LICENSE or:
             * http://opensource.org/licenses/BSD-3-Clause
             */
            {
                exports.GREATEST_LOWER_BOUND = 1;
                exports.LEAST_UPPER_BOUND = 2;

                /**
                 * Recursive implementation of binary search.
                 *
                 * @param aLow Indices here and lower do not contain the needle.
                 * @param aHigh Indices here and higher do not contain the needle.
                 * @param aNeedle The element being searched for.
                 * @param aHaystack The non-empty array being searched.
                 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
                 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
                 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
                 *     closest element that is smaller than or greater than the one we are
                 *     searching for, respectively, if the exact element cannot be found.
                 */
                function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
                    // This function terminates when one of the following is true:
                    //
                    //   1. We find the exact element we are looking for.
                    //
                    //   2. We did not find the exact element, but we can return the index of
                    //      the next-closest element.
                    //
                    //   3. We did not find the exact element, and there is no next-closest
                    //      element than the one we are searching for, so we return -1.
                    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
                    var cmp = aCompare(aNeedle, aHaystack[mid], true);
                    if (cmp === 0) {
                        // Found the element we are looking for.
                        return mid;
                    }
                    else if (cmp > 0) {
                        // Our needle is greater than aHaystack[mid].
                        if (aHigh - mid > 1) {
                            // The element is in the upper half.
                            return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
                        }

                        // The exact needle element was not found in this haystack. Determine if
                        // we are in termination case (3) or (2) and return the appropriate thing.
                        if (aBias == exports.LEAST_UPPER_BOUND) {
                            return aHigh < aHaystack.length ? aHigh : -1;
                        } else {
                            return mid;
                        }
                    }
                    else {
                        // Our needle is less than aHaystack[mid].
                        if (mid - aLow > 1) {
                            // The element is in the lower half.
                            return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
                        }

                        // we are in termination case (3) or (2) and return the appropriate thing.
                        if (aBias == exports.LEAST_UPPER_BOUND) {
                            return mid;
                        } else {
                            return aLow < 0 ? -1 : aLow;
                        }
                    }
                }

                /**
                 * This is an implementation of binary search which will always try and return
                 * the index of the closest element if there is no exact hit. This is because
                 * mappings between original and generated line/col pairs are single points,
                 * and there is an implicit region between each of them, so a miss just means
                 * that you aren't on the very start of a region.
                 *
                 * @param aNeedle The element you are looking for.
                 * @param aHaystack The array that is being searched.
                 * @param aCompare A function which takes the needle and an element in the
                 *     array and returns -1, 0, or 1 depending on whether the needle is less
                 *     than, equal to, or greater than the element, respectively.
                 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
                 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
                 *     closest element that is smaller than or greater than the one we are
                 *     searching for, respectively, if the exact element cannot be found.
                 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
                 */
                exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
                    if (aHaystack.length === 0) {
                        return -1;
                    }

                    var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                        aCompare, aBias || exports.GREATEST_LOWER_BOUND);
                    if (index < 0) {
                        return -1;
                    }

                    // We have found either the exact element, or the next-closest element than
                    // the one we are searching for. However, there may be more than one such
                    // element. Make sure we always return the smallest of these.
                    while (index - 1 >= 0) {
                        if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
                            break;
                        }
                        --index;
                    }

                    return index;
                };
            }

        }, {}], 242: [function (_dereq_, module, exports) {
            /* -*- Mode: js; js-indent-level: 2; -*- */
            /*
             * Copyright 2014 Mozilla Foundation and contributors
             * Licensed under the New BSD license. See LICENSE or:
             * http://opensource.org/licenses/BSD-3-Clause
             */
            {
                var util = _dereq_(247);

                /**
                 * Determine whether mappingB is after mappingA with respect to generated
                 * position.
                 */
                function generatedPositionAfter(mappingA, mappingB) {
                    // Optimized for most common case
                    var lineA = mappingA.generatedLine;
                    var lineB = mappingB.generatedLine;
                    var columnA = mappingA.generatedColumn;
                    var columnB = mappingB.generatedColumn;
                    return lineB > lineA || lineB == lineA && columnB >= columnA ||
                        util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
                }

                /**
                 * A data structure to provide a sorted view of accumulated mappings in a
                 * performance conscious manner. It trades a neglibable overhead in general
                 * case for a large speedup in case of mappings being added in order.
                 */
                function MappingList() {
                    this._array = [];
                    this._sorted = true;
                    // Serves as infimum
                    this._last = { generatedLine: -1, generatedColumn: 0 };
                }

                /**
                 * Iterate through internal items. This method takes the same arguments that
                 * `Array.prototype.forEach` takes.
                 *
                 * NOTE: The order of the mappings is NOT guaranteed.
                 */
                MappingList.prototype.unsortedForEach =
                    function MappingList_forEach(aCallback, aThisArg) {
                        this._array.forEach(aCallback, aThisArg);
                    };

                /**
                 * Add the given source mapping.
                 *
                 * @param Object aMapping
                 */
                MappingList.prototype.add = function MappingList_add(aMapping) {
                    if (generatedPositionAfter(this._last, aMapping)) {
                        this._last = aMapping;
                        this._array.push(aMapping);
                    } else {
                        this._sorted = false;
                        this._array.push(aMapping);
                    }
                };

                /**
                 * Returns the flat, sorted array of mappings. The mappings are sorted by
                 * generated position.
                 *
                 * WARNING: This method returns internal data without copying, for
                 * performance. The return value must NOT be mutated, and should be treated as
                 * an immutable borrow. If you want to take ownership, you must make your own
                 * copy.
                 */
                MappingList.prototype.toArray = function MappingList_toArray() {
                    if (!this._sorted) {
                        this._array.sort(util.compareByGeneratedPositionsInflated);
                        this._sorted = true;
                    }
                    return this._array;
                };

                exports.MappingList = MappingList;
            }

        }, { "247": 247 }], 243: [function (_dereq_, module, exports) {
            /* -*- Mode: js; js-indent-level: 2; -*- */
            /*
             * Copyright 2011 Mozilla Foundation and contributors
             * Licensed under the New BSD license. See LICENSE or:
             * http://opensource.org/licenses/BSD-3-Clause
             */
            {
                // It turns out that some (most?) JavaScript engines don't self-host
                // `Array.prototype.sort`. This makes sense because C++ will likely remain
                // faster than JS when doing raw CPU-intensive sorting. However, when using a
                // custom comparator function, calling back and forth between the VM's C++ and
                // JIT'd JS is rather slow *and* loses JIT type information, resulting in
                // worse generated code for the comparator function than would be optimal. In
                // fact, when sorting with a comparator, these costs outweigh the benefits of
                // sorting in C++. By using our own JS-implemented Quick Sort (below), we get
                // a ~3500ms mean speed-up in `bench/bench.html`.

                /**
                 * Swap the elements indexed by `x` and `y` in the array `ary`.
                 *
                 * @param {Array} ary
                 *        The array.
                 * @param {Number} x
                 *        The index of the first item.
                 * @param {Number} y
                 *        The index of the second item.
                 */
                function swap(ary, x, y) {
                    var temp = ary[x];
                    ary[x] = ary[y];
                    ary[y] = temp;
                }

                /**
                 * Returns a random integer within the range `low .. high` inclusive.
                 *
                 * @param {Number} low
                 *        The lower bound on the range.
                 * @param {Number} high
                 *        The upper bound on the range.
                 */
                function randomIntInRange(low, high) {
                    return Math.round(low + (Math.random() * (high - low)));
                }

                /**
                 * The Quick Sort algorithm.
                 *
                 * @param {Array} ary
                 *        An array to sort.
                 * @param {function} comparator
                 *        Function to use to compare two items.
                 * @param {Number} p
                 *        Start index of the array
                 * @param {Number} r
                 *        End index of the array
                 */
                function doQuickSort(ary, comparator, p, r) {
                    // If our lower bound is less than our upper bound, we (1) partition the
                    // array into two pieces and (2) recurse on each half. If it is not, this is
                    // the empty array and our base case.

                    if (p < r) {
                        // (1) Partitioning.
                        //
                        // The partitioning chooses a pivot between `p` and `r` and moves all
                        // elements that are less than or equal to the pivot to the before it, and
                        // all the elements that are greater than it after it. The effect is that
                        // once partition is done, the pivot is in the exact place it will be when
                        // the array is put in sorted order, and it will not need to be moved
                        // again. This runs in O(n) time.

                        // Always choose a random pivot so that an input array which is reverse
                        // sorted does not cause O(n^2) running time.
                        var pivotIndex = randomIntInRange(p, r);
                        var i = p - 1;

                        swap(ary, pivotIndex, r);
                        var pivot = ary[r];

                        // Immediately after `j` is incremented in this loop, the following hold
                        // true:
                        //
                        //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
                        //
                        //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
                        for (var j = p; j < r; j++) {
                            if (comparator(ary[j], pivot) <= 0) {
                                i += 1;
                                swap(ary, i, j);
                            }
                        }

                        swap(ary, i + 1, j);
                        var q = i + 1;

                        // (2) Recurse on each half.

                        doQuickSort(ary, comparator, p, q - 1);
                        doQuickSort(ary, comparator, q + 1, r);
                    }
                }

                /**
                 * Sort the given array in-place with the given comparator function.
                 *
                 * @param {Array} ary
                 *        An array to sort.
                 * @param {function} comparator
                 *        Function to use to compare two items.
                 */
                exports.quickSort = function (ary, comparator) {
                    doQuickSort(ary, comparator, 0, ary.length - 1);
                };
            }

        }, {}], 244: [function (_dereq_, module, exports) {
            /* -*- Mode: js; js-indent-level: 2; -*- */
            /*
             * Copyright 2011 Mozilla Foundation and contributors
             * Licensed under the New BSD license. See LICENSE or:
             * http://opensource.org/licenses/BSD-3-Clause
             */
            {
                var util = _dereq_(247);
                var binarySearch = _dereq_(241);
                var ArraySet = _dereq_(238).ArraySet;
                var base64VLQ = _dereq_(239);
                var quickSort = _dereq_(243).quickSort;

                function SourceMapConsumer(aSourceMap) {
                    var sourceMap = aSourceMap;
                    if (typeof aSourceMap === 'string') {
                        sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
                    }

                    return sourceMap.sections != null
                        ? new IndexedSourceMapConsumer(sourceMap)
                        : new BasicSourceMapConsumer(sourceMap);
                }

                SourceMapConsumer.fromSourceMap = function (aSourceMap) {
                    return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
                }

                /**
                 * The version of the source mapping spec that we are consuming.
                 */
                SourceMapConsumer.prototype._version = 3;

                // `__generatedMappings` and `__originalMappings` are arrays that hold the
                // parsed mapping coordinates from the source map's "mappings" attribute. They
                // are lazily instantiated, accessed via the `_generatedMappings` and
                // `_originalMappings` getters respectively, and we only parse the mappings
                // and create these arrays once queried for a source location. We jump through
                // these hoops because there can be many thousands of mappings, and parsing
                // them is expensive, so we only want to do it if we must.
                //
                // Each object in the arrays is of the form:
                //
                //     {
                //       generatedLine: The line number in the generated code,
                //       generatedColumn: The column number in the generated code,
                //       source: The path to the original source file that generated this
                //               chunk of code,
                //       originalLine: The line number in the original source that
                //                     corresponds to this chunk of generated code,
                //       originalColumn: The column number in the original source that
                //                       corresponds to this chunk of generated code,
                //       name: The name of the original symbol which generated this chunk of
                //             code.
                //     }
                //
                // All properties except for `generatedLine` and `generatedColumn` can be
                // `null`.
                //
                // `_generatedMappings` is ordered by the generated positions.
                //
                // `_originalMappings` is ordered by the original positions.

                SourceMapConsumer.prototype.__generatedMappings = null;
                Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
                    get: function () {
                        if (!this.__generatedMappings) {
                            this._parseMappings(this._mappings, this.sourceRoot);
                        }

                        return this.__generatedMappings;
                    }
                });

                SourceMapConsumer.prototype.__originalMappings = null;
                Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
                    get: function () {
                        if (!this.__originalMappings) {
                            this._parseMappings(this._mappings, this.sourceRoot);
                        }

                        return this.__originalMappings;
                    }
                });

                SourceMapConsumer.prototype._charIsMappingSeparator =
                    function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
                        var c = aStr.charAt(index);
                        return c === ";" || c === ",";
                    };

                /**
                 * Parse the mappings in a string in to a data structure which we can easily
                 * query (the ordered arrays in the `this.__generatedMappings` and
                 * `this.__originalMappings` properties).
                 */
                SourceMapConsumer.prototype._parseMappings =
                    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
                        throw new Error("Subclasses must implement _parseMappings");
                    };

                SourceMapConsumer.GENERATED_ORDER = 1;
                SourceMapConsumer.ORIGINAL_ORDER = 2;

                SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
                SourceMapConsumer.LEAST_UPPER_BOUND = 2;

                /**
                 * Iterate over each mapping between an original source/line/column and a
                 * generated line/column in this source map.
                 *
                 * @param Function aCallback
                 *        The function that is called with each mapping.
                 * @param Object aContext
                 *        Optional. If specified, this object will be the value of `this` every
                 *        time that `aCallback` is called.
                 * @param aOrder
                 *        Either `SourceMapConsumer.GENERATED_ORDER` or
                 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
                 *        iterate over the mappings sorted by the generated file's line/column
                 *        order or the original's source/line/column order, respectively. Defaults to
                 *        `SourceMapConsumer.GENERATED_ORDER`.
                 */
                SourceMapConsumer.prototype.eachMapping =
                    function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
                        var context = aContext || null;
                        var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

                        var mappings;
                        switch (order) {
                            case SourceMapConsumer.GENERATED_ORDER:
                                mappings = this._generatedMappings;
                                break;
                            case SourceMapConsumer.ORIGINAL_ORDER:
                                mappings = this._originalMappings;
                                break;
                            default:
                                throw new Error("Unknown order of iteration.");
                        }

                        var sourceRoot = this.sourceRoot;
                        mappings.map(function (mapping) {
                            var source = mapping.source === null ? null : this._sources.at(mapping.source);
                            if (source != null && sourceRoot != null) {
                                source = util.join(sourceRoot, source);
                            }
                            return {
                                source: source,
                                generatedLine: mapping.generatedLine,
                                generatedColumn: mapping.generatedColumn,
                                originalLine: mapping.originalLine,
                                originalColumn: mapping.originalColumn,
                                name: mapping.name === null ? null : this._names.at(mapping.name)
                            };
                        }, this).forEach(aCallback, context);
                    };

                /**
                 * Returns all generated line and column information for the original source,
                 * line, and column provided. If no column is provided, returns all mappings
                 * corresponding to a either the line we are searching for or the next
                 * closest line that has any mappings. Otherwise, returns all mappings
                 * corresponding to the given line and either the column we are searching for
                 * or the next closest column that has any offsets.
                 *
                 * The only argument is an object with the following properties:
                 *
                 *   - source: The filename of the original source.
                 *   - line: The line number in the original source.
                 *   - column: Optional. the column number in the original source.
                 *
                 * and an array of objects is returned, each with the following properties:
                 *
                 *   - line: The line number in the generated source, or null.
                 *   - column: The column number in the generated source, or null.
                 */
                SourceMapConsumer.prototype.allGeneratedPositionsFor =
                    function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
                        var line = util.getArg(aArgs, 'line');

                        // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
                        // returns the index of the closest mapping less than the needle. By
                        // setting needle.originalColumn to 0, we thus find the last mapping for
                        // the given line, provided such a mapping exists.
                        var needle = {
                            source: util.getArg(aArgs, 'source'),
                            originalLine: line,
                            originalColumn: util.getArg(aArgs, 'column', 0)
                        };

                        if (this.sourceRoot != null) {
                            needle.source = util.relative(this.sourceRoot, needle.source);
                        }
                        if (!this._sources.has(needle.source)) {
                            return [];
                        }
                        needle.source = this._sources.indexOf(needle.source);

                        var mappings = [];

                        var index = this._findMapping(needle,
                            this._originalMappings,
                            "originalLine",
                            "originalColumn",
                            util.compareByOriginalPositions,
                            binarySearch.LEAST_UPPER_BOUND);
                        if (index >= 0) {
                            var mapping = this._originalMappings[index];

                            if (aArgs.column === undefined) {
                                var originalLine = mapping.originalLine;

                                // Iterate until either we run out of mappings, or we run into
                                // a mapping for a different line than the one we found. Since
                                // mappings are sorted, this is guaranteed to find all mappings for
                                // the line we found.
                                while (mapping && mapping.originalLine === originalLine) {
                                    mappings.push({
                                        line: util.getArg(mapping, 'generatedLine', null),
                                        column: util.getArg(mapping, 'generatedColumn', null),
                                        lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
                                    });

                                    mapping = this._originalMappings[++index];
                                }
                            } else {
                                var originalColumn = mapping.originalColumn;

                                // Iterate until either we run out of mappings, or we run into
                                // a mapping for a different line than the one we were searching for.
                                // Since mappings are sorted, this is guaranteed to find all mappings for
                                // the line we are searching for.
                                while (mapping &&
                                    mapping.originalLine === line &&
                                    mapping.originalColumn == originalColumn) {
                                    mappings.push({
                                        line: util.getArg(mapping, 'generatedLine', null),
                                        column: util.getArg(mapping, 'generatedColumn', null),
                                        lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
                                    });

                                    mapping = this._originalMappings[++index];
                                }
                            }
                        }

                        return mappings;
                    };

                exports.SourceMapConsumer = SourceMapConsumer;

                /**
                 * A BasicSourceMapConsumer instance represents a parsed source map which we can
                 * query for information about the original file positions by giving it a file
                 * position in the generated source.
                 *
                 * The only parameter is the raw source map (either as a JSON string, or
                 * already parsed to an object). According to the spec, source maps have the
                 * following attributes:
                 *
                 *   - version: Which version of the source map spec this map is following.
                 *   - sources: An array of URLs to the original source files.
                 *   - names: An array of identifiers which can be referrenced by individual mappings.
                 *   - sourceRoot: Optional. The URL root from which all sources are relative.
                 *   - sourcesContent: Optional. An array of contents of the original source files.
                 *   - mappings: A string of base64 VLQs which contain the actual mappings.
                 *   - file: Optional. The generated file this source map is associated with.
                 *
                 * Here is an example source map, taken from the source map spec[0]:
                 *
                 *     {
                 *       version : 3,
                 *       file: "out.js",
                 *       sourceRoot : "",
                 *       sources: ["foo.js", "bar.js"],
                 *       names: ["src", "maps", "are", "fun"],
                 *       mappings: "AA,AB;;ABCDE;"
                 *     }
                 *
                 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
                 */
                function BasicSourceMapConsumer(aSourceMap) {
                    var sourceMap = aSourceMap;
                    if (typeof aSourceMap === 'string') {
                        sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
                    }

                    var version = util.getArg(sourceMap, 'version');
                    var sources = util.getArg(sourceMap, 'sources');
                    // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
                    // requires the array) to play nice here.
                    var names = util.getArg(sourceMap, 'names', []);
                    var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
                    var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
                    var mappings = util.getArg(sourceMap, 'mappings');
                    var file = util.getArg(sourceMap, 'file', null);

                    // Once again, Sass deviates from the spec and supplies the version as a
                    // string rather than a number, so we use loose equality checking here.
                    if (version != this._version) {
                        throw new Error('Unsupported version: ' + version);
                    }

                    sources = sources
                        // Some source maps produce relative source paths like "./foo.js" instead of
                        // "foo.js".  Normalize these first so that future comparisons will succeed.
                        // See bugzil.la/1090768.
                        .map(util.normalize)
                        // Always ensure that absolute sources are internally stored relative to
                        // the source root, if the source root is absolute. Not doing this would
                        // be particularly problematic when the source root is a prefix of the
                        // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
                        .map(function (source) {
                            return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
                                ? util.relative(sourceRoot, source)
                                : source;
                        });

                    // Pass `true` below to allow duplicate names and sources. While source maps
                    // are intended to be compressed and deduplicated, the TypeScript compiler
                    // sometimes generates source maps with duplicates in them. See Github issue
                    // #72 and bugzil.la/889492.
                    this._names = ArraySet.fromArray(names, true);
                    this._sources = ArraySet.fromArray(sources, true);

                    this.sourceRoot = sourceRoot;
                    this.sourcesContent = sourcesContent;
                    this._mappings = mappings;
                    this.file = file;
                }

                BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
                BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

                /**
                 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
                 *
                 * @param SourceMapGenerator aSourceMap
                 *        The source map that will be consumed.
                 * @returns BasicSourceMapConsumer
                 */
                BasicSourceMapConsumer.fromSourceMap =
                    function SourceMapConsumer_fromSourceMap(aSourceMap) {
                        var smc = Object.create(BasicSourceMapConsumer.prototype);

                        var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
                        var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
                        smc.sourceRoot = aSourceMap._sourceRoot;
                        smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                            smc.sourceRoot);
                        smc.file = aSourceMap._file;

                        // Because we are modifying the entries (by converting string sources and
                        // names to indices into the sources and names ArraySets), we have to make
                        // a copy of the entry or else bad things happen. Shared mutable state
                        // strikes again! See github issue #191.

                        var generatedMappings = aSourceMap._mappings.toArray().slice();
                        var destGeneratedMappings = smc.__generatedMappings = [];
                        var destOriginalMappings = smc.__originalMappings = [];

                        for (var i = 0, length = generatedMappings.length; i < length; i++) {
                            var srcMapping = generatedMappings[i];
                            var destMapping = new Mapping;
                            destMapping.generatedLine = srcMapping.generatedLine;
                            destMapping.generatedColumn = srcMapping.generatedColumn;

                            if (srcMapping.source) {
                                destMapping.source = sources.indexOf(srcMapping.source);
                                destMapping.originalLine = srcMapping.originalLine;
                                destMapping.originalColumn = srcMapping.originalColumn;

                                if (srcMapping.name) {
                                    destMapping.name = names.indexOf(srcMapping.name);
                                }

                                destOriginalMappings.push(destMapping);
                            }

                            destGeneratedMappings.push(destMapping);
                        }

                        quickSort(smc.__originalMappings, util.compareByOriginalPositions);

                        return smc;
                    };

                /**
                 * The version of the source mapping spec that we are consuming.
                 */
                BasicSourceMapConsumer.prototype._version = 3;

                /**
                 * The list of original sources.
                 */
                Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
                    get: function () {
                        return this._sources.toArray().map(function (s) {
                            return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
                        }, this);
                    }
                });

                /**
                 * Provide the JIT with a nice shape / hidden class.
                 */
                function Mapping() {
                    this.generatedLine = 0;
                    this.generatedColumn = 0;
                    this.source = null;
                    this.originalLine = null;
                    this.originalColumn = null;
                    this.name = null;
                }

                /**
                 * Parse the mappings in a string in to a data structure which we can easily
                 * query (the ordered arrays in the `this.__generatedMappings` and
                 * `this.__originalMappings` properties).
                 */
                BasicSourceMapConsumer.prototype._parseMappings =
                    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
                        var generatedLine = 1;
                        var previousGeneratedColumn = 0;
                        var previousOriginalLine = 0;
                        var previousOriginalColumn = 0;
                        var previousSource = 0;
                        var previousName = 0;
                        var length = aStr.length;
                        var index = 0;
                        var cachedSegments = {};
                        var temp = {};
                        var originalMappings = [];
                        var generatedMappings = [];
                        var mapping, str, segment, end, value;

                        while (index < length) {
                            if (aStr.charAt(index) === ';') {
                                generatedLine++;
                                index++;
                                previousGeneratedColumn = 0;
                            }
                            else if (aStr.charAt(index) === ',') {
                                index++;
                            }
                            else {
                                mapping = new Mapping();
                                mapping.generatedLine = generatedLine;

                                // Because each offset is encoded relative to the previous one,
                                // many segments often have the same encoding. We can exploit this
                                // fact by caching the parsed variable length fields of each segment,
                                // allowing us to avoid a second parse if we encounter the same
                                // segment again.
                                for (end = index; end < length; end++) {
                                    if (this._charIsMappingSeparator(aStr, end)) {
                                        break;
                                    }
                                }
                                str = aStr.slice(index, end);

                                segment = cachedSegments[str];
                                if (segment) {
                                    index += str.length;
                                } else {
                                    segment = [];
                                    while (index < end) {
                                        base64VLQ.decode(aStr, index, temp);
                                        value = temp.value;
                                        index = temp.rest;
                                        segment.push(value);
                                    }

                                    if (segment.length === 2) {
                                        throw new Error('Found a source, but no line and column');
                                    }

                                    if (segment.length === 3) {
                                        throw new Error('Found a source and line, but no column');
                                    }

                                    cachedSegments[str] = segment;
                                }

                                // Generated column.
                                mapping.generatedColumn = previousGeneratedColumn + segment[0];
                                previousGeneratedColumn = mapping.generatedColumn;

                                if (segment.length > 1) {
                                    // Original source.
                                    mapping.source = previousSource + segment[1];
                                    previousSource += segment[1];

                                    // Original line.
                                    mapping.originalLine = previousOriginalLine + segment[2];
                                    previousOriginalLine = mapping.originalLine;
                                    // Lines are stored 0-based
                                    mapping.originalLine += 1;

                                    // Original column.
                                    mapping.originalColumn = previousOriginalColumn + segment[3];
                                    previousOriginalColumn = mapping.originalColumn;

                                    if (segment.length > 4) {
                                        // Original name.
                                        mapping.name = previousName + segment[4];
                                        previousName += segment[4];
                                    }
                                }

                                generatedMappings.push(mapping);
                                if (typeof mapping.originalLine === 'number') {
                                    originalMappings.push(mapping);
                                }
                            }
                        }

                        quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
                        this.__generatedMappings = generatedMappings;

                        quickSort(originalMappings, util.compareByOriginalPositions);
                        this.__originalMappings = originalMappings;
                    };

                /**
                 * Find the mapping that best matches the hypothetical "needle" mapping that
                 * we are searching for in the given "haystack" of mappings.
                 */
                BasicSourceMapConsumer.prototype._findMapping =
                    function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                        aColumnName, aComparator, aBias) {
                        // To return the position we are searching for, we must first find the
                        // mapping for the given position and then return the opposite position it
                        // points to. Because the mappings are sorted, we can use binary search to
                        // find the best mapping.

                        if (aNeedle[aLineName] <= 0) {
                            throw new TypeError('Line must be greater than or equal to 1, got '
                                + aNeedle[aLineName]);
                        }
                        if (aNeedle[aColumnName] < 0) {
                            throw new TypeError('Column must be greater than or equal to 0, got '
                                + aNeedle[aColumnName]);
                        }

                        return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
                    };

                /**
                 * Compute the last column for each generated mapping. The last column is
                 * inclusive.
                 */
                BasicSourceMapConsumer.prototype.computeColumnSpans =
                    function SourceMapConsumer_computeColumnSpans() {
                        for (var index = 0; index < this._generatedMappings.length; ++index) {
                            var mapping = this._generatedMappings[index];

                            // Mappings do not contain a field for the last generated columnt. We
                            // can come up with an optimistic estimate, however, by assuming that
                            // mappings are contiguous (i.e. given two consecutive mappings, the
                            // first mapping ends where the second one starts).
                            if (index + 1 < this._generatedMappings.length) {
                                var nextMapping = this._generatedMappings[index + 1];

                                if (mapping.generatedLine === nextMapping.generatedLine) {
                                    mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
                                    continue;
                                }
                            }

                            // The last mapping for each line spans the entire line.
                            mapping.lastGeneratedColumn = Infinity;
                        }
                    };

                /**
                 * Returns the original source, line, and column information for the generated
                 * source's line and column positions provided. The only argument is an object
                 * with the following properties:
                 *
                 *   - line: The line number in the generated source.
                 *   - column: The column number in the generated source.
                 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
                 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
                 *     closest element that is smaller than or greater than the one we are
                 *     searching for, respectively, if the exact element cannot be found.
                 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
                 *
                 * and an object is returned with the following properties:
                 *
                 *   - source: The original source file, or null.
                 *   - line: The line number in the original source, or null.
                 *   - column: The column number in the original source, or null.
                 *   - name: The original identifier, or null.
                 */
                BasicSourceMapConsumer.prototype.originalPositionFor =
                    function SourceMapConsumer_originalPositionFor(aArgs) {
                        var needle = {
                            generatedLine: util.getArg(aArgs, 'line'),
                            generatedColumn: util.getArg(aArgs, 'column')
                        };

                        var index = this._findMapping(
                            needle,
                            this._generatedMappings,
                            "generatedLine",
                            "generatedColumn",
                            util.compareByGeneratedPositionsDeflated,
                            util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
                        );

                        if (index >= 0) {
                            var mapping = this._generatedMappings[index];

                            if (mapping.generatedLine === needle.generatedLine) {
                                var source = util.getArg(mapping, 'source', null);
                                if (source !== null) {
                                    source = this._sources.at(source);
                                    if (this.sourceRoot != null) {
                                        source = util.join(this.sourceRoot, source);
                                    }
                                }
                                var name = util.getArg(mapping, 'name', null);
                                if (name !== null) {
                                    name = this._names.at(name);
                                }
                                return {
                                    source: source,
                                    line: util.getArg(mapping, 'originalLine', null),
                                    column: util.getArg(mapping, 'originalColumn', null),
                                    name: name
                                };
                            }
                        }

                        return {
                            source: null,
                            line: null,
                            column: null,
                            name: null
                        };
                    };

                /**
                 * Return true if we have the source content for every source in the source
                 * map, false otherwise.
                 */
                BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
                    function BasicSourceMapConsumer_hasContentsOfAllSources() {
                        if (!this.sourcesContent) {
                            return false;
                        }
                        return this.sourcesContent.length >= this._sources.size() &&
                            !this.sourcesContent.some(function (sc) { return sc == null; });
                    };

                /**
                 * Returns the original source content. The only argument is the url of the
                 * original source file. Returns null if no original source content is
                 * available.
                 */
                BasicSourceMapConsumer.prototype.sourceContentFor =
                    function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
                        if (!this.sourcesContent) {
                            return null;
                        }

                        if (this.sourceRoot != null) {
                            aSource = util.relative(this.sourceRoot, aSource);
                        }

                        if (this._sources.has(aSource)) {
                            return this.sourcesContent[this._sources.indexOf(aSource)];
                        }

                        var url;
                        if (this.sourceRoot != null
                            && (url = util.urlParse(this.sourceRoot))) {
                            // XXX: file:// URIs and absolute paths lead to unexpected behavior for
                            // many users. We can help them out when they expect file:// URIs to
                            // behave like it would if they were running a local HTTP server. See
                            // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
                            var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
                            if (url.scheme == "file"
                                && this._sources.has(fileUriAbsPath)) {
                                return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
                            }

                            if ((!url.path || url.path == "/")
                                && this._sources.has("/" + aSource)) {
                                return this.sourcesContent[this._sources.indexOf("/" + aSource)];
                            }
                        }

                        // This function is used recursively from
                        // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
                        // don't want to throw if we can't find the source - we just want to
                        // return null, so we provide a flag to exit gracefully.
                        if (nullOnMissing) {
                            return null;
                        }
                        else {
                            throw new Error('"' + aSource + '" is not in the SourceMap.');
                        }
                    };

                /**
                 * Returns the generated line and column information for the original source,
                 * line, and column positions provided. The only argument is an object with
                 * the following properties:
                 *
                 *   - source: The filename of the original source.
                 *   - line: The line number in the original source.
                 *   - column: The column number in the original source.
                 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
                 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
                 *     closest element that is smaller than or greater than the one we are
                 *     searching for, respectively, if the exact element cannot be found.
                 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
                 *
                 * and an object is returned with the following properties:
                 *
                 *   - line: The line number in the generated source, or null.
                 *   - column: The column number in the generated source, or null.
                 */
                BasicSourceMapConsumer.prototype.generatedPositionFor =
                    function SourceMapConsumer_generatedPositionFor(aArgs) {
                        var source = util.getArg(aArgs, 'source');
                        if (this.sourceRoot != null) {
                            source = util.relative(this.sourceRoot, source);
                        }
                        if (!this._sources.has(source)) {
                            return {
                                line: null,
                                column: null,
                                lastColumn: null
                            };
                        }
                        source = this._sources.indexOf(source);

                        var needle = {
                            source: source,
                            originalLine: util.getArg(aArgs, 'line'),
                            originalColumn: util.getArg(aArgs, 'column')
                        };

                        var index = this._findMapping(
                            needle,
                            this._originalMappings,
                            "originalLine",
                            "originalColumn",
                            util.compareByOriginalPositions,
                            util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
                        );

                        if (index >= 0) {
                            var mapping = this._originalMappings[index];

                            if (mapping.source === needle.source) {
                                return {
                                    line: util.getArg(mapping, 'generatedLine', null),
                                    column: util.getArg(mapping, 'generatedColumn', null),
                                    lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
                                };
                            }
                        }

                        return {
                            line: null,
                            column: null,
                            lastColumn: null
                        };
                    };

                exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

                /**
                 * An IndexedSourceMapConsumer instance represents a parsed source map which
                 * we can query for information. It differs from BasicSourceMapConsumer in
                 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
                 * input.
                 *
                 * The only parameter is a raw source map (either as a JSON string, or already
                 * parsed to an object). According to the spec for indexed source maps, they
                 * have the following attributes:
                 *
                 *   - version: Which version of the source map spec this map is following.
                 *   - file: Optional. The generated file this source map is associated with.
                 *   - sections: A list of section definitions.
                 *
                 * Each value under the "sections" field has two fields:
                 *   - offset: The offset into the original specified at which this section
                 *       begins to apply, defined as an object with a "line" and "column"
                 *       field.
                 *   - map: A source map definition. This source map could also be indexed,
                 *       but doesn't have to be.
                 *
                 * Instead of the "map" field, it's also possible to have a "url" field
                 * specifying a URL to retrieve a source map from, but that's currently
                 * unsupported.
                 *
                 * Here's an example source map, taken from the source map spec[0], but
                 * modified to omit a section which uses the "url" field.
                 *
                 *  {
                 *    version : 3,
                 *    file: "app.js",
                 *    sections: [{
                 *      offset: {line:100, column:10},
                 *      map: {
                 *        version : 3,
                 *        file: "section.js",
                 *        sources: ["foo.js", "bar.js"],
                 *        names: ["src", "maps", "are", "fun"],
                 *        mappings: "AAAA,E;;ABCDE;"
                 *      }
                 *    }],
                 *  }
                 *
                 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
                 */
                function IndexedSourceMapConsumer(aSourceMap) {
                    var sourceMap = aSourceMap;
                    if (typeof aSourceMap === 'string') {
                        sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
                    }

                    var version = util.getArg(sourceMap, 'version');
                    var sections = util.getArg(sourceMap, 'sections');

                    if (version != this._version) {
                        throw new Error('Unsupported version: ' + version);
                    }

                    this._sources = new ArraySet();
                    this._names = new ArraySet();

                    var lastOffset = {
                        line: -1,
                        column: 0
                    };
                    this._sections = sections.map(function (s) {
                        if (s.url) {
                            // The url field will require support for asynchronicity.
                            // See https://github.com/mozilla/source-map/issues/16
                            throw new Error('Support for url field in sections not implemented.');
                        }
                        var offset = util.getArg(s, 'offset');
                        var offsetLine = util.getArg(offset, 'line');
                        var offsetColumn = util.getArg(offset, 'column');

                        if (offsetLine < lastOffset.line ||
                            (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
                            throw new Error('Section offsets must be ordered and non-overlapping.');
                        }
                        lastOffset = offset;

                        return {
                            generatedOffset: {
                                // The offset fields are 0-based, but we use 1-based indices when
                                // encoding/decoding from VLQ.
                                generatedLine: offsetLine + 1,
                                generatedColumn: offsetColumn + 1
                            },
                            consumer: new SourceMapConsumer(util.getArg(s, 'map'))
                        }
                    });
                }

                IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
                IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

                /**
                 * The version of the source mapping spec that we are consuming.
                 */
                IndexedSourceMapConsumer.prototype._version = 3;

                /**
                 * The list of original sources.
                 */
                Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
                    get: function () {
                        var sources = [];
                        for (var i = 0; i < this._sections.length; i++) {
                            for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
                                sources.push(this._sections[i].consumer.sources[j]);
                            }
                        }
                        return sources;
                    }
                });

                /**
                 * Returns the original source, line, and column information for the generated
                 * source's line and column positions provided. The only argument is an object
                 * with the following properties:
                 *
                 *   - line: The line number in the generated source.
                 *   - column: The column number in the generated source.
                 *
                 * and an object is returned with the following properties:
                 *
                 *   - source: The original source file, or null.
                 *   - line: The line number in the original source, or null.
                 *   - column: The column number in the original source, or null.
                 *   - name: The original identifier, or null.
                 */
                IndexedSourceMapConsumer.prototype.originalPositionFor =
                    function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
                        var needle = {
                            generatedLine: util.getArg(aArgs, 'line'),
                            generatedColumn: util.getArg(aArgs, 'column')
                        };

                        // Find the section containing the generated position we're trying to map
                        // to an original position.
                        var sectionIndex = binarySearch.search(needle, this._sections,
                            function (needle, section) {
                                var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
                                if (cmp) {
                                    return cmp;
                                }

                                return (needle.generatedColumn -
                                    section.generatedOffset.generatedColumn);
                            });
                        var section = this._sections[sectionIndex];

                        if (!section) {
                            return {
                                source: null,
                                line: null,
                                column: null,
                                name: null
                            };
                        }

                        return section.consumer.originalPositionFor({
                            line: needle.generatedLine -
                                (section.generatedOffset.generatedLine - 1),
                            column: needle.generatedColumn -
                                (section.generatedOffset.generatedLine === needle.generatedLine
                                    ? section.generatedOffset.generatedColumn - 1
                                    : 0),
                            bias: aArgs.bias
                        });
                    };

                /**
                 * Return true if we have the source content for every source in the source
                 * map, false otherwise.
                 */
                IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
                    function IndexedSourceMapConsumer_hasContentsOfAllSources() {
                        return this._sections.every(function (s) {
                            return s.consumer.hasContentsOfAllSources();
                        });
                    };

                /**
                 * Returns the original source content. The only argument is the url of the
                 * original source file. Returns null if no original source content is
                 * available.
                 */
                IndexedSourceMapConsumer.prototype.sourceContentFor =
                    function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
                        for (var i = 0; i < this._sections.length; i++) {
                            var section = this._sections[i];

                            var content = section.consumer.sourceContentFor(aSource, true);
                            if (content) {
                                return content;
                            }
                        }
                        if (nullOnMissing) {
                            return null;
                        }
                        else {
                            throw new Error('"' + aSource + '" is not in the SourceMap.');
                        }
                    };

                /**
                 * Returns the generated line and column information for the original source,
                 * line, and column positions provided. The only argument is an object with
                 * the following properties:
                 *
                 *   - source: The filename of the original source.
                 *   - line: The line number in the original source.
                 *   - column: The column number in the original source.
                 *
                 * and an object is returned with the following properties:
                 *
                 *   - line: The line number in the generated source, or null.
                 *   - column: The column number in the generated source, or null.
                 */
                IndexedSourceMapConsumer.prototype.generatedPositionFor =
                    function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
                        for (var i = 0; i < this._sections.length; i++) {
                            var section = this._sections[i];

                            // Only consider this section if the requested source is in the list of
                            // sources of the consumer.
                            if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
                                continue;
                            }
                            var generatedPosition = section.consumer.generatedPositionFor(aArgs);
                            if (generatedPosition) {
                                var ret = {
                                    line: generatedPosition.line +
                                        (section.generatedOffset.generatedLine - 1),
                                    column: generatedPosition.column +
                                        (section.generatedOffset.generatedLine === generatedPosition.line
                                            ? section.generatedOffset.generatedColumn - 1
                                            : 0)
                                };
                                return ret;
                            }
                        }

                        return {
                            line: null,
                            column: null
                        };
                    };

                /**
                 * Parse the mappings in a string in to a data structure which we can easily
                 * query (the ordered arrays in the `this.__generatedMappings` and
                 * `this.__originalMappings` properties).
                 */
                IndexedSourceMapConsumer.prototype._parseMappings =
                    function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
                        this.__generatedMappings = [];
                        this.__originalMappings = [];
                        for (var i = 0; i < this._sections.length; i++) {
                            var section = this._sections[i];
                            var sectionMappings = section.consumer._generatedMappings;
                            for (var j = 0; j < sectionMappings.length; j++) {
                                var mapping = sectionMappings[j];

                                var source = section.consumer._sources.at(mapping.source);
                                if (section.consumer.sourceRoot !== null) {
                                    source = util.join(section.consumer.sourceRoot, source);
                                }
                                this._sources.add(source);
                                source = this._sources.indexOf(source);

                                var name = section.consumer._names.at(mapping.name);
                                this._names.add(name);
                                name = this._names.indexOf(name);

                                // The mappings coming from the consumer for the section have
                                // generated positions relative to the start of the section, so we
                                // need to offset them to be relative to the start of the concatenated
                                // generated file.
                                var adjustedMapping = {
                                    source: source,
                                    generatedLine: mapping.generatedLine +
                                        (section.generatedOffset.generatedLine - 1),
                                    generatedColumn: mapping.generatedColumn +
                                        (section.generatedOffset.generatedLine === mapping.generatedLine
                                            ? section.generatedOffset.generatedColumn - 1
                                            : 0),
                                    originalLine: mapping.originalLine,
                                    originalColumn: mapping.originalColumn,
                                    name: name
                                };

                                this.__generatedMappings.push(adjustedMapping);
                                if (typeof adjustedMapping.originalLine === 'number') {
                                    this.__originalMappings.push(adjustedMapping);
                                }
                            }
                        }

                        quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
                        quickSort(this.__originalMappings, util.compareByOriginalPositions);
                    };

                exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
            }

        }, { "238": 238, "239": 239, "241": 241, "243": 243, "247": 247 }], 245: [function (_dereq_, module, exports) {
            /* -*- Mode: js; js-indent-level: 2; -*- */
            /*
             * Copyright 2011 Mozilla Foundation and contributors
             * Licensed under the New BSD license. See LICENSE or:
             * http://opensource.org/licenses/BSD-3-Clause
             */
            {
                var base64VLQ = _dereq_(239);
                var util = _dereq_(247);
                var ArraySet = _dereq_(238).ArraySet;
                var MappingList = _dereq_(242).MappingList;

                /**
                 * An instance of the SourceMapGenerator represents a source map which is
                 * being built incrementally. You may pass an object with the following
                 * properties:
                 *
                 *   - file: The filename of the generated source.
                 *   - sourceRoot: A root for all relative URLs in this source map.
                 */
                function SourceMapGenerator(aArgs) {
                    if (!aArgs) {
                        aArgs = {};
                    }
                    this._file = util.getArg(aArgs, 'file', null);
                    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
                    this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
                    this._sources = new ArraySet();
                    this._names = new ArraySet();
                    this._mappings = new MappingList();
                    this._sourcesContents = null;
                }

                SourceMapGenerator.prototype._version = 3;

                /**
                 * Creates a new SourceMapGenerator based on a SourceMapConsumer
                 *
                 * @param aSourceMapConsumer The SourceMap.
                 */
                SourceMapGenerator.fromSourceMap =
                    function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
                        var sourceRoot = aSourceMapConsumer.sourceRoot;
                        var generator = new SourceMapGenerator({
                            file: aSourceMapConsumer.file,
                            sourceRoot: sourceRoot
                        });
                        aSourceMapConsumer.eachMapping(function (mapping) {
                            var newMapping = {
                                generated: {
                                    line: mapping.generatedLine,
                                    column: mapping.generatedColumn
                                }
                            };

                            if (mapping.source != null) {
                                newMapping.source = mapping.source;
                                if (sourceRoot != null) {
                                    newMapping.source = util.relative(sourceRoot, newMapping.source);
                                }

                                newMapping.original = {
                                    line: mapping.originalLine,
                                    column: mapping.originalColumn
                                };

                                if (mapping.name != null) {
                                    newMapping.name = mapping.name;
                                }
                            }

                            generator.addMapping(newMapping);
                        });
                        aSourceMapConsumer.sources.forEach(function (sourceFile) {
                            var content = aSourceMapConsumer.sourceContentFor(sourceFile);
                            if (content != null) {
                                generator.setSourceContent(sourceFile, content);
                            }
                        });
                        return generator;
                    };

                /**
                 * Add a single mapping from original source line and column to the generated
                 * source's line and column for this source map being created. The mapping
                 * object should have the following properties:
                 *
                 *   - generated: An object with the generated line and column positions.
                 *   - original: An object with the original line and column positions.
                 *   - source: The original source file (relative to the sourceRoot).
                 *   - name: An optional original token name for this mapping.
                 */
                SourceMapGenerator.prototype.addMapping =
                    function SourceMapGenerator_addMapping(aArgs) {
                        var generated = util.getArg(aArgs, 'generated');
                        var original = util.getArg(aArgs, 'original', null);
                        var source = util.getArg(aArgs, 'source', null);
                        var name = util.getArg(aArgs, 'name', null);

                        if (!this._skipValidation) {
                            this._validateMapping(generated, original, source, name);
                        }

                        if (source != null && !this._sources.has(source)) {
                            this._sources.add(source);
                        }

                        if (name != null && !this._names.has(name)) {
                            this._names.add(name);
                        }

                        this._mappings.add({
                            generatedLine: generated.line,
                            generatedColumn: generated.column,
                            originalLine: original != null && original.line,
                            originalColumn: original != null && original.column,
                            source: source,
                            name: name
                        });
                    };

                /**
                 * Set the source content for a source file.
                 */
                SourceMapGenerator.prototype.setSourceContent =
                    function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
                        var source = aSourceFile;
                        if (this._sourceRoot != null) {
                            source = util.relative(this._sourceRoot, source);
                        }

                        if (aSourceContent != null) {
                            // Add the source content to the _sourcesContents map.
                            // Create a new _sourcesContents map if the property is null.
                            if (!this._sourcesContents) {
                                this._sourcesContents = {};
                            }
                            this._sourcesContents[util.toSetString(source)] = aSourceContent;
                        } else if (this._sourcesContents) {
                            // Remove the source file from the _sourcesContents map.
                            // If the _sourcesContents map is empty, set the property to null.
                            delete this._sourcesContents[util.toSetString(source)];
                            if (Object.keys(this._sourcesContents).length === 0) {
                                this._sourcesContents = null;
                            }
                        }
                    };

                /**
                 * Applies the mappings of a sub-source-map for a specific source file to the
                 * source map being generated. Each mapping to the supplied source file is
                 * rewritten using the supplied source map. Note: The resolution for the
                 * resulting mappings is the minimium of this map and the supplied map.
                 *
                 * @param aSourceMapConsumer The source map to be applied.
                 * @param aSourceFile Optional. The filename of the source file.
                 *        If omitted, SourceMapConsumer's file property will be used.
                 * @param aSourceMapPath Optional. The dirname of the path to the source map
                 *        to be applied. If relative, it is relative to the SourceMapConsumer.
                 *        This parameter is needed when the two source maps aren't in the same
                 *        directory, and the source map to be applied contains relative source
                 *        paths. If so, those relative source paths need to be rewritten
                 *        relative to the SourceMapGenerator.
                 */
                SourceMapGenerator.prototype.applySourceMap =
                    function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
                        var sourceFile = aSourceFile;
                        // If aSourceFile is omitted, we will use the file property of the SourceMap
                        if (aSourceFile == null) {
                            if (aSourceMapConsumer.file == null) {
                                throw new Error(
                                    'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
                                    'or the source map\'s "file" property. Both were omitted.'
                                );
                            }
                            sourceFile = aSourceMapConsumer.file;
                        }
                        var sourceRoot = this._sourceRoot;
                        // Make "sourceFile" relative if an absolute Url is passed.
                        if (sourceRoot != null) {
                            sourceFile = util.relative(sourceRoot, sourceFile);
                        }
                        // Applying the SourceMap can add and remove items from the sources and
                        // the names array.
                        var newSources = new ArraySet();
                        var newNames = new ArraySet();

                        // Find mappings for the "sourceFile"
                        this._mappings.unsortedForEach(function (mapping) {
                            if (mapping.source === sourceFile && mapping.originalLine != null) {
                                // Check if it can be mapped by the source map, then update the mapping.
                                var original = aSourceMapConsumer.originalPositionFor({
                                    line: mapping.originalLine,
                                    column: mapping.originalColumn
                                });
                                if (original.source != null) {
                                    // Copy mapping
                                    mapping.source = original.source;
                                    if (aSourceMapPath != null) {
                                        mapping.source = util.join(aSourceMapPath, mapping.source)
                                    }
                                    if (sourceRoot != null) {
                                        mapping.source = util.relative(sourceRoot, mapping.source);
                                    }
                                    mapping.originalLine = original.line;
                                    mapping.originalColumn = original.column;
                                    if (original.name != null) {
                                        mapping.name = original.name;
                                    }
                                }
                            }

                            var source = mapping.source;
                            if (source != null && !newSources.has(source)) {
                                newSources.add(source);
                            }

                            var name = mapping.name;
                            if (name != null && !newNames.has(name)) {
                                newNames.add(name);
                            }

                        }, this);
                        this._sources = newSources;
                        this._names = newNames;

                        // Copy sourcesContents of applied map.
                        aSourceMapConsumer.sources.forEach(function (sourceFile) {
                            var content = aSourceMapConsumer.sourceContentFor(sourceFile);
                            if (content != null) {
                                if (aSourceMapPath != null) {
                                    sourceFile = util.join(aSourceMapPath, sourceFile);
                                }
                                if (sourceRoot != null) {
                                    sourceFile = util.relative(sourceRoot, sourceFile);
                                }
                                this.setSourceContent(sourceFile, content);
                            }
                        }, this);
                    };

                /**
                 * A mapping can have one of the three levels of data:
                 *
                 *   1. Just the generated position.
                 *   2. The Generated position, original position, and original source.
                 *   3. Generated and original position, original source, as well as a name
                 *      token.
                 *
                 * To maintain consistency, we validate that any new mapping being added falls
                 * in to one of these categories.
                 */
                SourceMapGenerator.prototype._validateMapping =
                    function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                        aName) {
                        if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
                            && aGenerated.line > 0 && aGenerated.column >= 0
                            && !aOriginal && !aSource && !aName) {
                            // Case 1.
                            return;
                        }
                        else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
                            && aOriginal && 'line' in aOriginal && 'column' in aOriginal
                            && aGenerated.line > 0 && aGenerated.column >= 0
                            && aOriginal.line > 0 && aOriginal.column >= 0
                            && aSource) {
                            // Cases 2 and 3.
                            return;
                        }
                        else {
                            throw new Error('Invalid mapping: ' + JSON.stringify({
                                generated: aGenerated,
                                source: aSource,
                                original: aOriginal,
                                name: aName
                            }));
                        }
                    };

                /**
                 * Serialize the accumulated mappings in to the stream of base 64 VLQs
                 * specified by the source map format.
                 */
                SourceMapGenerator.prototype._serializeMappings =
                    function SourceMapGenerator_serializeMappings() {
                        var previousGeneratedColumn = 0;
                        var previousGeneratedLine = 1;
                        var previousOriginalColumn = 0;
                        var previousOriginalLine = 0;
                        var previousName = 0;
                        var previousSource = 0;
                        var result = '';
                        var mapping;
                        var nameIdx;
                        var sourceIdx;

                        var mappings = this._mappings.toArray();
                        for (var i = 0, len = mappings.length; i < len; i++) {
                            mapping = mappings[i];

                            if (mapping.generatedLine !== previousGeneratedLine) {
                                previousGeneratedColumn = 0;
                                while (mapping.generatedLine !== previousGeneratedLine) {
                                    result += ';';
                                    previousGeneratedLine++;
                                }
                            }
                            else {
                                if (i > 0) {
                                    if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
                                        continue;
                                    }
                                    result += ',';
                                }
                            }

                            result += base64VLQ.encode(mapping.generatedColumn
                                - previousGeneratedColumn);
                            previousGeneratedColumn = mapping.generatedColumn;

                            if (mapping.source != null) {
                                sourceIdx = this._sources.indexOf(mapping.source);
                                result += base64VLQ.encode(sourceIdx - previousSource);
                                previousSource = sourceIdx;

                                // lines are stored 0-based in SourceMap spec version 3
                                result += base64VLQ.encode(mapping.originalLine - 1
                                    - previousOriginalLine);
                                previousOriginalLine = mapping.originalLine - 1;

                                result += base64VLQ.encode(mapping.originalColumn
                                    - previousOriginalColumn);
                                previousOriginalColumn = mapping.originalColumn;

                                if (mapping.name != null) {
                                    nameIdx = this._names.indexOf(mapping.name);
                                    result += base64VLQ.encode(nameIdx - previousName);
                                    previousName = nameIdx;
                                }
                            }
                        }

                        return result;
                    };

                SourceMapGenerator.prototype._generateSourcesContent =
                    function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
                        return aSources.map(function (source) {
                            if (!this._sourcesContents) {
                                return null;
                            }
                            if (aSourceRoot != null) {
                                source = util.relative(aSourceRoot, source);
                            }
                            var key = util.toSetString(source);
                            return Object.prototype.hasOwnProperty.call(this._sourcesContents,
                                key)
                                ? this._sourcesContents[key]
                                : null;
                        }, this);
                    };

                /**
                 * Externalize the source map.
                 */
                SourceMapGenerator.prototype.toJSON =
                    function SourceMapGenerator_toJSON() {
                        var map = {
                            version: this._version,
                            sources: this._sources.toArray(),
                            names: this._names.toArray(),
                            mappings: this._serializeMappings()
                        };
                        if (this._file != null) {
                            map.file = this._file;
                        }
                        if (this._sourceRoot != null) {
                            map.sourceRoot = this._sourceRoot;
                        }
                        if (this._sourcesContents) {
                            map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot)
                        }
                    }
          