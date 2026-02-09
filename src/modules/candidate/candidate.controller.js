import { CandidateService } from "./candidate.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

const processCandidatePayload = async (req) => {
  const files = req.files || [];

  const uploadedPhotos = files.length
    ? await Promise.all(
        files.map((file) => uploadToCloudinary(file.buffer, "candidates")),
      )
    : [];

  const payload = { ...req.body };

  const jsonFields = [
    "portfolio",
    "previous_designations",
    "personal_info",
    "academic_career",
    "business_income_source_professional_career",
    "political_career",
    "election_constituencies",
    "other_income_sources",
    "social_links",
    "district",
    "division",
    "existing_photos",
    "district_bn",
    "division_bn",
    "business_income_source_professional_career_bn",
    "other_income_sources_bn",
    "portfolio_bn",
    "previous_designations_bn",
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

  // Apply default for nationality if missing or empty
  if (payload.personal_info) {
    if (
      !payload.personal_info.nationality ||
      payload.personal_info.nationality.trim() === ""
    ) {
      payload.personal_info.nationality = "Bangladeshi";
    }

    // Merge social links
    if (payload.social_links && Array.isArray(payload.social_links)) {
      payload.personal_info.website_or_social = [
        ...(payload.personal_info.website_or_social || []),
        ...payload.social_links,
      ];
    }
  }

  const newPhotos = uploadedPhotos.map((photo) => ({
    secure_url: photo.secure_url || photo.url,
    public_id: photo.public_id,
    url: photo.url,
  }));

  if (newPhotos.length > 0) {
    payload.new_photos = newPhotos;
  }

  return payload;
};
const createCandidate = catchAsync(async (req, res) => {
  const payload = await processCandidatePayload(req);

  /*if (!payload.new_photos || payload.new_photos.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one photo is required",
    });
  }*/
  payload.photos = payload.new_photos;

  const result = await CandidateService.createCandidate(payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Candidate created successfully",
    data: result,
  });
});

const getAllCandidates = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 9;

  const query = {};

  if (req.query.division) {
    query.division = req.query.division;
  }

  if (req.query.district) {
    query.district = req.query.district;
  }

  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
  }

  const result = await CandidateService.getAllCandidates(query, {
    page,
    limit,
  });

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
  const payload = await processCandidatePayload(req);
  const result = await CandidateService.updateCandidate(req.params.id, payload);

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
