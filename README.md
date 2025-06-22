# 💀 Poison Heart Game

A multiplayer game where two players try to avoid picking each other's poison hearts!

## Game Rules

1. **Setup**: Two players join a room using a shared room link or room name
2. **Secret Selection**: Each player secretly chooses one heart color as their "poison"
3. **Gameplay**: Players take turns picking hearts from the circle
4. **Winning**: If you pick the other player's poison heart, you lose! The goal is to avoid the poison while forcing your opponent to pick yours.

## Features

- ✨ **Dynamic Room URLs**: Share direct links like `/room/MYGAME`
- 🎨 Beautiful UI with Shadcn components
- 💝 12 different colored hearts in a circle layout
- 🔔 Toast notifications using Sonner
- 📱 Responsive design
- 🎯 **Easy sharing**: Copy room links to invite friends
- ☁️ **Vercel-ready** - Deploy anywhere!
- 🔗 **Bookmarkable rooms**: Save your favorite room names

## How to Run

### Prerequisites
- Node.js installed
- pnpm package manager

### Running the Game

Simply start the Next.js development server:
```bash
pnpm run dev
```
The game will run on `http://localhost:3000`

### How to Play

#### Option 1: Quick Play
1. Click "Quick Play (Random Room)" on the homepage
2. Share the generated room URL with a friend
3. Both enter your names and start playing!

#### Option 2: Custom Room
1. Enter a custom room name on the homepage
2. Share the URL `http://localhost:3000/room/YOURNAME` with a friend
3. Both players enter their names
4. Choose your secret poison hearts
5. Take turns clicking hearts - avoid the poison! 💀

## Room URLs

- **Random rooms**: `/room/AB12CD` (auto-generated)
- **Custom rooms**: `/room/MYGAME` (your choice)
- **Direct sharing**: Just copy and paste the URL!

## Deployment

This app is ready to deploy on Vercel, Netlify, or any platform that supports Next.js:

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click!

### Manual Deployment
```bash
pnpm run build
pnpm run start
```

## Project Structure

```
poison-game/
├── app/
│   ├── api/game/route.ts        # Game API endpoints
│   ├── page.tsx                 # Homepage with room creation
│   └── room/[id]/page.tsx       # Dynamic room pages
├── components/
│   ├── name-input.tsx           # Player name input
│   ├── heart-circle.tsx         # Game board with hearts
│   └── secret-heart-selector.tsx # Secret heart selection
├── lib/
│   ├── game-store.ts            # Game state management
│   └── game-actions.ts          # API client functions
└── ...
```

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Routing**: Dynamic routes with `[id]` parameters
- **UI**: Shadcn/ui, Tailwind CSS
- **Icons**: React Icons
- **Notifications**: Sonner
- **Real-time**: Polling (2-second intervals)

## Game Mechanics

- **Hearts**: 12 different colored hearts arranged in a circle
- **Turns**: Players alternate picking hearts
- **Poison Detection**: Game ends immediately when someone picks a poison heart
- **Visual Feedback**: 
  - Golden border around your secret poison heart
  - Grayed out hearts that have been picked
  - Turn indicators and player status
- **Real-time Sync**: Game state updates every 2 seconds automatically

## Dynamic Routing Benefits

- 🚀 **Easy sharing**: Send direct room links to friends
- 📖 **Bookmarkable**: Save favorite room names
- 🎯 **Custom names**: Use memorable room names like `/room/FRIENDSGAME`
- 🔄 **Auto-create**: Rooms are created automatically when first accessed
- 🌐 **SEO friendly**: Better URL structure for the web

## Architecture Benefits

- 🚀 **Serverless**: No need for a separate server
- 🌐 **Vercel-ready**: Deploy with zero configuration
- 🔄 **Auto-sync**: Automatic game state synchronization
- 📦 **Component-based**: Clean, maintainable code structure
- 🎯 **Type-safe**: Full TypeScript support

## Examples

- Quick play: `http://localhost:3000/room/A1B2C3`
- Custom game: `http://localhost:3000/room/BESTFRIENDS`
- Team match: `http://localhost:3000/room/TEAMVSTEAM`

Enjoy the game! 🎮💀
