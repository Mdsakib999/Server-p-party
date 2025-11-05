import ApiError from "../../utils/ApiError.js";
import Candidate from "./candidate.model.js";

const createCandidate = async (payload) => {
  // Check if candidate with same ID exists
  const existingCandidate = await Candidate.findOne({ _id: payload._id });
  if (existingCandidate) {
    throw new ApiError(409, "Candidate with this ID already exists");
  }

  // Create new candidate
  const candidate = await Candidate.create(payload);
  return candidate;
};

const getAllCandidates = async (query = {}) => {
  const candidates = await Candidate.find(query);
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
  const candidate = await Candidate.findByIdAndUpdate(
    id,
    { ...payload, lastUpdated: new Date() },
    { new: true, runValidators: true }
  );

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
