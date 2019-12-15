import { format, parseISO } from 'date-fns'
import pt from 'date-fns/locale/pt'
import Mail from '../../lib/Mail'

class HelpOrderMail {
  get key() {
    return 'HelpOrderMail'
  }

  async handle({ data }) {
    const { helpOrder } = data

    await Mail.sendMail({
      to: `${helpOrder.student} <${helpOrder.email}>`,
      subject: 'Pedido de ajuda respondido',
      template: 'helpOrder',
      context: {
        student: helpOrder.student,
        question: helpOrder.question,
        answer: helpOrder.answer,
        answered_at: format(
          parseISO(helpOrder.answered_at),
          "'dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt
          }
        )
      }
    })
  }
}

export default new HelpOrderMail()
