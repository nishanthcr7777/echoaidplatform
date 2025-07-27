import { useState } from "react";
import { 
  ExclamationTriangleIcon,
  HeartIcon,
  HomeIcon,
  DocumentIcon,
  ShieldExclamationIcon
} from "@heroicons/react/24/outline";

interface EmergencyScenario {
  id: string;
  title: string;
  icon: any;
  color: string;
  scenarios: string[];
}

interface EmergencyScenariosProps {
  onScenarioSelect: (scenario: string) => void;
}

export default function EmergencyScenarios({ onScenarioSelect }: EmergencyScenariosProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const emergencyTypes: EmergencyScenario[] = [
    {
      id: "medical",
      title: "Medical Emergency",
      icon: HeartIcon,
      color: "bg-red-600",
      scenarios: [
        "Help! My child has a high fever and won't stop crying. I don't know what to do!",
        "I'm having chest pains and difficulty breathing. Please send help immediately!",
        "My elderly mother fell down the stairs and can't move. She's conscious but in pain.",
        "I'm diabetic and ran out of insulin. I'm feeling very weak and dizzy.",
        "There's been an accident - someone is bleeding heavily and unconscious!"
      ]
    },
    {
      id: "safety",
      title: "Safety Emergency",
      icon: ShieldExclamationIcon,
      color: "bg-orange-600",
      scenarios: [
        "Someone is trying to break into my house! I'm scared and hiding with my children.",
        "I'm being followed by strangers. I don't feel safe walking home alone.",
        "There's violence in our neighborhood. We need somewhere safe to go.",
        "My partner is threatening me. I need help getting out safely.",
        "I witnessed a crime and the perpetrators saw me. I'm afraid for my safety."
      ]
    },
    {
      id: "shelter",
      title: "Shelter Emergency",
      icon: HomeIcon,
      color: "bg-blue-600",
      scenarios: [
        "Our house was destroyed in the flood. We have nowhere to sleep tonight.",
        "We were evicted and have been living on the streets with our children.",
        "The building collapsed and we lost everything. Please help us find shelter.",
        "It's getting very cold and we have no heating. The children are freezing.",
        "We're refugees and need temporary accommodation while we sort our papers."
      ]
    },
    {
      id: "food",
      title: "Food Emergency",
      icon: ExclamationTriangleIcon,
      color: "bg-green-600",
      scenarios: [
        "We haven't eaten in three days. My children are crying from hunger.",
        "I lost my job and can't afford food for my family anymore.",
        "The baby needs formula urgently but I have no money to buy it.",
        "Our food supplies were destroyed in the fire. We have nothing left.",
        "I'm pregnant and haven't had a proper meal in days. I'm feeling very weak."
      ]
    },
    {
      id: "documents",
      title: "Document Emergency",
      icon: DocumentIcon,
      color: "bg-yellow-600",
      scenarios: [
        "All our identity documents were stolen. We can't access any services now.",
        "My papers were destroyed in the flood. I need help getting new ones urgently.",
        "I'm undocumented and afraid to seek help. But my child needs medical care.",
        "Lost my passport and visa. I'm afraid I'll be deported without proper papers.",
        "Need help with legal documents to escape an abusive situation."
      ]
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Practice Emergency Scenarios</h3>
      <p className="text-gray-400 text-sm mb-6">
        Select a scenario to practice how the AI responds to different emergency situations
      </p>

      {!selectedCategory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedCategory(type.id)}
                className={`${type.color} hover:opacity-90 transition-opacity rounded-lg p-4 text-white text-left`}
              >
                <Icon className="w-8 h-8 mb-2" />
                <h4 className="font-semibold">{type.title}</h4>
                <p className="text-sm opacity-90 mt-1">
                  {type.scenarios.length} scenarios
                </p>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">
              {emergencyTypes.find(t => t.id === selectedCategory)?.title} Scenarios
            </h4>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              ← Back to categories
            </button>
          </div>
          
          <div className="space-y-3">
            {emergencyTypes
              .find(t => t.id === selectedCategory)
              ?.scenarios.map((scenario, index) => (
                <button
                  key={index}
                  onClick={() => onScenarioSelect(scenario)}
                  className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <p className="text-white text-sm">{scenario}</p>
                  <p className="text-gray-400 text-xs mt-2">Click to use this scenario</p>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
