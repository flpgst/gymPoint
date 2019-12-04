import * as Yup from 'yup'
import Program from '../models/Program'

class ProgramController {
  async index(req, res) {
    const programs = await Program.findAll({
      where: {
        deleted_at: null
      },
      order: ['price'],
      attributes: ['id', 'title', 'duration', 'price']
    })

    return res.json(programs)
  }

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

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required()
    })

    const { id } = req.params

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados' })
    }

    if (!req.superAdmin)
      return res
        .status(403)
        .json({ error: 'Somente administradores podem alterar planos' })

    const program = await Program.findOne({ where: { id } })

    const { title, duration, price } = await program.update(req.body)

    return res.json({
      id,
      title,
      duration,
      price
    })
  }

  async delete(req, res) {
    const program = await Program.findByPk(req.params.id)

    if (!req.superAdmin)
      return res
        .status(403)
        .json({ error: 'Somente administradores podem remover planos' })

    if (!program) {
      res.status(401).json('Plano inexistente')
    }

    const { id, title, duration, price } = await program.destroy()

    return res.json({
      id,
      title,
      duration,
      price
    })
  }
}

export default new ProgramController()
