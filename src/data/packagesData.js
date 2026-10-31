export const INITIAL_PACKAGES = [
  {
    id: "pkg-ladakh-expedition",
    title: "Magical Ladakh Expedition",
    destination: "Ladakh, India",
    destinationId: "ladakh-india",
    category: "Mountains",
    duration: "6 Days / 5 Nights",
    daysCount: 6,
    nightsCount: 5,
    price: 28999,
    originalPrice: 34999,
    rating: 4.9,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
    overview: "Experience high-altitude drama with snow-kissed passes, pristine Pangong Tso, and camel rides in the Nubra sand dunes.",
    hotelInfo: "4-Star Mountain Lodges & Deluxe Heated Tents in Nubra & Pangong",
    transportInfo: "Private 4x4 SUV (Innova / Fortuner) with experienced mountain driver throughout",
    inclusions: [
      "5 Nights accommodation (Double Sharing)",
      "Daily breakfast and dinner (Buffet)",
      "Dedicated 4x4 SUV vehicle for all transfers & sightseeing",
      "Inner Line Permits & Environmental fees",
      "Oxygen cylinder in vehicle for high altitude emergencies",
      "Pick up & drop from Leh Kushok Bakula Rimpochee Airport"
    ],
    exclusions: [
      "Airfare / Train tickets to and from Leh",
      "Lunch and personal snacks",
      "Camel rides and river rafting charges",
      "Travel insurance (recommended)",
      "Any expenses caused by unforeseen roadblocks or weather delays"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Leh & Acclimatization",
        description: "Land at Leh Airport. Check in at hotel and rest completely for mandatory acclimatization. Gentle evening walk to Shanti Stupa for sunset.",
        stay: "Grand Dragon Hotel or similar, Leh"
      },
      {
        day: 2,
        title: "Sham Valley Sightseeing & Hall of Fame",
        description: "Visit Hall of Fame war memorial, Magnetic Hill optical illusion, Gurudwara Pathar Sahib, and the dramatic confluence of Indus and Zanskar rivers.",
        stay: "Grand Dragon Hotel, Leh"
      },
      {
        day: 3,
        title: "Leh to Nubra Valley via Khardung La (17,582 ft)",
        description: "Cross one of the highest motorable passes in the world. Descend into Nubra Valley, check into deluxe camps, and enjoy Bactrian camel safari in Hunder dunes.",
        stay: "Deluxe Organic Camps, Nubra"
      },
      {
        day: 4,
        title: "Nubra Valley to Pangong Tso via Shyok River",
        description: "Scenic off-road drive along the Shyok River route to the world-famous Pangong Lake. Witness dramatic evening colors mirroring on crystal blue waters.",
        stay: "Lakeside Luxury Cottage Tents, Pangong"
      },
      {
        day: 5,
        title: "Pangong Tso Sunrise & Return to Leh via Chang La",
        description: "Capture the morning glow on Pangong lake. Drive back to Leh crossing Chang La Pass (17,590 ft). Visit Thiksey Monastery en route.",
        stay: "Grand Dragon Hotel, Leh"
      },
      {
        day: 6,
        title: "Departure from Leh",
        description: "Early morning transfer to Leh Airport with unforgettable Himalayan memories.",
        stay: "Tour Concludes"
      }
    ],
    isPopular: true
  },
  {
    id: "pkg-goa-bliss",
    title: "Goa Coastal Bliss & Heritage Retreat",
    destination: "Goa, India",
    destinationId: "goa-beaches-india",
    category: "Beaches",
    duration: "4 Days / 3 Nights",
    daysCount: 4,
    nightsCount: 3,
    price: 16499,
    originalPrice: 20999,
    rating: 4.8,
    reviewsCount: 220,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    overview: "The ideal balance of sun-kissed beaches, Portuguese heritage architecture, water sports, and seaside dining.",
    hotelInfo: "4-Star Beachfront Boutique Resort with Infinity Pool & Private Beach Access",
    transportInfo: "AC Sedan / SUV for airport transfers & private day tours; rental scooter allowance included",
    inclusions: [
      "3 Nights stay in luxury garden/pool view room",
      "Daily gourmet buffet breakfast",
      "Complimentary airport/railway station transfers in AC vehicle",
      "South Goa heritage and Old Goa churches guided day tour",
      "1-Hour Mandovi river sunset cruise voucher",
      "Welcome drink and fruit basket on arrival"
    ],
    exclusions: [
      "Water sports activities (jet ski, parasailing, scuba)",
      "Lunch and dinner expenses (unless specified)",
      "Alcoholic beverages and club entry fees",
      "Personal tips and laundry services"
    ],
    itinerary: [
      {
        day: 1,
        title: "Welcome to Goa & Beach Leisure",
        description: "Arrive at Goa Airport / Thivim Station. Transfer to your beach resort. Relax by the pool or enjoy a golden sunset walk along Candolim beach.",
        stay: "Resort Rio / Vivanta by Taj or similar, North Goa"
      },
      {
        day: 2,
        title: "North Goa Beaches & Fort Aguada",
        description: "Visit 17th-century Fort Aguada, Sinquerim lighthouse, followed by water sports thrills at Baga beach and sunset dining at Vagator cliffs.",
        stay: "Resort Rio, North Goa"
      },
      {
        day: 3,
        title: "Old Goa Heritage & Mandovi River Cruise",
        description: "Explore UNESCO World Heritage Basilica of Bom Jesus and Se Cathedral. Stroll through the colorful Portuguese quarter of Fontainhas, topped with an evening sunset cruise.",
        stay: "Resort Rio, North Goa"
      },
      {
        day: 4,
        title: "Souvenir Shopping & Departure",
        description: "Leisurely breakfast, pick up Goan cashew nuts and spices at Mapusa bazaar, followed by drop-off at Goa Airport.",
        stay: "Tour Concludes"
      }
    ],
    isPopular: true
  },
  {
    id: "pkg-rajasthan-royal",
    title: "Royal Rajasthan Heritage Odyssey",
    destination: "Jaipur & Udaipur, India",
    destinationId: "jaipur-rajasthan-india",
    category: "Historical",
    duration: "5 Days / 4 Nights",
    daysCount: 5,
    nightsCount: 4,
    price: 21999,
    originalPrice: 26500,
    rating: 4.8,
    reviewsCount: 168,
    image: "https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?auto=format&fit=crop&w=1200&q=80",
    overview: "Walk through majestic amber ramparts, royal palace courtyards, and tranquil lakes steeped in chivalric history.",
    hotelInfo: "Heritage Haveli & 4-Star Palatial Hotels with Royal Rajput Hospitality",
    transportInfo: "Chauffeur-driven AC Sedan / Ertiga for all city tours and intercity transfer",
    inclusions: [
      "4 Nights accommodation in heritage properties (2N Jaipur + 2N Udaipur)",
      "Daily Royal breakfast buffet",
      "Intercity transfers in AC private vehicle",
      "Composite monument entrance passes in Jaipur",
      "Sunset boat ride on Lake Pichola in Udaipur",
      "Local government certified English/Hindi speaking guides"
    ],
    exclusions: [
      "Monument camera/video recording charges",
      "Meals other than breakfast",
      "Personal shopping and souvenirs",
      "Hot air balloon safari"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in the Pink City Jaipur",
        description: "Arrive in Jaipur. Visit Birla Temple and City Palace. Evening stroll through the colourful Johari Bazaar.",
        stay: "Alsisar Haveli / Diggi Palace, Jaipur"
      },
      {
        day: 2,
        title: "Amber Fort & Architectural Wonders",
        description: "Visit magnificent Amber Fort including Sheesh Mahal, stop at Jal Mahal for photo ops, and explore the iconic Hawa Mahal and Jantar Mantar.",
        stay: "Alsisar Haveli, Jaipur"
      },
      {
        day: 3,
        title: "Jaipur to the City of Lakes (Udaipur)",
        description: "Scenic drive from Jaipur to Udaipur (approx. 6 hrs). Check into lake-view hotel and enjoy sunset at Ambrai Ghat.",
        stay: "Fateh Garh Heritage Resort, Udaipur"
      },
      {
        day: 4,
        title: "Udaipur City Palace & Lake Pichola Boat Cruise",
        description: "Marvel at Udaipur City Palace, Saheliyon Ki Bari, and enjoy a private sunset boat cruise past Jag Mandir on Lake Pichola.",
        stay: "Fateh Garh Heritage Resort, Udaipur"
      },
      {
        day: 5,
        title: "Departure from Udaipur",
        description: "Breakfast with panoramic lake views. Transfer to Udaipur Airport or Railway Station.",
        stay: "Tour Concludes"
      }
    ],
    isPopular: false
  },
  {
    id: "pkg-kerala-paradise",
    title: "Kerala Backwaters & Munnar Hills",
    destination: "Kerala, India",
    destinationId: "kerala-backwaters-india",
    category: "Wildlife",
    duration: "6 Days / 5 Nights",
    daysCount: 6,
    nightsCount: 5,
    price: 24999,
    originalPrice: 30000,
    rating: 4.9,
    reviewsCount: 195,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    overview: "Misty tea-covered hills of Munnar, wildlife in Periyar, and an authentic overnight backwater cruise in Alleppey.",
    hotelInfo: "Hilltop Tea Plantation Resort + Private Luxury Air-Conditioned Houseboat",
    transportInfo: "Exclusive AC Sedan with courteous English/Malayalam speaking driver",
    inclusions: [
      "5 Nights accommodation (2N Munnar + 1N Thekkady + 1N Alleppey Houseboat + 1N Cochin)",
      "Daily breakfast at hotels + All 3 meals on Houseboat",
      "Full day Munnar tea estate and Eravikulam National Park tour",
      "Spice plantation guided walk in Thekkady",
      "Private AC houseboat cruise through Alleppey canals"
    ],
    exclusions: [
      "Boat ride tickets inside Periyar Tiger Reserve",
      "Elephant safari / Kathakali performance tickets",
      "Meals during transit",
      "Gratuities and personal tips"
    ],
    itinerary: [
      {
        day: 1,
        title: "Cochin to Munnar (Misty Tea Hills)",
        description: "Pick up from Cochin Airport. Drive to Munnar stopping at Cheeyappara and Valara waterfalls. Check into plantation resort.",
        stay: "Fragrant Nature Munnar / Blanket Hotel"
      },
      {
        day: 2,
        title: "Munnar Sightseeing & Eravikulam National Park",
        description: "Spot endangered Nilgiri Tahr at Eravikulam Park. Visit Mattupetty Dam, Echo Point, and Tata Tea Museum with tea tasting session.",
        stay: "Fragrant Nature Munnar"
      },
      {
        day: 3,
        title: "Munnar to Thekkady (Cardamom Hills)",
        description: "Drive through spice hills to Thekkady. Take a guided aromatic spice garden tour and enjoy evening martial arts (Kalaripayattu) show.",
        stay: "Elephant Court / Cardamom County, Thekkady"
      },
      {
        day: 4,
        title: "Thekkady to Alleppey Houseboat",
        description: "Board your private thatched houseboat by noon. Cruise through Vembanad Lake, palm canals, and rural paddy fields. Freshly cooked Kerala dinner on board.",
        stay: "Private Premium Houseboat, Alleppey"
      },
      {
        day: 5,
        title: "Alleppey to Historic Fort Kochi",
        description: "Disembark after breakfast. Drive to Fort Kochi. Visit iconic Chinese Fishing Nets, St. Francis Church, and Jewish Synagogue.",
        stay: "Forte Kochi Heritage Hotel"
      },
      {
        day: 6,
        title: "Departure from Cochin",
        description: "Drop-off at Cochin International Airport for your return flight.",
        stay: "Tour Concludes"
      }
    ],
    isPopular: true
  },
  {
    id: "pkg-swiss-alps-dream",
    title: "Swiss Alpine Dream & Glacier Express",
    destination: "Interlaken & Zermatt, Switzerland",
    destinationId: "swiss-alps-switzerland",
    category: "Mountains",
    duration: "7 Days / 6 Nights",
    daysCount: 7,
    nightsCount: 6,
    price: 149999,
    originalPrice: 175000,
    rating: 5.0,
    reviewsCount: 112,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    overview: "Ascend to the Top of Europe at Jungfraujoch, ride the panoramic Glacier Express, and gaze at the Matterhorn in Zermatt.",
    hotelInfo: "4-Star Swiss Alpine Chalets with Mountain Balcony Views",
    transportInfo: "First-Class Swiss Travel Pass (Unlimited trains, boats, buses & museum entries)",
    inclusions: [
      "6 Nights accommodation in Zurich, Interlaken, and Zermatt",
      "Daily Swiss artisan breakfast buffet",
      "8-Day 1st Class Swiss Travel Pass",
      "Excursion ticket to Jungfraujoch (3,454m)",
      "Gornergrat cogwheel railway ticket for Matterhorn views",
      "Glacier Express panoramic seat reservation"
    ],
    exclusions: [
      "International flights to Zurich / Geneva",
      "Schengen Visa fees & processing",
      "Lunch and dinner expenses",
      "Ski equipment rental (if applicable)"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Zurich & Transfer to Lucerne",
        description: "Arrive at Zurich Airport. Board the Swiss train to Lucerne. Walk across Chapel Bridge and relax beside Lake Lucerne.",
        stay: "Hotel Schweizerhof, Lucerne"
      },
      {
        day: 2,
        title: "Lucerne to Interlaken & Lauterbrunnen",
        description: "Panoramic train ride over Brünig Pass to Interlaken. Afternoon excursion to Lauterbrunnen's magical 72 waterfalls.",
        stay: "Victoria-Jungfrau Grand Hotel or similar, Interlaken"
      },
      {
        day: 3,
        title: "Jungfraujoch – The Top of Europe",
        description: "Board the Eiger Express gondola and cogwheel train up to Jungfraujoch. Walk through the Ice Palace and step onto the Sphinx observation deck.",
        stay: "Victoria-Jungfrau, Interlaken"
      },
      {
        day: 4,
        title: "Glacier Express to Zermatt",
        description: "Board the legendary Glacier Express through snow-capped valleys and over stone viaducts to car-free Zermatt.",
        stay: "Grand Hotel Zermatterhof, Zermatt"
      },
      {
        day: 5,
        title: "Gornergrat Viewpoint & Matterhorn Reflection",
        description: "Take the historic cogwheel train to Gornergrat (3,089m). Walk to Riffelsee to capture the mirror reflection of the iconic Matterhorn.",
        stay: "Grand Hotel Zermatterhof, Zermatt"
      },
      {
        day: 6,
        title: "Zermatt to Zurich City Exploration",
        description: "Scenic train back to Zurich. Stroll along Bahnhofstrasse, explore Old Town (Altstadt), and enjoy fondue by Lake Zurich.",
        stay: "Baur au Lac or Boutique Swiss Hotel, Zurich"
      },
      {
        day: 7,
        title: "Departure from Zurich",
        description: "Train directly to Zurich Airport for your international journey back home.",
        stay: "Tour Concludes"
      }
    ],
    isPopular: true
  },
  {
    id: "pkg-bali-escape",
    title: "Bali Tropical Escape & Nusa Penida",
    destination: "Bali, Indonesia",
    destinationId: "bali-indonesia",
    category: "Beaches",
    duration: "6 Days / 5 Nights",
    daysCount: 6,
    nightsCount: 5,
    price: 48999,
    originalPrice: 58000,
    rating: 4.9,
    reviewsCount: 230,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    overview: "Ubud jungle villas, sunrise volcano trek, Instagram-worthy Bali swings, and speedboat day trip to Nusa Penida island.",
    hotelInfo: "Private Pool Villa in Ubud + 5-Star Beach Resort in Seminyak",
    transportInfo: "Private air-conditioned MPV with dedicated Balinese English-speaking guide",
    inclusions: [
      "3 Nights Private Pool Villa in Ubud + 2 Nights Luxury Resort in Seminyak",
      "Daily American/Indonesian breakfast",
      "Speedboat roundtrip transfers to Nusa Penida Island with private island car",
      "Mount Batur sunrise trek with breakfast prepared on volcanic steam",
      "All monument entrance fees & parking tickets",
      "Complimentary Balinese 60-minute couples massage"
    ],
    exclusions: [
      "International flights to Denpasar (DPS)",
      "Indonesian Visa on Arrival ($35 USD) & Tourist levy",
      "Lunches and dinners",
      "Personal tip to trek guides and drivers"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Denpasar & Ubud Villa Check-in",
        description: "Traditional Balinese flower garland welcome at DPS Airport. Private transfer to Ubud private pool villa. Evening free to relax.",
        stay: "Maya Ubud Resort & Spa"
      },
      {
        day: 2,
        title: "Ubud Culture, Tegallalang & Bali Swing",
        description: "Visit Sacred Monkey Forest, Tegallalang Rice Terraces, take breathtaking photos at the iconic Bali Swing, and visit Tirta Empul holy water temple.",
        stay: "Maya Ubud Resort"
      },
      {
        day: 3,
        title: "Mount Batur Sunrise Trek & Natural Hot Springs",
        description: "Pre-dawn hike up Mount Batur volcano. Watch the sunrise above the clouds while eating eggs cooked on volcanic steam. Soak in Toya Devasya hot springs.",
        stay: "Maya Ubud Resort"
      },
      {
        day: 4,
        title: "Nusa Penida Island Day Excursion",
        description: "Speedboat to Nusa Penida. Visit Kelingking Beach (T-Rex Cliff), Broken Beach, Angel's Billabong, and snorkel with giant Manta rays at Crystal Bay.",
        stay: "W Bali or Courtyard by Marriott, Seminyak"
      },
      {
        day: 5,
        title: "Uluwatu Sunset Temple & Kecak Dance",
        description: "Morning beach time at Seminyak. Afternoon visit to Uluwatu Temple perched 70 meters high on sea cliffs. Witness dramatic Kecak fire dance at dusk.",
        stay: "W Bali, Seminyak"
      },
      {
        day: 6,
        title: "Seminyak Shopping & Airport Departure",
        description: "Last minute souvenir shopping at Seminyak Square and transfer to Denpasar Airport.",
        stay: "Tour Concludes"
      }
    ],
    isPopular: true
  },
  {
    id: "pkg-tokyo-kyoto",
    title: "Tokyo Cyberpunk & Kyoto Zen Odyssey",
    destination: "Tokyo & Kyoto, Japan",
    destinationId: "tokyo-japan",
    category: "City Tours",
    duration: "7 Days / 6 Nights",
    daysCount: 7,
    nightsCount: 6,
    price: 115999,
    originalPrice: 135000,
    rating: 4.9,
    reviewsCount: 98,
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    overview: "Bullet trains, neon Tokyo districts, teamLab digital art, ancient Fushimi Inari torii gates, and bamboo groves.",
    hotelInfo: "4-Star Tokyo City Center Hotel + Traditional Machiya Style Hotel in Kyoto",
    transportInfo: "7-Day Japan Rail (JR) Pass + Shinkansen Bullet Train tickets included",
    inclusions: [
      "4 Nights Tokyo + 2 Nights Kyoto accommodation",
      "Daily Japanese and Continental breakfast",
      "Shinkansen bullet train ticket from Tokyo to Kyoto & back",
      "Pre-booked ticket to teamLab Planets digital art museum",
      "Pocket Wi-Fi device with unlimited 5G data",
      "Half-day guided walking tour through Tokyo’s historic Asakusa"
    ],
    exclusions: [
      "International flights to Tokyo (NRT / HND)",
      "Japan Visa fee",
      "Lunches, dinners, and beverage tabs",
      "Luggage forwarding services (optional)"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Tokyo & Shinjuku Night Walk",
        description: "Arrive at Haneda/Narita Airport. Train to central Tokyo. Check-in and explore the dazzling neon lights of Shinjuku and Omoide Yokocho.",
        stay: "Hotel Gracery Shinjuku, Tokyo"
      },
      {
        day: 2,
        title: "Asakusa, Senso-ji & Akihabara Electric Town",
        description: "Step into ancient Japan at Senso-ji temple, cruise the Sumida river, and spend the afternoon exploring gadget and anime hubs in Akihabara.",
        stay: "Hotel Gracery Shinjuku, Tokyo"
      },
      {
        day: 3,
        title: "Meiji Shrine, Harajuku & Shibuya Crossing",
        description: "Walk the serene forest of Meiji Jingu, explore youth fashion on Takeshita Street, cross the legendary Shibuya scramble, and see Hachiko statue.",
        stay: "Hotel Gracery Shinjuku, Tokyo"
      },
      {
        day: 4,
        title: "Bullet Train to Kyoto & Fushimi Inari Taisha",
        description: "Board the 320 km/h Shinkansen to Kyoto. Check in and hike through the thousands of vermilion torii gates at Fushimi Inari at sunset.",
        stay: "Cross Hotel or Kyoto Century Hotel, Kyoto"
      },
      {
        day: 5,
        title: "Arashiyama Bamboo Grove & Kinkaku-ji (Golden Pavilion)",
        description: "Stroll the towering Arashiyama bamboo forest, cross the Togetsukyo bridge, and gaze upon the gold-leaf reflection of Kinkaku-ji temple.",
        stay: "Kyoto Century Hotel, Kyoto"
      },
      {
        day: 6,
        title: "teamLab Planets & Odaiba Bay",
        description: "Return to Tokyo via bullet train. Experience the mind-expanding water and mirror art at teamLab Planets. Evening view of Rainbow Bridge.",
        stay: "Hotel Gracery Shinjuku, Tokyo"
      },
      {
        day: 7,
        title: "Tsukiji Outer Market & Tokyo Departure",
        description: "Sample fresh sushi and wagyu skewers at Tsukiji Outer Market before taking the Narita Express to the airport.",
        stay: "Tour Concludes"
      }
    ],
    isPopular: false
  },
  {
    id: "pkg-dubai-futuristic",
    title: "Dubai Futuristic Extravaganza & Desert Safari",
    destination: "Dubai, UAE",
    destinationId: "dubai-uae",
    category: "Adventure",
    duration: "5 Days / 4 Nights",
    daysCount: 5,
    nightsCount: 4,
    price: 54999,
    originalPrice: 65000,
    rating: 4.8,
    reviewsCount: 175,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    overview: "Ascend the world's tallest skyscraper, explore futuristic exhibits, cruise Dubai Marina, and thrill in golden desert dunes.",
    hotelInfo: "5-Star Downtown Dubai Hotel with Skyline Pool",
    transportInfo: "AC Luxury Coach / Private transfers for all scheduled tours & desert 4x4",
    inclusions: [
      "4 Nights accommodation in 5-Star downtown hotel",
      "Daily international breakfast buffet",
      "Burj Khalifa 124th & 125th floor At The Top observatory tickets",
      "Museum of the Future entry tickets",
      "Premium 4x4 Desert Safari with dune bashing, camel rides, belly dance & BBQ dinner",
      "Marina Dhow Cruise with international dinner buffet"
    ],
    exclusions: [
      "International flights to Dubai (DXB)",
      "UAE Tourist Visa and Tourism Dirham fee",
      "Personal shopping and souvenirs",
      "Skydiving or helicopter rides (add-ons)"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Dubai & Marina Dhow Cruise",
        description: "Land at Dubai International Airport. Private transfer to your hotel. Evening luxury glass-enclosed Dhow cruise along illuminated Dubai Marina with dinner.",
        stay: "Mövenpick Hotel Downtown / Radisson Blu, Dubai"
      },
      {
        day: 2,
        title: "Burj Khalifa & Dubai Mall Spectacular",
        description: "Ascend to the 124th floor of Burj Khalifa for 360-degree skyline views. Explore Dubai Mall, the world's largest indoor aquarium, and watch the dancing fountain show.",
        stay: "Mövenpick Hotel Downtown, Dubai"
      },
      {
        day: 3,
        title: "Museum of the Future & 4x4 Desert Safari",
        description: "Morning visit to the architectural wonder Museum of the Future. Afternoon pickup in 4x4 Land Cruiser for dune bashing, sandboarding, and Bedouin camp BBQ dinner.",
        stay: "Mövenpick Hotel Downtown, Dubai"
      },
      {
        day: 4,
        title: "Palm Jumeirah, Atlantis & Old Dubai Souks",
        description: "Ride the Palm Monorail to Atlantis, take photos at the Pointe, then head to Old Deira for gold and spice souk bargaining and traditional Abra boat crossing.",
        stay: "Mövenpick Hotel Downtown, Dubai"
      },
      {
        day: 5,
        title: "Departure from Dubai",
        description: "Enjoy a lavish morning buffet and transfer to Dubai International Airport for flight departure.",
        stay: "Tour Concludes"
      }
    ],
    isPopular: true
  }
];
