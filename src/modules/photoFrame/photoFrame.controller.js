import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { PhotoFrame } from "./photoFrame.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/uploadToCloudinary.js";
import ApiError from "../../utils/ApiError.js";

const createFrame = catchAsync(async (req, res) => {
  const { division } = req.body;

  if (!req.file) {
    throw new Error("Please upload an image");
  }

  const result = await uploadToCloudinary(req.file.buffer, "photo-frames");

  const frame = await PhotoFrame.create({
    division,
    url: result.url,
    public_id: result.public_id,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Photo frame created successfully",
    data: frame,
  });
});

const getAllFrames = catchAsync(async (req, res) => {
  const { division } = req.query;
  const query = {};
  if (division) {
    query.division = division;
  }
  const frames = await PhotoFrame.find(query).sort("-createdAt");
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Photo frames retrieved successfully",
    data: frames,
  });
});

const deleteFrame = catchAsync(async (req, res) => {
  const { id } = req.params;
  const frame = await PhotoFrame.findById(id);

  if (!frame) {
    throw new Error("Frame not found");
  }

  if (frame.public_id) {
    await deleteFromCloudinary(frame.public_id);
  }

  await PhotoFrame.findByIdAndDelete(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Photo frame deleted successfully",
    data: frame,
  });
});

const updateFrame = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { division } = req.body;
  const file = req.file;

  const frame = await PhotoFrame.findById(id);
  if (!frame) {
    throw new ApiError(404, "Frame not found");
  }

  const updateData = {};
  if (division) updateData.division = division;

  if (file) {
    // Delete old image
    if (frame.public_id) {
      await deleteFromCloudinary(frame.public_id);
    }
    // Upload new image
    const { url, public_id } = await uploadToCloudinary(file.buffer, "frames");
    updateData.url = url;
    updateData.public_id = public_id;
  }

  const updatedFrame = await PhotoFrame.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  res.status(200).json({
    success: true,
    message: "Frame updated successfully",
    data: updatedFrame,
  });
});

export const PhotoFrameController = {
  createFrame,
  getAllFrames,
  deleteFrame,
  updateFrame,
};
