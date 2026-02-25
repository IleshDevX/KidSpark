/**
 * KidSpark Crypto Utilities
 * Simple XOR-based encryption for local storage.
 * NOT cryptographically secure — used for obfuscation only.
 */

const CRYPTO_KEY = 'KidSpark_2026_SecureKey!';

const KSCrypto = {
    _toBase64Utf8(text) {
        if (typeof TextEncoder !== 'undefined') {
            const bytes = new TextEncoder().encode(text);
            let bin = '';
            bytes.forEach(b => { bin += String.fromCharCode(b); });
            return btoa(bin);
        }
        return btoa(unescape(encodeURIComponent(text)));
    },

    _fromBase64Utf8(encoded) {
        const bin = atob(encoded);
        if (typeof TextDecoder !== 'undefined') {
            const bytes = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
            return new TextDecoder().decode(bytes);
        }
        return decodeURIComponent(escape(bin));
    },

    /** Encrypt a string */
    encrypt(text) {
        try {
            const key = CRYPTO_KEY;
            const bytes = (typeof TextEncoder !== 'undefined')
                ? new TextEncoder().encode(text)
                : new Uint8Array(unescape(encodeURIComponent(text)).split('').map(ch => ch.charCodeAt(0)));

            let xored = '';
            for (let i = 0; i < bytes.length; i++) {
                xored += String.fromCharCode(bytes[i] ^ key.charCodeAt(i % key.length));
            }
            return btoa(xored);
        } catch {
            return this._toBase64Utf8(text);
        }
    },

    /** Decrypt a string */
    decrypt(encoded) {
        try {
            const key = CRYPTO_KEY;
            const xored = atob(encoded);
            const out = new Uint8Array(xored.length);
            for (let i = 0; i < xored.length; i++) {
                out[i] = xored.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            }

            if (typeof TextDecoder !== 'undefined') {
                return new TextDecoder().decode(out);
            }

            let legacy = '';
            for (let i = 0; i < out.length; i++) legacy += String.fromCharCode(out[i]);
            try { return decodeURIComponent(escape(legacy)); }
            catch { return legacy; }
        } catch {
            try {
                return this._fromBase64Utf8(encoded);
            } catch {
                return atob(encoded);
            }
        }
    },

    /** Hash a short string (PIN/password fingerprint) using simple base36 */
    hash(str) {
        let h = 0x811c9dc5;
        for (let i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 0x01000193);
        }
        return (h >>> 0).toString(36);
    }
};
