import HelpOrder from '../schemas/HelpOrder'
import Student from '../models/Student'

class HelpOrderController {
  async store(req, res) {
    const { id } = await Student.findOne({ where: { user_id: req.userId } })

    const { question } = req.body

    await HelpOrder.create({
      student: id,
      question
    })

    return res.json({ message: 'Pedido de ajuda enviado' })
  }
}

export default new HelpOrderController()
