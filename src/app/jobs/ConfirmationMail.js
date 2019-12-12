import { format, parseISO } from 'date-fns'
import pt from 'date-fns/locale/pt'
import Mail from '../../lib/Mail'

class ConfirmationMail {
  get key() {
    return 'ConfirmationMail'
  }

  async handle({ data }) {
    const enrollment = data.enrollmentCreated

    await Mail.sendMail({
      to: `${enrollment.student.name} <${enrollment.student.email}>`,
      subject: 'Matrícula Confirmada',
      template: 'confirmation',
      context: {
        student: enrollment.student,
        program: enrollment.program,
        end_date: format(
          parseISO(enrollment.end_date),
          "'dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt
          }
        )
      }
    })
  }
}

export default new ConfirmationMail()
