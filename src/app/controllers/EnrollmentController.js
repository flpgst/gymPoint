import * as Yup from 'yup'
import { addMonths } from 'date-fns'
import Enrollment from '../models/Enrollment'
import Program from '../models/Program'

class EnrollmentController {
  async index(req, res) {
    const { program_id } = req.body
    const enrollments = await Enrollment.findAll({
      where: !program_id
        ? { deleted_at: null }
        : { program_id, deleted_at: null },
      attributes: [
        'id',
        'start_date',
        'end_date',
        'price',
        'student_id',
        'program_id'
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

    const studentEnrollment = await Enrollment.findOne({
      where: { student_id: req.body.student_id, deleted_at: null }
    })

    if (studentEnrollment) {
      return res.status(400).json('Este cliente já possui uma matrícula ativa')
    }

    const { start_date, program_id, student_id } = req.body

    const price = await computePrice(program_id)

    const end_date = await computeEndDate(start_date, program_id)

    const { id } = await Enrollment.create({
      start_date,
      program_id,
      student_id,
      price,
      end_date
    })

    return res.json({
      id,
      start_date,
      end_date,
      price,
      program_id,
      student_id
    })
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

    const enrollment = await Enrollment.findOne({ where: { id } })

    const { program_id, price, end_date, reset } = req.body

    if (program_id === enrollment.program_id && !price && !end_date && !reset)
      return res.status(400).json('Nenhuma alteração efetuada no plano')

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
}

async function loadProgram(program_id) {
  const program = await Program.findOne({
    where: { id: program_id, deleted_at: null }
  })

  return program
}

async function computePrice(program_id, price) {
  if (!price) {
    const program = await loadProgram(program_id)
    return parseFloat(program.duration * program.price).toFixed(2)
  }
  return price
}

async function computeEndDate(start_date, program_id, end_date) {
  if (!end_date) {
    const program = await loadProgram(program_id)
    return addMonths(start_date, program.duration)
  }
  return end_date
}

export default new EnrollmentController()
