import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("control");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("contact", async (ctx: any) => {
  const user_id = String(ctx.from?.id);
  const contact = ctx.message.contact;
  console.log(contact);

  const telegramUser = await prisma.telegramUser.findFirst({
    where: {
      telegramId: user_id,
    },
    include: {
      user: true,
    },
  });

  let isUser = telegramUser?.user;

  if (isUser) {
    isUser = await prisma.user.update({
      where: {
        id: isUser.id,
      },
      data: {
        phone: contact.phone_number,
      },
    });
  } else {
    isUser = await prisma.user.create({
      data: {
        phone: contact.phone_number,
      },
    });
  }

  await prisma.telegramUser.update({
    where: {
      id: telegramUser?.id,
    },
    data: {
      isActive: true,
      userId: isUser.id,
    },
  });
  ctx.reply("/login buyrug'i bilan code ni olib kirishingi mumkin");
});

scene.hears("Admin", async (ctx) => {
  ctx.reply("Admin");
});
export default scene;
