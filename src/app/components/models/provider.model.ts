import { StatusEnum } from "../enums/status.enum"

export class Provider {
  id: number = 0
  description: string = ''
  address: string = ''
  email: string = ''
  phone: string = ''
  status: StatusEnum = StatusEnum.ACTIVE
  registerDate: Date = new Date()
  registerUser: string = ''
  updateDate: Date = new Date()
  updateUser: string = ''
}
