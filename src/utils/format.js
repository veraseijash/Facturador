export const formatValue = (value) => {
  if (typeof value === "number") return value.toLocaleString();
  return value ?? "";
};