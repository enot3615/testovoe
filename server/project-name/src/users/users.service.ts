/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    const res = await createdUser.save();
    console.log('New user: ', JSON.stringify(res));

    return res;
  }

  async findAll(query: {
    page: number;
    limit: number;
    option?: 'email' | 'phone' | 'name';
    filter?: string;
  }) {
    const skip = (query.page - 1) * query.limit;

    const filter: any = {};
    if (query.filter && query.option) {
      filter[query.option] = { $regex: query.filter, $options: 'i' };
    }

    const users = await this.userModel
      .find(filter)
      .skip(skip)
      .limit(Number(query.limit))
      .exec();
    const total = await this.userModel.countDocuments(filter);

    console.log('findAll: ', total, users);
    return {
      data: users,
      info: {
        total,
        page: Number(query.page),
        last_page: Math.ceil(total / query.limit),
      },
    };
  }

  findOne(id: string): Promise<User | null> {
    console.log('find: ', id);
    return this.userModel.findById(id).exec();
  }

  async seedUsers(count: number = 2000000) {
    const startTime = Date.now();

    const BATCH_SIZE = 10000;
    let batch: CreateUserDto[] = [];

    for (let i = 0; i < count; i++) {
      const user = {
        name: `User_${i}`,
        email: `user_${i}_${Date.now()}@test.com`,
        phone: `+380${Math.floor(100000000 + Math.random() * 900000000)}`,
      };

      batch.push(user);

      if (batch.length === BATCH_SIZE || i === count - 1) {
        try {
          await this.userModel.insertMany(batch, { ordered: false });
          batch = [];

          if ((i + 1) % 100000 === 0) {
            console.log(`Вставлено ${i + 1} користувачів`);
          }
        } catch (error) {
          console.error(`Помилка: ${error.message}`);
        }
      }
    }

    const duration = (Date.now() - startTime) / 1000;
    console.log(`Створено ${count} користувачів за ${duration} секунд.`);
    return { status: 'Success', count, duration: `${duration}s` };
  }
}
