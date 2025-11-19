import { Schema, model } from "mongoose";



const personalInfoSchema = new Schema({
  birth_date: String,
  birth_place: String,
  nationality: String,
  website_or_social: [String],
});

const academicCareerSchema = new Schema({
  schools: [String],
  college: String,
  university: [String],
  degree: [String],
});

const politicalCareerSchema = new Schema({
  year: String,
  event: String,
});

const electionConstituencySchema = new Schema({
  actual_place_name: String,
  election_area_name: String,
});

const photoSchema = new Schema({
  secure_url: String,
  public_id: String,
  url: String,
});

const candidateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    portfolio: {
      type: [String],
      required: true,
    },
    designations: {
      type: [String],
      required: true,
    },
    personal_info: {
      type: personalInfoSchema,
      required: true,
    },
    academic_career: {
      type: academicCareerSchema,
    },
    business_income_source_professional_career: {
      type: [String],
    },
    political_career: {
      type: [politicalCareerSchema],
    },
    election_constituencies: {
      type: [electionConstituencySchema],
      required: true,
    },
    life_activities: String,
    other_income_sources: [String],
    social_links: [String],
    photos: {
      type: [photoSchema],
      required: true,
    },
    overall_summary: {
      type: String,
      required: true,
    },
    district: {
      type: [String],
      required: true,
    },
    division: {
      type: [String],
      required: true,
    },
    metadata: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

const Candidate = model("Candidate", candidateSchema);
export default Candidate;
