# Phasercraft

**A browser-based action RPG built with Phaser 3 and Next.js**

Phasercraft is an isometric action RPG featuring deep character customization, strategic spell-based combat, and a comprehensive loot system. Choose your class, master magical abilities, and survive increasingly challenging waves of enemies in this modern take on classic dungeon crawlers.

## 🎮 Game Features

### Five Unique Character Classes
Each class offers distinct playstyles, resource management, and combat approaches:

- **⚔️ Warrior** - Melee tank with Rage resource. High health and defense, specializes in area damage (Whirlwind) and self-buffs (Enrage)
- **✨ Cleric** - Holy support with Mana resource. Balanced stats with powerful healing (Heal, Faith) and divine damage (Smite, Consecration)  
- **🔥 Mage** - Elemental caster with Mana resource. Glass cannon with devastating spells (Fireball, Frostbolt) and magical shields
- **🌙 Occultist** - Dark magic user with Mana resource. Life-draining abilities (Siphon Soul) and frost magic
- **🏹 Ranger** - Ranged fighter with Energy resource. High critical chance, trap setting (Snare Trap), and multi-target attacks (Multishot)

### Advanced Magic System
- **6 Magic Schools**: Light, Fire, Frost, Arcane, Earth, Dark
- **15 Ascended Classes**: Combine base classes to unlock advanced specializations (Knight, Paladin, Wizard, Necromancer, etc.)
- **Dynamic Spell Combinations**: Access to 20+ unique spells with varied targeting, cooldowns, and effects
- **Resource Management**: Balance Rage/Mana/Energy consumption with spell power and timing

### Strategic Combat
- **Real-time Action**: Click-to-move controls with precise spell targeting
- **Wave-Based Progression**: Survive 9 increasingly difficult enemy waves
- **Diverse Enemy Types**: Face Melee bruisers, Ranged attackers, and Support healers
- **Critical Hit System**: Land devastating 1.5x damage criticals based on class stats
- **Status Effects**: Apply and manage buffs, debuffs, and damage-over-time effects

### Deep Loot & Progression
- **5-Tier Rarity System**: Common → Fine → Rare → Epic → Legendary equipment
- **Dynamic Item Stats**: 9 different stats with randomized allocation per item
- **Comprehensive Equipment**: 24+ weapons, 50+ helmets, armor sets, and accessories
- **Crafting Materials**: Collect Coins, Gems, Scrap, Cloth, and rare Ichor for upgrades
- **Equipment Management**: Drag-and-drop inventory with multiple save slots

### Rich UI & Quality of Life
- **Multiple Game Screens**: Character selection, inventory management, armory storage
- **Save System**: Three save slots (A/B/C) with quick-save hotkeys
- **Combat Feedback**: Floating damage numbers, status indicators, and spell cooldown timers
- **Interactive Interface**: Tooltip-rich equipment comparison and stats tracking

## 🎯 Gameplay Guide

### Getting Started
1. **Choose Your Class**: Select from 5 base classes, each with unique abilities and playstyles
2. **Learn Your Spells**: Master your class's spell rotation and resource management
3. **Survive the Waves**: Face 9 progressively challenging enemy encounters
4. **Collect Loot**: Gather coins, materials, and equipment to strengthen your character
5. **Manage Inventory**: Equip better gear and store valuable items in your armory

### Combat Tips
- **Target Priority**: Focus fire on Healers (Egbert) first, then Ranged (Imp), then Melee
- **Resource Management**: Don't waste Mana/Energy on weak enemies - save for tough fights
- **Positioning**: Use click-to-move to maintain optimal range and avoid enemy attacks
- **Spell Timing**: Learn cooldowns to chain abilities effectively
- **Critical Builds**: Rangers excel with high critical chance - build around crit stats

### Progression Strategy
- **Equipment Focus**: Prioritize items that boost your class's primary stats
- **Spell School Synergy**: Understand your class's magic schools for optimal spell selection
- **Save Management**: Use multiple save slots to experiment with different builds
- **Material Hoarding**: Collect crafting materials early - high-tier items require rare components

## 🎮 Controls

- **Mouse**: Click to move, target spells, interact with UI
- **Number Keys (1-5)**: Cast spells in your spell bar
- **Spacebar**: Self-cast (target yourself with spells)
- **Escape**: Clear spell targeting/open menu
- **S/L/D**: Quick-save to slots A/B/C

## 🛠️ Development

This project uses the Phaser-Next.js template with a React-Phaser bridge for seamless integration between the game engine and React components. The EventBus system enables communication between React UI and Phaser game logic.

## 🚀 Quick Start

### Development Setup
```bash
# Install dependencies
npm install

# Start development server (includes logging)
npm run dev

# Start without anonymous usage data
npm run dev-nolog
```

Game runs at `http://localhost:8080`

### Production Build
```bash
# Build for production
npm run build
```

## 🔧 Technical Stack

- **Frontend**: Next.js 15 with React 19 and TypeScript
- **Game Engine**: Phaser 3.90.0 with physics and animations
- **State Management**: Redux Toolkit with RxJS for reactive updates
- **Architecture**: React-Phaser bridge with EventBus communication
- **Build System**: Next.js with hot-reloading for rapid development

## 📁 Project Structure

```
src/
├── entities/          # Game objects (Player, Enemy, Spells, Loot, UI)
├── scenes/           # Phaser scenes (Game, Load, Select, GameOver)  
├── config/           # Game data (classes, enemies, waves, bosses)
├── helpers/          # Utility functions
├── store/            # Redux state management
├── app/              # Next.js app router components
└── ui/               # React UI components
```

### Available Commands
- `npm run dev` - Development server with logging
- `npm run build` - Production build  
- `npm run lint` - Code linting
- `npm run gateway` - Start GraphQL server
- `npm run service:armory` - Start armory microservice

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Phasercraft** - Combining the depth of classic RPGs with modern web technology. Master your class, collect legendary loot, and prove your worth against the endless waves!
