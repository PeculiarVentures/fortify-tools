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
