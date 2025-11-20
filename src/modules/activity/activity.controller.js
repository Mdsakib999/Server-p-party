import ApiError from "../../utils/ApiError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { ActivityService } from "./activity.service.js";

const createActivity = catchAsync(async (req, res, next) => {
  try {
    const payload = req.body || {};

    const created = await ActivityService.createActivity(payload, req.file);
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Activity created successfully",
      data: created,
    });
  } catch (err) {
    return next(err);
  }
});

const getAllActivities = catchAsync(async (req, res, next) => {
  try {
    const activities = await ActivityService.getAllActivities();
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Activities fetched",
      data: activities,
    });
  } catch (err) {
    return next(err);
  }
});

const getActivityBySlug = catchAsync(async (req, res, next) => {
  try {
    const { slug } = req.params;
    const activity = await ActivityService.getActivityBySlug(slug);

    if (!activity) throw new ApiError(404, "Activity not found");

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Activity fetched",
      data: activity,
    });
  } catch (err) {
    return next(err);
  }
});

const updateActivity = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body || {};
    const file = req.file || null;

    const updated = await ActivityService.updateActivity(id, payload, file);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Activity updated successfully",
      data: updated,
    });
  } catch (err) {
    return next(err);
  }
});

const deleteActivity = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    await ActivityService.deleteActivity(id);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
});

export const ActivityController = {
  createActivity,
  getAllActivities,
  getActivityBySlug,
  updateActivity,
  deleteActivity,
};
