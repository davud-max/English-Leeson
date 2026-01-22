// SVG Icon Generator for Educational Concepts
// Generates scalable vector graphics for lesson concepts

const EDUCATIONAL_ICONS = {
  // Core Concepts
  observation: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#3B82F6" opacity="0.2"/>
      <circle cx="50" cy="50" r="35" fill="#3B82F6" opacity="0.4"/>
      <circle cx="50" cy="50" r="25" fill="#3B82F6" opacity="0.6"/>
      <circle cx="50" cy="50" r="15" fill="#3B82F6"/>
      <text x="50" y="55" text-anchor="middle" font-family="Arial" font-size="20" fill="white">👁️</text>
    </svg>
  `,
  
  counting: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="80" height="60" rx="10" fill="#F59E0B" opacity="0.3"/>
      <circle cx="30" cy="45" r="8" fill="#F59E0B"/>
      <circle cx="50" cy="45" r="8" fill="#F59E0B"/>
      <circle cx="70" cy="45" r="8" fill="#F59E0B"/>
      <text x="50" y="75" text-anchor="middle" font-family="Arial" font-size="16" fill="#F59E0B" font-weight="bold">1 2 3</text>
    </svg>
  `,
  
  abstraction: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="60" height="60" rx="15" fill="url(#grad1)" opacity="0.7"/>
      <text x="50" y="55" text-anchor="middle" font-family="Arial" font-size="24" fill="white">🧠</text>
    </svg>
  `,
  
  paradox: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#EF4444" opacity="0.3"/>
      <path d="M30,30 Q50,20 70,30 Q80,50 70,70 Q50,80 30,70 Q20,50 30,30" fill="#EF4444" opacity="0.5"/>
      <text x="50" y="55" text-anchor="middle" font-family="Arial" font-size="20" fill="#EF4444">🤯</text>
    </svg>
  `,
  
  learning: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,40 L50,20 L80,40 L80,80 L20,80 Z" fill="#10B981" opacity="0.4"/>
      <text x="50" y="60" text-anchor="middle" font-family="Arial" font-size="20" fill="#10B981">📚</text>
      <text x="50" y="85" text-anchor="middle" font-family="Arial" font-size="12" fill="#10B981">LEARN</text>
    </svg>
  `,

  // Mathematical Concepts
  point: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="3" fill="#000000"/>
      <circle cx="50" cy="50" r="15" fill="none" stroke="#6B7280" stroke-width="1" stroke-dasharray="3,3"/>
      <text x="50" y="80" text-anchor="middle" font-family="Arial" font-size="14" fill="#6B7280">POINT</text>
    </svg>
  `,
  
  line: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="50" x2="90" y2="50" stroke="#000000" stroke-width="3"/>
      <circle cx="30" cy="50" r="4" fill="#3B82F6"/>
      <circle cx="50" cy="50" r="4" fill="#3B82F6"/>
      <circle cx="70" cy="50" r="4" fill="#3B82F6"/>
      <text x="50" y="80" text-anchor="middle" font-family="Arial" font-size="14" fill="#6B7280">LINE</text>
    </svg>
  `,
  
  plane: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="60" height="40" fill="#8B5CF6" opacity="0.3"/>
      <line x1="20" y1="30" x2="80" y2="30" stroke="#8B5CF6" stroke-width="1"/>
      <line x1="20" y1="70" x2="80" y2="70" stroke="#8B5CF6" stroke-width="1"/>
      <line x1="20" y1="30" x2="20" y2="70" stroke="#8B5CF6" stroke-width="1"/>
      <line x1="80" y1="30" x2="80" y2="70" stroke="#8B5CF6" stroke-width="1"/>
      <text x="50" y="85" text-anchor="middle" font-family="Arial" font-size="14" fill="#8B5CF6">PLANE</text>
    </svg>
  `,
  
  space: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="25" width="50" height="50" fill="#EC4899" opacity="0.2"/>
      <rect x="30" y="30" width="40" height="40" fill="#EC4899" opacity="0.3"/>
      <rect x="35" y="35" width="30" height="30" fill="#EC4899" opacity="0.4"/>
      <text x="50" y="55" text-anchor="middle" font-family="Arial" font-size="16" fill="#EC4899">🧊</text>
      <text x="50" y="85" text-anchor="middle" font-family="Arial" font-size="14" fill="#EC4899">SPACE</text>
    </svg>
  `,

  // Interactive Elements
  pencil: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="30,70 70,70 65,30 35,30" fill="#F59E0B"/>
      <polygon points="35,30 65,30 60,15 40,15" fill="#D97706"/>
      <polygon points="40,15 60,15 55,5 45,5" fill="#B45309"/>
      <text x="50" y="85" text-anchor="middle" font-family="Arial" font-size="12" fill="#92400E">PENCIL</text>
    </svg>
  `,
  
  finger: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="20" width="20" height="60" rx="10" fill="#FDE68A"/>
      <circle cx="35" cy="25" r="8" fill="#FDE68A"/>
      <circle cx="45" cy="25" r="8" fill="#FDE68A"/>
      <circle cx="55" cy="25" r="8" fill="#FDE68A"/>
      <circle cx="65" cy="25" r="8" fill="#FDE68A"/>
      <text x="50" y="90" text-anchor="middle" font-family="Arial" font-size="12" fill="#CA8A04">FINGER</text>
    </svg>
  `,

  // Status Indicators
  correct: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#10B981" opacity="0.2"/>
      <circle cx="50" cy="50" r="40" fill="#10B981" opacity="0.3"/>
      <path d="M30,50 L45,65 L70,35" fill="none" stroke="#10B981" stroke-width="8" stroke-linecap="round"/>
    </svg>
  `,
  
  incorrect: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#EF4444" opacity="0.2"/>
      <circle cx="50" cy="50" r="40" fill="#EF4444" opacity="0.3"/>
      <line x1="35" y1="35" x2="65" y2="65" stroke="#EF4444" stroke-width="8" stroke-linecap="round"/>
      <line x1="35" y1="65" x2="65" y2="35" stroke="#EF4444" stroke-width="8" stroke-linecap="round"/>
    </svg>
  `,
  
  thinking: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#8B5CF6" opacity="0.2"/>
      <circle cx="50" cy="50" r="40" fill="#8B5CF6" opacity="0.3"/>
      <path d="M35,45 Q40,35 50,40 Q60,45 65,35" fill="none" stroke="#8B5CF6" stroke-width="3"/>
      <circle cx="40" cy="55" r="3" fill="#8B5CF6"/>
      <circle cx="50" cy="60" r="3" fill="#8B5CF6"/>
      <circle cx="60" cy="55" r="3" fill="#8B5CF6"/>
    </svg>
  `
};

