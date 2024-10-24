import { Scenes } from "telegraf";
import xss from "xss";
import enabled from "../utils/enabled";
import { keyboards } from "../utils/keyboards";
const scene = new Scenes.BaseScene("start");

export let keyboard = [];
export let admin_keyboard = [["Admin"]];

scene.enter(async (ctx: any) => {
  const user_id = ctx.from?.id;

  const user_name = ctx.from?.username || ctx.from?.first_name;

  const enable = await enabled(String(user_id), String(user_name));

  if (enable === "one") {
    ctx.telegram.sendMessage(
      user_id,
      `🇺🇿
Salom ${xss(user_name)} 👋
@magi_slides'ning rasmiy botiga xush kelibsiz

⬇ Kontaktingizni yuboring (tugmani bosib)

🇺🇸
Hi ${xss(user_name)} 👋
Welcome to @magi_slides's official bot

⬇ Send your contact (by clicking button)`,
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: "📞 Contact",
                request_contact: true,
              },
            ],
          ],
          resize_keyboard: true,
        },
      }
    );

    console.log("start scene");
    return await ctx.scene.enter("control");
  } else if (enable === "two") {
    const text = "Assalomu alaykum Admin xush kelibsiz";

    ctx.telegram.sendMessage(user_id, text, keyboards(admin_keyboard));
    return await ctx.scene.enter("admin");
  } else if (enable === "three") {
    ctx.telegram.sendMessage(
      user_id,
      "Assalomu alaykum.Kechirasiz siz admin tomonidan bloklangansiz"
    );
    return;
  } else if (enable === "four") {
    ctx.telegram.sendMessage(
      user_id,
      `Assalomu alaykum /login buyrug'idan foydalanib kirish kodingizni oling`
    );

    return await ctx.scene.enter("control");
  }
});

export default scene;
