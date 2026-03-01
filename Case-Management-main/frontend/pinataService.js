const PINATA_API_KEY = "b4c73833bb369f6f205d";
const PINATA_SECRET_API_KEY = "1a4800f3b3c58576d2427dfb6a4dfb0d9d086db369611ef290e7d80bfd7e4d9a";

/**
 * Encrypts a remote file and pushes it onto Pinata IPFS network.
 * @param {string} fileUrl The source URL of the file (e.g. AWS S3 link)
 * @param {string} fileName The name of the file to be uploaded
 * @returns {Promise<{ipfsCID: string, encryptionKey: string}>} Result containing CID and the key used
 */
export async function encryptAndUploadToPinata(fileUrl, fileName) {
    try {
        // 1. Fetch file as array buffer
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error("Failed to fetch evidence file for encryption.");
        const buffer = await response.arrayBuffer();

        // 2. Encrypt the file data using AES-GCMS
        const key = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encryptedData = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, buffer);

        // Package IV + encrypted file together
        const finalArray = new Uint8Array(iv.length + encryptedData.byteLength);
        finalArray.set(iv, 0);
        finalArray.set(new Uint8Array(encryptedData), iv.length);

        const encryptedBlob = new Blob([finalArray], { type: "application/octet-stream" });

        // 3. Push to Pinata
        const formData = new FormData();
        formData.append("file", encryptedBlob, `locked_${fileName || "evidence.bin"}`);

        const metadata = JSON.stringify({ name: `Encrypted Evidence - ${fileName}` });
        formData.append("pinataMetadata", metadata);

        // Make HTTP request to Pinata pinFileToIPFS
        const pinataRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
                "pinata_api_key": PINATA_API_KEY,
                "pinata_secret_api_key": PINATA_SECRET_API_KEY
            },
            body: formData
        });

        if (!pinataRes.ok) {
            throw new Error(`Pinata upload failed: ${await pinataRes.text()}`);
        }

        const data = await pinataRes.json();

        // Export encryption key so authorized personnel can decrypt it later
        const rawKey = await window.crypto.subtle.exportKey("raw", key);
        const hexKey = Array.from(new Uint8Array(rawKey)).map(b => b.toString(16).padStart(2, '0')).join('');

        return {
            ipfsCID: data.IpfsHash,
            encryptionKey: hexKey
        };
    } catch (e) {
        console.error("Encryption/Upload Error:", e);
        throw e;
    }
}
