import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument, User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  public async create(dto: CreateUserDto) {
    const user = await this.userModel.create({
      ...dto,
      id: nanoid(),
      created_at: new Date(),
      is_premium: false,
    });

    return user.save({ validateBeforeSave: true, checkKeys: true });
  }

  public async getUser(id: string) {
    return await this.userModel.findOne({ id }).exec();
  }

  public async getUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  // public async findOneByTelegramIdAndUpdateOnlineTime(telegram_id: string) {
  //   const user = await this.userModel.findOne({ telegram_id });

  //   return user.updateOne({ last_online_at: new Date() }, { new: true }).exec();
  // }
}
