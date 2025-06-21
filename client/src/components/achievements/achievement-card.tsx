import { motion } from "framer-motion";

interface AchievementCardProps {
  name: string;
  description: string;
  icon: string;
  bonusPoints: number;
  colorScheme?: string;
}

export default function AchievementCard({
  name,
  description,
  icon,
  bonusPoints,
  colorScheme = "primary"
}: AchievementCardProps) {
  // Determine background color based on colorScheme
  const getBgColor = () => {
    switch (colorScheme) {
      case "primary":
        return "bg-primary-50 text-primary-500";
      case "secondary":
        return "bg-secondary-50 text-secondary-500";
      case "accent":
        return "bg-accent-50 text-accent-500";
      default:
        return "bg-neutral-50 text-neutral-500";
    }
  };

  // Determine badge color based on colorScheme
  const getBadgeColor = () => {
    switch (colorScheme) {
      case "primary":
        return "bg-primary-50 text-primary-700";
      case "secondary":
        return "bg-secondary-50 text-secondary-700";
      case "accent":
        return "bg-accent-50 text-accent-700";
      default:
        return "bg-neutral-50 text-neutral-700";
    }
  };

  return (
    <motion.div
      className="dashboard-card flex-shrink-0 w-60 bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-3 ${getBgColor()}`}>
        <i className={`fas ${icon} text-2xl`}></i>
      </div>
      <h3 className="text-center font-medium mb-1">{name}</h3>
      <p className="text-xs text-neutral-500 text-center mb-2">{description}</p>
      <div className="text-center">
        <span className={`text-xs ${getBadgeColor()} px-2 py-1 rounded-full`}>
          +{bonusPoints} bonus points
        </span>
      </div>
    </motion.div>
  );
}
