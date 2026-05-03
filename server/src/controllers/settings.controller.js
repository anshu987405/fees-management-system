import { Setting } from "../models/Setting.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function currentSettings() {
  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create({});
  return settings;
}

export const getSettings = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await currentSettings() });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await currentSettings();
  Object.assign(settings, req.body);
  await settings.save();
  res.json({ success: true, data: settings });
});
