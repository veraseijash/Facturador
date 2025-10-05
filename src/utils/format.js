export const formatValue = (value) => {
  if (typeof value === "number") return value.toLocaleString();
  return value ?? "";
};

export const formatInteger = (value) => {
  if (typeof value === "number") return Math.round(value).toLocaleString();
  return value ?? "";
};