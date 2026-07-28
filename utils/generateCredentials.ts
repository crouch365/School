import { User } from "../models/index.ts";

const TRANSLIT_MAP: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ы: "y",
  э: "e",
  ю: "yu",
  я: "ya",
};

const transliterate = (str: string): string =>
  str
    .toLowerCase()
    .split("")
    .map((char) => TRANSLIT_MAP[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]/g, "");

export const generatePassword = (length = 10): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
};

const MAX_ATTEMPTS = 20;

// Пробуем "имя.фамилия@school.local", при коллизии добавляем числовой суффикс
// и каждый раз реально проверяем базу — просто random(1000) на 5000+ учеников
// довольно быстро начинает конфликтовать.
export const generateUniqueEmail = async (
  name: string,
  lastName: string,
): Promise<string> => {
  const first = transliterate(name);
  const last = transliterate(lastName);
  const base = `${first}.${last}`;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate =
      attempt === 0 ? `${base}@school.local` : `${base}${attempt}@school.local`;

    const exists = await User.findOne({ where: { email: candidate } });
    if (!exists) return candidate;
  }

  throw new Error(
    `Не удалось сгенерировать уникальный email для ${name} ${lastName}`,
  );
};
