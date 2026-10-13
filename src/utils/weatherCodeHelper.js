/**
 * Maps WMO Weather Interpretation Codes (WW)
 * https://open-meteo.com/en/docs
 */

export const getWeatherDetails = (code, isDay = 1) => {
  const day = Boolean(isDay);

  switch (code) {
    case 0:
      return {
        labelEn: day ? "Clear Sky" : "Clear Night",
        labelUr: day ? "صاف آسمان اور دھوپ" : "صاف تاروں بھری رات",
        icon: day ? "Sun" : "Moon",
        iconColor: day ? "text-amber-400" : "text-indigo-300",
        bgGradient: day
          ? "from-amber-600/30 via-sky-600/20 to-blue-950/80"
          : "from-indigo-950 via-slate-900 to-black",
        bgOverlay: day
          ? "radial-gradient(ellipse at top, rgba(251, 191, 36, 0.25) 0%, rgba(14, 165, 233, 0.1) 60%, rgba(15, 23, 42, 0.95) 100%)"
          : "radial-gradient(ellipse at top, rgba(99, 102, 241, 0.2) 0%, rgba(30, 27, 75, 0.4) 50%, rgba(2, 6, 23, 0.95) 100%)",
        accent: day ? "#f59e0b" : "#818cf8",
        tipEn: day ? "Great sunny weather! Don't forget your sunglasses." : "Peaceful clear night with good visibility.",
        tipUr: day ? "بہترین خوشگوار موسم! دھوپ کے چشمے کا استعمال مفید رہے گا۔" : "صاف اور پرسکون رات، حدِ نگاہ بہترین ہے۔",
      };

    case 1:
      return {
        labelEn: day ? "Mainly Clear" : "Mostly Clear Night",
        labelUr: day ? "زیادہ تر مطلع صاف" : "مطلع صاف، ہلکے بادل",
        icon: day ? "SunMedium" : "MoonStar",
        iconColor: day ? "text-amber-300" : "text-blue-300",
        bgGradient: day
          ? "from-sky-500/25 via-blue-700/20 to-slate-950/80"
          : "from-slate-900 via-indigo-950 to-black",
        bgOverlay: "radial-gradient(ellipse at top, rgba(56, 189, 248, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)",
        accent: "#38bdf8",
        tipEn: "Pleasant outdoor weather with light occasional clouds.",
        tipUr: "خوشگوار موسم، ہلکے پھلکے بادلوں کی موجودگی۔",
      };

    case 2:
      return {
        labelEn: "Partly Cloudy",
        labelUr: "جزوی طور پر ابر آلود",
        icon: day ? "CloudSun" : "CloudMoon",
        iconColor: day ? "text-amber-200" : "text-slate-300",
        bgGradient: "from-blue-700/25 via-slate-800/30 to-slate-950/85",
        bgOverlay: "radial-gradient(ellipse at top, rgba(96, 165, 250, 0.2) 0%, rgba(30, 41, 59, 0.7) 60%, rgba(15, 23, 42, 0.95) 100%)",
        accent: "#60a5fa",
        tipEn: "Comfortable balance of sun and soothing cloud cover.",
        tipUr: "دھوپ اور بادلوں کا دلکش امتزاج، گھومنے کیلئے بہترین۔",
      };

    case 3:
      return {
        labelEn: "Overcast",
        labelUr: "مکمل ابر آلود",
        icon: "Cloud",
        iconColor: "text-slate-300",
        bgGradient: "from-slate-600/30 via-slate-800/40 to-slate-950/90",
        bgOverlay: "radial-gradient(ellipse at top, rgba(148, 163, 184, 0.2) 0%, rgba(30, 41, 59, 0.8) 60%, rgba(15, 23, 42, 0.95) 100%)",
        accent: "#94a3b8",
        tipEn: "Heavy blanket of clouds overhead. Mild conditions.",
        tipUr: "آسمان پر گھنے بادل چھائے ہوئے ہیں۔ ہوا میں خنکی ہو سکتی ہے۔",
      };

    case 45:
    case 48:
      return {
        labelEn: "Foggy / Mist",
        labelUr: "دھند اور کہر",
        icon: "CloudFog",
        iconColor: "text-zinc-300",
        bgGradient: "from-zinc-600/30 via-slate-800/40 to-zinc-950/90",
        bgOverlay: "radial-gradient(ellipse at top, rgba(161, 161, 170, 0.25) 0%, rgba(24, 24, 27, 0.9) 100%)",
        accent: "#a1a1aa",
        tipEn: "Reduced visibility. Drive with caution and headlights on.",
        tipUr: "دھند کے باعث حدِ نگاہ کم ہے۔ گاڑی چلاتے وقت احتیاط برتیں۔",
      };

    case 51:
    case 53:
    case 55:
      return {
        labelEn: "Light Drizzle",
        labelUr: "ہلکی بونداباندی",
        icon: "CloudDrizzle",
        iconColor: "text-cyan-300",
        bgGradient: "from-cyan-800/30 via-slate-800/40 to-slate-950/90",
        bgOverlay: "radial-gradient(ellipse at top, rgba(34, 211, 238, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)",
        accent: "#22d3ee",
        tipEn: "Gentle drizzle. Keep a light raincoat or umbrella handy.",
        tipUr: "ہلکی پھلکی رم جھم۔ چھتری ساتھ رکھنا فائدہ مند رہے گا۔",
      };

    case 56:
    case 57:
      return {
        labelEn: "Freezing Drizzle",
        labelUr: "برفیلی بونداباندی",
        icon: "CloudSnow",
        iconColor: "text-cyan-200",
        bgGradient: "from-cyan-900/40 via-slate-900/50 to-slate-950/90",
        bgOverlay: "radial-gradient(ellipse at top, rgba(103, 232, 249, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)",
        accent: "#67e8f9",
        tipEn: "Very chilly! Watch out for slippery surfaces.",
        tipUr: "انتہائی سرد موسم اور پھسلن کا اندیشہ۔ احتیاط کیجئے۔",
      };

    case 61:
      return {
        labelEn: "Slight Rain",
        labelUr: "ہلکی بارش",
        icon: "CloudRain",
        iconColor: "text-blue-300",
        bgGradient: "from-blue-800/35 via-slate-800/40 to-slate-950/90",
        bgOverlay: "radial-gradient(ellipse at top, rgba(96, 165, 250, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)",
        accent: "#60a5fa",
        tipEn: "Light rain showers expected. Umbrella recommended.",
        tipUr: "ہلکی بارش ہو رہی ہے۔ چھتری ساتھ رکھیں۔",
      };

    case 63:
    case 65:
      return {
        labelEn: code === 63 ? "Moderate Rain" : "Heavy Rain",
        labelUr: code === 63 ? "معتدل بارش" : "تیز موسلادھار بارش",
        icon: "CloudRainWind",
        iconColor: "text-blue-400",
        bgGradient: "from-blue-900/40 via-indigo-950/50 to-slate-950/95",
        bgOverlay: "radial-gradient(ellipse at top, rgba(59, 130, 246, 0.25) 0%, rgba(15, 23, 42, 0.98) 100%)",
        accent: "#3b82f6",
        tipEn: "Continuous rain. Expect wet roads and carry full rain gear.",
        tipUr: "تیز بارش کا امکان۔ سڑکیں گیلی ہو سکتی ہیں، احتیاط فرمائیں۔",
      };

    case 66:
    case 67:
      return {
        labelEn: "Freezing Rain",
        labelUr: "برف باری والی بارش",
        icon: "CloudSnow",
        iconColor: "text-sky-200",
        bgGradient: "from-sky-900/40 via-slate-900/50 to-slate-950/95",
        bgOverlay: "radial-gradient(ellipse at top, rgba(125, 211, 252, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)",
        accent: "#38bdf8",
        tipEn: "Icy rain creating hazardous conditions.",
        tipUr: "برفیلی بارش، سڑکوں پر پھسلن کا خطرہ ہے۔",
      };

    case 71:
    case 73:
    case 75:
      return {
        labelEn: code === 71 ? "Light Snow" : code === 73 ? "Moderate Snow" : "Heavy Snow",
        labelUr: code === 71 ? "ہلکی برف باری" : "شدید برف باری",
        icon: "Snowflake",
        iconColor: "text-cyan-200",
        bgGradient: "from-sky-900/35 via-slate-800/45 to-slate-950/95",
        bgOverlay: "radial-gradient(ellipse at top, rgba(186, 230, 253, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)",
        accent: "#7dd3fc",
        tipEn: "Snowfall in progress! Dress in warm layers.",
        tipUr: "برف باری ہو رہی ہے! گرم کپڑے اور جیکٹ زیب تن فرمائیں۔",
      };

    case 77:
      return {
        labelEn: "Snow Grains",
        labelUr: "برف کے دانے",
        icon: "Snowflake",
        iconColor: "text-sky-200",
        bgGradient: "from-cyan-950/40 via-slate-900/50 to-slate-950/90",
        bgOverlay: "radial-gradient(ellipse at top, rgba(186, 230, 253, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)",
        accent: "#7dd3fc",
        tipEn: "Crisp cold conditions with light snow grains.",
        tipUr: "سرد موسم اور برف کے ننھے دانوں کی بوچھاڑ۔",
      };

    case 80:
    case 81:
    case 82:
      return {
        labelEn: "Rain Showers",
        labelUr: "بارش کی پھوار / بوچھاڑ",
        icon: "CloudRain",
        iconColor: "text-blue-300",
        bgGradient: "from-blue-800/35 via-slate-900/45 to-slate-950/90",
        bgOverlay: "radial-gradient(ellipse at top, rgba(59, 130, 246, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)",
        accent: "#60a5fa",
        tipEn: "Passing rain showers. Might stop and start unexpectedly.",
        tipUr: "بارش کے وقفے وقفے سے جھونکے۔ چھتری پاس رکھیں۔",
      };

    case 85:
    case 86:
      return {
        labelEn: "Snow Showers",
        labelUr: "برف کے جھونکے",
        icon: "CloudSnow",
        iconColor: "text-cyan-200",
        bgGradient: "from-sky-900/40 via-slate-900/50 to-slate-950/95",
        bgOverlay: "radial-gradient(ellipse at top, rgba(186, 230, 253, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)",
        accent: "#38bdf8",
        tipEn: "Passing snow squalls. Dress warmly.",
        tipUr: "برف کے جھونکے، گرم لباس کا استعمال ضروری ہے۔",
      };

    case 95:
      return {
        labelEn: "Thunderstorm",
        labelUr: "گرج چمک اور طوفان",
        icon: "CloudLightning",
        iconColor: "text-amber-400",
        bgGradient: "from-purple-950/50 via-slate-900/60 to-black",
        bgOverlay: "radial-gradient(ellipse at top, rgba(168, 85, 247, 0.25) 0%, rgba(30, 27, 75, 0.6) 50%, rgba(2, 6, 23, 0.98) 100%)",
        accent: "#a855f7",
        tipEn: "Thunderstorm active! Seek safe indoor shelter.",
        tipUr: "آسمانی بجلی اور گرج چمک! محفوظ عمارت کے اندر رہیں۔",
      };

    case 96:
    case 99:
      return {
        labelEn: "Severe Thunderstorm & Hail",
        labelUr: "شدید طوفان اور اولے",
        icon: "CloudHail",
        iconColor: "text-yellow-400",
        bgGradient: "from-red-950/30 via-purple-950/50 to-black",
        bgOverlay: "radial-gradient(ellipse at top, rgba(239, 68, 68, 0.2) 0%, rgba(126, 34, 206, 0.4) 50%, rgba(2, 6, 23, 0.98) 100%)",
        accent: "#f87171",
        tipEn: "Severe hail and lightning storm. Avoid open areas.",
        tipUr: "شدید ژالہ باری (اولے) اور طوفان! کھلے میدانوں میں مت جائیں۔",
      };

    default:
      return {
        labelEn: "Clear",
        labelUr: "صاف مطلع",
        icon: day ? "Sun" : "Moon",
        iconColor: "text-amber-400",
        bgGradient: "from-blue-700/25 via-slate-800/30 to-slate-950/85",
        bgOverlay: "radial-gradient(ellipse at top, rgba(56, 189, 248, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)",
        accent: "#38bdf8",
        tipEn: "Moderate weather conditions.",
        tipUr: "معتدل موسمی صورتحال۔",
      };
  }
};
