# Facebook Integration UI Design Guide

## Overview
This document outlines the design system and UI improvements made to the Facebook Lead Ads integration components.

## Color Palette

### Primary Colors
- **Facebook Blue**: `#1877F2` - Primary action buttons, links, and active states
- **Background**: `#F9FAFB` - Main background for modals and containers
- **White**: `#FFFFFF` - Card backgrounds and content areas

### Text Colors
- **Primary Text**: `#111827` - Headings and important text
- **Secondary Text**: `#6B7280` - Descriptions and helper text
- **Tertiary Text**: `#9CA3AF` - Labels and metadata

### Status Colors
- **Success/Active**: `#10B981` - Active integrations, success states
- **Warning**: `#F59E0B` - Warning states, pause actions
- **Error/Inactive**: `#EF4444` - Error states, inactive integrations
- **Info**: `#3B82F6` - Informational highlights

### Accent Colors
- **Blue Tint**: `#EFF6FF` - Selected items background
- **Green Tint**: `#F0FDF4` - Lead data display
- **Yellow Tint**: `#FEF3C7` - Info containers
- **Indigo Tint**: `#EEF2FF` - Permissions container

## Typography

### Font Sizes
- **Extra Large Title**: 26px (Modal titles)
- **Large Title**: 20px (Section titles)
- **Title**: 18px (Header titles)
- **Body Large**: 17px (Important content)
- **Body**: 16px (Standard text)
- **Body Small**: 15px (Descriptions)
- **Caption**: 14px (Secondary info)
- **Small Caption**: 13px (Labels, metadata)
- **Tiny**: 12px (Status badges)

### Font Weights
- **Bold**: 700 (Main headings, emphasis)
- **Semibold**: 600 (Subheadings, buttons)
- **Medium**: 500 (Labels, important text)
- **Regular**: 400 (Body text)

## Spacing System

### Padding/Margin Scale
- **XS**: 4px
- **SM**: 6px
- **MD**: 8px
- **LG**: 10px
- **XL**: 12px
- **2XL**: 14px
- **3XL**: 16px
- **4XL**: 18px
- **5XL**: 20px
- **6XL**: 24px
- **7XL**: 28px

## Component Styles

### Cards
```typescript
{
  backgroundColor: '#fff',
  borderRadius: 10-12,
  padding: 14-18,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2-3,
  elevation: 1-2,
}
```

### Buttons

#### Primary Button
```typescript
{
  backgroundColor: '#1877F2',
  paddingVertical: 14-16,
  paddingHorizontal: 24-28,
  borderRadius: 10,
  shadowColor: '#1877F2',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2-0.3,
  shadowRadius: 4,
  elevation: 3,
}
```

#### Secondary Button
```typescript
{
  backgroundColor: '#F9FAFB',
  borderWidth: 1,
  borderColor: '#E5E7EB',
  paddingVertical: 9-10,
  paddingHorizontal: 14-16,
  borderRadius: 7-8,
}
```

#### Danger Button
```typescript
{
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: '#FEE2E2',
  color: '#DC2626',
}
```

### Status Badges
```typescript
{
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F9FAFB',
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 6,
}
```

### List Items
```typescript
{
  flexDirection: 'row',
  paddingVertical: 14-16,
  paddingHorizontal: 16-18,
  backgroundColor: '#F9FAFB', // or '#fff'
  borderRadius: 10,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: '#E5E7EB',
}
```

#### Selected State
```typescript
{
  borderColor: '#1877F2',
  backgroundColor: '#EFF6FF',
  borderWidth: 2,
}
```

### Input Fields
```typescript
{
  backgroundColor: '#F9FAFB',
  padding: 10-12,
  borderRadius: 6,
  fontSize: 14,
  borderWidth: 1,
  borderColor: '#E5E7EB',
}
```

### Info Containers

#### General Info
```typescript
{
  backgroundColor: '#F0F9FF',
  padding: 18,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#BAE6FD',
}
```

#### Success Info
```typescript
{
  backgroundColor: '#F0FDF4',
  padding: 16,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#BBF7D0',
}
```

#### Warning Info
```typescript
{
  backgroundColor: '#FEF3C7',
  padding: 16,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#FDE68A',
}
```

#### Permissions Info
```typescript
{
  backgroundColor: '#EEF2FF',
  padding: 18,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#C7D2FE',
}
```

## Modal Design

### Header
- **Background**: White (`#fff`)
- **Border Bottom**: 1px solid `#E5E7EB`
- **Padding**: Horizontal 20px, Vertical 14-16px
- **Height**: ~56px

### Content
- **Background**: `#F9FAFB`
- **Padding**: 20-24px per section

### Footer (if needed)
- Same styling as header
- Border top instead of bottom

## Interactive States

### Hover (Desktop)
- Slight opacity change (0.8-0.9)
- Subtle shadow increase

### Active/Pressed
- Scale: 0.98
- Opacity: 0.9

### Disabled
- Opacity: 0.5
- Cursor: not-allowed

### Focus
- Border color changes to primary color
- Subtle shadow or glow effect

## Accessibility

### Touch Targets
- Minimum size: 44x44px
- Padding around small elements: 8-12px

### Contrast Ratios
- Text on white: Minimum 4.5:1
- Interactive elements: Minimum 3:1

### Text Legibility
- Line height: 1.4-1.6 for body text
- Max line length: ~600px
- Letter spacing: Normal to slight increase

## Animations

### Standard Transitions
- Duration: 150-300ms
- Easing: ease-in-out

### Modal Animations
- Type: slide or fade
- Duration: 300ms

### Loading States
- Use native ActivityIndicator
- Color matches primary or context

## Best Practices

1. **Consistency**: Use the defined spacing scale throughout
2. **Hierarchy**: Use font sizes and weights to establish visual hierarchy
3. **Feedback**: Always provide visual feedback for user actions
4. **Clarity**: Use clear, concise labels and descriptions
5. **Progressive Disclosure**: Show information as needed, not all at once
6. **Error Prevention**: Use validation and clear instructions
7. **Empty States**: Provide helpful empty state messages with actions

## Component-Specific Guidelines

### FacebookIntegrationsManager
- Transparent background to integrate with parent
- Cards with subtle shadows for depth
- Clear status indicators with color coding
- Action buttons grouped logically

### FacebookConnectionModal
- Step-by-step progression
- Clear visual feedback for current step
- Permissions displayed prominently
- Easy navigation between steps

### FacebookFormMappingModal
- Visual distinction between selected/unselected leads
- Color-coded data display (green for lead data)
- Clear mapping interface with dropdowns
- Required field toggle with visual feedback

### FacebookAutomationSettingsModal
- Selection lists with checkmarks
- Color indicators for stages
- Status badges for sequences
- Prominent info container for integration details

## Responsive Considerations

### Mobile (< 768px)
- Single column layouts
- Full-width buttons
- Larger touch targets
- Simplified navigation

### Tablet (768px - 1024px)
- Adaptive layouts
- Optimized spacing
- Flexible card widths

### Desktop (> 1024px)
- Multi-column where appropriate
- Hover states
- Larger modals
- More detailed information visible
