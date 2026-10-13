import React from 'react';
import { AlertTriangle, Umbrella, SunMedium, Wind, ShieldAlert } from 'lucide-react';

export default function WeatherAlerts({ weather, language }) {
  if (!weather || !weather.current) return null;

  const current = weather.current;
  const daily = weather.daily;

  const rainChanceToday = daily?.precipitation_probability_max?.[0] || 0;
  const maxTemp = daily?.temperature_2m_max?.[0] || current.temperature_2m;
  const minTemp = daily?.temperature_2m_min?.[0] || current.temperature_2m;
  const windSpeed = current.wind_speed_10m || 0;
  const uvIndex = current.uv_index || 0;

  const alerts = [];

  // Rain
  if (rainChanceToday >= 50 || current.precipitation > 0) {
    alerts.push({
      id: 'rain',
      icon: Umbrella,
      iconColor: 'text-sky-400',
      bgColor: 'bg-sky-500/10 border-sky-400/20 text-sky-200',
      titleEn: 'Rain Expected Today',
      titleUr: 'آج بارش کا امکان',
      descEn: `There is a ${rainChanceToday}% chance of rain. Remember to bring an umbrella!`,
      descUr: `آج بارش کے ${rainChanceToday}% امکانات ہیں۔ باہر نکلتے وقت چھتری ساتھ رکھنا نہ بھولیں۔`,
    });
  }

  // High Heat
  if (maxTemp >= 38) {
    alerts.push({
      id: 'heat',
      icon: SunMedium,
      iconColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-400/20 text-rose-200',
      titleEn: 'Heat Advisory',
      titleUr: 'شدید گرمی کا الرٹ',
      descEn: 'High temperatures forecast today. Stay hydrated and avoid direct sun during midday hours.',
      descUr: 'آج شدید گرمی متوقع ہے۔ پانی کا زیادہ استعمال کریں اور دوپہر کے وقت بلا ضرورت دھوپ سے بچیں۔',
    });
  } else if (minTemp <= 4) {
    alerts.push({
      id: 'cold',
      icon: ShieldAlert,
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-400/20 text-cyan-200',
      titleEn: 'Cold Weather Alert',
      titleUr: 'سردی کا الرٹ',
      descEn: 'Low temperatures today. Dress in warm thermal layers.',
      descUr: 'سرد ترین موسم ہے۔ گرم لباس اور جیکٹ کا استعمال لازمی کیجئے۔',
    });
  }

  // Strong Wind
  if (windSpeed >= 35) {
    alerts.push({
      id: 'wind',
      icon: Wind,
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-400/20 text-amber-200',
      titleEn: 'Breezy & Gusty Winds',
      titleUr: 'تیز ہواؤں کی وارننگ',
      descEn: `Gusts up to ${Math.round(windSpeed)} km/h. Secure loose outdoor objects.`,
      descUr: `ہوا کی رفتار ${Math.round(windSpeed)} کلومیٹر فی گھنٹہ تک پہنچ سکتی ہے۔ احتیاط برتیں۔`,
    });
  }

  // High UV
  if (uvIndex >= 8) {
    alerts.push({
      id: 'uv',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-400/20 text-amber-200',
      titleEn: 'Very High UV Radiation',
      titleUr: 'انتہائی تیز الٹرا وائلٹ شعاعیں',
      descEn: 'UV index is extreme. Wear sunscreen SPF 30+ and UV-blocking eyewear.',
      descUr: 'دھوپ کی شعاعیں شدید ہیں۔ سن اسکرین اور دھوپ کا چشمہ استعمال کریں۔',
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="w-full space-y-2.5 my-4">
      {alerts.map((alert) => {
        const IconComponent = alert.icon;
        return (
          <div
            key={alert.id}
            className={`flex items-start gap-3 p-3.5 rounded-2xl border ${alert.bgColor} backdrop-blur-md transition-all`}
          >
            <div className={`p-1.5 rounded-xl bg-white/10 ${alert.iconColor} shrink-0`}>
              <IconComponent size={18} />
            </div>
            <div className="text-xs sm:text-sm">
              <strong className="font-semibold block text-white">
                {language === 'ur' ? alert.titleUr : alert.titleEn}
              </strong>
              <p className="opacity-90 mt-0.5">
                {language === 'ur' ? alert.descUr : alert.descEn}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
