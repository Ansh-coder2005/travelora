import { INITIAL_DESTINATIONS } from '../data/destinationsData';

export const generateSmartItinerary = ({
  destinationName,
  days = 3,
  budget = 25000,
  travellers = 2,
  interests = ['Culture', 'Sightseeing', 'Food'],
  travelStyle = 'Adventure'
}) => {
  const daysNum = Math.max(1, Math.min(10, parseInt(days) || 3));
  const travellersNum = Math.max(1, parseInt(travellers) || 1);
  const budgetNum = Math.max(5000, parseInt(budget) || 20000);

  // Match destination in database if exists
  const matchedDest = INITIAL_DESTINATIONS.find(
    (d) => d.name.toLowerCase().includes(destinationName.toLowerCase()) ||
           destinationName.toLowerCase().includes(d.name.toLowerCase())
  );

  const styleMultiplier = {
    'Budget': 0.7,
    'Adventure': 1.0,
    'Relaxation': 1.15,
    'Luxury': 1.6
  }[travelStyle] || 1.0;

  // Base daily cost
  const baseDailyPerPerson = matchedDest ? matchedDest.pricePerDay : 4000;
  const calculatedDailyPerPerson = Math.round(baseDailyPerPerson * styleMultiplier);
  const totalEstimatedCost = calculatedDailyPerPerson * daysNum * travellersNum;

  // Specific itineraries or procedural generation
  const itineraryDays = [];

  const genericMorningPool = [
    { title: "Sunrise Viewpoint & Heritage Walking Exploration", desc: "Start the day with fresh morning air at the local scenic viewpoint, followed by a guided walking tour through historic quarters.", spot: "Scenic Ridge & Historic Promenade", food: "Artisan bakery breakfast with local hot brew and freshly baked goods." },
    { title: "Famous Monument & Architectural Masterpiece", desc: "Beat the afternoon crowds by exploring the prime heritage site, palace, or natural landmark with a camera ready.", spot: "Grand Citadel / Nature Sanctuary", food: "Local specialty breakfast counter or traditional cafe." },
    { title: "Nature Trail & Botanical Gardens", desc: "Gentle trek or stroll through lush garden trails and peaceful water bodies with panoramic valley or ocean views.", spot: "Botanical Reserves / Cliffside Trail", food: "Fresh tropical fruit smoothies and savory pancakes." },
    { title: "Local Market Discovery & Traditional Crafts", desc: "Immerse in the sights and scents of morning farmer and craft bazaars. Watch traditional artisans at work.", spot: "Central Artisan Marketplace", food: "Steaming street-side breakfast delicacies and tea." }
  ];

  const genericAfternoonPool = [
    { title: "Cultural Museum & Guided Art Tour", desc: "Escape the midday heat inside regional museums and contemporary art galleries showcasing heritage and artifacts.", spot: "State Museum of Art & Culture", food: "Authentic regional lunch featuring local thali or seasonal delicacies." },
    { title: "Adventure Excursion / Scenic Lake Cruise", desc: "Engage in tailored outdoor activities matching your interests—such as river rafting, boating, or zip-lining.", spot: "Adventure Outpost & Lake Shore", food: "Lakeside bistro meal with local culinary treats." },
    { title: "Culinary Tasting & Cooking Workshop", desc: "Interactive session learning traditional recipes and food traditions from local culinary experts.", spot: "Culinary Studio / Spice Center", food: "Self-cooked gourmet lunch accompanied by organic beverages." },
    { title: "Panoramic Viewpoint & Cable Car Ride", desc: "Ride the cable car or scenic road up to the top summit for 360-degree vistas.", spot: "Summit Observatory & Glass Skywalk", food: "Sky-high restaurant lunch overlooking the landscape." }
  ];

  const genericEveningPool = [
    { title: "Sunset Golden Hour & Scenic Promenade", desc: "Watch the sun dip below the horizon with vibrant sky colors. Unwind by the waterfront promenade or rooftop patio.", spot: "Sunset Point / Riverfront Esplanade", food: "Dinner at a premier rooftop restaurant with live acoustic melodies." },
    { title: "Night Bazaar & Vibrant Cultural Show", desc: "Experience the lively night atmosphere with local folk dance, acoustic performances, and handcrafted souvenirs.", spot: "Cultural Amphitheatre & Night Market", food: "Street food crawl sampling skewers, sweets, and hot spiced drinks." },
    { title: "Candlelight Dinner & Ambient Lounge", desc: "Celebrate an unforgettable day with gourmet fine dining, signature cocktails, and soothing ambient music.", spot: "Signature Lounge / Heritage Courtyard", food: "Chef's 4-course curated dinner featuring fusion dishes." },
    { title: "Star Gazing & Evening Bonfire", desc: "Cozy up around an evening campfire under pristine starlit skies with storytelling and acoustic songs.", spot: "Open Air Glamping Arena", food: "Barbecue grill dinner with roasted marshmallows and spiced cider." }
  ];

  for (let d = 1; d <= daysNum; d++) {
    let dayMorning, dayAfternoon, dayEvening, topSpot, mealTip;

    if (matchedDest) {
      const attractions = matchedDest.topAttractions || [];
      const activities = matchedDest.popularActivities || [];
      const attr1 = attractions[(d - 1) % attractions.length];
      const attr2 = attractions[d % attractions.length];
      const act = activities[(d - 1) % activities.length];

      dayMorning = {
        title: `Explore ${attr1 ? attr1.name : "Iconic Landmark"}`,
        desc: attr1 ? attr1.description : `Morning tour of the top landmark in ${matchedDest.name}.`,
        spot: attr1 ? attr1.name : matchedDest.name + " Main Square",
        food: `Traditional breakfast with local brew at an authentic cafe near ${attr1 ? attr1.name : "the center"}.`
      };

      dayAfternoon = {
        title: act || `Guided Tour of ${attr2 ? attr2.name : "Cultural District"}`,
        desc: `Spend the afternoon enjoying ${act ? act.toLowerCase() : "cultural exploration and regional delicacies"}.`,
        spot: attr2 ? attr2.name : matchedDest.name + " Scenic Quarter",
        food: `Authentic regional thali/lunch plate highlighting local seasonal produce.`
      };

      dayEvening = {
        title: `Sunset Experience & Leisure at ${matchedDest.name}`,
        desc: `Relax as twilight illuminates the city. Perfect for relaxed photography and local souvenir hunting.`,
        spot: `${matchedDest.name} Viewpoint & Promenade`,
        food: `Curated evening dinner with local specialties and relaxing ambiance.`
      };

      topSpot = attr1 ? attr1.name : matchedDest.name;
      mealTip = `Try signature ${matchedDest.region || matchedDest.name} dishes and visit verified hygienic eateries.`;
    } else {
      const morningItem = genericMorningPool[(d - 1) % genericMorningPool.length];
      const afternoonItem = genericAfternoonPool[(d - 1) % genericAfternoonPool.length];
      const eveningItem = genericEveningPool[(d - 1) % genericEveningPool.length];

      dayMorning = morningItem;
      dayAfternoon = afternoonItem;
      dayEvening = eveningItem;
      topSpot = `${destinationName} Highlight Spot #${d}`;
      mealTip = `Sample regional specialties recommended by local concierges.`;
    }

    const dailyBudgetPerGroup = Math.round(calculatedDailyPerPerson * travellersNum);

    itineraryDays.push({
      day: d,
      theme: d === 1 ? "Arrival, Orientation & Sunset Glow" : d === daysNum ? "Grand Finale & Souvenir Exploration" : `Adventure & Cultural Deep Dive`,
      morning: dayMorning,
      afternoon: dayAfternoon,
      evening: dayEvening,
      suggestedAttractions: [dayMorning.spot, dayAfternoon.spot, dayEvening.spot],
      foodRecommendations: {
        breakfast: dayMorning.food,
        lunch: dayAfternoon.food,
        dinner: dayEvening.food,
        tip: mealTip
      },
      estimatedDailyExpenses: {
        hotel: Math.round(dailyBudgetPerGroup * 0.45),
        food: Math.round(dailyBudgetPerGroup * 0.25),
        travel: Math.round(dailyBudgetPerGroup * 0.15),
        activities: Math.round(dailyBudgetPerGroup * 0.15),
        total: dailyBudgetPerGroup
      }
    });
  }

  return {
    id: `plan-${Date.now()}`,
    destination: destinationName,
    matchedDestination: matchedDest || null,
    days: daysNum,
    travellers: travellersNum,
    travelStyle,
    interests,
    createdAt: new Date().toISOString(),
    isAIGenerated: true,
    totalBudgetRequested: budgetNum,
    totalEstimatedCost,
    costPerTraveller: Math.round(totalEstimatedCost / travellersNum),
    budgetStatus: totalEstimatedCost <= budgetNum ? "Within Budget" : "Slightly Over Budget (Adjust style or days)",
    budgetDifference: totalEstimatedCost - budgetNum,
    daysItinerary: itineraryDays,
    aiRecommendationNote: `Generated via Travelora Smart Rule Engine (2026 Edition). Optimized for a ${travelStyle} travel experience covering ${interests.join(', ')}.`
  };
};
