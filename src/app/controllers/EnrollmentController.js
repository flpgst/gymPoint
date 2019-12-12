import * as Yup from 'yup'
import { addMonths, parseISO } from 'date-fns'
import Enrollment from '../models/Enrollment'
import Student from '../models/Student'
import Program from '../models/Program'
import Queue from '../../lib/Queue'
import ConfirmationMail from '../jobs/ConfirmationMail'

class EnrollmentController {
  async index(req, res) {
    const { program_id } = req.body
    const enrollments = await Enrollment.findAll({
      where: !program_id
        ? { deleted_at: null }
        : { program_id, deleted_at: null },
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email']
        },
        {
          model: Program,
          as: 'program',
          attributes: ['title', 'price']
        }
      ]
    })

    return res.json(enrollments)
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.number().required(),
      program_id: Yup.number().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados' })
    }

    if (!req.superAdmin)
      return res
        .status(403)
        .json({ error: 'Somente administradores podem criar matrículas' })

    const enrollment = await Enrollment.findOne({
      where: { student_id: req.body.student_id, deleted_at: null }
    })

    if (enrollment) {
      return res.status(400).json('Este cliente já possui uma matrícula ativa')
    }

    const { start_date, program_id, student_id } = req.body

    const price = await computePrice(program_id)

    const end_date = await computeEndDate(parseISO(start_date), program_id)

    const { id } = await Enrollment.create({
      start_date,
      program_id,
      student_id,
      price,
      end_date
    })

    const enrollmentCreated = await Enrollment.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email']
        },
        {
          model: Program,
          as: 'program',
          attributes: ['title', 'duration', 'price']
        }
      ]
    })

    await Queue.add(ConfirmationMail.key, { enrollmentCreated })

    return res.json(enrollmentCreated)
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      price: Yup.number(),
      end_date: Yup.date(),
      program_id: Yup.number().required(),
      reset: Yup.boolean()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados' })
    }

    const { id } = req.params

    const enrollment = await Enrollment.findByPk(id)

    if (!enrollment)
      return res.status(400).json({ error: 'Matrícula não exíste' })

    const { program_id, price, end_date, reset } = req.body

    if (program_id === enrollment.program_id && !price && !end_date && !reset)
      return res
        .status(400)
        .json({ error: 'Nenhuma alteração efetuada no plano' })

    enrollment.price = await computePrice(program_id, price)

    enrollment.end_date = await computeEndDate(
      enrollment.start_date,
      program_id,
      end_date
    )

    enrollment.program_id = program_id

    await enrollment.save()

    return res.json({
      id: enrollment.id,
      price: enrollment.price,
      end_date: enrollment.end_date,
      program_id: enrollment.program_id
    })
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id)

    if (!req.superAdmin)
      return res
        .status(403)
        .json({ error: 'Somente administradores podem remover matrículas' })

    if (!enrollment) {
      res.status(401).json({ error: 'Matrícula inexistente' })
    }

    try {
      await enrollment.destroy()
    } catch (error) {
      return res.status(500).json(error.message)
    }

    return res.status(200).json({ error: 'Matrícula excluída com sucesso' })
  }
}

async function computePrice(program_id, price) {
  if (!price) {
    const program = await Program.findByPk(program_id)
    return parseFloat(program.duration * program.price).toFixed(2)
  }
  return price
}

async function computeEndDate(start_date, program_id, end_date) {
  if (!end_date) {
    const program = await Program.findByPk(program_id)
    return addMonths(start_date, program.duration)
  }
  return end_date
}

export default new EnrollmentController()
