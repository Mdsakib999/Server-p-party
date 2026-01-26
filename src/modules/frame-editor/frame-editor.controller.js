import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { FrameEditorService } from "./frame-editor.service.js";

const uploadFramedImage = catchAsync(async (req, res, next) => {
  try {
    const { imageData } = req.body;

    if (!imageData) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Image data is required",
      });
    }

    const result = await FrameEditorService.processAndUploadImage(imageData);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Image uploaded successfully",
      data: result,
    });
  } catch (err) {
    return next(err);
  }
});

export const FrameEditorController = {
  uploadFramedImage,
};
