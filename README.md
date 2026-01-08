# 🎮 Prodigy Material Tracker

A comprehensive web application for tracking crafting materials and recipes for Prodigy RP. Manage your inventory, craft items, calculate multi-recipe orders, and optimize your resource usage - all stored locally in your browser!

## ✨ Features

### Material Management

- **Add & Edit Materials**: Track quantities with rarity levels (Common/Uncommon/Rare)
- **Visual Rarity System**: Color-coded borders (gray/green/blue) for easy identification
- **Low Stock Warnings**: Materials with quantity < 10 display with red background
- **Quick Adjustments**: Increase/decrease quantities or delete materials with one click

### Recipe System

- **Custom Recipe Creation**: Build your own recipes directly in the app
- **Edit & Delete Recipes**: Manage your recipe database without touching code
- **Smart Filtering**: View all recipes or filter to see only craftable ones
- **Advanced Sorting**: Sort by most/least craftable, alphabetically, or default order
- **One-Click Crafting**: Craft items and automatically update material quantities

### Crafting Calculator

- **Multi-Recipe Orders**: Plan complex crafting orders with multiple recipes
- **Nested Material Breakdown**: Expandable view shows sub-components for crafted materials
- **Shortage Analysis**: Instantly see what materials you need and how many
- **Smart Recommendations**: Calculate how many you can craft with current materials

### Data Persistence

- **Local Storage**: All data saved automatically in your browser
- **No Server Required**: Works completely offline
- **Export/Import Ready**: Future-proof data structure

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation & Running

1. **Navigate to the project directory:**

   ```bash
   cd rp-material-tracker
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to the URL shown in terminal (typically `http://localhost:3000`)
   - The app will automatically open or you can manually visit the link

## 📖 Usage Guide

### Adding & Managing Materials

1. **Add a Material:**

   - Enter material name in the "Add Material" form
   - Set quantity (defaults to 1)
   - Choose rarity: Common (gray), Uncommon (green), or Rare (blue)
   - Click "Add Material"
   - Duplicate materials automatically merge quantities

2. **Edit Materials:**

   - Click "Edit" on any material card
   - Modify name, quantity, or rarity
   - Save changes or cancel

3. **Adjust Quantities:**
   - Use **+** and **-** buttons for quick adjustments
   - Materials below 10 quantity show red background warning
   - Click **Delete** to remove materials

### Creating & Managing Recipes

1. **Add a Recipe:**

   - Click "+ Add Recipe" in the Recipes section
   - Enter recipe name
   - Add required materials with quantities
   - Save to create the recipe

2. **Edit/Delete Recipes:**

   - Click "Edit" to modify recipe details
   - Click "Delete" to remove recipes
   - Changes save automatically to localStorage

3. **Craft Items:**
   - Click "Craft" on any recipe card (when materials are available)
   - Materials are automatically deducted
   - Crafted item is added to your inventory

### Viewing Recipes

- **All Tab**: Shows every recipe in your database
- **Craftable Tab**: Only displays recipes you can currently craft
- **Sorting Options:**

  - **Most Craftable**: Shows recipes you can craft the most copies of first
  - **Least Craftable**: Shows recipes you're closest to being able to craft
  - **Alphabetical**: A-Z order
  - **Default**: Original order

- **Recipe Cards Show:**
  - ✓ Materials you have enough of (green checkmark)
  - ✗ Materials you're missing/short on (red X)
  - Current quantity vs required quantity
  - Max craftable count

### Using the Crafting Calculator

1. **Build an Order:**

   - Select a recipe from the dropdown
   - Set quantity to craft
   - Click "Add to Order"
   - Repeat for multiple recipes

2. **View Requirements:**

   - See total materials needed for entire order
   - Red items = shortage, Green items = sufficient
   - Shows: Current / Needed (Missing: X)

3. **Expand Nested Materials:**

   - Click "+" on craftable materials to see their sub-components
   - Navigate complex crafting chains
   - See all raw materials needed for complete order

4. **Manage Order:**
   - Adjust quantities with +/- buttons
   - Remove individual items
   - Click "Clear Order" to start fresh

### Initial Setup (Optional)

The app comes with sample recipes in [src/data/recipes.ts](src/data/recipes.ts). These are loaded only on first use as starter data. After that, all recipes are managed through the UI and stored in localStorage.

