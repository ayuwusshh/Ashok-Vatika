import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Droplets,
  Sun,
  Activity,
  Info,
  Leaf,
  ShieldAlert,
  HeartPulse,
  AlertTriangle,
  Sprout,
  Globe,
  CheckCircle2,
} from "lucide-react";
import Loader from "../components/Loader";
import Button from "../components/Button";

const PlantDetails = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/plants/${id}`,
        );
        setPlant(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load plant details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <Loader fullScreen text="Loading plant details..." />;

  if (error || !plant) {
    return (
      <div className="py-24 text-center max-w-2xl mx-auto">
        <ShieldAlert className="h-16 w-16 text-brand-error mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-brand-primary mb-4">
          Oops! Plant not found
        </h2>
        <p className="text-brand-on-surface-variant mb-8">
          {error || "We couldn't find the details for this plant."}
        </p>
        <Link to="/search">
          <Button>Back to Search</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Banner */}
      <div className="relative h-[400px] md:h-[500px] w-full bg-brand-surface-dim overflow-hidden">
        {plant.default_image ? (
          <img
            src={plant.default_image}
            alt={plant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Leaf className="h-32 w-32 text-brand-on-surface-variant/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-7xl mx-auto">
          <Link
            to="/search"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
          </Link>
          <div className="flex flex-wrap items-center gap-4 mb-2">
            {plant.family && (
              <span className="px-3 py-1 bg-brand-primary/80 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wide">
                {plant.family}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2 capitalize">
            {plant.name}
          </h1>
          <p className="text-xl text-white/80 italic font-medium">
            {plant.scientificName}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {plant.description && (
              <section>
                <div className="flex items-center mb-6">
                  <div className="bg-brand-primary/10 p-2 rounded-xl mr-4">
                    <Info className="h-6 w-6 text-brand-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-brand-primary">
                    About this plant
                  </h2>
                </div>
                <div className="prose prose-brand max-w-none text-brand-on-surface-variant leading-relaxed">
                  <p>{plant.description}</p>
                </div>
              </section>
            )}

            {/* Tags/Attributes */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {plant.sunlight && plant.sunlight.length > 0 && (
                <div className="bg-brand-surface border border-brand-surface-dim rounded-[1.5rem] p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <Sun className="h-6 w-6 text-[#e65100] mr-3" />
                    <h3 className="text-lg font-bold text-brand-primary">
                      Sunlight
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {plant.sunlight.map((sun, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[#fff3e0] text-[#e65100] text-sm rounded-lg capitalize font-medium"
                      >
                        {sun}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {plant.watering && (
                <div className="bg-brand-surface border border-brand-surface-dim rounded-[1.5rem] p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <Droplets className="h-6 w-6 text-[#1565c0] mr-3" />
                    <h3 className="text-lg font-bold text-brand-primary">
                      Watering
                    </h3>
                  </div>
                  <p className="text-brand-on-surface-variant capitalize font-medium">
                    {plant.watering}
                  </p>
                </div>
              )}
            </section>

            {/* Additional Characteristics */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(plant.medicinal !== undefined ||
                plant.poisonous_to_humans !== undefined) && (
                <div className="bg-brand-surface border border-brand-surface-dim rounded-[1.5rem] p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <HeartPulse className="h-6 w-6 text-pink-500 mr-3" />
                    <h3 className="text-lg font-bold text-brand-primary">
                      Health & Safety
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {plant.medicinal && (
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-brand-on-surface-variant text-sm">
                          Has medicinal properties
                        </span>
                      </li>
                    )}
                    {plant.poisonous_to_humans && (
                      <li className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                        <span className="text-brand-error text-sm font-medium">
                          Poisonous to humans
                        </span>
                      </li>
                    )}
                    {plant.poisonous_to_pets && (
                      <li className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                        <span className="text-orange-700 text-sm font-medium">
                          Poisonous to pets
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {plant.propagation && (
                <div className="bg-brand-surface border border-brand-surface-dim rounded-[1.5rem] p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <Sprout className="h-6 w-6 text-brand-secondary mr-3" />
                    <h3 className="text-lg font-bold text-brand-primary">
                      Propagation
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {plant.propagation.map((prop, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm rounded-lg capitalize font-medium"
                      >
                        {prop}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-brand-surface border border-brand-surface-dim rounded-[1.5rem] p-8 shadow-ambient sticky top-28">
              <h3 className="text-xl font-bold text-brand-primary mb-6 flex items-center">
                <Activity className="h-5 w-5 mr-2" /> Quick Facts
              </h3>

              <ul className="space-y-6">
                {plant.origin && (
                  <li>
                    <p className="text-sm text-brand-on-surface-variant mb-1 flex items-center">
                      <Globe className="h-4 w-4 mr-1" /> Native Origin
                    </p>
                    <p className="font-medium text-brand-on-surface capitalize">
                      {plant.origin.join(", ")}
                    </p>
                  </li>
                )}
                {plant.type && (
                  <li>
                    <p className="text-sm text-brand-on-surface-variant mb-1">
                      Plant Type
                    </p>
                    <p className="font-medium text-brand-on-surface capitalize">
                      {plant.type}
                    </p>
                  </li>
                )}
                {plant.cycle && (
                  <li>
                    <p className="text-sm text-brand-on-surface-variant mb-1">
                      Life Cycle
                    </p>
                    <p className="font-medium text-brand-on-surface capitalize">
                      {plant.cycle}
                    </p>
                  </li>
                )}
                {plant.growth_rate && (
                  <li>
                    <p className="text-sm text-brand-on-surface-variant mb-1">
                      Growth Rate
                    </p>
                    <p className="font-medium text-brand-on-surface capitalize">
                      {plant.growth_rate}
                    </p>
                  </li>
                )}
                {plant.drought_tolerant !== undefined && (
                  <li>
                    <p className="text-sm text-brand-on-surface-variant mb-1">
                      Drought Tolerant
                    </p>
                    <p className="font-medium text-brand-on-surface">
                      {plant.drought_tolerant ? "Yes" : "No"}
                    </p>
                  </li>
                )}
                {plant.care_level && (
                  <li>
                    <p className="text-sm text-brand-on-surface-variant mb-1">
                      Care Level
                    </p>
                    <p className="font-medium text-brand-on-surface capitalize">
                      {plant.care_level}
                    </p>
                  </li>
                )}
                {plant.maintenance && (
                  <li>
                    <p className="text-sm text-brand-on-surface-variant mb-1">
                      Maintenance
                    </p>
                    <p className="font-medium text-brand-on-surface capitalize">
                      {plant.maintenance}
                    </p>
                  </li>
                )}
                {plant.indoor !== undefined && (
                  <li>
                    <p className="text-sm text-brand-on-surface-variant mb-1">
                      Indoor / Outdoor
                    </p>
                    <p className="font-medium text-brand-on-surface">
                      {plant.indoor ? "Indoor Plant" : "Outdoor Plant"}
                    </p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
