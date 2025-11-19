import { CandidateService } from "./candidate.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

const createCandidate = catchAsync(async (req, res) => {
  const files = req.files || [];

  const uploadedPhotos = files.length
    ? await Promise.all(
        files.map((file) => uploadToCloudinary(file.buffer, "candidates"))
      )
    : [];

  // Require at least one photo
  if (!uploadedPhotos.length) {
    return res.status(400).json({
      success: false,
      message: "At least one photo is required",
    });
  }

  // Parse JSON strings from FormData
  const payload = { ...req.body };

  const jsonFields = [
    "portfolio",
    "designations",
    "personal_info",
    "academic_career",
    "business_income_source_professional_career",
    "political_career",
    "election_constituencies",
    "other_income_sources",
    "social_links",
    "district",
    "division",
  ];

  jsonFields.forEach((field) => {
    if (payload[field] && typeof payload[field] === "string") {
      try {
        payload[field] = JSON.parse(payload[field]);
      } catch (e) {
        console.error(`Error parsing ${field}:`, e);
      }
    }
  });

  payload.photos = uploadedPhotos.map((photo) => ({
    secure_url: photo.secure_url || photo.url,
    public_id: photo.public_id,
    url: photo.url,
  }));

  const result = await CandidateService.createCandidate(payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Candidate created successfully",
    data: result,
  });
});

const getAllCandidates = catchAsync(async (req, res) => {
  const result = await CandidateService.getAllCandidates(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Candidates retrieved successfully",
    data: result,
  });
});

const getCandidateById = catchAsync(async (req, res) => {
  const result = await CandidateService.getCandidateById(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Candidate retrieved successfully",
    data: result,
  });
});

const updateCandidate = catchAsync(async (req, res) => {
  const result = await CandidateService.updateCandidate(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Candidate updated successfully",
    data: result,
  });
});

const deleteCandidate = catchAsync(async (req, res) => {
  const result = await CandidateService.deleteCandidate(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Candidate deleted successfully",
    data: result,
  });
});

export const CandidateController = {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
};
