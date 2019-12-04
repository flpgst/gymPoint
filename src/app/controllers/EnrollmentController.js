import * as Yup from 'yup'
import { addMonths, parseISO } from 'date-fns'
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

  // async update(req, res) {
  //   const { id } = req.params

  //   const enrollment = await Enrollment.findOne({ where: { id } })

  //   const { program_id, price, end_date } = req.body

  //   if (program_id && !price && !end_date) {
  //     if (program_id === enrollment.program_id)
  //       return res.status(400).json('O cliente já está matriculado neste plano')

  //     computePrice(program_id)
  //   }

  // const { title, duration, price } = await program.update(req.body)
  // }
}

async function loadProgram(program_id) {
  const program = await Program.findOne({
    where: { id: program_id, deleted_at: null }
  })
  return program
}

async function computePrice(program_id) {
  const program = await loadProgram(program_id)
  const price = parseFloat(program.duration * program.price).toFixed(2)
  return price
}

async function computeEndDate(start_date, program_id) {
  const program = await loadProgram(program_id)
  return addMonths(parseISO(start_date), program.duration)
}

export default new EnrollmentController()
