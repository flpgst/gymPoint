import Mongoose from 'mongoose'

const HelpOrdersSchema = new Mongoose.Schema(
  {
    student: {
      type: Number,
      required: true
    },

    question: {
      type: String,
      required: true
    },
    answer: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

export default Mongoose.model('HelpOrders', HelpOrdersSchema)
