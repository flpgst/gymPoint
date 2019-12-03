import * as Yup from 'yup'
import Student from '../models/Student'

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      birthday: Yup.date().required(),
      weight: Yup.number(),
      height: Yup.number()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados' })
    }

    const emailExists = await Student.findOne({
      where: { email: req.body.email }
    })
    if (emailExists) return res.status(400).json({ error: 'Email já existe' })

    const {
      id,
      name,
      email,
      birthday,
      age,
      weight,
      height
    } = await Student.create(req.body)

    return res.json({
      id,
      name,
      email,
      birthday,
      age,
      weight,
      height
    })
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      birthday: Yup.date(),
      weight: Yup.number(),
      height: Yup.number()
    })
    const { id } = req.params

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados' })
    }

    const student = await Student.findOne({ where: { id: req.params.id } })

    const { name, email, weight, height, age } = await student.update(req.body)

    return res.json({
      id,
      name,
      email,
      weight,
      height,
      age
    })
  }
}

export default new StudentController()
