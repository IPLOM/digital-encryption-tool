function generateKey() {
    return window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

async function encryptData(key, data) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const textEncoder = new TextEncoder();
    const dataBuffer = textEncoder.encode(data);

    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        dataBuffer
    );

    const ivBase64 = Buffer.from(iv).toString("base64");
    const encryptedBase64 = Buffer.from(encryptedBuffer).toString("base64");

    return { iv: ivBase64, encryptedData: encryptedBase64 };
}

async function decryptData(key, iv, encryptedData) {
    const textDecoder = new TextDecoder();
    const ivBuffer = Buffer.from(iv, "base64");
    const encryptedBuffer = Buffer.from(encryptedData, "base64");

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBuffer },
        key,
        encryptedBuffer
    );

    const decryptedText = textDecoder.decode(decryptedBuffer);
    return decryptedText;
}

export { generateKey, encryptData, decryptData };
