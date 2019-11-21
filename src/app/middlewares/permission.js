import User from '../models/User'
import Permission from '../models/Permission'

export default async (req, res, next) => {
  const user = await User.findByPk(req.userId)
  const userPermission = await Permission.findByPk(user.permission_id)
  if (userPermission.super_admin) req.superAdmin = true

  next()
}
