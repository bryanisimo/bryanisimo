# Logo Color Context Usage Guide

## Overview
The `ColorContext` manages the dynamic logo color rotation and allows other components to set or control the logo color.

## Available Colors
- `sky-aqua` - #4fc6e3
- `bondi-blue` - #1985a1
- `strawberry-red` - #e71d36
- `tomato` - #fe4a49
- `orange` - #ffae03
- `amber-flame` - #ffbe33
- `medium-jungle` - #4da852
- `yellow-green` - #9bc53d

## Color Rotation Behavior
- **Development Mode**: Rotates every 2 seconds
- **Production Mode**: Rotates every 10 seconds
- Colors rotate automatically on page load
- When a color is manually set, rotation stops

## Usage Examples

### In a Component - Get Current Color
```tsx
import { useLogoColor } from "../context/ColorContext";

export function MyComponent() {
  const { currentColor } = useLogoColor();
  
  return <div>Current logo color: {currentColor}</div>;
}
```

### In a Component - Set Logo Color
```tsx
import { useLogoColor } from "../context/ColorContext";

export function ColorPicker() {
  const { setColor } = useLogoColor();
  
  return (
    <button onClick={() => setColor("strawberry-red")}>
      Change Logo to Red
    </button>
  );
}
```

### In a Component - Reset to Rotation
```tsx
import { useLogoColor } from "../context/ColorContext";

export function ResetButton() {
  const { resetToRotation } = useLogoColor();
  
  return (
    <button onClick={resetToRotation}>
      Resume Color Rotation
    </button>
  );
}
```

### Full Example with All Features
```tsx
import { useLogoColor, type LogoColorKey } from "../context/ColorContext";

const COLOR_SEQUENCE: LogoColorKey[] = [
  "sky-aqua",
  "bondi-blue",
  "strawberry-red",
  "tomato",
  "orange",
  "amber-flame",
  "medium-jungle",
  "yellow-green",
];

export function ColorControlPanel() {
  const { currentColor, setColor, resetToRotation } = useLogoColor();
  
  return (
    <div className="p-4 space-y-4">
      <p>Current Color: <strong>{currentColor}</strong></p>
      
      <div className="flex flex-wrap gap-2">
        {COLOR_SEQUENCE.map((color) => (
          <button
            key={color}
            onClick={() => setColor(color)}
            className={`px-3 py-1 rounded ${
              currentColor === color ? "ring-2 ring-offset-2" : ""
            }`}
            style={{
              backgroundColor: `var(--color-${color})`,
            }}
          >
            {color}
          </button>
        ))}
      </div>
      
      <button
        onClick={resetToRotation}
        className="px-4 py-2 bg-gray-200 rounded"
      >
        Resume Auto-Rotation
      </button>
    </div>
  );
}
```

## Context API Reference

### `ColorProvider`
Wraps your application to provide color management. Already configured in `App.tsx`.

### `useLogoColor()` Hook

Returns an object with:

#### `currentColor: LogoColorKey`
The currently active logo color.

#### `setColor(color: LogoColorKey): void`
Manually sets the logo color and stops automatic rotation.

```tsx
const { setColor } = useLogoColor();
setColor("strawberry-red");
```

#### `resetToRotation(): void`
Resumes automatic color rotation starting from the first color.

```tsx
const { resetToRotation } = useLogoColor();
resetToRotation();
```

## CSS Variable
The logo's fill color is controlled by the CSS custom property:
```css
--color-logo-dynamic
```

This is automatically updated by the context. You can also use it in other elements:

```tsx
// In a component
style={{ color: "var(--color-logo-dynamic)" }}
```

## How It Works
1. `ColorProvider` renders at the root of your app (in `App.tsx`)
2. It manages a `currentColor` state that rotates through the color sequence
3. It updates the `--color-logo-dynamic` CSS variable in real-time
4. The Navbar SVG logo uses this CSS variable for its fill color
5. Other components can access/control the color via `useLogoColor()`

## Switching Between Dev and Production Timing
The rotation interval is automatically set based on the build mode:
- `import.meta.env.DEV` is `true` during development (2 seconds)
- `import.meta.env.DEV` is `false` in production (10 seconds)

To manually change after approval, edit `/src/context/ColorContext.tsx`:
```tsx
const COLOR_ROTATION_INTERVAL = 10000; // 10 seconds
```
