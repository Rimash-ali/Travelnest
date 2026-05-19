// database of all travel destnation entries with local recipes and fitness workouts

const travelDestinations = [
  {
    id: "kyoto-japan",
    name: "Kyoto",
    country: "Japan",
    continent: "Asia",
    travelType: "cultural",
    budgetRange: "medium",
    image: "assets/destinations/kyoto.jpg",
    description: "Kyoto, once the capital of Japan, is a city on the island of Honshu. It's famous for its thousands of classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses.",
    attractions: [
      "Fushimi Inari Shrine (Thousands of vermilion torii gates)",
      "Kinkaku-ji (The Golden Pavilion)",
      "Gion District (Traditional geisha district)",
      "Arashiyama Bamboo Grove"
    ],
    costs: {
      budget: { accommodation: 35, food: 15, transport: 8 },
      moderate: { accommodation: 95, food: 35, transport: 15 },
      luxury: { accommodation: 280, food: 90, transport: 40 }
    },
    // Fulfills the "recipe data" requirement
    recipeData: {
      dishName: "Handmade Matcha Dango",
      difficulty: "Medium",
      prepTime: "25 mins",
      ingredients: ["100g Joshinko (rice flour)", "100g Shiratamako", "2 tsp Matcha Powder", "2 tbsp Sugar", "Warm water"],
      instructions: "Mix flours, matcha, and sugar. Gradually add warm water until dough-like. Form into small balls, boil until they float, then skewer and serve with sweet soy glaze."
    },
    // Fulfills the "workout/fitness data" requirement
    workoutData: {
      activityName: "Daimonji Mountain Pilgrimage Hike",
      intensity: "Moderate",
      duration: "90 mins",
      caloriesBurned: 550,
      equipment: "Sturdy hiking shoes, Water bottle",
      description: "A scenic trek up Mount Daimonji-yama behind Ginkaku-ji, offering panoramic views of the entire city of Kyoto. Perfect for aerobic conditioning and cultural sightseeing."
    }
  },
  {
    id: "bali-indonesia",
    name: "Bali",
    country: "Indonesia",
    continent: "Asia",
    travelType: "relaxation",
    budgetRange: "low",
    image: "assets/destinations/bali.jpg",
    description: "Bali is a province of Indonesia and the westernmost of the Lesser Sunda Islands. East of Java and west of Lombok, the province includes the island of Bali and a few smaller neighbouring islands.",
    attractions: [
      "Ubud Monkey Forest",
      "Uluwatu Temple (Cliffside temple with sunset views)",
      "Tegallalang Rice Terraces",
      "Seminyak Beach"
    ],
    costs: {
      budget: { accommodation: 15, food: 6, transport: 5 },
      moderate: { accommodation: 45, food: 18, transport: 12 },
      luxury: { accommodation: 150, food: 50, transport: 30 }
    },
    recipeData: {
      dishName: "Traditional Nasi Goreng",
      difficulty: "Easy",
      prepTime: "15 mins",
      ingredients: ["2 cups Cooked Rice", "100g Chicken breast", "2 tbsp Kecap Manis (sweet soy)", "1 Egg", "Garlic, Shallots, Chili"],
      instructions: "Sauté aromatics, cook chicken, stir-fry rice with sweet soy sauce. Serve topped with a fried egg and fresh cucumbers."
    },
    workoutData: {
      activityName: "Uluwatu Cliffside Vinyasa Yoga Flow",
      intensity: "Low",
      duration: "60 mins",
      caloriesBurned: 240,
      equipment: "Yoga mat, Comfortable clothing",
      description: "A calming yet strengthening yoga session overlooking the Indian Ocean. Focuses on breathing, balance, and core stability."
    }
  },
  {
    id: "queenstown-new-zealand",
    name: "Queenstown",
    country: "New Zealand",
    continent: "Oceania",
    travelType: "adventure",
    budgetRange: "high",
    image: "assets/destinations/queenstown.jpg",
    description: "Queenstown, New Zealand, sits on the shores of the South Island’s Lake Wakatipu, set against the dramatic Southern Alps. Renowned for adventure sports, it’s also a base for exploring the region’s vineyards and historic mining towns.",
    attractions: [
      "Milford Sound Day Cruise",
      "Kawarau Bridge Bungee Jump",
      "Skyline Gondola & Luge ride",
      "Skiing at The Remarkables"
    ],
    costs: {
      budget: { accommodation: 45, food: 22, transport: 12 },
      moderate: { accommodation: 140, food: 55, transport: 25 },
      luxury: { accommodation: 390, food: 120, transport: 65 }
    },
    recipeData: {
      dishName: "Kiwi Pavlova with Fresh Berries",
      difficulty: "Hard",
      prepTime: "60 mins",
      ingredients: ["4 Egg Whites", "1 cup Caster Sugar", "1 tsp White Vinegar", "1 cup Whipping Cream", "Fresh Kiwis & Berries"],
      instructions: "Whip egg whites and sugar to stiff peaks. Fold in vinegar. Bake at low temperature. Top with whipped cream and fresh fruit."
    },
    workoutData: {
      activityName: "Ben Lomond Summit Elevation Hike",
      intensity: "High",
      duration: "5 hours",
      caloriesBurned: 1800,
      equipment: "Hiking boots, Windcheater, Trekking poles, 2L Water",
      description: "A demanding full-day alpine hike rising to 1,748 meters. Provides stunning 360-degree views of Lake Wakatipu and the surrounding mountain ranges."
    }
  },
  {
    id: "rome-italy",
    name: "Rome",
    country: "Italy",
    continent: "Europe",
    travelType: "cultural",
    budgetRange: "medium",
    image: "assets/destinations/rome.jpg",
    description: "Rome is the capital city of Italy. It is also the capital of the Lazio region, the center of the Metropolitan City of Rome, and a special comune named Comune di Roma Capitale.",
    attractions: [
      "Colosseum (Ancient amphitheater)",
      "Vatican Museums & Sistine Chapel",
      "Trevi Fountain",
      "The Pantheon"
    ],
    costs: {
      budget: { accommodation: 30, food: 18, transport: 6 },
      moderate: { accommodation: 110, food: 40, transport: 15 },
      luxury: { accommodation: 320, food: 110, transport: 50 }
    },
    recipeData: {
      dishName: "Classic Cacio e Pepe",
      difficulty: "Medium",
      prepTime: "15 mins",
      ingredients: ["200g Tonnarelli or Spaghetti", "1 cup Pecorino Romano cheese", "2 tbsp Black Peppercorns", "Salt"],
      instructions: "Toast crushed peppercorns. Boil pasta until al dente. Mix pasta water and finely grated cheese to form a creamy emulsion. Toss pasta together."
    },
    workoutData: {
      activityName: "Historic Rome Running Tour",
      intensity: "Moderate",
      duration: "45 mins",
      caloriesBurned: 450,
      equipment: "Running sneakers",
      description: "An early morning jogging tour passing the Colosseum, Roman Forum, and Tiber River before the city awakens. Combines cardio with historical sightseeing."
    }
  },
  {
    id: "reykjavik-iceland",
    name: "Reykjavik",
    country: "Iceland",
    continent: "Europe",
    travelType: "nature",
    budgetRange: "high",
    image: "assets/destinations/reykjavik.jpg",
    description: "Reykjavik, on the coast of Iceland, is the country's capital and largest city. It home to the National and Saga museums, tracing Iceland’s Viking history, and the striking concrete Hallgrimskirkja church.",
    attractions: [
      "The Blue Lagoon Geothermal Spa",
      "Golden Circle (Gullfoss, Geysir, Thingvellir)",
      "Northern Lights Tour",
      "Hallgrimskirkja Church"
    ],
    costs: {
      budget: { accommodation: 50, food: 25, transport: 15 },
      moderate: { accommodation: 160, food: 60, transport: 35 },
      luxury: { accommodation: 420, food: 140, transport: 80 }
    },
    recipeData: {
      dishName: "Icelandic Rye Bread (Rúgbrauð)",
      difficulty: "Medium",
      prepTime: "12 hours",
      ingredients: ["4 cups Rye Flour", "2 cups Wheat Flour", "2 cups Buttermilk", "1 cup Golden Syrup", "Pinch of salt"],
      instructions: "Mix ingredients into a dense dough. Put in a pot and bake at very low heat (80-90°C) for 12 hours (traditionally buried near a hot spring)."
    },
    workoutData: {
      activityName: "Sólheimajökull Glacier Ice Climbing",
      intensity: "High",
      duration: "3 hours",
      caloriesBurned: 950,
      equipment: "Crampons, Ice axe, Climbing harness, Helmet",
      description: "An intense full-body muscular workout climbing vertical walls of ice on a glacier tongue in southern Iceland. Excellent for upper body and core strength."
    }
  },
  {
    id: "cape-town-south-africa",
    name: "Cape Town",
    country: "South Africa",
    continent: "Africa",
    travelType: "adventure",
    budgetRange: "medium",
    image: "assets/destinations/capetown.jpg",
    description: "Cape Town is a port city on South Africa’s southwest coast, on a peninsula beneath the imposing Table Mountain. Slowly rotating cable cars climb to the mountain’s flat top, from which there are sweeping views of the city.",
    attractions: [
      "Table Mountain Aerial Cableway",
      "Boulders Beach (African Penguin Colony)",
      "Cape of Good Hope & Cape Point",
      "Robben Island Museum"
    ],
    costs: {
      budget: { accommodation: 22, food: 10, transport: 6 },
      moderate: { accommodation: 70, food: 25, transport: 15 },
      luxury: { accommodation: 220, food: 75, transport: 40 }
    },
    recipeData: {
      dishName: "Cape Malay Chicken Curry",
      difficulty: "Medium",
      prepTime: "40 mins",
      ingredients: ["500g Chicken thighs", "2 tbsp Cape Malay curry powder", "1 Can Chopped Tomatoes", "1 Onion", "Fresh Ginger & Coriander"],
      instructions: "Sauté onions with ginger and garlic. Add spices and toast. Cook chicken with tomatoes and simmer until tender. Garnish with coriander."
    },
    workoutData: {
      activityName: "Lion's Head Sunrise Trail Run",
      intensity: "High",
      duration: "75 mins",
      caloriesBurned: 700,
      equipment: "Trail running shoes, Headlamp (for early start)",
      description: "A fast-paced trail run climbing up Lion's Head peak. Involves steep gravel paths and minor climbing chains, offering panoramic Cape Town views."
    }
  },
  {
    id: "cairo-egypt",
    name: "Cairo",
    country: "Egypt",
    continent: "Africa",
    travelType: "cultural",
    budgetRange: "low",
    image: "assets/destinations/cairo.jpg",
    description: "Cairo, Egypt’s dusty, bustling capital, is set on the Nile River. At its heart is Tahrir Square and the vast Egyptian Museum, a trove of antiquities including royal mummies and gilded King Tutankhamun artifacts.",
    attractions: [
      "Great Pyramids of Giza & Great Sphinx",
      "The Grand Egyptian Museum",
      "Khan el-Khalili Bazaar",
      "Al-Azhar Mosque"
    ],
    costs: {
      budget: { accommodation: 12, food: 5, transport: 3 },
      moderate: { accommodation: 40, food: 14, transport: 8 },
      luxury: { accommodation: 160, food: 45, transport: 22 }
    },
    recipeData: {
      dishName: "Traditional Egyptian Koshari",
      difficulty: "Medium",
      prepTime: "45 mins",
      ingredients: ["1 cup Lentils", "1 cup Rice", "1 cup Macaroni", "Spicy Tomato Sauce", "Crispy Fried Onions", "Garlic-vinegar Drizzle"],
      instructions: "Cook lentils, rice, and macaroni separately. Layer them in a bowl, top with seasoned tomato sauce, chickpeas, garlic vinegar, and crispy onions."
    },
    workoutData: {
      activityName: "Giza Plateau Camel Riding Calisthenics",
      intensity: "Low",
      duration: "90 mins",
      caloriesBurned: 300,
      equipment: "Sunscreen, Sun hat, Water",
      description: "A unique core-balancing workout navigating the desert dunes around the pyramids on camelback. Requires continuous core engagement for posture stabilization."
    }
  },
  {
    id: "new-york-city-usa",
    name: "New York City",
    country: "United States",
    continent: "North America",
    travelType: "cultural",
    budgetRange: "high",
    image: "assets/destinations/nyc.jpg",
    description: "New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that’s among the world’s major commercial, financial and cultural centers.",
    attractions: [
      "Statue of Liberty & Ellis Island",
      "Central Park (Walking tour/Boating)",
      "Empire State Building Observatory",
      "Broadway Theatre District"
    ],
    costs: {
      budget: { accommodation: 60, food: 25, transport: 10 },
      moderate: { accommodation: 180, food: 65, transport: 20 },
      luxury: { accommodation: 450, food: 160, transport: 60 }
    },
    recipeData: {
      dishName: "New York Style Thin-Crust Pizza",
      difficulty: "Hard",
      prepTime: "90 mins",
      ingredients: ["300g Bread Flour", "1 tsp Yeast", "1 cup Water", "Low-moisture Mozzarella", "San Marzano Tomato Sauce"],
      instructions: "Ferment dough for 24 hours. Stretch very thin. Top lightly with seasoned tomato sauce and mozzarella. Bake at maximum oven temperature on a pizza stone."
    },
    workoutData: {
      activityName: "Central Park Full-Loop Cycling",
      intensity: "Moderate",
      duration: "60 mins",
      caloriesBurned: 500,
      equipment: "Road bike, Helmet",
      description: "A rolling hills cycling session traversing the complete 6.1-mile loop of Central Park. Great for cardiovascular endurance and quad strengthening."
    }
  },
  {
    id: "banff-canada",
    name: "Banff",
    country: "Canada",
    continent: "North America",
    travelType: "nature",
    budgetRange: "medium",
    image: "assets/destinations/banff.jpg",
    description: "Banff National Park is Canada's oldest national park, established in 1885. Located in the Rocky Mountains, west of Calgary in the province of Alberta, it encompasses mountainous terrain, with glaciers and ice fields.",
    attractions: [
      "Lake Louise & Moraine Lake Canoe Tour",
      "Banff Gondola to Sulphur Mountain",
      "Johnston Canyon Ice Walk",
      "Banff Upper Hot Springs"
    ],
    costs: {
      budget: { accommodation: 40, food: 20, transport: 10 },
      moderate: { accommodation: 130, food: 48, transport: 22 },
      luxury: { accommodation: 350, food: 110, transport: 50 }
    },
    recipeData: {
      dishName: "Canadian Maple Pecan Tart",
      difficulty: "Medium",
      prepTime: "50 mins",
      ingredients: ["Pastry Crust", "1 cup Pure Maple Syrup", "3/4 cup Brown Sugar", "3 Eggs", "1.5 cups Pecan Halves"],
      instructions: "Whisk maple syrup, brown sugar, melted butter, and eggs. Place pecans in pastry shell, pour maple mixture over, and bake at 175°C until set."
    },
    workoutData: {
      activityName: "Johnston Canyon Snowshoe Trek",
      intensity: "Moderate",
      duration: "120 mins",
      caloriesBurned: 650,
      equipment: "Snowshoes, Insulated boots, Trekking poles",
      description: "A winter hike along suspended catwalks over frozen waterfalls. Walking on snowshoes increases resistance, targeting hamstrings and hip flexors."
    }
  },
  {
    id: "rio-de-janeiro-brazil",
    name: "Rio de Janeiro",
    country: "Brazil",
    continent: "South America",
    travelType: "adventure",
    budgetRange: "medium",
    image: "assets/destinations/rio.jpg",
    description: "Rio de Janeiro is a huge seaside city in Brazil, famed for its Copacabana and Ipanema beaches, 38m Christ the Redeemer statue atop Mount Corcovado and for Sugarloaf Mountain, a granite peak.",
    attractions: [
      "Christ the Redeemer Statue",
      "Sugarloaf Mountain Cable Car",
      "Copacabana Beach Boardwalk",
      "Tijuca Forest National Park Hike"
    ],
    costs: {
      budget: { accommodation: 20, food: 10, transport: 5 },
      moderate: { accommodation: 65, food: 25, transport: 12 },
      luxury: { accommodation: 200, food: 70, transport: 35 }
    },
    recipeData: {
      dishName: "Classic Brazilian Feijoada",
      difficulty: "Hard",
      prepTime: "3 hours",
      ingredients: ["500g Black Beans", "200g Smoked Sausage", "200g Pork Ribs", "Garlic, Bay Leaves", "Oranges, White Rice"],
      instructions: "Soak beans overnight. Simmer beans slowly with ribs, sausage, garlic, and bay leaves until rich and thick. Serve with rice and orange slices."
    },
    workoutData: {
      activityName: "Copacabana Beach Volley & Calisthenics",
      intensity: "High",
      duration: "90 mins",
      caloriesBurned: 750,
      equipment: "Beach attire, Volleyball",
      description: "An intensive sand workout utilizing beach volleyball and bodyweight training on Copacabana's fitness stations. Sand resistance increases lower body strength."
    }
  },
  {
    id: "machu-picchu-peru",
    name: "Machu Picchu",
    country: "Peru",
    continent: "South America",
    travelType: "cultural",
    budgetRange: "medium",
    image: "assets/destinations/machupicchu.jpg",
    description: "Machu Picchu is an Incan citadel set high in the Andes Mountains in Peru, above the Urubamba River valley. Built in the 15th century and later abandoned, it’s renowned for its sophisticated dry-stone walls.",
    attractions: [
      "Machu Picchu Citadel Guided Tour",
      "Huayna Picchu Mountain Climb",
      "Inca Bridge Walk",
      "Intipuncu (Sun Gate)"
    ],
    costs: {
      budget: { accommodation: 18, food: 8, transport: 12 },
      moderate: { accommodation: 55, food: 22, transport: 35 },
      luxury: { accommodation: 250, food: 75, transport: 90 }
    },
    recipeData: {
      dishName: "Peruvian Ceviche Clásico",
      difficulty: "Medium",
      prepTime: "20 mins",
      ingredients: ["300g Fresh Sea Bass", "1/2 cup Lime Juice", "1 Red Onion", "1 Rocoto Chili", "Cilantro, Sweet Potato"],
      instructions: "Slice fish thinly, marinate in fresh lime juice for 10 minutes. Toss with thinly sliced onions, chili, and cilantro. Serve with boiled sweet potato."
    },
    workoutData: {
      activityName: "Huayna Picchu Steep Ridge Stair Climb",
      intensity: "High",
      duration: "150 mins",
      caloriesBurned: 900,
      equipment: "Trail shoes, High-altitude hydration pack",
      description: "A steep, vertical climb up the narrow stone steps built by the Incas. Involves thin alpine air (altitude conditioning) and intense hamstring/calf work."
    }
  },
  {
    id: "sydney-australia",
    name: "Sydney",
    country: "Australia",
    continent: "Oceania",
    travelType: "relaxation",
    budgetRange: "high",
    image: "assets/destinations/sydney.jpg",
    description: "Sydney, capital of New South Wales and one of Australia's largest cities, is best known for its Sydney Opera House, with a distinctive sail-like design. Darling Harbour and the smaller Circular Quay port are hubs of waterside life.",
    attractions: [
      "Sydney Opera House Backstage Tour",
      "Sydney Harbour Bridge climb",
      "Bondi to Coogee Coastal Walk",
      "Taronga Zoo Sydney"
    ],
    costs: {
      budget: { accommodation: 45, food: 20, transport: 10 },
      moderate: { accommodation: 135, food: 50, transport: 22 },
      luxury: { accommodation: 360, food: 130, transport: 55 }
    },
    recipeData: {
      dishName: "Australian Lamington Cakes",
      difficulty: "Medium",
      prepTime: "60 mins",
      ingredients: ["Sponge Cake", "2 cups Powdered Sugar", "1/3 cup Cocoa Powder", "1/2 cup Milk", "2 cups Desiccated Coconut"],
      instructions: "Bake sponge cake, cool and cut into squares. Mix sugar, cocoa, and milk to make chocolate glaze. Dip cake in glaze, then roll in coconut."
    },
    workoutData: {
      activityName: "Bondi Beach Coastal Soft-Sand Jog",
      intensity: "Moderate",
      duration: "45 mins",
      caloriesBurned: 400,
      equipment: "Swimwear, Barefoot or running shoes",
      description: "A soft-sand running workout along the length of Bondi beach, followed by a cool-down swim. Excellent calf development and joint stability."
    }
  },
  {
    id: "marrakech-morocco",
    name: "Marrakech",
    country: "Morocco",
    continent: "Africa",
    travelType: "cultural",
    budgetRange: "low",
    image: "assets/destinations/marrakech.jpg",
    description: "Marrakech, a former imperial city in western Morocco, is a major economic center and home to mosques, palaces and gardens. The medina is a densely packed, walled medieval city dating to the Berber Empire.",
    attractions: [
      "Jardin Majorelle (YSL Gardens)",
      "Bahia Palace (Stunning tile mosaics)",
      "Jemaa el-Fnaa square & night markets",
      "Koutoubia Mosque"
    ],
    costs: {
      budget: { accommodation: 15, food: 6, transport: 4 },
      moderate: { accommodation: 50, food: 18, transport: 10 },
      luxury: { accommodation: 180, food: 50, transport: 25 }
    },
    recipeData: {
      dishName: "Fragrant Lamb Tagine",
      difficulty: "Hard",
      prepTime: "2 hours",
      ingredients: ["500g Lamb Shoulder", "1 Ras el Hanout Spice Blend", "1/2 cup Dried Apricots", "1 Onion", "Saffron threads, Almonds"],
      instructions: "Brown lamb in clay tagine with onions. Add spices, saffron, and water. Simmer on low heat for 1.5 hours. Stir in apricots, garnish with toasted almonds."
    },
    workoutData: {
      activityName: "Ourika Valley Atlas Foothills Trek",
      intensity: "Moderate",
      duration: "3 hours",
      caloriesBurned: 800,
      equipment: "Trail sneakers, Hydration pack",
      description: "A hike up the rocky trails of the Ourika Valley in the foothills of the High Atlas Mountains. Involves climbing across boulder beds and waterfalls."
    }
  },
  {
    id: "costa-rica",
    name: "Costa Rica (La Fortuna)",
    country: "Costa Rica",
    continent: "North America",
    travelType: "nature",
    budgetRange: "low",
    image: "assets/destinations/costarica.jpg",
    description: "Costa Rica is a rugged, rainforested Central American country with coastlines on the Caribbean and Pacific. La Fortuna, under the Arenal Volcano, is famous for geothermal hot springs, mist-shrouded canopy walks, and active wildlife.",
    attractions: [
      "Arenal Volcano National Park hike",
      "La Fortuna Waterfall swim",
      "Mistico Arenal Hanging Bridges walk",
      "Tabacon Natural Hot Springs"
    ],
    costs: {
      budget: { accommodation: 18, food: 8, transport: 6 },
      moderate: { accommodation: 55, food: 22, transport: 15 },
      luxury: { accommodation: 210, food: 65, transport: 35 }
    },
    recipeData: {
      dishName: "Traditional Gallo Pinto",
      difficulty: "Easy",
      prepTime: "15 mins",
      ingredients: ["2 cups Cooked Rice", "1.5 cups Cooked Black Beans", "2 tbsp Salsa Lizano", "1 Onion & Bell pepper", "Fresh Coriander"],
      instructions: "Sauté chopped onion and bell pepper. Add black beans and Salsa Lizano. Stir in cooked rice, cook until hot and dry. Stir in fresh coriander."
    },
    workoutData: {
      activityName: "Rainforest Canopy Sea Kayak & Paddleboarding",
      intensity: "Moderate",
      duration: "120 mins",
      caloriesBurned: 550,
      equipment: "Swim vest, Water shoes, Dry bag",
      description: "A core-strengthening paddling workout across Lake Arenal under the shadow of the volcano. Perfect for shoulders, back, and balance."
    }
  }
];

// Travel quotes for Homepage Hero rotation
const travelQuotes = [
  { text: "The world is a book and those who do not travel read only one page.", author: "Saint Augustine" },
  { text: "Travel is the only thing you buy that makes you richer.", author: "Anonymous" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "To travel is to live.", author: "Hans Christian Andersen" },
  { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" }
];

// If node environment exists, export for potential node tests (otherwise browser runs it as global)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { travelDestinations, travelQuotes };
}
