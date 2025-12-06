import { Schema, model } from 'mongoose'

const substituteRequestSchema = new Schema(
  {
    schedule: { type: Schema.Types.ObjectId, ref: 'Schedule', required: true },
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // 대타 요청자
    substitute: { type: Schema.Types.ObjectId, ref: 'User' }, // 대타 맡을 사람
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

export default model('SubstituteRequest', substituteRequestSchema)
