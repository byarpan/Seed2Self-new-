// TODO: Unique ID generator helper
export const generateCustomId = (prefix = "ID") => {
  return `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

export default generateCustomId;
