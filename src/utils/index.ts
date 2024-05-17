import { Convert } from "pvtsutils";

export const truncateStringMiddle = function (
  fullStr?: string,
  strLen = 14,
  separator = " ... "
) {
  if (!fullStr?.length) {
    return "";
  }

  if (fullStr.length <= strLen) {
    return fullStr;
  }

  const charsToShow = strLen - separator.length;

  return (
    fullStr.substring(0, Math.ceil(charsToShow / 2)) +
    separator +
    fullStr.substring(fullStr.length - Math.floor(charsToShow / 2))
  );
};

export const isHex = (value: string) =>
  /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/.test(value);

export const isBase64 = (value: string) => {
  try {
    window.atob(value);
    return true;
  } catch (error) {
    return false;
  }
};

export const isPem = (value: string) =>
  // eslint-disable-next-line no-useless-escape
  /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/.test(
    value
  );

const base64Re =
  /-----BEGIN [^-]+-----([A-Za-z0-9+/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+/=\s]+)====/;

export function base64Clarify(base64: string) {
  const execArray = base64Re.exec(base64);

  return execArray ? execArray[1] || execArray[2] : base64;
}

export function certificateRawToBuffer(raw: string) {
  let buffer: ArrayBuffer;

  if (isHex(raw)) {
    buffer = Convert.FromHex(raw);
  } else if (isBase64(raw) || isPem(raw)) {
    buffer = Convert.FromBase64(raw);
  } else {
    buffer = Convert.FromBinary(raw);
  }

  return buffer;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
