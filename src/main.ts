require("dotenv").config();
import { Context, Middleware } from "telegraf";
import { SceneContext } from "telegraf/typings/scenes";
import prisma from "../prisma/prisma";
import bot from "./core/bot";
import session from "./core/session";
import stage from "./scenes/index";
import randomNumber from "./services/generateCode";
import botStart from "./utils/startBot";

bot.use(session);

const middleware: Middleware<Context | SceneContext> = (ctx: any, next) => {
  ctx?.session ?? (ctx.session = {});
};

bot.use(stage.middleware());

bot.use((ctx: any, next) => {
  console.log("next", ctx?.session);
  return next();
});

bot.start(async (ctx: any) => {
  return await ctx.scene.enter("start");
});

bot.hears(
  ["Yangi Taqdimot", "Balans", "Do'stlarimni taklif qilish", "Bosh menyu"], //  commandlar bot o'chib qolgan vaziyatda user qayta startni  bosganda javob berish uchun
  async (ctx: any) => {
    ctx.reply("Nomalum buyruq.Qayta /start buyrug'ini bosing");
  }
);

bot.hears("/login", async (ctx: any) => {
  console.log(ctx.update);
  const user_id = String(ctx.from?.id);
  const telegramUser = await prisma.telegramUser.findFirst({
    where: {
      telegramId: user_id,
    },
  });

  if (!telegramUser) {
    ctx.reply("Siz avvaldan ro'yxatdan o'tishingiz kerak");
    return;
  }

  const generateCode = randomNumber();

  let createTest = await prisma.code.findFirst({
    where: {
      userId: telegramUser?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (createTest) {
    if (createTest.createdAt.getTime() + 90000 > new Date().getTime()) {
      ctx.reply("Siz avval yuborgan kodingizni active kuting");
      return;
    } else {
      createTest = await prisma.code.create({
        data: {
          code: generateCode,
          userId: telegramUser?.id,
        },
      });

      ctx.reply(`Sizning kodingiz: ${generateCode}`);
    }
  } else {
    createTest = await prisma.code.create({
      data: {
        code: generateCode,
        userId: telegramUser?.id,
      },
    });

    ctx.reply(`Sizning kodingiz: ${generateCode}`);
  }
});

bot.catch(async (err: any, ctx) => {
  const userId = ctx?.from?.id;
  if (userId) {
    await bot.telegram.sendMessage(
      userId,
      "Xatolik yuz berdi. Iltimos qayta urinib ko'ring\n /start buyrug'ini bosib qayta urunib ko'ring"
    );
  }

  console.log(err);
  console.log(`Ooops, encountered an error for ${ctx}`, err);
});
botStart(bot);

process.on("uncaughtException", (error) => {
  console.log("Ushlanmagan istisno:", error, "Sabab:", new Date());
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Ushlanmagan rad etilgan va'da:", promise, "Sabab:", new Date());
});
