/**
 * KidSpark Crypto Utilities
 * Simple XOR-based encryption for local storage.
 * NOT cryptographically secure — used for obfuscation only.
 */

const CRYPTO_KEY = 'KidSpark_2026_SecureKey!';

const KSCrypto = {
    /** Encrypt a string */
    encrypt(text) {
        try {
            const key = CRYPTO_KEY;
            let result = '';
            for (let i = 0; i < text.length; i++) {
                result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return btoa(result);
        } catch { return btoa(text); }
    },

    /** Decrypt a string */
    decrypt(encoded) {
        try {
            const key = CRYPTO_KEY;
            const text = atob(encoded);
            let result = '';
            for (let i = 0; i < text.length; i++) {
                result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return result;
        } catch { return atob(encoded); }
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
