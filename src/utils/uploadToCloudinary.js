import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else
          resolve({ url: result?.secure_url, public_id: result?.public_id });
      }
    );
    stream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicIds) => {
  try {
    const ids = Array.isArray(publicIds) ? publicIds : [publicIds];

    const results = await Promise.all(
      ids.map(
        (id) =>
          new Promise((resolve) => {
            cloudinary.uploader.destroy(id, (error, result) => {
              if (error) {
                resolve({
                  id,
                  success: false,
                  error: error.message || "Cloudinary deletion failed",
                });
              } else {
                resolve({
                  id,
                  success: result.result === "ok",
                });
              }
            });
          })
      )
    );

    return { success: true, results };
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return { success: false, message: error.message };
  }
};
