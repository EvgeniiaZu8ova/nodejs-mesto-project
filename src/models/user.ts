import mongoose from 'mongoose';
import urlValidator from '../utils/urlValidator';

interface IUser {
  name: string;
  about: string;
  avatar: string
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: urlValidator,
      message: 'Необходимо указать ссылку',
    },
  },
});

export default mongoose.model('user', userSchema);
