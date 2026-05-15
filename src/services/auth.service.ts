import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { AuthPayload } from '../types';

export const registerService = async (name: string, email: string, passwordStr: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(passwordStr, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  const payload: AuthPayload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1d',
  });

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
};

export const loginService = async (email: string, passwordStr: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(passwordStr, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const payload: AuthPayload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1d',
  });

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
};
