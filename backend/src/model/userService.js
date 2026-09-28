export async function createUser(userRepository, userData) {
  const existingUser = await userRepository.findOneBy({ email: userData.email });

  if (existingUser) {
    return {
      error: "usuário já cadastrado, faça Login!",
    };
  }

  const user = await userRepository.create(userData);
  return userRepository.save(user);
}

export async function updateUser(userRepository, userId, userData) {
  const user = await userRepository.findOneBy({ id: userId });

  if (!user) {
    return { error: "usuário não encontrado!" };
  }

  userRepository.merge(user, {
    userName: userData.userName,
    email: userData.email,
  });

  await userRepository.save(user);
  return { message: "usuario atualizado!" };
}

export async function deleteUser(userRepository, userId, password) {
  const user = await userRepository.findOneBy({ id: userId });

  if (!user) {
    return { error: "usuário não encontrado!" };
  }

  if (user.password !== password) {
    return { error: "senha incorreta, tente novamente!" };
  }

  await userRepository.delete(user.id);
  return { message: "usuario deletado!" };
}