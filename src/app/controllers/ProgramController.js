import * as Yup from 'yup'
import Program from '../models/Program'

class ProgramController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados' })
    }

    const programExists = await Program.findOne({
      where: { title: req.body.title }
    })
    if (programExists) {
      return res.status(400).json({ error: 'Já existe um plano com este nome' })
    }

    const { id, title, duration, price } = await Program.create(req.body)

    return res.json({
      id,
      title,
      duration,
      price
    })
  }
}

export default new ProgramController()
