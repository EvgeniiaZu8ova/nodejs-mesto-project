import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import urlValidator from '../utils/urlValidator';
import NotAuthError from '../errors/not-auth-err';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<mongoose.Document<unknown, any, IUser>>;
}

const userSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: urlValidator,
      message: 'Необходимо указать ссылку',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static(
  'findUserByCredentials',
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select('+password')
      .orFail(new NotAuthError('Необходима авторизация'))
      .then((user) => bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new NotAuthError('Необходима авторизация'));
        }

        return user;
      }));
  },
);

export default mongoose.model<IUser, UserModel>('user', userSchema);
