declare global {
  interface Window {
    IpfsHttpClient: any;
  }
}

let ipfsClient: any = null;

const getIpfsClient = () => {
  if (!ipfsClient) {
    ipfsClient = window.IpfsHttpClient.create(process.env.NEXT_PUBLIC_IPFS_ENDPOINT);
  }

  return ipfsClient;
};

export async function addToIpfs(data: any) {
  const ipfsClientInstance = getIpfsClient();
  try {
    const response = await ipfsClientInstance.add(JSON.stringify(data));
    const cid = response.cid.toString();
    await ipfsClientInstance.pin.add(cid);
    console.log("Content uploaded and pinned to IPFS with cid", cid);
    return cid;
  } catch (err) {
    console.error(err);
    throw new Error("Cannot upload to IPFS");
  }
}

export async function getFromIpfs(cid: string) {
  const ipfsClientInstance = getIpfsClient();
  let data = new Uint8Array();
  let dataRead = 0;
  const chunks = [];
  for await (const chunk of ipfsClientInstance.cat(cid)) {
    chunks.push(chunk);
    const tmp = new Uint8Array(data.byteLength + chunk.byteLength);
    tmp.set(chunk, data.byteLength);
    data = tmp;
    dataRead += chunk.byteLength;
  }
  const raw = new TextDecoder("utf-8").decode(data);
  const content = JSON.parse(raw);
  return content;
}
