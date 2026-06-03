import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/db';
import { AuthPayload } from '../types';
import { sendPasswordResetEmail } from './email.service';

export const registerService = async (name: string, email: string, passwordStr: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(passwordStr, salt);

  const user = await prisma.user.create({
    data: { name, email, password, role: 'USER' },
  });

  const payload: AuthPayload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1d',
  });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
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
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

export const forgotPasswordService = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });

  await sendPasswordResetEmail(user.email, resetToken, user.name);
};

export const resetPasswordService = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error('Token invalido o expirado');
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: { password, resetToken: null, resetTokenExpiry: null },
  });
};
