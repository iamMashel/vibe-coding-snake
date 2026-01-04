# Snake Game

A modern, responsive implementation of the classic Snake game built with React and styled with TailwindCSS.

## Features

- **Smooth Gameplay**: Responsive controls with arrow keys
- **Score Tracking**: Earn 10 points for each food item consumed
- **Pause/Resume**: Press space or click the button to pause
- **Collision Detection**: Game ends when snake hits walls or itself
- **Modern UI**: Beautiful gradient backgrounds and animations
- **Game Over Screen**: Easy restart functionality

## Demo

Play the classic snake game with a modern twist! Control the snake, eat the food, and try to beat your high score.

## Tech Stack

- **React**: Frontend framework
- **Vite**: Build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **JavaScript**: Game logic implementation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/iamMashel/vibe-coding-snake.git
cd vibe-coding-snake
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## How to Play

- **Arrow Keys**: Control the direction of the snake
  - Up Arrow: Move up
  - Down Arrow: Move down
  - Left Arrow: Move left
  - Right Arrow: Move right
- **Spacebar**: Pause/Resume the game
- **Play Again Button**: Restart after game over

## Game Rules

1. The snake starts moving in one direction
2. Use arrow keys to change direction
3. Eat the red food to grow longer and increase your score
4. Avoid hitting the walls or your own tail
5. The game ends when you collide with a wall or yourself

## Project Structure

```
vibe-coding-snake/
├── src/
│   ├── App.jsx          # Main app component
│   ├── SnakeGame.jsx    # Snake game component with game logic
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles with Tailwind imports
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── package.json         # Project dependencies
└── README.md           # Project documentation
```

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with React and Vite
- Styled with TailwindCSS
- Inspired by the classic Snake game

## Contact

Mashel - [@iamMashel](https://github.com/iamMashel)

Project Link: [https://github.com/iamMashel/vibe-coding-snake](https://github.com/iamMashel/vibe-coding-snake)
