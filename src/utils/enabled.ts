import xss from "xss";
import prisma from "../../prisma/prisma";

enum enabledEnum {
  one = "one",
  two = "two",
  three = "three",
  four = "four",
}
const enabled = async (id: string, name: string): Promise<enabledEnum> => {
  name = xss(name);
  const user = await prisma.telegramUser.findFirst({
    where: {
      telegramId: id,
    },
    include: {
      user: true,
    },
  });

  if (user) {
    if (!user.isActive) {
      return enabledEnum.three;
    }
    if (user.role === "USER") {
      if (!user.user?.phone) {
        return enabledEnum.four;
      }
      return enabledEnum.one;
    } else if (user.role === "ADMIN") {
      return enabledEnum.two;
    }

    return enabledEnum.one;
  } else {
    let user = await prisma.telegramUser.create({
      data: {
        telegramId: id,
        firstName: name,
      },
    });

    return enabledEnum.one;
  }
};

export default enabled;
