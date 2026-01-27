import ApiError from "../../utils/ApiError.js";
import Candidate from "./candidate.model.js";

const createCandidate = async (payload) => {
  try {
    const candidate = await Candidate.create(payload);
    return candidate;
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new ApiError(400, err.message);
    }
    throw err;
  }
};

const getAllCandidates = async (query = {}) => {
  const candidates = await Candidate.find(query).sort({
    isFeatured: -1, // featured (top leaders) first
    priorityOrder: 1, // strict order among top leaders (1,2,3...)
    createdAt: -1, // rest in normal order
  });

  return candidates;
};

const getCandidateById = async (id) => {
  const candidate = await Candidate.findById(id);
  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }
  return candidate;
};

const updateCandidate = async (id, payload) => {
  if (payload.new_photos && payload.new_photos.length > 0) {
    if (payload.existing_photos) {
      payload.photos = [
        ...(payload.existing_photos || []),
        ...payload.new_photos,
      ];
    } else {
      const existing = await Candidate.findById(id);
      if (existing) {
        payload.photos = [...(existing.photos || []), ...payload.new_photos];
      } else {
        payload.photos = payload.new_photos;
      }
    }
    delete payload.new_photos;
  } else if (payload.existing_photos) {
    payload.photos = payload.existing_photos;
  }

  const candidate = await Candidate.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }

  return candidate;
};

const deleteCandidate = async (id) => {
  const candidate = await Candidate.findByIdAndDelete(id);
  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }
  return candidate;
};

export const CandidateService = {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
};
