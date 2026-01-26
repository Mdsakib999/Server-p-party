import sharp from "sharp";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";
import ApiError from "../../utils/ApiError.js";

const processAndUploadImage = async (base64Data) => {
  try {
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");

    const imageBuffer = Buffer.from(base64Image, "base64");

    const processedBuffer = await sharp(imageBuffer)
      .resize(1080, 1080, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .png({
        quality: 90,
        compressionLevel: 9,
      })
      .toBuffer();

    const uploadResult = await uploadToCloudinary(
      processedBuffer,
      "frame-editor",
    );

    return {
      url: uploadResult.url,
      publicId: uploadResult.public_id,
      size: processedBuffer.length,
    };
  } catch (error) {
    console.error("Frame editor service error:", error);
    throw new ApiError(500, "Failed to process and upload image");
  }
};

export const FrameEditorService = {
  processAndUploadImage,
};
