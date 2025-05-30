import * as Yup from 'yup';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import AuthConfig from '../../config/auth';

class SessionController {
  async store(request, response) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    const isValid = await schema.isValid(request.body);

    const emailOrPasswordIsIncorrect = () => {
      response
        .status(401)
        .json({ error: 'Make sure your email and password are correct.' });
    };

    if (!isValid) {
      return emailOrPasswordIsIncorrect();
    }

    const { email, password } = request.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return emailOrPasswordIsIncorrect();
    }

    const isSamePassword = await user.checkPassword(password);

    if (!isSamePassword) {
      return emailOrPasswordIsIncorrect();
    }

    return response.status(201).json({
      id: user.id,
      name: user.name,
      email,
      admin: user.admin,
      token: jwt.sign({ id: user.id, name: user.name}, AuthConfig.secret, {
        expiresIn: AuthConfig.expiresIn,
      })
    });
  }
}

export default new SessionController();
