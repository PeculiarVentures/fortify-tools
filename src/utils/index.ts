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

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