// Function to get SVG icon by name
export function getEducationalIcon(iconName) {
  return EDUCATIONAL_ICONS[iconName] || EDUCATIONAL_ICONS.thinking;
}

// Function to generate all icons as React components
export function getAllIconsAsComponents() {
  const components = {};
  
  Object.keys(EDUCATIONAL_ICONS).forEach(key => {
    components[key] = ({ size = 64, className = "" }) => (
      <div 
        className={className}
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: EDUCATIONAL_ICONS[key] }}
      />
    );
  });
  
  return components;
}

// Usage example component
export default function IconDemo() {
  const icons = getAllIconsAsComponents();
  
  return (
    <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Educational SVG Icons Demo</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {Object.entries(icons).map(([name, IconComponent]) => (
          <div key={name} className="bg-white rounded-xl p-4 shadow-lg text-center">
            <IconComponent size={64} />
            <div className="mt-2 text-sm font-medium capitalize text-gray-700">
              {name.replace(/([A-Z])/g, ' $1').trim()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Usage Examples:</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <icons.observation size={48} />
            <span>Concept visualization</span>
          </div>
          <div className="flex items-center gap-4">
            <icons.counting size={48} />
            <span>Interactive demonstrations</span>
          </div>
          <div className="flex items-center gap-4">
            <icons.paradox size={48} />
            <span>Learning paradoxes</span>
          </div>
        </div>
      </div>
    </div>
  );
}