// server/src/models/Schedule.ts
import { Schema, model, Types } from 'mongoose'

interface ScheduleType {
  staff: Types.ObjectId
  date: string
  startTime: string
  endTime: string
  status: 'scheduled' | 'completed' | 'cancelled'
}
const ScheduleSchema = new Schema(
  {
    staff: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  { timestamps: true }
)

ScheduleSchema.index({ staff: 1, date: 1 })

export default model('Schedule', ScheduleSchema)
