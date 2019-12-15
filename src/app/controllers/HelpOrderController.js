import { parseISO } from 'date-fns'
import Queue from '../../lib/Queue'
import HelpOrderMail from '../jobs/HelpOrderMail'
import HelpOrder from '../schemas/HelpOrder'
import Student from '../models/Student'

class HelpOrderController {
  async index(req, res) {
    const { id } = await Student.findOne({ where: { user_id: req.userId } })

    let helpOrders

    if (req.superAdmin) {
      helpOrders = await HelpOrder.find({
        answer: { $exists: false }
      })
    } else {
      helpOrders = await HelpOrder.find({
        student: id
      })
    }
    return res.json(helpOrders)
  }

  async store(req, res) {
    const { name, email } = await Student.findOne({
      where: { user_id: req.userId }
    })

    const { question } = req.body

    await HelpOrder.create({
      student: name,
      email,
      question
    })

    return res.json({ message: 'Pedido de ajuda enviado' })
  }

  async update(req, res) {
    const { answer } = req.body
    const { id } = await HelpOrder.findByIdAndUpdate(req.params.id, {
      answer,
      answered_at: new Date()
    })
    const helpOrder = await HelpOrder.findById(id)
    await Queue.add(HelpOrderMail.key, { helpOrder })

    return res.json(helpOrder)
  }
}

export default new HelpOrderController()
