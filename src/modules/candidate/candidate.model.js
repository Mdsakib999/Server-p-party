import { Schema, model } from "mongoose";

const personalInfoSchema = new Schema(
  {
    birth_date: String,
    birth_place: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      default: "Bangladeshi",
    },
    nationality_bn: {
      type: String,
      default: "বাংলাদেশি",
    },
    mobileNo: String,
    website_or_social: [String],
  },
  { _id: false },
);

const academicCareerSchema = new Schema(
  {
    schools: [String],
    college: String,
    university: [String],
    degree: [String],
    college_bn: String,
    university_bn: [String],
    degree_bn: [String],
  },
  { _id: false },
);

const politicalCareerSchema = new Schema(
  {
    year: String,
    event: String,
    event_bn: String,
  },
  { _id: false },
);

const electionConstituencySchema = new Schema(
  {
    actual_place_name: String,
    election_area_name: String,
    actual_place_name_bn: String,
    election_area_name_bn: String,
  },
  { _id: false },
);

const photoSchema = new Schema(
  {
    secure_url: String,
    public_id: String,
    url: String,
  },
  { _id: false },
);

const candidateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    name_bn: {
      type: String,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    priorityOrder: {
      type: Number,
      default: 0,
    },

    designation: {
      type: String,
      default: "Party Leader",
    },
    designation_bn: {
      type: String,
      default: "দলীয় নেতা",
    },

    profession: {
      type: String,
      default: "Politician",
    },
    profession_bn: {
      type: String,
      default: "রাজনীতিবিদ",
    },

    portfolio: {
      type: [String],
    },

    previous_designations: {
      type: [String],
    },

    personal_info: {
      type: personalInfoSchema,
      required: true,
    },

    academic_career: academicCareerSchema,

    business_income_source_professional_career: [String],

    political_career: [politicalCareerSchema],

    business_income_source_professional_career_bn: [String],
    other_income_sources_bn: [String],

    election_constituencies: {
      type: [electionConstituencySchema],
      required: true,
    },

    life_activities: String,

    other_income_sources: [String],

    photos: {
      type: [photoSchema],
      default: [],
    },

    overall_summary: {
      type: String,
      required: true,
    },
    overall_summary_bn: {
      type: String,
    },

    district: {
      type: [String],
      required: true,
    },

    division: {
      type: [String],
      required: true,
    },
    district_bn: {
      type: [String],
    },
    division_bn: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

const Candidate = model("Candidate", candidateSchema);

candidateSchema.index({ isFeatured: -1, priorityOrder: 1, createdAt: -1 });

export default Candidate;
