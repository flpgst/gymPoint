import Mongoose from 'mongoose'

const HelpOrdersSchema = new Mongoose.Schema(
  {
    student: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String
    },
    answered_at: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

export default Mongoose.model('HelpOrders', HelpOrdersSchema)
