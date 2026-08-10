const axios = require('axios');
const { getRedisClient } = require('../config/redis');

const PERENUAL_BASE_URL = 'https://perenual.com/api/v2';

const searchPlants = async (query) => {
  const redisClient = getRedisClient();
  const cacheKey = `plants:search:${query}`;

  try {
    // Check cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // Fetch from API
    const response = await axios.get(`${PERENUAL_BASE_URL}/species-list`, {
      params: {
        key: process.env.PERENUAL_API_KEY,
        q: query,
      },
    });

    // Format minimal data
    const formattedData = response.data.data.map(plant => ({
      id: plant.id,
      common_name: plant.common_name,
      scientific_name: plant.scientific_name ? plant.scientific_name[0] : null,
      default_image: plant.default_image ? plant.default_image.regular_url : null,
      genus: plant.genus || 'Unknown',
      family: plant.family,
      species_epithet: plant.species_epithet,
    }));

    // Cache for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(formattedData));

    return formattedData;
  } catch (error) {
    console.error('Error in searchPlants service:', error.message);
    throw new Error('Failed to search plants');
  }
};

const getPlantDetails = async (id) => {
  const redisClient = getRedisClient();
  const cacheKey = `plants:details:${id}`;

  try {
    // Check cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // Fetch from API
    const response = await axios.get(`${PERENUAL_BASE_URL}/species/details/${id}`, {
      params: {
        key: process.env.PERENUAL_API_KEY,
      },
    });

    const plant = response.data;

    // Process data: Format and ignore nulls
    const formattedData = {
      id: plant.id,
      name: plant.common_name,
      scientificName: plant.scientific_name ? plant.scientific_name[0] : null,
      family: plant.family,
      genus: plant.genus,
      type: plant.type,
      cycle: plant.cycle,
      origin: plant.origin,
      description: plant.description,
      sunlight: plant.sunlight,
      watering: plant.watering,
      watering_benchmark: plant.watering_general_benchmark ? `${plant.watering_general_benchmark.value} ${plant.watering_general_benchmark.unit}` : null,
      maintenance: plant.maintenance,
      indoor: plant.indoor,
      care_level: plant.care_level,
      growth_rate: plant.growth_rate,
      drought_tolerant: plant.drought_tolerant,
      medicinal: plant.medicinal,
      poisonous_to_humans: plant.poisonous_to_humans,
      poisonous_to_pets: plant.poisonous_to_pets,
      propagation: plant.propagation,
      default_image: plant.default_image ? plant.default_image.regular_url : null,
    };

    // Remove any null properties cleanly
    Object.keys(formattedData).forEach(key => {
      if (formattedData[key] === null || formattedData[key] === undefined || (Array.isArray(formattedData[key]) && formattedData[key].length === 0)) {
        delete formattedData[key];
      }
    });

    // Cache for 24 hours (Plant details rarely change)
    await redisClient.setEx(cacheKey, 86400, JSON.stringify(formattedData));

    return formattedData;
  } catch (error) {
    console.error(`Error in getPlantDetails service for id ${id}:`, error.message);
    throw new Error('Failed to fetch plant details');
  }
};

module.exports = {
  searchPlants,
  getPlantDetails
};
