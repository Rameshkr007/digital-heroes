import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validators/auth.validators';

export async function registerUser(input: RegisterInput) {
  const existingEmail = await prisma.user.findUnique({ where: { email: input.email } });
  if (existingEmail) throw new Error('Email already registered');

  const existingUsername = await prisma.user.findUnique({ where: { username: input.username } });
  if (existingUsername) throw new Error('Username already taken');

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      username: input.username,
      passwordHash,
      profile: {
        create: {
          displayName: input.displayName,
          title: 'Rising Hero',
          xp: 0,
          level: 1,
        },
      },
    },
    include: { profile: true },
  });

  const token = signToken({
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  });

  return { token, user: { id: user.id, email: user.email, username: user.username, role: user.role, profile: user.profile } };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { profile: true },
  });
  if (!user) throw new Error('Invalid email or password');

  const isValid = await comparePassword(input.password, user.passwordHash);
  if (!isValid) throw new Error('Invalid email or password');

  const token = signToken({
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  });

  return { token, user: { id: user.id, email: user.email, username: user.username, role: user.role, profile: user.profile } };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          skills: { include: { skill: true } },
          achievements: true,
          badges: { include: { badge: true } },
        },
      },
    },
  });
  if (!user) throw new Error('User not found');
  const { passwordHash, ...safeUser } = user;
  void passwordHash;
  return safeUser;
}
