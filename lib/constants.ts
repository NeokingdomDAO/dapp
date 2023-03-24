const COMMON_FIELDS = ["display_name", "email", "ethereum_address"];

export const ODOO_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

export const USER_FIELDS = {
  neokingdom: [...COMMON_FIELDS, "avatar_256"],
  teledisko: [...COMMON_FIELDS, "image"],
};

type STAGE_NAMES = "backlog" | "created" | "progress" | "inprogress" | "done" | "approved" | "canceled";
export const STAGE_TO_ID_MAP: Record<STAGE_NAMES, number> = {
  backlog: 29,
  created: 29,
  progress: 30,
  inprogress: 30,
  done: 31, // 161 !!
  approved: 32,
  canceled: 162,
};

export const STAGE_TO_COLOR_MAP: Record<STAGE_NAMES, string> = {
  backlog: "default",
  created: "default",
  progress: "primary",
  inprogress: "primary",
  done: "success",
  approved: "warning",
  canceled: "error",
};
