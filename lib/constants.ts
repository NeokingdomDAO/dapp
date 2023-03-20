const COMMON_FIELDS = ["display_name", "email", "ethereum_address"];

export const ODOO_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

export const USER_FIELDS = {
  neokingdom: [...COMMON_FIELDS, "avatar_256"],
  teledisko: [...COMMON_FIELDS, "image"],
};

export const STAGE_TO_ID_MAP: Record<string, number> = {
  backlog: 29,
  created: 29,
  progress: 30,
  inprogress: 30,
  done: 31, // 161 !!
  approved: 32,
  canceled: 162,
};

export const STAGE_TO_COLOR_MAP: Record<string, string> = {
  created: "default",
  inprogress: "primary",
  done: "success",
  approved: "warning",
};
