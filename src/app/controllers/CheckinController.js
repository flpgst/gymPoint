import { Op } from 'sequelize'
import { endOfToday, subDays } from 'date-fns'
import Checkin from '../models/Checkin'
import Student from '../models/Student'

class CheckinController {
  async store(req, res) {
    const student = await Student.findOne({ where: { user_id: req.userId } })

    if (!student) {
      return res.status(400).json('Cliente não existe')
    }

    await Checkin.findAndCountAll({
      where: {
        created_at: { [Op.between]: [subDays(endOfToday(), 7), endOfToday()] }
      }
    }).then(result => {
      if (result.count > 5) {
        return res
          .status(400)
          .json({ error: 'Excedido número máximo de checkins na semana' })
      }
      return result.rows
    })

    await Checkin.create({ student_id: student.id })

    return res.json({ message: 'Checkin efetuado!' })
  }

  async index(req, res) {
    const { id } = req.params

    const checkins = await Checkin.findAll({ where: { student_id: id } })

    return res.json(checkins)
  }
}

export default new CheckinController()
