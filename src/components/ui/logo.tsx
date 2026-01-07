interface AutoWorldLogoProps {
    className?: string;
    variant?: 'trend2026' | 'pixel' | 'professional' | 'stackoverflow' | 'github' | 'devto';
}

export function Logo({ className = "w-12 h-12", variant = 'professional' }: AutoWorldLogoProps) {
    const colors = {
        trend2026: {
            primary: '#8B5CF6',
            secondary: '#EC4899',
            accent: '#06B6D4',
        },
        pixel: {
            primary: '#FFD700',
            secondary: '#FF6B6B',
            accent: '#4ECDC4',
        },
        professional: {
            primary: '#CEF431',
            secondary: '#014651',
            accent: '#CEF431',
        },
        stackoverflow: {
            primary: '#F48024',
            secondary: '#0077CC',
            accent: '#FFF',
        },
        github: {
            primary: '#238636',
            secondary: '#58a6ff',
            accent: '#8b949e',
        },
        devto: {
            primary: '#6366F1',
            secondary: '#8B5CF6',
            accent: '#EC4899',
        },
    };

    const colorScheme = colors[variant];

    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Outer rotating ring - represents global automation */}
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke={colorScheme.primary}
                strokeWidth="3"
                strokeDasharray="8 4"
                opacity="0.6"
            />

            {/* Inner globe structure */}
            <circle
                cx="50"
                cy="50"
                r="35"
                stroke={colorScheme.primary}
                strokeWidth="2.5"
                fill={colorScheme.secondary}
                opacity="0.1"
            />

            {/* Latitude lines */}
            <ellipse
                cx="50"
                cy="50"
                rx="35"
                ry="12"
                stroke={colorScheme.primary}
                strokeWidth="1.5"
                fill="none"
                opacity="0.7"
            />
            <ellipse
                cx="50"
                cy="50"
                rx="35"
                ry="20"
                stroke={colorScheme.primary}
                strokeWidth="1"
                fill="none"
                opacity="0.5"
            />

            {/* Longitude line */}
            <ellipse
                cx="50"
                cy="50"
                rx="12"
                ry="35"
                stroke={colorScheme.primary}
                strokeWidth="1.5"
                fill="none"
                opacity="0.7"
            />

            {/* Center automation symbol - stylized "A" with circular flow */}
            <path
                d="M 50 35 L 58 50 L 54 50 L 54 60 L 46 60 L 46 50 L 42 50 Z"
                fill={colorScheme.primary}
                opacity="0.9"
            />

            {/* Circular arrows representing automation cycle */}
            <path
                d="M 68 40 Q 75 35, 72 28 L 75 30 M 72 28 L 70 25"
                stroke={colorScheme.accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M 32 60 Q 25 65, 28 72 L 25 70 M 28 72 L 30 75"
                stroke={colorScheme.accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* Connection nodes */}
            <circle cx="50" cy="20" r="3" fill={colorScheme.primary} opacity="0.8" />
            <circle cx="50" cy="80" r="3" fill={colorScheme.primary} opacity="0.8" />
            <circle cx="20" cy="50" r="3" fill={colorScheme.primary} opacity="0.8" />
            <circle cx="80" cy="50" r="3" fill={colorScheme.primary} opacity="0.8" />
        </svg>
    );
}