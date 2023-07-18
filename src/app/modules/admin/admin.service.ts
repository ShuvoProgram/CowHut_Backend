import config from '../../../config'
import { IAdmin } from './admin.interface'
import { Admin } from './admin.model'

const createAdmin = async (admin: IAdmin): Promise<IAdmin | null> => {
  // If password is not given,set default password
  if (!admin.password) {
    admin.password = config.default_admin_pass as string
  }
  const result = await Admin.create(admin)
  return result
}

export const AdminService = {
  createAdmin,
}
