const COMMON_FIELDS = ["display_name", "email", "ethereum_address"];

export const ODOO_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

export const USER_FIELDS = {
  neokingdom: [...COMMON_FIELDS, "avatar_256"],
  teledisko: [...COMMON_FIELDS, "image"],
};

export type STAGE_NAME = "backlog" | "created" | "progress" | "inprogress" | "done" | "approved" | "canceled";

export const STAGE_TO_ID_MAP: Record<STAGE_NAME, number> = {
  backlog: 29,
  created: 29,
  progress: 30,
  inprogress: 30,
  done: 31, // 161 !!
  approved: 32,
  canceled: 162,
};

export const STAGE_TO_COLOR_MAP: Record<STAGE_NAME, string> = {
  backlog: "default",
  created: "default",
  progress: "primary",
  inprogress: "primary",
  done: "success",
  approved: "warning",
  canceled: "error",
};

export const TAGS_COLORS: Record<number, string> = {
  1: "#AB46D2",
  2: "#FCF69C",
  3: "#F7D060",
  4: "#A8D1D1",
  5: "#ADA2FF",
  6: "#FF6D28",
  7: "#D49D42",
  8: "#C15050",
  9: "#F0D43A",
  10: "#CC0066",
  11: "#AB46D2",
  12: "#FCF69C",
  13: "#F7D060",
  14: "#A8D1D1",
  15: "#ADA2FF",
  16: "#FF6D28",
  17: "#D49D42",
  18: "#C15050",
  19: "#F0D43A",
  20: "#CC0066",
  21: "#AB46D2",
  22: "#FCF69C",
  23: "#F7D060",
  24: "#A8D1D1",
  25: "#ADA2FF",
  26: "#FF6D28",
  27: "#D49D42",
  28: "#C15050",
  29: "#F0D43A",
  30: "#CC0066",
};