**To customize initial recipes:**

1. Edit [src/data/recipes.ts](src/data/recipes.ts) before first run
2. Clear browser localStorage to reload defaults
3. Or simply delete/edit recipes through the UI

## 🛠️ Technologies Used

- **Vite 6.0**: Lightning-fast build tool and development server
- **React 18**: Modern UI library with hooks
- **TypeScript 5.6**: Type-safe JavaScript for better development
- **LocalStorage API**: Browser-based persistent data storage
- **CSS3**: Custom styling with gradients and animations

## 📁 Project Structure

```
rp-material-tracker/
├── src/
│   ├── components/
│   │   ├── MaterialForm.tsx          # Form to add/edit materials
│   │   ├── MaterialList.tsx          # Display and manage materials
│   │   ├── RecipeForm.tsx            # Form to add/edit recipes
│   │   ├── RecipeList.tsx            # Display recipes with filters/sorting
│   │   └── CraftingCalculator.tsx    # Multi-recipe order calculator
│   ├── data/
│   │   └── recipes.ts                # Initial seed recipes (optional)
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces
│   ├── utils/
│   │   └── storage.ts                # LocalStorage helpers
│   ├── styles/
│   │   └── main.css                  # Application styles
│   ├── App.tsx                       # Main app component & state
│   └── main.tsx                      # Entry point
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🏗️ Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder that you can serve with any static file server.

To preview the production build locally:

```bash
npm run preview
```

## 💾 Data Storage

All data (materials and recipes) is stored in your browser's LocalStorage:

- ✅ **No server required** - works completely offline
- ✅ **Auto-save** - all changes persist automatically
- ✅ **Privacy** - data never leaves your device
- ⚠️ **Device-specific** - data doesn't sync across browsers/devices
- ⚠️ **Clearing browser data** will erase your materials and recipes
- 💡 **Tip**: Back up by exporting browser data or manually saving recipes

## 🎨 Customization Ideas

### Visual Customization

- **Colors & Theme**: Edit [src/styles/main.css](src/styles/main.css) to change the gradient background and color scheme
- **Rarity Colors**: Customize the border colors for Common/Uncommon/Rare materials
- **Low Stock Threshold**: Adjust the quantity threshold for red warning backgrounds

### Feature Extensions

- **Export/Import**: Add JSON export/import for backing up materials and recipes
- **Material Categories**: Group materials by type (Raw Materials, Components, etc.)
- **Recipe Images**: Add visual icons for materials and recipes
- **Crafting History**: Track what you've crafted and when
- **Material Costs**: Add pricing system for economic tracking
- **Batch Crafting**: Craft multiple copies of a recipe at once
- **Shopping List**: Generate shopping lists for missing materials

## 📝 Tips & Best Practices

- **Start with Recipes**: Add your recipes first, which auto-creates materials at 0 quantity
- **Use Rarity Wisely**: Color-code materials by rarity to quickly identify valuable items
- **Monitor Low Stock**: Red backgrounds alert you when materials drop below 10
- **Plan Orders**: Use the crafting calculator to plan complex multi-item crafts
- **Nested Crafting**: Expand materials in calculator to see full component trees
- **Regular Backups**: Periodically note your recipes as clearing browser data loses everything

## 🐛 Troubleshooting

**Problem**: My data disappeared  
**Solution**: Check if browser data was cleared. Data is stored in localStorage and doesn't survive browser data deletion.

**Problem**: Recipe won't craft  
**Solution**: Ensure you have exact quantities needed for all materials. Check for typos in material names (case-insensitive matching is used).

**Problem**: Duplicate materials appearing  
**Solution**: Material names are case-insensitive. "Iron Bar" and "iron bar" should merge, but ensure exact spelling.

**Problem**: Can't see starter recipes  
**Solution**: Starter recipes from [src/data/recipes.ts](src/data/recipes.ts) only load on first use. Clear localStorage to reload them.

## 🤝 Contributing

This project is open for contributions! Feel free to:

- Fork and customize for your RP server
- Submit issues for bugs or feature requests
- Create pull requests with improvements
- Share your custom recipes or modifications

## 📝 License

This project is open-source and available under the MIT License.

---

**Built for Prodigy RP** - Track materials, craft efficiently, dominate the server! 🎮✨
